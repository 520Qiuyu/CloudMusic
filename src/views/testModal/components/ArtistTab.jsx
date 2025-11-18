import { neteaseMusicToCloud } from '@/api';
import {
  getArtistAlbumList,
  getArtistAllSongList,
  getArtistTopSongList,
} from '@/api/artist';
import { MyButton } from '@/components';
import { promiseLimit } from '@/utils';
import { downloadFile } from '@/utils/download';
import { msgSuccess } from '@/utils/modal';
import { message } from 'antd';
import { Form, Input, Space } from 'antd';
import { useState } from 'react';

/**
 * 歌手相关测试组件
 */
const ArtistTab = () => {
  // 歌手id
  const [artistId, setArtistId] = useState('3684');

  // 获取歌手热门歌曲列表
  const handleGetArtistTopSongList = async () => {
    console.log('获取歌手热门歌曲列表');
    try {
      const res = await getArtistTopSongList(artistId);
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('获取歌手热门歌曲列表成功,请打开控制台查看！');
      }
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
      if (res.code === 200) {
        msgSuccess('获取歌手专辑成功,请打开控制台查看！');
      }
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
            downloadFile(
              item.picUrl?.split('?')[0] || item.cover?.split('?')[0],
              item.name + '.jpg',
            ),
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
      if (res.code === 200) {
        msgSuccess('获取歌手全部歌曲成功,请打开控制台查看！');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌手全部歌曲并转云盘
  const handleGetArtistAllSongListToCloud = async () => {
    console.log('获取歌手全部歌曲并转云盘');
    const uploadMessageKey = 'artist-all-song-list-to-cloud';
    try {
      const songRes = await getArtistAllSongList(artistId);
      if (songRes.code !== 200) {
        throw new Error('获取歌手全部歌曲失败');
      }
      const songs = songRes.songs;
      const songIds = songs.map((song) => song.id);
      message.loading({
        content: '开始上传歌手全部歌曲到云盘，请稍候...',
        key: uploadMessageKey,
        duration: 0,
      });
      const res = await neteaseMusicToCloud(songIds, {
        onChange: (progress) => {
          message.loading({
            content: `第${progress.current}首歌曲上传完成: ${progress.song.name}, 共${progress.total}首, 已上传${progress.successCount}首, 上传失败${progress.errorCount}首`,
            key: uploadMessageKey,
            duration: 0,
          });
        },
        onComplete: (result) => {
          message.destroy(uploadMessageKey);
          msgSuccess(
            `歌手全部歌曲转云盘完成, 共${result.total}首歌曲, 已上传${result.successCount}首, 上传失败${result.errorCount}首`,
          );
        },
      });
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
      message.destroy(uploadMessageKey);
    }finally{
      message.destroy(uploadMessageKey);
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
          <MyButton type='primary' onClick={handleGetArtistTopSongList}>
            获取歌手热门歌曲列表
          </MyButton>
          <MyButton type='primary' onClick={handleGetArtistAlbum}>
            获取歌手专辑
          </MyButton>
          {/* 下载专辑封面 */}
          <MyButton type='primary' onClick={handleGetArtistAlbumPic}>
            下载专辑封面
          </MyButton>
          <MyButton type='primary' onClick={handleGetArtistAllSongList}>
            获取歌手全部歌曲
          </MyButton>
          <MyButton type='primary' onClick={handleGetArtistAllSongListToCloud}>
            获取歌手全部歌曲并转云盘
          </MyButton>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ArtistTab;
