import { msgError } from '../utils/modal';
import { weapiRequest } from '../utils/request';
import { getAudioMetadata, getFileMD5 } from '../utils';

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
    if (res.code != 200 || res.data.length < 1) {
      msgError(`歌曲"${song?.name}" 匹配失败：${res.message || res.msg}`);
      throw new Error(res.message || res.msg || '歌曲匹配失败');
    }
    return res;
  }
  return;
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
    console.log('res', res);
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
          bucket: 'jd-musicrep-privatecloud-audio-public',
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
          filename: song.filename,
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
 * @returns {Promise} 返回上传结果
 * @example
 * const result = await uploadLocalSong(file);
 */
export const uploadLocalSong = async (file) => {
  let defaultResult = {};
  try {
    const ext = file.name.split('.').pop() || 'mp3';
    const fileMd5 = await getFileMD5(file);
    const bitrate = 999000;
    const filename = file.name
      .replace('.' + ext, '')
      .replace(/\s/g, '')
      .replace(/\./g, '_');

    // 1、首选检查文件
    const checkRes = await weapiRequest('/api/cloud/upload/check', {
      data: {
        ext: '',
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
      const bucket = 'jd-musicrep-privatecloud-audio-public';
      const tokenRes = await weapiRequest('/api/nos/token/alloc', {
        data: {
          bucket,
          ext,
          filename,
          local: false,
          nos_product: 3,
          type: 'audio',
          md5: fileMd5,
        },
      });
      // 上传
      const objectKey = tokenRes.body.result.objectKey.replace('/', '%2F');
      const lbs = await (
        await fetch(
          `https://wanproxy.127.net/lbs?version=1.0&bucketname=${bucket}`,
        )
      ).json();
      const formData = new FormData();
      formData.append('songFile', file);
      await fetch(
        `${lbs.upload[0]}/${bucket}/${objectKey}?offset=0&complete=true&version=1.0`,
        {
          method: 'post',
          headers: {
            'x-nos-token': tokenRes.body.result.token,
            'Content-MD5': fileMd5,
            'Content-Type': 'audio/mpeg',
            'Content-Length': String(file.size),
          },
          data: formData,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );
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
    const { album, artist, artists, title } = await getAudioMetadata(file);
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
        filename,
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
    return defaultResult;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

