import { useVisible } from '@/hooks/useVisible';
import {
  EyeOutlined,
  ForkOutlined,
  GithubOutlined,
  LinkOutlined,
  StarOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Image,
  Modal,
  Space,
  Spin,
  Typography,
} from 'antd';
import { forwardRef, useEffect, useState } from 'react';

const { Link, Text } = Typography;

// GitHub 仓库信息配置
const GITHUB_CONFIG = {
  owner: '520Qiuyu',
  repo: 'CloudMusic',
  homepage: 'https://github.com/520Qiuyu/CloudMusic',
  authorUrl: 'https://github.com/520Qiuyu',
  scriptUrl:
    'https://raw.githubusercontent.com/520Qiuyu/CloudMusic/main/dist/cloudmusic.user.js',
};

/**
 * GitHub 信息组件
 */
const GithubInfo = forwardRef((props, ref) => {
  const { visible, close } = useVisible({}, ref);
  const [repoInfo, setRepoInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 获取 GitHub 仓库信息
  const fetchRepoInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`,
      );
      if (response.ok) {
        const data = await response.json();
        setRepoInfo({
          stars: data.stargazers_count || 0,
          forks: data.forks_count || 0,
          watchers: data.watchers_count || 0,
          description: data.description || '',
          language: data.language || '',
          updatedAt: data.updated_at || '',
          createdAt: data.created_at || '',
          openIssues: data.open_issues_count || 0,
          license: data.license?.name || '无',
          defaultBranch: data.default_branch || 'main',
          avatarUrl: data.owner?.avatar_url || '',
          authorName: data.owner?.login || GITHUB_CONFIG.owner,
        });
      }
    } catch (error) {
      console.error('获取 GitHub 信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRepoInfo();
    }
  }, [visible]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      title={
        <Space>
          <GithubOutlined />
          <span>GitHub 信息</span>
        </Space>
      }
      open={visible}
      onCancel={close}
      footer={null}
      centered
      width={700}
      zIndex={99999}>
      <Spin spinning={loading}>
        <Descriptions
          column={1}
          bordered
          size='small'
          labelStyle={{ width: 120 }}>
          <Descriptions.Item label='项目主页'>
            <Space>
              <Link
                href={GITHUB_CONFIG.homepage}
                target='_blank'
                rel='noopener noreferrer'>
                <LinkOutlined /> {GITHUB_CONFIG.homepage}
              </Link>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label='作者主页'>
            <Space>
              {repoInfo?.avatarUrl && (
                <Image
                  src={repoInfo.avatarUrl}
                  alt={repoInfo.authorName || '作者头像'}
                  width={60}
                  height={60}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                />
              )}
              <Link
                href={GITHUB_CONFIG.authorUrl}
                target='_blank'
                rel='noopener noreferrer'>
                <GithubOutlined /> {GITHUB_CONFIG.authorUrl}
              </Link>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label='项目描述'>
            <Text>{repoInfo?.description || '暂无描述'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label='统计信息'>
            <Space size='large'>
              <Space>
                <StarOutlined style={{ color: '#faad14' }} />
                <Text strong>{repoInfo?.stars || 0}</Text>
                <Text type='secondary'>Stars</Text>
              </Space>
              <Space>
                <ForkOutlined style={{ color: '#1890ff' }} />
                <Text strong>{repoInfo?.forks || 0}</Text>
                <Text type='secondary'>Forks</Text>
              </Space>
              <Space>
                <EyeOutlined style={{ color: '#52c41a' }} />
                <Text strong>{repoInfo?.watchers || 0}</Text>
                <Text type='secondary'>Watchers</Text>
              </Space>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label='主要语言'>
            <Text>{repoInfo?.language || '未知'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label='默认分支'>
            <Text code>{repoInfo?.defaultBranch || 'main'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label='许可证'>
            <Text>{repoInfo?.license || '无'}</Text>
          </Descriptions.Item>

          <Descriptions.Item label='开放 Issues'>
            <Text>{repoInfo?.openIssues || 0}</Text>
          </Descriptions.Item>

          <Descriptions.Item label='创建时间'>
            <Text>{formatDate(repoInfo?.createdAt)}</Text>
          </Descriptions.Item>

          <Descriptions.Item label='更新时间'>
            <Text>{formatDate(repoInfo?.updatedAt)}</Text>
          </Descriptions.Item>

          <Descriptions.Item label='操作'>
            <Space>
              <Button
                type='primary'
                icon={<GithubOutlined />}
                href={GITHUB_CONFIG.homepage}
                target='_blank'
                rel='noopener noreferrer'>
                访问仓库
              </Button>
              <Button
                icon={<StarOutlined />}
                href={`${GITHUB_CONFIG.homepage}/stargazers`}
                target='_blank'
                rel='noopener noreferrer'>
                查看 Stars
              </Button>
              <Button
                type='primary'
                icon={<UploadOutlined />}
                href={GITHUB_CONFIG.scriptUrl}
                target='_blank'
                rel='noopener noreferrer'>
                更新脚本
              </Button>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
});

export default GithubInfo;
