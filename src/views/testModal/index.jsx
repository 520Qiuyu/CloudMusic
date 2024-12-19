import { Button, Form, Input, Modal, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  addSongToPlaylist,
  createPlaylist,
  deleteCloudSong,
  getAlbumSongList,
  getArtistAlbumList,
  getArtistAllSongList,
  getArtistTopSongList,
  getCloudData,
  getPlaylistList,
  getSongUrl,
  qrLogin,
} from "../../api";
import { msgSuccess } from "../../utils/modal";

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

  // 歌曲id
  const [songId, setSongId] = useState("2608471890");
  // 获取歌曲URL
  const handleGetSongUrl = async () => {
    console.log("获取歌曲URL");
    try {
      const res = await getSongUrl([songId]);
      console.log("res", res);
      if (res.code === 200) {
        const url = res.data[0].url;
        await navigator.clipboard.writeText(url);
        msgSuccess("获取成功,已复制到剪切板");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // 删除云盘歌曲
  const handleDeleteCloudSong = async () => {
    console.log("删除云盘歌曲");
    try {
      const res = await deleteCloudSong([songId]);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  const [albumId, setAlbumId] = useState("242274622");
  // 获取专辑歌曲列表
  const handleGetAlbumSongList = async () => {
    console.log("获取专辑歌曲列表");
    try {
      const res = await getAlbumSongList(albumId);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  // 歌手id
  const [artistId, setArtistId] = useState("3684");
  // 获取歌手歌曲列表
  const handleGetArtistTopSongList = async () => {
    console.log("获取歌手歌曲列表");
    try {
      const res = await getArtistTopSongList(artistId);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };
  // 获取歌手专辑
  const handleGetArtistAlbum = async () => {
    console.log("获取歌手专辑");
    try {
      const res = await getArtistAlbumList(artistId);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };
  // 获取歌手全部歌曲
  const handleGetArtistAllSongList = async () => {
    console.log("获取歌手全部歌曲");
    try {
      const res = await getArtistAllSongList(artistId);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  // qr登录
  const handleQrLogin = async () => {
    console.log("二维码登录");
    try {
      const res = await qrLogin();
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
        {/* 测试获取歌曲URL */}
        <Form.Item label="获取歌曲URL">
          <Space>
            <Input
              placeholder="请输入歌曲id"
              value={songId}
              onChange={(e) => setSongId(e.target.value)}
            />
            <Button type="primary" onClick={handleGetSongUrl}>
              获取歌曲URL
            </Button>
            <Button type="primary" onClick={handleDeleteCloudSong}>
              删除云盘歌曲
            </Button>
          </Space>
        </Form.Item>
        {/* 测试获取专辑歌曲列表 */}
        <Form.Item label="获取专辑歌曲列表">
          <Space>
            <Input
              placeholder="请输入专辑id"
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
            />
            <Button type="primary" onClick={handleGetAlbumSongList}>
              获取专辑歌曲列表
            </Button>
          </Space>
        </Form.Item>
        {/* 测试获取歌手歌曲列表 */}
        <Form.Item label="获取歌手歌曲列表">
          <Space>
            <Input
              placeholder="请输入歌手id"
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
            />
            <Button type="primary" onClick={handleGetArtistTopSongList}>
              获取歌手热门歌曲列表
            </Button>
            <Button type="primary" onClick={handleGetArtistAlbum}>
              获取歌手专辑
            </Button>
            <Button type="primary" onClick={handleGetArtistAllSongList}>
              获取歌手全部歌曲
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {/* 测试二维码登录 */}
      <Form.Item label="二维码登录">
        
        <Button type="primary" onClick={handleQrLogin}>
          二维码登录
        </Button>
      </Form.Item>
    </Modal>
  );
});

export default TestModal;
