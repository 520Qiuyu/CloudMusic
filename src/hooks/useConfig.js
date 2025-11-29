import { useLocalStorageState } from 'ahooks';
import { defaultConfig } from '@/config';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { SONG_SORT_RULES } from '@/constant';

export const useConfig = () => {
  // 下载配置
  const [downloadConfig, setDownloadConfig] = useLocalStorageState(
    'downloadConfig',
    {
      defaultValue: defaultConfig.download,
      listenStorageChange: true,
    },
  );

  // 功能配置
  const [functionConfig, setFunctionConfig] = useLocalStorageState(
    'functionConfig',
    {
      defaultValue: defaultConfig.function,
      listenStorageChange: true,
    },
  );

  const defaultSongSortRule = useMemo(
    () =>
      SONG_SORT_RULES.find(
        (rule) => rule.value === functionConfig.defaultSongSortRuleValue,
      ),
    [functionConfig.defaultSongSortRuleValue],
  );

  useEffect(() => {
    setFunctionConfig({
      ...defaultConfig.function,
      ...functionConfig,
    });
    setDownloadConfig({
      ...defaultConfig.download,
      ...downloadConfig,
    });
  }, []);

  useEffect(()=>{
    window.functionConfig = functionConfig;
    window.downloadConfig = downloadConfig;
  },[functionConfig,downloadConfig])

  return {
    downloadConfig,
    setDownloadConfig,
    functionConfig,
    setFunctionConfig,
    defaultSongSortRule,
  };
};
