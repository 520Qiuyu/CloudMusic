import { GM_xmlhttpRequest } from "vite-plugin-monkey/dist/client";
import { weapi } from "./encrypt";

// 客户端类型配置
export const CLIENT_CONFIG = {
    web: {
        cookie: true,
        userAgent: undefined,
    },
    android: {
        cookie:
            "os=android;appver=9.1.78;channel=netease;osver=14;buildver=241009150147;",
        userAgent:
            "NeteaseMusic/9.1.78.241009150147(9001078);Dalvik/2.1.0 (Linux; U; Android 14; V2318A Build/TP1A.220624.014)",
    },
    pc: {
        cookie:
            "os=pc;appver=3.0.18.203152;channel=netease;osver=Microsoft-Windows-10-Professional-build-19045-64bit;",
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36 Chrome/91.0.4472.164 NeteaseMusicDesktop/3.0.18.203152",
    },
};

/**
 * 网易云API加密请求
 * @param {string} url - 请求URL
 * @param {Object} config - 请求配置
 * @param {Object} [config.data={}] - 请求数据
 * @param {string} [config.clientType='pc'] - 客户端类型，默认为'pc'
 * @param {string} [config.ip] - 可选的IP地址，用于设置X-Real-IP和X-Forwarded-For头
 * @returns {Promise<any>} 返回一个Promise，resolve时返回响应数据，reject时返回错误信息
 */
export const weapiRequest = (url, config) => {
    // 准备请求数据
    const { data = {}, clientType = "pc", ip, onerror, onload, ...rest } = config;

    // 获取CSRF Token
    const csrfToken = document.cookie.match(/_csrf=([^(;|$)]+)/);
    data.csrf_token = csrfToken ? csrfToken[1] : "";

    // 加密请求数据
    const encryptedData = weapi(data);

    // 准备请求头
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": CLIENT_CONFIG[clientType].userAgent,
    };

    // 添加IP相关头(如果需要)
    if (ip) {
        headers["X-Real-IP"] = ip;
        headers["X-Forwarded-For"] = ip;
    }

    // 发送请求
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: url.replace("api", "weapi") + `?csrf_token=${data.csrf_token}`,
            method: "POST",
            responseType: "json",
            headers,
            cookie: CLIENT_CONFIG[clientType].cookie,
            data: `params=${encodeURIComponent(
                encryptedData.params
            )}&encSecKey=${encodeURIComponent(encryptedData.encSecKey)}`,
            onload: (res) => resolve(res.response),
            onerror: reject,
        });
    });
};