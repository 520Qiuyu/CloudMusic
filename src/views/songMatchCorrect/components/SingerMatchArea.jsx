import { Table, Tag, Select, Button } from "antd";
import React from "react";
import styles from "./index.module.scss";
import Avatar from "antd/lib/avatar/avatar";
import { Space } from "antd";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function SingerMatchArea({ singerInfo, songList, cdnConfig }) {
  const songOptions = songList.map(item => ({
    ...item,
    label: item.name,
    value: item.id,
  }));
  const songMap = songList.reduce((acc, cur) => {
    acc[cur.name] = cur;
    return acc;
  }, {});

  const columns = [
    {
      title: "歌曲名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "专辑",
      dataIndex: "album",
      key: "album",
    },
    {
      title: "艺术家",
      dataIndex: "artists",
      key: "artists",
      render: artists => artists?.join(", "),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      render: size => `${(size / 1024 / 1024).toFixed(2)}MB`,
    },
    {
      title: "比特率",
      dataIndex: "bitrate",
      key: "bitrate",
      render: bitrate => `${bitrate}kbps`,
    },
    // 匹配
    {
      title: "匹配",
      dataIndex: "name",
      key: "name",
      width: 230,
      render: (name, record, index) => {
        const value = record?.match || songMap[name]?.id;
        if (value) {
          record.match = value;
        }
        return (
          <Select
            style={{ width: 200 }}
            showSearch
            placeholder="请选择"
            filterOption={(input, option) => option?.label?.indexOf(input) >= 0}
            options={songOptions}
            optionRender={option => {
              const data = option.data;
              return (
                <div className={styles["option-label"]}>
                  <span className={styles["song-name"]}>{option.label}</span>
                  <div className={styles["tag-group"]}>
                    {data.al?.name && <Tag color="blue">{data.al?.name}</Tag>}
                    {data.ar?.length &&
                      data.ar?.map((artist, index) => (
                        <Tag
                          key={index}
                          color="green"
                        >
                          {artist.name}
                        </Tag>
                      ))}
                  </div>
                </div>
              );
            }}
            value={value}
            onChange={value => {
              record.match = value;
              //   newConfig.current[index].id = value;
            }}
          />
        );
      },
    },
  ];

  const handleGetMatchResult = () => {
    console.log("cdnConfig", cdnConfig);
    // 以json下载
    const blob = new Blob(
      [
        JSON.stringify(
          cdnConfig.map(item => ({
            ...item,
            id: item.match,
          })),
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${singerInfo?.artistName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles["singer-match-area"]}>
      <div className={styles["singer-info"]}>
        <Avatar
          size={80}
          src={singerInfo?.picUrl}
          alt={singerInfo?.artistName}
          shape="circle"
        />
        <div className={styles["singer-detail"]}>
          <div className={styles["singer-name"]}>{singerInfo?.artistName}</div>
          <div className={styles["singer-music-num"]}>共{songList?.length}首歌曲</div>
        </div>
      </div>
      <Table
        dataSource={cdnConfig}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ y: 300, x: 1000 }}
        size="small"
        className={styles["song-table"]}
      />
      {/* 按钮层 */}
      <div className={styles["button-group"]}>
        {/* 获取匹配结果 */}
        <Button
          type="primary"
          onClick={handleGetMatchResult}
        >
          获取匹配结果
        </Button>
      </div>
    </div>
  );
}
