import copy from '@/utils/copy';
import { msgSuccess } from '@/utils/modal';
import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styles from './style.module.scss';
import TextOverflowShowTips from '../TextOverflowShowTips';
import classNames from 'classnames';

/**
 * 文本复制组件
 * @description 显示一段文本，并提供复制按钮，点击可复制到剪贴板
 * @param {Object} props - 组件属性
 * @param {string} props.text - 需要显示和复制的文本
 * @param {string} [props.className] - 自定义类名
 * @param {Object} [props.rest] - 其他传递给容器的属性
 * @example
 * <CopyText text="这是一段可以复制的文本" />
 */
export default function CopyText(props) {
  const { text, className, ...rest } = props;
  const handleCopy = () => {
    copy(text);
    msgSuccess('复制成功');
  };

  return (
    <div className={classNames(styles['copy-text'], className)} {...rest}>
      <TextOverflowShowTips
        text={text + ''}
        tooltipProps={{
          getPopupContainer: (node) => {
            return document.body;
          },
        }}
      />
      <Button
        type='link'
        icon={<CopyOutlined />}
        onClick={handleCopy}
        className={styles['copy-btn']}
      />
    </div>
  );
}

