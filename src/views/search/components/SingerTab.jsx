import { CopyText } from '@/components';
import AlbumListModal from '@/views/albumList';
import HotSongModal from '@/views/hotSong';
import { PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Image, Space, Table } from 'antd';
import { useRef } from 'react';
import styles from '../index.module.scss';

const SingerTab = ({ data, loading }) => {
  // 查看热门歌曲
  const hotSongModalRef = useRef();
  const handleHotSong = (record) => {
    hotSongModalRef.current.open({
      singerId: record.singerID,
      singerMid: record.singerMID,
      singerName: record.singerName,
      singerPic: record.singerPic,
    });
  };

  // 查看专辑
  const albumModalRef = useRef();
  const handleAlbum = (record) => {
    albumModalRef.current.open({
      singerId: record.singerID,
      singerMid: record.singerMID,
      singerName: record.singerName,
      singerPic: record.singerPic,
    });
  };

  // 歌手表格列配置
  const columns_singer = [
    {
      title: '歌手信息',
      dataIndex: 'singerName',
      width: 300,
      render: (text, record) => (
        <Space size='middle' className={styles['song-info']}>
          <div className={styles['song-cover']}>
            <Image src={record.singerPic} />
          </div>
          <div className={styles['song-details']}>
            <div className={styles['song-name']} title={text}>
              {text}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '歌曲数量',
      dataIndex: 'songNum',
      width: 100,
      align: 'center',
    },
    {
      title: '专辑数量',
      dataIndex: 'albumNum',
      width: 100,
      align: 'center',
    },
    {
      title: 'MV数量',
      dataIndex: 'mvNum',
      width: 100,
      align: 'center',
    },
    {
      title: '歌手ID',
      dataIndex: 'singerMID',
      width: 200,
      align: 'center',
      render: (singerMID) => (
        <CopyText className={styles['song-mid-text']} text={singerMID} />
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
            onClick={() => handleHotSong(record)}>
            查看热门歌曲
          </Button>
          <Button
            type='link'
            color='danger'
            size='small'
            icon={<PlayCircleOutlined />}
            onClick={() => handleAlbum(record)}>
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
        rowKey='singerMID'
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
