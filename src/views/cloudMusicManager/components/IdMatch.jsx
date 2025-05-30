import { matchCloudSong } from "@/api";
import { msgSuccess } from "@/utils/modal";
import { Button, Input } from "antd";
import { Tag } from "antd";
import { useState } from "react";

const IdMatch = ({ data, onUpdate }) => {
  const { matchType, songId } = data;
  const isMatched = matchType === "matched";

  const [value, setValue] = useState(songId);
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await matchCloudSong(songId, value);
      console.log("res", res);
      if (res.code === 200) {
        msgSuccess("更新成功");
        onUpdate?.();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Tag color={isMatched ? "green" : "red"}>{isMatched ? "已匹配" : "未匹配"}</Tag>
      <Input
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
        size="small"
        onKeyDown={e => {
          if (e.key === "Enter") {
            handleUpdate();
          }
        }}
        style={{ flex: 1, marginRight: 8 }}
      />
      <Button
        type="primary"
        onClick={handleUpdate}
        loading={loading}
        size="small"
      >
        更新
      </Button>
    </div>
  );
};

export default IdMatch;
