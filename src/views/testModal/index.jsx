import { useVisible } from '@/hooks/useVisible';
import { Modal, Tabs } from 'antd';
import { forwardRef } from 'react';
import AlbumTab from './components/AlbumTab';
import ArtistTab from './components/ArtistTab';
import CloudTab from './components/CloudTab';
import FlacTab from './components/FlacTab';
import LoginTab from './components/LoginTab';
import PlaylistTab from './components/PlaylistTab';
import SearchTab from './components/SearchTab';
import SongTab from './components/SongTab';
import SettingTab from './components/SettingTab';

const TestModal = forwardRef((props, ref) => {
  const { visible, open, close } = useVisible({}, ref);

  const tabItems = [
    {
      key: 'login',
      label: '登录',
      children: <LoginTab />,
    },
    {
      key: 'search',
      label: '搜索',
      children: <SearchTab />,
    },
    {
      key: 'artist',
      label: '歌手',
      children: <ArtistTab />,
    },
    {
      key: 'song',
      label: '歌曲',
      children: <SongTab />,
    },
    {
      key: 'cloud',
      label: '云盘',
      children: <CloudTab />,
    },
    {
      key: 'playlist',
      label: '歌单',
      children: <PlaylistTab />,
    },
    {
      key: 'album',
      label: '专辑',
      children: <AlbumTab />,
    },
    {
      key: 'flac',
      label: 'FLAC',
      children: <FlacTab />,
    },
    {
      key: 'setting',
      label: '设置',
      children: <SettingTab />,
    },
  ];

  return (
    <Modal
      title='测试Modal'
      open={visible}
      onCancel={close}
      width={1200}
      styles={{
        body: {
          maxHeight: '75vh',
          overflowY: 'auto',
        },
      }}
      footer={null}
      centered>
      <Tabs items={tabItems} />
    </Modal>
  );
});

export default TestModal;
