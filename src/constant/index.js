// 音质等级选项
export const QUALITY_LEVELS = {
  jymaster: "超清母带",
  dolby: "杜比全景声",
  sky: "沉浸环绕声",
  jyeffect: "高清环绕声",
  hires: "Hi-Res",
  lossless: "无损",
  exhigh: "极高",
  higher: "较高",
  standard: "标准",
  超清母带: "jymaster",
  杜比全景声: "dolby",
  沉浸环绕声: "sky",
  高清环绕声: "jyeffect",
  "Hi-Res": "hires",
  无损: "lossless",
  极高: "exhigh",
  较高: "higher",
  标准: "standard",
};

// 音质权重(用于排序)
export const QUALITY_WEIGHTS = {
  jymaster: 9,
  dolby: 8,
  sky: 7,
  jyeffect: 6,
  hires: 5,
  lossless: 4,
  exhigh: 3,
  higher: 2,
  standard: 1,
  none: 0,
};

// API相关常量
export const UPLOAD_CHUNK_SIZE = 8 * 1024 * 1024; // 8MB
export const PLAY_API_LIMIT = 1000;
export const CHECK_API_LIMIT = 100;
export const IMPORT_API_LIMIT = 10;

// 其他常量
export const BASE_CDN_URL =
  "https://fastly.jsdelivr.net/gh/520Qiuyu/cdn@latest/artist/";
