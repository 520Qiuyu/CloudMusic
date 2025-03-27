// 从 @unlock-music/crypto 库导入 QMCFooter 类，用于解析QMC2格式音乐文件页脚信息
import { QMCFooter } from '@unlock-music/crypto';

/**
 * 解析QMC2格式音乐文件页脚信息，获取媒体名称
 * @param {Object} params - 参数对象
 * @param {string} params.blobURI - 音乐文件的 Blob URI
 * @returns {Promise<string|null>} 返回媒体名称，解析失败时返回 null
 */
export const workerParseMusicExMediaName = async ({ blobURI }) => {
  // 获取文件末尾1024字节的数据
  const blob = await fetch(blobURI, { headers: { Range: 'bytes=-1024' } }).then((r) => r.blob());
  const arrayBuffer = await blob.arrayBuffer();

  try {
    // 截取最后1024字节用于解析
    const buffer = new Uint8Array(arrayBuffer.slice(-1024));
    // 使用QMCFooter解析页脚数据
    const footer = QMCFooter.parse(buffer);
    // 返回媒体名称，如果不存在则返回null
    return footer?.mediaName || null;
  } catch {
    // 解析失败返回null
    return null;
  }
};