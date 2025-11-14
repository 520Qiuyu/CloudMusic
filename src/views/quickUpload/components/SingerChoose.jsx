import { useGetSingerList } from '@/hooks';
import { Button, Form, Select, Spin, Tag } from 'antd';
import { useMemo, useState } from 'react';
import styles from '../index.module.scss';

export default function SingerChoose({ defaultSingerList, onChoose }) {
  const { singerList, loading } = useGetSingerList();

  /** 渲染歌手列表 */
  const renderSingerList = useMemo(() => {
    return singerList.map((item) => {
      const { id, name, count, size, sizeDesc } = item;
      return {
        ...item,
        label: (
          <div className={styles['option-label']}>
            <span className={styles['singer-name']}>{name}</span>
            <div className={styles['tag-group']}>
              <Tag color='blue' className={styles['tag']}>
                {count}首
              </Tag>
              <Tag color='green' className={styles['tag']}>
                {sizeDesc}
              </Tag>
            </div>
          </div>
        ),
        value: id,
      };
    });
  }, [singerList]);

  /** 表单 */
  const [formRef] = Form.useForm();
  /** 选择事件 */
  const handleChoose = (values) => {
    const { singer } = values;
    onChoose([...singer]);
  };

  const [quickImportLoading, setQuickImportLoading] = useState(false);
  const handleQuickImport = async () => {
    try {
      setQuickImportLoading(true);
      const values = await formRef.getFieldsValue();
      const { singer } = values;
      console.log('singer', singer);
    } catch (error) {
      console.log('error', error);
    } finally {
      setQuickImportLoading(false);
    }
  };
  return (
    <div className={styles['singer-choose']}>
      {loading ? (
        <Spin tip='正在加载中' />
      ) : (
        <Form
          form={formRef}
          onFinish={handleChoose}
          className={styles['singer-choose-form']}
          initialValues={{ singer: defaultSingerList }}>
          {/* 歌手 */}
          <Form.Item name='singer' label='歌手'>
            <Select
              mode='multiple'
              placeholder='请选择歌手'
              allowClear
              className={styles['select']}
              filterOption={(input, option) =>
                option.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              options={renderSingerList}
              getPopupContainer={(trigger) => trigger.parentNode}
            />
          </Form.Item>

          {/* 按钮 */}
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const singer = getFieldValue('singer') || [];
              return (
                <div
                  className={styles['btn-group']}
                  style={{ marginTop: 'auto' }}>
                  <Button
                    type='primary'
                    onClick={handleQuickImport}
                    loading={quickImportLoading}
                    disabled={!singer.length}>
                    一键导入
                  </Button>
                  <Button
                    type='primary'
                    htmlType='submit'
                    disabled={!singer.length}>
                    选择
                  </Button>
                </div>
              );
            }}
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
