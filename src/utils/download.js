/**
 * 将JSON数据下载为文件
 * @param {Object} data - 要下载的JSON数据
 * @param {string} filename - 下载的文件名
 * @returns {void}
 */
export const downloadJsonFile = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * 根据URL下载文件
 * @param {string} url - 文件的URL地址
 * @param {string} filename - 下载的文件名
 * @returns {Promise<void>}
 * @example
 * // 下载一个图片文件
 * await downloadFile('https://example.com/image.jpg', 'my-image.jpg');
 */
export const downloadFile = async (url, filename) => {
  try {
    if (!url || !filename) {
      throw new Error('URL和文件名不能为空');
    }
    const response = await fetch(url.replace('http://', 'https://'));
    if (!response.ok) {
      throw new Error(`下载失败: ${response.statusText}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('文件下载出错:', error);
    throw error;
  }
};

/**
 * 获取文件blob
 * @param url 文件地址
 * @returns blob
 */
export const getFileBlob = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return { blob, response };
};

/**
 * 通过blob方式下载文件（适用于需要指定文件名的场景）
 * @param url 文件地址
 * @param name 文件名
 */
export const downloadWithFileName = async (url, name) => {
  try {
    const { blob, response } = await getFileBlob(url);
    const blobUrl = window.URL.createObjectURL(blob);

    // 获取url的后缀
    const suffix = url.split('?')[0].split('.').pop();

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${name}.${suffix}`;
    document.body.appendChild(a);
    a.click();

    // 清理
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('下载失败:', error);
  }
};

/**
 * 直接打开下载（适用于后端已经设置了文件名的场景）
 * @param url 文件地址
 */
export const downloadDirectly = (url) => {
  window.open(url, '_blank');
};

/**
 * 将数据下载为JSON文件
 * @param data 要下载的数据
 * @param filename 文件名（不需要包含.json后缀）
 * @param options 配置选项
 * @example
 * // 基本使用
 * downloadAsJson({ name: 'test', age: 18 }, 'user-info');
 *
 * // 自定义配置
 * downloadAsJson(data, 'data', {
 *   space: 2, // 缩进空格数
 *   timestamp: true, // 添加时间戳到文件名
 *   replacer: (key, value) => value === null ? undefined : value // 自定义replacer
 * });
 */
export const downloadAsJson = (
  data,
  filename,
  options = {},
) => {
  try {
    // 处理选项
    const { space = 2, timestamp = false } = options;

    // 转换数据为JSON字符串
    const jsonString = JSON.stringify(data, null, space);

    // 创建Blob
    const blob = new Blob([jsonString], { type: 'application/json' });
    const blobUrl = window.URL.createObjectURL(blob);

    // 处理文件名
    let finalFilename = filename;
    if (timestamp) {
      const date = new Date();
      const timeString = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
        date.getDate(),
      ).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(
        date.getMinutes(),
      ).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
      finalFilename = `${filename}_${timeString}`;
    }

    // 创建下载链接
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${finalFilename}.json`;
    document.body.appendChild(a);
    a.click();

    // 清理
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);

    return true;
  } catch (error) {
    console.error('JSON数据下载失败:', error);
    return false;
  }
};

/**
 * 直接下载文件
 * @param file 文件
 * @param name 文件名
 */
export const downloadFileWithBlob = (file, name) => {
  const blobUrl = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
};
