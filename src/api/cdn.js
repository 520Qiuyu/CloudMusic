import { BASE_CDN_URL } from '../constant';

/**
 * 获取资源配置 对应歌手的资源
 * @param {string|number} artistId 歌手ID
 * @returns {Promise} 返回资源配置
 * @example
 * const config = await getCDNConfig('12345');
 */
export const getCDNConfig = (artistId) =>
  fetch(`${BASE_CDN_URL}${artistId}.json`).then((res) => res.json());

