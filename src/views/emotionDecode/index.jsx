import { MyButton } from '@/components';
import SongSelect from '@/components/SongSelect';
import UserSelect from '@/components/UserSelect';
import { usePlayMusic } from '@/hooks';
import { useVisible } from '@/hooks/useVisible';
import { downloadAsHTML } from '@/utils/download';
import { Col, Form, Modal, Row } from 'antd';
import { forwardRef } from 'react';
import SongCard from './components/SongCard';
import UserCard from './components/UserCard';
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
      },
    },
    ref,
  );

  const { getSongAllComments } = usePlayMusic();

  const [formRef] = Form.useForm();
  const songInfo = Form.useWatch('song', formRef);
  const handleEmotionDecode = async () => {
    try {
      await formRef.validateFields();
      const values = await formRef.getFieldsValue();
      console.log('values', values);
      const { userId, songId, user, song } = values;
      // 获取所有评论
      const comments = await getSongAllComments(songId);
      console.log('comments', comments);

      // 获取用户发送评论
      const userComments = comments.filter(
        (comment) => comment.user.userId === userId,
      );
      console.log('userComments', userComments);

      // 注入内容
      const content = template.replace(
        '// ## 注入内容',
        `
        window.mockUserData = ${JSON.stringify(user)};
        window.mockSongData = ${JSON.stringify(song)};
        window.mockCommentsData = ${JSON.stringify(comments)};
      `,
      );

      // 下载模板
      downloadAsHTML(content, `${user.nickname}-${song.name}`);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Modal
      title='情感解码'
      open={visible}
      onCancel={close}
      width={1000}
      footer={null}
      centered>
      {/* TODO: 实现情感解码功能 */}
      <Form form={formRef}>
        <Row style={{ marginBottom: 16 }} gutter={16}>
          <Col span={12}>
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
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              noStyle
              name='userId'
              rules={[{ required: true, message: '请选择用户' }]}>
              <UserCard />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              noStyle
              name='songId'
              rules={[{ required: true, message: '请选择歌曲' }]}>
              <SongCard />
            </Form.Item>
          </Col>
        </Row>

        <div className={styles['button-group']}>
          <MyButton type='primary' onClick={handleEmotionDecode} size='large'>
            开始解码
          </MyButton>
        </div>
      </Form>
    </Modal>
  );
});

export default EmotionDecode;
