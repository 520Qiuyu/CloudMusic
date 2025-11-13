import {
  cloudSearch,
  matchLocalSong,
  search,
  searchArtist,
} from '@/api/search';
import { MyButton } from '@/components';
import { msgError, msgSuccess } from '@/utils/modal';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Select, Space, Upload } from 'antd';
import { useState } from 'react';

/**
 * 搜索相关测试组件
 */
const SearchTab = () => {
  // 测试搜索接口
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('1');
  const handleSearch = async () => {
    try {
      const res = await search(searchKeyword, { type: searchType });
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('搜索成功,请打开控制台查看！');
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleCloudSearch = async () => {
    try {
      const res = await cloudSearch(searchKeyword, { type: searchType });
      console.log('res', res);
      if (res.code === 200) {
        msgSuccess('搜索成功,请打开控制台查看！');
      }
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
      if (res.code === 200) {
        msgSuccess('搜索成功,请打开控制台查看！');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // 测试本地歌曲匹配
  const [fileList, setFileList] = useState([]);
  const handleLocalMatch = async () => {
    try {
      if (!fileList.length) return msgError('请选择文件');
      const res = await matchLocalSong(fileList);
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Form>
      {/* 测试搜索接口 */}
      <Form.Item label='测试搜索接口'>
        <Space wrap>
          <Space.Compact>
            <Select
              options={searchTypeOptions}
              style={{ width: 150 }}
              value={searchType}
              onChange={(value) => setSearchType(value)}
            />
            <Input
              placeholder='请输入搜索关键词'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </Space.Compact>
          <MyButton type='primary' onClick={handleSearch}>
            搜索（search）
          </MyButton>
          <MyButton type='primary' onClick={handleCloudSearch}>
            搜索（cloudSearch）
          </MyButton>
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
          <MyButton type='primary' onClick={handleSearchArtist}>
            搜索歌手信息
          </MyButton>
        </Space>
      </Form.Item>

      {/* 测试本地歌曲匹配 */}
      <Form.Item label='测试本地歌曲匹配'>
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
            <MyButton icon={<UploadOutlined />}>Select File</MyButton>
          </Upload>
          <MyButton type='primary' onClick={handleLocalMatch}>
            测试本地歌曲匹配
          </MyButton>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SearchTab;

const searchTypeOptions = [
  {
    label: '单曲',
    value: '1',
  },
  {
    label: '专辑',
    value: '10',
  },
  {
    label: '歌手',
    value: '100',
  },
  {
    label: '歌单',
    value: '1000',
  },
  {
    label: '用户',
    value: '1002',
  },
  {
    label: 'MV',
    value: '1004',
  },
  {
    label: '歌词',
    value: '1006',
  },
  {
    label: '电台',
    value: '1009',
  },
  {
    label: '视频',
    value: '1014',
  },
];
