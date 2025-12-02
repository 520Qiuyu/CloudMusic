import { getAlbumDetail, getAlbumSongList, neteaseMusicToCloud } from '@/api';
import { QUALITY_LEVELS } from '@/constant';
import { promiseLimit } from '@/utils';
import { downloadAsJson } from '@/utils/download';
import { getDownloadQuality } from '@/utils/music';
import { useRef, useState } from 'react';
import { usePlayMusic } from './usePlayMusic';
import { message } from 'antd';
import { msgSuccess } from '@/utils/modal';

/**
 * 获取专辑详情的 Hook
 * @description 提供获取专辑详情、歌曲列表、播放、下载等功能
 */
export const useGetAlbumDetail = () => {
  const [albumInfo, setAlbumInfo] = useState(null);
  const [albumSongList, setAlbumSongList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const albumInfoMap = useRef({});

  const { play, getUrl, download, getLyric } = usePlayMusic();

  /**
   * 获取专辑详情
   * @param {string|number} id - 专辑ID
   * @returns {Promise<Object>} 专辑详情
   */
  const getAlbumDetailData = async (id) => {
    try {
      setIsLoading(true);
      const idStr = String(id);

      // 如果已缓存，直接返回
      if (albumInfoMap.current[idStr]) {
        const cached = albumInfoMap.current[idStr];
        setAlbumInfo(cached);
        return cached;
      }

      const res = await getAlbumDetail(id);
      console.log('专辑详情 res', res);

      if (res.code === 200 && res.album) {
        albumInfoMap.current[idStr] = res.album;
        setAlbumInfo(res.album);
        return res.album;
      } else {
        throw new Error(res.message || res.msg || '获取专辑详情失败');
      }
    } catch (error) {
      console.error('获取专辑详情失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 获取专辑歌曲列表
   * @param {string|number} id - 专辑ID
   * @returns {Promise<Array>} 歌曲列表
   */
  const getAlbumSongListData = async (id) => {
    try {
      setIsLoading(true);
      const res = await getAlbumSongList(id);
      console.log('专辑歌曲列表 res', res);

      if (res.code === 200 && res.songs) {
        setAlbumSongList(res.songs);
        return res.songs;
      } else {
        throw new Error(res.message || res.msg || '获取专辑歌曲列表失败');
      }
    } catch (error) {
      console.error('获取专辑歌曲列表失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 获取专辑歌曲URL列表
   * @param {string|number} id - 专辑ID
   * @returns {Promise<Array>} 包含URL的歌曲列表
   */
  const getAlbumSongUrl = async (id) => {
    try {
      const songList = await getAlbumSongListData(id);
      if (!songList || songList.length === 0) {
        return [];
      }

      const ids = songList.map((song) => {
        const quality = getDownloadQuality(song);
        return {
          id: song.id,
          name: song.name,
          quality,
        };
      });

      const promiseArr = ids.map((item) => async () => {
        const url = await getUrl(item.id, item.quality);
        return {
          ...item,
          url,
        };
      });

      const urls = await promiseLimit(promiseArr, 6);
      console.log('专辑歌曲URL列表', urls);
      return urls;
    } catch (error) {
      console.error('获取专辑歌曲URL失败:', error);
      throw error;
    }
  };

  /**
   * 下载专辑所有歌曲
   * @param {string|number} id - 专辑ID
   */
  const downloadAlbumSong = async (id) => {
    try {
      const songList = await getAlbumSongListData(id);
      if (!songList || songList.length === 0) {
        throw new Error('专辑中没有歌曲');
      }

      for (const song of songList) {
        console.log(`当前正在下载${song.name}...`);
        await download(song.id);
      }
    } catch (error) {
      console.error('下载专辑歌曲失败:', error);
      throw error;
    }
  };

  /**
   * 获取下载JSON数据
   * @param {string|number} id - 专辑ID
   * @returns {Promise<Object>} 包含专辑信息和歌曲列表的JSON对象
   */
  const getDownLoadJson = async (
    id,
    options = { level: QUALITY_LEVELS.无损 },
  ) => {
    try {
      const { level = QUALITY_LEVELS.无损 } = options;
      const albumDetail = await getAlbumDetailData(id);
      const songList = await getAlbumSongListData(id);

      if (!songList || songList.length === 0) {
        throw new Error('专辑中没有歌曲');
      }

      const promiseArr = songList.map((song) => async () => {
        const lrcContent = await getLyric(song.id);
        const url = await getUrl(song.id, level);
        return {
          songName: song.name,
          url,
          lrcContent,
        };
      });

      const songListWithUrl = await promiseLimit(promiseArr, 6);

      downloadAsJson(
        {
          albumName: albumDetail.name,
          albumCover: albumDetail.picUrl || albumDetail.blurPicUrl,
          list: songListWithUrl,
        },
        `${albumDetail.name}-专辑`,
      );

      return {
        albumName: albumDetail.name,
        albumCover: albumDetail.picUrl || albumDetail.blurPicUrl,
        list: songListWithUrl,
      };
    } catch (error) {
      console.error('获取下载JSON失败:', error);
      throw error;
    }
  };

  /**
   * 播放专辑
   * @param {string|number} id - 专辑ID
   */
  const playAlbum = async (id) => {
    try {
      const songList = await getAlbumSongListData(id);
      console.log('专辑歌曲列表', songList);

      if (!songList || songList.length === 0) {
        throw new Error('专辑中没有歌曲');
      }

      for (const song of songList) {
        const quality = getDownloadQuality(song);
        console.log('当前正在播放', song.name);
        await play(song.id, quality);
      }
    } catch (error) {
      console.error('播放专辑失败:', error);
      throw error;
    }
  };

  /**
   * 专辑转存云盘
   */
  const albumToCloud = async (id) => {
    if (!id) return;
    const uploadMessageKey = 'album-to-cloud';
    try {
      const songs = await getAlbumSongListData(id);
      const songIds = songs.map((song) => song.id);
      message.loading({
        content: '开始上传专辑歌曲到云盘，请稍候...',
        key: uploadMessageKey,
        duration: 0,
      });
      await neteaseMusicToCloud(songIds, {
        onChange: (progress) => {
          message.loading({
            content: `第${progress.current}首歌曲上传完成: ${progress.song.name}, 共${progress.total}首, 已上传${progress.successCount}首, 上传失败${progress.errorCount}首`,
            key: uploadMessageKey,
            duration: 0,
          });
        },
        onComplete: (result) => {
          message.destroy(uploadMessageKey);
          msgSuccess(
            `专辑歌曲转云盘完成, 共${result.total}首歌曲, 已上传${result.successCount}首, 上传失败${result.errorCount}首`,
          );
        },
      });
    } catch (error) {
      console.error('专辑转存云盘失败:', error);
      throw error;
    } finally {
      setTimeout(() => {
        message.destroy(uploadMessageKey);
      }, 3000);
    }
  };

  return {
    albumInfo,
    isLoading,
    getAlbumDetail: getAlbumDetailData,
    getAlbumSongList: getAlbumSongListData,
    playAlbum,
    getAlbumSongUrl,
    downloadAlbumSong,
    getDownLoadJson,
    albumToCloud,
  };
};
