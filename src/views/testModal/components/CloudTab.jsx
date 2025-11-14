import {
  deleteCloudSong,
  getCloudData,
  neteaseMusicToCloud,
  uploadLocalSong,
} from '@/api/cloud';
import { msgError } from '@/utils/modal';
import { Button, Form, Input, Space, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

/**
 * 云盘相关测试组件
 */
const CloudTab = () => {
  // 获取云盘输入数据
  const [pageData, setPageData] = useState({
    limit: 500,
    offset: 0,
  });
  // 获取云盘数据
  const handleGetCloudData = async () => {
    console.log('获取云盘数据');
    try {
      const res = await getCloudData(pageData.limit, pageData.offset);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 歌曲id
  const [songId, setSongId] = useState('2608471890');
  // 删除云盘歌曲
  const handleDeleteCloudSong = async () => {
    console.log('删除云盘歌曲');
    try {
      const res = await deleteCloudSong([songId]);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试上传本地歌曲到云盘
  const [fileList, setFileList] = useState([]);
  const handleUploadLocalSong = async () => {
    try {
      console.log('fileList', fileList);
      if (!fileList.length) return msgError('请选择文件');
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const res = await uploadLocalSong(file);
        console.log('res', res);
        console.log(JSON.stringify(res, null, 2));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试网易云音乐转存云盘'
  const [neteaseMusicSongId, setNeteaseMusicSongId] = useState('1846094285');
  const handleNeteaseMusicToCloud = async () => {
    try {
      const res = await neteaseMusicToCloud(neteaseMusicSongId.split(','));
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Form>
      {/* 测试获取云盘数据 */}
      <Form.Item label='获取云盘数据'>
        <Space>
          <Input
            placeholder='limit'
            style={{ width: 100 }}
            value={pageData.limit}
            onChange={(e) =>
              setPageData({ ...pageData, limit: Number(e.target.value) })
            }
          />
          <Input
            placeholder='offset'
            style={{ width: 100 }}
            value={pageData.offset}
            onChange={(e) =>
              setPageData({ ...pageData, offset: Number(e.target.value) })
            }
          />
          <Button type='primary' onClick={handleGetCloudData}>
            获取云盘数据
          </Button>
        </Space>
      </Form.Item>

      {/* 删除云盘歌曲 */}
      <Form.Item label='删除云盘歌曲'>
        <Space>
          <Input
            placeholder='请输入歌曲Id'
            addonBefore='歌曲Id'
            value={songId}
            onChange={(e) => setSongId(e.target.value)}
          />
          <Button type='primary' onClick={handleDeleteCloudSong}>
            删除云盘歌曲
          </Button>
        </Space>
      </Form.Item>

      {/* 测试上传本地歌曲到云盘 */}
      <Form.Item label='上传本地歌曲到云盘'>
        <Space wrap>
          <Upload
            fileList={fileList}
            accept='.flac,.mp3,.wav,.aac,.m4a,.ogg,.wma'
            beforeUpload={(file) => {
              setFileList([...fileList, file]);
              return false;
            }}
            onRemove={(file) => {
              setFileList(fileList.filter((f) => f !== file));
            }}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Button type='primary' onClick={handleUploadLocalSong}>
            上传本地歌曲到云盘
          </Button>
        </Space>
      </Form.Item>

      {/* 测试网易云音乐转存云盘 */}
      <Form.Item label='测试网易云音乐转存云盘'>
        <Space>
          <Input
            addonBefore='歌曲Id'
            placeholder='请输入网易云音乐歌曲Id'
            value={neteaseMusicSongId}
            onChange={(e) => setNeteaseMusicSongId(e.target.value)}
          />
          <Button type='primary' onClick={handleNeteaseMusicToCloud}>
            测试网易云音乐转存云盘
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CloudTab;
