import React, { useRef } from "react";
import { Button, Tooltip } from "antd";
import {
  CloudUploadOutlined,
  SyncOutlined,
  UploadOutlined,
  DownloadOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  ImportOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import QuickUpload from "../../views/quickUpload";
import QualityUpgrade from "../../views/qualityUpgrade";
import LocalUpload from "../../views/localUpload";
import VipSongA from "../../views/vipSongA";
import VipSongB from "../../views/vipSongB";
import CloudExport from "../../views/cloudExport";
import CloudImport from "../../views/cloudImport";
import TestModal from "../../views/testModal";
import CloudMusicManager from "../../views/cloudMusicManager";
import UnlockMusic from "../../views/unlockMusic";

const ButtonGroup = () => {
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

  // 云盘音质提升
  const qualityUpgradeRef = useRef(null);
  const handleQualityUpgrade = () => {
    qualityUpgradeRef.current.open();
  };

  // 云盘本地上传
  const localUploadRef = useRef(null);
  const handleLocalUpload = () => {
    localUploadRef.current.open();
  };

  // 加密音乐解锁
  const unlockMusicRef = useRef(null);
  const handleUnlockMusic = () => {
    unlockMusicRef.current.open();
  };

  // 网页VIP歌曲A
  const vipSongARef = useRef(null);
  const handleVipSongA = () => {
    vipSongARef.current.open();
  };

  // 网页VIP歌曲B
  const vipSongBRef = useRef(null);
  const handleVipSongB = () => {
    vipSongBRef.current.open();
  };

  // 云盘导出
  const cloudExportRef = useRef(null);
  const handleExport = () => {
    cloudExportRef.current.open();
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

  return (
    <div className={styles["button-group"]}>
      {/* 云盘快速上传 */}
      <Tooltip
        title={"云盘快速上传"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={handleQuickUpload}
          className={styles["button"]}
        />
      </Tooltip>

      {/* 云盘歌曲管理 */}
      <Tooltip
        title={"云盘歌曲管理"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<CustomerServiceOutlined />}
          onClick={handleCloudMusicManager}
          className={styles["button"]}
        />
      </Tooltip>

      {/* 云盘快速同步 */}
      {/* <Tooltip title={"云盘快速同步"} placement="left">
        <Button
          type="primary"
          icon={<SyncOutlined />}
          onClick={handleMatchCorrect}
          className={styles["button"]}
        />
      </Tooltip> */}

      {/* 云盘音质提升 */}
      {/* <Tooltip title={"云盘音质提升"} placement="left">
        <Button
          type="primary"
          icon={<CustomerServiceOutlined />}
          onClick={handleQualityUpgrade}
          className={styles["button"]}
        />
      </Tooltip> */}

      {/* 云盘本地上传 */}
      <Tooltip
        title={"云盘本地上传"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={handleLocalUpload}
          className={styles["button"]}
        />
      </Tooltip>

      {/* 网页VIP歌曲A */}
      {/* <Tooltip title={"网页VIP歌曲A"} placement="left">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleVipSongA}
          className={styles["button"]}
        />
      </Tooltip> */}

      {/* 网页VIP歌曲B */}
      {/* <Tooltip title={"网页VIP歌曲B"} placement="left">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleVipSongB}
          className={styles["button"]}
        />
      </Tooltip> */}

      {/* 云盘导出 */}
      {/* <Tooltip title={"云盘导出"} placement="left">
        <Button
          type="primary"
          icon={<ExportOutlined />}
          onClick={handleExport}
          className={styles["button"]}
        />
      </Tooltip> */}

      {/* 云盘导入 */}
      {/* <Tooltip title={"云盘导入"} placement="left">
        <Button
          type="primary"
          icon={<ImportOutlined />}
          onClick={handleImport}
          className={styles["button"]}
        />
      </Tooltip> */}

      {/* 加密音乐解锁 */}
      <Tooltip
        title={"加密音乐解锁"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<UnlockOutlined />}
          onClick={handleUnlockMusic}
          className={styles["button"]}
        />
      </Tooltip>

      {/* testModal */}
      <Tooltip
        title={"testModal"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<InfoCircleOutlined />}
          onClick={handleTestModal}
          className={styles["button"]}
        />
      </Tooltip>

      {/* 弹窗组件 */}
      <QuickUpload ref={quickUploadRef} />
      <CloudMusicManager ref={cloudMusicManagerRef} />
      <QualityUpgrade ref={qualityUpgradeRef} />
      <LocalUpload ref={localUploadRef} />
      <VipSongA ref={vipSongARef} />
      <VipSongB ref={vipSongBRef} />
      <CloudExport ref={cloudExportRef} />
      <CloudImport ref={cloudImportRef} />
      <UnlockMusic ref={unlockMusicRef} />
      {/* testModal */}
      <TestModal ref={testModalRef} />
    </div>
  );
};

export default ButtonGroup;
