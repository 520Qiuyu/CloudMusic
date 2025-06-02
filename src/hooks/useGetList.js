import { useEffect, useState } from 'react';

export const useGetList = (api, params, options) => {
  const {
    // 监控项
    monitors,
    // 取值key
    listKey = 'list',
    // totalkey
    totalKey = 'count',
    // 中断条件
    returnFunction = undefined,
  } = options || {};

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [otherInfo, setOtherInfo] = useState({});

  useEffect(
    () => {
      const asyncFn = async () => {
        try {
          if (returnFunction && returnFunction()) return;
          setLoading(true);
          const res = await api(params);
          // 如果有新的请求，则不更新
          if (hasNewRequest) return;
          if (res.code === 200) {
            const { data } = res;
            setList(listKey ? data[listKey] : data);
            setTotal(res[totalKey] || 0);
            const { [totalKey]: _, [listKey]: __, ...other } = res;
            setOtherInfo(other);
          }
        } catch (error) {
          console.log('error', error);
        } finally {
          setLoading(false);
        }
      };
      /** 是否有新的请求 */
      let hasNewRequest = false;
      asyncFn();

      return () => {
        hasNewRequest = true;
      };
    },
    monitors || [params],
  );

  return { list, loading, total, otherInfo };
};
