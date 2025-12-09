import { neteaseMusicToCloud } from '@/api';
import { CopyText, MyButton } from '@/components';
import SearchForm from '@/components/SearchForm';
import SongInfoRender from '@/components/SongInfoRender';
import { QUALITY_LEVELS } from '@/constant';
import useFilter from '@/hooks/useFilter';
import { useGetSongListDetail } from '@/hooks/useGetSongListDetail';
import { usePlayMusic } from '@/hooks/usePlayMusic';
import { useVisible } from '@/hooks/useVisible';
import { isMobile } from '@/utils';
import { msgError, msgSuccess, msgWarning } from '@/utils/modal';
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
  FileOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import {
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
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
        resetSongList();
        setPlaylistId(null);
      },
    },
    ref,
  );

  const { getUrl, play, pause, isPlaying, download, playPlayList } =
    usePlayMusic();

  const {
    getSongListData,
    loading,
    songList,
    resetSongList,
    downloadSongList,
    downloading,
    downloadSongListAsJson,
  } = useGetSongListDetail();
  const [playlistId, setPlaylistId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

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
    download(record.id, record.level || QUALITY_LEVELS.无损);
  };
  /** 转存云盘 */
  const handleSaveToCloud = async (record) => {
    const uploadMessageKey = 'song-to-cloud';
    try {
      if (record.pc) {
        msgWarning(`《${record.name}》为云盘已存在歌曲，无法转存云盘!`);
        return;
      }
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

  // 表格列配置
  const columns = [
    {
      title: '歌曲信息',
      key: 'songInfo',
      width: 280,
      fixed: 'left',
      sorter: (a, b) => a.name?.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      render: (_, record) => {
        return <SongInfoRender record={record} />;
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
      width: 140,
      render: (id) => <CopyText text={id} /> || '-',
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
      fixed: isMobile() ? undefined : 'right',
      render: (_, record) => {
        const noSource = record.noCopyrightRcmd;
        const isCloud = record.pc;
        return (
          <Space>
            <MyButton
              type='link'
              size='small'
              disabled={noSource}
              icon={
                isPlaying === record.id ? (
                  <PauseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              onClick={() => handlePlay(record)}>
              播放
            </MyButton>
            <MyButton
              type='link'
              size='small'
              disabled={noSource}
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}>
              下载
            </MyButton>
            <MyButton
              type='link'
              size='small'
              disabled={isCloud || noSource}
              icon={<CloudUploadOutlined />}
              onClick={() => handleSaveToCloud(record)}>
              转存云盘
            </MyButton>
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
    if (!filteredSongList.length) return msgWarning('暂无歌曲下载');
    try {
      await downloadSongList(filteredSongList);
    } catch (error) {
      console.error('下载歌单失败:', error);
    }
  };
  /** 下载当前歌单JSON */
  const handleDownloadAllJson = async () => {
    if (!filteredSongList.length) return;
    try {
      await downloadSongListAsJson(filteredSongList);
    } catch (error) {
      console.error('下载歌单JSON失败:', error);
    }
  };

  /** 转存云盘全部 */
  const handleSaveToCloudAll = async () => {
    const uploadMessageKey = 'song-to-cloud-all';
    try {
      await neteaseMusicToCloud(
        filteredSongList.map((song) => song.id),
        {
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
        },
      );
      msgSuccess(`歌曲转存云盘完成`);
    } catch (error) {
      console.error('转存云盘全部失败:', error);
      msgError(`歌曲转存云盘失败: ${error.message}`);
    } finally {
      message.destroy(uploadMessageKey);
    }
  };
  const renderFooter = () => {
    return (
      <Space>
        <MyButton
          type='primary'
          icon={<PlayCircleOutlined />}
          onClick={handlePlayAll}>
          播放全部
        </MyButton>
        <MyButton
          type='primary'
          icon={<CloudUploadOutlined />}
          onClick={handleSaveToCloudAll}>
          转存云盘全部
        </MyButton>
        <MyButton
          icon={<DownloadOutlined />}
          loading={downloading}
          onClick={handleDownloadAll}>
          下载全部 ({selectedRows.length || filteredSongList.length})
        </MyButton>
        <MyButton
          icon={<FileOutlined />}
          loading={downloading}
          onClick={handleDownloadAllJson}>
          下载JSON ({selectedRows.length || filteredSongList.length})
        </MyButton>
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
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 首歌曲`,
        }}
        rowSelection={{
          type: 'checkbox',
          fixed: true,
          preserveSelectedRowKeys: true,
          getCheckboxProps: (record) => ({
            disabled: record.noCopyrightRcmd,
          }),
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
    </Modal>
  );
}

export default forwardRef(SongList);
