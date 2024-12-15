import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Modal } from "antd";
import { Form } from "antd";
import { Input } from "antd";
import {
  addSongToPlaylist,
  createPlaylist,
  getCloudData,
  getPlaylistList,
} from "../../api";
import { Space } from "antd";

const TestModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const reset = () => {};

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  // 获取云盘输入数据
  const [pageData, setPageData] = useState({
    limit: 500,
    offset: 0,
  });
  // 获取云盘数据
  const handleGetCloudData = async () => {
    console.log("获取云盘数据");
    try {
      const res = await getCloudData(pageData.limit, pageData.offset);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  // 歌单名称
  const [songListName, setSongListName] = useState("");
  // 新建歌单
  const handleCreateSongList = async () => {
    console.log("新建歌单");
    try {
      const res = await createPlaylist(songListName);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  // 添加信息
  const [addInfo, setAddInfo] = useState({
    songId: "185620",
    playlistId: "12999288729",
  });
  // 添加歌曲
  const handleAddSong = async () => {
    console.log("添加歌曲");
    try {
      const res = await addSongToPlaylist(addInfo.playlistId, [addInfo.songId]);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  // 用户id
  const [userId, setUserId] = useState("12999288729");
  //   获取歌单列表
  const handleGetPlaylistList = async () => {
    console.log("获取歌单列表");
    try {
      const res = await getPlaylistList(userId);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Modal
      title="测试Modal"
      open={visible}
      onCancel={close}
      width={800}
      footer={null}
      centered
    >
      <Form>
        {/* 测试获取云盘数据 */}
        <Form.Item label="获取云盘数据">
          <Space>
            <Input placeholder="limit" style={{ width: 100 }} />
            <Input placeholder="offset" style={{ width: 100 }} />
            <Button type="primary" onClick={handleGetCloudData}>
              获取云盘数据
            </Button>
          </Space>
        </Form.Item>
        {/* 测试新建歌单 */}
        <Form.Item label="新建歌单">
          <Space>
            <Input
              placeholder="请输入歌单名称"
              value={songListName}
              onChange={(e) => setSongListName(e.target.value)}
            />
            <Button type="primary" onClick={handleCreateSongList}>
              新建歌单
            </Button>
          </Space>
        </Form.Item>
        {/* 测试添加歌曲 */}
        <Form.Item label="添加歌曲">
          <Space>
            <Input
              placeholder="请输入歌单id"
              value={addInfo.playlistId}
              onChange={(e) =>
                setAddInfo({ ...addInfo, playlistId: e.target.value })
              }
            />
            <Input
              placeholder="请输入歌曲id"
              value={addInfo.songId}
              onChange={(e) =>
                setAddInfo({ ...addInfo, songId: e.target.value })
              }
            />
            <Button type="primary" onClick={handleAddSong}>
              添加歌曲
            </Button>
          </Space>
        </Form.Item>
        {/* 测试获取歌单列表 */}
        <Form.Item label="获取歌单列表">
          <Space>
            <Input
              placeholder="请输入用户id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button type="primary" onClick={handleGetPlaylistList}>
              获取歌单列表
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default TestModal;
