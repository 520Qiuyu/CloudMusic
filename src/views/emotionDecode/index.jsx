import { MyButton } from '@/components';
import SongSelect from '@/components/SongSelect';
import UserSelect from '@/components/UserSelect';
import { usePlayMusic } from '@/hooks';
import { useVisible } from '@/hooks/useVisible';
import { downloadAsHTML } from '@/utils/download';
import { msgError } from '@/utils/modal';
import { Col, DatePicker, Form, InputNumber, Modal, Row } from 'antd';
import { forwardRef, useRef, useState } from 'react';
import SongCard from './components/SongCard';
import UserCard from './components/UserCard';
import UserComments from './components/UserComments';
import styles from './index.module.scss';
import template from './template/index.html?raw';

/**
 * 情感解码组件
 */
const EmotionDecode = forwardRef((props, ref) => {
  const { visible, close } = useVisible(
    {
      onOpen() {},
      onReset() {
        formRef.resetFields();
        setUserComments([]);
      },
    },
    ref,
  );

  const { getSongAllComments } = usePlayMusic();

  const [userComments, setUserComments] = useState([]);

  const [formRef] = Form.useForm();
  const stopFn = useRef(null);
  const handleEmotionDecode = async () => {
    try {
      await formRef.validateFields();
      const values = await formRef.getFieldsValue();
      console.log('values', values);
      const { userId, songId, user, song, timeRange, wait } = values;

      const mapRule = (comment) => {
        const {
          commentId,
          content,
          ipLocation,
          replyCount,
          likedCount,
          liked,
          time,
          threadId,
          timeStr,
          user,
        } = comment;
        return {
          commentId,
          content,
          ipLocation,
          replyCount,
          likedCount,
          liked,
          time,
          threadId,
          timeStr,
          user: {
            userId: user.userId,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            vipType: user.vipType,
            authStatus: user.authStatus,
            followed: user.followed,
            isHug: user.isHug,
          },
        };
      };

      const { allComments, hotComments } = await getSongAllComments(songId, {
        timeRange: timeRange?.length
          ? {
              start: timeRange[0],
              end: timeRange[1],
            }
          : undefined,
        wait: wait ? Number(wait) : 0,
        onStop: (stop) => {
          stopFn.current = stop;
        },
        mapRule,
        onChange: (progress) => {
          const { comments } = progress;
          const filteredComments = comments.filter(
            (comment) => comment.user.userId === userId,
          );
          setUserComments((prev) => [...prev, ...filteredComments]);
        },
      });

      // 获取所有评论
      const comments = allComments?.map(mapRule);
      // 获取热评
      const hComments = hotComments?.map(mapRule);
      // 获取用户发送评论
      const finalUserComments = comments.filter(
        (comment) => comment.user.userId === userId,
      );

      // 更新最终的用户评论列表
      setUserComments(finalUserComments);

      console.log('comments', comments);
      console.log('hotComments', hotComments);

      console.log(
        `${user.nickname}-${song.name}-userComments`,
        JSON.stringify(finalUserComments, null, 2),
      );

      // 注入内容
      const content = template.replace(
        '// ## 注入内容',
        `
        window.mockUserData = ${JSON.stringify(user)};
        window.mockSongData = ${JSON.stringify(song)};
        window.mockCommentsData = ${JSON.stringify(comments)};
        window.mockHotCommentsData = ${JSON.stringify(hComments)};
      `,
      );

      // 下载模板
      downloadAsHTML(content, `${user.nickname}-${song.name}`);
    } catch (error) {
      console.log('error', error);
      msgError(error.message || error.msg || '情感解码失败');
    }
  };

  const handleStopGetComments = () => {
    stopFn.current?.();
  };

  return (
    <Modal
      title='情感解码'
      open={visible}
      onCancel={close}
      width={1000}
      styles={{
        body: {
          maxHeight: '75vh',
          overflowY: 'auto',
          padding: '0 16px',
        },
      }}
      footer={null}
      centered>
      {/* TODO: 实现情感解码功能 */}
      <Form form={formRef}>
        <Row style={{ marginBottom: 16 }} gutter={16} sm={0}>
          <Col span={24} lg={12}>
            <Form.Item label='搜索用户' name='user'>
              <UserSelect
                onChange={(value) => {
                  formRef.setFieldsValue({
                    userId: value?.userId,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} lg={12}>
            <Form.Item label='搜索歌曲' name='song'>
              <SongSelect
                onChange={(value) => {
                  formRef.setFieldsValue({
                    songId: value?.id,
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24} lg={12}>
            <Form.Item label='时间范围' name='timeRange'>
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24} lg={12}>
            <Form.Item label='等待时间' name='wait'>
              <InputNumber
                placeholder='请输入等待时间(毫秒)'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24} lg={12} style={{ marginBottom: 24 }}>
            <Form.Item
              noStyle
              name='userId'
              rules={[{ required: true, message: '请选择用户' }]}>
              <UserCard />
            </Form.Item>
          </Col>
          <Col span={24} lg={12}>
            <Form.Item
              noStyle
              name='songId'
              rules={[{ required: true, message: '请选择歌曲' }]}>
              <SongCard
                onInfoChange={(value) => {
                  formRef.setFieldsValue({
                    song: value,
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 用户评论展示 */}
        <UserComments comments={userComments} />

        <div className={styles['button-group']}>
          <MyButton type='primary' onClick={handleEmotionDecode} size='large'>
            开始解码
          </MyButton>
          <MyButton type='primary' onClick={handleStopGetComments} size='large'>
            停止获取
          </MyButton>
        </div>
      </Form>
    </Modal>
  );
});

export default EmotionDecode;
