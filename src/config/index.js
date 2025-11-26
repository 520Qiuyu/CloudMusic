import { QUALITY_LEVELS, SONG_SORT_RULES } from '@/constant';

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
    enableLocalUpload: !isSell,
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
    enableGithubInfo: !isSell,
    /**
     * 是否开启脚本更新
     */
    enableScriptUpdate: false,
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
    /**
     * 并发上传歌曲数量
     */
    uploadConcurrency: 6,
    /**
     * 默认排序规则值
     */
    defaultSongSortRuleValue: SONG_SORT_RULES[0].value,
    /**
     * 演唱会关键词
     */
    liveKeywords: ['演唱会', 'Live', 'live'],
    /**
     * 创建歌单快捷方式
     */
    createPlaylistShortcut: [
      '周杰伦',
      '林宥嘉',
      '林俊杰',
      '陈奕迅',
      '邓紫棋',
      '理智',
    ],
  },
};
