import { getAlbumDetail, getSongLyric, getSongUrl } from '@/api';
import { QUALITY_LEVELS } from '@/constant';
import { writeFlacTagAndPicture } from '@/libs/flac';
import { isProduction } from '@/utils';
import { downloadFileWithBlob, getFileBlob } from '@/utils/download';
import { msgError } from '@/utils/modal';
import { useRef, useState } from 'react';

const audio = new Audio();

export const usePlayMusic = () => {
  const [currentMid, setCurrentMid] = useState('');
  const [isPlaying, setIsPlaying] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const urlMap = useRef({});

  const getUrl = async (id, level = QUALITY_LEVELS.无损) => {
    const key = `${id}-${level}`;
    console.log('获取歌曲url的key', key);
    if (urlMap.current[key]) {
      return urlMap.current[key];
    }
    const res = await getSongUrl([id], { level });
    if (res.code !== 200) {
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

  const download = async (id, name, level = QUALITY_LEVELS.无损, albumMid) => {
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

    if (!isProduction()) {
      /** 获取歌词 */
      const lyric = await getLyric(id);

      /** 获取封面 */
      let coverBlob;
      if (albumMid) {
        const albumRes = await getAlbumDetail(albumMid);
        if (albumRes.code === 200) {
          const albumCover = albumRes.album.blurPicUrl;
          const { blob, response } = await getFileBlob(
            albumCover.replace('http://', 'https://'),
          );
          coverBlob = blob;
        }
      }

      switch (finalExt) {
        case 'flac':
          outputFile = await writeFlacTagAndPicture(
            blob,
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
    }

    downloadFileWithBlob(outputFile, fileName);
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
  };
};
