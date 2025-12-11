import { weapiRequest } from '@/utils/request';

/**
 * 获取用户详情
 * @param {number} uid 用户ID
 * @returns {Promise} 返回用户详情
 * @example
 * const user = await getUserDetail(123456);
 */
export const getUserDetail = async (uid) => {
  const res = await weapiRequest(`/api/v1/user/detail/${uid}`, {});
  const result = JSON.stringify(res).replace(
    /avatarImgId_str/g,
    'avatarImgIdStr',
  );
  return JSON.parse(result);
};

/**
 * 获取用户信息，包括歌单、收藏、MV、DJ等数量统计
 * @param {object} query 查询参数对象（可选）
 * @returns {Promise<Object>} 返回包含各种数量统计的用户信息对象
 * @example
 * const info = await getUserSubCount();
 */
export const getUserSubCount = async (query = {}) => {
  return weapiRequest('/api/subcount', query);
};



/**
 * 获取用户历史评论
 * @param {number} uid 用户ID
 * @param {number} limit 每页数量，默认10
 * @param {number} offset 偏移量，默认0
 * @returns {Promise} 返回用户历史评论
 * @example
 * const comments = await getUserHistoryComment(123456, 10, 0);
 */
export const getUserHistoryComment = (uid, limit = 10, time) => {
  const data = {
    compose_reminder: 'true',
    compose_hot_comment: 'true',
    limit: limit,
    user_id: uid,
    time,
  };
  // 假定request和createOption在本文件作用域可用
  return weapiRequest('/api/comment/user/comment/history', {
    data,
  });
};

/**
 * 获取用户所有历史评论
 * @param {number} uid 用户ID
 * @returns {Promise} 返回用户所有历史评论
 * @example
 * const comments = await getUserAllHistoryComment(123456);
 */
export const getUserAllHistoryComment = async (uid) => {
  const result = [];
  let time;
  let hasMore = true;
  while (hasMore) {
    const res = await getUserHistoryComment(uid, 20, time);
    console.log('res', res);
    if (res.code !== 200) {
      throw new Error(res.message || res.msg || '获取用户所有历史评论失败');
    }
    const { commentCount, comments = [], hotComments, reminder } = res.data;
    result.push(...comments);
    time = comments[comments.length - 1].time;
    hasMore = res.hasMore;
  }
  return result;
};


/**
 * 获取用户播放记录
 * @param {number} uid 用户ID
 * @param {number} [type=0] 播放记录类型，1为最近一周，0为所有时间
 * @returns {Promise<Object>} 用户播放记录数据
 * @example
 * const record = await getUserPlayRecord(123456, 0);
 */
export const getUserPlayRecord = (uid, type = 0) => {
  const data = {
    uid,
    type,
  };
  return weapiRequest('/api/v1/play/record', {
    data,
  });
};
