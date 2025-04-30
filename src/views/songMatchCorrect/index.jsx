import { Modal } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import styles from "./index.module.scss";
import SingerChoose from "../quickUpload/components/SingerChoose";
import SingerMatchArea from "./components/SingerMatchArea";
import { Tabs } from "antd";
import { SongMatchProvider, useSongMatch } from "./context/SongMatchContext";
import { useState } from "react";

const { TabPane } = Tabs;

const SongMatchCorrect = forwardRef((props, ref) => {
  const {
    singerList,
    loading,
    chooseList,
    singerMap,
    currentTab,
    getSingerList,
    handleChoose,
    setCurrentTab,
    reset,
  } = useSongMatch();

  const [visible, setVisible] = useState(false);
  const open = () => {
    reset();
    getSingerList();
    setVisible(true);
  };
  const close = () => setVisible(false);

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  return (
    <Modal
      title="歌曲自动匹配"
      open={visible}
      onCancel={close}
      width={1000}
      footer={null}
      centered={true}
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
            return (
              <SingerMatchArea
                key={singerId}
                singerId={singerId}
              />
            );
          })}
        </TabPane>
      </Tabs>
    </Modal>
  );
});

const WrappedSongMatchCorrect = forwardRef((props, ref) => (
  <SongMatchProvider>
    <SongMatchCorrect
      {...props}
      ref={ref}
    />
  </SongMatchProvider>
));

export default WrappedSongMatchCorrect;
