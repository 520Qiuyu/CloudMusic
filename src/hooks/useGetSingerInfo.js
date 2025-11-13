export function useGetSingerInfo(singerId) {
  // 歌手信息
  const [singerInfo, setSingerInfo] = useState({});
  // 歌手专辑
  const [albumList, setAlbumList] = useState([]);
  // 歌手热门歌曲
  const [hotSongList, setHotSongList] = useState([]);
  // 歌手全部歌曲
  const [allSongList, setAllSongList] = useState([]);

  // 获取歌手信息
  const getSingerInfo = async (singerId) => {
    try {
      const res = await searchArtist(singerId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    /**
     * 歌手信息
     */
    singerInfo,
    /**
     * 歌手专辑
     */
    albumList,
    /**
     * 歌手热门歌曲
     */
    hotSongList,
  };
}
