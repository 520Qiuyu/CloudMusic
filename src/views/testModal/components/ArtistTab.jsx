import {
  getArtistAlbumList,
  getArtistAllSongList,
  getArtistTopSongList,
} from '@/api/artist';
import { downloadFile } from '@/utils/download';
import { promiseLimit } from '@/utils';
import { Button, Form, Input, Space } from 'antd';
import { useState } from 'react';

/**
 * 歌手相关测试组件
 */
const ArtistTab = () => {
  // 歌手id
  const [artistId, setArtistId] = useState('3684');

  // 获取歌手歌曲列表
  const handleGetArtistTopSongList = async () => {
    console.log('获取歌手歌曲列表');
    try {
      const res = await getArtistTopSongList(artistId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌手专辑
  const handleGetArtistAlbum = async () => {
    console.log('获取歌手专辑');
    try {
      const res = await getArtistAlbumList(artistId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 下载专辑封面
  const handleGetArtistAlbumPic = async () => {
    console.log('下载专辑封面');
    try {
      const res = await getArtistAlbumList(artistId);
      console.log('res', res);
      if (res.code === 200) {
        const downloadTask = res.data.map(
          (item) => () =>
            downloadFile(item.picUrl?.split('?')[0] || item.cover?.split('?')[0], item.name + '.jpg'),
        );
        await promiseLimit(downloadTask, 1);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌手全部歌曲
  const handleGetArtistAllSongList = async () => {
    console.log('获取歌手全部歌曲');
    try {
      const res = await getArtistAllSongList(artistId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Form>
      {/* 测试获取歌手歌曲列表 */}
      <Form.Item label='获取歌手歌曲列表'>
        <Space wrap>
          <Input
            placeholder='请输入歌手Id'
            addonBefore='歌手Id'
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
          />
          <Button type='primary' onClick={handleGetArtistTopSongList}>
            获取歌手热门歌曲列表
          </Button>
          <Button type='primary' onClick={handleGetArtistAlbum}>
            获取歌手专辑
          </Button>
          {/* 下载专辑封面 */}
          <Button type='primary' onClick={handleGetArtistAlbumPic}>
            下载专辑封面
          </Button>
          <Button type='primary' onClick={handleGetArtistAllSongList}>
            获取歌手全部歌曲
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ArtistTab;

