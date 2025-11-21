import { QUALITY_LEVELS, QUALITY_WEIGHTS } from '@/constant';
import { useConfig } from '@/hooks/useConfig';
import { Descriptions } from 'antd';
import SettingItem from './SettingItem';

const { Item } = Descriptions;

/**
 * 获取音质选项列表
 * 从 QUALITY_WEIGHTS 中提取所有key作为选项
 */
const getQualityOptions = () => {
  return Object.keys(QUALITY_WEIGHTS).map((key) => ({
    label: QUALITY_LEVELS[key],
    value: key,
  }));
};

/**
 * 下载设置配置策略
 * 每个策略包含配置项名称、对应的配置key、控件类型和额外配置
 */
const DOWNLOAD_SETTING_STRATEGIES = [
  {
    label: '下载音质',
    value: 'quality',
    type: 'select',
    options: getQualityOptions(),
    style: { width: 200 },
  },
  {
    label: '是否下载歌词',
    value: 'downloadLyric',
    type: 'switch',
  },
  {
    label: '是否内嵌歌词封面',
    value: 'embedLyricCover',
    type: 'switch',
  },
  {
    label: '是否内嵌歌曲信息',
    value: 'embedSongInfo',
    type: 'switch',
  },
];

/**
 * 下载设置Tab组件
 * 用于配置下载相关的设置
 * 使用策略模式管理下载配置
 */
const DownloadSettingTab = () => {
  const { downloadConfig, setDownloadConfig } = useConfig();

  /**
   * 处理配置项变化的策略方法
   * @param {string} key - 配置项的key
   * @param {any} value - 配置项的值
   */
  const handleConfigChange = (key, value) => {
    setDownloadConfig({
      ...downloadConfig,
      [key]: value,
    });
  };

  return (
    <Descriptions
      column={3}
      size='large'
      bordered
      style={{
        minWidth: 800,
      }}>
      {DOWNLOAD_SETTING_STRATEGIES.map((strategy) => (
        <Item key={strategy.value} label={strategy.label}>
          <SettingItem
            value={downloadConfig[strategy.value]}
            onChange={(value) => handleConfigChange(strategy.value, value)}
            type={strategy.type}
          />
        </Item>
      ))}
    </Descriptions>
  );
};

export default DownloadSettingTab;
