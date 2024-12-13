import forge from "node-forge";

export const IV = "0102030405060708";
export const PRESET_KEY = "0CoJUm6Qyw8W8jud";
export const BASE62 =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB
    -----END PUBLIC KEY-----`;


/**
 * AES加密
 * @param {string} text 待加密文本
 * @param {string} key 密钥
 * @param {string} iv 向量
 * @returns {string} 加密后的Base64字符串
 */
export const aesEncrypt = (text, key, iv) => {
    const cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(text)));
    cipher.finish();
    return forge.util.encode64(cipher.output.getBytes());
};

/**
 * RSA加密
 * @param {string} text 待加密文本
 * @param {string} key 公钥
 * @returns {string} 加密后的十六进制字符串
 */
export const rsaEncrypt = (text, key) => {
    const publicKey = forge.pki.publicKeyFromPem(key);
    const encrypted = publicKey.encrypt(text, "NONE");
    return forge.util.bytesToHex(encrypted);
};

/**
 * 生成加密请求参数
 * @param {Object} object 请求数据
 * @returns {Object} 加密请求参数
 * @property {string} params 加密后的请求数据
 * @property {string} encSecKey 加密后的密钥
 */
export const weapi = (object) => {
    const text = JSON.stringify(object);
    const secretKey = Array.from({ length: 16 }, () =>
        BASE62.charAt(Math.floor(Math.random() * 62))
    ).join("");
    return {
        params: aesEncrypt(aesEncrypt(text, PRESET_KEY, IV), secretKey, IV),
        encSecKey: rsaEncrypt(secretKey.split("").reverse().join(""), PUBLIC_KEY),
    };
};
