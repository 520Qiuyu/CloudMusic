import { downloadAsJson } from '@/utils/download';
import { QUALITY_LEVELS } from '../constant';
import { chunkArray, getUser, promiseLimit, sleep } from '../utils';
import { weapiFetch, weapiRequest } from '../utils/request';
import dayjs from 'dayjs';

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
  const { limit = 100, offset = 200, before = 1747050175371 } = options;
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
 * 获取歌曲评论
 * @param {number} id 歌曲ID
 * @param {object} options 选项
 * @param {number} options.pageSize 每页评论数，默认20
 * @param {number} options.pageNo 页码，默认1
 * @param {number} options.before 上一分页最后一项的time，用于分页
 * @returns {Promise} 返回评论数据
 * @example
 * const res = await getSongComment(123456, { limit: 20, offset: 0 });
 */
export const getSongComment1 = (id, options = {}) => {
  // 0: {sortType: 1, sortTypeName: '按推荐排序', target: 'order_by_alg'}
  // 1: {sortType: 2, sortTypeName: '按热度排序', target: 'order_by_hot'}
  // 2: {sortType: 3, sortTypeName: '按时间排序', target: 'order_by_time'}
  const { pageSize = 1000, before, orderType = 3 } = options;
  const rid = `R_SO_4_${id}`;
  // "rid=R_SO_4_2603084732&threadId=R_SO_4_2603084732&pageNo=7&pageSize=20&cursor=1762213429602&offset=0&orderType=0"
  const data = {
    rid,
    threadId: rid,
    pageSize,
    // offset: 200,
    cursor: before,
    orderType,
  };

  return weapiRequest(`/api/comment/resource/comments/get`, {
    data,
  });
};

/**
 * 获取歌曲所有评论
 * @param {number} id 歌曲ID
 * @param {object} options 选项
 * @param {object} options.timeRange 时间范围
 * @param {string} options.timeRange.start 开始时间 2025-01-01 dayjs
 * @param {string} options.timeRange.end 结束时间 2025-01-01 dayjs
 * @param {number} options.wait 等待时间(毫秒)，默认0
 * @param {function} options.onStop 停止回调函数
 * @param {function} options.mapRule(comment) 映射规则
 * @param {function} options.onChange 回调函数
 * @returns {Promise<Array>} 返回所有评论数组
 * @example
 * const allComments = await getSongAllComments(123456);
 */
export const getSongAllComments = async (id, options = {}) => {
  const {
    onChange,
    timeRange = {},
    wait = 0,
    onStop,
    mapRule = (comment) => comment,
  } = options;
  const { start, end } = timeRange;
  const allComments = [];
  const hotComments = [];
  const limit = 1000; // 最大单次请求官方支持100，若不支持可改为更小值
  let hasMore = true;
  let before = end && dayjs(end).endOf('day').valueOf();
  let allTotal = 0;
  let stopFlag = false;
  onStop?.(() => {
    stopFlag = true;
  });

  while (hasMore && !stopFlag) {
    const res = await getSongComment1(id, { before });
    if (!res || res.code !== 200) {
      throw new Error(res.message || res.msg || '获取歌曲评论失败');
    }
    const {
      comments,
      totalCount,
      cursor,
      hotComments: hotCommentsData,
    } = res.data;
    console.log(
      `${comments[0]?.timeStr} 至 ${comments[comments.length - 1]?.timeStr}`,
      res,
    );
    allTotal ||= totalCount;
    hasMore = comments.length > 0;
    allComments.push(...comments.map(mapRule));
    !hotComments?.length && hotComments.push(...hotCommentsData.map(mapRule));
    onChange?.({
      limit,
      page: Math.ceil(allComments.length / limit) + 1,
      total: allTotal,
      totalPage: Math.ceil(allTotal / limit),
      comments: comments.map(mapRule),
      allComments,
      hotComments,
    });
    if (
      hasMore &&
      (start ? dayjs(start).startOf('day').valueOf() < cursor : true)
    ) {
      // 网易云分页有2种模式，这里采用before方式以最大化获取全部评论
      before = cursor;
      if (wait) {
        await sleep(wait);
        console.log('等待', wait, '毫秒');
      }
    } else {
      break;
    }
  }
  // downloadAsJson(allComments, `${id}-评论.json`);
  return {
    code: 200,
    allComments,
    hotComments,
  };
};

/**
 * 听歌打卡（网易云）
 * @param {Object} params 配置参数
 * @param {number} params.id 歌曲ID
 * @param {string} [params.sourceId] 源ID，默认当前用户ID
 * @param {number} params.time 听歌时长（单位：秒）
 * @param {number} [params.checkInCount=1] 打卡次数，默认1
 * @returns {Promise<Array>} 打卡任务执行结果数组
 * @example
 * await listenSongCheckIn({ id: 123, time: 240 });
 */
export const listenSongCheckIn = async (params) => {
  const {
    id,
    sourceId = getUser().userId + '',
    time,
    checkInCount = 1,
    wait = 1000,
  } = params;

  const taskList = Array.from(
    { length: checkInCount },
    (_, index) => async () => {
      // startlog
      /*       const startLog = {
        action: 'startplay',
        json: {
          content: 'id=' + id,
          id,
          mainsite: '1',
          mainsiteWeb: '1',
          type: 'song',
        },
      };
      await weapiFetch(`/api/feedback/weblog`, {
        data: { logs: JSON.stringify([startLog]) },
      }); */
      // endLog
      const log = {
        action: 'play',
        json: {
          content: 'id=' + id,
          download: 0,
          end: 'playend',
          id,
          mainsite: '1',
          mainsiteWeb: '1',
          source: 'user',
          sourceId,
          sourcetype: 'user',
          time,
          type: 'song',
          wifi: 0,
        },
      };
      return weapiFetch(`/api/feedback/weblog`, {
        data: { logs: JSON.stringify([log]) },
      });
    },
  );
  const res = await promiseLimit(taskList, 1, { wait });
  return res;
};
