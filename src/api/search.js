import { weapiRequest } from '../utils/request';
import { getAudioMetadata, getFileMD5 } from '../utils';

/**
 * 搜索接口
 * @param {string} keyword 关键词
 * @param {object} options 搜索选项
 * @param {number} options.type 搜索类型，默认1
 * @param {number} options.limit 每页数量，默认30
 * @param {number} options.offset 偏移量，默认0
 * @returns {Promise} 返回搜索结果
 */
export const search = (keyword, options) => {
  const { type = 1, limit = 30, offset = 0 } = options || {};
  return weapiRequest('/api/search/get', {
    data: {
      s: keyword,
      type,
      limit,
      offset,
    },
  });
};

/**
 * 搜索接口2
 * @param {string} keyword 关键词
 * @param {object} options 搜索选项
 * @param {number} options.type 搜索类型，默认1
 * @param {number} options.limit 每页数量，默认30
 * @param {number} options.offset 偏移量，默认0
 * @returns {Promise} 返回搜索结果
 */
export const cloudSearch = (keyword, options) => {
  const { type = 1, limit = 30, offset = 0 } = options || {};
  return weapiRequest('/api/cloudsearch/pc', {
    data: {
      s: keyword,
      type,
      limit,
      offset,
      total: true,
    },
  });
};

/**
 * 搜索歌手信息
 * @param {string} keyword 关键词
 * @returns {Promise} 返回歌手搜索结果
 * @example
 * const result = await searchArtist('周杰伦');
 */
export const searchArtist = (keyword) =>
  weapiRequest('/api/rep/ugc/artist/search', {
    data: {
      keyword,
      limit: 40,
    },
  });

/**
 * 本地歌曲匹配网易云歌曲信息
 * @param {File[]} files 文件数组
 * @returns {Promise} 返回匹配结果
 * @example
 * const files = [file1, file2];
 * const matchResult = await matchLocalSong(files);
 */
export const matchLocalSong = async (files) => {
  const songs = await Promise.all(
    files.map(async (file) => {
      const { title, album, artist, duration } = await getAudioMetadata(file);
      const md5 = await getFileMD5(file);
      return {
        title,
        album,
        artist,
        duration,
        persistId: md5,
      };
    }),
  );

  return weapiRequest('/api/search/match/new', {
    data: songs,
  });
};
