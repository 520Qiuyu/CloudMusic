import { CopyText } from '@/components';
import AlbumListModal from '@/views/albumList';
import HotSongModal from '@/views/hotSong';
import { PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Image, Space, Table, Tooltip, Typography } from 'antd';
import { useRef } from 'react';
import styles from '../index.module.scss';

const SingerTab = ({ data, loading }) => {
  // 查看热门歌曲
  const hotSongModalRef = useRef();
  const handleHotSong = (record) => {
    hotSongModalRef.current.open({
      singerId: record.id,
      singerMid: record.id,
      singerName: record.name,
      singerPic: record.picUrl || record.img1v1Url,
    });
  };

  // 查看专辑
  const albumModalRef = useRef();
  const handleAlbum = (record) => {
    albumModalRef.current.open({
      singerId: record.id,
      singerMid: record.id,
      singerName: record.name,
      singerPic: record.picUrl || record.img1v1Url,
    });
  };

  // 歌手表格列配置
  const columns_singer = [
    {
      title: '歌手信息',
      dataIndex: 'name',
      width: 300,
      render: (text, record) => (
        <Space size='middle' className={styles['song-info']}>
          <div className={styles['song-cover']}>
            <Image
              src={record.picUrl || record.img1v1Url}
              width={60}
              height={60}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles['song-details']}>
            <Tooltip title={text} placement='top'>
              <div
                className={styles['song-name']}
                tabIndex={0}
                role='text'
                aria-label={`歌手名称 ${text}`}>
                {text}
              </div>
            </Tooltip>
            <Tooltip title={record.id} placement='top'>
              <Typography.Text
                className={styles['song-mid-text']}
                copyable
                aria-label={`复制歌手ID ${record.id}`}>
                {record.id}
              </Typography.Text>
            </Tooltip>
            {(record.alias?.length || record.alia?.length) && (
              <Tooltip
                title={record.alias?.join('、') || record.alia?.join('、')}
                placement='top'>
                <div
                  className={styles['song-album']}
                  tabIndex={0}
                  role='text'
                  aria-label={`别名 ${record.alias?.[0] || record.alia?.[0]}`}>
                  {record.alias?.[0] || record.alia?.[0]}
                </div>
              </Tooltip>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: '歌曲数量',
      dataIndex: 'musicSize',
      width: 100,
      align: 'center',
      render: (value) => value ?? '-',
    },
    {
      title: '专辑数量',
      dataIndex: 'albumSize',
      width: 100,
      align: 'center',
      render: (value) => value ?? '-',
    },
    {
      title: 'MV数量',
      dataIndex: 'mvSize',
      width: 100,
      align: 'center',
      render: (value) => value ?? '-',
    },
    {
      title: '歌手ID',
      dataIndex: 'id',
      width: 200,
      align: 'center',
      render: (id) => (
        <CopyText className={styles['song-mid-text']} text={String(id)} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size='middle'>
          <Button
            type='link'
            size='small'
            icon={<UserOutlined />}
            onClick={() => handleHotSong(record)}
            aria-label={`查看${record.name}的热门歌曲`}>
            热门歌曲
          </Button>
          <Button
            type='link'
            color='danger'
            size='small'
            icon={<PlayCircleOutlined />}
            onClick={() => handleAlbum(record)}
            aria-label={`查看${record.name}的专辑`}>
            查看专辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns_singer}
        dataSource={data}
        rowKey='id'
        loading={loading}
        scroll={{ y: 500, x: 1100 }}
        className={styles['song-table']}
        pagination={false}
      />

      {/* 热门歌曲弹窗 */}
      <HotSongModal ref={hotSongModalRef} />
      {/* 专辑弹窗 */}
      <AlbumListModal ref={albumModalRef} />
    </>
  );
};

export default SingerTab;
