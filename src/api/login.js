import { generateQRCode } from '@/utils/qrcode';
import { weapiFetch, weapiRequest } from '@/utils/request';

/**
 * 获取登录二维码KEY
 * @returns {Promise} 返回二维码key
 */
export const getQrKey = () =>
  weapiRequest('/api/login/qrcode/unikey', {
    data: {
      noCheckToken: 1,
      type: 1,
    },
  });

/**
 * 获取登录二维码
 * @param {string} key 二维码key
 * @returns {Promise} 返回二维码图片
 * @example
 * const key = await getQrKey();
 * const qrCode = await getQrCode(key);
 */
export const getQrCode = (key) => {
  const loginUrl = `https://music.163.com/login?codekey=${key}`;
  return generateQRCode(loginUrl);
};

/**
 * 获取登录二维码状态
 * @param {string} key 二维码key
 * @returns {Promise} 返回登录状态
 */
export const getQrStatus = (key) =>
  weapiFetch('/api/login/qrcode/client/login', {
    data: {
      key,
      type: 1,
    },
    originResponse: true,
  });

/**
 * 获取用户信息
 * @returns {Promise} 返回用户账户信息
 */
export const getUserAccount = () =>
  weapiRequest('/api/nuser/account/get', {
    data: {},
  });

