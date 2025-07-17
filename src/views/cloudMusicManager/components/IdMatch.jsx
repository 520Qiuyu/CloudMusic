import { matchCloudSong } from '@/api';
import { msgSuccess } from '@/utils/modal';
import { on, off, EVENT_TYPES } from '@/utils/eventBus';
import { Button, Input } from 'antd';
import { Tag } from 'antd';
import { useState, useEffect } from 'react';

const IdMatch = ({ data, onUpdate }) => {
  const { matchType, songId } = data;
  const isMatched = matchType === 'matched';

  const [value, setValue] = useState(songId);
  const [loading, setLoading] = useState(false);
  const [autoMatchLoading, setAutoMatchLoading] = useState(false);

  // 监听全部匹配事件
  useEffect(() => {
    const handleMatchAll = async (eventData) => {
      console.log('IdMatch 收到全部匹配事件', eventData);
      if (!value || value === songId) {
        console.log('当前组件未设置匹配ID，跳过自动匹配');
        return;
      }
      
      try {
        setAutoMatchLoading(true);
        console.log('开始自动ID匹配歌曲:', data.songName);
        
        const res = await matchCloudSong(songId, value);
        
        if (res.code === 200) {
          console.log('自动ID匹配成功:', data.songName);
          onUpdate?.();
        } else {
          console.log('自动ID匹配失败:', data.songName, res.message);
        }
      } catch (error) {
        console.log('自动ID匹配出错:', data.songName, error);
      } finally {
        setAutoMatchLoading(false);
      }
    };

    // 订阅全部匹配事件
    on(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, handleMatchAll);

    // 组件卸载时取消订阅
    return () => {
      off(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, handleMatchAll);
    };
  }, [value, songId, data, onUpdate]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await matchCloudSong(songId, value);
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('更新成功');
        onUpdate?.();
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Tag color={isMatched ? 'green' : 'red'}>
        {isMatched ? '已匹配' : '未匹配'}
      </Tag>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        size='small'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleUpdate();
          }
        }}
        style={{ flex: 1, marginRight: 8 }}
      />
      <Button
        type='primary'
        onClick={handleUpdate}
        loading={loading || autoMatchLoading}
        size='small'
      >
        {autoMatchLoading ? '自动匹配中...' : '更新'}
      </Button>
    </div>
  );
};

export default IdMatch;
