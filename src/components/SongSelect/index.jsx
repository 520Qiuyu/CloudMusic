import { cloudSearch } from '@/api';
import { SEARCH_TYPES } from '@/constant';
import { formatDuration } from '@/utils';
import { Select, Spin } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

export default function SongSelect(props) {
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
        type: SEARCH_TYPES.单曲,
        limit: 40,
      });
      console.log('res', res);
      if (res.code === 200) {
        setOptions(res.result.songs);
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
      placeholder='请选择歌曲'
      options={options}
      fieldNames={{ label: 'name', value: 'id' }}
      value={_value?.id}
      onChange={handleChange}
      showSearch
      allowClear
      onSearch={debouncedHandleSearch}
      style={{ width: '100%' }}
      loading={loading}
      filterOption={false}
      optionRender={(option) => {
        // 渲染歌曲重要信息：封面、歌曲名、艺术家、专辑、时长等
        const { data } = option;
        const artists = data.ar?.map((a) => a.name).join(' / ') || '未知艺术家';
        const albumName = data.al?.name || '未知专辑';
        const duration = formatDuration(data.dt);

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minWidth: 0,
            }}>
            <img
              src={data.al?.picUrl}
              alt={data.name}
              style={{
                width: 48,
                height: 48,
                borderRadius: 6,
                objectFit: 'cover',
                flexShrink: 0,
                border: '1px solid #eee',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <span>{data.name}</span>
                <span style={{ color: '#999', fontSize: 12 }}>
                  （ID: {data.id}）
                </span>
              </div>
              <div
                style={{
                  color: '#888',
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: 2,
                }}>
                {artists}
              </div>
              <div
                style={{
                  color: '#999',
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <span>{albumName}</span>
                {duration && (
                  <>
                    <span style={{ color: '#ccc' }}>•</span>
                    <span>{duration}</span>
                  </>
                )}
              </div>
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
