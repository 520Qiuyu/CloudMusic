import { BASE_CDN_URL, QUALITY_LEVELS } from "../constant";
import { chunkArray, getAudioMetadata, getFileMD5, sleep } from "../utils";
import { getGUser } from "../utils";
import { msgError } from "../utils/modal";
import { weapiFetch, weapiRequest } from "../utils/request";
import { generateQRCode } from "../utils/qrcode";
import md5 from "md5";
import * as mm from "music-metadata";

// 获取登录二维码KEY
export const getQrKey = () =>
  weapiRequest("/api/login/qrcode/unikey", {
    data: {
      noCheckToken: 1,
      type: 1,
    },
  });

// 获取登录二维码
export const getQrCode = key => {
  const loginUrl = `https://music.163.com/login?codekey=${key}`;
  return generateQRCode(loginUrl);
};

// 获取登录二维码状态
export const getQrStatus = key =>
  weapiFetch("/api/login/qrcode/client/login", {
    data: {
      key,
      type: 1,
    },
    originResponse: true,
  });

// 获取歌手列表
export const getArtists = () => fetch(`${BASE_CDN_URL}top.json`).then(res => res.json());
// 获取歌手列表2
export const getArtists2 = () => fetch(`${BASE_CDN_URL}summary.json`).then(res => res.json());

// 获取资源配置 对应歌手的资源
export const getCDNConfig = artistId =>
  fetch(`${BASE_CDN_URL}${artistId}.json`).then(res => res.json());

// 获取歌曲信息
export const getSongInfoList = async songIds => {
  // 此处一次最大1000条
  const chunkArr = chunkArray(songIds, 1000);
  const proArr = chunkArr.map(async chunk => {
    return weapiRequest("/api/v3/song/detail", {
      data: {
        c: JSON.stringify(chunk.map(item => ({ id: item }))),
      },
    });
  });
  const allInfo = await Promise.all(proArr);
  console.log("allInfo", allInfo);
  return allInfo.flat();
};

// 匹配歌曲信息 将云盘歌曲匹配网易的歌，关联起来
export const matchCloudSong = async (cloudSongId, id) => {
  // 满足这个情况需要匹配信息
  if (cloudSongId != id && id > 0) {
    const res = await weapiRequest("/api/cloud/user/song/match", {
      data: {
        songId: cloudSongId,
        adjustSongId: id,
      },
    });
    if (res.code != 200 || res.data.length < 1) {
      msgError(`歌曲： ${song.name} 匹配失败`);
      throw new Error(res.message || res.msg || "歌曲匹配失败");
    }
    return res;
  }
  return;
};

// 上传歌曲信息
export const uploadSong = async song => {
  try {
    console.log("song", song);
    // 1、检查资源
    let res = await weapiRequest("/api/cloud/upload/check/v2", {
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
      throw new Error(res.message || res.msg || "资源检查失败");
    }
    console.log("res", res);
    const cloudId = res.data[0].songId;
    // 2、判断状态， upload 0:文件可导入,1:文件已在云盘,2:不能导入
    // 2.1 已在云盘 直接通过云盘id导入
    if (res.data[0].upload == 1) {
      // 导入
      const importRes = await weapiRequest("/api/cloud/user/song/import", {
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
      console.log("importRes", importRes);
      if (importRes.code != 200 || importRes.data.successSongs.length < 1) {
        msgError(`歌曲： ${song.name} 上传失败`);
        throw new Error(importRes.message || importRes.msg || "歌曲上传失败");
      }
      const cloudSongId = importRes.data.successSongs[0].song.songId;
      // 匹配歌曲信息
      await matchCloudSong(cloudSongId, song.id);

      return {
        code: 200,
        msg: "歌曲上传成功",
        data: { song },
      };
    }
    // 2.2 可导入
    else {
      // 获取令牌
      const tokenRes = await weapiRequest("/api/nos/token/alloc", {
        data: {
          filename: song.filename,
          length: song.size,
          ext: song.ext,
          md5: song.md5,
          type: "audio",
          bucket: "jd-musicrep-privatecloud-audio-public",
          local: false,
          nos_product: 3,
        },
      });
      console.log("tokenRes", tokenRes);
      if (tokenRes.code != 200) {
        msgError("获取上传token失败");
        throw new Error(tokenRes.message || tokenRes.msg || "获取上传token失败");
      }
      song.resourceId = tokenRes.result.resourceId;
      // 提交文件
      const uploadRes = await weapiRequest("/api/upload/cloud/info/v2", {
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
      console.log("uploadRes", uploadRes);
      if (uploadRes.code != 200) {
        msgError(`歌曲： ${song.name} 上传失败`);
      }
      // 发布资源
      const pubRes = await weapiRequest("/api/cloud/pub/v2", {
        data: {
          songid: uploadRes.songId,
        },
      });
      if (![200, 201].includes(pubRes.code)) {
        msgError(`歌曲： ${song.name} 发布失败`);
        throw new Error(pubRes.message || pubRes.msg || "歌曲发布失败");
      }
      const cloudSongId = pubRes.privateCloud.songId;
      // 匹配歌曲信息
      await matchCloudSong(cloudSongId, song.id);

      return {
        code: 200,
        msg: "歌曲上传成功",
        data: { song },
      };
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// 获取云盘数据
export const getCloudData = (limit = 200, offset = 0) =>
  weapiRequest("/api/v1/cloud/get", {
    data: {
      limit,
      offset,
    },
  });

// 删除云盘歌曲
export const deleteCloudSong = songIds =>
  weapiRequest("/api/cloud/del", {
    data: {
      songIds,
    },
  });

// 获取歌单列表
export const getPlaylistList = (uid = getGUser().userId, limit = 1001, offset = 0) =>
  weapiRequest("/api/user/playlist", {
    data: {
      limit,
      offset,
      uid,
    },
  });

// 新建歌单
export const createPlaylist = name =>
  weapiRequest("/api/playlist/create", {
    data: {
      name,
    },
  });

// 删除歌单
export const deletePlaylist = pid =>
  weapiRequest("/api/playlist/delete", {
    data: {
      pid,
    },
  });

// 添加进入歌单
export const addSongToPlaylist = (pid, trackIds) =>
  weapiRequest("/api/playlist/manipulate/tracks", {
    data: {
      pid, // 歌单id
      trackIds, // 歌曲 id 数组
      op: "add", // 操作类型
    },
  });

// 获取专辑歌曲列表
export const getAlbumSongList = id =>
  weapiRequest(`/api/v1/album/${id}`, {
    data: {},
  });

// 获取歌曲url
export const getSongUrl = (ids, encodeType = "flac", level = QUALITY_LEVELS.无损) =>
  weapiRequest("/api/song/enhance/player/url/v1", {
    data: { ids, level, encodeType },
  });

// 获取歌手热门歌曲
export const getArtistTopSongList = id =>
  weapiRequest("/api/artist/top/song", {
    data: {
      id,
      limit: 1000,
      offset: 0,
    },
  });

// 获取歌手全部歌曲 失效
export const getArtistAllSongList = async id => {
  try {
    let more = true;
    const songs = [];
    let offset = 0;
    while (more) {
      const res = await weapiRequest("/api/v1/artist/songs", {
        data: {
          id,
          limit: 200,
          private_cloud: "true",
          work_type: 1,
          order: "hot", //hot,time
          offset,
        },
      });
      if (res.code != 200) {
        throw new Error(res.message || res.msg || "获取歌手全部歌曲失败");
      }
      songs.push(...res.songs);
      more = res.more;
      offset += 200;
    }
    return {
      code: 200,
      msg: "获取歌手全部歌曲成功",
      songs: songs,
    };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// 获取歌手专辑
export const getArtistAlbumList = async (id, limit = 1000, offset = 0) => {
  const res = await fetch(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`);
  console.log("res", res);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const albumList = Array.from(doc.querySelectorAll("#m-song-module li"));
  return albumList.map(item => {
    const cover = item.querySelector("img").getAttribute("src");
    const id = item.querySelector('a[title="播放"]').getAttribute("data-res-id");
    const name = item.querySelector("p.dec a.tit").textContent;
    const time = item.querySelector("span.s-fc3").textContent;
    return { cover, id, name, time };
  });
};

/**
 * @description: 上传本地歌曲
 * @param {File} file
 */
export const uploadLocalSong = async file => {
  try {
    const ext = file.name.split(".").pop() || "mp3";
    const fileMd5 = await getFileMD5(file);
    const bitrate = 999000;
    const filename = file.name
      .replace("." + ext, "")
      .replace(/\s/g, "")
      .replace(/\./g, "_");

    // 1、首选检查文件
    const checkRes = await weapiRequest("/api/cloud/upload/check", {
      data: {
        ext: "",
        bitrate: String(bitrate),
        md5: fileMd5,
        length: file.size,
        songId: "0",
        version: 1,
      },
    });
    console.log("checkRes", checkRes);
    if (checkRes.code != 200) {
      msgError("文件检查失败");
      throw new Error(checkRes.message || checkRes.msg || "文件检查失败");
    }
    const { needUpload, songId } = checkRes;

    // 2、申请上传token
    const tokenRes = await weapiRequest("/api/nos/token/alloc", {
      data: {
        bucket: "",
        ext,
        filename,
        local: false,
        nos_product: 3,
        type: "audio",
        md5: fileMd5,
      },
    });
    console.log("tokenRes", tokenRes);
    if (tokenRes.code != 200) {
      msgError("获取上传token失败");
      throw new Error(tokenRes.message || tokenRes.msg || "获取上传token失败");
    }
    const { bucket, docId, objectKey, outerUrl, resourceId, token } = tokenRes.result;

    // 3、获取上传信息
    const { album, artist, artists, title } = await getAudioMetadata(file);
    const uploadInfoRes = await weapiRequest("/api/upload/cloud/info/v2", {
      data: {
        md5: fileMd5,
        songid: songId,
        filename,
        song: title || filename,
        album: album || "未知专辑",
        artist: artist || artists.join(",") || "未知歌手",
        bitrate: String(bitrate),
        resourceId,
      },
    });
    console.log("uploadInfoRes", uploadInfoRes);
    if (uploadInfoRes.code != 200) {
      msgError("获取上传信息失败");
      throw new Error(uploadInfoRes.message || uploadInfoRes.msg || "获取上传信息失败");
    }

    // 4、上传文件
    // 发布资源
    const pubRes = await weapiRequest("/api/cloud/pub/v2", {
      data: {
        songid: uploadInfoRes.songId,
      },
    });
    console.log("pubRes", pubRes);
    if (![200, 201].includes(pubRes.code)) {
      msgError(`歌曲： ${file.name} 发布失败`);
      throw new Error(pubRes.message || pubRes.msg || "歌曲发布失败");
    }
    const { songName, bitrate: realBitrate, fileSize } = pubRes.privateCloud;
    return {
      artist,
      artists,
      album,
      id: uploadInfoRes.songId,
      size: fileSize,
      md5: fileMd5,
      name: songName,
      ext,
      bitrate: realBitrate,
    };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// 搜索歌手信息 传入关键词
export const searchArtist = keyword =>
  weapiRequest("/api/rep/ugc/artist/search", {
    data: {
      keyword,
      limit: 40,
    },
  });

// 本地歌曲匹配网易云歌曲信息
export const matchLocalSong = async files => {
  const songs = files.map(async file => {
    const { title, album, artist, duration } = await getAudioMetadata(file);
    const md5 = await getFileMD5(file);
    return {
      title,
      album,
      artist,
      duration,
      persistId: md5,
    };
  });

  return weapiRequest("/api/search/match/new", {
    data: songs,
  });
};

// 获取歌单所有数据
export const getPlaylistAllData = async id => {
  try {
    const detailRes = await weapiRequest("/api/v6/playlist/detail", {
      data: {
        id,
        offset: 0,
        total: true,
      },
    });
    console.log("detailRes", detailRes);
    const trackIds = detailRes.playlist.trackIds.map(item => item.id);
    const res = await getSongInfoList(trackIds);
    if (res[0]?.code != 200) {
      msgError(res[0]?.msg || "获取歌单数据失败");
      throw new Error(res[0]?.msg || "获取歌单数据失败");
    }
    return res[0].songs;
  } catch (error) {
    throw error;
  }
};
