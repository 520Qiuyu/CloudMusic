// 由d:\Documents\CloudMusic\scripts\generate-exports.cjs自动生成，请勿修改
export { getAlbumSongList, getAlbumDetail} from './album.js';
export { getArtists, getArtistTopSongList, getArtistAllSongList, getArtistAlbumList} from './artist.js';
export { getCDNConfig} from './cdn.js';
export { matchCloudSong, uploadSong, getCloudData, deleteCloudSong, uploadLocalSong, neteaseMusicToCloud} from './cloud.js';
export { getQrKey, getQrCode, getQrStatus, getUserAccount} from './login.js';
export { getPlaylistList, createPlaylist, deletePlaylist, addSongToPlaylist, getPlaylistAllData, updateSongOrder} from './playlist.js';
export { search, cloudSearch, searchArtist, matchLocalSong} from './search.js';
export { getSongInfoList, getSongUrl, getSongUrlOld, getSongLyric, getSongDynamicCover} from './song.js';
export { getUserHistoryComment, getUserAllHistoryComment} from './user.js';
