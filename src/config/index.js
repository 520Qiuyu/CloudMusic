import { QUALITY_LEVELS } from '@/constant';

const isDev = import.meta.env.DEV;
const isSell = import.meta.env.MODE === 'sell';

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
    downloadLyric: false,
    /**
     * 是否内嵌歌词封面
     */
    embedLyricCover: true,
    /**
     * 是否内嵌歌曲信息
     */
    embedSongInfo: true,
  },

  /**
   * 功能相关配置
   */
  function: {
    /**
     * 是否开启云盘快速上传
     */
    enableQuickUpload: true,
    /**
     * 是否开启云盘歌曲管理
     */
    enableCloudMusicManager: true,
    /**
     * 是否开启云盘本地上传
     */
    enableLocalUpload: true,
    /**
     * 是否开启查看歌单
     */
    enablePlayList: true,
    /**
     * 是否开启搜索
     */
    enableSearch: !isSell,
    /**
     * 是否开启云盘导入
     */
    enableCloudImport: true,
    /**
     * 是否开启GitHub信息
     */
    enableGithubInfo: true,
    /**
     * 是否开启调试Modal
     */
    enableTestModal: isDev,
    /**
     * 是否开启功能开关TAB
     */
    enableFunctionSwitchTab: !isSell,
    /**
     * 是否开启下载设置
     */
    enableDownloadSetting: isDev,
  },
};
