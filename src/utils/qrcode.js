import QRCode from 'qrcode';

/**
 * 生成二维码
 * @param {string} text - 要转换成二维码的文本
 * @param {Object} options - 二维码配置选项
 * @returns {Promise<string>} - 返回二维码的 base64 字符串
 */
export const generateQRCode = async (text, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 200,
      ...options,
    };

    const qrcode = await QRCode.toDataURL(text, defaultOptions);
    return qrcode;
  } catch (error) {
    console.error('生成二维码失败:', error);
    throw error;
  }
};
