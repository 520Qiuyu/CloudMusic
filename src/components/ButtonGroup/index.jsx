import {
  CloudUploadOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  GithubOutlined,
  InfoCircleOutlined,
  OrderedListOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useRef } from 'react';
import CloudImport from '../../views/cloudImport';
import CloudMusicManager from '../../views/cloudMusicManager';
import GithubInfo from '../../views/githubInfo';
import LocalUpload from '../../views/localUpload';
import PlayList from '../../views/playList';
import QuickUpload from '../../views/quickUpload';
import TestModal from '../../views/testModal';
import styles from './index.module.scss';

const ButtonGroup = () => {
  console.log('import.meta.env.MODE', import.meta.env.MODE);
  const isSell = import.meta.env.MODE === 'sell';

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

  // 查看歌单
  const playListRef = useRef(null);
  const handlePlayList = () => {
    playListRef.current.open();
  };

  // 云盘导入
  const cloudImportRef = useRef(null);
  const handleImport = () => {
    cloudImportRef.current.open();
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
      <Tooltip title={'云盘快速上传'} placement='left'>
        <Button
          type='primary'
          icon={<CloudUploadOutlined />}
          onClick={handleQuickUpload}
          className={styles['button']}
        />
      </Tooltip>

      {/* 云盘歌曲管理 */}
      <Tooltip title={'云盘歌曲管理'} placement='left'>
        <Button
          type='primary'
          icon={<CustomerServiceOutlined />}
          onClick={handleCloudMusicManager}
          className={styles['button']}
        />
      </Tooltip>

      {/* 云盘本地上传 */}
      {!isSell && (
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
      <Tooltip title={'云盘JSON导入'} placement='left'>
        <Button
          type='primary'
          icon={<CodeOutlined />}
          onClick={handleImport}
          className={styles['button']}
        />
      </Tooltip>

      {/* 查看歌单 */}
      {!isSell && (
        <Tooltip title={'查看歌单'} placement='left'>
          <Button
            type='primary'
            icon={<OrderedListOutlined />}
            onClick={handlePlayList}
            className={styles['button']}
          />
        </Tooltip>
      )}

      {/* testModal */}
      {!isSell && (
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
      {!isSell && (
        <Tooltip title={'GitHub信息'} placement='left'>
          <Button
            type='primary'
            icon={<GithubOutlined />}
            onClick={handleGithubInfo}
            className={styles['button']}
          />
        </Tooltip>
      )}

      {/* 弹窗组件 */}
      <QuickUpload ref={quickUploadRef} />
      <CloudMusicManager ref={cloudMusicManagerRef} />
      <LocalUpload ref={localUploadRef} />
      <CloudImport ref={cloudImportRef} />
      {/* testModal */}
      <TestModal ref={testModalRef} />
      {/* 查看歌单 */}
      <PlayList ref={playListRef} />
      <CloudImport ref={cloudImportRef} />
      <GithubInfo ref={githubInfoRef} />
    </div>
  );
};

export default ButtonGroup;
