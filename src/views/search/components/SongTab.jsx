import { neteaseMusicToCloud } from '@/api';
import { CopyText, MyButton } from '@/components';
import { QUALITY_LEVELS } from '@/constant';
import { usePlayMusic } from '@/hooks';
import { msgError, msgSuccess } from '@/utils/modal';
import {
  formatDuration,
  formatPopularity,
  getFeeTag,
  getMarkTags,
  getOriginTag,
  getQualityTags,
  getTypeTag,
} from '@/utils/music';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Image,
  message,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from '../index.module.scss';

const SongTab = ({ data, loading }) => {
  const { play, download, isPlaying, pause, downloading } = usePlayMusic();

  const [songList, setSongList] = useState(data);
  useEffect(() => {
    setSongList(data);
  }, [data]);

  /** 选择音质 */
  const handleSelectQuality = (record, value) => {
    console.log('record', record);
    console.log('value', value);
    setSongList((prev) => {
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
    download(record.id, record.level || QUALITY_LEVELS.无损);
  };
  /** 转存云盘 */
  const handleSaveToCloud = async (record) => {
    console.log('record', record);
    const uploadMessageKey = 'song-to-cloud';
    try {
      const res = await neteaseMusicToCloud([record.id], {
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
            `歌曲转存云盘完成, 共${result.total}首歌曲, 已上传${result.successCount}首, 上传失败${result.errorCount}首`,
          );
        },
      });
    } catch (error) {
      console.log('error', error);
      msgError(`歌曲转存云盘失败: ${error.message}`);
    } finally {
      message.destroy(uploadMessageKey);
    }
  };

  // 歌曲表格列配置
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
      render: (id) => <CopyText text={id} /> || '-',
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
            ?.value || options[0]?.value;
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
      width: 300,
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
              loading={downloading === record.id}
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}>
              下载
            </Button>
            <MyButton
              type='link'
              size='small'
              icon={<CloudUploadOutlined />}
              onClick={() => handleSaveToCloud(record)}>
              转存云盘
            </MyButton>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={songList}
      rowKey='id'
      loading={loading}
      scroll={{ y: 500, x: 1000 }}
      className={styles['song-table']}
      pagination={false}
    />
  );
};

export default SongTab;
