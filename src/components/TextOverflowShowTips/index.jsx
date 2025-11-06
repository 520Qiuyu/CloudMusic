import { Tooltip } from 'antd';
import classNames from 'classnames';
import { useMemo, useRef } from 'react';
import { useSize } from 'ahooks';
import styles from './index.module.scss';

/**
 * 文本溢出显示提示组件
 * @param {Object} props - 组件属性
 * @param {string} props.text - 要显示的文本
 * @param {Object} [props.tooltipProps] - Tooltip 组件的属性
 * @param {string} [props.className] - 自定义类名
 * @param {Object} [props.restProps] - 其他传递给容器的属性
 * @example
 * <TextOverflowShowTips text="这是一段很长的文本" />
 */
export default function TextOverflowShowTips({
  text,
  tooltipProps,
  className,
  ...restProps
}) {
  /** 容器元素的 ref */
  const containerRef = useRef(null);
  /** 容器元素的宽度 */
  const { width: containerWidth } = useSize(containerRef) || {};
  /** 文本是否超出容器 */
  const isTooLong = useMemo(() => {
    if (containerWidth) {
      const textWidth = getTextWidth(text);
      return containerWidth < textWidth;
    }
    return false;
  }, [text, containerWidth]);

  const containerStyle = {
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return isTooLong ? (
    <Tooltip title={text} {...tooltipProps}>
      <div
        {...restProps}
        className={classNames(styles['text-overflow-show-tips-container'], className)}>
        <div ref={containerRef} style={containerStyle}>
          {text}
        </div>
      </div>
    </Tooltip>
  ) : (
    <div ref={containerRef} style={containerStyle} {...restProps} className={className}>
      {text}
    </div>
  );
}

/**
 * 获取文字渲染长度
 * @param {string} text - 文本内容
 * @param {string} [font='14px Arial'] - 字体样式
 * @returns {number} 文本宽度（像素）
 * @example
 * const width = getTextWidth('Hello World');
 */
export function getTextWidth(text, font = '14px Arial') {
  const span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.whiteSpace = 'nowrap';
  span.style.font = font;
  span.style.position = 'absolute';
  span.style.top = '-9999px';
  span.style.left = '-9999px';
  span.innerText = text;
  document.body.appendChild(span);
  const width = span.offsetWidth;
  document.body.removeChild(span);
  return width;
}

