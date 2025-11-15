import { neteaseMusicToCloud } from '@/api';
import { getAlbumDetail, getAlbumSongList } from '@/api/album';
import { MyButton } from '@/components';
import { msgSuccess } from '@/utils/modal';
import { Form, Input, Space, message } from 'antd';
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
      if (res.code === 200) {
        msgSuccess('获取专辑歌曲列表成功,请打开控制台查看！');
      }
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
      if (res.code === 200) {
        msgSuccess('获取专辑详情成功,请打开控制台查看！');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 专辑歌曲转云盘
  const handleNeteaseMusicToCloud = async () => {
    console.log('专辑歌曲转云盘');
    const uploadMessageKey = 'album-to-cloud';
    try {
      // 获取专辑歌曲列表
      const res = await getAlbumSongList(albumId);
      console.log('res', res);
      if (res.code === 200) {
        const songs = res.songs;
        const songIds = songs.map((song) => song.id);
        await neteaseMusicToCloud(songIds, {
          onChange: (progress) => {
            console.log('progress', progress);
            message.loading({
              content: `第${progress.current}首歌曲上传完成: ${progress.song.name}, 共${progress.total}首, 已上传${progress.successCount}首, 上传失败${progress.errorCount}首`,
              key: uploadMessageKey,
              duration: 0,
            });
          },
          onComplete: (result) => {
            console.log('result', result);
            message.destroy(uploadMessageKey);
            msgSuccess(
              `专辑歌曲转云盘完成, 共${result.total}首歌曲, 已上传${result.successCount}首, 上传失败${result.errorCount}首`,
            );
          },
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      message.destroy(uploadMessageKey);
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
          <MyButton type='primary' onClick={handleGetAlbumSongList}>
            获取专辑歌曲列表
          </MyButton>
          {/* 获取专辑详情 */}
          <MyButton type='primary' onClick={handleGetAlbumDetail}>
            获取专辑详情
          </MyButton>
          <MyButton type='primary' onClick={handleNeteaseMusicToCloud}>
            专辑歌曲转云盘
          </MyButton>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AlbumTab;
