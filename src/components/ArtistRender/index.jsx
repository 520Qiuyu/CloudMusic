import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import styles from './index.module.scss';
import { CopyText } from '..';

/**
 * 歌手信息渲染组件
 */
export default function ArtistRender({ record }) {
  const { artist } = record || {};
  const { id, name, picUrl } = artist || {};

  return (
    <Space size='small'>
      {picUrl && (
        <Avatar
          src={picUrl}
          icon={<UserOutlined />}
          size={40}
          alt={name || '歌手头像'}
        />
      )}
      <div className={styles['details']}>
        <div className={styles['name']} title={name}>
          {name || '未知歌手'}
        </div>
        <div className={styles['id']} title={String(id || '')}>
          <CopyText text={id || '-'} />
        </div>
      </div>
    </Space>
  );
}
