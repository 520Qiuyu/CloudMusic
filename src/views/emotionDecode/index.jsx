import { useVisible } from '@/hooks/useVisible';
import { Modal } from 'antd';
import { forwardRef } from 'react';

/**
 * 情感解码组件
 */
const EmotionDecode = forwardRef((props, ref) => {
  const { visible, close } = useVisible({}, ref);

  return (
    <Modal
      title='情感解码'
      open={visible}
      onCancel={close}
      width={800}
      footer={null}
      centered>
      {/* TODO: 实现情感解码功能 */}
    </Modal>
  );
});

export default EmotionDecode;

