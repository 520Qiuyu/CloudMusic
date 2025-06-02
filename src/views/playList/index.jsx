import SearchForm from '@/components/SearchForm';
import useFilter from '@/hooks/useFilter';
import { useVisible } from '@/hooks/useVisible';
import { Image, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useRef, useState } from 'react';
import { getPlaylistList } from '../../api';
import SongList from '../songList';

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

  // 表格列配置
  const columns = [
    {
      title: '封面',
      dataIndex: 'coverImgUrl',
      key: 'coverImgUrl',
      width: 80,
      render: (url) => <Image width={50} src={url} />,
    },
    {
      title: '歌单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
      render: (creator) => creator.nickname,
    },
    {
      title: '歌曲数量',
      dataIndex: 'trackCount',
      key: 'trackCount',
      width: 100,
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
  ];

  return (
    <>
      <Modal
        title='歌单列表'
        width={1300}
        centered
        open={visible}
        footer={null}
        onCancel={close}
      >
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
          })}
        />
      </Modal>

      <SongList ref={songListRef} />
    </>
  );
}

export default forwardRef(PlayList);
