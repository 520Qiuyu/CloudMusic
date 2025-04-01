import React, { createContext, useContext, useState } from "react";
import {
  getArtists,
  getArtists2,
  getArtistAllSongList,
  searchArtist,
  getCDNConfig,
} from "../../../api";
import { promiseLimit } from "@/utils";

const SongMatchContext = createContext();

export const SongMatchProvider = ({ children }) => {
  const [singerList, setSingerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chooseList, setChooseList] = useState([]);
  const [singerMap, setSingerMap] = useState({});
  const [currentTab, setCurrentTab] = useState("1");

  // 获取歌手列表
  const getSingerList = async () => {
    try {
      setLoading(true);
      const res = await getArtists();
      const res2 = await getArtists2();
      const list = [...new Map([...res2, ...res].map(item => [item.id, item])).values()];
      setSingerList(list);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取歌手信息
  const getSingerInfo = async id => {
    try {
      const res = await searchArtist(id);
      if (res.code === 200) {
        return res.data.list[0];
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // 获取歌手全部歌曲
  const getSingerAllSongList = async id => {
    try {
      const res = await getArtistAllSongList(id);
      if (res.code === 200) {
        return res.songs;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // 处理选择歌手
  const handleChoose = value => {
    setChooseList(value);
    setCurrentTab("2");

    const asyncFn = async () => {
      const proArr = value.map(singerId => {
        return async () => {
          // 获取歌手信息
          getSingerInfo(singerId).then(res => {
            setSingerMap(prv => ({
              ...prv,
              [singerId]: {
                ...prv[singerId],
                singerInfo: res,
              },
            }));
          });
          // 获取歌手歌曲
          getSingerAllSongList(singerId).then(res => {
            setSingerMap(prv => ({
              ...prv,
              [singerId]: {
                ...prv[singerId],
                songList: res,
              },
            }));
          });
          // 获取歌手所有已上传歌曲
          getCDNConfig(singerId).then(res => {
            setSingerMap(prv => ({
              ...prv,
              [singerId]: {
                ...prv[singerId],
                cdnConfig: res.data,
              },
            }));
          });
        };
      });
      await promiseLimit(proArr, 3);
    };
    asyncFn();
  };

  // 更新歌曲匹配信息
  const updateSongMatchInfo = (singerId, index, match) => {
    console.log("update", singerId, index, match)
    setSingerMap(prv => ({
      ...prv,
      [singerId]: {
        ...prv[singerId],
        cdnConfig: prv[singerId].cdnConfig.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              match,
            };
          } else {
            return item;
          }
        }),
      },
    }));
  };

  // 重置状态
  const reset = () => {
    setCurrentTab("1");
    setSingerList([]);
    setChooseList([]);
    setSingerMap({});
  };

  return (
    <SongMatchContext.Provider
      value={{
        singerList,
        loading,
        chooseList,
        singerMap,
        currentTab,
        setSingerList,
        setLoading,
        setChooseList,
        setSingerMap,
        getSingerList,
        handleChoose,
        setCurrentTab,
        reset,
        updateSongMatchInfo,
      }}
    >
      {children}
    </SongMatchContext.Provider>
  );
};

export const useSongMatch = () => {
  const context = useContext(SongMatchContext);
  if (!context) {
    throw new Error("useSongMatch must be used within a SongMatchProvider");
  }
  return context;
};
