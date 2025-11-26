import { Tag } from 'antd';
import { memo } from 'react';
import { formatFileSize } from '../../../utils';
import styles from '../index.module.scss';

const UploadStats = memo(
  ({ selectedRows, filteredSongList, toUploadSongList }) => {
    const selectedSize = selectedRows.reduce((acc, cur) => acc + cur.size, 0);
    const totalSize = filteredSongList.reduce((acc, cur) => acc + cur.size, 0);

    return (
      <div className={styles['upload-stats']}>
        已选择
        <Tag color='blue' style={{ margin: 0 }}>
          {selectedRows.length} 首
        </Tag>
        <span className={styles['size-text']}>
          {+selectedSize && formatFileSize(selectedSize)}
        </span>
        <span className={styles.divider}>/</span>共
        <Tag color='green' style={{ margin: 0 }}>
          {filteredSongList.length} 首
        </Tag>
        <span className={styles['size-text']}>{formatFileSize(totalSize)}</span>
        <span className={styles.divider}>/</span>待上传
        <Tag color='orange' style={{ margin: 0 }}>
          {toUploadSongList.length} 首
        </Tag>
      </div>
    );
  },
);

export default UploadStats;
