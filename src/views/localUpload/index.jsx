import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const LocalUpload = forwardRef((props, ref) => {
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
      title="云盘本地上传"
      open={visible}
      onCancel={close}
      footer={null}
    >
      {/* 在这里添加云盘本地上传的具体内容 */}
    </Modal>
  );
});

export default LocalUpload;
