import { CloudOutlined } from '@ant-design/icons';
import { Image, Tag, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import styles from './index.module.scss';

/**
 * 歌曲信息渲染组件
 * @param {object} props - 组件属性
 * @param {object} props.record - 歌曲记录对象
 */
export default function SongInfoRender({ record }) {
  const { name, alia, id, al, noCopyrightRcmd, pc } = record;

  /** 别名 */
  const alias = alia?.[0] || '';
  /** 是否存在云盘中 */
  const isCloud = pc;
  /** 是否有音源 */
  const noSource = noCopyrightRcmd;

  return (
    <div className={styles['song-info-render']}>
      <div
        className={styles['cover-wrapper']}
        onClick={(e) => e.stopPropagation()}>
        {al?.picUrl ? (
          <Image
            src={al.picUrl}
            width={60}
            height={60}
            preview={true}
            placeholder
          />
        ) : (
          <div className={styles['cover-placeholder']}>无封面</div>
        )}
      </div>
      <div className={styles['info-wrapper']}>
        <Tooltip title={name} placement='top'>
          <div
            className={classNames(styles['name'], {
              [styles['no-source']]: noSource,
            })}>
            {isCloud && (
              <CloudOutlined
                style={{ color: '#C20C0C', marginRight: 5, fontSize: 18 }}
              />
            )}
            {name}
          </div>
        </Tooltip>
        {noSource && (
          <Tooltip title='无音源' placement='top'>
            <Tag color='geekblue' style={{ width: 'fit-content' }} bordered={false}>
              无音源
            </Tag>
          </Tooltip>
        )}
        {alias && (
          <Tooltip title={alias} placement='top'>
            <div className={styles['alias']}>{alias}</div>
          </Tooltip>
        )}
        <Tooltip title={id} placement='top'>
          <div className={styles['id']}>
            ID:{' '}
            <Typography.Text copyable style={{ fontSize: '12px' }}>
              {id}
            </Typography.Text>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
