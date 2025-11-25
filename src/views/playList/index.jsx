import { deletePlaylist, getPlaylistList } from '@/api';
import { MyButton } from '@/components';
import SearchForm from '@/components/SearchForm';
import { useGetSongListDetail } from '@/hooks';
import useFilter from '@/hooks/useFilter';
import { useVisible } from '@/hooks/useVisible';
import { isMobile } from '@/utils';
import { confirm, msgError, msgSuccess } from '@/utils/modal';
import {
  CloudUploadOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import { Avatar, Image, Modal, Table, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useRef, useState } from 'react';
import SongList from '../songList';
import styles from './index.module.scss';

function PlayList(props, ref) {
  const { visible, close } = useVisible(
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
  const { sortSongListByListId, playlistToCloud } = useGetSongListDetail();
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
    return playlistToCloud(record.id);
  };

  // 排序歌单
  const handleSort = async (e, record) => {
    e.stopPropagation();
    try {
      await sortSongListByListId(record.id);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 删除歌单
  const handleDelete = async (e, record) => {
    e.stopPropagation();
    try {
      await confirm(`确定删除《${record.name}》歌单吗？`, '删除歌单');
      const res = await deletePlaylist(record.id);
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('删除歌单成功');
        getPlayListData();
      } else {
        msgError(`删除歌单失败: ${res.message}`);
      }
    } catch (error) {
      console.log('error', error);
      msgError(`删除歌单失败: ${error.message}`);
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
      align: 'center',
      render: (trackCount) => <Tag color='#c20c0c'>{trackCount}</Tag>,
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
      fixed: isMobile() ? undefined : 'right',
      width: 200,
      render: (_, record) => (
        <>
          <MyButton
            type='link'
            icon={<CloudUploadOutlined />}
            onClick={(e) => handleSaveToCloud(e, record)}
            size='small'>
            转存云盘
          </MyButton>
          <MyButton
            type='link'
            icon={<SortAscendingOutlined />}
            onClick={(e) => handleSort(e, record)}
            size='small'>
            排序
          </MyButton>
          <MyButton
            type='link'
            icon={<DeleteOutlined />}
            onClick={(e) => handleDelete(e, record)}
            size='small'>
            删除
          </MyButton>
        </>
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
            showTotal: (total) => `共 ${total} 个歌单`,
          }}
        />
      </Modal>

      <SongList ref={songListRef} />
    </>
  );
}

export default forwardRef(PlayList);
