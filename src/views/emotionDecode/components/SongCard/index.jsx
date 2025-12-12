import { getSongInfoList } from '@/api';
import { formatDuration, formatFileSize } from '@/utils';
import { Card, Descriptions, Image, Input, Spin, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

const { Text, Paragraph } = Typography;

/**
 * 歌曲信息卡片组件
 * @param {Object} props - 组件属性
 * @param {number} props.value - 歌曲ID
 * @param {Function} props.onChange - 歌曲ID变化回调
 */
export default function SongCard(props) {
  const { value, onChange,onInfoChange } = props;

  // 组件内部歌曲ID 受控
  const [songId, setSongId] = useState(value);
  useEffect(() => {
    if (!value) return;
    setSongId(value);
  }, [value]);
  const handleSongIdChange = (value) => {
    setSongId(value);
    onChange?.(value);
  };

  const [songInfo, setSongInfo] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    onInfoChange?.(songInfo);
  }, [songInfo]);

  useEffect(() => {
    /** 获取歌曲信息 */
    const getSongInfo = async () => {
      try {
        if (!songId) return;
        setLoading(true);
        const res = await getSongInfoList([songId]);
        if (res.code === 200 && res.songs && res.songs.length > 0) {
          setSongInfo(res.songs[0]);
        } else {
          setSongInfo(null);
        }
      } catch (error) {
        console.error('获取歌曲信息失败:', error);
        setSongInfo(null);
      } finally {
        setLoading(false);
      }
    };

    getSongInfo();
  }, [songId]);

  const {
    name,
    id,
    ar = [],
    al = {},
    dt,
    pop,
    fee,
    mv,
    publishTime,
    privilege = {},
  } = songInfo || {};

  const highestQuality = getHighestQuality(songInfo);

  return (
    <Spin spinning={loading}>
      <Card
        styles={{
          body: {
            padding: 0,
          },
        }}>
        {/* 头部区域 包含封面、歌曲名、艺术家、专辑 */}
        <div className={styles['song-header-wrapper']}>
          {/* 封面、歌曲名、艺术家、专辑 */}
          <div className={styles['song-header']}>
            <div className={styles['cover-wrapper']}>
              <Image
                src={al?.picUrl}
                width={100}
                height={100}
                className={styles['cover']}
                preview={false}
              />
            </div>
            <div className={styles['song-basic-info']}>
              <div className={styles['name-row']}>
                <Text strong className={styles.name}>
                  {name || '-'}
                </Text>
                {fee === 1 && <Tag color='red'>VIP</Tag>}
                {mv > 0 && <Tag color='blue'>MV</Tag>}
              </div>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                className={styles['artists']}>
                艺术家：{ar.map((a) => a.name).join(' / ') || '-'}
              </Paragraph>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                className={styles['album']}>
                专辑：{al?.name || '-'}
              </Paragraph>
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className={styles['song-stats']}>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>
              {formatDuration(dt) || '-'}
            </div>
            <div className={styles['stat-label']}>时长</div>
          </div>
          <div className={styles['stat-divider']}></div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>{pop || 0}</div>
            <div className={styles['stat-label']}>热度</div>
          </div>
          <div className={styles['stat-divider']}></div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>
              {highestQuality ? formatFileSize(highestQuality.size) : '-'}
            </div>
            <div className={styles['stat-label']}>文件大小</div>
          </div>
          <div className={styles['stat-divider']}></div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>
              {highestQuality
                ? `${(highestQuality.br / 1000).toFixed(0)}kbps`
                : '-'}
            </div>
            <div className={styles['stat-label']}>最高音质</div>
          </div>
        </div>

        {/* 详细信息 */}
        <Descriptions
          column={1}
          size='small'
          className={styles['descriptions']}
          labelStyle={{}}>
          <Descriptions.Item label='歌曲ID'>
            <Input
              value={songId}
              onChange={(e) => handleSongIdChange(e.target.value)}
              size='small'
              allowClear
              onPressEnter={(e) => handleSongIdChange(e.target.value)}
              style={{
                border: 'none',
              }}
              styles={{
                input: {
                  height: 'auto',
                },
              }}
            />
          </Descriptions.Item>
          {ar.length > 0 && (
            <Descriptions.Item label='艺术家'>
              {ar.map((artist, index) => (
                <Tag key={artist.id || index} color='blue'>
                  {artist.name}
                </Tag>
              ))}
            </Descriptions.Item>
          )}
          {al?.id && (
            <Descriptions.Item label='专辑ID'>{al.id}</Descriptions.Item>
          )}
          {al?.name && (
            <Descriptions.Item label='专辑名称'>{al.name}</Descriptions.Item>
          )}
          {publishTime && (
            <Descriptions.Item label='发布日期'>
              {formatPublishDate(publishTime)}
            </Descriptions.Item>
          )}
          {highestQuality && (
            <Descriptions.Item label='最高音质'>
              {getQualityTag(highestQuality.br)}
              <span style={{ marginLeft: 8 }}>
                {highestQuality.br / 1000}kbps
              </span>
            </Descriptions.Item>
          )}
          {privilege?.maxbr && (
            <Descriptions.Item label='可播放音质'>
              {getQualityTag(privilege.maxbr)}
            </Descriptions.Item>
          )}
          {privilege?.plLevel && (
            <Descriptions.Item label='播放权限'>
              <Tag color='green'>{privilege.plLevel}</Tag>
            </Descriptions.Item>
          )}
          {privilege?.dlLevel && (
            <Descriptions.Item label='下载权限'>
              <Tag color='blue'>{privilege.dlLevel}</Tag>
            </Descriptions.Item>
          )}
          {mv > 0 && (
            <Descriptions.Item label='MV'>
              <Tag color='purple'>有MV (ID: {mv})</Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </Spin>
  );
}

// 获取最高音质信息
const getHighestQuality = (songInfo) => {
  const { hr, sq, h, m, l } = songInfo || {};
  if (hr?.br) return { level: 'hr', br: hr.br, size: hr.size };
  if (sq?.br) return { level: 'sq', br: sq.br, size: sq.size };
  if (h?.br) return { level: 'h', br: h.br, size: h.size };
  if (m?.br) return { level: 'm', br: m.br, size: m.size };
  if (l?.br) return { level: 'l', br: l.br, size: l.size };
  return null;
};

// 获取音质标签
const getQualityTag = (br) => {
  if (!br) return null;
  if (br >= 999000) return <Tag color='purple'>超清母带</Tag>;
  if (br >= 1000000) return <Tag color='red'>Hi-Res</Tag>;
  if (br >= 320000) return <Tag color='blue'>极高</Tag>;
  if (br >= 192000) return <Tag color='green'>较高</Tag>;
  if (br >= 128000) return <Tag color='orange'>标准</Tag>;
  return <Tag>普通</Tag>;
};

// 格式化发布日期
const formatPublishDate = (timestamp) => {
  if (!timestamp) return '-';
  return dayjs(timestamp).format('YYYY-MM-DD');
};
