import Metaflac from 'metaflac-browser-js';

/**
 * 解析标签行，支持多行歌词
 * @param {string[]} tags - 标签数组，格式为 ['NAME=VALUE', ...]
 * @returns {{title?: string, artist?: string, album?: string, year?: string, genre?: string, comment?: string, track?: string, disc?: string, composer?: string, lyricist?: string, lyrics?: string}}
 */
const parseTags = (tags) => {
  const result = {};
  tags.forEach((tag) => {
    usr;
    const equalIndex = tag.indexOf('=');
    if (equalIndex === -1) return;
    const name = tag.substring(0, equalIndex).toLowerCase();
    const value = tag.substring(equalIndex + 1);
    // 如果已存在同名标签，合并为多行（用于歌词等）
    if (result[name]) {
      result[name] += '\n' + value;
    } else {
      result[name] = value;
    }
  });
  return result;
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
    const metaflac = await Metaflac.fromBlob(file);
    const tags = metaflac.getAllTags();
    const parsedTags = parseTags(tags);
    console.log('解析后的标签:', parsedTags);
    return parsedTags;
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
    const metaflac = await Metaflac.fromBlob(file);
    const tagString = metaflac.getTag(tagName.toUpperCase());
    if (!tagString) {
      return undefined;
    }
    // getTag 返回格式可能是多行，取第一行
    const lines = tagString.split('\n');
    if (lines.length > 0) {
      const equalIndex = lines[0].indexOf('=');
      if (equalIndex !== -1) {
        return lines[0].substring(equalIndex + 1);
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
    const metaflac = await Metaflac.fromBlob(file);
    // 先移除同名标签，再添加新标签
    metaflac.removeTag(tagName.toUpperCase());
    metaflac.setTag(`${tagName.toUpperCase()}=${tagValue}`);
    const newBlob = metaflac.saveAsBlob();
    console.log('给 FLAC 写标签成功');
    return newBlob;
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
    const metaflac = await Metaflac.fromBlob(file);
    await metaflac.importPictureFromFile(picture);
    const newBlob = metaflac.saveAsBlob();
    console.log('给 FLAC 嵌入图片成功');
    return newBlob;
  } catch (error) {
    console.error('给 FLAC 嵌入图片失败:', error);
    return file;
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
export const writeFlacTagAndPicture = async (
  file,
  tagName,
  tagValue,
  picture,
) => {
  try {
    let outputFile = file;
    const metaflac = await Metaflac.fromBlob(file);

    console.log('metaflac', metaflac, metaflac.getAllTags());

    // 写入标签
    if (tagName && tagValue) {
      metaflac.removeTag(tagName.toUpperCase());
      metaflac.setTag(`${tagName.toUpperCase()}=${tagValue}`);
    }

    // 嵌入图片
    if (picture) {
      await metaflac.importPictureFromFile(picture);
    }

    // 保存并返回
    outputFile = metaflac.saveAsBlob();
    return outputFile || file;
  } catch (error) {
    console.error('同时写入歌词和封面失败:', error);
    return file;
  }
};
