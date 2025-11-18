import SearchForm from '@/components/SearchForm';
import useFilter from '@/hooks/useFilter';
import { useVisible } from '@/hooks/useVisible';
import { downloadFile, downloadJsonFile } from '@/utils/download';
import {
  CopyrightOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
} from '@ant-design/icons';
import { Button, Input, Modal, Table, Tag, message } from 'antd';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  addSongToPlaylist,
  createPlaylist,
  deleteCloudSong,
  getCloudData,
  getPlaylistList,
  getSongUrl,
  matchCloudSong,
} from '../../api';
import {
  isMobile,
  normalizeString,
  promiseLimit,
  sleep,
  truncateString,
} from '../../utils';
import { confirm, msgError, msgSuccess, msgWarning } from '../../utils/modal';
import { emit, EVENT_TYPES } from '../../utils/eventBus';
import CustomMatch from './components/CustomMatch';
import IdMatch from './components/IdMatch';
import PlayList from './components/PlayList';
import Stats from './components/Stats';
import styles from './index.module.scss';
import dayjs from 'dayjs';

const CloudMusicManager = forwardRef((props, ref) => {
  const { visible, open, close, reset } = useVisible(
    {
      onOpen() {
        getCloudDataList();
      },
    },
    ref,
  );

  const [songList, setSongList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取云盘数据
  const getCloudDataList = async () => {
    try {
      setLoading(true);
      const res = await getCloudData(10000, 0);
      if (res.code === 200) {
        console.log('songList', res.data);
        setSongList(res.data);
        setFilteredSongList(res.data);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = () => {
    console.log('触发全部匹配事件');
    // 发布全部匹配事件，通知所有相关组件
    emit(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, {
      songList: filteredSongList,
      timestamp: Date.now(),
    });
  };

  const [cancelMatchLoading, setCancelMatchLoading] = useState(false);
  const handleCancelMatch = async () => {
    try {
      setCancelMatchLoading(true);
      const promises = selectedRowKeys.map((songId) => {
        return () => matchCloudSong(songId, '0');
      });
      const res = await promiseLimit(promises, 6);
      console.log('res', res);
      getCloudDataList();
    } catch (error) {
      console.log('error', error);
    } finally {
      setCancelMatchLoading(false);
    }
  };

  // 筛选后的歌曲列表
  // 使用useFilter hook处理筛选逻辑
  const filterConfig = {
    fields: {
      name: {
        getValue: (song) => song?.simpleSong?.name,
      },
      artist: {
        getValue: getArtistName,
      },
      album: {
        getValue: getAlbumName,
      },
    },
  };
  const [searchParams, setSearchParams] = useState({});
  const {
    filteredList: filteredSongList,
    setFilteredList: setFilteredSongList,
    handleFilter: handleSearch,
  } = useFilter(songList, filterConfig);
  useEffect(() => {
    handleSearch(searchParams);
  }, [songList]);

  /** 选择 */
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedRowKeys = useMemo(
    () => selectedRows.map((item) => item.songId),
    [selectedRows],
  );
  const rowSelection = {
    type: 'checkbox',
    fixed: true,
    selectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.uploaded,
    }),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };
  const handleTableChange = (pagination, filters, sorter) => {
    console.log('sorter', sorter);
    setFilteredSongList((songList) => {
      return [...songList].sort((a, b) => {
        const order = sorter.order === 'ascend' ? 1 : -1;
        return order * sorter.column?.sorter?.(a, b);
      });
    });
  };

  const AudioRef = useRef(new Audio());
  const [playSong, setPlaySong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const handlePlaySong = (record) => {
    // 如果正在播放当前歌曲，则暂停
    if (playSong?.id === record.id) {
      const audio = AudioRef.current;
      playing ? audio.pause() : audio.play();
      setPlaying(!playing);
      return;
    }
    setPlaySong(record);
    setPlaying(true);
  };
  const play = async () => {
    try {
      const res = await getSongUrl([playSong.id]);
      console.log('res', res);
      if (res.code !== 200) return msgError('获取歌曲链接失败');
      const audio = AudioRef.current;
      audio.src = res.data[0].url;
      audio.addEventListener('ended', () => {
        setPlaySong(null);
      });
      audio.addEventListener('error', () => {
        setPlaySong(null);
      });
      audio.play();
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    if (!playSong) return;
    play();
  }, [playSong]);

  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 20,
  });
  const renderSongInfo = (_, record, index) => {
    // 是否播放当前歌曲
    const isCurrentSong = record.simpleSong?.id === playSong?.id;
    const artistName = getArtistName(record);
    const albumName = getAlbumName(record);
    const songName = record.simpleSong?.name;
    const albumPic = record.simpleSong?.al?.picUrl;
    return (
      <div className={styles.songInfoColumn}>
        <div className={styles.songIndex}>
          {(pageParams.page - 1) * pageParams.pageSize + index + 1}
        </div>
        <div
          className={`${styles.songCover} ${
            isCurrentSong ? styles.playing : ''
          }`}
          onClick={() => handlePlaySong(record.simpleSong)}>
          {/* 封面 */}
          <img src={albumPic} alt={albumName} className={styles.songCoverImg} />
          {/* 播放/暂停按钮 */}
          <div className={styles.btnWrapper}>
            {isCurrentSong && playing ? (
              <PauseCircleFilled style={{ fontSize: '24px', color: '#fff' }} />
            ) : (
              <PlayCircleFilled style={{ fontSize: '24px', color: '#fff' }} />
            )}
          </div>
        </div>
        <div className={styles.songInfo}>
          <div className={styles.songName}>{songName}</div>
          <div className={styles.subInfo}>
            {/* 歌手 */}
            <div className={styles.artist}>{artistName}</div>
            {/* 专辑 */}
            <div className={styles.album}>
              {albumName && ' - '}
              {albumName}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: '歌名',
      dataIndex: 'simpleSong',
      key: 'name',
      width: 300,
      fixed: !isMobile() ? 'left' : undefined,
      sorter: (a, b) => a.simpleSong.name?.localeCompare(b.simpleSong.name),
      sortDirections: ['ascend', 'descend'],
      render: renderSongInfo,
    },
    {
      title: '歌手',
      dataIndex: 'simpleSong',
      key: 'artists',
      width: 60,
      sorter: (a, b) => {
        const aArtists = a.simpleSong.ar?.map((a) => a.name).join(',');
        const bArtists = b.simpleSong.ar?.map((a) => a.name).join(',');
        return aArtists?.localeCompare(bArtists);
      },
      fixed: !isMobile() ? 'left' : undefined,
      sortDirections: ['ascend', 'descend'],
      ellipsis: true,
      render: null,
    },
    {
      title: '专辑',
      dataIndex: 'simpleSong',
      key: 'album',
      width: 60,
      fixed: !isMobile() ? 'left' : undefined,
      sorter: (a, b) =>
        a.simpleSong.al?.name?.localeCompare(b.simpleSong.al?.name),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
      ellipsis: true,
      render: null,
    },
    // 歌曲原始专辑
    {
      title: '原始专辑',
      dataIndex: 'simpleSong.al.name',
      width: 160,
      fixed: 'left',
      ellipsis: true,
      sorter: (a, b) => {
        const aOriginalInfo = getOriginalInfo(a);
        const bOriginalInfo = getOriginalInfo(b);
        return aOriginalInfo.album?.localeCompare(bOriginalInfo.album);
      },
      sortDirections: ['ascend', 'descend'],
      render: (_, record) => {
        const { song, album, artist } = getOriginalInfo(record);
        return (
          <div className={styles['original-album']}>
            <div className={styles['song-info']} title={song}>
              {song} {artist && `· ${artist}`}
            </div>
            <div className={styles['album-info']} title={album}>
              {album}
            </div>
          </div>
        );
      },
    },
    // 云盘歌曲匹配
    {
      title: '手动id匹配',
      dataIndex: 'matchType',
      key: 'matchType',
      width: 300,
      sorter: (a, b) => {
        const isAMatched = a.matchType === 'matched';
        const isBMatched = b.matchType === 'matched';
        // 如果都没匹配，则位置不变
        if (!isAMatched && !isBMatched) {
          return 0;
        }
        // 如果a没匹配，b匹配，则b在前
        if (!isAMatched && isBMatched) {
          return 1;
        }
        // 如果a匹配，b没匹配，则a在前
        if (isAMatched && !isBMatched) {
          return -1;
        }
        // 如果a匹配，b匹配，看是否可能存在匹配错误
        const aAlbum = getAlbumName(a);
        const bAlbum = getAlbumName(b);
        const aOriginalAlbum = getOriginalInfo(a).album;
        const bOriginalAlbum = getOriginalInfo(b).album;
        const aMatchError = aAlbum !== aOriginalAlbum;
        const bMatchError = bAlbum !== bOriginalAlbum;
        if (aMatchError && !bMatchError) {
          return 1;
        }
        if (!aMatchError && bMatchError) {
          return -1;
        }
        return 0;
      },
      sortDirections: ['ascend', 'descend'],
      render: (matchType, r) => (
        <IdMatch data={r} onUpdate={getCloudDataList} />
      ),
    },
    // 自定义匹配
    {
      title: '自定义匹配',
      dataIndex: 'customMatch',
      key: 'customMatch',
      width: 500,
      render: (_, record) => (
        <CustomMatch data={record} onUpdate={getCloudDataList} />
      ),
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      sorter: (a, b) => a.fileSize - b.fileSize,
      sortDirections: ['ascend', 'descend'],
      render: (size) => `${(size / 1024 / 1024).toFixed(2)}MB`,
    },

    {
      title: '比特率',
      dataIndex: 'bitrate',
      key: 'bitrate',
      width: 100,
      sorter: (a, b) => a.bitrate - b.bitrate,
      sortDirections: ['ascend', 'descend'],
      render: (bitrate) => <Tag color='blue'>{bitrate}kbps</Tag>,
    },
    {
      title: '上传时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 150,
      sorter: (a, b) => a.addTime - b.addTime,
      sortDirections: ['ascend', 'descend'],
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  // 区间选择
  const [range, setRange] = useState([]);
  const handleRangeChoose = () => {
    console.log('range', range);
    if (!range[0] || !range[1]) return msgWarning('请输入区间');
    if (range[0] > range[1]) return msgWarning('区间错误');
    console.log(
      'filteredSongList.slice(range[0] - 1, range[1])',
      filteredSongList,
      filteredSongList.slice(range[0] - 1, range[1]),
    );
    setSelectedRows(filteredSongList.slice(range[0] - 1, range[1]));
  };

  // 自动按专辑添加
  const [addToPlayListByAlbumLoading, setAddToPlayListByAlbumLoading] =
    useState(false);
  const handleAddToPlaylistByAlbum = async () => {
    try {
      setAddToPlayListByAlbumLoading(true);
      console.log('自动按专辑添加');
      // 将歌曲按专辑分类
      const albumMap = new Map();
      filteredSongList.forEach((song) => {
        const { simpleSong } = song;
        const album = `${simpleSong.ar?.[0]?.name || ''}-${
          simpleSong.al?.name
        }`;
        if (!albumMap.has(album)) {
          albumMap.set(album, []);
        }
        albumMap.get(album).push(song);
      });

      const totalSongs = filteredSongList.length;
      const albums = Array.from(albumMap.entries()).sort(
        ([, songsA], [, songsB]) => songsB.length - songsA.length,
      );

      await confirm(
        <AutoAddContent totalSongs={totalSongs} albums={albums} />,
        '自动按专辑添加',
        {
          width: 'auto',
        },
      );

      // 获取歌单信息
      const res = await getPlaylistList();
      console.log('res', res);
      if (res.code !== 200) return msgError('获取歌单失败');
      const playlist = res.playlist;
      // 遍历歌单
      for (const [album, songs] of albums) {
        try {
          const playlistName = album;
          console.log('playlistName', playlistName, 'songs', songs);
          let playlistId = playlist.find((p) => p.name === playlistName)?.id;
          if (!playlistId) {
            // 创建歌单（限制40字符）
            const truncatedName = truncateString(playlistName, 40);
            const res = await createPlaylist(truncatedName);
            if (res.code === 200) {
              playlistId = res.id;
            } else {
              console.log('res', res);
              debugger;
            }
            await sleep(1000);
          }
          // 添加歌曲
          const songIds = songs.map((song) => song.songId);
          const res = await addSongToPlaylist(playlistId, songIds);
          console.log('res', res);
          if (res.code !== 200) {
            console.log('添加歌曲失败', res.message || res.msg);
          }
          await sleep(500);
        } catch (error) {
          console.log('error', error);
        }
      }
      // 添加成功
      setSelectedRows([]);
      msgSuccess('添加成功');
    } catch (error) {
      console.log('error', error);
    } finally {
      setAddToPlayListByAlbumLoading(false);
    }
  };

  // 偷取资源
  const handleStoleSong = async () => {
    /**
     * {
      "artist": "筷子兄弟",
      "artists": ["筷子兄弟"],
      "album": "父亲",
      "id": 362996,
      "size": 32855545,
      "md5": "e8805543d8b8d66b95567b1d682674bd",
      "name": "父亲",
      "ext": "flac",
      "bitrate": 938,
      "match": 362996
    },
     */
    console.log('selectedRows', selectedRows);
    const stolenList = selectedRows.map((item) => {
      const {
        artist,
        album,
        ar,
        simpleSong,
        privateCloud,
        songId,
        fileSize,
        songName,
        fileName,
        bitrate,
      } = item;
      return {
        artist,
        artists: ar?.map((a) => a.name) || [artist],
        album: album || getAlbumName(item),
        id: songId,
        size: fileSize,
        md5: privateCloud.md5,
        name: songName,
        ext: fileName.split('.')[1] || 'mp3',
        bitrate,
      };
    });
    downloadJsonFile(stolenList, 'stolenList.json');
  };

  // 下载资源
  const handleDownloadSong = async () => {
    console.log('selectedRows', selectedRows);
    const ids = selectedRows.map((item) => item.songId);
    const res = await getSongUrl(ids);
    if (res.code !== 200) return msgError('获取歌曲url失败');
    console.log('res', res);
    const downloadTask = res.data.map(
      ({ url, type, encodeType }, index) =>
        () => {
          const item = selectedRows[index];
          downloadFile(
            url.replace('http://', 'https://'),
            item.songName + '.' + encodeType,
          );
        },
    );
    await promiseLimit(downloadTask, 1);
  };

  // 添加到歌单
  const playListRef = useRef(null);
  const handleAddToPlaylist = async () => {
    try {
      console.log('添加到歌单');
      playListRef.current.open('select');
      const playlist = await playListRef.current.submit();
      if (!playlist) return;
      const songIds = selectedRows.map((item) => item.songId);
      const res = await addSongToPlaylist(playlist.id, songIds);
      console.log('res', res);
      if (res.code === 200) {
        setSelectedRows([]);
        msgSuccess('添加成功');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 新建歌单
  const handleCreatePlaylist = () => {
    playListRef.current.open();
  };

  // 删除歌曲
  const handleDeleteSong = async () => {
    try {
      const confirmContent = (
        <DeleteConfirmation
          selectedCount={selectedRows.length}
          songNames={selectedRows.map((item) => item.simpleSong.name)}
        />
      );
      await confirm(confirmContent, '删除确认');
      const songIds = selectedRows.map((item) => item.songId);
      const res = await deleteCloudSong(songIds);
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('删除成功');
        reset();
        getCloudDataList();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Modal
      title='云盘音乐管理'
      open={visible}
      onCancel={close}
      footer={null}
      centered
      width={1700}>
      <SearchForm
        onSearch={(values) => {
          console.log('values', values);
          setSearchParams(values);
          handleSearch(values);
        }}
        data={songList.map((item) => {
          return {
            ...item,
            name: item.simpleSong.name,
            artist: getArtistName(item),
            album: getAlbumName(item),
          };
        })}
        options={[
          { label: '歌曲', value: 'name' },
          { label: '歌手', value: 'artist' },
          { label: '专辑', value: 'album' },
        ]}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 16,
          marginBottom: 16,
        }}>
        <Button type='primary' onClick={handleMatch}>
          全部匹配
        </Button>
        {/* 全部取消匹配 */}
        <Button
          type='primary'
          disabled={!selectedRows.length}
          loading={cancelMatchLoading}
          onClick={handleCancelMatch}>
          全部取消匹配
        </Button>
        <Button type='primary' onClick={getCloudDataList}>
          刷新
        </Button>
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={filteredSongList}
        columns={columns}
        scroll={{ y: 500, x: 1000 }}
        size='small'
        loading={loading}
        rowKey={({ songId }) => songId}
        rowClassName={(record) => {
          const { songId } = record;
          const classNames = [];
          // 是否播放当前歌曲
          if (songId === playSong?.id) {
            classNames.push(styles.currentSong);
          }
          // 是否检测到匹配错误
          const isMatch = record.matchType === 'matched';
          const album = normalizeString(getAlbumName(record));
          const originalAlbum = normalizeString(getOriginalInfo(record)?.album);
          if (isMatch && !album.includes(originalAlbum.slice(0, 3))) {
            classNames.push(styles.matchError);
          }
          return classNames.join(' ');
        }}
        onChange={handleTableChange}
        pagination={{
          defaultPageSize: 20,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: (page, pageSize) => setPageParams({ page, pageSize }),
        }}
      />
      <div className={styles.footer}>
        <Stats
          selectedRows={selectedRows}
          filteredSongList={filteredSongList}
        />
        <div className={styles.actions}>
          {/* 区间选择 输入两个坐标 选择排序后的其中的歌曲 */}
          <Input
            style={{
              width: 100,
            }}
            value={range[0]}
            onChange={(e) => {
              setRange([+e.target.value || undefined, range[1]]);
            }}
            placeholder='起始位置'
          />
          <Input
            style={{
              width: 100,
            }}
            value={range[1]}
            onChange={(e) => setRange([range[0], +e.target.value || undefined])}
            placeholder='结束位置'
          />
          <Button onClick={handleRangeChoose} style={{ marginRight: 10 }}>
            区间选择
          </Button>

          {/* 全选 */}
          {filteredSongList?.length > selectedRows?.length ? (
            <Button onClick={() => setSelectedRows(filteredSongList)}>
              全部选择
            </Button>
          ) : (
            <Button onClick={() => setSelectedRows([])}>全部取消</Button>
          )}
          {/* 反选 */}
          <Button
            onClick={() =>
              setSelectedRows(
                filteredSongList.filter((item) => !selectedRows.includes(item)),
              )
            }>
            反选
          </Button>
          {/* 自动按专辑添加 */}
          <Button
            type='primary'
            onClick={handleAddToPlaylistByAlbum}
            loading={addToPlayListByAlbumLoading}>
            自动按专辑添加
          </Button>
          {/* 偷取资源 */}
          <Button
            type='primary'
            disabled={!selectedRows.length}
            onClick={handleStoleSong}>
            偷取资源
          </Button>
          {/* 下载资源 */}
          {/* <Button
            type='primary'
            disabled={!selectedRows.length}
            onClick={handleDownloadSong}>
            下载资源
          </Button> */}
          {/* 添加到歌单 */}
          <Button
            type='primary'
            disabled={!selectedRows.length}
            onClick={handleAddToPlaylist}>
            添加到歌单
          </Button>
          <Button onClick={handleCreatePlaylist}>新建歌单</Button>
          {/* 删除歌曲  */}
          <Button
            type='primary'
            danger
            disabled={!selectedRows.length}
            onClick={handleDeleteSong}>
            删除歌曲
          </Button>
        </div>
      </div>

      {/* 歌单列表弹窗 */}
      <PlayList ref={playListRef} />
    </Modal>
  );
});

// 自动添加内容组件
const AutoAddContent = ({ totalSongs, albums }) => {
  // 复制歌单列表
  const handleCopy = () => {
    const text = albums
      .map(([name, songs]) => `${name}（${songs.length}首）`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      message.success('复制成功');
    });
  };

  return (
    <div className={styles.autoAddContent}>
      {/* 总计信息 */}
      <div className={styles.statsWrapper}>
        <div className={styles.title}>总计：</div>
        <div className={styles.statsContent}>
          <div>
            <span className={styles.label}>歌曲数：</span>
            <span className={styles.value}>{totalSongs}</span>
            <span className={styles.label}> 首</span>
          </div>
          <div>
            <span className={styles.label}>歌单数：</span>
            <span className={styles.value}>{albums.length}</span>
            <span className={styles.label}> 个</span>
          </div>
        </div>
      </div>

      {/* 歌单列表 */}
      <div>
        <div className={styles.listHeader}>
          <div className={styles.title}>即将创建的歌单：</div>
          <Button
            type='link'
            size='small'
            icon={<CopyrightOutlined />}
            onClick={handleCopy}>
            复制列表
          </Button>
        </div>
        <ul className={styles.listWrapper}>
          {albums.map(([name, songs]) => (
            <li key={name} className={styles.listItem}>
              <span className={styles.itemName}>{name}</span>
              <span className={styles.itemCount}>{songs.length}首</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 删除确认组件
const DeleteConfirmation = ({ selectedCount, songNames }) => {
  return (
    <div className={styles.deleteConfirmation}>
      <p className={styles.title}>
        您确定要删除以下 <span className={styles.count}>{selectedCount}</span>{' '}
        首歌曲吗？
      </p>
      <div className={styles.songs}>
        {songNames.map((name, index) => (
          <div key={index} className={styles.songItem}>
            {name}
          </div>
        ))}
      </div>
      <div className={styles.warning}>
        <p className={styles.text}>
          <span className={styles.icon}>!</span>
          注意：此操作不可恢复，删除后歌曲将从您的网易云音乐云盘中永久移除。
        </p>
      </div>
    </div>
  );
};

export default CloudMusicManager;

export const getArtistName = (song) => {
  return (
    song.simpleSong.ar
      ?.map((a) => a.name)
      .filter(Boolean)
      .join(',') ||
    song.artist ||
    ''
  );
};
export const getAlbumName = (song) => {
  return song.simpleSong.al?.name || song.album || '';
};

export const getOriginalInfo = (record) => {
  const { simpleSong } = record;
  const { song, album, artist } = simpleSong.privilege?.pc || {};
  return { song, album, artist };
};
