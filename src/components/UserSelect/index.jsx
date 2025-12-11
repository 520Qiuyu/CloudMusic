import { cloudSearch } from '@/api';
import { SEARCH_TYPES } from '@/constant';
import { Spin } from 'antd';
import { Select } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

export default function UserSelect(props) {
  const { onChange, value } = props;

  const [_value, setValue] = useState();
  useEffect(() => {
    setValue(value);
  }, [value]);
  const handleChange = (_, data) => {
    setValue(data);
    onChange?.(data);
  };

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async (value) => {
    try {
      setLoading(true);
      const res = await cloudSearch(value, {
        type: SEARCH_TYPES.用户,
        limit: 40,
      });
      console.log('res', res);
      if (res.code === 200) {
        setOptions(res.result.userprofiles);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  const debouncedHandleSearch = debounce(handleSearch, 500);

  return (
    <Select
      placeholder='请选择用户'
      options={options}
      fieldNames={{ label: 'nickname', value: 'userId' }}
      value={_value?.userId}
      onChange={handleChange}
      showSearch
      allowClear
      onSearch={debouncedHandleSearch}
      style={{ width: '100%' }}
      loading={loading}
      filterOption={false}
      optionRender={(option) => {
        // 渲染用户重要信息：头像、昵称、ID、签名/简介等
        const { data } = option;
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 0,
            }}>
            <img
              src={data.avatarUrl}
              alt={data.nickname}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: 8,
                border: data.avatarDetail
                  ? '2px solid #ffd700'
                  : '1px solid #eee',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <span>{data.nickname}</span>
                <span style={{ color: '#999', fontSize: 12 }}>
                  （ID: {data.userId}）
                </span>
                {data.avatarDetail?.identityIconUrl && (
                  <img
                    src={data.avatarDetail.identityIconUrl}
                    alt='认证'
                    title='认证用户'
                    style={{ width: 16, height: 16, marginLeft: 2 }}
                  />
                )}
              </div>
              {data.signature && (
                <div
                  style={{
                    color: '#888',
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                  {data.signature}
                </div>
              )}
            </div>
          </div>
        );
      }}
      popupRender={(menu) => {
        return loading ? (
          <Spin
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 150,
            }}
          />
        ) : (
          menu
        );
      }}
    />
  );
}
