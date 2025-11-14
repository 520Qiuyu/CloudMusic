import {
  getSongDynamicCover,
  getSongInfoList,
  getSongLyric,
  getSongUrl,
} from '@/api/song';
import { MyButton } from '@/components';
import { msgSuccess } from '@/utils/modal';
import { Form, Input, Space } from 'antd';
import { useState } from 'react';

/**
 * 歌曲相关测试组件
 */
const SongTab = () => {
  // 歌曲id
  const [songId, setSongId] = useState('2608471890,1846094285');

  // 获取歌曲URL
  const handleGetSongUrl = async () => {
    console.log('获取歌曲URL');
    try {
      const res = await getSongUrl([songId]);
      console.log('res', res);
      if (res.code === 200) {
        const url = res.data[0].url;
        await navigator.clipboard.writeText(url);
        msgSuccess('获取成功,已复制到剪切板');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌曲信息
  const handleGetSongInfo = async () => {
    console.log('获取歌曲信息');
    try {
      const res = await getSongInfoList(songId.split(','));
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('获取成功,请打开控制台查看！');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌曲歌词
  const handleGetSongLyric = async () => {
    console.log('获取歌曲歌词');
    try {
      const res = await getSongLyric(songId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌曲动态封面
  const handleGetSongDynamicCover = async () => {
    try {
      const res = await getSongDynamicCover(songId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Form>
      {/* 测试获取歌曲信息 */}
      <Form.Item label='获取歌曲信息'>
        <Space wrap>
          <Input
            placeholder='请输入歌曲Id'
            addonBefore='歌曲Id'
            value={songId}
            onChange={(e) => setSongId(e.target.value)}
          />
          <MyButton type='primary' onClick={handleGetSongUrl}>
            获取歌曲URL
          </MyButton>
          {/* 获取歌曲信息 */}
          <MyButton type='primary' onClick={handleGetSongInfo}>
            获取歌曲信息
          </MyButton>
          {/* 获取歌曲歌词 */}
          <MyButton type='primary' onClick={handleGetSongLyric}>
            获取歌曲歌词
          </MyButton>
          {/* 获取歌曲动态封面 */}
          <MyButton type='primary' onClick={handleGetSongDynamicCover}>
            获取歌曲动态封面
          </MyButton>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SongTab;
