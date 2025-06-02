// 从 @unlock-music/crypto 库导入 KuGouHeader 类，用于解析酷狗音乐文件头信息
import { KuGouHeader } from '@unlock-music/crypto';

/**
 * 解析酷狗音乐文件头信息
 * @param {Object} params - 参数对象
 * @param {string} params.blobURI - 音乐文件的 Blob URI
 * @returns {Promise<Object|null>} 返回包含版本号和音频哈希值的对象，解析失败时返回 null
 */
export const workerParseKugouHeader = async ({ blobURI }) => {
  // 获取文件头部1024字节的数据
  const blob = await fetch(blobURI, {
    headers: { Range: 'bytes=0-1023' },
  }).then((r) => r.blob());
  const arrayBuffer = await blob.arrayBuffer();
  // 截取前0x400字节用于解析
  const buffer = new Uint8Array(arrayBuffer.slice(0, 0x400));

  let kwm;

  try {
    // 使用KuGouHeader解析文件头数据
    kwm = new KuGouHeader(buffer);
    const { version, audioHash } = kwm;
    return { version, audioHash };
  } catch {
    // 解析失败返回null
    return null;
  } finally {
    // 释放KuGouHeader实例占用的资源
    kwm?.free();
  }
};
