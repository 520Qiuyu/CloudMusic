import { CopyText } from '@/components';
import { Image, Space, Table } from 'antd';
import styles from '../index.module.scss';

const LyricTab = ({ data, loading }) => {
  // 歌词表格列配置
  const columns_lyric = [
    {
      title: '歌曲信息',
      dataIndex: 'name',
      width: 300,
      render: (text, record) => {
        const albumPicUrl = record.album?.picId
          ? `https://p3.music.126.net/${record.album.picId}/${record.album.picId}.jpg`
          : '';
        return (
          <Space size='middle' className={styles['song-info']}>
            <div className={styles['song-cover']}>
              <Image src={albumPicUrl} />
            </div>
            <div className={styles['song-details']}>
              <div className={styles['song-name']} title={text}>
                {text}
              </div>
              <div className={styles['song-album']} title={record.album?.name || ''}>
                {record.album?.name || ''}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: '歌手',
      dataIndex: 'artists',
      width: 200,
      render: (artists) => (
        <Space size='small'>
          <div className={styles['singer-info']}>
            <div
              className={styles['singer-name']}
              title={artists?.map((s) => s.name).join('/') || '未知歌手'}>
              {artists?.map((s) => s.name).join('/') || '未知歌手'}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '歌曲ID',
      dataIndex: 'id',
      width: 200,
      align: 'center',
      render: (id) => <CopyText className={styles['song-mid-text']} text={id?.toString() || ''} />,
    },
  ];

  return (
    <Table
      columns={columns_lyric}
      dataSource={data}
      rowKey='id'
      loading={loading}
      scroll={{ y: 500, x: 800 }}
      className={styles['song-table']}
      pagination={false}
    />
  );
};

export default LyricTab;

