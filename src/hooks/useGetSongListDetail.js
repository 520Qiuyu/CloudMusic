import { getPlaylistAllData } from '@/api';
import { QUALITY_LEVELS } from '@/constant';
import { promiseLimit } from '@/utils';
import { getQualityTags } from '@/utils/music';
import { useState } from 'react';
import { usePlayMusic } from './usePlayMusic';
import { groupBy } from 'lodash';
import { downloadAsJson } from '@/utils/download';

export const useGetSongListDetail = () => {
  const [loading, setLoading] = useState(false);
  const [songList, setSongList] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const { download, getUrl, getLyric } = usePlayMusic();

  // 获取歌曲列表
  const getSongListData = async (playlistId) => {
    if (!playlistId) return;
    try {
      setLoading(true);
      const res = await getPlaylistAllData(playlistId);
      console.log('res', res);
      setSongList(res);
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
        return download(item.id, item.name, level, item.al?.id);
      });
      const res = await promiseLimit(PromiseList, concurrency);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    } finally {
      setDownloading(false);
    }
  };

  /** 下载成为JSON */
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
      await downloadAsJson(albums, '歌单.json');
      msgSuccess('下载成功');
    } catch (error) {
      console.log('error', error);
    } finally {
      setDownloading(false);
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
  };
};
