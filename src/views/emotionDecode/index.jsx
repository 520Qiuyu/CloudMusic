import { MyButton } from '@/components';
import SongSelect from '@/components/SongSelect';
import UserSelect from '@/components/UserSelect';
import { useVisible } from '@/hooks/useVisible';
import { Col, Form, Input, Modal, Row } from 'antd';
import { forwardRef } from 'react';
import styles from './index.module.scss';
import { usePlayMusic } from '@/hooks';

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
  const handleEmotionDecode = async () => {
    try {
      await formRef.validateFields();
      const values = await formRef.getFieldsValue();
      console.log('values', values);
      const { userId, songId } = values;
      // 获取所有评论
      const comments = await getSongAllComments(songId);
      console.log('comments', comments);

      // 获取用户发送评论
      const userComments = comments.filter(
        (comment) => comment.user.userId === userId,
      );
      console.log('userComments', userComments);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Modal
      title='情感解码'
      open={visible}
      onCancel={close}
      width={800}
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
        <Form.Item
          label='用户ID'
          name='userId'
          rules={[{ required: true, message: '请选择用户' }]}>
          <Input placeholder='请输入用户ID' />
        </Form.Item>
        <Form.Item label='歌曲ID' name='songId'>
          <Input placeholder='请输入歌曲ID' />
        </Form.Item>

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
