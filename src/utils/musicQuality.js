import { QUALITY_LEVELS } from '@/constant';

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
