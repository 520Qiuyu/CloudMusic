import React, { useRef } from "react";
import { Button, Tooltip } from "antd";
import {
  CloudUploadOutlined,
  SyncOutlined,
  UploadOutlined,
  DownloadOutlined,
  CustomerServiceOutlined,
  ImportOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UnlockOutlined,
  OrderedListOutlined,
  ApiOutlined,
  ConsoleSqlOutlined,
  CodeOutlined,
  GithubOutlined,
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
import PlayList from "../../views/playList";
import SongMatchCorrect from "../../views/songMatchCorrect";
import SongResourceManage from "@/views/SongResourceManage";
import GithubInfo from "../../views/githubInfo";

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

  // 查看歌单
  const playListRef = useRef(null);
  const handlePlayList = () => {
    playListRef.current.open();
  };

  // 歌曲资源管理
  const songResourceRef = useRef(null);
  const handleSongResource = () => {
    songResourceRef.current.open();
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

  //

  // 歌曲自动尝试匹配
  const songMatchCorrectRef = useRef(null);
  const handleMatchCorrect = () => {
    songMatchCorrectRef.current.open();
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

      {/* 歌曲自动匹配 */}
      <Tooltip
        title={"歌曲自动匹配"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<ApiOutlined />}
          onClick={handleMatchCorrect}
          className={styles["button"]}
        />
      </Tooltip>

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

      {/* 歌曲资源管理 */}
      <Tooltip
        title={"歌曲资源管理"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<ConsoleSqlOutlined />}
          onClick={handleSongResource}
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
      <Tooltip
        title={"云盘JSON导入"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<CodeOutlined />}
          onClick={handleImport}
          className={styles["button"]}
        />
      </Tooltip>

      {/* 查看歌单 */}
      <Tooltip
        title={"查看歌单"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<OrderedListOutlined />}
          onClick={handlePlayList}
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

      {/* GitHub信息 */}
      <Tooltip
        title={"GitHub信息"}
        placement="left"
      >
        <Button
          type="primary"
          icon={<GithubOutlined />}
          onClick={handleGithubInfo}
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
      {/* testModal */}
      <TestModal ref={testModalRef} />
      {/* 查看歌单 */}
      <PlayList ref={playListRef} />
      <SongMatchCorrect ref={songMatchCorrectRef} />
      {/* 歌曲资源管理 */}
      <SongResourceManage ref={songResourceRef} />
      <CloudImport ref={cloudImportRef} />
      <GithubInfo ref={githubInfoRef} />
    </div>
  );
};

export default ButtonGroup;
