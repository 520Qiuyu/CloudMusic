import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const CloudExport = forwardRef((props, ref) => {
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
      title="云盘导出"
      open={visible}
      onCancel={close}
      footer={null}
      centered
    >
      {/* 在这里添加云盘导出的具体内容 */}
    </Modal>
  );
});

export default CloudExport;
