import { getPlaylistAllData } from '@/api';
import SearchForm from '@/components/SearchForm';
import { QUALITY_LEVELS } from '@/constant';
import useFilter from '@/hooks/useFilter';
import { usePlayMusic } from '@/hooks/usePlayMusic';
import { useVisible } from '@/hooks/useVisible';
import {
  DownloadOutlined,
  FileOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { forwardRef, useEffect, useState } from 'react';
import styles from './index.module.scss';
dayjs.extend(duration);

function SongList(props, ref) {
  const { visible, open, close } = useVisible(
    {
      onOpen(id) {
        setPlaylistId(id);
      },
      onReset() {
        setSongList([]);
        setPlaylistId(null);
      },
    },
    ref,
  );

  const { getUrl, play, pause, isPlaying, download, playPlayList } =
    usePlayMusic();

  const [loading, setLoading] = useState(false);
  const [songList, setSongList] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // 获取歌曲列表
  const getSongListData = async (playlistId) => {
    if (!playlistId) return;
    try {
      setLoading(true);
      const res = await getPlaylistAllData(playlistId);
      console.log('res', res);
      setSongList(res);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (playlistId && visible) {
      getSongListData(playlistId);
    }
  }, [playlistId, visible]);

  // 使用useFilter hook处理筛选逻辑
  const filterConfig = {
    fields: {
      name: {
        getValue: (song) => song.name,
      },
      artists: {
        getValue: (song) => song.ar?.map((artist) => artist.name).join(', '),
      },
      album: {
        getValue: (song) => song.al?.name,
      },
    },
  };
  const {
    filteredList: filteredSongList,
    setFilteredList: setFilteredSongList,
    handleFilter: handleSearch,
  } = useFilter(songList, filterConfig);

  /** 选择音质 */
  const handleSelectQuality = (record, value) => {
    console.log('record', record);
    console.log('value', value);
    setFilteredSongList((prev) => {
      return prev.map((song) => {
        if (song.id === record.id) {
          return { ...song, level: value };
        }
        return song;
      });
    });
  };
  /** 播放歌曲 */
  const handlePlay = (record) => {
    console.log('record', record);
    if (isPlaying === record.id) {
      pause();
    } else {
      play(record.id, record.level);
    }
  };
  /** 下载歌曲 */
  const handleDownload = (record) => {
    console.log('record', record);
    download(
      record.id,
      record.name,
      record.level || QUALITY_LEVELS.无损,
      record.al?.id,
    );
  };

  // 表格列配置
  const columns = [
    {
      title: '歌曲信息',
      key: 'songInfo',
      width: 350,
      fixed: 'left',
      sorter: (a, b) => a.name?.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      render: (_, record) => {
        const alias = record.alia?.[0] || '';

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: 0,
            }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '6px',
                flexShrink: 0,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={(e) => e.stopPropagation()}>
              {record.al?.picUrl ? (
                <Image
                  src={record.al.picUrl}
                  width={60}
                  height={60}
                  preview={false}
                  placeholder
                />
              ) : (
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '12px',
                  }}>
                  无封面
                </div>
              )}
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
              <Tooltip title={record.name} placement='top'>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: '#262626',
                  }}>
                  {record.name}
                </div>
              </Tooltip>
              {alias && (
                <Tooltip title={alias} placement='top'>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#8c8c8c',
                      fontStyle: 'italic',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {alias}
                  </div>
                </Tooltip>
              )}
              <Tooltip title={record.id} placement='top'>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  ID:{' '}
                  <Typography.Text copyable style={{ fontSize: '12px' }}>
                    {record.id}
                  </Typography.Text>
                </div>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      title: '歌手',
      dataIndex: 'ar',
      key: 'ar',
      width: 150,
      sorter: (a, b) => {
        const aName = a.ar?.map((a) => a.name).join(', ') || '';
        const bName = b.ar?.map((b) => b.name).join(', ') || '';
        return aName.localeCompare(bName);
      },
      sortDirections: ['ascend', 'descend'],
      render: (ar) => ar?.map((a) => a.name).join(', '),
    },
    {
      title: '专辑',
      dataIndex: 'al',
      key: 'al',
      width: 200,
      sorter: (a, b) => (a.al?.name || '').localeCompare(b.al?.name || ''),
      sortDirections: ['ascend', 'descend'],
      render: (al) => al?.name,
    },
    {
      title: '专辑ID',
      dataIndex: ['al', 'id'],
      key: 'albumId',
      width: 120,
      render: (id) => id || '-',
    },
    {
      title: '时长',
      dataIndex: 'dt',
      key: 'dt',
      width: 80,
      sorter: (a, b) => a.dt - b.dt,
      sortDirections: ['ascend', 'descend'],
      render: (dt) => formatDuration(dt),
    },
    {
      title: '光盘号',
      dataIndex: 'cd',
      key: 'cd',
      width: 80,
      render: (cd) => cd || '-',
    },
    {
      title: '序号',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      sorter: (a, b) => a.no - b.no,
      sortDirections: ['ascend', 'descend'],
      render: (no) => no || '-',
    },
    {
      title: '版权',
      dataIndex: 'fee',
      key: 'fee',
      width: 100,
      filters: [
        { text: '免费', value: 0 },
        { text: 'VIP', value: 1 },
        { text: '专辑购买', value: 4 },
        { text: '付费/试听', value: 8 },
      ],
      onFilter: (value, record) => record.fee === value,
      render: (fee) => {
        const tag = getFeeTag(fee);
        return <Tag color={tag.color}>{tag.text}</Tag>;
      },
    },
    {
      title: '版权信息',
      dataIndex: 'copyright',
      key: 'copyright',
      width: 100,
      render: (copyright) => {
        if (copyright === undefined || copyright === null) return '-';
        return copyright === 1 ? (
          <Tag color='#87d068'>有版权</Tag>
        ) : (
          <Tag color='#ff4d4f'>无版权</Tag>
        );
      },
    },
    {
      title: '音源',
      dataIndex: 'noCopyrightRcmd',
      key: 'noCopyrightRcmd',
      width: 100,
      filters: [
        { text: '有音源', value: false },
        { text: '无音源', value: true },
      ],
      onFilter: (value, record) => !!record.noCopyrightRcmd === value,
      render: (noCopyrightRcmd) => {
        return (
          <Tag color={noCopyrightRcmd ? '#ff4d4f' : '#87d068'}>
            {noCopyrightRcmd ? '无音源' : '有音源'}
          </Tag>
        );
      },
    },
    {
      title: '原创类型',
      dataIndex: 'originCoverType',
      key: 'originCoverType',
      width: 100,
      filters: [
        { text: '未知', value: 0 },
        { text: '原曲', value: 1 },
        { text: '翻唱', value: 2 },
      ],
      onFilter: (value, record) => record.originCoverType === value,
      render: (type) => {
        const tag = getOriginTag(type);
        return <Tag color={tag.color}>{tag.text}</Tag>;
      },
    },
    {
      title: '热度',
      dataIndex: 'pop',
      key: 'pop',
      width: 80,
      sorter: (a, b) => a.pop - b.pop,
      sortDirections: ['ascend', 'descend'],
      render: (pop) => formatPopularity(pop),
    },
    {
      title: 'MV ID',
      dataIndex: 'mv',
      key: 'mv',
      width: 100,
      render: (mv) =>
        mv ? <Typography.Text copyable>{mv}</Typography.Text> : '-',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 120,
      sorter: (a, b) => a.publishTime - b.publishTime,
      sortDirections: ['ascend', 'descend'],
      render: (time) => (time ? dayjs(time).format('YYYY-MM-DD') : '-'),
    },
    {
      title: '歌曲类型',
      dataIndex: 't',
      key: 't',
      width: 100,
      render: (t) => {
        const tag = getTypeTag(t);
        return <Tag color={tag.color}>{tag.text}</Tag>;
      },
    },
    {
      title: '音质',
      key: 'quality',
      width: 150,
      render: (_, record) => {
        const tags = getQualityTags(record);
        if (tags.length === 0) return '-';
        return (
          <div>
            {tags.map((tag, index) => (
              <Tag
                key={index}
                color={tag.color}
                style={{ marginBottom: '4px' }}>
                {tag.label}
              </Tag>
            ))}
          </div>
        );
      },
    },
    // 选择音质
    {
      title: '选择音质',
      key: 'selectQuality',
      width: 150,
      render: (_, record) => {
        const options = getQualityTags(record);
        const defaultLevel =
          options.find((option) => option.value === QUALITY_LEVELS.无损)
            ?.value || options[0].value;
        return (
          <Select
            options={options}
            value={record.level || defaultLevel}
            onChange={(value) => handleSelectQuality(record, value)}
          />
        );
      },
    },
    {
      title: '标记',
      dataIndex: 'mark',
      key: 'mark',
      width: 150,
      render: (mark) => {
        if (!mark) return '-';
        const tags = getMarkTags(mark);
        if (tags.length === 0) return '-';
        return (
          <div>
            {tags.map((tag, index) => (
              <Tag
                key={index}
                color={tag.color}
                style={{ marginBottom: '4px' }}>
                {tag.text}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 80,
      render: (version) => version || '-',
    },
    {
      title: 'CP',
      dataIndex: 'cp',
      key: 'cp',
      width: 80,
      render: (cp) => cp || '-',
    },
    {
      title: '资源状态',
      dataIndex: 'resourceState',
      key: 'resourceState',
      width: 100,
      render: (state) => {
        if (state === undefined || state === null) return '-';
        return state ? (
          <Tag color='#87d068'>可用</Tag>
        ) : (
          <Tag color='#ff4d4f'>不可用</Tag>
        );
      },
    },
    // 操作
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space>
            <Button
              type='link'
              size='small'
              icon={
                isPlaying === record.id ? (
                  <PauseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              onClick={() => handlePlay(record)}>
              播放
            </Button>
            <Button
              type='link'
              size='small'
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}>
              下载
            </Button>
          </Space>
        );
      },
    },
  ];

  /** 播放当前歌单 */
  const handlePlayAll = async () => {
    if (!filteredSongList.length) return;
    try {
      await playPlayList(filteredSongList.map((song) => song.id));
    } catch (error) {
      console.error('播放歌单失败:', error);
    }
  };
  /** 下载当前歌单 */
  const handleDownloadAll = async () => {
    if (!currentDissid) return;
    try {
      await downloadPlaylistSong(currentDissid);
    } catch (error) {
      console.error('下载歌单失败:', error);
    }
  };
  /** 下载当前歌单JSON */
  const handleDownloadAllJson = async () => {
    if (!currentDissid) return;
    try {
      await getPlaylistDownloadJson(currentDissid);
    } catch (error) {
      console.error('下载歌单JSON失败:', error);
    }
  };

  const renderFooter = () => {
    return (
      <Space>
        <Button
          type='primary'
          icon={<PlayCircleOutlined />}
          onClick={handlePlayAll}>
          播放全部
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleDownloadAll}>
          下载全部
        </Button>
        <Button icon={<FileOutlined />} onClick={handleDownloadAllJson}>
          下载JSON
        </Button>
      </Space>
    );
  };

  return (
    <Modal
      title='歌曲列表'
      width='90%'
      centered
      open={visible}
      destroyOnHidden
      footer={renderFooter()}
      onCancel={close}>
      {/* 筛选 */}
      <SearchForm
        onSearch={handleSearch}
        data={songList.map((song) => ({
          ...song,
          artists: song.ar?.map((artist) => artist.name).join(', '),
          album: song.al?.name,
        }))}
        options={[
          { label: '歌曲', value: 'name' },
          { label: '歌手', value: 'artists' },
          { label: '专辑', value: 'album' },
        ]}
      />
      <Form.Item label='歌单ID'>
        <Input
          className={styles['playlist-id-input']}
          defaultValue={playlistId}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPlaylistId(e.target.value);
            }
          }}
        />
      </Form.Item>

      <Table
        columns={columns}
        dataSource={filteredSongList}
        rowKey='id'
        loading={loading}
        scroll={{ y: 400, x: 2000 }}
        rowSelection={{
          type: 'checkbox',
          fixed: true,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
    </Modal>
  );
}

export default forwardRef(SongList);

// 格式化时长
const formatDuration = (ms) => {
  const time = dayjs.duration(ms);
  const minutes = time.minutes();
  const seconds = time.seconds();
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 获取音质标签
const getQualityTags = (song) => {
  const tags = [];
  if (song.hr)
    tags.push({
      label: 'Hi-Res',
      color: '#f50',
      value: QUALITY_LEVELS['Hi-Res'],
    });
  if (song.sq)
    tags.push({ label: 'SQ', color: '#87d068', value: QUALITY_LEVELS.无损 });
  if (song.h)
    tags.push({ label: 'HQ', color: '#2db7f5', value: QUALITY_LEVELS.较高 });
  return tags;
};

// 获取歌曲标记
const getMarkTags = (mark) => {
  const tags = [];
  if (mark & 131072) tags.push({ text: '纯音乐', color: '#2db7f5' });
  if (mark & 262144) tags.push({ text: '杜比全景声', color: '#722ed1' });
  if (mark & 1048576) tags.push({ text: '🅴', color: '#f50' });
  if (mark & 17179869184) tags.push({ text: 'Hi-Res', color: '#f50' });
  return tags;
};

// 获取原创类型标签
const getOriginTag = (originCoverType) => {
  const types = {
    0: { text: '未知', color: '#d9d9d9' },
    1: { text: '原曲', color: '#87d068' },
    2: { text: '翻唱', color: '#2db7f5' },
  };
  return types[originCoverType] || types[0];
};

// 格式化热度
const formatPopularity = (pop) => {
  if (!pop) return '0';
  return pop.toFixed(1);
};

// 获取歌曲类型标签
const getTypeTag = (t) => {
  const types = {
    0: { text: '普通歌曲', color: '#108ee9' },
    1: { text: '独立云盘', color: '#f50' },
    2: { text: '云盘歌曲', color: '#87d068' },
  };
  return types[t] || types[0];
};

// 获取版权标签
const getFeeTag = (fee) => {
  const fees = {
    0: { text: '免费', color: '#87d068' },
    1: { text: 'VIP', color: '#f50' },
    4: { text: '专辑购买', color: '#722ed1' },
    8: { text: '付费/试听', color: '#faad14' },
  };
  return fees[fee] || fees[0];
};
