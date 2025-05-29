import { useEffect, useState } from "react";
import { useGetSingerList } from "./useGetSingerList";
import { getArtistAllSongList, searchArtist } from "@/api";

export function useGetSingerSongs(options) {
  const {
    /** 要提前获取的歌手id信息 字符串以逗号分隔 */
    singerIds,
  } = options || {};

  const { singerList } = useGetSingerList();
  const [singerMap, setSingerMap] = useState({});
  const [loading, setLoading] = useState(false);

  // 获取歌手信息
  const getSingerInfoById = async singerId => {
    try {
      if (singerMap[singerId]?.singerInfo) return singerMap[singerId]?.singerInfo;
      const res = await searchArtist(singerId);
      if (res.code === 200) {
        console.log("res", res);
        const singerInfo = res.data.list[0];
        setSingerMap(prv => ({
          ...prv,
          [singerId]: {
            ...prv[singerId],
            singerInfo,
          },
        }));
        return singerInfo;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // 通过歌手id获取歌手全部歌曲
  const getSingerAllSongListById = async singerId => {
    try {
      setLoading(true);
      if (singerMap[singerId]?.songList) return singerMap[singerId]?.songList;
      const res = await getArtistAllSongList(singerId);
      if (res.code === 200) {
        const songList = res.songs;
        setSingerMap(prv => ({
          ...prv,
          [singerId]: {
            ...prv[singerId],
            songList,
          },
        }));
        return songList;
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // 如果传了singerIds，就提前获取singerInfo和songList
  useEffect(() => {
    if (!singerIds) return;
    const ids = (singerIds + "").split(",");
    ids.forEach(singerId => {
      getSingerInfoById(singerId);
      getSingerAllSongListById(singerId);
    });
  }, [singerIds]);

  // 重置状态
  const reset = () => {
    setSingerMap({});
  };

  return {
    singerMap,
    getSingerInfoById,
    getSingerAllSongListById,
    reset,
    loading,
  };
}
