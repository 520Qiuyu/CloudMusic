import { getUserDetail } from '@/api';
import defaultAvatar from '@/assets/imgs/空头像.png';
import {
  Badge,
  Card,
  Descriptions,
  Image,
  Input,
  Spin,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

const { Text, Paragraph } = Typography;

/**
 * 用户信息卡片组件
 * @param {Object} props - 组件属性
 * @param {number} props.userId - 用户ID
 */
export default function UserCard(props) {
  const { value, onChange } = props;

  // 组件内部用户ID 受控
  const [userId, setUserId] = useState(value);
  useEffect(() => {
    if (!value) return;
    setUserId(value);
  }, [value]);
  const handleUserIdChange = (value) => {
    setUserId(value);
    onChange?.(value);
  };

  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);
  /** 获取用户信息 */
  const getUserInfo = async () => {
    try {
      if (!userId) return;
      setLoading(true);
      const res = await getUserDetail(userId);
      console.log('res', res);
      if (res.code === 200) {
        setUserInfo(res.profile);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('组件内部用户ID变化', userId);
    getUserInfo();
  }, [userId]);

  const {
    avatarUrl,
    nickname,
    vipType,
    authStatus,
    signature,
    description,
    follows,
    followeds,
    playlistCount,
    eventCount,
    backgroundUrl,
    gender,
    birthday,
    createTime,
    province,
    city,
    djStatus,
    followed,
    followMe,
    blacklist,
  } = userInfo || {};
  return (
    <Spin spinning={loading}>
      <Card
        styles={{
          body: {
            padding: 0,
          },
        }}>
        {/* 头部区域 包含头像、昵称、VIP、认证用户、签名、描述 */}
        <div className={styles['user-header-wrapper']}>
          {/* 背景图片 */}
          {backgroundUrl && (
            <img
              src={backgroundUrl}
              alt='背景图'
              className={styles['background-image']}
            />
          )}
          {/* 头像、昵称、VIP、认证用户、签名、描述 */}
          <div className={styles['user-header']}>
            <div className={styles['avatar-wrapper']}>
              <Badge
                count={vipType === 11 ? 'VIP' : 0}
                offset={[-10, 10]}
                style={{ backgroundColor: '#ff4d4f' }}>
                <Image
                  src={avatarUrl}
                  width={100}
                  height={100}
                  className={styles['avatar']}
                  fallback={defaultAvatar}
                />
              </Badge>
            </div>
            <div className={styles['user-basic-info']}>
              <div className={styles['nickname-row']}>
                <Text strong className={styles.nickname}>
                  {nickname}
                </Text>
                {authStatus === 1 && <Tag color='blue'>认证用户</Tag>}
              </div>
              <Paragraph
                ellipsis={{ rows: 2, expandable: false }}
                className={styles['signature']}>
                签名：{signature || '-'}
              </Paragraph>

              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                className={styles.description}>
                描述：{description || '-'}
              </Paragraph>
            </div>
          </div>
        </div>

        <div className={styles['user-stats']}>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>{follows || 0}</div>
            <div className={styles['stat-label']}>关注</div>
          </div>
          <div className={styles['stat-divider']}></div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>{followeds || 0}</div>
            <div className={styles['stat-label']}>粉丝</div>
          </div>
          <div className={styles['stat-divider']}></div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>{playlistCount || 0}</div>
            <div className={styles['stat-label']}>歌单</div>
          </div>
          <div className={styles['stat-divider']}></div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>{eventCount || 0}</div>
            <div className={styles['stat-label']}>动态</div>
          </div>
        </div>

        <Descriptions
          column={1}
          size='small'
          className={styles['descriptions']}
          labelStyle={
            {
              /*  width: 100, justifyContent: 'flex-end' */
            }
          }>
          <Descriptions.Item label='用户ID'>
            <Input
              value={userId}
              onChange={(e) => handleUserIdChange(e.target.value)}
              size='small'
              allowClear
              onPressEnter={(e) => handleUserIdChange(e.target.value)}
              style={{
                border: 'none',
              }}
              styles={{
                input: {
                  height: 'auto',
                },
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label='性别'>
            {getGenderText(gender)}
          </Descriptions.Item>
          {birthday && (
            <Descriptions.Item label='生日'>
              {formatBirthday(birthday)}
            </Descriptions.Item>
          )}
          {createTime && (
            <Descriptions.Item label='注册时间'>
              {formatDate(createTime)}
            </Descriptions.Item>
          )}
          {province && (
            <Descriptions.Item label='地区'>
              {city ? `城市: ${city}` : `省份: ${province}`}
            </Descriptions.Item>
          )}
          {djStatus === 1 && (
            <Descriptions.Item label='身份'>
              <Tag color='purple'>DJ</Tag>
            </Descriptions.Item>
          )}
          {followed && (
            <Descriptions.Item label='关注状态'>
              <Tag color='green'>已关注</Tag>
            </Descriptions.Item>
          )}
          {followMe && (
            <Descriptions.Item label='互相关注'>
              <Tag color='blue'>是</Tag>
            </Descriptions.Item>
          )}
          {blacklist && (
            <Descriptions.Item label='黑名单'>
              <Tag color='red'>已拉黑</Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </Spin>
  );
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  return dayjs(timestamp).format('YYYY-MM-DD');
};

// 格式化生日
const formatBirthday = (timestamp) => {
  if (!timestamp) return '-';
  return dayjs(timestamp).format('YYYY年MM月DD日');
};

// 获取性别文本
const getGenderText = (gender) => {
  const genderMap = { 0: '未知', 1: '男', 2: '女' };
  return genderMap[gender] || '未知';
};
