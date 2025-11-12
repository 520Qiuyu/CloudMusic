import { cloudSearch, search } from '@/api/search';
import { useVisible } from '@/hooks/useVisible';
import {
  embedFlacPicture,
  readAllFlacTag,
  readFlacTag,
  writeFlacTag,
} from '@/libs/flac';
import { downloadFile, downloadFileWithBlob } from '@/utils/download';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Upload } from 'antd';
import { forwardRef, useState } from 'react';
import {
  addSongToPlaylist,
  createPlaylist,
  deleteCloudSong,
  getAlbumDetail,
  getAlbumSongList,
  getArtistAlbumList,
  getArtistAllSongList,
  getArtistTopSongList,
  getCloudData,
  getPlaylistAllData,
  getPlaylistList,
  getQrCode,
  getQrKey,
  getQrStatus,
  getSongDynamicCover,
  getSongInfoList,
  getSongLyric,
  getSongUrl,
  getUserAccount,
  matchLocalSong,
  searchArtist,
  uploadLocalSong,
} from '../../api';
import { promiseLimit, sleep } from '../../utils';
import { msgError, msgSuccess } from '../../utils/modal';
import { FLAC_TAGS } from '@/constant';

const TestModal = forwardRef((props, ref) => {
  const { visible, open, close } = useVisible({}, ref);

  // 获取用户信息
  const handleGetUserAccount = async () => {
    console.log('获取用户信息');
    try {
      const res = await getUserAccount();
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取云盘输入数据
  const [pageData, setPageData] = useState({
    limit: 500,
    offset: 0,
  });
  // 获取云盘数据
  const handleGetCloudData = async () => {
    console.log('获取云盘数据');
    try {
      const res = await getCloudData(pageData.limit, pageData.offset);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 歌单名称
  const [songListName, setSongListName] = useState('');
  // 新建歌单
  const handleCreateSongList = async () => {
    console.log('新建歌单');
    try {
      const res = await createPlaylist(songListName);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 添加信息
  const [addInfo, setAddInfo] = useState({
    songId: '185620',
    playlistId: '12999288729',
  });
  // 添加歌曲
  const handleAddSong = async () => {
    console.log('添加歌曲');
    try {
      const res = await addSongToPlaylist(addInfo.playlistId, [addInfo.songId]);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 用户id
  const [userId, setUserId] = useState('12999288729');
  //   获取歌单列表
  const handleGetPlaylistList = async () => {
    console.log('获取歌单列表');
    try {
      const res = await getPlaylistList(userId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 歌曲id
  const [songId, setSongId] = useState('2608471890');
  // 获取歌曲URL
  const handleGetSongUrl = async () => {
    console.log('获取歌曲URL');
    try {
      const res = await getSongUrl([songId]);
      console.log('res', res);
      if (res.code === 200) {
        const url = res.data[0].url;
        await navigator.clipboard.writeText(url);
        msgSuccess('获取成功,已复制到剪切板');
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  // 获取歌曲信息
  const handleGetSongInfo = async () => {
    console.log('获取歌曲信息');
    try {
      const res = await getSongInfoList([songId]);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };
  // 获取歌曲歌词
  const handleGetSongLyric = async () => {
    console.log('获取歌曲歌词');
    try {
      const res = await getSongLyric(songId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 获取歌曲动态封面
  const handleGetSongDynamicCover = async () => {
    try {
      const res = await getSongDynamicCover(songId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };
  // 删除云盘歌曲
  const handleDeleteCloudSong = async () => {
    console.log('删除云盘歌曲');
    try {
      const res = await deleteCloudSong([songId]);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  const [albumId, setAlbumId] = useState('242274622');
  // 获取专辑歌曲列表
  const handleGetAlbumSongList = async () => {
    console.log('获取专辑歌曲列表');
    try {
      const res = await getAlbumSongList(albumId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };
  // 获取专辑详情
  const handleGetAlbumDetail = async () => {
    console.log('获取专辑详情');
    try {
      const res = await getAlbumDetail(albumId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 歌手id
  const [artistId, setArtistId] = useState('3684');
  // 获取歌手歌曲列表
  const handleGetArtistTopSongList = async () => {
    console.log('获取歌手歌曲列表');
    try {
      const res = await getArtistTopSongList(artistId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };
  // 获取歌手专辑
  const handleGetArtistAlbum = async () => {
    console.log('获取歌手专辑');
    try {
      const res = await getArtistAlbumList(artistId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };
  // 下载专辑封面
  const handleGetArtistAlbumPic = async () => {
    console.log('下载专辑封面');
    try {
      const res = await getArtistAlbumList(artistId);
      console.log('res', res);
      if (res.code === 200) {
        const downloadTask = res.map(
          (item) => () =>
            downloadFile(item.cover.split('?')[0], item.name + '.jpg'),
        );
        await promiseLimit(downloadTask, 1);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  // 获取歌手全部歌曲
  const handleGetArtistAllSongList = async () => {
    console.log('获取歌手全部歌曲');
    try {
      const res = await getArtistAllSongList(artistId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // qr登录
  const handleQrLogin = async () => {
    console.log('二维码登录');
    try {
      const keyRes = await getQrKey();
      if (keyRes.code !== 200) return msgError('获取二维码key失败');
      const key = keyRes.unikey;
      console.log('key', key);
      const qrcode = await getQrCode(key);
      // 显示二维码
      const qrImg = document.createElement('img');
      qrImg.src = qrcode;
      qrImg.style.width = '200px';
      qrImg.style.height = '200px';
      document.getElementById('qrcode-container').innerHTML = '';
      document.getElementById('qrcode-container').appendChild(qrImg);
      // 检车二维码状态 2分钟
      const timeOutTime = Date.now() + 2 * 60 * 1000;
      while (Date.now() < timeOutTime) {
        const qrStatusRes = await getQrStatus(key);
        console.log('qrStatus', qrStatusRes);
        // 801:等待扫码 802:授权中 803:授权成功 800:不存在或失效
        const { code } = qrStatusRes.response;
        if (code === 801) {
          console.log('等待扫码');
        } else if (code === 802) {
          console.log('授权中');
        } else if (code === 803) {
          console.log('授权成功');
          console.log('qrStatusRes', qrStatusRes);
          break;
        } else if (code === 800) {
          console.log('不存在或失效');
          break;
        }
        await sleep(1000);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试flac标签
  const [flacFile, setFlacFile] = useState(null);
  const [flacTagName, setFlacTagName] = useState('all');
  const [flacTagValue, setFlacTagValue] = useState('');
  const [flacPicture, setFlacPicture] = useState(null);
  const handleReadFlacTag = async () => {
    try {
      console.log('flacFile', flacFile);
      if (!flacFile) return msgError('请选择文件');
      if (flacTagName === 'all') {
        const res = await readAllFlacTag(flacFile);
        console.log('res', res);
      } else {
        const res = await readFlacTag(flacFile, flacTagName);
        console.log('res', res);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleWriteFlacTag = async () => {
    try {
      if (!flacFile) return msgError('请选择文件');
      if (flacTagName === 'all') return msgError('请选择具体标签');
      const res = await writeFlacTag(flacFile, flacTagName, flacTagValue);
      console.log('res', res);
      setFlacFile(res);
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleEmbedFlacPicture = async () => {
    try {
      if (!flacFile) return msgError('请选择文件');
      if (!flacPicture) return msgError('请选择图片');
      const res = await embedFlacPicture(flacFile, flacPicture);
      console.log('res', res);
      setFlacFile(res);
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleDownloadFlacFile = async () => {
    try {
      if (!flacFile) return msgError('请选择文件');
      downloadFileWithBlob(flacFile, 'test.flac');
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试上传本地歌曲到云盘
  const [fileList, setFileList] = useState([]);
  const handleUploadLocalSong = async () => {
    try {
      console.log('fileList', fileList);
      if (!fileList.length) return msgError('请选择文件');
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const res = await uploadLocalSong(file);
        console.log('res', res);
        console.log(JSON.stringify(res, null, 2));
        if (res.artist) {
          setSearchValue(res.artist);
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleLocalMatch = async () => {
    try {
      const res = await matchLocalSong(fileList);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试搜索歌手信息
  const [searchValue, setSearchValue] = useState('');
  const handleSearchArtist = async () => {
    try {
      const res = await searchArtist(searchValue);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试获取歌单信息
  const [playlistId, setPlaylistId] = useState('13508631377');
  const handleGetPlaylist = async () => {
    try {
      const res = await getPlaylistAllData(playlistId);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试搜索接口
  const [searchKeyword, setSearchKeyword] = useState('');
  const handleSearch = async () => {
    try {
      const res = await search(searchKeyword);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleCloudSearch = async () => {
    try {
      const res = await cloudSearch(searchKeyword);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Modal
      title='测试Modal'
      open={visible}
      onCancel={close}
      width={800}
      styles={{
        body: {
          maxHeight: '75vh',
          overflowY: 'auto',
        },
      }}
      footer={null}
      centered>
      <Form>
        {/* 测试获取用户信息 */}
        <Form.Item label='获取用户信息'>
          <Button type='primary' onClick={handleGetUserAccount}>
            获取用户信息
          </Button>
        </Form.Item>
        {/* 测试获取云盘数据 */}
        <Form.Item label='获取云盘数据'>
          <Space>
            <Input placeholder='limit' style={{ width: 100 }} />
            <Input placeholder='offset' style={{ width: 100 }} />
            <Button type='primary' onClick={handleGetCloudData}>
              获取云盘数据
            </Button>
          </Space>
        </Form.Item>
        {/* 测试新建歌单 */}
        <Form.Item label='新建歌单'>
          <Space>
            <Input
              placeholder='请输入歌单名称'
              value={songListName}
              onChange={(e) => setSongListName(e.target.value)}
            />
            <Button type='primary' onClick={handleCreateSongList}>
              新建歌单
            </Button>
          </Space>
        </Form.Item>
        {/* 测试向歌单添加歌曲 */}
        <Form.Item label='向歌单添加歌曲'>
          <Space>
            <Input
              placeholder='请输入歌单Id'
              addonBefore='歌单id'
              value={addInfo.playlistId}
              onChange={(e) =>
                setAddInfo({ ...addInfo, playlistId: e.target.value })
              }
            />
            <Input
              placeholder='请输入歌曲Id'
              addonBefore='歌曲id'
              value={addInfo.songId}
              onChange={(e) =>
                setAddInfo({ ...addInfo, songId: e.target.value })
              }
            />
            <Button type='primary' onClick={handleAddSong}>
              添加歌曲
            </Button>
          </Space>
        </Form.Item>

        {/* 测试获取用户歌单列表 */}
        <Form.Item label='获取用户歌单列表'>
          <Space>
            <Input
              placeholder='请输入用户Id'
              addonBefore='用户id'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button type='primary' onClick={handleGetPlaylistList}>
              获取用户歌单列表
            </Button>
          </Space>
        </Form.Item>

        {/* 测试获取歌单详情 */}
        <Form.Item label='测试获取歌单详情'>
          <Space>
            <Input
              placeholder='请输入歌单Id'
              addonBefore='歌单Id'
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
            />
            <Button type='primary' onClick={handleGetPlaylist}>
              获取歌单详情
            </Button>
          </Space>
        </Form.Item>

        {/* 测试获取歌曲信息 */}
        <Form.Item label='获取歌曲信息'>
          <Space wrap>
            <Input
              placeholder='请输入歌曲Id'
              addonBefore='歌曲Id'
              value={songId}
              onChange={(e) => setSongId(e.target.value)}
            />
            <Button type='primary' onClick={handleGetSongUrl}>
              获取歌曲URL
            </Button>
            {/* 获取歌曲信息 */}
            <Button type='primary' onClick={handleGetSongInfo}>
              获取歌曲信息
            </Button>
            {/* 获取歌曲歌词 */}
            <Button type='primary' onClick={handleGetSongLyric}>
              获取歌曲歌词
            </Button>
            {/* 获取歌曲动态封面 */}
            <Button type='primary' onClick={handleGetSongDynamicCover}>
              获取歌曲动态封面
            </Button>
            <Button type='primary' onClick={handleDeleteCloudSong}>
              删除云盘歌曲
            </Button>
          </Space>
        </Form.Item>

        {/* 测试获取专辑歌曲列表 */}
        <Form.Item label='获取专辑歌曲列表'>
          <Space>
            <Input
              placeholder='请输入专辑Id'
              addonBefore='专辑Id'
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
            />
            <Button type='primary' onClick={handleGetAlbumSongList}>
              获取专辑歌曲列表
            </Button>
            {/* 获取专辑详情 */}
            <Button type='primary' onClick={handleGetAlbumDetail}>
              获取专辑详情
            </Button>
          </Space>
        </Form.Item>

        {/* 测试获取歌手歌曲列表 */}
        <Form.Item label='获取歌手歌曲列表'>
          <Space wrap>
            <Input
              placeholder='请输入歌手Id'
              addonBefore='歌手Id'
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
            />
            <Button type='primary' onClick={handleGetArtistTopSongList}>
              获取歌手热门歌曲列表
            </Button>
            <Button type='primary' onClick={handleGetArtistAlbum}>
              获取歌手专辑
            </Button>
            {/* 下载专辑封面 */}
            <Button type='primary' onClick={handleGetArtistAlbumPic}>
              下载专辑封面
            </Button>
            <Button type='primary' onClick={handleGetArtistAllSongList}>
              获取歌手全部歌曲
            </Button>
          </Space>
        </Form.Item>

        {/* 测试二维码登录 */}
        <Form.Item label='二维码登录'>
          <div id='qrcode-container'></div>
          <Button type='primary' onClick={handleQrLogin}>
            二维码登录
          </Button>
        </Form.Item>

        {/* 测试flac标签 */}
        <Form.Item label='测试flac标签'>
          <Space wrap>
            <input
              type='file'
              accept='.flac'
              onChange={(e) => {
                setFlacFile(e.target.files[0]);
              }}
            />
            <Select
              style={{ width: 100 }}
              options={[
                { label: '全部', value: 'all' },
                ...Object.entries(FLAC_TAGS).map(([key, value]) => ({
                  label: value,
                  value: key,
                })),
              ]}
              value={flacTagName}
              onChange={(value) => setFlacTagName(value)}
            />
            <Input
              placeholder='请输入flac标签'
              value={flacTagValue}
              onChange={(e) => setFlacTagValue(e.target.value)}
            />
            <Button type='primary' onClick={handleReadFlacTag}>
              读取flac标签
            </Button>
            <Button type='primary' onClick={handleWriteFlacTag}>
              写入flac标签
            </Button>
            <input
              type='file'
              accept='.jpg,.png,.jpeg'
              onChange={(e) => {
                setFlacPicture(e.target.files[0]);
              }}
            />
            <Button type='primary' onClick={handleEmbedFlacPicture}>
              嵌入flac图片
            </Button>
            <Button type='primary' onClick={handleDownloadFlacFile}>
              下载最新文件
            </Button>
          </Space>
        </Form.Item>

        {/* 测试上传本地歌曲到云盘 */}
        <Form.Item label='上传本地歌曲到云盘'>
          <Space wrap>
            <Upload
              fileList={fileList}
              accept='.flac,.mp3,.wav,.aac,.m4a,.ogg,.wma'
              beforeUpload={(file) => {
                setFileList([...fileList, file]);
                return false;
              }}
              onRemove={(file) => {
                setFileList(fileList.filter((f) => f !== file));
              }}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button type='primary' onClick={handleUploadLocalSong}>
              上传本地歌曲到云盘
            </Button>
            {/* 测试本地歌曲匹配 */}
            <Button type='primary' onClick={handleLocalMatch}>
              测试本地歌曲匹配
            </Button>
          </Space>
        </Form.Item>

        {/* 测试搜索歌手信息 */}
        <Form.Item label='测试搜索歌手信息'>
          <Space wrap>
            <Input
              placeholder='请输入歌手名称'
              addonBefore='歌手名称'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button type='primary' onClick={handleSearchArtist}>
              搜索歌手信息
            </Button>
          </Space>
        </Form.Item>

        {/* 测试搜索接口 */}
        <Form.Item label='测试搜索接口'>
          <Space wrap>
            <Input
              placeholder='请输入搜索关键词'
              addonBefore='搜索关键词'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button type='primary' onClick={handleSearch}>
              搜索（search）
            </Button>
            <Button type='primary' onClick={handleCloudSearch}>
              搜索（cloudSearch）
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default TestModal;
