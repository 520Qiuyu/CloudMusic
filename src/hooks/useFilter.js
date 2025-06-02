import { useEffect } from 'react';
import { useState } from 'react';

/**
 * 通用的多字段筛选hook
 * @param {Array} list - 原始数据列表
 * @param {Object} config - 筛选字段配置
 * @param {Object} config.fields - 需要筛选的字段配置
 * @param {Function} config.fields[field].getValue - 获取字段值的函数
 *
 * @example
 * // 在组件中使用示例
 * function SongListFilter() {
 *   const songList = [
 *     { name: '晴天', artist: '周杰伦', album: '叶惠美', type: '流行' },
 *     { name: '七里香', artist: '周杰伦', album: '七里香', type: '流行' },
 *     { name: '红玫瑰', artist: '陈奕迅', album: '认了吧', type: 'R&B' }
 *   ];
 *
 *   // 定义筛选字段配置
 *   const filterConfig = {
 *     fields: {
 *       name: {
 *         getValue: (item) => item.name
 *       },
 *       artist: {
 *         getValue: (item) => item.artist
 *       },
 *       album: {
 *         getValue: (item) => item.album
 *       },
 *       type: {
 *         getValue: (item) => item.type
 *       }
 *     }
 *   };
 *
 *   // 使用useFilter hook
 *   const { filteredList, setFilteredList, handleFilter } = useFilter(songList, filterConfig);
 *
 *   // 处理搜索表单提交
 *   const onSearch = (values) => {
 *     handleFilter(values);
 *   };
 *
 *   // 处理数据更新
 *   const handleUpdate = (updatedSong) => {
 *     const newList = filteredList.map(song =>
 *       song.id === updatedSong.id ? updatedSong : song
 *     );
 *     setFilteredList(newList);
 *   };
 *
 *   return (
 *     <div>
 *       <SearchForm onSearch={onSearch} />
 *       <SongTable
 *         dataSource={filteredList}
 *         onUpdate={handleUpdate}
 *       />
 *     </div>
 *   );
 * }
 */
export default function useFilter(list, config) {
  const [filteredList, setFilteredList] = useState(list);

  useEffect(() => {
    setFilteredList(list);
  }, [list]);

  // 处理筛选
  const handleFilter = (values) => {
    const filtered = list.filter((item) => {
      // 遍历所有配置的筛选字段
      return Object.entries(config.fields).every(([field, fieldConfig]) => {
        const filterValue = values[field];
        // 如果没有筛选值，则不进行筛选
        if (!filterValue?.length) return true;

        // 获取当前记录的字段值
        const itemValue = fieldConfig.getValue(item);
        if (!itemValue) return false;

        // 支持多个关键词匹配
        return filterValue.some((keyword) =>
          itemValue.toLowerCase().includes(keyword.toLowerCase()),
        );
      });
    });

    setFilteredList(filtered);
  };

  return { filteredList, setFilteredList, handleFilter };
}
