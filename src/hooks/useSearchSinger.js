import { searchArtist } from "@/api";
import { useEffect, useState } from "react";

const singerKeywordsMap = {};

export const useSearchSinger = options => {
  const {
    /** 要搜索的歌手关键词 */
    keywords,
  } = options || {};

  const [singerList, setSingerList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 搜索歌手列表
  const searchSingerList = async keywords => {
    try {
      setLoading(true);
      if (singerKeywordsMap[keywords]) {
        setSingerList(singerKeywordsMap[keywords]);
        return;
      }
      const res = await searchArtist(keywords);
      if (res.code === 200) {
        console.log('res',res)
        setSingerList(res.data.list);
        singerKeywordsMap[keywords] = res.data.list;
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // 重置状态
  const reset = () => {
    setSingerList([]);
  };

  useEffect(() => {
    if (!keywords) return;
    searchSingerList(keywords);
  }, [keywords]);

  return {
    singerList,
    loading,
    searchSingerList,
  };
};
