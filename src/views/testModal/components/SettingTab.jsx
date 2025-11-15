import { MyButton } from '@/components';
import GithubInfo from '@/views/githubInfo';
import { CheckOutlined, GithubOutlined } from '@ant-design/icons';
import { Descriptions, Input } from 'antd';
import { useRef } from 'react';

const { Item } = Descriptions;

/**
 * 设置相关测试组件
 */
const SettingTab = () => {
  const githubInfoRef = useRef();

  const handleCheckUpdate = () => {
    console.log('检查更新');
  };

  const handleOpenGithubInfo = () => {
    githubInfoRef.current?.open();
  };

  return (
    <>
      <Descriptions column={1} size='large'>
        {/* github */}
        <Item label='GitHub'>
          <MyButton
            icon={<GithubOutlined />}
            type='primary'
            onClick={handleOpenGithubInfo}>
            查看 GitHub 信息
          </MyButton>
        </Item>
        {/* 更新日志 */}
        <Item label='更新日志'>
          <Input />
        </Item>
        {/* 检查更新 */}
        <Item label='检查更新'>
          <MyButton
            icon={<CheckOutlined />}
            type='primary'
            onClick={handleCheckUpdate}>
            检查更新
          </MyButton>
        </Item>
      </Descriptions>
      <GithubInfo ref={githubInfoRef} />
    </>
  );
};

export default SettingTab;
