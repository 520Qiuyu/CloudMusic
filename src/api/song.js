import { downloadAsJson } from '@/utils/download';
import { QUALITY_LEVELS } from '../constant';
import { chunkArray, promiseLimit } from '../utils';
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
    const res = await weapiRequest('/api/v3/song/detail', {
      data: {
        c: JSON.stringify(chunk.map((item) => ({ id: item }))),
      },
    });
    console.log('res', res);
    if (res.code === 200) {
      return res;
    }
    throw new Error(res.message || res.msg || '获取歌曲信息失败');
  });
  const allInfo = await Promise.all(proArr);
  return {
    code: 200,
    privileges: allInfo.map((item) => item.privileges).flat(),
    songs: allInfo.map((item) => item.songs).flat(),
  };
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

/**
 * 获取歌曲评论
 * @param {number} id 歌曲ID
 * @param {object} options 选项
 * @param {number} options.limit 每页评论数，默认20
 * @param {number} options.offset 偏移量，默认0
 * @param {number} options.before 上一分页最后一项的time，用于分页
 * @returns {Promise} 返回评论数据
 * @example
 * const res = await getSongComment(123456, { limit: 20, offset: 0 });
 */
export const getSongComment = (id, options = {}) => {
  const { limit = 100, offset = 0, before } = options;
  const data = {
    rid: id,
    limit,
    offset,
    beforeTime: before,
  };
  return weapiRequest(`/api/v1/resource/comments/R_SO_4_${id}`, {
    data,
  });
};

/**
 * 获取歌曲所有评论
 * @param {number} id 歌曲ID
 * @returns {Promise<Array>} 返回所有评论数组
 * @example
 * const allComments = await getSongAllComments(123456);
 */
export const getSongAllComments = async (id, options = {}) => {
  const { onChange } = options;
  const allComments = [];
  let offset = 0;
  const limit = 100; // 最大单次请求官方支持100，若不支持可改为更小值
  let hasMore = true;
  let before;
  let allTotal = 0;

  /*   // 第一次获取评论总数
  const res = await getSongComment(id, { limit, offset, before });
  if (!res || res.code !== 200) {
    throw new Error((res && (res.msg || res.message)) || '获取歌曲评论失败');
  }
  const { total } = res;
  allTotal = total;

  const pageCount = Math.ceil(allTotal / limit);
  const taskList = Array.from({ length: pageCount }, (_, index) => {
    return async () => {
      const res = await getSongComment(id, {
        limit,
        offset: index * limit,
        before,
      });
      if (!res || res.code !== 200) {
        throw new Error(
          (res && (res.msg || res.message)) || '获取歌曲评论失败',
        );
      }
      const { comments } = res;
      before = comments[comments.length - 1].time;
      console.log(`第${index + 1}页评论，偏移量${index * limit}`, res);
      return comments;
    };
  });

  const comments = await promiseLimit(taskList, 3);
  console.log('comments', comments);
  allComments.push(...comments.flat()); */

  while (hasMore) {
    const res = await getSongComment(id, { limit, offset, before });
    console.log('res', res);
    if (!res || res.code !== 200) {
      throw new Error((res && (res.msg || res.message)) || '获取歌曲评论失败');
    }
    const {
      cnum,
      code,
      commentBanner,
      comments,
      hotComments,
      isMusician,
      more,
      moreHot,
      topComments,
      total,
      userId,
    } = res;
    allTotal ||= total;
    allComments.push(...comments);
    hasMore = more;
    onChange?.({
      limit,
      offset,
      page: Math.ceil(offset / limit) + 1,
      total: allTotal,
      totalPage: Math.ceil(allTotal / limit),
      comments,
      allComments,
    });
    if (hasMore) {
      // 网易云分页有2种模式，这里采用before方式以最大化获取全部评论
      before = comments[comments.length - 1].time;
      offset += comments.length;
    }
  }
  downloadAsJson(allComments, `${id}-评论.json`);
  return allComments;
};
