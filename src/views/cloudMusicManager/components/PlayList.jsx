import {
  Button,
  Image,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Input,
} from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { createPlaylist, deletePlaylist, getPlaylistList } from "../../../api";
import {
  confirm,
  msgWarning,
  msgSuccess,
  msgError,
} from "../../../utils/modal";
import styles from "../index.module.scss";
import { useRef } from "react";
import { getGUser } from "../../../utils";

const PlayList = (props, ref) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("edit");

  // 编辑模式
  const isEdit = mode === "edit";
  // 选择模式
  const isSelect = mode === "select";

  // 打开弹窗
  const open = (mode) => {
    reset();
    if (mode) {
      setMode(mode);
    }
    setVisible(true);
    handleGetPlayList();
  };
  // 关闭弹窗
  const close = () => {
    setVisible(false);
    setPlayList([]);
  };
  // 重置数据
  const reset = () => {
    setPlayList([]);
    res.current = null;
    setMode("add");
    setSelectedRows([]);
    setName("");
    setCreateModalVisible(false);
  };
  const res = useRef(null);
  // 提交数据
  const submit = () => {
    return new Promise((resolve, reject) => {
      res.current = resolve;
    });
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
    submit,
  }));

  const [loading, setLoading] = useState(false);
  const [playList, setPlayList] = useState([]);
  // 获取歌单列表
  const handleGetPlayList = async () => {
    setLoading(true);
    try {
      const user = getGUser();
      if (!user) return message.error("请先登录");
      const res = await getPlaylistList(user.userId);
      console.log("res", res);
      if (res.code === 200) {
        setPlayList((list) => [...list, ...res.playlist]);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "歌单",
      dataIndex: "name",
      key: "name",
      width: 220,
      ellipsis: true,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Image
            src={record.coverImgUrl}
            width={40}
            height={40}
            style={{ borderRadius: "4px" }}
            preview={false}
          />
          <div
            style={{
              fontWeight: 500,
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        </div>
      ),
    },
    {
      title: "歌曲数",
      dataIndex: "trackCount",
      key: "trackCount",
      width: 100,
      align: "right",
      sorter: (a, b) => a.trackCount - b.trackCount,
      sortDirections: ["descend", "ascend"],
      render: (text) => (
        <span
          style={{
            color: "#666",
            fontSize: "13px",
          }}
        >
          {text} 首
        </span>
      ),
    },
    {
      title: "创建者",
      dataIndex: ["creator", "nickname"],
      key: "creator",
      width: 150,
      ellipsis: true,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 200,
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => a.updateTime - b.updateTime,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "播放量",
      dataIndex: "playCount",
      key: "playCount",
      width: 100,
      render: (text) => {
        const count = text > 10000 ? `${(text / 10000).toFixed(1)}万` : text;
        return <span>{count}</span>;
      },
      sorter: (a, b) => a.playCount - b.playCount,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const [selectedRows, setSelectedRows] = useState([]);
  // 选择事件
  const rowSelection = {
    type: isSelect ? "radio" : "checkbox",
    selectedRowKeys: selectedRows.map((item) => item.id),
    onSelectAll: () => {
      setTimeout(() => {
        setSelectedRows(playList);
      }, 0);
    },
    onChange: (_, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  // 确认选择
  const handleConfirm = () => {
    if (!selectedRows.length) {
      msgWarning("请选择歌单");
      return;
    }
    if (selectedRows.length !== 1) return msgWarning("只能选择一个歌单");
    res.current?.(selectedRows[0]);
    close();
  };

  // 新建歌单
  const [name, setName] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const handleCreate = async () => {
    if (!name.trim()) {
      msgWarning("请输入歌单名称");
      return;
    }
    try {
      const res = await createPlaylist(name.trim());
      if (res.code === 200) {
        msgSuccess("新建成功");
        handleGetPlayList(); // 重新获取列表
        setName(""); // 清空输入
        setCreateModalVisible(false);
      } else {
        msgError("新建失败");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // 删除歌单
  const handleDelete = async () => {
    if (!selectedRows.length) {
      msgWarning("请选择要删除的歌单");
      return;
    }
    try {
      await confirm(
        <DeleteConfirmContent playlists={selectedRows} />,
        "删除歌单"
      );
      const proArr = selectedRows.map((item) => deletePlaylist(item.id));
      const res = await Promise.all(proArr);
      console.log("res", res);
      msgSuccess("删除成功");
      handleGetPlayList(); // 重新获取列表
      setSelectedRows([]); // 清空选择
    } catch (error) {
      console.log("error", error);
      msgError("删除失败");
    }
  };

  return (
    <>
      <Modal
        title="歌单列表"
        open={visible}
        onCancel={close}
        footer={null}
        centered
        width={800}
      >
        <Table
          dataSource={playList}
          columns={columns}
          rowKey="id"
          size="small"
          loading={loading}
          scroll={{ y: 400 }}
          rowSelection={rowSelection}
        />
        {/* 操作 */}
        <div className={styles.footer}>
          <div>已选择 {selectedRows.length} 个歌单</div>
          <Space>
            <Button onClick={() => setCreateModalVisible(true)}>
              新建歌单
            </Button>
            <Button
              danger
              disabled={!selectedRows.length}
              onClick={handleDelete}
            >
              删除歌单
            </Button>
            {isSelect && (
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={selectedRows.length !== 1}
              >
                选择({selectedRows.length})
              </Button>
            )}
          </Space>
        </div>
      </Modal>

      {/* 新建歌单弹窗 */}
      <Modal
        title="新建歌单"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          setName("");
        }}
        onOk={handleCreate}
        okText="确定"
        cancelText="取消"
        centered
      >
        <Input
          placeholder="请输入歌单名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPressEnter={handleCreate}
          autoFocus
        />
      </Modal>
    </>
  );
};

// 删除确认内容组件
const DeleteConfirmContent = ({ playlists }) => {
  return (
    <div className={styles.autoAddContent}>
      {/* 总计信息 */}
      <div className={styles.statsWrapper}>
        <div className={styles.title}>总计：</div>
        <div className={styles.statsContent}>
          <div>
            <span className={styles.label}>删除数量：</span>
            <span className={styles.value}>{playlists.length}</span>
            <span className={styles.label}> 个歌单</span>
          </div>
        </div>
      </div>

      {/* 歌单列表 */}
      <div>
        <div className={styles.listHeader}>
          <div className={styles.title}>即将删除的歌单：</div>
        </div>
        <ul className={styles.listWrapper}>
          {playlists.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <span className={styles.itemName}>{item.name}</span>
              {item.trackCount > 0 && (
                <span className={styles.itemCount}>{item.trackCount}首</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default forwardRef(PlayList);
