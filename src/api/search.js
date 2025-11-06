import { weapiRequest } from '@/utils/request';

/** 搜索接口 */
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
/** 搜索接口2 */
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
