import { Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useEffect } from "react";
import { getArtists } from "../../api";
import { Spin } from "antd";
import { Form } from "antd";
import { Select } from "antd";
import { useMemo } from "react";
import { Tag } from "antd";
import styles from "./index.module.scss";

function QuickUpload(props, ref) {
  const [visible, setVisible] = useState(false);
  const open = () => {
    reset();
    getSingerList();
    setVisible(true);
  };
  const close = () => setVisible(false);
  const reset = () => {
    setSingerList([]);
  };

  // 歌手列表
  const [singerList, setSingerList] = useState([]);
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
  const [loading, setLoading] = useState(false);
  // 获取歌手
  const getSingerList = async () => {
    try {
      setLoading(true);
      const res = await getArtists();
      setSingerList(res);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const [formRef] = Form.useForm();
  const handleOk = async () => {
    try {
      const values = await formRef.validateFields();
      console.log("values", values);
      const { singer } = values;
      console.log("singer", singer);
    } catch (error) {
      console.log("error", error);
    }
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
    reset,
  }));

  return (
    <Modal
      title="云盘快速上传"
      width={600}
      centered
      open={visible}
      onCancel={close}
      onOk={handleOk}
      okText="确认"
      cancelText="取消"
    >
      <div className={styles["quick-upload"]}>
        {loading ? (
          <Spin tip="正在加载中" />
        ) : (
          <Form form={formRef}>
            {/* 歌手 */}
            <Form.Item name="singer" label="歌手">
              <Select
                mode="multiple"
                placeholder="请选择歌手"
                allowClear
                labelInValue
                className={styles["select"]}
                filterOption={(input, option) =>
                  option.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={renderSingerList}
                getPopupContainer={(trigger) => trigger.parentNode}
              />
            </Form.Item>
          </Form>
        )}
      </div>
    </Modal>
  );
}

export default forwardRef(QuickUpload);
