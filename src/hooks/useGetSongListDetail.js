import {
  getPlaylistAllData,
  neteaseMusicToCloud,
  updateSongOrder,
} from '@/api';
import { QUALITY_LEVELS } from '@/constant';
import { promiseLimit } from '@/utils';
import { downloadAsJson } from '@/utils/download';
import { msgError, msgSuccess } from '@/utils/modal';
import { getQualityTags } from '@/utils/music';
import { message } from 'antd';
import { groupBy } from 'lodash';
import { useState } from 'react';
import { useConfig } from './useConfig';
import { usePlayMusic } from './usePlayMusic';

export const useGetSongListDetail = () => {
  const [loading, setLoading] = useState(false);
  const [songList, setSongList] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const { download, getUrl, getLyric } = usePlayMusic();
  const { defaultSongSortRule, functionConfig } = useConfig();
  const { liveKeywords } = functionConfig;

  // 获取歌曲列表
  const getSongListData = async (playlistId) => {
    if (!playlistId) return;
    try {
      setLoading(true);
      const res = await getPlaylistAllData(playlistId);
      console.log('res', res);
      setSongList(res);
      return res;
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSongList = () => {
    setSongList([]);
  };

  /**
   * 下载歌曲列表，支持自定义最大并发量
   * @param {Array} list 歌曲列表
   * @param {number} concurrency 并发量，默认3
   */
  const downloadSongList = async (list, concurrency = 3) => {
    try {
      setDownloading(true);
      if (!list?.length) return;
      const PromiseList = list.map((item) => async () => {
        const level =
          item.level || item.hr
            ? QUALITY_LEVELS['Hi-Res']
            : getQualityTags(item)[0]?.value;
        return download(item.id, level);
      });
      const res = await promiseLimit(PromiseList, concurrency);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    } finally {
      setDownloading(false);
    }
  };

  /**
   * 下载歌曲列表成为专辑分组的JSON文件（结构如例子）
   */
  const downloadSongListAsJson = async (list) => {
    try {
      setDownloading(true);
      if (!list?.length) return;

      const promiseArr = list?.map((item) => async () => {
        const lrc = await getLyric(item.id);
        const url = await getUrl(
          item.id,
          item.level || item.hr
            ? QUALITY_LEVELS['Hi-Res']
            : getQualityTags(item)[0]?.value,
        );
        return {
          ...item,
          lrcContent: lrc,
          url: url,
        };
      });

      const res = await promiseLimit(promiseArr, 6);
      console.log('res', res);

      // 分组合并为专辑
      const albumsMap = groupBy(res, (item) => item.al?.name);
      const albums = Object.fromEntries(
        Object.entries(albumsMap).map(([albumName, value]) => [
          albumName,
          value.map((song) => ({
            songName: song.name,
            url: song.url,
            lrcContent: song.lrcContent,
          })),
        ]),
      );
      console.log('albums', albums);
      downloadAsJson(albums, '歌单.json');
      msgSuccess('下载成功');
    } catch (error) {
      console.log('error', error);
    } finally {
      setDownloading(false);
    }
  };

  /**
   * 歌单列表排序
   */
  const sortSongListByListId = async (playlistId) => {
    if (!playlistId) return;
    try {
      const songs = await getPlaylistAllData(playlistId);
      const liveSongs = songs.filter((song) =>
        liveKeywords.some((keyword) => song.al?.name.includes(keyword)),
      );
      const otherSongs = songs.filter((song) => !liveSongs.includes(song));
      const sortedSongs = [
        ...otherSongs.sort(defaultSongSortRule.rule),
        ...liveSongs.sort(defaultSongSortRule.rule),
      ];
      const res = await updateSongOrder(
        playlistId,
        sortedSongs.map((song) => song.id),
      );
      if (res.code === 200) {
        msgSuccess('歌单列表排序成功');
      } else {
        msgError(res.message || '歌单列表排序失败');
      }
    } catch (error) {
      console.log('error', error);
      msgError('歌单列表排序失败');
    }
  };

  /**
   * 歌曲转存云盘
   */
  const playlistToCloud = async (playlistId) => {
    if (!playlistId) return;
    const uploadMessageKey = 'playlist-to-cloud';
    try {
      const songs = await getPlaylistAllData(playlistId);
      const songIds = songs.map((song) => song.id);
      message.loading({
        content: '开始上传歌单歌曲到云盘，请稍候...',
        key: uploadMessageKey,
        duration: 0,
      });
      const res = await neteaseMusicToCloud(songIds, {
        onChange: (progress) => {
          message.loading({
            content: `第${progress.current}首歌曲上传完成: ${progress.song.name}, 共${progress.total}首, 已上传${progress.successCount}首, 上传失败${progress.errorCount}首`,
            key: uploadMessageKey,
            duration: 0,
          });
        },
        onComplete: (result) => {
          message.destroy(uploadMessageKey);
          console.log('result', result);
          msgSuccess(
            `歌单歌曲转云盘完成, 共${result.total}首歌曲, 已上传${result.successCount}首, 上传失败${result.errorCount}首`,
          );
        },
      });
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
      msgError('歌曲转存云盘失败');
    } finally {
      message.destroy(uploadMessageKey);
    }
  };

  return {
    getSongListData,
    loading,
    songList,
    resetSongList,
    downloadSongList,
    downloading,
    downloadSongListAsJson,
    sortSongListByListId,
    playlistToCloud,
  };
};
