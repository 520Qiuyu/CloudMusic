import { useEffect, useState } from 'react';

/** 获取下拉列表hook */
export const useGetDrop = (api, params, callback, options) => {
  const {
    // 监控项
    monitors,
    // 终止函数，什么条件下不执行
    returnFunction
  } = options || {};

  const [drop, setDrop] = useState([]);

  useEffect(() => {
    if(returnFunction && returnFunction()) return;
    api(params)
      .then((res) => {
        if (res.code === 200) {
          setDrop(res.data || []);
        }
        callback && callback(res.data || []);
      })
      .catch((err) => {});
  }, monitors || []);

  return drop;
};
