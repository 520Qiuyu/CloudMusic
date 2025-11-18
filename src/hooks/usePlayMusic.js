import {
  getAlbumDetail,
  getSongInfoList,
  getSongLyric,
  getSongUrl,
} from '@/api';
import { QUALITY_LEVELS } from '@/constant';
import { writeFlacTagAndPicture, writeFlacTags } from '@/libs/flac';
import {
  downloadAsLRC,
  downloadFileWithBlob,
  getFileBlob,
} from '@/utils/download';
import { msgError } from '@/utils/modal';
import { useRef, useState } from 'react';

/** 全局音频对象 */
const audio = new Audio();

export const usePlayMusic = () => {
  /** 当前播放歌曲id */
  const [currentMid, setCurrentMid] = useState('');
  /** 是否正在播放 */
  const [isPlaying, setIsPlaying] = useState();
  /** 下载中 */
  const [downloading, setDownloading] = useState(false);
  /** 当前播放时间 */
  const [currentTime, setCurrentTime] = useState(0);
  /** 歌曲时长 */
  const [duration, setDuration] = useState(0);
  /** url映射 */
  const urlMap = useRef({});
  /** 歌曲信息映射 */
  const [songInfoMap, setSongInfoMap] = useState({});

  /** 获取歌曲url */
  const getUrl = async (id, level = QUALITY_LEVELS.无损) => {
    const key = `${id}-${level}`;
    console.log('获取歌曲url的key', key);
    if (urlMap.current[key]) {
      return urlMap.current[key];
    }
    const res = await getSongUrl([id], { level });
    if (res.code !== 200 || !res.data[0]?.url) {
      msgError(res.message || res.msg || '获取歌曲链接失败');
      throw new Error(res.message || res.msg || '获取歌曲链接失败');
    }
    console.log('res', res);
    urlMap.current[key] = res.data[0].url;
    return res.data[0].url;
  };

  const getUrls = async (ids, level = QUALITY_LEVELS.无损) => {
    if (!Array.isArray(ids)) {
      throw new Error('ids must be an array');
    }
    const noUrlIds = ids.filter((id) => !urlMap.current[id]);
    const urls = await Promise.all(
      noUrlIds.map(async (id) => {
        const url = await getUrl(id, { level });
        return url;
      }),
    );
    console.log('urls', urls);
    return ids.map((id) => urlMap.current[`${id}-${level}`]);
  };

  const getSongInfo = async (id) => {
    if (songInfoMap[id]) return songInfoMap[id];
    const res = await getSongInfoList([id]);
    if (res.code !== 200) {
      msgError(res.message || res.msg || '获取歌曲信息失败');
      throw new Error(res.message || res.msg || '获取歌曲信息失败');
    }
    setSongInfoMap((prv) => ({ ...prv, [id]: res.songs?.[0] }));
    return res.songs?.[0];
  };

  const getSongInfos = async (ids) => {
    const noInfoIds = ids.filter((id) => !songInfoMap[id]);
    const res = await getSongInfoList(noInfoIds);
    if (res.code !== 200) {
      msgError(res.message || res.msg || '获取歌曲信息失败');
      throw new Error(res.message || res.msg || '获取歌曲信息失败');
    }
    setSongInfoMap((prv) => ({
      ...prv,
      ...Object.fromEntries(res.songs.map((info) => [info.id, info])),
    }));
    return res.songs;
  };

  const play = async (id, level) => {
    try {
      if (currentMid === id) {
        audio.play();
        return;
      }
      const url = await getUrl(id, level);
      setIsPlaying(id);
      audio.src = url;
      audio.play();
      setCurrentMid(id);
      return new Promise((resolve) => {
        audio.onended = () => {
          resolve(true);
          setIsPlaying(undefined);
        };
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const playPlayList = async (ids, level) => {
    for (const id of ids) {
      await play(id, level);
    }
  };

  /** 获取歌曲歌词 */
  const getLyric = async (id) => {
    const res = await getSongLyric(id);
    if (res.code !== 200) {
      msgError(res.message || res.msg || '获取歌曲歌词失败');
      throw new Error(res.message || res.msg || '获取歌曲歌词失败');
    }
    console.log('歌词res', res.lrc?.lyric);
    return res.lrc?.lyric;
  };

  const download = async (id, name, level = QUALITY_LEVELS.无损) => {
    try {
      setDownloading(id);
      const url = await getUrl(id, level);
      console.log(`当前下载歌曲${name},音质为${level},链接为${url}`);
      /** 获取文件后缀 */
      const finalExt = url.split('?')[0].split('.').pop();
      const { blob, response } = await getFileBlob(
        url.replace('http://', 'https://'),
      );
      console.log('blob', blob);
      const fileName = `${name}.${finalExt}`;
      /** 输出文件 */
      let outputFile = blob;
      /** 获取歌词 */
      const lyric = await getLyric(id);

      /** 获取歌曲信息 */
      const songInfo = await getSongInfo(id);
      console.log('songInfo', songInfo);
      /** 获取专辑id */
      const albumId = songInfo?.al?.id;
      /** 歌手 */
      const singer = songInfo?.ar?.[0]?.name;
      /** 专辑 */
      const album = songInfo?.al?.name;
      /** 歌曲名称 */
      const songName = songInfo?.name;
      /** 标签 */
      const tags = [
        { tag: 'title', value: songName },
        { tag: 'artist', value: singer },
        { tag: 'album', value: album },
      ];
      console.log('tags', tags);
      /** 获取封面 */
      let coverBlob;
      if (albumId) {
        const albumRes = await getAlbumDetail(albumId);
        if (albumRes.code === 200) {
          const albumCover = albumRes.album.blurPicUrl + '?param=600y600';
          const { blob, response } = await getFileBlob(
            albumCover.replace('http://', 'https://'),
          );
          coverBlob = blob;
        }
      }

      switch (finalExt) {
        case 'flac':
          outputFile = await writeFlacTags(outputFile, tags);
          outputFile = await writeFlacTagAndPicture(
            outputFile,
            'lyrics',
            lyric,
            coverBlob,
          );
          break;
        /*  case 'mp3':
          outputFile = await writeFlacTagAndPicture(blob, 'lyrics', lyric, coverBlob!);
          break; */
        default:
          console.log('当前格式不支持');
          break;
      }

      downloadAsLRC(lyric, name);
      downloadFileWithBlob(outputFile, fileName);
    } catch (error) {
      console.log('error', error);
    } finally {
      setDownloading(undefined);
    }
  };

  const pause = () => {
    audio.pause();
    setIsPlaying(false);
  };

  return {
    currentMid,
    isPlaying,
    currentTime,
    duration,
    getUrl,
    getLyric,
    play,
    pause,
    playPlayList,
    download,
    downloading,
  };
};
