import { getArtists, getArtists2 } from '@/api';
import { useState } from 'react';
import { useEffect } from 'react';

/**  */
export const useGetSingerList = () => {
  const [singerList, setSingerList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取歌手列表
  const getSingerList = async () => {
    try {
      setLoading(true);
      const res = await getArtists();
      const res2 = await getArtists2();
      const list = [
        ...new Map([...res2, ...res].map((item) => [item.id, item])).values(),
      ];
      setSingerList(list);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置singerList
  const resetSingerList = () => {
    setSingerList([]);
  };

  useEffect(() => {
    getSingerList();
  }, []);

  return {
    singerList,
    loading,
    getSingerList,
    resetSingerList,
  };
};
