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
    const link = document.createElement('a');
    link.href = url.replace('http://', 'https://');
    link.download = filename;
    link.style.display = 'none';
    link.style.position = 'absolute';
    link.style.left = '-9999px';

    const handleClick = (e) => {
      e.stopPropagation();
    };
    link.addEventListener('click', handleClick, true);
    link.click();
    setTimeout(() => {
      link.removeEventListener('click', handleClick);
    }, 100);
  } catch (error) {
    console.error('文件下载出错:', error);
    throw error;
  }
};

/**
 * 获取文件blob
 * @param {string} url - 文件地址（绝对路径）
 * @returns {Promise<{blob: Blob, response: Response}>}
 * @example
 * const { blob, response } = await getFileBlob('https://example.com/file.flac');
 */
export const getFileBlob = async (url) => {
  // 关键：指定 redirect: 'follow' 防止在 iframe 中触发地址栏跳转
  const response = await fetch(url, {
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`获取文件失败: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  return { blob, response };
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
export const downloadAsJson = (data, filename, options = {}) => {
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
    downloadFile(blobUrl, `${finalFilename}.json`);
    window.URL.revokeObjectURL(blobUrl);

    return true;
  } catch (error) {
    console.error('JSON数据下载失败:', error);
    return false;
  }
};

/**
 * 将歌词字符串下载为 .lrc 文件
 * @param {string} lrcContent - 歌词内容
 * @param {string} filename - 文件名（不需要 .lrc 后缀）
 * @param {Object} options - 配置项（timestamp 是否在文件名添加时间戳）
 * @example
 * downloadAsLRC('[00:00.00] 歌词内容', 'song-title');
 * downloadAsLRC(lrcText, 'song', { timestamp: true });
 */
export const downloadAsLRC = (lrcContent, filename, options = {}) => {
  try {
    const { timestamp = false } = options;
    let finalFilename = filename;
    if (timestamp) {
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(
        now.getMinutes()
      ).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      finalFilename = `${filename}_${ts}`;
    }
    const blob = new Blob([lrcContent], { type: 'text/plain' });
    const blobUrl = window.URL.createObjectURL(blob);
    downloadFile(blobUrl, `${finalFilename}.lrc`);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch (error) {
    console.error('LRC歌词下载失败:', error);
    return false;
  }
};


/**
 * 直接下载文件
 * @param {Blob} file - 文件 Blob 对象
 * @param {string} name - 文件名
 * @example
 * downloadFileWithBlob(blob, 'song.flac');
 */
export const downloadFileWithBlob = (file, name) => {
  const blobUrl = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = name;

  // 在 iframe 中防止触发地址栏跳转
  a.style.display = 'none';
  a.style.position = 'absolute';
  a.style.left = '-9999px';

  // 阻止事件冒泡，防止触发父页面导航（但不阻止下载行为）
  const handleClick = (e) => {
    e.stopPropagation();
  };
  a.addEventListener('click', handleClick, true);

  document.body.appendChild(a);
  a.click();

  // 延迟清理，确保下载已开始
  setTimeout(() => {
    a.removeEventListener('click', handleClick);
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  }, 100);
};
