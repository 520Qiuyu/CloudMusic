import { uploadLocalSong } from '@/api/cloud';
import { useVisible } from '@/hooks/useVisible';
import {
  formatFileSize,
  getAudioMetadata,
  getFileMD5,
  promiseLimit,
} from '@/utils';
import { downloadJsonFile } from '@/utils/download';
import { msgSuccess } from '@/utils/modal';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Progress, Table, Upload } from 'antd';
import { forwardRef, useState } from 'react';
import styles from './index.module.scss';

const { Dragger } = Upload;

const LocalUpload = forwardRef((props, ref) => {
  const { visible, close } = useVisible(
    {
      onReset() {
        setLoading(false);
        setFileList([]);
      },
    },
    ref,
  );

  const [fileList, setFileList] = useState([]);
  // 上传状态
  const [loading, setLoading] = useState(false);
  // 并发量
  const [concurrency, setConcurrency] = useState(1);
  const handleUpload = async () => {
    try {
      setLoading(true);
      const uploadPromises = fileList.map((file) => async () => {
        try {
          if (file.status === 'done') {
            return;
          }
          file.status = 'uploading';
          const res = await uploadLocalSong(file);
          file.status = 'done';
          return res;
        } catch (e) {
          file.status = 'error';
          return null;
        } finally {
          setFileList((prev) => [...prev]);
        }
      });
      const res = await promiseLimit(uploadPromises, concurrency);
      console.log('res', res);
      msgSuccess('上传成功');
      const size = res
        .filter(Boolean)
        .reduce((acc, file) => acc + file.size, 0);
      const info = {
        list: res.filter(Boolean),
        count: res.filter(Boolean).length,
        size,
        sizeDesc: formatFileSize(size),
        artist: res.filter(Boolean)?.[0].artist || '',
      };
      // 下载文件
      downloadJsonFile(info, info.artist + '.json');
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  // 失败过滤
  const handleFilter = async () => {
    setFileList((prev) => prev.filter((file) => file.status === 'error'));
  };
  // 直接获取JSON
  const [getJsonLoading, setGetJsonLoading] = useState(false);
  const handleGetJson = async () => {
    try {
      setGetJsonLoading(true);
      const proArr = fileList.map(async (file) => {
        const ext = file.name.split('.').pop() || 'mp3';
        const bitrate = 999000;
        const name = file.name
          .replace('.' + ext, '')
          .replace(/\s/g, '')
          .replace(/\./g, '_');
        const size = file.size;
        const md5 = await getFileMD5(file);
        const { album, artist, artists, title } = await getAudioMetadata(file);
        return {
          size,
          md5,
          bitrate,
          ext,
          album,
          artist,
          artists,
          name: title,
        };
      });
      const data = await Promise.all(proArr);
      // 下载JSON文件
      downloadJsonFile(data, data[0].artist + '.json');
    } catch (e) {
      console.log('error', e);
    } finally {
      setGetJsonLoading(false);
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        if (status === 'done') {
          return <Progress percent={100} size='small' status='success' />;
        }
        if (status === 'error') {
          return <Progress percent={100} size='small' status='exception' />;
        }
        if (status === 'uploading') {
          return (
            <Progress
              percent={record.progress || 0}
              size='small'
              status='active'
            />
          );
        }
        return <Progress percent={0} size='small' />;
      },
    },
  ];

  return (
    <Modal
      title='云盘本地上传'
      open={visible}
      onCancel={close}
      onOk={handleUpload}
      confirmLoading={loading}
      centered
      width={1000}>
      <div className={styles['local-upload']}>
        <div className={styles['upload-section']}>
          <div className={styles['concurrency-control']}>
            <span>并发数量：</span>
            <Input
              type='number'
              min={1}
              max={6}
              value={concurrency}
              onChange={(e) => setConcurrency(parseInt(e.target.value) || 1)}
              style={{ width: 80 }}
            />
          </div>
          <Dragger
            className={styles.dragger}
            multiple
            fileList={fileList}
            beforeUpload={(file) => {
              setFileList((prev) => [...prev, file]);
              return false;
            }}
            showUploadList={false}
            accept='.mp3,.flac,.wav,.m4a,.ogg'>
            <p className={styles['upload-icon']}>
              <InboxOutlined />
            </p>
            <p className={styles['upload-text']}>点击或拖拽文件到此区域上传</p>
            <p className={styles['upload-hint']}>
              支持 mp3, flac, wav, m4a, ogg 格式的音频文件
            </p>
          </Dragger>
        </div>

        <div className={styles['file-list']}>
          <Table
            columns={columns}
            dataSource={fileList}
            rowKey={(file) => file.uid || file.name}
            scroll={{ y: 300 }}
          />
          <div className={styles['upload-stats']}>
            <span>共 {fileList.length} 个文件</span>
            <span className={styles.divider}>|</span>
            <span className={styles['size-text']}>
              总大小：
              {formatFileSize(
                fileList.reduce((acc, file) => acc + file.size, 0),
              )}
            </span>
            <Button
              type='primary'
              size='small'
              onClick={() => setFileList([])}
              style={{ marginLeft: 'auto' }}>
              清空列表
            </Button>
            {/* 失败重传 */}
            <Button
              type='primary'
              size='small'
              onClick={handleFilter}
              disabled={!fileList.some((file) => file.status !== 'error')}>
              失败过滤
            </Button>
            {/* 直接获取JSON */}
            <Button
              type='primary'
              size='small'
              onClick={handleGetJson}
              loading={getJsonLoading}>
              直接获取JSON
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default LocalUpload;
