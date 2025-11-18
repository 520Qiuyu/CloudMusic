import { useLocalStorageState } from 'ahooks';
import { defaultConfig } from '@/config';
import { useEffect } from 'react';

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

  return {
    downloadConfig,
    setDownloadConfig,
    functionConfig,
    setFunctionConfig,
  };
};
