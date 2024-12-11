import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const VipSongB = forwardRef((props, ref) => {
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
      title="网页VIP歌曲B"
      open={visible}
      onCancel={close}
      width={800}
      footer={null}
    >
      {/* 在这里添加VIP歌曲B的具体内容 */}
    </Modal>
  );
});

export default VipSongB;
