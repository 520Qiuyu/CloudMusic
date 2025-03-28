import { Button, Progress, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import unlock from "./unlock";

const UnlockList = ({ fileList }) => {
  const columns = [
    {
      title: "文件名",
      dataIndex: "name",
      key: "name",
      width: 300,
      ellipsis: true,
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: 100,
      render: size => `${(size / 1024 / 1024).toFixed(2)}MB`,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: status => {
        const statusMap = {
          waiting: { text: "等待中", color: "default" },
          unlocking: { text: "解锁中", color: "processing" },
          success: { text: "已完成", color: "success" },
          error: { text: "失败", color: "error" },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: "进度",
      dataIndex: "progress",
      key: "progress",
      width: 200,
      render: (progress, record) => (
        <Progress
          percent={progress}
          size="small"
          status={
            record.status === "error"
              ? "exception"
              : record.status === "success"
                ? "success"
                : "active"
          }
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => {
        if (record.status === "success") {
          return (
            <Button
              type="link"
              size="small"
            >
              下载
            </Button>
          );
        }
        return null;
      },
    },
  ];

  const [list, setList] = useState(fileList);
  useEffect(() => {
    console.log("fileList", fileList);
    setList(fileList);
    // 开始解密
    fileList.forEach(async item => {
      if (item.status === "waiting") {
        // 初始化状态
        item.status = "unlocking";
        item.progress = 0;
        // 开始解密
        const res = await unlock(item.file)
        setTimeout(() => {
          item.status = "success";
          item.progress = 100;
          setList([...fileList]);
        }, 2000);
      }
    });
  }, [fileList]);

  return (
    <div className={styles.unlockList}>
      <Table
        dataSource={list}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ y: 400 }}
      />
    </div>
  );
};

export default UnlockList;
