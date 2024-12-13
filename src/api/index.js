import { BASE_CDN_URL } from "../constant";
import { chunkArray, weapiRequest } from "../utils";
import { msgError } from "../utils/modal";

// 获取歌手列表
export const getArtists = () =>
  fetch(`${BASE_CDN_URL}top.json`).then((res) => res.json());

// 获取资源配置
export const getCDNConfig = (artistId) =>
  fetch(`${BASE_CDN_URL}${artistId}.json`).then((res) => res.json());

// 获取歌曲信息
export const getSongInfoList = async (songIds) => {
  // 此处一次最大1000条
  const chunkArr = chunkArray(songIds, 1000);
  const proArr = chunkArr.map(async (chunk) => {
    return weapiRequest("/api/v3/song/detail", {
      data: {
        c: JSON.stringify(chunk.map((item) => ({ id: item }))),
      },
    });
  });
  const allInfo = await Promise.all(proArr);
  return allInfo.flat();
};

// 匹配歌曲信息
export const matchCloudSong = async (song) => {
  // 满足这个情况需要匹配信息
  if (song.cloudSongId != song.id && song.id > 0) {
    const res = await weapiRequest("/api/cloud/user/song/match", {
      data: {
        songId: song.cloudSongId,
        adjustSongId: song.id,
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
export const uploadSong = async (song) => {
  try {
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

    song.cloudId = res.data[0].songId;
    // 2、判断状态，有两种上传方式
    // 2.1 未上传
    if (res.data[0].upload == 1) {
      // 导入
      debugger; // song.artist?s
      const importRes = await weapiRequest("/api/cloud/user/song/import", {
        data: {
          uploadType: 0,
          songs: JSON.stringify([
            {
              songId: song.cloudId,
              bitrate: song.bitrate,
              song: song.filename,
              artist: song.artists,
              album: song.album,
              fileName: song.filename,
            },
          ]),
        },
      });
      if (importRes.code != 200 || importRes.data.successSongs.length < 1) {
        msgError(`歌曲： ${song.name} 上传失败`);
        throw new Error(importRes.message || importRes.msg || "歌曲上传失败");
      }
      song.cloudSongId = importRes.data.successSongs[0].song.songId;
      // 匹配
      await matchCloudSong(song);

      return {
        code: 200,
        dataL: { song },
      };
    }
    // 2.2 已上传
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

      if (tokenRes.code != 200) {
        msgError("获取上传token失败");
        throw new Error(
          tokenRes.message || tokenRes.msg || "获取上传token失败"
        );
      }
      song.resourceId = tokenRes.result.resourceId;
      // 提交文件
      debugger; // song.artist?s    song.name?title
      const uploadRes = await weapiRequest("/api/upload/cloud/info/v2", {
        data: {
          token: tokenRes.result.token,
          objectKey: tokenRes.result.objectKey,
          resourceId: tokenRes.result.resourceId,
          // ...tokenRes.result,
          expireTime: Date.now() + 6e4,
          fileSize: song.size,
          md5: song.md5,
          songid: song.cloudId,
          filename: song.filename,
          song: song.name,
          album: song.album,
          artist: song.artist,
          bitrate: String(song.bitrate || 128),
          resourceId: song.resourceId,
        },
      });
      if (uploadRes.code != 200) {
        msgError(`歌曲： ${song.name} 上传失败`);
      }
      // 发布资源
      const pubRes = await weapiRequest("/api/cloud/pub/v2", {
        data: {
          songid: uploadRes.songId,
        },
      });
      if (pubRes.code != 200) {
        msgError(`歌曲： ${song.name} 发布失败`);
        throw new Error(pubRes.message || pubRes.msg || "歌曲发布失败");
      }
      // 匹配
      await matchCloudSong(song);

      return {
        code: 200,
        data: { song },
      };
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
