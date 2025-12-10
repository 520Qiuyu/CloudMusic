import { useConfig } from '@/hooks/useConfig';
import CloudImport from '@/views/cloudImport';
import CloudMusicManager from '@/views/cloudMusicManager';
import EmotionDecode from '@/views/emotionDecode';
import GithubInfo from '@/views/githubInfo';
import LocalUpload from '@/views/localUpload';
import PlayList from '@/views/playList';
import QuickUpload from '@/views/quickUpload';
import Search from '@/views/search';
import TestModal from '@/views/testModal';
import {
  CloudUploadOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  GithubOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  OrderedListOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useRef } from 'react';
import styles from './index.module.scss';

const ButtonGroup = () => {
  const { functionConfig } = useConfig();
  const {
    enableQuickUpload,
    enableCloudMusicManager,
    enableLocalUpload,
    enablePlayList,
    enableSearch,
    enableCloudImport,
    enableGithubInfo,
    enableTestModal,
    enableEmotionDecode,
  } = functionConfig;

  // 云盘快速上传
  const quickUploadRef = useRef(null);
  const handleQuickUpload = () => {
    quickUploadRef.current.open();
  };

  // 云盘歌曲管理
  const cloudMusicManagerRef = useRef(null);
  const handleCloudMusicManager = () => {
    cloudMusicManagerRef.current.open();
  };

  // 云盘本地上传
  const localUploadRef = useRef(null);
  const handleLocalUpload = () => {
    localUploadRef.current.open();
  };

  // 歌单管理
  const playListRef = useRef(null);
  const handlePlayList = () => {
    playListRef.current.open();
  };

  // 搜索
  const searchRef = useRef(null);
  const handleSearch = () => {
    searchRef.current.open();
  };

  // 云盘导入
  const cloudImportRef = useRef(null);
  const handleImport = () => {
    cloudImportRef.current.open();
  };

  // 情感解码
  const emotionDecodeRef = useRef(null);
  const handleEmotionDecode = () => {
    emotionDecodeRef.current.open();
  };

  // testModal
  const testModalRef = useRef(null);
  const handleTestModal = () => {
    testModalRef.current.open();
  };

  // github
  const githubInfoRef = useRef(null);
  const handleGithubInfo = () => {
    githubInfoRef.current.open();
  };

  return (
    <div className={styles['button-group']}>
      {/* 云盘快速上传 */}
      {enableQuickUpload && (
        <Tooltip title={'云盘快速上传'} placement='left'>
          <Button
            type='primary'
            icon={<CloudUploadOutlined />}
            onClick={handleQuickUpload}
            className={styles['button']}
          />
        </Tooltip>
      )}
      {/* 云盘歌曲管理 */}
      {enableCloudMusicManager && (
        <Tooltip title={'云盘歌曲管理'} placement='left'>
          <Button
            type='primary'
            icon={<CustomerServiceOutlined />}
            onClick={handleCloudMusicManager}
            className={styles['button']}
          />
        </Tooltip>
      )}
      {/* 云盘本地上传 */}
      {enableLocalUpload && (
        <Tooltip title={'云盘本地上传'} placement='left'>
          <Button
            type='primary'
            icon={<UploadOutlined />}
            onClick={handleLocalUpload}
            className={styles['button']}
          />
        </Tooltip>
      )}
      {/* 云盘导入 */}
      {enableCloudImport && (
        <Tooltip title={'云盘JSON导入'} placement='left'>
          <Button
            type='primary'
            icon={<CodeOutlined />}
            onClick={handleImport}
            className={styles['button']}
          />
        </Tooltip>
      )}
      {/* 歌单管理 */}
      {enablePlayList && (
        <Tooltip title={'歌单管理'} placement='left'>
          <Button
            type='primary'
            icon={<OrderedListOutlined />}
            onClick={handlePlayList}
            className={styles['button']}
          />
        </Tooltip>
      )}
      {/* 搜索 */}
      {enableSearch && (
        <Tooltip title={'搜索'} placement='left'>
          <Button
            type='primary'
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className={styles['button']}
          />
        </Tooltip>
      )}
      {/* 情感解码 */}
      {enableEmotionDecode && (
        <Tooltip title={'情感解码'} placement='left'>
          <Button
            type='primary'
            icon={<HeartOutlined />}
            onClick={handleEmotionDecode}
            className={styles['button']}
          />
        </Tooltip>
      )}
      {/* testModal */}
      {enableTestModal && (
        <Tooltip title={'testModal'} placement='left'>
          <Button
            type='primary'
            icon={<InfoCircleOutlined />}
            onClick={handleTestModal}
            className={styles['button']}
          />
        </Tooltip>
      )}
      {/* GitHub信息 */}
      {enableGithubInfo && (
        <Tooltip title={'GitHub信息'} placement='left'>
          <Button
            type='primary'
            icon={<GithubOutlined />}
            onClick={handleGithubInfo}
            className={styles['button']}
          />
        </Tooltip>
      )}

      {/* 云盘快速上传 */}
      <QuickUpload ref={quickUploadRef} />
      {/* 云盘歌曲管理 */}
      <CloudMusicManager ref={cloudMusicManagerRef} />
      {/* 云盘本地上传 */}
      <LocalUpload ref={localUploadRef} />
      {/* 云盘导入 */}
      <CloudImport ref={cloudImportRef} />
      {/* 歌单管理 */}
      <PlayList ref={playListRef} />
      {/* 搜索 */}
      <Search ref={searchRef} />
      {/* GitHub信息 */}
      <GithubInfo ref={githubInfoRef} />
      {/* testModal */}
      <TestModal ref={testModalRef} />
      {/* 情感解码 */}
      <EmotionDecode ref={emotionDecodeRef} />
    </div>
  );
};

export default ButtonGroup;
