import { useState, useEffect } from 'react';
import { getArtistName } from '..';
import { useSearchSinger } from '@/hooks/useSearchSinger';
import { useGetSingerSongs } from '@/hooks/useGetSingerSongs';
import { msgError, msgSuccess } from '@/utils/modal';
import { matchCloudSong } from '@/api';
import { on, off, EVENT_TYPES } from '@/utils/eventBus';
import { Input, Button, Select, Avatar, Spin, Tag } from 'antd';
import styles from '../index.module.scss';

const CustomMatch = ({ data, onUpdate }) => {
  const [keywords, setKeywords] = useState(getArtistName(data));
  const [currentSelectSinger, setCurrentSelectSinger] = useState();
  const [currentSelectSong, setCurrentSelectSong] = useState();
  const [songSearchValue, setSongSearchValue] = useState(data.name);
  const [currentSelectSongId, setCurrentSelectSongId] = useState();
  const { loading: searchSingerLoading, singerList } = useSearchSinger({
    keywords,
  });
  const { singerMap, loading: getSongLoading } = useGetSingerSongs({
    singerIds: currentSelectSinger,
  });

  /*  useEffect(() => {
    setCurrentSelectSinger(singerList?.[0]?.artistId);
  }, [singerList]); */

  /*   useEffect(() => {
    console.log("singerMap", singerMap);
    console.log("singerList", singerList);
    console.log("currentSelectSinger", currentSelectSinger);
    console.log("currentSelectSong", currentSelectSong);
    console.log("currentSelectSongId", currentSelectSongId);
  }, [singerMap, singerList, currentSelectSinger, currentSelectSong, currentSelectSongId]); */

  const [updateLoading, setUpdateLoading] = useState(false);
  const [autoMatchLoading, setAutoMatchLoading] = useState(false);

  // 监听全部匹配事件
  useEffect(() => {
    const handleMatchAll = async (eventData) => {
      console.log('CustomMatch 收到全部匹配事件', eventData);
      if (!currentSelectSinger || !currentSelectSongId) {
        console.log('当前组件未选择歌手或歌曲，跳过自动匹配');
        return;
      }

      handleUpdate();
    };

    // 订阅全部匹配事件
    on(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, handleMatchAll);

    // 组件卸载时取消订阅
    return () => {
      off(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, handleMatchAll);
    };
  }, [currentSelectSinger, currentSelectSongId, data, onUpdate]);

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      if (!currentSelectSinger || !currentSelectSongId) {
        msgError('请选择歌手和歌曲');
        return;
      }
      const res = await matchCloudSong(
        data.songId,
        currentSelectSongId,
        currentSelectSong,
      );
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('更新成功');
        // onUpdate?.();
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setUpdateLoading(false);
    }
  };
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      onClick={() => console.log(data)}>
      {/* 关键词搜索歌手 输入框 */}
      <Input
        style={{
          width: 120,
        }}
        defaultValue={keywords}
        placeholder='请输入歌手名'
        onPressEnter={(e) => {
          console.log('e', e);
          setKeywords(e.target.value);
        }}
      />
      {/* 歌手选择 下拉框 */}
      <Select
        style={{ width: 200 }}
        value={currentSelectSinger}
        onChange={(value) => {
          setCurrentSelectSinger(value);
        }}
        // open={data.songId == "1836625685"}
        popupMatchSelectWidth={300}
        showSearch
        placeholder='请选择歌手'
        filterOption={(input, option) => option?.label?.indexOf(input) >= 0}
        loading={searchSingerLoading}
        options={singerList.map((item) => ({
          ...item,
          label: item.artistName,
          value: item.artistId,
        }))}
        onFocus={() => {
          setCurrentSelectSinger(singerList?.[0]?.artistId);
        }}
        optionRender={(option) => {
          const { artistAvatarPicUrl, artistName, artistId } = option.data;
          return (
            <div
              className={styles['singer-option']}
              style={{
                '--avatar-url': `url(${artistAvatarPicUrl})`,
              }}>
              <div className={styles['singer-option-content']}>
                <div className={styles['singer-option-name']}>{artistName}</div>
                <div className={styles['singer-option-id']}>{artistId}</div>
              </div>
            </div>
          );
        }}
        dropdownRender={(originNode) => {
          return searchSingerLoading ? (
            <Spin
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
              }}
            />
          ) : (
            originNode
          );
        }}
      />
      {/* 歌手歌曲选择 下拉框 */}
      <Select
        style={{ width: 200 }}
        value={currentSelectSongId}
        onChange={(value, option) => {
          console.log('value', value, option);
          setCurrentSelectSongId(value);
          setCurrentSelectSong(option);
        }}
        showSearch
        searchValue={songSearchValue}
        onFocus={() => {
          console.log('data', data);
          setSongSearchValue(data.songName);
        }}
        onSearch={(value) => {
          setSongSearchValue(value);
        }}
        placeholder='请选择歌曲'
        filterOption={(input, option) => option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        loading={getSongLoading}
        options={singerMap[currentSelectSinger]?.songList?.map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        }))}
        popupMatchSelectWidth={500}
        optionRender={(option) => {
          const data = option.data;
          return (
            <div
              className={styles['song-option']}
              onClick={() => console.log('option', data, option, singerMap)}>
              <div className={styles['song-info']}>
                <span className={styles['song-name']}>{option.label}</span>
                <div className={styles['tag-group']}>
                  {data.al?.name && <Tag color='blue'>{data.al?.name}</Tag>}
                  {data.ar?.length &&
                    data.ar?.map((artist, index) => (
                      <Tag key={index} color='green'>
                        {artist.name}
                      </Tag>
                    ))}
                </div>
              </div>
              {/* 专辑图片 */}
              {singerMap[currentSelectSinger]?.albumMap[data.al?.id]
                ?.picUrl && (
                <img
                  className={styles['album-cover']}
                  src={
                    singerMap[currentSelectSinger]?.albumMap[data.al?.id]
                      ?.picUrl
                  }
                  alt={data.al?.name}
                />
              )}
            </div>
          );
        }}
        dropdownRender={(originNode) => {
          return getSongLoading ? (
            <Spin
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
              }}
            />
          ) : (
            originNode
          );
        }}
      />
      {/* 匹配按钮 */}
      <Button
        type='primary'
        size='small'
        loading={updateLoading || autoMatchLoading}
        disabled={!currentSelectSinger || !currentSelectSongId}
        onClick={handleUpdate}>
        {autoMatchLoading ? '自动匹配中...' : '匹配'}
      </Button>
    </div>
  );
};

export default CustomMatch;
