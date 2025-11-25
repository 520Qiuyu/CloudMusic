import { uploadSong } from '@/api';
import SearchForm from '@/components/SearchForm';
import useFilter from '@/hooks/useFilter';
import { useVisible } from '@/hooks/useVisible';
import { useConfig } from '@/hooks/useConfig';
import { formatFileSize, promiseLimit } from '@/utils';
import { msgSuccess } from '@/utils/modal';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Table, Upload, message } from 'antd';
import { forwardRef, useState } from 'react';
import { Input } from 'antd';

const CloudImport = forwardRef((props, ref) => {
  const { functionConfig } = useConfig();
  const { uploadConcurrency } = functionConfig;
  const { visible, close } = useVisible(
    {
      onOpen() {
        // getSingerList();
      },
      onReset() {
        setTableData([]);
        setSelectedRows([]);
        setLoading(false);
      },
    },
    ref,
  );

  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  // 使用useFilter hook处理筛选逻辑
  const filterConfig = {
    fields: {
      name: {
        getValue: (song) => song.name,
      },
      artist: {
        getValue: (song) => song.artist,
      },
      album: {
        getValue: (song) => song.album,
      },
    },
  };
  const { filteredList, setFilteredList, handleFilter } = useFilter(
    tableData,
    filterConfig,
  );

  const columns = [
    { title: '歌手', dataIndex: 'artist', key: 'artist' },
    { title: '歌曲名', dataIndex: 'name', key: 'name' },
    { title: '专辑', dataIndex: 'album', key: 'album' },
    {
      title: '格式',
      dataIndex: 'ext',
      key: 'ext',
      render: (ext) => ext.toUpperCase(),
    },
    { title: '比特率', dataIndex: 'bitrate', key: 'bitrate' },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => formatFileSize(size),
    },
  ];

  // 并发量
  const [concurrent, setConcurrent] = useState(uploadConcurrency);
  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    const importMessageKey = 'import-song';
    try {
      setLoading(true);
      message.loading({
        content: `开始导入歌曲，请稍候...`,
        duration: 0,
        key: importMessageKey,
      });
      const proArr = selectedRows.map((item, index) => async () => {
        await uploadSong({
          ...item,
          filename: item.name || '未知',
          artists: item.artists?.join?.(','),
        });
        message.loading({
          content: `第${index + 1}首歌曲导入完成: ${item.name}`,
          key: importMessageKey,
          duration: 0,
        });
      });
      const res = await promiseLimit(proArr, concurrent);
      console.log('res', res);
      msgSuccess('导入成功');
    } catch (error) {
      console.log('error', error);
    } finally {
      message.destroy(importMessageKey);
      setLoading(false);
    }
  };

  // 查看JSON示例
  const handleWatchJSON = () => {
    Modal.info({
      title: 'JSON示例格式',
      width: 600,
      content: (
        <pre style={{ maxHeight: 400, overflow: 'auto' }}>
          {`// 必填字段说明：
// - id: 匹配后的歌曲ID（必填）
// - size: 文件大小，单位字节（必填）
// - md5: 文件MD5值（必填）
// - ext: 文件扩展名（必填）
// - bitrate: 比特率（必填）
// - name: 歌曲名（选填）
// - artist: 歌手名（选填）
// - artists: 歌手名列表（选填）
// - album: 专辑名（选填）

${JSON.stringify(
  [
    {
      id: '1', // 必填
      name: '晴天',
      artist: '周杰伦',
      album: '叶惠美',
      ext: 'flac', // 必填
      bitrate: '320', // 必填
      size: 31457280, // 必填
      md5: 'b2c63499d0fe68aedd0323030c0965e5', // 必填
    },
    {
      id: 1305990326, // 必填
      name: 'Call You Tonight',
      artist: 'Johnta Austin',
      artists: ['Johnta Austin'],
      album: 'Ocean Drive',
      size: 10325748, // 必填
      md5: 'b2c63499d0fe68aedd0323030c0965e5', // 必填
      ext: 'mp3', // 必填
      bitrate: 321, // 必填
    },
  ],
  null,
  2,
)}`}
        </pre>
      ),
      okText: '关闭',
      centered: true,
      okButtonProps: {
        type: 'primary',
        style: { background: '#C20C0C', borderColor: '#C20C0C' },
      },
      cancelButtonProps: {
        style: { borderColor: '#d9d9d9' },
      },
    });
  };

  const renderFooter = () => {
    return (
      <Space>
        {/* 并发量 */}
        <Input
          type='number'
          size='middle'
          min={1}
          value={concurrent}
          onChange={(e) => setConcurrent(Number(e.target.value))}
        />
        {/* 全部选择 */}
        <Button onClick={() => setSelectedRows(filteredList)}>全部选择</Button>
        {/* 取消 */}
        <Button onClick={close}>取消</Button>
        {/* 导入 */}
        <Button
          type='primary'
          loading={loading}
          onClick={handleOk}
          disabled={!selectedRows.length}>
          导入 {selectedRows.length} 首
        </Button>
      </Space>
    );
  };

  return (
    <Modal
      title='云盘JSON导入'
      open={visible}
      onCancel={close}
      centered
      width={1000}
      footer={renderFooter()}>
      <SearchForm
        data={tableData}
        options={[
          { value: 'artist', label: '歌手' },
          { value: 'name', label: '歌曲名' },
          { value: 'album', label: '专辑' },
        ]}
        onSearch={handleFilter}
      />

      <Table
        dataSource={filteredList}
        columns={columns}
        rowKey='id'
        scroll={{ y: 400 }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 首歌曲`,
        }}
        rowSelection={{
          type: 'checkbox',
          fixed: true,
          preserveSelectedRowKeys: true,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <div style={{ marginTop: 16, textAlign: 'left' }}>
        <Upload
          accept='.json'
          showUploadList={false}
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const jsonData = JSON.parse(e.target.result);
                setTableData(jsonData?.data || jsonData || []);
                message.success('JSON文件解析成功');
              } catch (error) {
                message.error('JSON文件解析失败');
              }
            };
            reader.readAsText(file);
            return false;
          }}>
          <Button icon={<UploadOutlined />}>选择JSON文件</Button>
        </Upload>

        {/* 查看JSON示例 */}
        <Button
          style={{ marginLeft: 6, color: '#C20C0C' }}
          onClick={handleWatchJSON}
          type='link'>
          查看JSON示例
        </Button>
      </div>
    </Modal>
  );
});

export default CloudImport;
