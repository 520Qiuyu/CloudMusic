import { QUALITY_LEVELS } from '../constant';
import { chunkArray } from '../utils';
import { weapiRequest } from '../utils/request';

/**
 * 获取歌曲信息
 * @param {number[]} songIds 歌曲ID数组
 * @returns {Promise} 返回歌曲信息列表
 * @example
 * const songs = await getSongInfoList([123456, 789012]);
 */
export const getSongInfoList = async (songIds) => {
  // 此处一次最大1000条
  const chunkArr = chunkArray(songIds, 1000);
  const proArr = chunkArr.map(async (chunk) => {
    return weapiRequest('/api/v3/song/detail', {
      data: {
        c: JSON.stringify(chunk.map((item) => ({ id: item }))),
      },
    });
  });
  const allInfo = await Promise.all(proArr);
  console.log('allInfo', allInfo);
  return allInfo.flat();
};

/**
 * 获取歌曲url
 * @param {number[]} ids 歌曲ID数组
 * @param {object} options 选项
 * @param {string} options.encodeType 编码类型，默认'flac'
 * @param {string} options.level 音质等级，默认QUALITY_LEVELS.无损
 * @returns {Promise} 返回歌曲URL
 * @example
 * const urls = await getSongUrl([123456], { level: 'standard' });
 */
export const getSongUrl = (ids, options) => {
  const { encodeType = 'flac', level = QUALITY_LEVELS.无损 } = options || {};
  return weapiRequest('/api/song/enhance/player/url/v1', {
    data: { ids: JSON.stringify(ids), level, encodeType },
  });
};

/**
 * 获取歌曲url旧版
 * @param {number[]} ids 歌曲ID数组
 * @param {object} options 选项
 * @param {number} options.br 比特率，默认999000
 * @returns {Promise} 返回歌曲URL
 * @example
 * const urls = await getSongUrlOld([123456], { br: 320000 });
 */
export const getSongUrlOld = (ids, options) => {
  const { br = 999000 } = options || {};
  return weapiRequest('/api/song/enhance/player/url', {
    data: { ids: JSON.stringify(ids), br },
  });
};

/**
 * 获取歌曲歌词
 * @param {number} id 歌曲ID
 * @returns {Promise} 返回歌曲歌词
 * @example
 * const lyric = await getSongLyric(123456);
 */
export const getSongLyric = async (id) => {
  return weapiRequest('/api/song/lyric', {
    data: {
      id,
      tv: -1,
      lv: -1,
      rv: -1,
      kv: -1,
      _nmclfl: 1,
    },
  });
};

/**
 * 获取歌曲动态封面
 * @param {number} songId 歌曲ID
 * @returns {Promise} 返回动态封面信息
 * @example
 * const cover = await getSongDynamicCover(123456);
 */
export const getSongDynamicCover = async (songId) => {
  return weapiRequest('/api/songplay/dynamic-cover', {
    data: {
      songId,
    },
  });
};

