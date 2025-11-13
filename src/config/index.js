import { QUALITY_LEVELS } from '@/constant';

export const defaultConfig = {
  /**
   * 下载相关配置
   */
  download: {
    /**
     * 下载音质
     */
    quality: QUALITY_LEVELS.无损,
    /**
     * 是否下载歌词
     */
    downloadLyric: true,
    /**
     * 是否内嵌歌词封面
     */
    embedLyricCover: true,
  },
};
