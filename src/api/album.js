import { weapiRequest } from '../utils/request';

/**
 * 获取专辑歌曲列表
 * @param {number} id 专辑ID
 * @returns {Promise} 返回专辑歌曲列表
 * @example
 * const songs = await getAlbumSongList(123456);
 */
export const getAlbumSongList = (id) =>
  weapiRequest(`/api/v1/album/${id}`, {
    data: {},
  });

/**
 * 获取专辑详情
 * @param {number} id 专辑ID
 * @returns {Promise} 返回专辑详情
 * @example
 * const album = await getAlbumDetail(123456);
 */
export const getAlbumDetail = async (id) => {
  return weapiRequest(`/api/album/${id}`, {
    data: {
      id,
    },
  });
};

