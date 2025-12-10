import {
  getUserAllHistoryComment,
  getUserDetail,
  getUserSubCount,
} from '@/api';
import { MyButton } from '@/components';
import { msgError, msgSuccess } from '@/utils/modal';
import { CommentOutlined, DatabaseOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Form,
  Input,
  List,
  Pagination,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const { Text } = Typography;

/**
 * 资源类型映射
 */
const RESOURCE_TYPE_MAP = {
  0: '歌曲',
  1: 'MV',
  2: '歌单',
  3: '专辑',
  4: '电台',
  5: '视频',
  6: '动态',
};

/**
 * 用户相关测试组件
 */
const UserTab = () => {
  const [form] = Form.useForm();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  /**
   * 获取用户历史评论
   */
  const handleGetUserHistoryComment = async () => {
    try {
      const values = await form.validateFields();
      const { uid } = values;

      if (!uid) {
        return msgError('请输入用户ID');
      }

      setLoading(true);
      const commentList = await getUserAllHistoryComment(uid);
      setComments(commentList);
      setPagination({
        ...pagination,
        total: commentList.length,
      });
      msgSuccess(`获取成功，共 ${commentList.length} 条评论`);
      console.log('用户历史评论:', commentList);
    } catch (error) {
      console.error('获取用户历史评论失败:', error);
      msgError(error.message || '获取用户历史评论失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取用户详情
   */
  const handleGetUserDetail = async () => {
    try {
      const values = await form.validateFields();
      const { uid } = values;
      if (!uid) {
        return msgError('请输入用户ID');
      }
      const userDetail = await getUserDetail(uid);
      console.log('userDetail', userDetail);
    } catch (error) {
      console.error('获取用户详情失败:', error);
      msgError(error.message || '获取用户详情失败');
    }
  };

  /**
   * 获取用户云盘数据
   */
  const handleGetUserSubCount = async () => {
    try {
      const values = await form.validateFields();
      const { uid } = values;
      if (!uid) {
        return msgError('请输入用户ID');
      }
      const userSubCount = await getUserSubCount(uid);
      console.log('userSubCount', userSubCount);
      msgSuccess('获取用户云盘数据成功');
    } catch (error) {
      console.error('获取用户云盘数据失败:', error);
      msgError(error.message || '获取用户云盘数据失败');
    }
  };

  /**
   * 格式化时间
   */
  const formatTime = (time) => {
    if (!time) return '-';
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  };

  /**
   * 解析资源信息
   */
  const parseResourceInfo = (resourceInfo, threadId) => {
    if (
      resourceInfo &&
      resourceInfo !== 'null' &&
      typeof resourceInfo === 'string'
    ) {
      try {
        const parsed = JSON.parse(resourceInfo);
        return parsed;
      } catch {
        return null;
      }
    }
    if (threadId) {
      // 从 threadId 解析：R_SO_4_2609444176 -> 歌曲ID: 2609444176
      const match = threadId.match(/R_(\w+)_(\d+)_(\d+)/);
      if (match) {
        return {
          type: match[1],
          typeId: match[2],
          id: match[3],
        };
      }
    }
    return null;
  };

  /**
   * 获取资源类型名称
   */
  const getResourceTypeName = (resourceType) => {
    return RESOURCE_TYPE_MAP[resourceType] || `类型${resourceType}`;
  };

  /**
   * 处理分页变化
   */
  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    });
  };

  /**
   * 获取当前页数据
   */
  const getCurrentPageData = () => {
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return comments.slice(start, end);
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }} size='large'>
      <Form form={form} layout='inline' initialValues={{ uid: undefined }}>
        <Form.Item
          label='用户ID'
          name='uid'
          rules={[{ required: true, message: '请输入用户ID' }]}>
          <Input placeholder='请输入用户ID' style={{ width: 200 }} />
        </Form.Item>

        <Form.Item>
          <MyButton
            type='primary'
            icon={<CommentOutlined />}
            onClick={handleGetUserHistoryComment}
            loading={loading}>
            获取历史评论
          </MyButton>
        </Form.Item>

        <Form.Item>
          <MyButton
            type='primary'
            icon={<UserOutlined />}
            onClick={handleGetUserDetail}
            loading={loading}>
            获取用户详情
          </MyButton>
        </Form.Item>

        <Form.Item>
          <MyButton
            type='primary'
            icon={<DatabaseOutlined />}
            onClick={handleGetUserSubCount}
            loading={loading}>
            获取用户云盘数据
          </MyButton>
        </Form.Item>
      </Form>

      {comments.length > 0 && (
        <>
          <List
            loading={loading}
            dataSource={getCurrentPageData()}
            renderItem={(item) => {
              const resourceInfo = parseResourceInfo(
                item.resourceInfo,
                item.threadId,
              );
              const hasReply = item.beRepliedContent && item.beRepliedUser;

              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.user?.avatarUrl}
                        icon={<UserOutlined />}
                        size={40}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{item.user?.nickname || '未知用户'}</Text>
                        {item.user?.vipType > 0 && (
                          <Tag color='gold'>VIP{item.user.vipType}</Tag>
                        )}
                        {item.likedCount > 0 && (
                          <Tag color='red'>👍 {item.likedCount}</Tag>
                        )}
                        {item.liked && <Tag color='blue'>已点赞</Tag>}
                        {hasReply && <Tag color='green'>回复</Tag>}
                      </Space>
                    }
                    description={
                      <Space
                        direction='vertical'
                        size='small'
                        style={{ width: '100%' }}>
                        <Text style={{ whiteSpace: 'pre-wrap' }}>
                          {item.content || '-'}
                        </Text>
                        <Space size='small' wrap>
                          <Text type='secondary' style={{ fontSize: '12px' }}>
                            时间: {formatTime(item.time)}
                          </Text>
                          {item.resourceType !== undefined && (
                            <Tag size='small'>
                              {getResourceTypeName(item.resourceType)}
                            </Tag>
                          )}
                          {resourceInfo && (
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                              资源ID: {resourceInfo.id || '-'}
                            </Text>
                          )}
                          {item.commentId && (
                            <Text
                              copyable
                              style={{ fontSize: '12px' }}
                              type='secondary'>
                              评论ID: {item.commentId}
                            </Text>
                          )}
                          {item.threadId && (
                            <Text
                              copyable
                              style={{ fontSize: '12px' }}
                              type='secondary'>
                              线程ID: {item.threadId}
                            </Text>
                          )}
                        </Space>
                        {hasReply && (
                          <div
                            style={{
                              padding: '8px',
                              background: '#f5f5f5',
                              borderRadius: '4px',
                              marginTop: '8px',
                            }}>
                            <Space direction='vertical' size='small'>
                              <Text strong style={{ fontSize: '12px' }}>
                                @{item.beRepliedUser?.nickname || '未知用户'}:
                              </Text>
                              <Text style={{ fontSize: '12px' }}>
                                {item.beRepliedContent}
                              </Text>
                            </Space>
                          </div>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />

          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条评论`}
            onChange={handlePageChange}
            onShowSizeChange={(page, pageSize) => {
              setPagination({
                ...pagination,
                current: 1,
                pageSize,
              });
            }}
          />
        </>
      )}
    </Space>
  );
};

export default UserTab;
