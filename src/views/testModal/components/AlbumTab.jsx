import { getAlbumDetail, getAlbumSongList } from '@/api/album';
import { Button, Form, Input, Space } from 'antd';
import { useState } from 'react';

/**
 * 专辑相关测试组件
 */
const AlbumTab = () => {
  const [albumId, setAlbumId] = useState('242274622');

  // 获取专辑歌曲列表
  const handleGetAlbumSongList = async () => {
    console.log('获取专辑歌曲列表');
    try {
      const res = await getAlbumSongList(albumId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取专辑详情
  const handleGetAlbumDetail = async () => {
    console.log('获取专辑详情');
    try {
      const res = await getAlbumDetail(albumId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Form>
      {/* 测试获取专辑歌曲列表 */}
      <Form.Item label='获取专辑歌曲列表'>
        <Space>
          <Input
            placeholder='请输入专辑Id'
            addonBefore='专辑Id'
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
          />
          <Button type='primary' onClick={handleGetAlbumSongList}>
            获取专辑歌曲列表
          </Button>
          {/* 获取专辑详情 */}
          <Button type='primary' onClick={handleGetAlbumDetail}>
            获取专辑详情
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AlbumTab;

