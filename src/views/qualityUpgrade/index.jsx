import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal } from 'antd';

const QualityUpgrade = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const reset = () => {};

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  return (
    <Modal
      title='云盘音质提升'
      open={visible}
      onCancel={close}
      width={800}
      footer={null}
    >
      {/* 在这里添加云盘音质提升的具体内容 */}
    </Modal>
  );
});

export default QualityUpgrade;
