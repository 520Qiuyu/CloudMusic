import { getArtistAlbumList } from '@/api';
import { CopyText, SearchForm } from '@/components';
import {
  useFilter,
  useGetAlbumDetail,
  useGetData,
  usePlayMusic,
  useVisible,
} from '@/hooks';
import { downloadAsJson } from '@/utils/download';
import { msgError, msgLoading, msgSuccess, msgWarning } from '@/utils/modal';
import AlbumDetail from '@/views/albumDetail';
import {
  DownloadOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Image,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styles from './index.module.scss';
import { isMobile } from '@/utils';

const { Text, Title } = Typography;

const getAlbumKey = (album) =>
  String(album?.id ?? album?.albumId ?? album?.albumMid ?? album?.picId ?? '');

const AlbumListModal = forwardRef((props, ref) => {
  const { visible, close } = useVisible(
    {
      onOpen: (params) => {
        params && setSingerInfo(params);tes
      },
      onReset: () => {
        setSingerInfo({});
        setSelectedRowKeys([]);
        setSelectedRows([]);
      },
    },
    ref,
  );

  const albumDetailRef = useRef();

  const [singerInfo, setSingerInfo] = useState({});
  const { data, loading } = useGetData(
    getArtistAlbumList,
    singerInfo.singerId,
    {
      monitors: [singerInfo.singerId, visible],
      returnFunction: () => !visible || !singerInfo.singerId,
      initialValue: [],
    },
  );
  const albumList = useMemo(() => data.data || [], [data]);
  console.log('albumList', albumList);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const { playAlbum, downloadAlbumSong, getAlbumDetail, getAlbumSongList } =
    useGetAlbumDetail();
  const { pause, isPlaying } = usePlayMusic();

  const [playingAlbumId, setPlayingAlbumId] = useState();
  const [downloadingAlbumId, setDownloadingAlbumId] = useState();
  const [downloadingJsonAlbumId, setDownloadingJsonAlbumId] = useState();
  const [downloadingBatch, setDownloadingBatch] = useState(false);
  const [downloadingBatchJson, setDownloadingBatchJson] = useState(false);

  const filterConfig = useMemo(
    () => ({
      fields: {
        name: {
          getValue: (item) => item?.name || '',
        },
      },
    }),
    [],
  );

  const {
    filteredList = [],
    setFilteredList,
    handleFilter,
  } = useFilter(albumList, filterConfig);

  const albumOptions = useMemo(
    () => [
      {
        label: '专辑名称',
        value: 'name',
      },
    ],
    [],
  );

  useEffect(() => {
    setSelectedRowKeys((prev) =>
      prev.filter((key) =>
        filteredList.some((item) => getAlbumKey(item) === key),
      ),
    );
    setSelectedRows((prev) =>
      prev.filter((item) =>
        filteredList.some((album) => getAlbumKey(album) === getAlbumKey(item)),
      ),
    );
  }, [filteredList]);

  const handleSearch = (values) => {
    handleFilter(values);
  };

  const handlePlay = async (record) => {
    let hide;
    try {
      setPlayingAlbumId(record.id);
      hide = msgLoading(`正在加载《${record.name}》...`);
      await playAlbum(record.id);
      msgSuccess(`《${record.name}》开始播放`);
    } catch (error) {
      console.error('播放失败:', error);
      msgError(`播放失败: ${error?.message || error}`);
    } finally {
      hide?.();
      setPlayingAlbumId(undefined);
    }
  };

  const handleDownload = async (record) => {
    let hide;
    try {
      setDownloadingAlbumId(record.id);
      hide = msgLoading(`正在准备下载《${record.name}》...`);
      await downloadAlbumSong(record.id);
      msgSuccess(`《${record.name}》下载成功`);
    } catch (error) {
      console.error('下载失败:', error);
      msgError(`下载失败: ${error?.message || error}`);
    } finally {
      hide?.();
      setDownloadingAlbumId(undefined);
    }
  };

  const handleDownloadJson = async (record) => {
    let hide;
    try {
      setDownloadingJsonAlbumId(record.id);
      hide = msgLoading(`正在准备导出《${record.name}》的JSON...`);
      const detail = await getAlbumDetail(record.id);
      const songs = await getAlbumSongList(record.id);
      downloadAsJson(
        {
          albumName: detail?.name,
          albumCover: detail?.picUrl,
          list: (songs || []).map((song) => ({
            id: song?.id,
            name: song?.name,
            duration: song?.dt,
            artists: song?.ar?.map((artist) => artist.name).join('、') || '',
          })),
        },
        `${record.name}-专辑`,
      );
      msgSuccess(`《${record.name}》JSON下载完成`);
    } catch (error) {
      console.error('下载JSON失败:', error);
      msgError(`下载JSON失败: ${error?.message || error}`);
    } finally {
      hide?.();
      setDownloadingJsonAlbumId(undefined);
    }
  };

  const handleBatchDownload = async () => {
    if (selectedRows.length === 0) {
      msgWarning('请先选择要下载的专辑');
      return;
    }
    let hide;
    try {
      setDownloadingBatch(true);
      hide = msgLoading(
        `正在准备下载 ${selectedRows.length} 张专辑，请稍候...`,
      );
      for (const album of selectedRows) {
        await downloadAlbumSong(album.id);
      }
      msgSuccess(`成功下载 ${selectedRows.length} 张专辑`);
    } catch (error) {
      console.error('批量下载专辑失败:', error);
      msgError(`批量下载失败: ${error?.message || error}`);
    } finally {
      hide?.();
      setDownloadingBatch(false);
    }
  };

  const handleBatchDownloadJson = async () => {
    if (selectedRows.length === 0) {
      msgWarning('请先选择要导出的专辑');
      return;
    }
    const key = `album-json-${Date.now()}`;
    try {
      setDownloadingBatchJson(true);
      message.loading({
        content: `正在导出 ${selectedRows.length} 张专辑的JSON，请稍候...`,
        key,
        duration: 0,
      });
      const result = [];
      for (const album of selectedRows) {
        const detail = await getAlbumDetail(album.id);
        const songs = await getAlbumSongList(album.id);
        result.push({
          albumName: detail?.name,
          albumCover: detail?.picUrl,
          list: (songs || []).map((song) => ({
            id: song?.id,
            name: song?.name,
            duration: song?.dt,
            artists: song?.ar?.map((artist) => artist.name).join('、') || '',
          })),
        });
      }
      downloadAsJson(result, `${singerInfo?.singerName || '歌手'}-专辑合集`);
      message.success({
        content: `成功导出 ${selectedRows.length} 张专辑`,
        key,
      });
    } catch (error) {
      console.error('批量导出JSON失败:', error);
      message.error({
        content: `批量导出失败: ${error?.message || error}`,
        key,
      });
    } finally {
      setDownloadingBatchJson(false);
    }
  };

  const handleSelectAll = () => {
    if (!filteredList.length) return;
    const keys = filteredList.map((item) => getAlbumKey(item));
    setSelectedRowKeys(keys);
    setSelectedRows(filteredList);
  };

  const handleClearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const columns = useMemo(
    () => [
      {
        title: '专辑信息',
        dataIndex: 'name',
        key: 'name',
        width: 320,
        render: (text, record) => (
          <Space size='middle' className={styles['album-info']}>
            <div className={styles['album-cover']}>
              <Image
                src={record.picUrl}
                width={60}
                height={60}
                style={{ objectFit: 'cover' }}
                preview={true}
                placeholder
                alt={text}
              />
            </div>
            <div className={styles['album-details']}>
              <div
                className={styles['album-name']}
                tabIndex={0}
                role='button'
                aria-label={`查看《${text}》详情`}
                onClick={() =>
                  albumDetailRef.current?.open({ albumId: record.id })
                }>
                {text}
              </div>
              {!!record.alias?.length && (
                <div className={styles['album-alias']} title={record.alias[0]}>
                  {record.alias[0]}
                </div>
              )}
              <div className={styles['album-meta']}>
                <Tag color='blue' className={styles['album-tag']}>
                  {record.type || '专辑'}
                </Tag>
                <Text
                  className={styles['album-company']}
                  title={record.company}>
                  {record.company || '未知公司'}
                </Text>
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: '歌手',
        dataIndex: 'artist',
        key: 'artist',
        width: 220,
        render: (_, record) => (
          <Space size='small'>
            <Avatar
              src={singerInfo?.singerPic}
              icon={<UserOutlined />}
              size={40}
              alt={singerInfo?.singerName || '歌手头像'}
            />
            <div className={styles['singer-details']}>
              <div
                className={styles['singer-name']}
                title={singerInfo?.singerName}>
                {singerInfo?.singerName || '未知歌手'}
              </div>
              <div
                className={styles['singer-id']}
                title={String(singerInfo?.singerId || '')}>
                {singerInfo?.singerId || '-'}
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: '发行时间',
        dataIndex: 'publishTime',
        key: 'publishTime',
        width: 150,
        align: 'center',
        render: (publishTime) =>
          publishTime ? dayjs(publishTime).format('YYYY-MM-DD') : '-',
      },
      {
        title: '歌曲数',
        dataIndex: 'size',
        key: 'size',
        width: 120,
        align: 'center',
        render: (size, record) => (
          <Tag color='green'>{size ?? record?.songCount ?? 0} 首</Tag>
        ),
      },
      {
        title: '专辑ID',
        dataIndex: 'id',
        key: 'id',
        width: 160,
        align: 'center',
        render: (id) => (
          <CopyText className={styles['album-id']} text={String(id)} />
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 340,
        align: 'center',
        fixed:isMobile() ? undefined : 'right',
        render: (_, record) => (
          <Space size='middle'>
            <Button
              type='link'
              size='small'
              loading={playingAlbumId === record.id}
              icon={
                playingAlbumId === record.id ? (
                  <PauseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              onClick={() => {
                if (playingAlbumId === record.id && isPlaying) {
                  pause();
                  return;
                }
                handlePlay(record);
              }}
              aria-label={`播放《${record.name}》`}>
              播放
            </Button>
            <Button
              type='link'
              size='small'
              loading={downloadingJsonAlbumId === record.id}
              icon={<SaveOutlined />}
              onClick={() => handleDownloadJson(record)}
              aria-label={`导出《${record.name}》JSON`}>
              下载JSON
            </Button>
            <Button
              type='link'
              size='small'
              loading={downloadingAlbumId === record.id}
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
              aria-label={`下载《${record.name}》`}>
              下载
            </Button>
          </Space>
        ),
      },
    ],
    [
      albumDetailRef,
      downloadingAlbumId,
      downloadingJsonAlbumId,
      handleDownload,
      handleDownloadJson,
      handlePlay,
      isPlaying,
      pause,
      playingAlbumId,
      singerInfo?.singerId,
      singerInfo?.singerName,
      singerInfo?.singerPic,
    ],
  );

  const rowSelection = useMemo(
    () => ({
      preserveSelectedRowKeys: true,
      selectedRowKeys,
      onChange: (keys, rows) => {
        const normalizedKeys = keys.map((key) => String(key));
        setSelectedRowKeys(normalizedKeys);
        setSelectedRows(rows);
      },
    }),
    [selectedRowKeys],
  );

  const albumCount = filteredList.length;
  const songCount = filteredList.reduce(
    (sum, album) => sum + (album?.size ?? album?.songCount ?? 0),
    0,
  );

  const renderTitle = () => (
    <div className={styles['modal-title']}>
      <div className={styles['title-content']}>
        <Title level={4} className={styles['title-text']}>
          {singerInfo?.singerName || '专辑列表'}
        </Title>
        <div className={styles['title-stats']}>
          <span className={styles['stat-item']}>
            <span className={styles['stat-label']}>专辑</span>
            <span className={styles['stat-value']}>{albumCount}</span>
          </span>
          <span className={styles['stat-item']}>
            <span className={styles['stat-label']}>歌曲</span>
            <span className={styles['stat-value']}>{songCount}</span>
          </span>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className={styles['modal-footer']}>
      <div className={styles['selected-info']}>
        已选择 {selectedRows.length} 张专辑
        {selectedRows.length > 0 && (
          <span className={styles['selected-extra']}>
            （共{' '}
            {selectedRows.reduce(
              (sum, album) => sum + (album?.size ?? album?.songCount ?? 0),
              0,
            )}{' '}
            首歌曲）
          </span>
        )}
      </div>
      <Space>
        <Button onClick={handleSelectAll} disabled={!filteredList.length}>
          全部选择
        </Button>
        <Button
          onClick={handleClearSelection}
          disabled={selectedRows.length === 0}>
          清空选择
        </Button>
        <Button
          type='primary'
          onClick={handleBatchDownloadJson}
          loading={downloadingBatchJson}
          disabled={selectedRows.length === 0}>
          下载JSON{selectedRows.length ? `(${selectedRows.length})` : ''}
        </Button>
        <Button
          type='primary'
          onClick={handleBatchDownload}
          loading={downloadingBatch}
          disabled={selectedRows.length === 0}>
          下载专辑{selectedRows.length ? `(${selectedRows.length})` : ''}
        </Button>
      </Space>
    </div>
  );

  return (
    <Modal
      title={renderTitle()}
      open={visible}
      onCancel={close}
      width={1500}
      centered
      footer={renderFooter()}
      className={styles['album-list-modal']}>
      <div className={styles['search-area']}>
        <SearchForm
          data={albumList}
          options={albumOptions}
          onSearch={handleSearch}
        />
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredList}
        rowKey={getAlbumKey}
        loading={loading}
        scroll={{ y: 500, x: 1100 }}
        className={styles['album-table']}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          align: 'end',
          showTotal: (total) => `共 ${total} 张专辑`,
        }}
      />

      <AlbumDetail ref={albumDetailRef} />
    </Modal>
  );
});

export default AlbumListModal;
