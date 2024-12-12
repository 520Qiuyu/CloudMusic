import { BASE_CDN_URL } from "../constant";
import { chunkArray, weapiRequest } from "../utils";

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
    return new Promise((resolve, reject) => {
      weapiRequest("/api/v3/song/detail", {
        data: {
          c: JSON.stringify(chunk.map((item) => ({ id: item }))),
        },
        onload: resolve,
        onerror: reject,
      });
    });
  });
  const allInfo = await Promise.all(proArr);
  return allInfo.flat();
};

// 上传歌曲信息
export const uploadSong = async (song) => {
  return new Promise((resolve, reject) => {
    weapiRequest("/api/cloud/upload/check/v2", {
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
      onload: resolve,
      onerror: reject,
    });
  });
};
