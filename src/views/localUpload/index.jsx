import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Upload, Table, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const { Dragger } = Upload;

const LocalUpload = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const reset = () => setFileList([]);

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  const handleUpload = (info) => {
    const { status, name } = info.file;
    if (status === "done") {
      message.success(`${name} 上传成功`);
    } else if (status === "error") {
      message.error(`${name} 上传失败`);
    }
  };

  const columns = [
    {
      title: "文件名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          uploading: "上传中",
          done: "已完成",
          error: "失败",
        };
        return statusMap[status] || "等待上传";
      },
    },
  ];

  return (
    <Modal
      title="云盘本地上传"
      open={visible}
      onCancel={close}
      centered
      width={1000}
      footer={null}
    >
      <div className={styles["local-upload"]}>
        <div className={styles["upload-section"]}>
          <Dragger
            className={styles.dragger}
            multiple
            onChange={handleUpload}
            fileList={fileList}
            beforeUpload={(file) => {
              setFileList((prev) => [...prev, file]);
              return false;
            }}
            accept=".mp3,.flac,.wav,.m4a"
          >
            <p className={styles["upload-icon"]}>
              <InboxOutlined />
            </p>
            <p className={styles["upload-text"]}>点击或拖拽文件到此区域上传</p>
            <p className={styles["upload-hint"]}>
              支持 mp3, flac, wav, m4a 格式的音频文件
            </p>
          </Dragger>
        </div>

        <div className={styles["file-list"]}>
          <Table
            columns={columns}
            dataSource={fileList}
            rowKey={(file) => file.uid || file.name}
            pagination={false}
          />
          <div className={styles["upload-stats"]}>
            <span>共 {fileList.length} 个文件</span>
            <span className={styles.divider}>|</span>
            <span className={styles["size-text"]}>
              总大小：
              {(fileList.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default LocalUpload;
