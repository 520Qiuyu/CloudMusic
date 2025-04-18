/**
 * 将JSON数据下载为文件
 * @param {Object} data - 要下载的JSON数据
 * @param {string} filename - 下载的文件名
 * @returns {void}
 */
export const downloadJsonFile = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};