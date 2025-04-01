import { Avatar, Button, Select, Table, Tag } from "antd";
import { Input } from "antd/lib";
import { useSongMatch } from "../context/SongMatchContext";
import styles from "./index.module.scss";

export default function SingerMatchArea({ singerId }) {
  const { singerMap, updateSongMatchInfo } = useSongMatch();
  const singerInfo = singerMap[singerId]?.singerInfo || {};
  const songList = singerMap[singerId]?.songList || [];
  const cdnConfig = singerMap[singerId]?.cdnConfig || [];

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
      title: "匹配歌曲ID",
      dataIndex: "match",
      key: "match",
      render: (match, record, index) => {
        return (
          <Input
            placeholder="请输入"
            value={match}
            onChange={e => {
              updateSongMatchInfo(singerId, index, e.target.value);
            }}
          />
        );
      },
    },
    // 匹配
    {
      title: "匹配",
      dataIndex: "name",
      key: "name",
      width: 230,
      render: (name, record, index) => {
        const value = record?.match || songMap[name]?.id;
        // console.log("value", value, record, songMap[name]);
        if (value && !record?.match) {
          updateSongMatchInfo(singerId, index, value);
          console.log("value", value, record?.match, songMap[name]?.id);
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
              updateSongMatchInfo(singerId, index, value);
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
            id: item.match || item.id,
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
          <div className={styles["singer-name"]}>
            {singerInfo?.artistName}({singerInfo?.artistId})
          </div>
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
