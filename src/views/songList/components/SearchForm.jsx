import { Form, Input, Space } from "antd";
import React from "react";

export default function SearchForm({ onSearch }) {
  const [form] = Form.useForm();

  // 处理搜索
  const handleSearch = values => {
    const { name, artists, album } = values;
    onSearch({
      name: name ? name.split(/[,，]/).filter(Boolean) : [],
      artists: artists ? artists.split(/[,，]/).filter(Boolean) : [],
      album: album ? album.split(/[,，]/).filter(Boolean) : [],
    });
  };

  return (
    <Form
      form={form}
      onValuesChange={(_, values) => handleSearch(values)}
      style={{ marginBottom: 16 }}
    >
      <Space>
        <Form.Item
          name="name"
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="歌曲名称（多个用逗号分隔）"
            allowClear
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item
          name="artists"
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="歌手（多个用逗号分隔）"
            allowClear
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item
          name="album"
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="专辑（多个用逗号分隔）"
            allowClear
            style={{ width: 200 }}
          />
        </Form.Item>
      </Space>
    </Form>
  );
}