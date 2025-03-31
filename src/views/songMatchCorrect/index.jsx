import { Button, Modal, Table, Upload } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  getArtistAllSongList,
  getArtists,
  getArtists2,
  getCDNConfig,
  matchLocalSong,
  searchArtist,
} from "../../api";
import { msgError, msgSuccess } from "../../utils/modal";
import styles from "./index.module.scss";
import SingerChoose from "../quickUpload/components/SingerChoose";
import { useEffect } from "react";
import { promiseLimit } from "@/utils";
import SingerMatchArea from "./components/SingerMatchArea";
import { Tabs } from "antd";

const { Dragger } = Upload;
const { TabPane } = Tabs;

const SongMatchCorrect = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const open = () => {
    reset();
    getSingerList();
    setVisible(true);
  };
  const close = () => setVisible(false);
  const reset = () => {
    setCurrentTab("1");
    setSingerList([]);
    setChooseList([]);
  };

  // 当前tab
  const [currentTab, setCurrentTab] = useState("1");

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  // 歌手列表
  const [singerList, setSingerList] = useState([]);
  const [loading, setLoading] = useState(false);
  // 获取歌手
  const getSingerList = async () => {
    try {
      setLoading(true);
      const res = await getArtists();
      const res2 = await getArtists2();
      console.log("res2", res2);
      // 合并两个数组并按照id去重
      const list = [...new Map([...res2, ...res].map(item => [item.id, item])).values()];
      console.log("list", list);
      setSingerList(list);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // 已选择列表
  const [chooseList, setChooseList] = useState([]);
  // 歌手歌曲映射
  const [singerMap, setSingerMap] = useState({});
  const handleChoose = value => {
    console.log(value);
    setChooseList(value);
    setCurrentTab("2");
  };
  // 获取歌手信息
  const getSingerInfo = async id => {
    try {
      const res = await searchArtist(id);
      console.log("res", res);
      if (res.code === 200) {
        return res.data.list[0];
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // 获取歌手全部歌曲
  const getSingerAllSongList = async id => {
    console.log("获取歌手全部歌曲");
    try {
      const res = await getArtistAllSongList(id);
      console.log("res", res);
      if (res.code === 200) {
        return res.songs;
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const asyncFn = async () => {
      const proArr = chooseList.map(singerId => {
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
          // 获取歌手歌曲 网易云有信息，但是没音源的
          getSingerAllSongList(singerId).then(res => {
            setSingerMap(prv => ({
              ...prv,
              [singerId]: {
                ...prv[singerId],
                songList: res,
              },
            }));
          });
          // 获取歌手所有已上传歌曲，就是云盘里面上传的
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
  }, [chooseList]);

  return (
    <Modal
      title="歌曲自动匹配"
      open={visible}
      onCancel={close}
      width={1000}
      footer={null}
    >
      <Tabs
        defaultActiveKey="1"
        activeKey={currentTab}
        className={styles["quick-upload-tabs"]}
        onChange={key => setCurrentTab(key)}
      >
        {/* 歌手选择 */}
        <TabPane
          tab="歌手选择"
          key="1"
        >
          <SingerChoose
            singerList={singerList}
            loading={loading}
            onChoose={handleChoose}
          />
        </TabPane>
        {/* 歌曲匹配 */}
        <TabPane
          tab="歌曲匹配"
          key="2"
        >
          {/* 匹配区域 */}
          {chooseList.map(singerId => {
            const singerInfo = singerMap[singerId]?.singerInfo || {};
            const songList = singerMap[singerId]?.songList || [];
            const cdnConfig = singerMap[singerId]?.cdnConfig || [];
            return (
              <SingerMatchArea
                key={singerId}
                singerInfo={singerInfo}
                songList={songList}
                cdnConfig={cdnConfig}
              />
            );
          })}
        </TabPane>
      </Tabs>
    </Modal>
  );
});

export default SongMatchCorrect;
