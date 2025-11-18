import { useConfig } from '@/hooks/useConfig';
import { Descriptions } from 'antd';
import SettingItem from './SettingItem';

const { Item } = Descriptions;

/**
 * 功能开关配置策略
 * 每个策略包含功能名称和对应的配置key
 */
const FUNCTION_SWITCH_STRATEGIES = [
  {
    label: '云盘快速上传',
    value: 'enableQuickUpload',
    type: 'switch',
  },
  {
    label: '云盘歌曲管理',
    value: 'enableCloudMusicManager',
    type: 'switch',
  },
  {
    label: '云盘本地上传',
    value: 'enableLocalUpload',
    type: 'switch',
  },
  {
    label: '查看歌单',
    value: 'enablePlayList',
    type: 'switch',
  },
  {
    label: '搜索',
    value: 'enableSearch',
    type: 'switch',
  },
  {
    label: '云盘导入',
    value: 'enableCloudImport',
    type: 'switch',
  },
  {
    label: 'GitHub信息',
    value: 'enableGithubInfo',
    type: 'switch',
  },
  {
    label: '调试Modal',
    value: 'enableTestModal',
    type: 'switch',
  },
  {
    label: '功能开关TAB',
    value: 'enableFunctionSwitchTab',
    type: 'switch',
    disabled: true,
  },
];

/**
 * 功能开关Tab组件
 * 用于控制各个功能的开启和关闭
 * 使用策略模式管理功能开关配置
 */
const FunctionSwitchTab = () => {
  const { functionConfig, setFunctionConfig } = useConfig();

  /**
   * 处理功能开关切换的策略方法
   * @param {string} key - 功能配置的key
   * @param {boolean} checked - 开关状态
   */
  const handleSwitchChange = (key, checked) => {
    setFunctionConfig({
      ...functionConfig,
      [key]: checked,
    });
  };

  return (
    <Descriptions column={3} size='large' bordered>
      {FUNCTION_SWITCH_STRATEGIES.map((strategy) => (
        <Item key={strategy.value} label={strategy.label}>
          <SettingItem
            value={functionConfig[strategy.value]}
            onChange={(value) => handleSwitchChange(strategy.value, value)}
            type={strategy.type}
            disabled={strategy.disabled}
          />
        </Item>
      ))}
    </Descriptions>
  );
};

export default FunctionSwitchTab;
