import {
  getSongAllComments,
  getSongComment,
  getSongComment1,
  getSongDynamicCover,
  getSongInfoList,
  getSongLyric,
  getSongUrl,
  listenSongCheckIn,
} from '@/api/song';
import { MyButton } from '@/components';
import { msgError, msgSuccess } from '@/utils/modal';
import { Form, Input, InputNumber, message, Space } from 'antd';
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

  // 获取歌曲评论
  const handleGetSongComment = async () => {
    try {
      const res = await getSongComment(songId.split(',')[0]);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌曲评论1
  const handleGetSongComment1 = async () => {
    try {
      const res = await getSongComment1(songId.split(',')[0]);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌曲所有评论
  const handleGetSongAllComments = async () => {
    const loadingMessageKey = 'get-song-all-comments';
    message.loading({
      content: '开始获取歌曲所有评论，请稍候...',
      key: loadingMessageKey,
      duration: 0,
    });
    try {
      const res = await getSongAllComments(songId.split(',')[0], {
        onChange: (progress) => {
          const { page, totalPage, total, allComments } = progress;
          message.loading({
            content: `当前正在获取第${page}/${totalPage}页评论，已获取${allComments.length}条评论，共${total}条评论`,
            key: loadingMessageKey,
            duration: 0,
          });
        },
      });
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    } finally {
      message.destroy(loadingMessageKey);
      message.success({
        content: '获取歌曲所有评论完成。',
        duration: 3000,
      });
    }
  };

  // 听歌打卡
  const [checkInData, setCheckInData] = useState({
    songId: '386005',
    checkInCount: 100,
  });
  const handleListenSongCheckIn = async () => {
    try {
      const { songId, checkInCount } = checkInData;
      const songRes = await getSongInfoList(songId.split(','));
      if (songRes.code !== 200) {
        return msgError('获取歌曲信息失败');
      }
      const songInfo = songRes.songs[0];
      const { id, al, dt } = songInfo;
      const res = await listenSongCheckIn({
        id,
        time: Math.floor(dt / 1000),
        checkInCount: +checkInCount,
      });
      console.log('res', res);
    } catch (error) {
      console.error('听歌打卡失败:', error);
      msgError(error.message || '听歌打卡失败');
    }
  };

  console.log('checkInData.checkInCount', checkInData.checkInCount);
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
          {/* 获取歌曲评论 */}
          <MyButton type='primary' onClick={handleGetSongComment}>
            获取歌曲评论
          </MyButton>
          {/* 获取歌曲评论1 */}
          <MyButton type='primary' onClick={handleGetSongComment1}>
            获取歌曲评论1
          </MyButton>
          {/* 获取歌曲所有评论 */}
          <MyButton type='primary' onClick={handleGetSongAllComments}>
            获取歌曲所有评论
          </MyButton>
        </Space>
      </Form.Item>
      <Form.Item label='听歌打卡'>
        <Space wrap>
          <Input
            placeholder='请输入歌曲Id'
            addonBefore='歌曲Id'
            value={checkInData.songId}
            onChange={(e) =>
              setCheckInData({ ...checkInData, songId: e.target.value })
            }
          />
          <Input
            type='number'
            placeholder='请输入打卡次数'
            addonBefore='打卡次数'
            value={checkInData.checkInCount}
            onChange={(e) =>
              setCheckInData({ ...checkInData, checkInCount: e.target.value })
            }
          />
          <MyButton type='primary' onClick={handleListenSongCheckIn}>
            听歌打卡
          </MyButton>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SongTab;
