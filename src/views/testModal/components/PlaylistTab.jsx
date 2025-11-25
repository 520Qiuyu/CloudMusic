import { neteaseMusicToCloud } from '@/api';
import {
  addSongToPlaylist,
  createPlaylist,
  getPlaylistAllData,
  getPlaylistList,
  updateSongOrder,
} from '@/api/playlist';
import { MyButton } from '@/components';
import { SONG_SORT_RULES } from '@/constant';
import { useConfig } from '@/hooks';
import { msgError, msgSuccess } from '@/utils/modal';
import { Form, Input, Select, Space, message } from 'antd';
import { useMemo, useState } from 'react';

/**
 * 歌单相关测试组件
 */
const PlaylistTab = () => {
  const { defaultSongSortRule, functionConfig } = useConfig();
  const { liveKeywords } = functionConfig;

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
  // 获取歌单详情
  const handleGetPlaylist = async () => {
    try {
      const songs = await getPlaylistAllData(playlistId);
      console.log('songs', songs);
      msgSuccess(
        '获取歌单信息成功, 共' + songs.length + '首歌曲, 请打开控制台查看。',
      );
    } catch (error) {
      console.log('error', error);
    }
  };
  // 歌单歌曲转云盘
  const handlePlaylistToCloud = async () => {
    console.log('歌单歌曲转云盘');
    const uploadMessageKey = 'playlist-to-cloud';
    try {
      const songs = await getPlaylistAllData(playlistId);
      const songIds = songs.map((song) => song.id);
      message.loading({
        content: '开始上传歌单歌曲到云盘，请稍候...',
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
          console.log('result', result);
          msgSuccess(
            `歌单歌曲转云盘完成, 共${result.total}首歌曲, 已上传${result.successCount}首, 上传失败${result.errorCount}首`,
          );
        },
      });
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
      message.destroy(uploadMessageKey);
    } finally {
      message.destroy(uploadMessageKey);
    }
  };
  const [sorterRuleValue, setSorterRuleValue] = useState(
    defaultSongSortRule.value,
  );
  const sortRule = useMemo(
    () => SONG_SORT_RULES.find((rule) => rule.value === sorterRuleValue).rule,
    [sorterRuleValue],
  );
  // 按专辑排序、演唱会靠后
  const handleUpdateSongOrder = async () => {
    console.log('按专辑排序、演唱会靠后');
    try {
      const songs = await getPlaylistAllData(playlistId);
      console.log('songs', songs);
      const keywords = liveKeywords;
      const liveSongs = songs.filter((song) =>
        keywords.some((keyword) => song.al?.name.includes(keyword)),
      );
      const otherSongs = songs.filter((song) => !liveSongs.includes(song));
      console.log('演唱会歌曲', liveSongs);
      console.log('其他歌曲', otherSongs);
      const sortedSongs = [
        ...otherSongs.sort(sortRule),
        ...liveSongs.sort(sortRule),
      ];
      console.log('sortedSongs', sortedSongs);
      const res = await updateSongOrder(
        playlistId,
        sortedSongs.map((song) => song.id),
      );
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('按专辑排序、演唱会靠后成功');
      } else {
        msgError(res.message || '按专辑排序、演唱会靠后失败');
      }
    } catch (error) {
      console.log('error', error);
      msgError('按专辑排序、演唱会靠后失败');
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
          <MyButton type='primary' onClick={handleCreateSongList}>
            新建歌单
          </MyButton>
        </Space>
      </Form.Item>

      {/* 测试向歌单添加歌曲 */}
      <Form.Item label='向歌单添加歌曲'>
        <Space wrap>
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
            onChange={(e) => setAddInfo({ ...addInfo, songId: e.target.value })}
          />
          <MyButton type='primary' onClick={handleAddSong}>
            添加歌曲
          </MyButton>
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
          <MyButton type='primary' onClick={handleGetPlaylistList}>
            获取用户歌单列表
          </MyButton>
        </Space>
      </Form.Item>

      {/* 测试获取歌单详情 */}
      <Form.Item label='测试获取歌单详情'>
        <Space wrap>
          <Input
            placeholder='请输入歌单Id'
            addonBefore='歌单Id'
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
          />
          <MyButton type='primary' onClick={handleGetPlaylist}>
            获取歌单详情
          </MyButton>
          <MyButton type='primary' onClick={handlePlaylistToCloud}>
            歌单歌曲转云盘
          </MyButton>
          <Select
            options={SONG_SORT_RULES.map((rule) => ({
              label: rule.name,
              value: rule.value,
            }))}
            value={sorterRuleValue}
            onChange={(value) => setSorterRuleValue}
            style={{ width: 250 }}
            placeholder='请选择排序规则'
          />
          {/* 按专辑排序、演唱会靠后 */}
          <MyButton type='primary' onClick={handleUpdateSongOrder}>
            排序
          </MyButton>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PlaylistTab;
