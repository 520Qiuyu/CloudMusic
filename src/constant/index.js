// 音质等级选项
export const QUALITY_LEVELS = {
  jymaster: '超清母带',
  dolby: '杜比全景声',
  sky: '沉浸环绕声',
  jyeffect: '高清环绕声',
  hires: 'Hi-Res',
  lossless: '无损',
  exhigh: '极高',
  higher: '较高',
  standard: '标准',
  超清母带: 'jymaster',
  杜比全景声: 'dolby',
  沉浸环绕声: 'sky',
  高清环绕声: 'jyeffect',
  'Hi-Res': 'hires',
  无损: 'lossless',
  极高: 'exhigh',
  较高: 'higher',
  标准: 'standard',
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

// 搜索类型
export const SEARCH_TYPES = {
  单曲: '1',
  专辑: '10',
  歌手: '100',
  歌单: '1000',
  用户: '1002',
  MV: '1004',
  歌词: '1006',
  电台: '1009',
  视频: '1014',
  1: '单曲',
  10: '专辑',
  100: '歌手',
  1000: '歌单',
  1002: '用户',
  1004: 'MV',
  1006: '歌词',
  1009: '电台',
  1014: '视频',
};

// FLAC标签
export const FLAC_TAGS = {
  title: '标题',
  artist: '艺术家',
  album: '专辑',
  year: '年份',
  genre: '流派',
  comment: '评论',
  track: '音轨',
  disc: '碟片',
  composer: '作曲',
  lyricist: '作词',
  lyrics: '歌词',
};

// API相关常量
export const UPLOAD_CHUNK_SIZE = 8 * 1024 * 1024; // 8MB
export const PLAY_API_LIMIT = 1000;
export const CHECK_API_LIMIT = 100;
export const IMPORT_API_LIMIT = 10;

// 其他常量
export const BASE_CDN_URL =
  'https://fastly.jsdelivr.net/gh/520Qiuyu/cdn@latest/artist/';

/** 歌曲排序规则 升序 */
export const SONG_SORT_RULES = [
  {
    name: '按照专辑名称排序，演唱会靠后',
    value: '1',
    rule: (songA, songB) => {
      if (
        songA.al?.name &&
        songB.al?.name &&
        songA.al?.name !== songB.al?.name
      ) {
        return songA.al?.name?.localeCompare(songB.al?.name);
      }
      // 如果有专辑id且不相同，按照专辑id排序
      else if (songA.al?.id && songB.al?.id && songA.al?.id !== songB.al?.id) {
        return songA.al?.id - songB.al?.id;
      } else if (songA.name && songB.name && songA.name !== songB.name) {
        return songA.name?.localeCompare(songB?.name);
      } else if (songA.id && songB.id && songA.id !== songB.id) {
        return songA.id - songB.id;
      }
    },
  },
  {
    name: '按照歌手名称排序',
    value: '2',
    rule: (songA, songB) => {
      if (songA.ar?.name === songB.ar?.name) {
        return songA.id - songB.id;
      }
      return songA.ar?.name.localeCompare(songB.ar?.name);
    },
  },
  {
    name: '按照歌曲名称排序',
    value: '3',
    rule: (songA, songB) => {
      return songA.name?.localeCompare(songB?.name);
    },
  },
];
