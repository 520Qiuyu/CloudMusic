import { QUALITY_LEVELS } from '@/constant';
import { getAudioMetadata, getFileMD5, promiseLimit } from '@/utils';
import { msgError } from '@/utils/modal';
import { weapiRequest } from '@/utils/request';
import { getSongInfoList, getSongUrl } from './song';
import { getQualityTags } from '@/utils/music';
import { defaultConfig } from '@/config';
import { writeFlacTags } from '@/libs/flac';

const { uploadConcurrency } = defaultConfig.function;
const { quality } = defaultConfig.download;
const BUCKET = 'jd-musicrep-privatecloud-audio-public';

/**
 * 上传音频文件到 NOS
 * @param {object} params 配置项
 * @param {File} params.file 文件对象
 * @param {string} params.bucket 存储桶名称
 * @param {string} params.objectKey 文件 key
 * @param {string} params.token nos token
 * @param {string} params.fileMd5 文件 MD5
 * @param {string} params.contentType 文件类型
 * @returns {Promise<object>} 上传结果
 * @example
 * const res = await uploadAudioToNos({
 *   file,
 *   bucket: 'jd-musicrep-privatecloud-audio-public',
 *   objectKey: 'path%2Ffile.mp3',
 *   token: 'token',
 *   fileMd5: 'md5',
 *   contentType: 'audio/mpeg',
 * });
 */
const uploadAudioToNos = async ({
  file,
  bucket,
  objectKey,
  token,
  fileMd5,
  contentType,
}) => {
  const lbsUrl = `https://wanproxy.127.net/lbs?version=1.0&bucketname=${bucket}`;
  const lbs = await (await fetch(lbsUrl)).json();
  const safeObjectKey = objectKey.replace('/', '%2F');
  const uploadUrl =
    `${lbs.upload[0]}/${bucket}/${safeObjectKey}?offset=0&complete=true&version=1.0`.replace(
      'http://',
      'https://',
    );
  const response = await fetch(uploadUrl, {
    method: 'post',
    headers: {
      'x-nos-token': token,
      'Content-MD5': fileMd5,
      'Content-Type': contentType,
    },
    body: file,
  });
  let result = {};
  try {
    result = await response.json();
  } catch (error) {
    console.log('uploadAudioToNos parse error', error);
  }
  if (!response.ok) {
    msgError('上传失败：文件未通过 NOS 校验');
    throw new Error(result?.message || '上传失败：文件未通过 NOS 校验');
  }
  return result;
};

/**
 * 匹配歌曲信息 将云盘歌曲匹配网易的歌，关联起来
 * @param {number} cloudSongId 云盘歌曲ID
 * @param {number} id 网易云歌曲ID
 * @param {object} song 歌曲信息
 * @returns {Promise} 返回匹配结果
 */
export const matchCloudSong = async (cloudSongId, id, song) => {
  // 满足这个情况需要匹配信息
  if (cloudSongId != id /* && id > 0 */) {
    const res = await weapiRequest('/api/cloud/user/song/match', {
      data: {
        songId: cloudSongId,
        adjustSongId: id,
      },
    });
    console.log('res', res);
    if (res.code != 200 || res.data.length < 1) {
      msgError(`歌曲"${song?.name}" 匹配失败：${res.message || res.msg}`);
      throw new Error(res.message || res.msg || '歌曲匹配失败');
    }
    return res;
  }
  return {
    code: 200,
    msg: '歌曲匹配成功',
    data: song,
  };
};

/**
 * 上传歌曲信息
 * @param {object} song 歌曲信息对象
 * @param {string} song.md5 文件MD5
 * @param {number} song.id 歌曲ID
 * @param {number} song.bitrate 比特率
 * @param {number} song.size 文件大小
 * @param {string} song.name 歌曲名称
 * @param {string} song.filename 文件名
 * @param {string} song.artists 艺术家
 * @param {string} song.album 专辑
 * @param {string} song.ext 文件扩展名
 * @returns {Promise} 返回上传结果
 * @example
 * const result = await uploadSong({
 *   md5: 'xxx',
 *   id: 123456,
 *   bitrate: 320000,
 *   size: 5000000,
 *   name: '歌曲名',
 *   filename: 'song.mp3',
 *   artists: '歌手',
 *   album: '专辑',
 *   ext: 'mp3'
 * });
 */
export const uploadSong = async (song) => {
  try {
    console.log('song', song);
    // 1、检查资源
    let res = await weapiRequest('/api/cloud/upload/check/v2', {
      data: {
        uploadType: 0,
        songs: JSON.stringify([
          {
            md5: song.md5,
            songId: song.id,
            bitrate: song.bitrate,
            fileSize: song.size,
          },
        ]),
      },
    });
    if (res.code != 200 || res.data.length < 1) {
      msgError(`资源检查失败,请检查歌曲：${song.name}是否已存在！`);
      throw new Error(res.message || res.msg || '资源检查失败');
    }
    console.log('checkRes', res);
    const cloudId = res.data[0].songId;
    // 2、判断状态， upload 0:文件可导入,1:文件已在云盘,2:不能导入
    // 2.1 已在云盘 直接通过云盘id导入
    if (res.data[0].upload == 1) {
      // 导入
      const importRes = await weapiRequest('/api/cloud/user/song/import', {
        data: {
          uploadType: 0,
          songs: JSON.stringify([
            {
              songId: cloudId,
              bitrate: song.bitrate,
              song: song.filename,
              artist: song.artists,
              album: song.album,
              fileName: song.filename,
            },
          ]),
        },
      });
      console.log('importRes', importRes);
      if (importRes.code != 200 || importRes.data.successSongs.length < 1) {
        msgError(`歌曲： ${song.name} 上传失败`);
        throw new Error(importRes.message || importRes.msg || '歌曲上传失败');
      }
      const cloudSongId = importRes.data.successSongs[0].song.songId;
      // 匹配歌曲信息
      await matchCloudSong(cloudSongId, song.id, song);

      return {
        code: 200,
        msg: '歌曲上传成功',
        data: { song },
      };
    }
    // 2.2 可导入
    else {
      // 获取令牌
      const tokenRes = await weapiRequest('/api/nos/token/alloc', {
        data: {
          filename: song.filename,
          length: song.size,
          ext: song.ext,
          md5: song.md5,
          type: 'audio',
          bucket: BUCKET,
          local: false,
          nos_product: 3,
        },
      });
      console.log('tokenRes', tokenRes);
      if (tokenRes.code != 200) {
        msgError('获取上传token失败');
        throw new Error(
          tokenRes.message || tokenRes.msg || '获取上传token失败',
        );
      }
      song.resourceId = tokenRes.result.resourceId;
      // 提交文件
      const uploadRes = await weapiRequest('/api/upload/cloud/info/v2', {
        data: {
          token: tokenRes.result.token,
          objectKey: tokenRes.result.objectKey,
          resourceId: tokenRes.result.resourceId,
          // ...tokenRes.result,
          expireTime: Date.now() + 6e4,
          fileSize: song.size,
          md5: song.md5,
          songid: cloudId,
          filename: `${song.filename}${song.ext ? '.' + song.ext : ''}`,
          song: song.name,
          album: song.album,
          artist: song.artists,
          bitrate: String(song.bitrate || 128),
          resourceId: song.resourceId,
        },
      });
      console.log('uploadRes', uploadRes);
      if (uploadRes.code != 200) {
        msgError(`歌曲： ${song.name} 上传失败`);
      }
      // 发布资源
      const pubRes = await weapiRequest('/api/cloud/pub/v2', {
        data: {
          songid: uploadRes.songId,
        },
      });
      if (![200, 201].includes(pubRes.code)) {
        msgError(`歌曲： ${song.name} 发布失败`);
        throw new Error(pubRes.message || pubRes.msg || '歌曲发布失败');
      }
      const cloudSongId = pubRes.privateCloud.songId;
      // 匹配歌曲信息
      await matchCloudSong(cloudSongId, song.id, song);

      return {
        code: 200,
        msg: '歌曲上传成功',
        data: { song },
      };
    }
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

/**
 * 获取云盘数据
 * @param {number} limit 每页数量，默认200
 * @param {number} offset 偏移量，默认0
 * @returns {Promise} 返回云盘数据
 * @example
 * const cloudData = await getCloudData(200, 0);
 */
export const getCloudData = (limit = 200, offset = 0) =>
  weapiRequest('/api/v1/cloud/get', {
    data: {
      limit,
      offset,
    },
  });

/**
 * 删除云盘歌曲
 * @param {number[]} songIds 歌曲ID数组
 * @returns {Promise} 返回删除结果
 * @example
 * await deleteCloudSong([123456, 789012]);
 */
export const deleteCloudSong = (songIds) =>
  weapiRequest('/api/cloud/del', {
    data: {
      songIds,
    },
  });

/**
 * 上传本地歌曲
 * @param {File} file 文件对象
 * @param {object} options 选项
 * @param {number} options.defaultBitrate 默认比特率，默认999000
 * @param {string} options.defaultAlbum 默认专辑，默认'未知专辑'
 * @param {string} options.defaultArtist 默认歌手，默认'未知歌手'
 * @param {string} options.defaultTitle 默认歌曲名，默认'未知歌曲'
 * @param {string[]} options.defaultArtists 默认歌手列表，默认[]
 * @returns {Promise} 返回上传结果
 * @example
 * const result = await uploadLocalSong(file);
 */
export const uploadLocalSong = async (file, options = {}) => {
  const {
    defaultBitrate = 999000,
    defaultAlbum,
    defaultArtist,
    defaultTitle,
    defaultArtists = [],
    matchId,
  } = options || {};
  let defaultResult = {};
  try {
    const ext = file.name?.split('.').pop() || 'mp3';
    const fileMd5 = await getFileMD5(file);
    const bitrate = defaultBitrate;
    const filename = file.name
      .replace('.' + ext, '')
      .replace(/\s/g, '')
      .replace(/\./g, '_');
    const contentType = file.type || 'audio/mpeg';
    debugger;

    // 1、首选检查文件
    const checkRes = await weapiRequest('/api/cloud/upload/check', {
      data: {
        ext,
        bitrate: String(bitrate),
        md5: fileMd5,
        length: file.size,
        songId: '0',
        version: 1,
      },
    });
    console.log('checkRes', checkRes);
    if (checkRes.code != 200) {
      msgError('文件检查失败：' + checkRes.message || checkRes.msg || '');
      throw new Error(checkRes.message || checkRes.msg || '文件检查失败');
    }
    const { needUpload, songId } = checkRes;

    // 2.1、 云盘没有该文件，需要上传文件
    if (needUpload) {
      const uploadTokenRes = await weapiRequest('/api/nos/token/alloc', {
        data: {
          bucket: BUCKET,
          ext,
          filename,
          local: false,
          nos_product: 3,
          type: 'audio',
          md5: fileMd5,
        },
      });
      if (uploadTokenRes.code !== 200) {
        msgError('上传授权失败');
        throw new Error(uploadTokenRes.message || '上传授权失败');
      }
      console.log('uploadTokenRes', uploadTokenRes);
      await uploadAudioToNos({
        file,
        bucket: BUCKET,
        objectKey: uploadTokenRes.result.objectKey,
        token: uploadTokenRes.result.token,
        fileMd5,
        contentType,
      });
    }

    // 2、申请上传token
    const tokenRes = await weapiRequest('/api/nos/token/alloc', {
      data: {
        bucket: '',
        ext,
        filename,
        local: false,
        nos_product: 3,
        type: 'audio',
        md5: fileMd5,
      },
    });
    console.log('tokenRes', tokenRes);
    if (tokenRes.code != 200) {
      msgError('获取上传token失败');
      throw new Error(tokenRes.message || tokenRes.msg || '获取上传token失败');
    }
    const { bucket, docId, objectKey, outerUrl, resourceId, token } =
      tokenRes.result;

    // 3、获取上传信息
    const {
      album = defaultAlbum,
      artist = defaultArtist,
      artists = defaultArtists,
      title = defaultTitle,
    } = await getAudioMetadata(file);
    defaultResult = {
      ...defaultResult,
      artist,
      artists,
      album,
      md5: fileMd5,
      ext,
      bitrate,
    };
    const uploadInfoRes = await weapiRequest('/api/upload/cloud/info/v2', {
      data: {
        md5: fileMd5,
        songid: songId,
        filename: file.name,
        song: title || filename,
        album: album || '未知专辑',
        artist: artist || artists.join(',') || '未知歌手',
        bitrate: String(bitrate),
        resourceId,
      },
    });
    console.log('uploadInfoRes', uploadInfoRes);
    defaultResult = {
      ...defaultResult,
      id: uploadInfoRes.songId,
    };
    if (uploadInfoRes.code != 200) {
      msgError('获取上传信息失败');
      throw new Error(
        uploadInfoRes.message || uploadInfoRes.msg || '获取上传信息失败',
      );
    }

    // 4、上传文件
    // 发布资源
    const pubRes = await weapiRequest('/api/cloud/pub/v2', {
      data: {
        songid: uploadInfoRes.songId,
      },
    });
    console.log('pubRes', pubRes);
    if (![200, 201].includes(pubRes.code)) {
      msgError(`歌曲： ${file.name} 发布失败`);
      throw new Error(pubRes.message || pubRes.msg || '歌曲发布失败');
    }
    const { songName, bitrate: realBitrate, fileSize } = pubRes.privateCloud;
    defaultResult = {
      ...defaultResult,
      name: songName,
      size: fileSize,
      bitrate: realBitrate,
    };

    // 5、匹配歌曲信息
    if (matchId) {
      try {
        console.log(`开始匹配歌曲: ${songName}`, defaultResult);
        const res = await matchCloudSong(
          pubRes.privateCloud.songId,
          matchId,
          defaultResult,
        );
        if (res.code != 200) {
          msgError('歌曲匹配失败');
        }
        console.log(`歌曲匹配成功: ${songName}`, defaultResult);
      } catch (error) {
        console.log('error', error);
      }
    }

    return defaultResult;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

/**
 * 网易云音乐转存云盘
 * @param {number[]} songIds 网易云音乐歌曲ID数组
 * @param {object} options 选项
 * @param {number} options.level 音质等级，默认无损
 * @param {number} options.concurrent 并发数量，默认6
 * @param {function} options.onChange 上传进度回调
 * @returns {Promise} 返回转存结果
 * @example
 * const result = await neteaseMusicToCloud([123456, 789012]);
 */
export const neteaseMusicToCloud = async (songIds, options = {}) => {
  const {
    level = QUALITY_LEVELS.无损,
    concurrent = uploadConcurrency,
    onStart,
    onChange,
    onComplete,
  } = options || {};
  try {
    // 1、获取歌曲信息
    const songInfoRes = await getSongInfoList(songIds);
    if (songInfoRes.code != 200) {
      msgError('获取歌曲信息失败');
      throw new Error(
        songInfoRes.message || songInfoRes.msg || '获取歌曲信息失败',
      );
    }
    const allPrivileges = songInfoRes.privileges;
    const allSongs = songInfoRes.songs;
    const songsMap = Object.fromEntries(
      allSongs.map((song) => [song.id, song]),
    );
    const songs = allPrivileges
      .filter((privilege) => !privilege.cs)
      .map((privilege) => songsMap[privilege.id]);
    const existSongs = allPrivileges
      .filter((privilege) => privilege.cs)
      .map((privilege) => songsMap[privilege.id]);
    console.log(
      `获取歌曲信息, 共${allSongs.length}首，待上传${songs.length}首，已上传${existSongs.length}首`,
      allSongs,
      songs,
      existSongs,
    );
    onStart?.({
      allSongs,
      allPrivileges,
      existSongs,
      songs,
    });

    // 2、获取歌曲链接
    const urls = await Promise.all(
      songs.map(async (song) => {
        const qualityTags = getQualityTags(song);
        console.log('qualityTags', qualityTags);
        const hasTheLevel = qualityTags.some((tag) => tag.value === level);
        if (!hasTheLevel) {
          msgError(
            `歌曲： ${song.name} 音质等级不支持: ${level}, 当前音质等级: ${qualityTags.map((tag) => tag.label).join(',')},已降至${qualityTags[0]?.label}`,
          );
        }
        const res = await getSongUrl([song.id], {
          level: hasTheLevel ? level : qualityTags[0]?.value,
        });
        if (res.code != 200) {
          msgError('获取歌曲链接失败');
          throw new Error(res.message || res.msg || '获取歌曲链接失败');
        }
        const url = res.data[0].url;
        song.url = url;
        return url;
      }),
    );
    console.log(`获取歌曲链接, 共${urls.length}首`, urls);

    // 3、上传歌曲
    const success = [];
    const failed = [];
    const tasks = songs.map((song, index) => async () => {
      try {
        // 3.1 检查歌曲链接
        if (!song.url) throw new Error(`歌曲链接不存在: ${song.name}`);
        /** 获取文件后缀 */
        const finalExt = song.url.split('?')[0].split('.').pop();

        // 3.2 获取文件对象
        const file = await fetch(song.url.replace('http://', 'https://'));
        const blob = await file.blob();
        let fileObj = new File([blob], song.name, { type: song.type });
        const songInfo = {
          album: song.al?.name,
          artist: song.ar?.map((ar) => ar.name).join(','),
          title: song.name,
          artists: song.ar?.map((ar) => ar.name),
        };
        // 内嵌歌曲信息
        switch (finalExt) {
          case 'flac':
            const fileBlob = await writeFlacTags(fileObj, [
              { tag: 'title', value: songInfo.title },
              { tag: 'artist', value: songInfo.artist },
              { tag: 'album', value: songInfo.album },
            ]);
            fileObj = new File([fileBlob], `${songInfo.title}.flac`, {
              type: 'audio/flac',
            });
            break;
          default:
            console.log('当前格式不支持内嵌信息');
            break;
        }

        // 3.3 上传歌曲
        const res = await uploadLocalSong(fileObj, {
          defaultAlbum: songInfo.album,
          defaultArtist: songInfo.artist,
          defaultTitle: songInfo.title,
          defaultArtists: songInfo.artists,
          matchId: song.id,
        });

        // 3.4 上传完成
        success.push(song);
        console.log(
          `第${index + 1}首歌曲上传完成: ${song.name} 共${songs.length}首, 已上传${success.length}首`,
          songInfo,
          res,
        );
        onChange?.({
          current: index + 1,
          total: songs.length,
          errorCount: failed.length,
          type: 'success',
          successCount: success.length,
          index,
          song,
        });
        return res;
      } catch (error) {
        // 3.5 上传失败
        failed.push(song);
        console.log('error', error, song);
        onChange?.({
          current: index + 1,
          total: songs.length,
          type: 'failed',
          successCount: success.length,
          errorCount: failed.length,
          index,
          song,
        });
      }
    });
    const results = await promiseLimit(tasks, concurrent);
    console.log(
      `上传完成, 共${songs.length}首, 已上传${success.length}首, 上传失败结果: ${failed.length}首`,
      results,
    );
    onComplete?.({
      total: songs.length,
      successCount: success.length,
      errorCount: failed.length,
      success,
      failed,
      results,
    });
    return results;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};
