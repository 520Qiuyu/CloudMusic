import { useEffect, useState } from 'react';

/**
 * 获取数据的hook
 * @description 一般用于获取整个消息体，默认挂载的时候请求，可以手动调用getData方法重新请求
 * @param {Function} api - API函数，接收params参数，返回Promise
 * @param {*} [params] - API函数的参数
 * @param {Object} [options={}] - 配置选项
 * @param {Array} [options.monitors] - 监控项，当监控项发生变化时，重新请求，默认为[]只在挂载时请求
 * @param {Function} [options.returnFunction] - 终止函数，返回true时不执行请求
 * @param {*} [options.initialValue={}] - 初始值
 * @param {Function} [options.callback] - 拿到数据后执行的函数
 * @returns {Object} 返回对象
 * @returns {*} returns.data - 数据
 * @returns {Function} returns.setData - 手动更改数据的方法
 * @returns {boolean} returns.loading - 是否加载中
 * @returns {Function} returns.getData - 手动获取数据的方法
 * @example
 * const { data, loading, getData } = useGetData(
 *   () => fetchUserInfo(userId),
 *   userId,
 *   {
 *     monitors: [userId],
 *     returnFunction: () => !userId,
 *     initialValue: {},
 *     callback: (data) => console.log('数据获取成功', data)
 *   }
 * );
 */
export const useGetData = (api, params, options) => {
  const {
    // 监控项
    monitors,
    // 终止函数，什么条件下不执行
    returnFunction,
    // 初始值
    initialValue = {},
    // 拿到数据后执行的函数
    callback,
  } = options || {};

  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await api(params);
      setData(res || {});
      callback && callback(res || {});
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (returnFunction && returnFunction()) return;
    getData();
  }, monitors || []);

  return {
    /** 数据 */
    data,
    /** 手动更改数据 */
    setData,
    /** 是否加载中 */
    loading,
    /** 手动获取数据 */
    getData,
  };
};

