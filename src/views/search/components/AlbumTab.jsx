import { useGetAlbumDetail, usePlayMusic } from '@/hooks';
import { downloadAsJson } from '@/utils/download';
import { msgError, msgLoading, msgSuccess } from '@/utils/modal';
import AlbumDetail from '@/views/albumDetail';
import {
  DownloadOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Image, Space, Table, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import styles from '../index.module.scss';

const AlbumTab = ({ data, loading }) => {
  const albumDetailRef = useRef();

  const { play, pause, isPlaying, download } = usePlayMusic();
  const {
    albumInfo,
    isLoading,
    getAlbumDetail,
    getAlbumSongList,
    playAlbum,
    downloadAlbumSong,
    getDownLoadJson,
  } = useGetAlbumDetail();

  /** 处理专辑播放 */
  const [playing, setPlaying] = useState(undefined);
  const handlePlay = async (record) => {
    try {
      setPlaying(record.id);
      const hide = msgLoading(`正在加载《${record.name}》...`);
      await playAlbum(record.id);
      hide();
      msgSuccess(`《${record.name}》开始播放`);
    } catch (error) {
      console.error('播放失败:', error);
    } finally {
      setPlaying(undefined);
    }
  };

  const [downloading, setDownloading] = useState(undefined);
  /**
   * 处理专辑下载
   * @param record 专辑信息
   */
  const handleDownload = async (record) => {
    try {
      setDownloading(record.id);
      const hide = msgLoading(`正在准备下载《${record.name}》...`);
      await downloadAlbumSong(record.id);
      hide();
      msgSuccess(`《${record.name}》下载成功！`);
    } catch (error) {
      console.error('下载失败:', error);
    } finally {
      setDownloading(undefined);
    }
  };

  const [downloadingJson, setDownloadingJson] = useState(undefined);
  const handleDownloadJson = async (record) => {
    try {
      setDownloadingJson(record.id);
      const hide = msgLoading(`正在准备下载《${record.name}》...`);
      await getDownLoadJson(record.id);
      hide();
      msgSuccess(`《${record.name}》下载成功！`);
    } catch (error) {
      msgError('下载JSON失败: ' + (error?.message || error));
    } finally {
      setDownloadingJson(undefined);
    }
  };

  // 专辑表格列配置
  const columns = [
    {
      title: '专辑信息',
      key: 'albumInfo',
      width: 350,
      fixed: 'left',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      sortDirections: ['ascend', 'descend'],
      render: (_, record) => {
        const alias = record.alias?.[0] || '';

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
              {record.picUrl ? (
                <Image
                  src={record.picUrl}
                  width={60}
                  height={60}
                  preview={true}
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
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    albumDetailRef.current?.open({ albummid: record.id })
                  }>
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
      dataIndex: 'artists',
      key: 'artists',
      width: 150,
      sorter: (a, b) => {
        const aName =
          a.artists?.map((a) => a.name).join(', ') || a.artist?.name || '';
        const bName =
          b.artists?.map((b) => b.name).join(', ') || b.artist?.name || '';
        return aName.localeCompare(bName);
      },
      sortDirections: ['ascend', 'descend'],
      render: (artists, record) => {
        const singerName =
          artists?.map((a) => a.name).join(', ') || record.artist?.name || '-';
        return singerName;
      },
    },
    {
      title: '歌曲数量',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      align: 'center',
      sorter: (a, b) => (a.size || 0) - (b.size || 0),
      sortDirections: ['ascend', 'descend'],
      render: (size) => size || 0,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 120,
      sorter: (a, b) => (a.publishTime || 0) - (b.publishTime || 0),
      sortDirections: ['ascend', 'descend'],
      render: (time) => (time ? dayjs(time).format('YYYY-MM-DD') : '-'),
    },
    {
      title: '版权ID',
      dataIndex: 'copyrightId',
      key: 'copyrightId',
      width: 100,
      render: (copyrightId) => (copyrightId !== undefined ? copyrightId : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '正常', value: 1 },
        { text: '下架', value: -1 },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        if (status === undefined || status === null) return '-';
        return status === 1 ? (
          <Tag color='#87d068'>正常</Tag>
        ) : (
          <Tag color='#ff4d4f'>下架</Tag>
        );
      },
    },
    {
      title: '在售',
      dataIndex: 'onSale',
      key: 'onSale',
      width: 80,
      filters: [
        { text: '在售', value: true },
        { text: '停售', value: false },
      ],
      onFilter: (value, record) => !!record.onSale === value,
      render: (onSale) => {
        if (onSale === undefined || onSale === null) return '-';
        return onSale ? (
          <Tag color='#87d068'>是</Tag>
        ) : (
          <Tag color='#d9d9d9'>否</Tag>
        );
      },
    },
    {
      title: '订阅',
      dataIndex: 'isSub',
      key: 'isSub',
      width: 80,
      filters: [
        { text: '已订阅', value: true },
        { text: '未订阅', value: false },
      ],
      onFilter: (value, record) => !!record.isSub === value,
      render: (isSub) => {
        if (isSub === undefined || isSub === null) return '-';
        return isSub ? (
          <Tag color='#2db7f5'>是</Tag>
        ) : (
          <Tag color='#d9d9d9'>否</Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space>
            <Button
              type='link'
              size='small'
              loading={playing === record.id}
              icon={
                playing === record.id ? (
                  <PauseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              onClick={() => {
                if (isPlaying === record.id) {
                  pause();
                } else {
                  handlePlay(record);
                }
              }}>
              播放
            </Button>
            <Button
              type='link'
              size='small'
              loading={downloadingJson === record.id}
              icon={<SaveOutlined />}
              onClick={() => handleDownloadJson(record)}>
              下载JSON
            </Button>
            <Button
              type='link'
              size='small'
              loading={downloading === record.id}
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}>
              下载
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey='id'
        loading={loading}
        scroll={{ y: 500, x: 1200 }}
        className={styles['song-table']}
        pagination={false}
      />

      {/* 专辑详情弹窗 */}
      <AlbumDetail ref={albumDetailRef} />
    </>
  );
};

export default AlbumTab;
