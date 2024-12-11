import React from "react";
import { useMemo } from "react";
import { Form, Select, Spin, Tag, Button } from "antd";
import styles from "../index.module.scss";

export default function SingerChoose({ singerList, onChoose, loading }) {
  /** 渲染歌手列表 */
  const renderSingerList = useMemo(() => {
    return singerList.map((item) => {
      const { id, name, count, size, sizeDesc } = item;
      return {
        ...item,
        label: (
          <div className={styles["option-label"]}>
            <span className={styles["singer-name"]}>{name}</span>
            <div className={styles["tag-group"]}>
              <Tag color="blue" className={styles["tag"]}>
                {count}首
              </Tag>
              <Tag color="green" className={styles["tag"]}>
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
  return (
    <div className={styles["singer-choose"]}>
      {loading ? (
        <Spin tip="正在加载中" />
      ) : (
        <Form
          form={formRef}
          onFinish={handleChoose}
          className={styles["singer-choose-form"]}
        >
          {/* 歌手 */}
          <Form.Item name="singer" label="歌手">
            <Select
              mode="multiple"
              placeholder="请选择歌手"
              allowClear
              className={styles["select"]}
              filterOption={(input, option) =>
                option.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              options={renderSingerList}
              getPopupContainer={(trigger) => trigger.parentNode}
            />
          </Form.Item>

          {/* 按钮 */}
          <Form.Item>
            <div className={styles["btn-group"]}>
              <Button type="primary" htmlType="submit">
                选择
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
