import { Modal, Progress, Tag } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../index.module.scss';
import { useEffect } from 'react';
import { useRef } from 'react';

const UploadProgress = forwardRef(
  ({ uploadedList, total, uploadFailedSongList, onClose }, ref) => {
    const [visible, setVisible] = useState(false);

    const open = () => setVisible(true);
    const close = () => {
      setVisible(false);
      onClose?.();
    };
    const reset = () => {};

    useImperativeHandle(ref, () => ({
      open,
      close,
      reset,
    }));

    const uploadedCount = uploadedList.length;
    const failedCount = uploadFailedSongList.length;
    const percent = Math.floor(((uploadedCount + failedCount) / total) * 100);
    const isCompleted = uploadedCount + failedCount === total;

    // 上传列表自动平滑滚动到最下面
    const songListRef = useRef(null);
    useEffect(() => {
      let timeId;
      if (visible) {
        timeId = setInterval(() => {
          songListRef.current?.scrollTo({
            top: songListRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }, 500);
      }
      return () => {
        clearInterval(timeId);
      };
    }, [visible]);

    return (
      <Modal
        title='上传进度'
        open={visible}
        onCancel={close}
        width={520}
        maskClosable={false}
        footer={null}
        centered
        className={styles.uploadModal}
      >
        <div className={styles.progressSection}>
          <Progress
            type='circle'
            percent={percent}
            status={
              isCompleted
                ? failedCount > 0
                  ? 'exception'
                  : 'success'
                : 'active'
            }
            format={() => (
              <div className={styles.progressInfo}>
                <span className={styles.percentage}>{percent}%</span>
                <span className={styles.count}>
                  {uploadedCount + failedCount}/{total}
                </span>
              </div>
            )}
          />

          <div className={styles.statsContainer}>
            <div className={styles.statsItem}>
              <Tag color='success' className={styles.statsTag}>
                成功：{uploadedCount}
              </Tag>
            </div>
            {failedCount > 0 && (
              <div className={styles.statsItem}>
                <Tag color='error' className={styles.statsTag}>
                  失败：{failedCount}
                </Tag>
              </div>
            )}
          </div>
        </div>

        {(uploadedList.length > 0 || uploadFailedSongList.length > 0) && (
          <div className={styles.songList} ref={songListRef}>
            {uploadFailedSongList.map((song) => (
              <div key={song.id} className={styles.songItem}>
                <div className={styles.songInfo}>
                  <span className={styles.songName}>{song.name}</span>
                  <span className={styles.artistName}>- {song.artists}</span>
                </div>
                <Tag color='error'>上传失败</Tag>
              </div>
            ))}
            {uploadedList.map((song) => (
              <div key={song.id} className={styles.songItem}>
                <div className={styles.songInfo}>
                  <span className={styles.songName}>{song.name}</span>
                  <span className={styles.artistName}>- {song.artists}</span>
                </div>
                <Tag color='success'>已上传</Tag>
              </div>
            ))}
          </div>
        )}
      </Modal>
    );
  },
);

export default UploadProgress;
