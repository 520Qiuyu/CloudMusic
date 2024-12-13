// 最后的战役
// 1、
const song = {
  id: 186059,
  name: "最后的战役",
  album: "八度空间",
  albumid: 18907,
  artists: "周杰伦",
  tns: "",
  dt: "04:11",
  filename: "周杰伦 - 最后的战役.flac",
  ext: "flac",
  md5: "168907675f2149d55e041776435317d9",
  size: 55661161,
  bitrate: 1770,
  picUrl:
    "https://p3.music.126.net/eDfuSni9ZWToHdqilVRI_w==/109951166698447900.jpg",
  isNoCopyright: true,
  isVIP: false,
  isPay: false,
  uploaded: false,
  needMatch: true,
  tablerow: {},
};

// 2 /api/cloud/upload/check/v2
[
    {
        "md5": "168907675f2149d55e041776435317d9",
        "songId": 186059,
        "bitrate": 1770,
        "fileSize": 55661161
    }
]     


// 3 song.cloudId = res1.data[0].songId;
/* cloudId
: 
"A8712AB894C2A73CD12736D34EF90D0751AB511A1571 */


// 4 /api/cloud/user/song/import
[
    {
        "songId": "A8712AB894C2A73CD12736D34EF90D0751AB511A1571E7EB2E9613C986EDEDE5792E9835D4D5C7FB44292F6B23C3287F6D3B87E544195E6F3299AFDB8585E9C1",
        "bitrate": 1770,
        "song": "周杰伦 - 最后的战役.flac",
        "artist": "周杰伦",
        "album": "八度空间",
        "fileName": "周杰伦 - 最后的战役.flac"
    }
]

// 5  song.cloudSongId = res.data.successSongs[0].song.songId;
1836997354

