export function useGetSingerInfo(singerId) {
  // 歌手信息
  const [singerInfo, setSingerInfo] = useState({});
  // 歌手专辑
  const [singerAlbum, setSingerAlbum] = useState([]);
  // 歌手全部歌曲
  const [singerAllSong, setSingerAllSong] = useState([]);

  // 获取歌手信息
  const getSingerInfo = async id => {
    try {
      const res = await searchArtist(searchValue);
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  };
}
