import React from "react";
import { Form, Select, Space, Button } from "antd";
import { uniqueArrayByKey } from "../../../utils";

const SearchForm = ({ onSearch, songList }) => {
  const [form] = Form.useForm();

  // 获取去重后的选项列表
  const getUniqueOptions = (key) => {
    const uniqueList = uniqueArrayByKey(
      songList.map((item) => ({
        ...item,
        name: item.simpleSong.name,
        singer: item.simpleSong.singer,
      })),
      key
    );
    return uniqueList.map((item) => ({
      label: item[key],
      value: item[key],
    }));
  };

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Form form={form} style={{ marginBottom: 16 }}>
      <Space wrap>
        <Form.Item name="name" style={{ marginBottom: 0, minWidth: 200 }}>
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="歌名"
            maxTagCount="responsive"
            options={getUniqueOptions("name")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item name="artist" style={{ marginBottom: 0, minWidth: 200 }}>
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="歌手"
            maxTagCount="responsive"
            options={getUniqueOptions("artist")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item name="album" style={{ marginBottom: 0, minWidth: 200 }}>
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="专辑"
            maxTagCount="responsive"
            options={getUniqueOptions("album")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Button type="primary" onClick={handleSearch}>
          搜索
        </Button>
        <Button onClick={handleReset}>重置</Button>
      </Space>
    </Form>
  );
};

export default SearchForm;
