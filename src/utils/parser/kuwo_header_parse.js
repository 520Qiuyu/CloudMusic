// 从 @unlock-music/crypto 库导入 KuwoHeader 类，用于解析酷我音乐文件头信息
import { KuwoHeader } from '@unlock-music/crypto';

/**
 * 解析酷我音乐文件头信息
 * @param {Object} params - 参数对象
 * @param {string} params.blobURI - 音乐文件的 Blob URI
 * @returns {Promise<Object|null>} 返回包含音质ID和资源ID的对象，解析失败时返回 null
 */
export const workerParseKuwoHeader = async ({ blobURI }) => {
  // 获取文件头部1024字节的数据
  const blob = await fetch(blobURI, {
    headers: { Range: 'bytes=0-1023' },
  }).then((r) => r.blob());
  const arrayBuffer = await blob.arrayBuffer();

  try {
    // 截取前1024字节用于解析
    const buffer = new Uint8Array(arrayBuffer.slice(0, 1024));
    // 使用KuwoHeader解析文件头数据
    const kwm = KuwoHeader.parse(buffer);
    const { qualityId, resourceId } = kwm;
    // 释放KuwoHeader实例占用的资源
    kwm.free();
    return { qualityId, resourceId };
  } catch {
    // 解析失败返回null
    return null;
  }
};
