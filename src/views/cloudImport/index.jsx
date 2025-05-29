import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Input, Select, Table, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formatFileSize, promiseLimit } from "@/utils";
import SearchForm from "@/components/SearchForm";
import { uploadSong } from "@/api";
import { msgSuccess } from "@/utils/modal";
import useFilter from "@/hooks/useFilter";
import { useVisible } from "@/hooks/useVisible";

const { Search } = Input;

const CloudImport = forwardRef((props, ref) => {
  const { visible, open, close } = useVisible(
    {
      onOpen() {
        // getSingerList();
      },
      onReset() {
        setSearchText("");
        setAudioFormat("all");
        setBitrate("all");
        setTableData([]);
        setSelectedRows([]);
        setLoading(false);
      },
    },
    ref
  );
  const [searchText, setSearchText] = useState("");
  const [audioFormat, setAudioFormat] = useState("all");
  const [bitrate, setBitrate] = useState("all");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  // 使用useFilter hook处理筛选逻辑
  const filterConfig = {
    fields: {
      name: {
        getValue: song => song.name,
      },
      artist: {
        getValue: song => song.artist,
      },
      album: {
        getValue: song => song.album,
      },
    },
  };
  const { filteredList, setFilteredList, handleFilter } = useFilter(tableData, filterConfig);

  const columns = [
    { title: "歌手", dataIndex: "artist", key: "artist" },
    { title: "歌曲名", dataIndex: "name", key: "name" },
    { title: "专辑", dataIndex: "album", key: "album" },
    { title: "格式", dataIndex: "ext", key: "ext", render: ext => ext.toUpperCase() },
    { title: "比特率", dataIndex: "bitrate", key: "bitrate" },
    { title: "大小", dataIndex: "size", key: "size", render: size => formatFileSize(size) },
  ];

  // 并发量
  const [concurrent, setConcurrent] = useState(6);
  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    try {
      setLoading(true);
      const proArr = selectedRows.map(
        item => () =>
          uploadSong({ ...item, filename: item.name || "未知", artists: item.artists.join?.(",") })
      );
      const res = await promiseLimit(proArr, concurrent);
      console.log("res", res);
      msgSuccess("导入成功");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // 查看JSON示例
  const handleWatchJSON = () => {
    Modal.info({
      title: "JSON示例格式",
      width: 600,
      content: (
        <pre style={{ maxHeight: 400, overflow: "auto" }}>
          {`// 必填字段说明：
// - id: 匹配后的歌曲ID（必填）
// - size: 文件大小，单位字节（必填）
// - md5: 文件MD5值（必填）
// - ext: 文件扩展名（必填）
// - bitrate: 比特率（必填）

${JSON.stringify(
  [
    {
      id: "1", // 必填
      name: "晴天",
      artist: "周杰伦",
      album: "叶惠美",
      ext: "flac", // 必填
      bitrate: "320", // 必填
      size: 31457280, // 必填
      md5: "b2c63499d0fe68aedd0323030c0965e5", // 必填
    },
    {
      id: 1305990326, // 必填
      name: "Call You Tonight",
      artist: "Johnta Austin",
      artists: ["Johnta Austin"],
      album: "Ocean Drive",
      size: 10325748, // 必填
      md5: "b2c63499d0fe68aedd0323030c0965e5", // 必填
      ext: "mp3", // 必填
      bitrate: 321, // 必填
    },
  ],
  null,
  2
)}`}
        </pre>
      ),
      okText: "关闭",
      centered: true,
      okButtonProps: {
        type: "primary",
        style: { background: "#C20C0C", borderColor: "#C20C0C" },
      },
      cancelButtonProps: {
        style: { borderColor: "#d9d9d9" },
      },
    });
  };

  return (
    <Modal
      title="云盘JSON导入"
      open={visible}
      onCancel={close}
      centered
      width={1000}
      onOk={handleOk}
      onClose={close}
      confirmLoading={loading}
    >
      <SearchForm
        data={tableData}
        options={[
          { value: "artist", label: "歌手" },
          { value: "name", label: "歌曲名" },
          { value: "album", label: "专辑" },
        ]}
        onSearch={handleFilter}
      />

      <Table
        dataSource={filteredList}
        columns={columns}
        rowKey="id"
        scroll={{ y: 400 }}
        rowSelection={{
          type: "checkbox",
          fixed: true,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <div style={{ marginTop: 16, textAlign: "left" }}>
        <Upload
          accept=".json"
          showUploadList={false}
          beforeUpload={file => {
            const reader = new FileReader();
            reader.onload = e => {
              try {
                const jsonData = JSON.parse(e.target.result);
                setTableData(jsonData);
                message.success("JSON文件解析成功");
              } catch (error) {
                message.error("JSON文件解析失败");
              }
            };
            reader.readAsText(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>选择JSON文件</Button>
        </Upload>

        {/* 查看JSON示例 */}
        <Button
          style={{ marginLeft: 6, color: "#C20C0C" }}
          onClick={handleWatchJSON}
          type="link"
        >
          查看JSON示例
        </Button>
      </div>
    </Modal>
  );
});

export default CloudImport;
