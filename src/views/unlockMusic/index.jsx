import { Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import styles from "./index.module.scss";
import UploadArea from "./components/UploadArea";
import UnlockList from "./components/UnlockList";

const UnlockMusic = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const reset = () => {};

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  // 待解锁文件列表
  const [fileList, setFileList] = useState([]);

  // 处理文件上传
  const handleUpload = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      status: "waiting", // waiting, unlocking, success, error
      progress: 0,
    }));
    setFileList((list) => [...list, ...newFiles]);
  };

  return (
    <Modal
      title="加密音乐解锁"
      open={visible}
      onCancel={close}
      width={950}
      footer={null}
      centered
    >
      <div className={styles.container}>
        <UploadArea onUpload={handleUpload} />
        <UnlockList fileList={fileList} />
      </div>
    </Modal>
  );
});

export default UnlockMusic;