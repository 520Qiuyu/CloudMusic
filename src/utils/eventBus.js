import mitt from 'mitt';

/**
 * 事件总线实例
 * 用于组件间的通信，支持发布订阅模式
 */
const eventBus = mitt();

/**
 * 事件类型常量
 * 统一管理所有事件名称，避免字符串硬编码
 */
export const EVENT_TYPES = {
  // 云盘音乐管理相关事件
  CLOUD_MUSIC_MATCH_ALL: 'cloud_music_match_all', // 全部匹配事件
  CLOUD_MUSIC_CANCEL_MATCH_ALL: 'cloud_music_cancel_match_all', // 全部取消匹配事件
  CLOUD_MUSIC_UPDATE: 'cloud_music_update', // 云盘数据更新事件
  CLOUD_MUSIC_SONG_SELECTED: 'cloud_music_song_selected', // 歌曲选择事件
  CLOUD_MUSIC_PLAY_SONG: 'cloud_music_play_song', // 播放歌曲事件
  
  // 通用事件
  GLOBAL_LOADING: 'global_loading', // 全局加载状态
  GLOBAL_MESSAGE: 'global_message', // 全局消息提示
};

/**
 * 发布事件
 * @param {string} event - 事件名称
 * @param {any} data - 事件数据
 */
export const emit = (event, data) => {
  eventBus.emit(event, data);
};

/**
 * 订阅事件
 * @param {string} event - 事件名称
 * @param {Function} handler - 事件处理函数
 */
export const on = (event, handler) => {
  eventBus.on(event, handler);
};

/**
 * 取消订阅事件
 * @param {string} event - 事件名称
 * @param {Function} handler - 事件处理函数（可选，不传则取消该事件的所有订阅）
 */
export const off = (event, handler) => {
  eventBus.off(event, handler);
};

/**
 * 只订阅一次事件
 * @param {string} event - 事件名称
 * @param {Function} handler - 事件处理函数
 */
export const once = (event, handler) => {
  eventBus.on(event, handler);
  // 手动实现once功能
  const onceHandler = (...args) => {
    handler(...args);
    eventBus.off(event, onceHandler);
  };
  eventBus.on(event, onceHandler);
};

/**
 * 清除所有事件监听器
 */
export const clear = () => {
  eventBus.all.clear();
};

export default eventBus; 