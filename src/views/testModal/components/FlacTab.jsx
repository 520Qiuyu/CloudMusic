import { FLAC_TAGS } from '@/constant';
import {
  embedFlacPicture,
  readAllFlacTag,
  readFlacTag,
  writeFlacTag,
} from '@/libs/flac';
import { downloadFileWithBlob } from '@/utils/download';
import { msgError } from '@/utils/modal';
import { Button, Form, Input, Select, Space } from 'antd';
import { useState } from 'react';

/**
 * FLAC标签相关测试组件
 */
const FlacTab = () => {
  // 测试flac标签
  const [flacFile, setFlacFile] = useState(null);
  const [flacTagName, setFlacTagName] = useState('all');
  const [flacTagValue, setFlacTagValue] = useState('');
  const [flacPicture, setFlacPicture] = useState(null);

  const handleReadFlacTag = async () => {
    try {
      console.log('flacFile', flacFile);
      if (!flacFile) return msgError('请选择文件');
      if (flacTagName === 'all') {
        const res = await readAllFlacTag(flacFile);
        console.log('res', res);
      } else {
        const res = await readFlacTag(flacFile, flacTagName);
        console.log('res', res);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleWriteFlacTag = async () => {
    try {
      if (!flacFile) return msgError('请选择文件');
      if (flacTagName === 'all') return msgError('请选择具体标签');
      const res = await writeFlacTag(flacFile, flacTagName, flacTagValue);
      console.log('res', res);
      setFlacFile(res);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleEmbedFlacPicture = async () => {
    try {
      if (!flacFile) return msgError('请选择文件');
      if (!flacPicture) return msgError('请选择图片');
      const res = await embedFlacPicture(flacFile, flacPicture);
      console.log('res', res);
      setFlacFile(res);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleDownloadFlacFile = async () => {
    try {
      if (!flacFile) return msgError('请选择文件');
      downloadFileWithBlob(flacFile, 'test.flac');
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Form>
      {/* 测试flac标签 */}
      <Form.Item label='测试flac标签'>
        <Space wrap>
          <input
            type='file'
            accept='.flac'
            onChange={(e) => {
              setFlacFile(e.target.files[0]);
            }}
          />
          <Select
            style={{ width: 100 }}
            options={[
              { label: '全部', value: 'all' },
              ...Object.entries(FLAC_TAGS).map(([key, value]) => ({
                label: value,
                value: key,
              })),
            ]}
            value={flacTagName}
            onChange={(value) => setFlacTagName(value)}
          />
          <Input
            placeholder='请输入flac标签'
            value={flacTagValue}
            onChange={(e) => setFlacTagValue(e.target.value)}
          />
          <Button type='primary' onClick={handleReadFlacTag}>
            读取flac标签
          </Button>
          <Button type='primary' onClick={handleWriteFlacTag}>
            写入flac标签
          </Button>
          <input
            type='file'
            accept='.jpg,.png,.jpeg'
            onChange={(e) => {
              setFlacPicture(e.target.files[0]);
            }}
          />
          <Button type='primary' onClick={handleEmbedFlacPicture}>
            嵌入flac图片
          </Button>
          <Button type='primary' onClick={handleDownloadFlacFile}>
            下载最新文件
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default FlacTab;

