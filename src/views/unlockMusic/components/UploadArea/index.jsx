import { CloudUploadOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./index.module.scss";

const UploadArea = ({ onUpload }) => {
  // 处理文件拖拽
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    onUpload?.(files);
  };

  // 处理文件选择
  const handleFileSelect = (e) => {
    const files = e.target.files;
    onUpload?.(files);
    e.target.value = null;
  };

  return (
    <div
      className={styles.uploadArea}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept=".ncm,.qmc,.mflac,.mgg,.kgm,.xm,.kwm"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id="file-input"
      />
      <label htmlFor="file-input" className={styles.uploadContent}>
        <CloudUploadOutlined className={styles.uploadIcon} />
        <div className={styles.uploadText}>
          <p>点击或拖拽文件到此处</p>
          <p className={styles.uploadTip}>
            支持格式：{/* 网易云音乐(ncm), */} QQ音乐(mflac), 酷狗音乐(kgm),{/*  虾米音乐(xm), */} 酷我音乐(.kwm)
          </p>
        </div>
      </label>
    </div>
  );
};

export default UploadArea;