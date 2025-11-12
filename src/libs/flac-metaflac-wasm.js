import { metaflac } from 'metaflac.wasm';

/**
 * 执行 metaflac 命令的通用函数
 * @param {string[]} args - metaflac 命令参数
 * @param {Map<string, Uint8Array>} inputFiles - 输入文件映射
 * @param {string[]} [outputFileNames] - 输出文件名数组（可选）
 * @returns {Promise<{exitCode: number, stdout: string, stderr: string, files: Map<string, Uint8Array>}>}
 */
const executeMetaflac = async (args, inputFiles, outputFileNames) => {
  const options = { inputFiles };
  if (outputFileNames) {
    options.outputFileNames = outputFileNames;
  }

  const result = await metaflac(args, options);
  console.log('metaflac result:', result);

  return result;
};

/**
 * 检查 metaflac 执行是否成功
 * @param {{exitCode: number, stderr: string}} result - metaflac 执行结果
 * @param {string} operation - 操作名称
 * @returns {boolean}
 */
const checkMetaflacSuccess = (result, operation) => {
  if (result.exitCode !== 0) {
    console.error(`${operation}失败:`, result.stderr);
    return false;
  }
  return true;
};

/**
 * 将 Blob 转换为 Uint8Array
 * @param {Blob} file - 文件 Blob 对象
 * @returns {Promise<Uint8Array>}
 */
const blobToBuffer = async (file) => {
  return new Uint8Array(await file.arrayBuffer());
};

/**
 * 将 Uint8Array 转换为 Blob
 * @param {Uint8Array} buffer - 缓冲区
 * @param {string} [mimeType='audio/flac'] - MIME 类型
 * @returns {Blob}
 */
const bufferToBlob = (buffer, mimeType = 'audio/flac') => {
  return new Blob([buffer], { type: mimeType });
};

/**
 * 解析标签行，支持多行歌词
 * @param {string} stdout - metaflac 输出内容
 * @returns {{title?: string, artist?: string, album?: string, year?: string, genre?: string, comment?: string, track?: string, disc?: string, composer?: string, lyricist?: string, lyrics?: string}}
 */
const parseTagLines = (stdout) => {
  const tags = {};
  const lines = stdout.trim().split('\n');

  let currentTag = '';
  let currentValue = '';
  let isCollectingLyrics = false;

  lines.forEach((line) => {
    // 检查是否是新标签的开始（格式: TAGNAME=value）
    const tagMatch = line.match(/^([A-Z_]+)=(.*)$/);

    if (tagMatch) {
      // 如果之前正在收集歌词，先保存
      if (isCollectingLyrics && currentTag) {
        tags[currentTag.toLowerCase()] = currentValue.trim();
        isCollectingLyrics = false;
      }

      // 开始新标签
      currentTag = tagMatch[1];
      currentValue = tagMatch[2];

      // 检查是否是 LYRICS 标签
      if (currentTag === 'LYRICS') {
        isCollectingLyrics = true;
      } else {
        // 普通标签，直接保存
        tags[currentTag.toLowerCase()] = currentValue;
      }
    } else if (isCollectingLyrics && currentTag) {
      // 继续收集歌词内容（多行）
      currentValue += '\n' + line;
    }
  });

  // 保存最后一个标签（可能是歌词）
  if (isCollectingLyrics && currentTag) {
    tags[currentTag.toLowerCase()] = currentValue.trim();
  }

  return tags;
};

/**
 * 读取flac所有Tag
 * @param {Blob} file - FLAC 文件 Blob 对象
 * @returns {Promise<{title?: string, artist?: string, album?: string, year?: string, genre?: string, comment?: string, track?: string, disc?: string, composer?: string, lyricist?: string, lyrics?: string}>}
 * @example
 * const tags = await readAllFlacTag(file);
 * console.log(tags.title, tags.artist);
 */
export const readAllFlacTag = async (file) => {
  try {
    const buffer = await blobToBuffer(file);
    const result = await executeMetaflac(
      ['--show-all-tags', 'file.flac'],
      new Map([['file.flac', buffer]]),
    );

    if (!checkMetaflacSuccess(result, '读取 FLAC 标签')) {
      return {};
    }

    if (result.stdout) {
      const tags = parseTagLines(result.stdout);
      console.log('解析后的标签:', tags);
      return tags;
    }

    return {};
  } catch (error) {
    console.error('读取 FLAC 标签失败:', error);
    return {};
  }
};

/**
 * 读取特定标签
 * @param {Blob} file - FLAC 文件 Blob 对象
 * @param {string} tagName - 标签名称（如 'title', 'artist'）
 * @returns {Promise<string|undefined>}
 * @example
 * const title = await readFlacTag(file, 'title');
 */
export const readFlacTag = async (file, tagName) => {
  try {
    const buffer = await blobToBuffer(file);
    const result = await executeMetaflac(
      [`--show-tag=${tagName.toUpperCase()}`, 'file.flac'],
      new Map([['file.flac', buffer]]),
    );

    if (!checkMetaflacSuccess(result, `读取 FLAC 标签 ${tagName}`) || !result.stdout) {
      return undefined;
    }

    // 输出格式: TAGNAME=value
    const lines = result.stdout.trim().split('\n');
    for (const line of lines) {
      if (line.startsWith(`${tagName.toUpperCase()}=`)) {
        return line.substring(tagName.length + 1); // 去掉 "TAGNAME=" 前缀
      }
    }

    return undefined;
  } catch (error) {
    console.error(`读取 FLAC 标签 ${tagName} 失败:`, error);
    return undefined;
  }
};

/**
 * 给flac写标签
 * @param {Blob} file - FLAC 文件 Blob 对象
 * @param {string} tagName - 标签名称（如 'title', 'artist'）
 * @param {string} tagValue - 标签值
 * @returns {Promise<Blob|undefined>}
 * @example
 * const newFile = await writeFlacTag(file, 'title', '新歌曲名');
 */
export const writeFlacTag = async (file, tagName, tagValue) => {
  try {
    const buffer = await blobToBuffer(file);
    const result = await executeMetaflac(
      [`--set-tag=${tagName.toUpperCase()}=${tagValue}`, 'file.flac'],
      new Map([['file.flac', buffer]]),
      ['file.flac'],
    );

    if (!checkMetaflacSuccess(result, '给 FLAC 写标签')) {
      return undefined;
    }

    const outputFile = result.files.get('file.flac');
    if (outputFile) {
      console.log('给 FLAC 写标签成功:', result.stdout);
      return bufferToBlob(outputFile);
    }

    return file;
  } catch (error) {
    console.error('给 FLAC 写标签失败:', error);
    throw new Error('给 FLAC 写标签失败');
  }
};

/**
 * 给flac嵌入图片
 * @param {Blob} file - FLAC 文件 Blob 对象
 * @param {Blob} picture - 封面图片 Blob 对象
 * @returns {Promise<Blob|undefined>}
 * @example
 * const newFile = await embedFlacPicture(file, coverImage);
 */
export const embedFlacPicture = async (file, picture) => {
  try {
    const buffer = await blobToBuffer(file);
    const coverBuffer = await blobToBuffer(picture);

    const result = await executeMetaflac(
      [`--import-picture-from=cover`, 'file.flac'],
      new Map([
        ['file.flac', buffer],
        [`cover`, coverBuffer],
      ]),
      ['file.flac'],
    );

    if (!checkMetaflacSuccess(result, '给 FLAC 嵌入图片')) {
      return file;
    }

    const outputFile = result.files.get('file.flac');
    if (outputFile) {
      console.log('给 FLAC 嵌入图片成功:', result.stdout);
      return bufferToBlob(outputFile);
    }

    return file;
  } catch (error) {
    console.error('给 FLAC 嵌入图片失败:', error);
    throw new Error('给 FLAC 嵌入图片失败');
  }
};

/**
 * 同时写入歌词和封面
 * @param {Blob} file - FLAC 文件 Blob 对象
 * @param {string} [tagName] - 标签名称（可选）
 * @param {string} [tagValue] - 标签值（可选）
 * @param {Blob} [picture] - 封面图片 Blob 对象（可选）
 * @returns {Promise<Blob>}
 * @example
 * const newFile = await writeFlacTagAndPicture(file, 'lyrics', '歌词内容', coverImage);
 */
export const writeFlacTagAndPicture = async (file, tagName, tagValue, picture) => {
  try {
    let outputFile = file;
    if (tagName && tagValue) {
      outputFile = await writeFlacTag(file, tagName, tagValue);
    }
    if (picture) {
      outputFile = await embedFlacPicture(outputFile || file, picture);
    }
    return outputFile || file;
  } catch (error) {
    console.error('同时写入歌词和封面失败:', error);
    return file;
  }
};

