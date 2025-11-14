import { BASE_CDN_URL } from '../constant';
import { weapiRequest } from '../utils/request';

/**
 * 获取歌手列表
 * @returns {Promise} 返回歌手列表
 */
export const getArtists = () =>
  fetch(`${BASE_CDN_URL}artist.json`).then((res) => res.json());

/**
 * 获取歌手热门歌曲
 * @param {number} id 歌手ID
 * @returns {Promise} 返回歌手热门歌曲列表
 * @example
 * const songs = await getArtistTopSongList(6452);
 */
export const getArtistTopSongList = (id) =>
  weapiRequest('/api/artist/top/song', {
    data: {
      id,
      limit: 1000,
      offset: 0,
    },
  });

/**
 * 获取歌手全部歌曲
 * @param {number} id 歌手ID
 * @returns {Promise} 返回歌手全部歌曲列表
 * @example
 * const songs = await getArtistAllSongList(6452);
 */
export const getArtistAllSongList = async (id) => {
  try {
    let more = true;
    const songs = [];
    let offset = 0;
    while (more) {
      const res = await weapiRequest('/api/v1/artist/songs', {
        data: {
          id,
          limit: 200,
          private_cloud: 'true',
          work_type: 1,
          order: 'hot', //hot,time
          offset,
        },
      });
      if (res.code != 200) {
        throw new Error(res.message || res.msg || '获取歌手全部歌曲失败');
      }
      songs.push(...res.songs);
      more = res.more;
      offset += 200;
    }
    return {
      code: 200,
      msg: '获取歌手全部歌曲成功',
      songs: songs,
    };
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

/**
 * 获取歌手专辑
 * @param {number} id 歌手ID
 * @returns {Promise} 返回歌手专辑列表
 * @example
 * const albums = await getArtistAlbumList(6452);
 */
export const getArtistAlbumList = async (id) => {
  let more = true;
  let limit = 200;
  let offset = 0;
  const albumList = [];
  while (more) {
    const res = await weapiRequest(`/api/artist/albums/${id}`, {
      data: {
        id,
        limit,
        offset,
      },
    });
    if (res.code != 200) {
      throw new Error(res.message || res.msg || '获取歌手专辑失败');
    }
    albumList.push(...res.hotAlbums);
    more = res.more;
    offset += limit;
  }
  return {
    code: 200,
    msg: '获取歌手专辑成功',
    data: albumList,
  };
};
