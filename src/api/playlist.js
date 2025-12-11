import { getUser } from '../utils';
import { msgError } from '../utils/modal';
import { weapiRequest } from '../utils/request';
import { getSongInfoList } from './song';

/**
 * 获取歌单列表
 * @param {number} uid 用户ID，默认当前用户
 * @param {number} limit 每页数量，默认1001
 * @param {number} offset 偏移量，默认0
 * @returns {Promise} 返回歌单列表
 * @example
 * const playlists = await getPlaylistList();
 */
export const getPlaylistList = (
  uid = getUser().userId,
  limit = 1001,
  offset = 0,
) =>
  weapiRequest('/api/user/playlist', {
    data: {
      limit,
      offset,
      uid,
    },
  });

/**
 * 新建歌单
 * @param {string} name 歌单名称
 * @returns {Promise} 返回创建结果
 * @example
 * const result = await createPlaylist('我的歌单');
 */
export const createPlaylist = (name) =>
  weapiRequest('/api/playlist/create', {
    data: {
      name,
    },
  });

/**
 * 删除歌单
 * @param {number} pid 歌单ID
 * @returns {Promise} 返回删除结果
 * @example
 * await deletePlaylist(123456);
 */
export const deletePlaylist = (pid) =>
  weapiRequest('/api/playlist/delete', {
    data: {
      pid,
    },
  });

/**
 * 添加歌曲到歌单
 * @param {number} pid 歌单ID
 * @param {number[]} trackIds 歌曲ID数组
 * @returns {Promise} 返回添加结果
 * @example
 * await addSongToPlaylist(123456, [789012, 345678]);
 */
export const addSongToPlaylist = (pid, trackIds) =>
  weapiRequest('/api/playlist/manipulate/tracks', {
    data: {
      pid, // 歌单id
      trackIds, // 歌曲 id 数组
      op: 'add', // 操作类型
    },
  });

/**
 * 获取歌单所有数据
 * @param {number} id 歌单ID
 * @returns {Promise} 返回歌单所有歌曲数据
 * @example
 * const songs = await getPlaylistAllData(123456);
 */
export const getPlaylistAllData = async (id) => {
  try {
    const detailRes = await weapiRequest('/api/v6/playlist/detail', {
      data: {
        id,
        offset: 0,
        total: true,
        n: 100000,
        s: 8,
      },
    });
    console.log('detailRes', detailRes);
    const trackIds = detailRes.playlist.trackIds.map((item) => item.id);
    const res = await getSongInfoList(trackIds);
    if (res?.code != 200) {
      msgError(res?.msg || '获取歌单数据失败');
      throw new Error(res?.msg || '获取歌单数据失败');
    }
    return res.songs;
  } catch (error) {
    throw error;
  }
};

/**
 * 调整歌单歌曲顺序
 * @param {number} pid 歌单id
 * @param {number[]} trackIds 歌曲ID数组
 */
export const updateSongOrder = (pid, trackIds) =>
  weapiRequest('/api/playlist/manipulate/tracks', {
    data: {
      pid, // 歌单id
      trackIds, // 歌曲 id 数组
      op: 'update', // 操作类型
    },
  });


  