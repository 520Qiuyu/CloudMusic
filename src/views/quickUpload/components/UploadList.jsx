import React, { useEffect, useState } from "react";
import { getCDNConfig } from "../../../api";
import styles from "../index.module.scss";
import { Table } from "antd";
import {
  chunkArray,
  getAlbumTextInSongDetail,
  getArtistTextInSongDetail,
  weapiRequest,
  formatDuration,
} from "../../../utils/index";
import { UPLOAD_CHUNK_SIZE } from "../../../constant";

const defaultSearchParams = {
  /* text: "",
  noCopyright: true,
  vip: true,
  pay: true,
  lossless: false,
  all: showAll,
  songIndexs: [], */
};
export default function UploadList({ singerList }) {
  const [searchParams, setSearchParams] = useState({});

  // 歌曲列表
  const [songList, setSongList] = useState([]);
  // 加载中
  const [loading, setLoading] = useState(false);
  // 获取歌曲信息列表
  const getSongList = async (ids) => {
    try {
      setLoading(true);
      if (!ids?.length) return;

      // 先获取CDN的歌曲配置信息
      const proArr = ids.map(async (id) => {
        const res = await getCDNConfig(id);
        return res.data;
      });
      let all = await Promise.all(proArr);
      all = all.flat();
      console.log("all", all);

      // 获取歌曲信息
      // 此处每次最多获取1000条 顾用1000进行切割chunk
      const proArr2 = chunkArray(all, 1000).map(
        (chunk) =>
          new Promise((resolve, reject) => {
            weapiRequest("/api/v3/song/detail", {
              data: {
                c: JSON.stringify(chunk.map((item) => ({ id: item.id }))),
              },
              onload: (res) => {
                console.log("歌曲信息", res);
                resolve(res);
              },
              onerror: (res) => {
                console.log("歌曲信息", res);
                reject(res);
              },
            });
          })
      );
      let allInfo = await Promise.all(proArr2);
      allInfo = allInfo.flat();
      console.log("allSongInfo", allInfo);

      // 获取上传列表
      // 此处先遍历云盘中是否拥有
      const songList = [];
      allInfo.map(({ privileges, songs }) => {
        privileges.forEach((p) => {
          //
          if (!p.cs) {
            const defaultItem = {
              id: p.id,
              name: "未知",
              album: "未知",
              albumid: 0,
              artists: "未知",
              tns: "",
              //翻译
              dt: formatDuration(0),
              filename: "未知." + p.ext,
              ext: p.ext,
              md5: p.md5,
              size: p.size,
              bitrate: p.br,
              picUrl:
                "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
              isNoCopyright: p.st < 0,
              isVIP: false,
              isPay: false,
              uploaded: false,
              needMatch: false,
            };
            const songsMap = Object.fromEntries(songs.map((s) => [s.id, s]));
            const song = songsMap[p.id];
            if (song) {
              Object.assign(defaultItem, song, {
                album: getAlbumTextInSongDetail(song),
                artists: getArtistTextInSongDetail(song),
                dt: formatDuration(song.dt),
                filename: `${song.artists}-${song.name}.${song.ext}`,
                picUrl:
                  song.al?.picUrl ||
                  "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
                isVIP: song.fee === 1,
                isPay: song.fee === 4,
              });
            }
            songList.push(defaultItem);
          }
          //
          else {
            console.log("p", p);
          }
        });
      });
      console.log("songList", songList);
      setSongList(songList);
    } catch (error) {
      console.log("error", error);
      message.error("获取歌曲信息失败", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSongList(singerList);
  }, [singerList]);

  const columns = [
    {
      title: "歌曲",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={record.picUrl}
            alt={text}
            style={{ width: "40px", height: "40px", borderRadius: "4px" }}
          />
          <div>
            <div>{text}</div>
            {record.tns && (
              <div style={{ color: "#666", fontSize: "12px" }}>
                {record.tns}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "艺术家",
      dataIndex: "artists",
      key: "artists",
      width: 180,
      ellipsis: true,
    },
    {
      title: "专辑",
      dataIndex: "album",
      key: "album",
      width: 160,
      ellipsis: true,
    },
    {
      title: "时长",
      dataIndex: "dt",
      key: "dt",
      width: 80,
    },
    {
      title: "音质",
      key: "quality",
      width: 100,
      render: (_, record) => {
        const quality = [];
        if (record.sq) quality.push("无损");
        if (record.h?.br >= 320000) quality.push("320K");
        return quality.join(" / ") || "标准";
      },
    },
    {
      title: "状态",
      key: "status",
      width: 120,
      render: (_, record) => {
        if (record.isNoCopyright)
          return <span style={{ color: "#ff4d4f" }}>无版权</span>;
        if (record.isVIP) return <span style={{ color: "#faad14" }}>VIP</span>;
        if (record.isPay) return <span style={{ color: "#52c41a" }}>付费</span>;
        if (record.uploaded)
          return <span style={{ color: "#1890ff" }}>已上传</span>;
        return "待上传";
      },
    },
    // 歌曲id
    {
      title: "歌曲ID",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    // 歌曲大小
    {
      title: "歌曲大小",
      dataIndex: "size",
      key: "size",
      width: 120,
    },
    // 歌曲后缀
    {
      title: "歌曲后缀",
      dataIndex: "ext",
      key: "ext",
      width: 100,
    },
    // md5
    {
      title: "md5",
      dataIndex: "md5",
      key: "md5",
      width: 200,
    },
  ];

  return (
    <div className={styles["upload-list"]}>
      <Table
        dataSource={songList}
        columns={columns}
        scroll={{ y: 400, x: 1000 }}
        size="small"
      />
    </div>
  );
}
