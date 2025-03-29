import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Upload, Table, message, Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import { uploadLocalSong } from "@/api";
import { formatFileSize, promiseLimit } from "@/utils";

const { Dragger } = Upload;

const LocalUpload = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const open = () => {
    reset();
    setVisible(true);
  };
  const close = () => setVisible(false);
  const reset = () => setFileList([]);

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  const [loading, setLoading] = useState(false);
  const handleUpload = async () => {
    try {
      setLoading(true);
      const uploadPromises = fileList.map(file => async () => {
        try {
          if (file.status === "done") {
            return;
          }
          file.status = "uploading";
          const res = await uploadLocalSong(file);
          file.status = "done";
          return res;
        } catch (e) {
          file.status = "error";
          return null;
        } finally {
          setFileList(prev => [...prev]);
        }
      });
      const res = await promiseLimit(uploadPromises, 2);
      console.log("res", res);
      message.success("上传成功");
      const info = {
        list: res.filter(Boolean),
        count: res.filter(Boolean).length,
        size: formatFileSize(res.filter(Boolean).reduce((acc, file) => acc + file.size, 0)),
        artist: res.filter(Boolean)?.[0].artist || "",
      };
      // 下载文件
      const blob = new Blob([JSON.stringify(info, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = info.artist + ".json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
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
      render: size => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        if (status === "done") {
          return (
            <Progress
              percent={100}
              size="small"
              status="success"
            />
          );
        }
        if (status === "error") {
          return (
            <Progress
              percent={100}
              size="small"
              status="exception"
            />
          );
        }
        if (status === "uploading") {
          return (
            <Progress
              percent={record.progress || 0}
              size="small"
              status="active"
            />
          );
        }
        return (
          <Progress
            percent={0}
            size="small"
          />
        );
      },
    },
  ];

  return (
    <Modal
      title="云盘本地上传"
      open={visible}
      onCancel={close}
      onOk={handleUpload}
      confirmLoading={loading}
      centered
      width={1000}
    >
      <div className={styles["local-upload"]}>
        <div className={styles["upload-section"]}>
          <Dragger
            className={styles.dragger}
            multiple
            fileList={fileList}
            beforeUpload={file => {
              setFileList(prev => [...prev, file]);
              return false;
            }}
            showUploadList={false}
            accept=".mp3,.flac,.wav,.m4a"
          >
            <p className={styles["upload-icon"]}>
              <InboxOutlined />
            </p>
            <p className={styles["upload-text"]}>点击或拖拽文件到此区域上传</p>
            <p className={styles["upload-hint"]}>支持 mp3, flac, wav, m4a 格式的音频文件</p>
          </Dragger>
        </div>

        <div className={styles["file-list"]}>
          <Table
            columns={columns}
            dataSource={fileList}
            rowKey={file => file.uid || file.name}
            scroll={{ y: 300 }}
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
