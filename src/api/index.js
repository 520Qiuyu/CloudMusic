import { BASE_CDN_URL } from "../constant";

// 获取歌手列表
export const getArtists = () =>
  fetch(`${BASE_CDN_URL}top.json`).then((res) => res.json());
