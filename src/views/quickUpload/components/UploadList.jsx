import { Button, Empty, message, Table, Tag, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { getCDNConfig, getSongInfoList, uploadSong } from "../../../api";
import {
  formatDuration,
  formatFileSize,
  getAlbumTextInSongDetail,
  getArtistTextInSongDetail,
  mergeObjects,
  promiseLimit,
  sleep,
} from "../../../utils/index";
import { confirm, msgError, msgSuccess } from "../../../utils/modal";
import styles from "../index.module.scss";
import SearchForm from "./SearchForm";
import UploadProgress from "./UploadProgress";
import UploadStats from "./UploadStats";

export default function UploadList({ singerList }) {
  // 所有歌曲列表
  const [songList, setSongList] = useState([]);
  // 加载中
  const [loading, setLoading] = useState(false);
  // 获取歌曲信息列表
  const getSongList = async ids => {
    try {
      setLoading(true);
      if (!ids?.length) {
        msgError("请先选择歌手");
        return;
      }

      // 先获取CDN的歌曲配置信息
      const proArr = ids.map(async id => {
        const res = await getCDNConfig(id);
        return res.data;
      });
      let allConfig = await Promise.all(proArr);
      allConfig = allConfig.flat();
      const allConfigMap = Object.fromEntries(allConfig.map(item => [item.id, item]));
      // console.log("allConfig", allConfig);

      // 获取歌曲信息
      const allInfo = await getSongInfoList(allConfig.map(item => item.id));
      // console.log("allInfo", allInfo);

      // 获取上传列表
      // 此处先遍历云盘中是否拥有
      const songList = [];
      allInfo.map(({ privileges, songs }) => {
        privileges.forEach(p => {
          const otherInfo = allConfigMap[p.id];
          const defaultItem = mergeObjects(
            { ...otherInfo, artists: undefined },
            {
              id: p.id,
              name: "",
              album: "",
              albumid: 0,
              artists: "",
              bitrate: 90000,
              tns: "",
              //翻译
              dt: formatDuration(0),
              filename: "",
              picUrl: "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
              isNoCopyright: p.st < 0,
              isVIP: false,
              isPay: false,
              uploaded: p.cs,
              needMatch: otherInfo.name == void 0,
            }
          );
          const songsMap = Object.fromEntries(songs.map(s => [s.id, s]));
          const song = songsMap[p.id];
          if (song) {
            const artists = getArtistTextInSongDetail(song);
            mergeObjects(defaultItem, song, {
              album: getAlbumTextInSongDetail(song),
              artists,
              dt: formatDuration(song.dt),
              filename: song.name ? `  ${song.name}.${otherInfo.ext}` : undefined,
              picUrl:
                song.al?.picUrl ||
                "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
              isVIP: song.fee === 1,
              isPay: song.fee === 4,
            });
          }
          if (otherInfo.name) {
            defaultItem.name = otherInfo.name;
            defaultItem.album ||= otherInfo.al?.name || otherInfo.album || "";
            defaultItem.artists ||= otherInfo.ar || otherInfo.artists?.join();
            defaultItem.filename ||= `${defaultItem.name}.${otherInfo.ext}` || "未知.flac";
          }

          songList.push(defaultItem);
        });
      });
      setSongList(songList);
      setFilteredSongList(songList);
    } catch (error) {
      console.log("error", error);
      message.error("获取歌曲信息失败", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('singerList',singerList)
    getSongList(singerList);
  }, [singerList]);

  // 筛选后的歌曲列表
  const [filteredSongList, setFilteredSongList] = useState([]);
  const handleSearch = values => {
    const { name, artists, album } = values;
    const filtered = songList.filter(song => {
      const nameMatch =
        !name?.length || name.some(n => song.name?.toLowerCase().includes(n.toLowerCase()));
      const artistMatch =
        !artists?.length || artists.some(a => song.artists.toLowerCase().includes(a.toLowerCase()));
      const albumMatch =
        !album?.length || album.some(a => song.album.toLowerCase().includes(a.toLowerCase()));
      return nameMatch && artistMatch && albumMatch;
    });
    setFilteredSongList(filtered);
  };

  /** 选择 */
  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    type: "checkbox",
    fixed: true,
    getCheckboxProps: record => ({
      disabled: record.uploaded,
    }),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };
  /** 上传事件 */
  const handleUpload = async record => {
    try {
      setFilteredSongList(songList => {
        return songList.map(song => {
          if (song.id === record.id) song.uploading = true;
          return song;
        });
      });
      const res = await uploadSong(record);
      msgSuccess("上传成功");
      getSongList(singerList);
    } catch (error) {
      console.log("error", error);
    } finally {
      setFilteredSongList(songList => {
        return songList.map(song => {
          if (song.id === record.id) song.uploading = false;
          return song;
        });
      });
    }
  };

  const columns = [
    // 上传状态
    {
      title: "上传状态",
      dataIndex: "uploaded",
      key: "uploaded",
      width: 140,
      align: "center",
      filters: [
        { text: "已上传", value: true },
        { text: "未上传", value: false },
      ],
      onFilter: (value, record) => record.uploaded === value,
      defaultFilterValue: [false],
      render: (_, record) => {
        if (record.uploaded) return <Tag color="success">已上传</Tag>;
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => handleUpload(record)}
            loading={record.uploading}
          >
            上传
          </Button>
        );
      },
    },
    {
      title: "歌曲",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a, b) => a.name?.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={record.picUrl}
            alt={text}
            style={{ width: "40px", height: "40px", borderRadius: "4px" }}
          />
          <div>
            <div>{text}</div>
            {record.tns && <div style={{ color: "#666", fontSize: "12px" }}>{record.tns}</div>}
          </div>
        </div>
      ),
    },
    {
      title: "艺术家",
      dataIndex: "artists",
      key: "artists",
      width: 180,
      sorter: (a, b) => a.artists?.localeCompare(b.artists),
      sortDirections: ["ascend", "descend"],
      ellipsis: true,
    },
    {
      title: "专辑",
      dataIndex: "album",
      key: "album",
      width: 160,
      sorter: (a, b) => a.album?.localeCompare(b.album),
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "descend",
      ellipsis: true,
    },
    {
      title: "时长",
      dataIndex: "dt",
      key: "dt",
      width: 80,
      sorter: (a, b) => a.dt?.localeCompare(b.dt),
      sortDirections: ["ascend", "descend"],
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
      title: "备注",
      key: "status",
      width: 120,
      render: (_, record) => {
        if (record.isNoCopyright) return <Tag color="error">无版权</Tag>;
        if (record.isVIP) return <Tag color="warning">VIP</Tag>;
        if (record.isPay) return <Tag color="success">付费</Tag>;
        if (record.uploaded) return <Tag color="processing">已上传</Tag>;
      },
    },
    // 歌曲大小
    {
      title: "歌曲大小",
      dataIndex: "size",
      key: "size",
      width: 120,
      render: size => formatFileSize(size),
    },
    // 歌曲后缀
    {
      title: "歌曲后缀",
      dataIndex: "ext",
      key: "ext",
      width: 100,
      render: ext => <Tag color="blue">{ext}</Tag>,
    },
  ];

  /** 表格change */
  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredSongList(songList => {
      return songList.sort((a, b) => {
        const order = sorter.order === "ascend" ? 1 : -1;
        return order * a[sorter.columnKey]?.localeCompare(b[sorter.columnKey]);
      });
    });
  };

  // 上传进度弹窗实例
  const uploadProgressRef = useRef(null);
  // 已上传歌曲
  const [uploadedSongList, setUploadedSongList] = useState([]);
  // 上传失败的歌曲
  const [uploadFailedSongList, setUploadFailedSongList] = useState([]);
  // 待上传歌曲
  const [toUploadingSongList, setToUploadingSongList] = useState([]);
  // 上传中
  const [uploading, setUploading] = useState(false);
  // 上传并发量
  const [concurrency, setConcurrency] = useState(6);
  // 初始化上述数据
  const resetData = () => {
    setUploadedSongList([]);
    setToUploadingSongList([]);
    setUploadFailedSongList([]);
  };
  /** 批量上传 */
  const handleBatchUpload = async (songs, needConfirm = true) => {
    try {
      if (uploading) return;
      resetData();
      setUploading(true);
      console.log("将要批量上传的选中的歌曲", songs);
      // 过滤出待上传的歌曲
      const uploadSongList = songs.filter(song => !song.uploaded);
      setToUploadingSongList(uploadSongList);
      if (!uploadSongList.length) return msgError("没有可上传的歌曲");
      // 确认上传
      if (needConfirm) {
        await UploadConfirm({
          total: songs.length,
          uploaded: 0,
          toUpload: uploadSongList,
        });
      }
      // 显示上传进度
      uploadProgressRef.current?.open();
      // 并发限制上传
      const tasks = uploadSongList.map(song => async () => {
        try {
          const res = await uploadSong(song);
          song.uploaded = true;
          setUploadedSongList(list => [...list, song]);
          return res;
        } catch (error) {
          song.uploaded = true;
          setUploadFailedSongList(list => [...list, song]);
          return error;
        }
      });
      const results = await promiseLimit(tasks, concurrency || 6);
      // 刷新列表
      getSongList(singerList);
      const successCount = results.filter(r => !(r instanceof Error)).length;
      const failedCount = results.length - successCount;
      msgSuccess(`上传完成: 成功${successCount}首，失败${failedCount}首`);
    } catch (error) {
      console.log("error", error);
    } finally {
      setUploading(false);
    }
  };
  /** 全部上传 */
  const handleUploadAll = async () => {
    handleBatchUpload(filteredSongList);
  };
  /** 上传选中的 */
  const handleUploadSelected = async () => {
    handleBatchUpload(selectedRows);
  };
  /** 按专辑上传 */
  const handleUploadByAlbum = async () => {
    try {
      if (uploading) return;
      resetData();
      setUploading(true);
      console.log("将要批量上传的选中的歌曲", selectedRows);
      const albumMap = {};
      filteredSongList.forEach(song => {
        if (!albumMap[song.album]) albumMap[song.album] = [];
        albumMap[song.album].push(song);
      });
      console.log("albumMap", albumMap);
      const albumList = Object.values(albumMap);
      const uploadAlbumList = albumList.map(album => album.filter(song => !song.uploaded));
      await UploadConfirm({
        total: filteredSongList?.length,
        uploaded: 0,
        toUpload: uploadAlbumList?.flat(),
      });
      let index = 1;
      for (const album of albumList) {
        msgSuccess(
          `当前正在上传第${index}/${albumList.length}专辑，开始上传专辑: ${album[0].album}`
        );
        console.log(
          `当前正在上传第${index}/${albumList.length}专辑，开始上传专辑: ${album[0].album}`,
          album
        );
        await handleBatchUpload(album, false);
        index++;
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {singerList?.length ? (
        <div className={styles["upload-list"]}>
          <SearchForm
            onSearch={handleSearch}
            songList={songList}
          />
          <Table
            rowSelection={rowSelection}
            dataSource={filteredSongList}
            columns={columns}
            scroll={{ y: 400, x: 1000 }}
            size="small"
            loading={loading}
            rowKey={({ artists, id, name }) => name + artists + id}
            onChange={handleTableChange}
          />
          {/* 底部操作区 */}
          <div className={styles["upload-footer"]}>
            <UploadStats
              selectedRows={selectedRows}
              filteredSongList={filteredSongList}
            />
            {/* 并发量控制 */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>并发量：</span>
              <Input
                type="number"
                min={1}
                max={6}
                value={concurrency}
                style={{ width: 80 }}
                onChange={e => setConcurrency(Number(e.target.value))}
                placeholder="1-6"
              />
            </div>
            {/* 上传选中的 */}
            <Button
              type="primary"
              onClick={() => handleUploadSelected()}
              disabled={!selectedRows.length}
              loading={uploading}
            >
              批量上传
            </Button>
            {/* 全部上传 */}
            <Button
              type="primary"
              onClick={() => handleUploadAll()}
              loading={uploading}
            >
              全部上传
            </Button>
            {/* 按专辑上传 */}
            <Button
              type="primary"
              onClick={handleUploadByAlbum}
              loading={uploading}
            >
              按专辑上传
            </Button>
          </div>
        </div>
      ) : (
        <Empty
          description="请先选择歌手"
          style={{
            height: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}

      {/* 上传进度弹窗 */}
      <UploadProgress
        ref={uploadProgressRef}
        total={toUploadingSongList.length}
        uploadedList={uploadedSongList}
        uploadFailedSongList={uploadFailedSongList}
      />
    </>
  );
}

/** 上传确认框 */
const UploadConfirm = ({ total, uploaded, toUpload }) => {
  return confirm(
    <div className={styles["upload-confirm"]}>
      <div className={styles["confirm-item"]}>
        <span className={styles.label}>总计歌曲：</span>
        <span className={styles.value}>{total} 首</span>
      </div>
      <div className={styles["confirm-item"]}>
        <span className={styles.label}>已上传：</span>
        <span className={styles.value}>{uploaded} 首</span>
      </div>
      <div className={styles["confirm-item"]}>
        <span className={styles.label}>待上传：</span>
        <span className={styles.value}>
          {toUpload.length} 首
          <span className={styles.size}>
            （{formatFileSize(toUpload.reduce((acc, cur) => acc + cur.size, 0))}）
          </span>
        </span>
      </div>
    </div>,
    "上传歌曲"
  );
};
