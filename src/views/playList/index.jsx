import {
  getPlaylistAllData,
  getPlaylistList,
  neteaseMusicToCloud,
} from '@/api';
import { MyButton } from '@/components';
import SearchForm from '@/components/SearchForm';
import useFilter from '@/hooks/useFilter';
import { useVisible } from '@/hooks/useVisible';
import { msgError, msgSuccess } from '@/utils/modal';
import { Avatar, Image, message, Modal, Table, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useRef, useState } from 'react';
import SongList from '../songList';
import styles from './index.module.scss';

function PlayList(props, ref) {
  const { visible, open, close } = useVisible(
    {
      onOpen() {
        getPlayListData();
      },
      onReset() {
        setPlayList([]);
      },
    },
    ref,
  );
  const [loading, setLoading] = useState(false);
  const [playList, setPlayList] = useState([]);
  const songListRef = useRef();

  // 获取歌单列表
  const getPlayListData = async () => {
    try {
      setLoading(true);
      const res = await getPlaylistList();
      if (res.code === 200) {
        setPlayList(res.playlist || []);
      }
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  // 格式化播放次数
  const formatPlayCount = (count) => {
    if (count < 10000) return count;
    return `${(count / 10000).toFixed(1)}万`;
  };

  // 处理行点击事件
  const handleRowClick = (record) => {
    songListRef.current?.open(record.id);
  };

  const { filteredList, handleFilter, setFilteredList } = useFilter(playList, {
    fields: {
      name: {
        getValue: (item) => item.name,
      },
      creator: {
        getValue: (item) => item.creator.nickname,
      },
    },
  });

  // 转存云盘
  const handleSaveToCloud = async (e, record) => {
    e.stopPropagation();
    console.log('record', record);
    console.log('歌单歌曲转云盘');
    const uploadMessageKey = 'playlist-to-cloud';
    try {
      const songs = await getPlaylistAllData(record.id);
      const songIds = songs.map((song) => song.id);
      message.loading({
        content: '开始上传歌单歌曲到云盘，请稍候...',
        key: uploadMessageKey,
        duration: 0,
      });
      const res = await neteaseMusicToCloud(songIds, {
        onChange: (progress) => {
          message.loading({
            content: `第${progress.current}首歌曲上传完成: ${progress.song.name}, 共${progress.total}首, 已上传${progress.successCount}首, 上传失败${progress.errorCount}首`,
            key: uploadMessageKey,
            duration: 0,
          });
        },
        onComplete: (result) => {
          message.destroy(uploadMessageKey);
          console.log('result', result);
          msgSuccess(
            `歌单歌曲转云盘完成, 共${result.total}首歌曲, 已上传${result.successCount}首, 上传失败${result.errorCount}首`,
          );
        },
      });
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
      msgError(`歌单歌曲转云盘失败: ${error.message}`);
    } finally {
      message.destroy(uploadMessageKey);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '歌单信息',
      key: 'playlistInfo',
      width: 250,
      render: (_, record) => (
        <div className={styles['playlist-info']}>
          <div className={styles['cover']}>
            <Image
              src={record.coverImgUrl}
              width={60}
              height={60}
              onClick={(e) => e.stopPropagation()}
              preview={false}
            />
          </div>
          <div className={styles['info']}>
            <Tooltip title={record.name} placement='top'>
              <div className={styles['name']}>{record.name}</div>
            </Tooltip>
            <Tooltip title={record.creator.nickname} placement='top'>
              <div className={styles['creator']}>
                <Avatar src={record.creator.avatarUrl} size={20} />
                <Typography.Text>{record.creator.nickname}</Typography.Text>
              </div>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: '歌曲数量',
      dataIndex: 'trackCount',
      key: 'trackCount',
      width: 100,
    },
    // 歌单id
    {
      title: '歌单id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Typography.Text copyable>{id}</Typography.Text>,
    },
    {
      title: '播放次数',
      dataIndex: 'playCount',
      key: 'playCount',
      width: 100,
      render: (count) => formatPlayCount(count),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (time) => dayjs(time).format('YYYY-MM-DD'),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 120,
      render: (time) => dayjs(time).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <MyButton
          type='link'
          onClick={(e) => handleSaveToCloud(e, record)}
          size='small'>
          转存云盘
        </MyButton>
      ),
    },
  ];

  return (
    <>
      <Modal
        title='歌单列表'
        width={1300}
        centered
        open={visible}
        footer={null}
        onCancel={close}>
        <SearchForm
          data={playList.map((item) => ({
            ...item,
            creator: item.creator.nickname,
          }))}
          options={[
            {
              label: '歌单名字',
              value: 'name',
            },
            {
              label: '创建者',
              value: 'creator',
            },
          ]}
          onSearch={handleFilter}
        />
        <Table
          columns={columns}
          dataSource={filteredList}
          rowKey='id'
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            className: styles['playlist-item'],
          })}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
          }}
        />
      </Modal>

      <SongList ref={songListRef} />
    </>
  );
}

export default forwardRef(PlayList);
