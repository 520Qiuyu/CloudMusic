import { QUALITY_LEVELS } from '@/constant';
import dayjs from 'dayjs';

// 获取音质标签
export const getQualityTags = (song) => {
  const tags = [];
  if (song.hr)
    tags.push({
      label: 'Hi-Res',
      color: '#f50',
      value: QUALITY_LEVELS['Hi-Res'],
    });
  if (song.sq)
    tags.push({ label: 'SQ', color: '#87d068', value: QUALITY_LEVELS.无损 });
  if (song.h)
    tags.push({ label: 'HQ', color: '#2db7f5', value: QUALITY_LEVELS.较高 });
  return tags;
};

// 格式化时长
export const formatDuration = (ms) => {
  const time = dayjs.duration(ms);
  const minutes = time.minutes();
  const seconds = time.seconds();
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 获取歌曲标记
export const getMarkTags = (mark) => {
  const tags = [];
  if (mark & 131072) tags.push({ text: '纯音乐', color: '#2db7f5' });
  if (mark & 262144) tags.push({ text: '杜比全景声', color: '#722ed1' });
  if (mark & 1048576) tags.push({ text: '🅴', color: '#f50' });
  if (mark & 17179869184) tags.push({ text: 'Hi-Res', color: '#f50' });
  return tags;
};

// 获取原创类型标签
export const getOriginTag = (originCoverType) => {
  const types = {
    0: { text: '未知', color: '#d9d9d9' },
    1: { text: '原曲', color: '#87d068' },
    2: { text: '翻唱', color: '#2db7f5' },
  };
  return types[originCoverType] || types[0];
};

// 格式化热度
export const formatPopularity = (pop) => {
  if (!pop) return '0';
  return pop.toFixed(1);
};

// 获取歌曲类型标签
export const getTypeTag = (t) => {
  const types = {
    0: { text: '普通歌曲', color: '#108ee9' },
    1: { text: '独立云盘', color: '#f50' },
    2: { text: '云盘歌曲', color: '#87d068' },
  };
  return types[t] || types[0];
};

// 获取版权标签
export const getFeeTag = (fee) => {
  const fees = {
    0: { text: '免费', color: '#87d068' },
    1: { text: 'VIP', color: '#f50' },
    4: { text: '专辑购买', color: '#722ed1' },
    8: { text: '付费/试听', color: '#faad14' },
  };
  return fees[fee] || fees[0];
};
