import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const MatchCorrect = forwardRef((props, ref) => {
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
      title="云盘匹配纠正"
      open={visible}
      onCancel={close}
      footer={null}
    >
      {/* 在这里添加云盘匹配纠正的具体内容 */}
    </Modal>
  );
});

export default MatchCorrect;
