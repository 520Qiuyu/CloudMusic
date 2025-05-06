import { getPlaylistAllData } from "@/api";
import SearchForm from "@/components/SearchForm";
import useFilter from "@/hooks/useFilter";
import { useVisible } from "@/hooks/useVisible";
import { Modal, Table, Tag } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
dayjs.extend(duration);

function SongList(props, ref) {
  const { visible, open, close } = useVisible(
    {
      onOpen(id) {
        setPlaylistId(id);
        getSongListData(id);
      },
      onReset() {
        setSongList([]);
        setPlaylistId(null);
      },
    },
    ref
  );
  const [loading, setLoading] = useState(false);
  const [songList, setSongList] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // 获取歌曲列表
  const getSongListData = async playlistId => {
    if (!playlistId) return;
    try {
      setLoading(true);
      const res = await getPlaylistAllData(playlistId);
      console.log("res", res);
      setSongList(res);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // 使用useFilter hook处理筛选逻辑
  const filterConfig = {
    fields: {
      name: {
        getValue: song => song.name,
      },
      artists: {
        getValue: song => song.ar?.map(artist => artist.name).join(", "),
      },
      album: {
        getValue: song => song.al?.name,
      },
    },
  };
  const {
    filteredList: filteredSongList,
    setFilteredList: setFilteredSongList,
    handleFilter: handleSearch,
  } = useFilter(songList, filterConfig);

  // 格式化时长
  const formatDuration = ms => {
    const time = dayjs.duration(ms);
    const minutes = time.minutes();
    const seconds = time.seconds();
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // 获取音质标签
  const getQualityTags = song => {
    const tags = [];
    if (song.hr) tags.push({ text: "Hi-Res", color: "#f50" });
    if (song.sq) tags.push({ text: "SQ", color: "#87d068" });
    if (song.h) tags.push({ text: "HQ", color: "#2db7f5" });
    return tags;
  };

  // 获取歌曲标记
  const getMarkTags = mark => {
    const tags = [];
    if (mark & 131072) tags.push({ text: "纯音乐", color: "#2db7f5" });
    if (mark & 262144) tags.push({ text: "杜比全景声", color: "#722ed1" });
    if (mark & 1048576) tags.push({ text: "🅴", color: "#f50" });
    if (mark & 17179869184) tags.push({ text: "Hi-Res", color: "#f50" });
    return tags;
  };

  // 获取原创类型标签
  const getOriginTag = originCoverType => {
    const types = {
      0: { text: "未知", color: "#d9d9d9" },
      1: { text: "原曲", color: "#87d068" },
      2: { text: "翻唱", color: "#2db7f5" },
    };
    return types[originCoverType] || types[0];
  };

  // 格式化热度
  const formatPopularity = pop => {
    if (!pop) return "0";
    return pop.toFixed(1);
  };

  // 获取歌曲类型标签
  const getTypeTag = t => {
    const types = {
      0: { text: "普通歌曲", color: "#108ee9" },
      1: { text: "独立云盘", color: "#f50" },
      2: { text: "云盘歌曲", color: "#87d068" },
    };
    return types[t] || types[0];
  };

  // 获取版权标签
  const getFeeTag = fee => {
    const fees = {
      0: { text: "免费", color: "#87d068" },
      1: { text: "VIP", color: "#f50" },
      4: { text: "专辑购买", color: "#722ed1" },
      8: { text: "付费/试听", color: "#faad14" },
    };
    return fees[fee] || fees[0];
  };

  // 表格列配置
  const columns = [
    {
      title: "歌曲名称",
      dataIndex: "name",
      key: "name",
      width: 250,
      sorter: (a, b) => a.name?.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <div>
          <div>{text}</div>
          {record.alia?.length > 0 && (
            <div style={{ fontSize: "12px", color: "#666" }}>{record.alia[0]}</div>
          )}
        </div>
      ),
    },
    {
      title: "歌手",
      dataIndex: "ar",
      key: "ar",
      width: 150,
      sorter: (a, b) => {
        const aName = a.ar?.map(a => a.name).join(", ") || "";
        const bName = b.ar?.map(b => b.name).join(", ") || "";
        return aName.localeCompare(bName);
      },
      sortDirections: ["ascend", "descend"],
      render: ar => ar?.map(a => a.name).join(", "),
    },
    {
      title: "专辑",
      dataIndex: "al",
      key: "al",
      width: 200,
      sorter: (a, b) => (a.al?.name || "").localeCompare(b.al?.name || ""),
      sortDirections: ["ascend", "descend"],
      render: al => al?.name,
    },
    {
      title: "时长",
      dataIndex: "dt",
      key: "dt",
      width: 80,
      sorter: (a, b) => a.dt - b.dt,
      sortDirections: ["ascend", "descend"],
      render: dt => formatDuration(dt),
    },
    {
      title: "版权",
      dataIndex: "fee",
      key: "fee",
      width: 100,
      filters: [
        { text: "免费", value: 0 },
        { text: "VIP", value: 1 },
        { text: "专辑购买", value: 4 },
        { text: "付费/试听", value: 8 },
      ],
      onFilter: (value, record) => record.fee === value,
      render: fee => {
        const tag = getFeeTag(fee);
        return <Tag color={tag.color}>{tag.text}</Tag>;
      },
    },
    // 是否有音源
    {
      title: "音源",
      dataIndex: "noCopyrightRcmd",
      key: "noCopyrightRcmd",
      width: 100,
      filters: [
        { text: "有音源", value: false },
        { text: "无音源", value: true },
      ],
      onFilter: (value, record) => !!record.noCopyrightRcmd === value,
      render: noCopyrightRcmd => {
        return (
          <Tag color={noCopyrightRcmd ? "#ff4d4f" : "#87d068"}>
            {noCopyrightRcmd ? "无音源" : "有音源"}
          </Tag>
        );
      },
    },
    {
      title: "原创类型",
      dataIndex: "originCoverType",
      key: "originCoverType",
      width: 100,
      filters: [
        { text: "未知", value: 0 },
        { text: "原曲", value: 1 },
        { text: "翻唱", value: 2 },
      ],
      onFilter: (value, record) => record.originCoverType === value,
      render: type => {
        const tag = getOriginTag(type);
        return <Tag color={tag.color}>{tag.text}</Tag>;
      },
    },
    {
      title: "热度",
      dataIndex: "pop",
      key: "pop",
      width: 80,
      sorter: (a, b) => a.pop - b.pop,
      sortDirections: ["ascend", "descend"],
      render: pop => formatPopularity(pop),
    },
  ];

  return (
    <Modal
      title="歌曲列表"
      width={1600}
      centered
      open={visible}
      footer={null}
      onCancel={close}
    >
      {/* 筛选 */}
      <SearchForm
        onSearch={handleSearch}
        data={songList.map(song => ({
          ...song,
          artists: song.ar?.map(artist => artist.name).join(", "),
          album: song.al?.name,
        }))}
        options={[
          { label: "歌曲", value: "name" },
          { label: "歌手", value: "artists" },
          { label: "专辑", value: "album" },
        ]}
      />
      <Table
        columns={columns}
        dataSource={filteredSongList}
        rowKey="id"
        loading={loading}
        scroll={{ y: 400 }}
        rowSelection={{
          type: "checkbox",
          fixed: true,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
    </Modal>
  );
}

export default forwardRef(SongList);
