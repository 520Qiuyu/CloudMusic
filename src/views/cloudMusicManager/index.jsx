import { CopyrightOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Tag, message } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addSongToPlaylist,
  createPlaylist,
  deleteCloudSong,
  getCloudData,
  getPlaylistList,
} from "../../api";
import { sleep, truncateString } from "../../utils";
import { confirm, msgError, msgSuccess } from "../../utils/modal";
import PlayList from "./components/PlayList";
import SearchForm from "./components/SearchForm";
import Stats from "./components/Stats";
import styles from "./index.module.scss";

const CloudMusicManager = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const reset = () => {};

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  const [songList, setSongList] = useState([]);
  const [loading, setLoading] = useState(false);
  // 获取云盘数据
  const getCloudDataList = async () => {
    try {
      setLoading(true);
      const res = await getCloudData(10000, 0);
      if (res.code === 200) {
        console.log("songList", res.data);
        setSongList(res.data);
        setFilteredSongList(res.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!visible) return;
    getCloudDataList();
  }, [visible]);

  // 筛选后的歌曲列表
  const [filteredSongList, setFilteredSongList] = useState([]);
  const handleSearch = (values) => {
    console.log("values", values);
    const { name, artist, album } = values;
    const filtered = songList.filter((song) => {
      const nameMatch =
        !name?.length ||
        name.some((n) =>
          song.simpleSong.name?.toLowerCase().includes(n.toLowerCase())
        );
      const artistMatch =
        !artist?.length ||
        artist.some((a) =>
          song.artist.toLowerCase().includes(a.toLowerCase())
        );
      const albumMatch =
        !album?.length ||
        album.some((a) => song.album.toLowerCase().includes(a.toLowerCase()));
      const legacy = song.simpleSong.al && song.simpleSong.ar;
      const match = nameMatch && artistMatch && albumMatch && legacy;
      if (!match) {
        console.log('song',song)
        console.log("nameMatch", nameMatch);
        console.log("artistMatch", artistMatch);
        console.log("albumMatch", albumMatch);
        console.log("legacy", legacy);
      }
      return match;
    });
    setFilteredSongList(filtered);
  };

  /** 选择 */
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedRowKeys = useMemo(
    () => selectedRows.map((item) => item.songId),
    [selectedRows]
  );
  const rowSelection = {
    type: "checkbox",
    fixed: true,
    selectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.uploaded,
    }),
    onSelectAll: () => {
      setTimeout(() => {
        setSelectedRows(filteredSongList);
      }, 0);
    },
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredSongList((songList) => {
      return songList.sort((a, b) => {
        const order = sorter.order === "ascend" ? 1 : -1;
        return order * a[sorter.columnKey]?.localeCompare?.(b[sorter.columnKey]);
      });
    });
  };

  const columns = [
    {
      title: "歌名",
      dataIndex: "simpleSong",
      key: "name",
      width: 250,
      sorter: (a, b) => a.simpleSong.name?.localeCompare(b.simpleSong.name),
      sortDirections: ["ascend", "descend"],
      render: (record) => (
        <div className={styles.songInfoColumn}>
          <img
            src={record.al?.picUrl}
            alt={record.name}
            className={styles.songCover}
          />
          <div className={styles.songInfo}>
            <div className={styles.songName}>{record.name}</div>
            <div className={styles.songId}>{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: "歌手",
      dataIndex: "simpleSong",
      key: "artists",
      width: 200,
      sorter: (a, b) => {
        const aArtists = a.simpleSong.ar?.map((a) => a.name).join(",");
        const bArtists = b.simpleSong.ar?.map((a) => a.name).join(",");
        return aArtists?.localeCompare(bArtists);
      },
      sortDirections: ["ascend", "descend"],
      ellipsis: true,
      render: (record) => record.ar?.map((a) => a.name).join(","),
    },
    {
      title: "专辑",
      dataIndex: "simpleSong",
      key: "album",
      width: 300,
      sorter: (a, b) =>
        a.simpleSong.al?.name?.localeCompare(b.simpleSong.al?.name),
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "ascend",
      ellipsis: true,
      render: (record) => record.al?.name,
    },
    {
      title: "大小",
      dataIndex: "fileSize",
      key: "fileSize",
      width: 100,
      sorter: (a, b) => a.fileSize - b.fileSize,
      sortDirections: ["ascend", "descend"],
      render: (size) => `${(size / 1024 / 1024).toFixed(2)}MB`,
    },
    {
      title: "比特率",
      dataIndex: "bitrate",
      key: "bitrate",
      width: 100,
      sorter: (a, b) => a.bitrate - b.bitrate,
      sortDirections: ["ascend", "descend"],
      render: (bitrate) => <Tag color="blue">{bitrate}kbps</Tag>,
    },
    {
      title: "上传时间",
      dataIndex: "addTime",
      key: "addTime",
      width: 150,
      sorter: (a, b) => a.addTime - b.addTime,
      sortDirections: ["ascend", "descend"],
      render: (time) => new Date(time).toLocaleString(),
    },
  ];

  const [addToPlayListByAlbumLoading, setAddToPlayListByAlbumLoading] =
    useState(false);
  const handleAddToPlaylistByAlbum = async () => {
    try {
      setAddToPlayListByAlbumLoading(true);
      console.log("自动按专辑添加");
      // 将歌曲按专辑分类
      const albumMap = new Map();
      filteredSongList.forEach((song) => {
        const { simpleSong } = song;
        const album = `${simpleSong.ar?.[0]?.name || ""}-${
          simpleSong.al?.name
        }`;
        if (!albumMap.has(album)) {
          albumMap.set(album, []);
        }
        albumMap.get(album).push(song);
      });

      const totalSongs = filteredSongList.length;
      const albums = Array.from(albumMap.entries()).sort(
        ([, songsA], [, songsB]) => songsB.length - songsA.length
      );

      await confirm(
        <AutoAddContent totalSongs={totalSongs} albums={albums} />,
        "自动按专辑添加",
        {
          width: "auto",
        }
      );

      // 获取歌单信息
      const res = await getPlaylistList();
      console.log("res", res);
      if (res.code !== 200) return msgError("获取歌单失败");
      const playlist = res.playlist;
      // 遍历歌单
      for (const [album, songs] of albums) {
        try {
          const playlistName = album;
          console.log("playlistName", playlistName, "songs", songs);
          let playlistId = playlist.find((p) => p.name === playlistName)?.id;
          if (!playlistId) {
            // 创建歌单（限制40字符）
            const truncatedName = truncateString(playlistName, 40);
            const res = await createPlaylist(truncatedName);
            if (res.code === 200) {
              playlistId = res.id;
            } else {
              console.log("res", res);
              debugger;
            }
            await sleep(1000);
          }
          // 添加歌曲
          const songIds = songs.map((song) => song.songId);
          const res = await addSongToPlaylist(playlistId, songIds);
          console.log("res", res);
          if (res.code !== 200) {
            console.log("添加歌曲失败", res.message || res.msg);
          }
          await sleep(500);
        } catch (error) {
          console.log("error", error);
        }
      }
      // 添加成功
      setSelectedRows([]);
      msgSuccess("添加成功");
    } catch (error) {
      console.log("error", error);
    } finally {
      setAddToPlayListByAlbumLoading(false);
    }
  };

  const playListRef = useRef(null);
  const handleAddToPlaylist = async () => {
    try {
      console.log("添加到歌单");
      playListRef.current.open("select");
      const playlist = await playListRef.current.submit();
      if (!playlist) return;
      const songIds = selectedRows.map((item) => item.songId);
      const res = await addSongToPlaylist(playlist.id, songIds);
      console.log("res", res);
      if (res.code === 200) {
        setSelectedRows([]);
        msgSuccess("添加成功");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCreatePlaylist = () => {
    console.log("新建歌单");
    playListRef.current.open();
  };

  const handleDeleteSong = async () => {
    try {
      const confirmContent = (
        <DeleteConfirmation
          selectedCount={selectedRows.length}
          songNames={selectedRows.map((item) => item.simpleSong.name)}
        />
      );
      await confirm(confirmContent, "删除确认");
      const songIds = selectedRows.map((item) => item.songId);
      const res = await deleteCloudSong(songIds);
      console.log("res", res);
      if (res.code === 200) {
        msgSuccess("删除成功");
        reset();
        getCloudDataList();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Modal
      title="云盘音乐管理"
      open={visible}
      onCancel={close}
      footer={null}
      centered
      width={900}
    >
      <SearchForm onSearch={handleSearch} songList={songList} />
      <Table
        rowSelection={rowSelection}
        dataSource={filteredSongList}
        columns={columns}
        scroll={{ y: 400, x: 1000 }}
        size="small"
        loading={loading}
        rowKey={({ songId }) => songId}
        onChange={handleTableChange}
      />
      <div className={styles.footer}>
        <Stats
          selectedRows={selectedRows}
          filteredSongList={filteredSongList}
        />
        <div className={styles.actions}>
          <Button onClick={() => setSelectedRows(filteredSongList)}>
            全部选择
          </Button>
          {/* 自动按专辑添加 */}
          <Button
            type="primary"
            onClick={handleAddToPlaylistByAlbum}
            loading={addToPlayListByAlbumLoading}
          >
            自动按专辑添加
          </Button>
          <Button
            type="primary"
            disabled={!selectedRows.length}
            onClick={handleAddToPlaylist}
          >
            添加到歌单
          </Button>
          <Button onClick={handleCreatePlaylist}>新建歌单</Button>
          {/* 删除歌曲  */}
          <Button
            type="primary"
            danger
            disabled={!selectedRows.length}
            onClick={handleDeleteSong}
          >
            删除歌曲
          </Button>
        </div>
      </div>

      {/* 歌单列表弹窗 */}
      <PlayList ref={playListRef} />
    </Modal>
  );
});

// 自动添加内容组件
const AutoAddContent = ({ totalSongs, albums }) => {
  // 复制歌单列表
  const handleCopy = () => {
    const text = albums
      .map(([name, songs]) => `${name}（${songs.length}首）`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      message.success("复制成功");
    });
  };

  return (
    <div className={styles.autoAddContent}>
      {/* 总计信息 */}
      <div className={styles.statsWrapper}>
        <div className={styles.title}>总计：</div>
        <div className={styles.statsContent}>
          <div>
            <span className={styles.label}>歌曲数：</span>
            <span className={styles.value}>{totalSongs}</span>
            <span className={styles.label}> 首</span>
          </div>
          <div>
            <span className={styles.label}>歌单数：</span>
            <span className={styles.value}>{albums.length}</span>
            <span className={styles.label}> 个</span>
          </div>
        </div>
      </div>

      {/* 歌单列表 */}
      <div>
        <div className={styles.listHeader}>
          <div className={styles.title}>即将创建的歌单：</div>
          <Button
            type="link"
            size="small"
            icon={<CopyrightOutlined />}
            onClick={handleCopy}
          >
            复制列表
          </Button>
        </div>
        <ul className={styles.listWrapper}>
          {albums.map(([name, songs]) => (
            <li key={name} className={styles.listItem}>
              <span className={styles.itemName}>{name}</span>
              <span className={styles.itemCount}>{songs.length}首</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 删除确认组件
const DeleteConfirmation = ({ selectedCount, songNames }) => {
  return (
    <div className={styles.deleteConfirmation}>
      <p className={styles.title}>
        您确定要删除以下 <span className={styles.count}>{selectedCount}</span> 首歌曲吗？
      </p>
      <div className={styles.songs}>
        {songNames.map((name, index) => (
          <div key={index} className={styles.songItem}>
            {name}
          </div>
        ))}
      </div>
      <div className={styles.warning}>
        <p className={styles.text}>
          <span className={styles.icon}>!</span>
          注意：此操作不可恢复，删除后歌曲将从您的网易云音乐云盘中永久移除。
        </p>
      </div>
    </div>
  );
};

export default CloudMusicManager;
