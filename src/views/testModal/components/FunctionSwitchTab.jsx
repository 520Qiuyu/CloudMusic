import { useConfig } from '@/hooks/useConfig';
import { Descriptions } from 'antd';
import SettingItem from './SettingItem';
import { SONG_SORT_RULES } from '@/constant';

const { Item } = Descriptions;

/**
 * 功能开关配置策略
 * 每个策略包含功能名称和对应的配置key
 */
const FUNCTION_SWITCH_STRATEGIES = [
  {
    label: '云盘快速上传',
    key: 'enableQuickUpload',
    type: 'switch',
  },
  {
    label: '云盘歌曲管理',
    key: 'enableCloudMusicManager',
    type: 'switch',
  },
  {
    label: '云盘本地上传',
    key: 'enableLocalUpload',
    type: 'switch',
  },
  {
    label: '查看歌单',
    key: 'enablePlayList',
    type: 'switch',
  },
  {
    label: '搜索',
    key: 'enableSearch',
    type: 'switch',
  },
  {
    label: '云盘导入',
    key: 'enableCloudImport',
    type: 'switch',
  },
  {
    label: 'GitHub信息',
    key: 'enableGithubInfo',
    type: 'switch',
  },
  {
    label: '脚本更新',
    key: 'enableScriptUpdate',
    type: 'switch',
  },
  {
    label: '调试Modal',
    key: 'enableTestModal',
    type: 'switch',
  },
  {
    label: '默认排序规则',
    key: 'defaultSongSortRuleValue',
    type: 'select',
    options: SONG_SORT_RULES.map((rule) => ({
      label: rule.name,
      value: rule.value,
    })),
    style: { width: '100%' },
  },
  {
    label: '演唱会关键词',
    key: 'liveKeywords',
    type: 'select',
    mode: 'tags',
    tokenSeparators: [',', '，', ' '],
    style: { width: '100%' },
  },
  {
    label: '功能开关TAB',
    key: 'enableFunctionSwitchTab',
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
      {FUNCTION_SWITCH_STRATEGIES.map((strategy) => {
        const { type, key, label, disabled, ...rest } = strategy;
        return (
          <Item key={key} label={label}>
            <SettingItem
              value={functionConfig[key]}
              onChange={(value) => handleSwitchChange(key, value)}
              type={type}
              disabled={disabled}
              {...rest}
            />
          </Item>
        );
      })}
    </Descriptions>
  );
};

export default FunctionSwitchTab;
