import { useVisible } from "@/hooks/useVisible";
import { GithubOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Typography } from "antd";
import { forwardRef, useEffect, useState } from "react";
import styles from "./index.module.scss";

// GitHub API请求函数
const fetchGithubData = async () => {
  try {
    const owner = '520Qiuyu';
    const repo = 'CloudMusic';
    const [userResponse, repoResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${owner}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': 'token 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'
        }
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': 'token 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'
        }
      })
    ]);
    
    if (!userResponse.ok || !repoResponse.ok) {
      throw new Error('API请求失败');
    }
    
    const userData = await userResponse.json();
    const repoData = await repoResponse.json();
    
    return {
      avatar_url: userData.avatar_url,
      stargazers_count: repoData.stargazers_count
    };
  } catch (error) {
    console.error('获取GitHub数据失败:', error);
    return {
      avatar_url: '',
      stargazers_count: 0
    };
  }
};

const { Title, Text } = Typography;

const GithubInfo = forwardRef((props, ref) => {
  const { visible, open, close } = useVisible({}, ref);
  const [starCount, setStarCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    // 获取GitHub数据
    fetchGithubData().then(data => {
      setStarCount(data.stargazers_count);
      setAvatarUrl(data.avatar_url);
    });
  }, []);

  // GitHub个人信息
  const githubInfo = {
    avatar: avatarUrl || "https://avatars.githubusercontent.com/u/520Qiuyu",
    username: "520Qiuyu",
    bio: "网易云音乐快速上传助手",
    profileUrl: "https://github.com/520Qiuyu/CloudMusic",
    starCount: `⭐ ${starCount}`,
    features: [
      "🚀 云盘快速上传：支持同时选择多个歌手的音乐资源文件按专辑顺序进行上传",
      "📊 进度显示：实时展示上传进度和状态",
      "🔍 智能匹配：自动匹配歌曲信息，包括歌手、专辑等",
      "🎵 文件管理：支持查看已上传文件列表",
      "🔄 并发控制：智能控制上传并发数，避免服务器压力",
      "🎵 云盘音乐管理：支持手动将添加的歌曲添加到歌单中",
      "🔄 偷取资源：支持从其他用户的云盘偷取资源，获得导入JSON文件",
      "🎯 手动匹配纠正：支持手动匹配纠正歌曲信息",
      "📤 云盘本地上传：支持将本地音乐文件上传",
      "📥 云盘JSON文件导入：支持通过JSON文件（偷取资源的JSON）导入到云盘，实现云盘音乐的批量导入",
    ],
  };

  const handleProfileClick = () => {
    window.open(githubInfo.profileUrl, "_blank");
  };

  return (
    <Modal
      title="GitHub 信息"
      open={visible}
      onCancel={close}
      footer={null}
      centered
      width={700}
      zIndex={99999}
    >
      <div className={styles.githubContainer}>
        <div className={styles.userInfo}>
          <Avatar
            size={100}
            src={githubInfo.avatar}
            icon={<GithubOutlined />}
          />
          <div>
            <Title
              level={4}
              className={styles.username}
            >
              {githubInfo.username}
            </Title>
            <Text className={styles.starCount}>{githubInfo.starCount}</Text>
          </div>
        </div>
        <Title
          level={5}
          className={styles.bio}
        >
          {githubInfo.bio}
        </Title>

        <div className={styles.features}>
          <Title level={5}>✨ 功能特性</Title>
          <ul className={styles.featureList}>
            {githubInfo.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <Button
          type="primary"
          icon={<GithubOutlined />}
          onClick={handleProfileClick}
          className={styles.profileButton}
        >
          查看 GitHub 主页
        </Button>
      </div>
    </Modal>
  );
});

export default GithubInfo;
