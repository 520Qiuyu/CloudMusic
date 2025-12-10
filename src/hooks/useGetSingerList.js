import { getArtists } from '@/api';
import { useEffect, useState } from 'react';

/**  */
export const useGetSingerList = () => {
  const [singerList, setSingerList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取歌手列表
  const getSingerList = async () => {
    try {
      setLoading(true);
      const list = await getArtists();
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
