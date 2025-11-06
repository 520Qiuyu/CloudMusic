import { useVisible } from '@/hooks';
import { Modal } from 'antd';
import { forwardRef } from 'react';

/**
 * 专辑列表弹窗组件
 * @description 用于显示歌手的专辑列表
 */
const AlbumListModal = forwardRef((props, ref) => {
  const { visible, open, close } = useVisible({}, ref);

  return (
    <Modal
      title='专辑列表'
      open={visible}
      onCancel={close}
      width={1200}
      centered
      footer={null}>
      {/* 专辑列表内容 */}
      <div>专辑列表内容</div>
    </Modal>
  );
});

export default AlbumListModal;

