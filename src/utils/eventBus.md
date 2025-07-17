# 事件总线使用文档

## 概述

本项目使用 `mitt` 库实现了轻量级的发布订阅模式，用于组件间的通信。通过事件总线，可以实现组件间的解耦和异步通信。

## 核心文件

- `src/utils/eventBus.js` - 事件总线核心实现

## 事件类型

所有事件类型都在 `EVENT_TYPES` 中定义：

```javascript
export const EVENT_TYPES = {
  // 云盘音乐管理相关事件
  CLOUD_MUSIC_MATCH_ALL: 'cloud_music_match_all', // 全部匹配事件
  CLOUD_MUSIC_UPDATE: 'cloud_music_update', // 云盘数据更新事件
  CLOUD_MUSIC_SONG_SELECTED: 'cloud_music_song_selected', // 歌曲选择事件
  CLOUD_MUSIC_PLAY_SONG: 'cloud_music_play_song', // 播放歌曲事件
  
  // 通用事件
  GLOBAL_LOADING: 'global_loading', // 全局加载状态
  GLOBAL_MESSAGE: 'global_message', // 全局消息提示
};
```

## 使用方法

```javascript
import { emit, on, off, EVENT_TYPES } from '@/utils/eventBus';

// 发布事件
emit(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, { songList: [], timestamp: Date.now() });

// 订阅事件
const handler = (data) => {
  console.log('收到事件:', data);
};
on(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, handler);

// 取消订阅
off(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, handler);
```

## 实际应用示例

### 云盘音乐管理中的全部匹配功能

1. **主组件发布事件**：
```javascript
// src/views/cloudMusicManager/index.jsx
import { emit, EVENT_TYPES } from '@/utils/eventBus';

const handleMatch = () => {
  emit(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, {
    songList: filteredSongList,
    timestamp: Date.now(),
  });
};
```

2. **子组件订阅事件**：
```javascript
// src/views/cloudMusicManager/components/CustomMatch.jsx
import { on, off, EVENT_TYPES } from '@/utils/eventBus';

useEffect(() => {
  const handleMatchAll = async (eventData) => {
    if (!currentSelectSinger || !currentSelectSongId) {
      return; // 跳过未配置的组件
    }
    
    // 执行自动匹配逻辑
    const res = await matchCloudSong(data.songId, currentSelectSongId, currentSelectSong);
    if (res.code === 200) {
      onUpdate?.();
    }
  };

  // 订阅事件
  on(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, handleMatchAll);

  // 组件卸载时取消订阅
  return () => {
    off(EVENT_TYPES.CLOUD_MUSIC_MATCH_ALL, handleMatchAll);
  };
}, [currentSelectSinger, currentSelectSongId, data, onUpdate]);
```

## 最佳实践

1. **手动管理订阅**：在React组件中使用 `useEffect` 手动管理事件订阅和取消订阅，确保在组件卸载时清理。

2. **定义事件类型常量**：避免使用字符串硬编码事件名称，统一使用 `EVENT_TYPES` 中的常量。

3. **合理使用依赖数组**：在 `useEffect` 的依赖数组中包含所有在事件处理函数中使用的外部变量。

4. **避免内存泄漏**：确保在组件卸载时取消事件订阅，在 `useEffect` 的清理函数中调用 `off`。

5. **事件数据设计**：事件数据应该包含足够的信息供订阅者处理，同时避免传递过大的数据。

## 注意事项

- 事件总线是全局的，所有组件都能接收到事件
- 避免在事件处理函数中进行过多的计算，保持处理逻辑简洁
- 合理使用事件，不要过度依赖事件总线进行组件通信
- 在开发环境中可以通过控制台查看事件发布和订阅的日志 