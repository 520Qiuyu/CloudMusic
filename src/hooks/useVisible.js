import { useState, useRef, useImperativeHandle } from 'react';

export const useVisible = (props = {}, ref) => {
  const {
    onOpen = NOOP,
    onClose = NOOP,
    onReset = NOOP,
    resetOnOpen = true,
    resetOnClose = false,
  } = props;
  
  const [visible, setVisible] = useState(false);
  const resolve = useRef();
  const reject = useRef();

  const open = (value) => {
    resetOnOpen && reset();
    setVisible(true);
    onOpen(value);
  };

  const close = () => {
    resetOnClose && reset();
    setVisible(false);
    onClose();
  };

  const reset = () => {
    setVisible(false);
    onReset();
  };

  const submit = () => {
    return new Promise((_resolve, _reject) => {
      resolve.current = _resolve;
      reject.current = _reject;
    });
  };

  ref &&
    useImperativeHandle(ref, () => ({
      open,
      close,
      reset,
      submit,
      resolve: resolve.current,
      reject: reject.current,
    }));

  return {
    visible,
    open,
    close,
    reset,
    submit,
    resolve: resolve.current,
    reject: reject.current,
  };
};

const NOOP = () => {}; 