import { Avatar, Card, Tag, Typography } from 'antd';
import styles from './index.module.scss';

/**
 * 用户评论展示组件
 * @param {Object} props - 组件属性
 * @param {Array} props.comments - 评论列表
 * @example
 * <UserComments comments={userComments} />
 */
export default function UserComments(props) {
  const { comments = [] } = props;

  if (!comments || comments.length === 0) {
    return null;
  }

  const displayComments = comments.slice(0, 15);

  return (
    <div className={styles['comments-section']}>
      <Card
        title={
          <div className={styles['comments-header']}>
            <span>用户评论</span>
            <Tag color='blue' className={styles['total-tag']}>
              共 {comments.length} 条
            </Tag>
          </div>
        }
        className={styles['comments-card']}>
        <div className={styles['comments-list']}>
          {displayComments.map((comment, index) => (
            <div
              key={comment.commentId || index}
              className={styles['comment-item']}>
              <div className={styles['comment-header']}>
                <Avatar
                  src={comment.user?.avatarUrl}
                  size={40}
                  className={styles['comment-avatar']}>
                  {comment.user?.nickname?.[0] || 'U'}
                </Avatar>
                <div className={styles['comment-user-info']}>
                  <div className={styles['comment-user-name']}>
                    {comment.user?.nickname || '未知用户'}
                    {comment.user?.vipType > 0 && (
                      <Tag
                        color='red'
                        size='small'
                        className={styles['vip-tag']}>
                        VIP{comment.user.vipType}
                      </Tag>
                    )}
                  </div>
                  <div className={styles['comment-meta']}>
                    <span>{comment.timeStr || '-'}</span>
                    {comment.ipLocation?.location && (
                      <Tag size='small' className={styles['location-tag']}>
                        📍 {comment.ipLocation.location}
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
              <Typography.Paragraph
                ellipsis={{ rows: 3, expandable: true }}
                className={styles['comment-content']}>
                {comment.content || '-'}
              </Typography.Paragraph>
              <div className={styles['comment-footer']}>
                {comment.likedCount > 0 && (
                  <Tag color='orange' className={styles['liked-tag']}>
                    👍 {comment.likedCount}
                  </Tag>
                )}
                {comment.replyCount > 0 && (
                  <Tag className={styles['reply-tag']}>
                    💬 {comment.replyCount} 条回复
                  </Tag>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
