import {
  addSongToPlaylist,
  createPlaylist,
  getPlaylistAllData,
  getPlaylistList,
} from '@/api/playlist';
import { Button, Form, Input, Space } from 'antd';
import { useState } from 'react';

/**
 * 歌单相关测试组件
 */
const PlaylistTab = () => {
  // 歌单名称
  const [songListName, setSongListName] = useState('');
  // 新建歌单
  const handleCreateSongList = async () => {
    console.log('新建歌单');
    try {
      const res = await createPlaylist(songListName);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 添加信息
  const [addInfo, setAddInfo] = useState({
    songId: '185620',
    playlistId: '12999288729',
  });
  // 添加歌曲
  const handleAddSong = async () => {
    console.log('添加歌曲');
    try {
      const res = await addSongToPlaylist(addInfo.playlistId, [addInfo.songId]);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 用户id
  const [userId, setUserId] = useState('12999288729');
  //   获取歌单列表
  const handleGetPlaylistList = async () => {
    console.log('获取歌单列表');
    try {
      const res = await getPlaylistList(userId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试获取歌单信息
  const [playlistId, setPlaylistId] = useState('13508631377');
  const handleGetPlaylist = async () => {
    try {
      const res = await getPlaylistAllData(playlistId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Form>
      {/* 测试新建歌单 */}
      <Form.Item label='新建歌单'>
        <Space>
          <Input
            placeholder='请输入歌单名称'
            value={songListName}
            onChange={(e) => setSongListName(e.target.value)}
          />
          <Button type='primary' onClick={handleCreateSongList}>
            新建歌单
          </Button>
        </Space>
      </Form.Item>

      {/* 测试向歌单添加歌曲 */}
      <Form.Item label='向歌单添加歌曲'>
        <Space>
          <Input
            placeholder='请输入歌单Id'
            addonBefore='歌单id'
            value={addInfo.playlistId}
            onChange={(e) =>
              setAddInfo({ ...addInfo, playlistId: e.target.value })
            }
          />
          <Input
            placeholder='请输入歌曲Id'
            addonBefore='歌曲id'
            value={addInfo.songId}
            onChange={(e) =>
              setAddInfo({ ...addInfo, songId: e.target.value })
            }
          />
          <Button type='primary' onClick={handleAddSong}>
            添加歌曲
          </Button>
        </Space>
      </Form.Item>

      {/* 测试获取用户歌单列表 */}
      <Form.Item label='获取用户歌单列表'>
        <Space>
          <Input
            placeholder='请输入用户Id'
            addonBefore='用户id'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button type='primary' onClick={handleGetPlaylistList}>
            获取用户歌单列表
          </Button>
        </Space>
      </Form.Item>

      {/* 测试获取歌单详情 */}
      <Form.Item label='测试获取歌单详情'>
        <Space>
          <Input
            placeholder='请输入歌单Id'
            addonBefore='歌单Id'
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
          />
          <Button type='primary' onClick={handleGetPlaylist}>
            获取歌单详情
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PlaylistTab;

