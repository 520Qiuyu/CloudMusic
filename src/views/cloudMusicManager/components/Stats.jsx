import React, { memo } from "react";
import { Tag } from "antd";
import styles from "../index.module.scss";

const Stats = memo(({ selectedRows = [], filteredSongList = [] }) => {
  return (
    <div className={styles.stats}>
      已选择 <Tag color="blue">{selectedRows.length} 首</Tag>{" "}
      <span className={styles.size}>
        {selectedRows.length > 0 &&
          `${(
            selectedRows.reduce((acc, cur) => acc + cur.fileSize, 0) /
            1024 /
            1024
          ).toFixed(2)}MB`}
      </span>
      <span className={styles.divider}>/</span>共{" "}
      <Tag color="green">{filteredSongList.length} 首</Tag>{" "}
      <span className={styles.size}>
        {filteredSongList.length > 0 &&
          `${(
            filteredSongList.reduce((acc, cur) => acc + cur.fileSize, 0) /
            1024 /
            1024
          ).toFixed(2)}MB`}
      </span>
    </div>
  );
});

Stats.displayName = "Stats";

export default Stats;
