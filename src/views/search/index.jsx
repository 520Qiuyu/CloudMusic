import { cloudSearch } from '@/api/search';
import { SEARCH_TYPES } from '@/constant';
import { useGetData, useVisible } from '@/hooks';
import { Button, Form, Input, Modal, Pagination, Tabs } from 'antd';
import { forwardRef, useState } from 'react';
import { AlbumTab, SingerTab, SongTab } from './components';
import styles from './index.module.scss';

const defaultSearchParams = {
  pageNum: 1,
  pageSize: 20,
  type: SEARCH_TYPES.单曲,
};

const Search = forwardRef((props, ref) => {
  const { visible, close } = useVisible({}, ref);

  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  const handleSearch = (values) => {
    setSearchParams({ ...searchParams, keyword: values.keyword });
  };

  const { data, loading } = useGetData(
    () =>
      cloudSearch(searchParams.keyword, {
        type: searchParams.type,
        limit: searchParams.pageSize,
        offset: (searchParams.pageNum - 1) * searchParams.pageSize,
      }),
    undefined,
    {
      returnFunction: () => !searchParams.keyword,
      monitors: [searchParams],
    },
  );

  const renderTitle = () => {
    return (
      <div className={styles['modal-title']}>
        <div className={styles['title-content']}>
          <span className={styles['title-text']}>歌曲查询</span>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={renderTitle()}
      open={visible}
      onCancel={close}
      width={1500}
      centered
      className={styles['song-search-modal']}>
      <Form onFinish={handleSearch} layout='inline'>
        {/* 关键词 */}
        <Form.Item label='关键词' name='keyword'>
          <Input placeholder='请输入关键词' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => setSearchParams(defaultSearchParams)}>
            重置
          </Button>
        </Form.Item>
      </Form>

      <Tabs
        activeKey={searchParams.type}
        onChange={(key) =>
          setSearchParams({ ...searchParams, type: key, pageNum: 1 })
        }>
        <Tabs.TabPane tab='单曲' key={SEARCH_TYPES.单曲}>
          <SongTab data={data?.result?.songs || []} loading={loading} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='专辑' key={SEARCH_TYPES.专辑}>
          <AlbumTab data={data?.result?.albums || []} loading={loading} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='歌手' key={SEARCH_TYPES.歌手}>
          <SingerTab data={data?.result?.artists || []} loading={loading} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='歌单' key={SEARCH_TYPES.歌单}></Tabs.TabPane>
        <Tabs.TabPane tab='用户' key={SEARCH_TYPES.用户}></Tabs.TabPane>
        <Tabs.TabPane tab='MV' key={SEARCH_TYPES.MV}>
          {/* <MvTab data={data?.r`esult?.mvs || []} loading={loading} /> */}
        </Tabs.TabPane>
        <Tabs.TabPane tab='歌词' key={SEARCH_TYPES.歌词}>
          {/* <LyricTab data={data?.result?.songs || []} loading={loading} /> */}
        </Tabs.TabPane>
      </Tabs>

      <Pagination
        align='end'
        total={
          data?.result?.[
            {
              [SEARCH_TYPES.单曲]: 'songCount',
              [SEARCH_TYPES.专辑]: 'albumCount',
              [SEARCH_TYPES.歌手]: 'artistCount',
              [SEARCH_TYPES.MV]: 'mvCount',
              [SEARCH_TYPES.歌词]: 'songCount',
            }[searchParams.type]
          ] || 0
        }
        current={searchParams.pageNum}
        pageSize={searchParams.pageSize}
        showSizeChanger={true}
        showTotal={(total) => {
          const typeMap = {
            [SEARCH_TYPES.单曲]: '首歌曲',
            [SEARCH_TYPES.专辑]: '张专辑',
            [SEARCH_TYPES.歌手]: '位歌手',
            [SEARCH_TYPES.MV]: '个MV',
            [SEARCH_TYPES.歌词]: '首歌词',
          };
          return `共 ${total} ${typeMap[searchParams.type] || '条记录'}`;
        }}
        onChange={(page, pageSize) => {
          setSearchParams({ ...searchParams, pageNum: page, pageSize });
        }}
        style={{ marginTop: 16 }}
      />
    </Modal>
  );
});

export default Search;
