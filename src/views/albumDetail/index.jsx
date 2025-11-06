import { useVisible } from '@/hooks';
import { Modal } from 'antd';
import { forwardRef } from 'react';

/**
 * 专辑详情弹窗组件
 * @description 用于显示专辑详情信息
 */
const AlbumDetail = forwardRef((props, ref) => {
  const { visible, open, close } = useVisible({}, ref);

  return (
    <Modal
      title='专辑详情'
      open={visible}
      onCancel={close}
      width={1200}
      centered
      footer={null}>
      {/* 专辑详情内容 */}
      <div>专辑详情内容</div>
    </Modal>
  );
});

export default AlbumDetail;

