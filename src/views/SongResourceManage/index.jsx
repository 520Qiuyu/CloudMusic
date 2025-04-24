import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";
import { Tabs } from "antd";
import ArtistList from "./components/ArtistList";
import SongList from "./components/SongList";

const SongResourceManage = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const reset = () => {};

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  return (
    <Modal
      title="歌曲资源管理"
      open={visible}
      onCancel={close}
      width={1000}
      centered
      footer={null}
      bodyProps={{
        style: {
          minHeight: "400px",
        },
      }}
    >
      <Tabs defaultActiveKey="1">
        {/* 歌手管理 */}
        <Tabs.TabPane
          tab="歌手管理"
          key="1"
        >
          <ArtistList />
        </Tabs.TabPane>

        {/* 歌曲管理 */}
        <Tabs.TabPane
          tab="歌曲管理"
          key="2"
        >
          <SongList />
        </Tabs.TabPane>
      </Tabs>
      ;
    </Modal>
  );
});

export default SongResourceManage;
