// ==UserScript==
// @name         cloudmusic
// @namespace    https://github.com/520Qiuyu/CloudMusic
// @version      0.0.0
// @author       520Qiuyu
// @description  无需文件云盘快传歌曲(含周杰伦)、歌曲下载&转存云盘(可批量)、云盘匹配纠正、高音质试听、完整歌单列表、评论区显示IP属地、使用指定的IP地址发送评论、歌单歌曲排序(时间、红心数、评论数)、专辑页加载Disc信息、限免VIP歌曲下载上传、云盘音质提升、本地文件上传云
// @icon         https://vitejs.dev/logo.svg
// @homepage     https://github.com/520Qiuyu/CloudMusic
// @homepageURL  https://github.com/520Qiuyu/CloudMusic
// @match        https://music.163.com/**/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/antd@5.22.4/dist/antd.min.js
// @require      https://cdn.jsdelivr.net/npm/@ant-design/icons@5.5.2/dist/index.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/node-forge@1.3.1/lib/index.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const s=document.createElement("style");s.textContent=o,document.head.append(s)})(" ._button-group_dcsms_1{position:fixed;right:20px;top:50%;width:44px;max-height:400px;overflow-y:auto;background:#ffffffe6;border-radius:22px;box-shadow:0 2px 10px #0000001a;padding:10px 0;z-index:999}._button-group_dcsms_1::-webkit-scrollbar{width:0;background:transparent}._button-group_dcsms_1 .ant-btn{width:36px;height:36px;padding:0;border:none;background:transparent;display:flex;align-items:center;justify-content:center;margin:4px auto;transition:all .3s}._button-group_dcsms_1 .ant-btn:hover{background:#c20c0c1a;color:#fff;transform:scale(1.1)}._button-group_dcsms_1 .ant-btn:active{transform:scale(.95)}._button-group_dcsms_1 .ant-btn .anticon{font-size:20px;color:#666}._button-group_dcsms_1 .ant-btn:hover .anticon{color:#fff}._button-group_dcsms_1 .ant-tooltip .ant-tooltip-inner{background-color:#000c;border-radius:4px;font-size:12px;padding:4px 8px}._button-group_dcsms_1 .ant-tooltip .ant-tooltip-arrow-content{background-color:#000c}._quick-upload-tabs_10bds_1 .ant-spin{width:100%;height:100%}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-default{border-color:#d9d9d9;color:#333}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-default:hover{border-color:#c20c0c;color:#c20c0c}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-primary{background:#c20c0c;border-color:#c20c0c}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-primary:hover{background:#a40a0a;border-color:#a40a0a}._quick-upload-tabs_10bds_1 ._select_10bds_21{width:100%}._quick-upload-tabs_10bds_1 ._option-label_10bds_24{display:flex;align-items:center;gap:8px;justify-content:space-between;width:100%}._quick-upload-tabs_10bds_1 ._option-label_10bds_24 ._singer-name_10bds_31{font-weight:500}._quick-upload-tabs_10bds_1 ._option-label_10bds_24 ._tag-group_10bds_34 ._tag_10bds_34:not(:last-child){margin-right:8px}._singer-choose_10bds_38 ._singer-choose-form_10bds_38{display:flex;flex-direction:column;justify-content:space-between;height:400px}._singer-choose_10bds_38 ._singer-choose-form_10bds_38 ._btn-group_10bds_44{display:flex;justify-content:flex-end}._upload-list_10bds_49 .ant-table{margin:16px 0}._upload-footer_10bds_53{width:100%;display:flex;justify-content:flex-end;align-items:center;gap:8px}._upload-stats_10bds_61{color:#666;font-size:13px;margin-right:auto}._upload-stats_10bds_61 ._size-text_10bds_66{color:#999}._upload-stats_10bds_61 ._divider_10bds_69{margin:0 8px;color:#d9d9d9}._upload-confirm_10bds_74{padding:16px 0;font-size:14px}._upload-confirm_10bds_74 ._confirm-item_10bds_78{display:flex;align-items:center;margin-bottom:12px}._upload-confirm_10bds_74 ._confirm-item_10bds_78:last-child{margin-bottom:0}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._label_10bds_86{color:#666;width:80px;flex-shrink:0}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._value_10bds_91{color:#333;font-weight:500}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._value_10bds_91 ._size_10bds_66{margin-left:4px;color:#999;font-weight:400}._upload-progress_10bds_101 ._progress-header_10bds_101{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding:0 4px}._upload-progress_10bds_101 ._progress-header_10bds_101 ._progress-info_10bds_108{font-size:14px;color:#333}._upload-progress_10bds_101 ._progress-header_10bds_101 ._percentage_10bds_112{font-size:14px;font-weight:500;color:#1890ff}._upload-progress_10bds_101 ._progress-list_10bds_117{max-height:300px;overflow-y:auto;padding:0 4px}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122:last-child{border-bottom:none}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132{flex:1;min-width:0;padding-right:16px}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132 ._name_10bds_137{font-size:14px;color:#333}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132 ._artist_10bds_141{font-size:14px;color:#666;margin-left:4px}._uploadProgressModal_10bds_147 .ant-modal-body{padding:24px}._uploadProgressModal_10bds_147 ._progressContent_10bds_150{display:flex;flex-direction:column;align-items:center;gap:24px}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156{display:flex;flex-direction:column;align-items:center}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156 ._percentage_10bds_112{font-size:24px;font-weight:500;color:#333}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156 ._detail_10bds_166{font-size:14px;color:#666;margin-top:4px}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171{display:flex;justify-content:space-around;width:100%;padding:16px 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179{text-align:center}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179 ._label_10bds_86{font-size:14px;color:#666;margin-bottom:8px}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179 ._value_10bds_91 .ant-tag{margin:0;font-size:14px;padding:4px 12px}._uploadProgressModal_10bds_147 ._failedList_10bds_192{width:100%}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedTitle_10bds_195{font-size:14px;color:#333;margin-bottom:12px;font-weight:500}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201{padding:8px 12px;background:#fff1f0;border-radius:4px;margin-bottom:8px}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201 ._songName_10bds_207{font-size:14px;color:#333;margin-bottom:4px}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201 ._errorMsg_10bds_212{font-size:12px;color:#ff4d4f}._uploadModal_10bds_217 .ant-modal-body{padding:24px}._progressSection_10bds_221{display:flex;flex-direction:column;align-items:center;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f0f0f0}._progressInfo_10bds_156{display:flex;flex-direction:column;align-items:center}._progressInfo_10bds_156 ._percentage_10bds_112{font-size:24px;font-weight:500;color:#333}._progressInfo_10bds_156 ._count_10bds_240{font-size:14px;color:#666;margin-top:4px}._statsContainer_10bds_171{display:flex;justify-content:center;gap:16px;margin-top:20px}._statsContainer_10bds_171 ._statsItem_10bds_179{text-align:center}._statsContainer_10bds_171 ._statsTag_10bds_255{padding:4px 12px;font-size:14px}._songList_10bds_260{max-height:300px;overflow-y:auto;padding-right:4px}._songList_10bds_260::-webkit-scrollbar{width:6px}._songList_10bds_260::-webkit-scrollbar-thumb{background-color:#d9d9d9;border-radius:3px}._songList_10bds_260::-webkit-scrollbar-thumb:hover{background-color:#bfbfbf}._songItem_10bds_276{display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:4px;background:#fafafa}._songItem_10bds_276:not(:last-child){margin-bottom:8px}._songItem_10bds_276:hover{background:#f5f5f5}._songInfo_10bds_291{display:flex;align-items:center;gap:8px;flex:1;min-width:0}._songInfo_10bds_291 ._songName_10bds_207{font-weight:500;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}._songInfo_10bds_291 ._artistName_10bds_305{color:#666;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent;border-radius:6px}::-webkit-scrollbar-thumb{background:#8080804d;border-radius:6px;transition:all .2s ease-in-out}::-webkit-scrollbar-thumb:hover{background:#80808080}*{scrollbar-width:thin;scrollbar-color:rgba(128,128,128,.3) transparent} ");

(function (require$$0, antd, require$$0$1, icons, forge) {
  'use strict';

  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  const styles$1 = {
    "button-group": "_button-group_dcsms_1"
  };
  const BASE_CDN_URL = "https://fastly.jsdelivr.net/gh/Cinvin/cdn@latest/artist/";
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const formatFileSize = (size2) => {
    if (!size2 || isNaN(size2)) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    size2 = Math.abs(Number(size2));
    let index = 0;
    while (size2 >= 1024 && index < units.length - 1) {
      size2 /= 1024;
      index++;
    }
    return `${size2.toFixed(index > 0 ? 1 : 0)} ${units[index]}`;
  };
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1e3);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  function chunkArray(array, size2) {
    const result = [];
    for (let i = 0; i < array.length; i += size2) {
      result.push(array.slice(i, i + size2));
    }
    return result;
  }
  const getArtistTextInSongDetail = (song2) => {
    var _a;
    return song2.ar ? song2.ar.map((ar) => ar.name).join() : ((_a = song2.pc) == null ? void 0 : _a.ar) || "";
  };
  const getAlbumTextInSongDetail = (song2) => {
    var _a;
    return song2.al ? song2.al.name : ((_a = song2.pc) == null ? void 0 : _a.alb) || "";
  };
  const uniqueArrayByKey = (arr, key) => {
    if (!Array.isArray(arr)) return [];
    if (!key) return arr;
    const seen = /* @__PURE__ */ new Map();
    return arr.filter((item) => {
      if (!item || typeof item !== "object") return false;
      const val = item[key];
      if (seen.has(val)) return false;
      seen.set(val, true);
      return true;
    });
  };
  const promiseLimit = (promiseArray, limit = 6) => {
    if (!Array.isArray(promiseArray)) {
      throw new Error("第一个参数必须是数组");
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error("并发限制必须是正整数");
    }
    if (promiseArray.length === 0) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      const results = new Array(promiseArray.length);
      let completed = 0;
      let currentIndex = 0;
      const runTask = async () => {
        const index = currentIndex++;
        if (index >= promiseArray.length) {
          return;
        }
        try {
          const promise = promiseArray[index];
          if (typeof promise !== "function") {
            throw new Error(`数组中索引为 ${index} 的元素不是函数`);
          }
          results[index] = await promise();
        } catch (error) {
          results[index] = error;
        }
        completed++;
        if (currentIndex < promiseArray.length) {
          runTask();
        } else if (completed === promiseArray.length) {
          resolve(results);
        }
      };
      const tasksToStart = Math.min(limit, promiseArray.length);
      for (let i = 0; i < tasksToStart; i++) {
        try {
          runTask();
        } catch (error) {
          reject(error);
        }
      }
    });
  };
  const msgSuccess = (content) => {
    antd.message.success(content);
  };
  const msgError = (content) => {
    antd.message.error(content);
  };
  const confirm = (content, title, otherOptions = {}) => {
    return new Promise((resolve, reject) => {
      antd.Modal.confirm({
        centered: true,
        content,
        icon: null,
        closable: true,
        title,
        width: 398,
        okButtonProps: {
          shape: "round",
          type: "primary"
        },
        cancelButtonProps: {
          shape: "round",
          type: "default"
        },
        okText: "确定",
        cancelText: "取消",
        onCancel: () => {
          reject(false);
        },
        onOk: () => {
          resolve(true);
        },
        ...otherOptions
      });
    });
  };
  const IV = "0102030405060708";
  const PRESET_KEY = "0CoJUm6Qyw8W8jud";
  const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB
    -----END PUBLIC KEY-----`;
  const aesEncrypt = (text, key, iv) => {
    const cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(text)));
    cipher.finish();
    return forge.util.encode64(cipher.output.getBytes());
  };
  const rsaEncrypt = (text, key) => {
    const publicKey = forge.pki.publicKeyFromPem(key);
    const encrypted = publicKey.encrypt(text, "NONE");
    return forge.util.bytesToHex(encrypted);
  };
  const weapi = (object) => {
    const text = JSON.stringify(object);
    const secretKey = Array.from(
      { length: 16 },
      () => BASE62.charAt(Math.floor(Math.random() * 62))
    ).join("");
    return {
      params: aesEncrypt(aesEncrypt(text, PRESET_KEY, IV), secretKey, IV),
      encSecKey: rsaEncrypt(secretKey.split("").reverse().join(""), PUBLIC_KEY)
    };
  };
  const CLIENT_CONFIG = {
    web: {
      cookie: true,
      userAgent: void 0
    },
    android: {
      cookie: "os=android;appver=9.1.78;channel=netease;osver=14;buildver=241009150147;",
      userAgent: "NeteaseMusic/9.1.78.241009150147(9001078);Dalvik/2.1.0 (Linux; U; Android 14; V2318A Build/TP1A.220624.014)"
    },
    pc: {
      cookie: "os=pc;appver=3.0.18.203152;channel=netease;osver=Microsoft-Windows-10-Professional-build-19045-64bit;",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36 Chrome/91.0.4472.164 NeteaseMusicDesktop/3.0.18.203152"
    }
  };
  const weapiRequest = (url, config) => {
    const { data = {}, clientType = "pc", ip, onerror, onload, ...rest } = config;
    const csrfToken = document.cookie.match(/_csrf=([^(;|$)]+)/);
    data.csrf_token = csrfToken ? csrfToken[1] : "";
    const encryptedData = weapi(data);
    const headers = {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": CLIENT_CONFIG[clientType].userAgent
    };
    if (ip) {
      headers["X-Real-IP"] = ip;
      headers["X-Forwarded-For"] = ip;
    }
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        url: url.replace("api", "weapi") + `?csrf_token=${data.csrf_token}`,
        method: "POST",
        responseType: "json",
        headers,
        cookie: CLIENT_CONFIG[clientType].cookie,
        data: `params=${encodeURIComponent(
        encryptedData.params
      )}&encSecKey=${encodeURIComponent(encryptedData.encSecKey)}`,
        onload: (res) => resolve(res.response),
        onerror: reject
      });
    });
  };
  const getArtists = () => fetch(`${BASE_CDN_URL}top.json`).then((res) => res.json());
  const getCDNConfig = (artistId) => fetch(`${BASE_CDN_URL}${artistId}.json`).then((res) => res.json());
  const getSongInfoList = async (songIds) => {
    const chunkArr = chunkArray(songIds, 1e3);
    const proArr = chunkArr.map(async (chunk) => {
      return weapiRequest("/api/v3/song/detail", {
        data: {
          c: JSON.stringify(chunk.map((item) => ({ id: item })))
        }
      });
    });
    const allInfo = await Promise.all(proArr);
    return allInfo.flat();
  };
  const matchCloudSong = async (cloudSongId, id) => {
    if (cloudSongId != id && id > 0) {
      const res = await weapiRequest("/api/cloud/user/song/match", {
        data: {
          songId: cloudSongId,
          adjustSongId: id
        }
      });
      if (res.code != 200 || res.data.length < 1) {
        msgError(`歌曲： ${song.name} 匹配失败`);
        throw new Error(res.message || res.msg || "歌曲匹配失败");
      }
      return res;
    }
    return;
  };
  const uploadSong = async (song2) => {
    try {
      let res = await weapiRequest("/api/cloud/upload/check/v2", {
        data: {
          uploadType: 0,
          songs: JSON.stringify([
            {
              md5: song2.md5,
              songId: song2.id,
              bitrate: song2.bitrate,
              fileSize: song2.size
            }
          ])
        }
      });
      if (res.code != 200 || res.data.length < 1) {
        msgError(`资源检查失败,请检查歌曲：${song2.name}是否已存在！`);
        throw new Error(res.message || res.msg || "资源检查失败");
      }
      const cloudId = res.data[0].songId;
      if (res.data[0].upload == 1) {
        const importRes = await weapiRequest("/api/cloud/user/song/import", {
          data: {
            uploadType: 0,
            songs: JSON.stringify([
              {
                songId: cloudId,
                bitrate: song2.bitrate,
                song: song2.filename,
                artist: song2.artists,
                album: song2.album,
                fileName: song2.filename
              }
            ])
          }
        });
        if (importRes.code != 200 || importRes.data.successSongs.length < 1) {
          msgError(`歌曲： ${song2.name} 上传失败`);
          throw new Error(importRes.message || importRes.msg || "歌曲上传失败");
        }
        const cloudSongId = importRes.data.successSongs[0].song.songId;
        await matchCloudSong(cloudSongId, song2.id);
        return {
          code: 200,
          msg: "歌曲上传成功",
          data: { song: song2 }
        };
      } else {
        const tokenRes = await weapiRequest("/api/nos/token/alloc", {
          data: {
            filename: song2.filename,
            length: song2.size,
            ext: song2.ext,
            md5: song2.md5,
            type: "audio",
            bucket: "jd-musicrep-privatecloud-audio-public",
            local: false,
            nos_product: 3
          }
        });
        if (tokenRes.code != 200) {
          msgError("获取上传token失败");
          throw new Error(
            tokenRes.message || tokenRes.msg || "获取上传token失败"
          );
        }
        song2.resourceId = tokenRes.result.resourceId;
        const uploadRes = await weapiRequest("/api/upload/cloud/info/v2", {
          data: {
            token: tokenRes.result.token,
            objectKey: tokenRes.result.objectKey,
            resourceId: tokenRes.result.resourceId,
            // ...tokenRes.result,
            expireTime: Date.now() + 6e4,
            fileSize: song2.size,
            md5: song2.md5,
            songid: cloudId,
            filename: song2.filename,
            song: song2.name,
            album: song2.album,
            artist: song2.artists,
            bitrate: String(song2.bitrate || 128),
            resourceId: song2.resourceId
          }
        });
        if (uploadRes.code != 200) {
          msgError(`歌曲： ${song2.name} 上传失败`);
        }
        const pubRes = await weapiRequest("/api/cloud/pub/v2", {
          data: {
            songid: uploadRes.songId
          }
        });
        if (![200, 201].includes(pubRes.code)) {
          msgError(`歌曲： ${song2.name} 发布失败`);
          throw new Error(pubRes.message || pubRes.msg || "歌曲发布失败");
        }
        const cloudSongId = pubRes.privateCloud.songId;
        await matchCloudSong(cloudSongId, song2.id);
        return {
          code: 200,
          msg: "歌曲上传成功",
          data: { song: song2 }
        };
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
  const select = "_select_10bds_21";
  const tag = "_tag_10bds_34";
  const divider = "_divider_10bds_69";
  const label = "_label_10bds_86";
  const value = "_value_10bds_91";
  const size = "_size_10bds_66";
  const percentage = "_percentage_10bds_112";
  const name = "_name_10bds_137";
  const artist = "_artist_10bds_141";
  const uploadProgressModal = "_uploadProgressModal_10bds_147";
  const progressContent = "_progressContent_10bds_150";
  const progressInfo = "_progressInfo_10bds_156";
  const detail = "_detail_10bds_166";
  const statsContainer = "_statsContainer_10bds_171";
  const statsItem = "_statsItem_10bds_179";
  const failedList = "_failedList_10bds_192";
  const failedTitle = "_failedTitle_10bds_195";
  const failedItem = "_failedItem_10bds_201";
  const songName = "_songName_10bds_207";
  const errorMsg = "_errorMsg_10bds_212";
  const uploadModal = "_uploadModal_10bds_217";
  const progressSection = "_progressSection_10bds_221";
  const count = "_count_10bds_240";
  const statsTag = "_statsTag_10bds_255";
  const songList = "_songList_10bds_260";
  const songItem = "_songItem_10bds_276";
  const songInfo = "_songInfo_10bds_291";
  const artistName = "_artistName_10bds_305";
  const styles = {
    "quick-upload-tabs": "_quick-upload-tabs_10bds_1",
    select,
    "option-label": "_option-label_10bds_24",
    "singer-name": "_singer-name_10bds_31",
    "tag-group": "_tag-group_10bds_34",
    tag,
    "singer-choose": "_singer-choose_10bds_38",
    "singer-choose-form": "_singer-choose-form_10bds_38",
    "btn-group": "_btn-group_10bds_44",
    "upload-list": "_upload-list_10bds_49",
    "upload-footer": "_upload-footer_10bds_53",
    "upload-stats": "_upload-stats_10bds_61",
    "size-text": "_size-text_10bds_66",
    divider,
    "upload-confirm": "_upload-confirm_10bds_74",
    "confirm-item": "_confirm-item_10bds_78",
    label,
    value,
    size,
    "upload-progress": "_upload-progress_10bds_101",
    "progress-header": "_progress-header_10bds_101",
    "progress-info": "_progress-info_10bds_108",
    percentage,
    "progress-list": "_progress-list_10bds_117",
    "progress-item": "_progress-item_10bds_122",
    "song-info": "_song-info_10bds_132",
    name,
    artist,
    uploadProgressModal,
    progressContent,
    progressInfo,
    detail,
    statsContainer,
    statsItem,
    failedList,
    failedTitle,
    failedItem,
    songName,
    errorMsg,
    uploadModal,
    progressSection,
    count,
    statsTag,
    songList,
    songItem,
    songInfo,
    artistName
  };
  function SingerChoose({ singerList, onChoose, loading }) {
    const renderSingerList = require$$0.useMemo(() => {
      return singerList.map((item) => {
        const { id, name: name2, count: count2, size: size2, sizeDesc } = item;
        return {
          ...item,
          label: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["option-label"], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles["singer-name"], children: name2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["tag-group"], children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "blue", className: styles["tag"], children: [
                count2,
                "首"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "green", className: styles["tag"], children: sizeDesc })
            ] })
          ] }),
          value: id
        };
      });
    }, [singerList]);
    const [formRef] = antd.Form.useForm();
    const handleChoose = (values) => {
      const { singer } = values;
      onChoose([...singer]);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles["singer-choose"], children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Spin, { tip: "正在加载中" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      antd.Form,
      {
        form: formRef,
        onFinish: handleChoose,
        className: styles["singer-choose-form"],
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { name: "singer", label: "歌手", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Select,
            {
              mode: "multiple",
              placeholder: "请选择歌手",
              allowClear: true,
              className: styles["select"],
              filterOption: (input, option) => {
                var _a;
                return ((_a = option.name) == null ? void 0 : _a.toLowerCase().indexOf(input.toLowerCase())) >= 0;
              },
              options: renderSingerList,
              getPopupContainer: (trigger) => trigger.parentNode
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { style: { marginBottom: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles["btn-group"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", htmlType: "submit", children: "选择" }) }) })
        ]
      }
    ) });
  }
  const SearchForm = ({ onSearch, songList: songList2 }) => {
    const [form] = antd.Form.useForm();
    const getUniqueOptions = (key) => {
      const uniqueList = uniqueArrayByKey(songList2, key);
      return uniqueList.map((item) => ({
        label: item[key],
        value: item[key]
      }));
    };
    const handleSearch = () => {
      const values = form.getFieldsValue();
      onSearch(values);
    };
    const handleReset = () => {
      form.resetFields();
      onSearch({});
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form, { form, style: { marginBottom: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { name: "name", style: { marginBottom: 0, minWidth: 200 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Select,
        {
          mode: "multiple",
          allowClear: true,
          showSearch: true,
          placeholder: "歌名",
          maxTagCount: "responsive",
          options: getUniqueOptions("name"),
          filterOption: (input, option) => ((option == null ? void 0 : option.label) ?? "").toLowerCase().includes(input.toLowerCase())
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { name: "artists", style: { marginBottom: 0, minWidth: 200 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Select,
        {
          mode: "multiple",
          allowClear: true,
          showSearch: true,
          placeholder: "歌手",
          maxTagCount: "responsive",
          options: getUniqueOptions("artists"),
          filterOption: (input, option) => ((option == null ? void 0 : option.label) ?? "").toLowerCase().includes(input.toLowerCase())
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { name: "album", style: { marginBottom: 0, minWidth: 200 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Select,
        {
          mode: "multiple",
          allowClear: true,
          showSearch: true,
          placeholder: "专辑",
          maxTagCount: "responsive",
          options: getUniqueOptions("album"),
          filterOption: (input, option) => ((option == null ? void 0 : option.label) ?? "").toLowerCase().includes(input.toLowerCase())
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleSearch, children: "搜索" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: handleReset, children: "重置" })
    ] }) });
  };
  const UploadProgress = require$$0.forwardRef(
    ({ uploadedList, total, uploadFailedSongList, onClose }, ref) => {
      const [visible, setVisible] = require$$0.useState(false);
      const open = () => setVisible(true);
      const close = () => {
        setVisible(false);
        onClose == null ? void 0 : onClose();
      };
      const reset = () => {
      };
      require$$0.useImperativeHandle(ref, () => ({
        open,
        close,
        reset
      }));
      const uploadedCount = uploadedList.length;
      const failedCount = uploadFailedSongList.length;
      const percent = Math.floor((uploadedCount + failedCount) / total * 100);
      const isCompleted = uploadedCount + failedCount === total;
      const songListRef = require$$0.useRef(null);
      require$$0.useEffect(() => {
        let timeId;
        if (visible) {
          timeId = setInterval(() => {
            var _a;
            (_a = songListRef.current) == null ? void 0 : _a.scrollTo({
              top: songListRef.current.scrollHeight,
              behavior: "smooth"
            });
          }, 500);
        }
        return () => {
          clearInterval(timeId);
        };
      }, [visible]);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        antd.Modal,
        {
          title: "上传进度",
          open: visible,
          onCancel: close,
          width: 520,
          maskClosable: false,
          footer: null,
          centered: true,
          className: styles.uploadModal,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.progressSection, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Progress,
                {
                  type: "circle",
                  percent,
                  status: isCompleted ? failedCount > 0 ? "exception" : "success" : "active",
                  format: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.progressInfo, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.percentage, children: [
                      percent,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.count, children: [
                      uploadedCount + failedCount,
                      "/",
                      total
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsContainer, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.statsItem, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "success", className: styles.statsTag, children: [
                  "成功：",
                  uploadedCount
                ] }) }),
                failedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.statsItem, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "error", className: styles.statsTag, children: [
                  "失败：",
                  failedCount
                ] }) })
              ] })
            ] }),
            (uploadedList.length > 0 || uploadFailedSongList.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.songList, ref: songListRef, children: [
              uploadFailedSongList.map((song2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.songItem, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.songInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.songName, children: song2.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.artistName, children: [
                    "- ",
                    song2.artists
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "error", children: "上传失败" })
              ] }, song2.id)),
              uploadedList.map((song2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.songItem, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.songInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.songName, children: song2.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.artistName, children: [
                    "- ",
                    song2.artists
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "success", children: "已上传" })
              ] }, song2.id))
            ] })
          ]
        }
      );
    }
  );
  const UploadStats = require$$0.memo(({ selectedRows, filteredSongList }) => {
    const selectedSize = selectedRows.reduce((acc, cur) => acc + cur.size, 0);
    const totalSize = filteredSongList.reduce((acc, cur) => acc + cur.size, 0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["upload-stats"], children: [
      "已选择",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "blue", style: { margin: 0 }, children: [
        selectedRows.length,
        " 首"
      ] }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles["size-text"], children: +selectedSize && formatFileSize(selectedSize) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.divider, children: "/" }),
      "共",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "green", style: { margin: 0 }, children: [
        filteredSongList.length,
        " 首"
      ] }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles["size-text"], children: formatFileSize(totalSize) })
    ] });
  });
  UploadStats.displayName = "UploadStats";
  function UploadList({ singerList }) {
    const [songList2, setSongList] = require$$0.useState([]);
    const [loading, setLoading] = require$$0.useState(false);
    const getSongList = async (ids) => {
      try {
        setLoading(true);
        if (!(ids == null ? void 0 : ids.length)) return antd.message.error("请先选择歌手");
        const proArr = ids.map(async (id) => {
          const res = await getCDNConfig(id);
          return res.data;
        });
        let allConfig = await Promise.all(proArr);
        allConfig = allConfig.flat();
        const allConfigMap = Object.fromEntries(
          allConfig.map((item) => [item.id, item])
        );
        console.log("allConfig", allConfig);
        const allInfo = await getSongInfoList(allConfig.map((item) => item.id));
        const songList22 = [];
        allInfo.map(({ privileges, songs }) => {
          privileges.forEach((p2) => {
            var _a;
            const otherInfo = allConfigMap[p2.id];
            const defaultItem = {
              ...otherInfo,
              id: p2.id,
              name: "未知",
              album: "未知",
              albumid: 0,
              artists: "未知",
              tns: "",
              //翻译
              dt: formatDuration(0),
              filename: "未知." + (otherInfo == null ? void 0 : otherInfo.ext),
              picUrl: "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
              isNoCopyright: p2.st < 0,
              isVIP: false,
              isPay: false,
              uploaded: p2.cs,
              needMatch: otherInfo.name == void 0
            };
            const songsMap = Object.fromEntries(songs.map((s) => [s.id, s]));
            const song2 = songsMap[p2.id];
            if (song2) {
              Object.assign(defaultItem, song2, {
                album: getAlbumTextInSongDetail(song2),
                artists: getArtistTextInSongDetail(song2),
                dt: formatDuration(song2.dt),
                filename: `${getArtistTextInSongDetail(song2)} - ${song2.name}.${otherInfo.ext}`,
                picUrl: ((_a = song2.al) == null ? void 0 : _a.picUrl) || "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
                isVIP: song2.fee === 1,
                isPay: song2.fee === 4
              });
            }
            if (otherInfo.name) {
              defaultItem.name = otherInfo.name;
              defaultItem.album = otherInfo.al;
              defaultItem.artists = otherInfo.ar;
              defaultItem.filename = `${defaultItem.artists} - ${defaultItem.name}.${otherInfo.ext}`;
            }
            songList22.push(defaultItem);
          });
        });
        setSongList(songList22);
        setFilteredSongList(songList22);
      } catch (error) {
        console.log("error", error);
        antd.message.error("获取歌曲信息失败", error.message);
      } finally {
        setLoading(false);
      }
    };
    require$$0.useEffect(() => {
      getSongList(singerList);
    }, [singerList]);
    const [filteredSongList, setFilteredSongList] = require$$0.useState([]);
    const handleSearch = (values) => {
      const { name: name2, artists, album } = values;
      const filtered = songList2.filter((song2) => {
        const nameMatch = !(name2 == null ? void 0 : name2.length) || name2.some((n2) => song2.name.toLowerCase().includes(n2.toLowerCase()));
        const artistMatch = !(artists == null ? void 0 : artists.length) || artists.some(
          (a) => song2.artists.toLowerCase().includes(a.toLowerCase())
        );
        const albumMatch = !(album == null ? void 0 : album.length) || album.some((a) => song2.album.toLowerCase().includes(a.toLowerCase()));
        return nameMatch && artistMatch && albumMatch;
      });
      setFilteredSongList(filtered);
    };
    const [selectedRows, setSelectedRows] = require$$0.useState([]);
    const rowSelection = {
      type: "checkbox",
      fixed: true,
      getCheckboxProps: (record) => ({
        disabled: record.uploaded
      }),
      onChange: (selectedRowKeys, selectedRows2) => {
        setSelectedRows(selectedRows2);
      }
    };
    const handleUpload = async (record) => {
      try {
        setFilteredSongList((songList22) => {
          return songList22.map((song2) => {
            if (song2.id === record.id) song2.uploading = true;
            return song2;
          });
        });
        const res = await uploadSong(record);
        msgSuccess("上传成功");
        getSongList(singerList);
      } catch (error) {
        console.log("error", error);
      } finally {
        setFilteredSongList((songList22) => {
          return songList22.map((song2) => {
            if (song2.id === record.id) song2.uploading = false;
            return song2;
          });
        });
      }
    };
    const columns = [
      // 上传状态
      {
        title: "上传状态",
        dataIndex: "uploaded",
        key: "uploaded",
        width: 140,
        align: "center",
        filters: [
          { text: "已上传", value: true },
          { text: "未上传", value: false }
        ],
        onFilter: (value2, record) => record.uploaded === value2,
        defaultFilterValue: [false],
        render: (_, record) => {
          if (record.uploaded) return /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "success", children: "已上传" });
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Button,
            {
              type: "primary",
              size: "small",
              onClick: () => handleUpload(record),
              loading: record.uploading,
              children: "上传"
            }
          );
        }
      },
      {
        title: "歌曲",
        dataIndex: "name",
        key: "name",
        width: 200,
        sorter: (a, b) => {
          var _a;
          return (_a = a.name) == null ? void 0 : _a.localeCompare(b.name);
        },
        sortDirections: ["ascend", "descend"],
        render: (text, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: record.picUrl,
              alt: text,
              style: { width: "40px", height: "40px", borderRadius: "4px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: text }),
            record.tns && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: "12px" }, children: record.tns })
          ] })
        ] })
      },
      {
        title: "艺术家",
        dataIndex: "artists",
        key: "artists",
        width: 180,
        sorter: (a, b) => {
          var _a;
          return (_a = a.artists) == null ? void 0 : _a.localeCompare(b.artists);
        },
        sortDirections: ["ascend", "descend"],
        ellipsis: true
      },
      {
        title: "专辑",
        dataIndex: "album",
        key: "album",
        width: 160,
        sorter: (a, b) => {
          var _a;
          return (_a = a.album) == null ? void 0 : _a.localeCompare(b.album);
        },
        sortDirections: ["ascend", "descend"],
        ellipsis: true
      },
      {
        title: "时长",
        dataIndex: "dt",
        key: "dt",
        width: 80,
        sorter: (a, b) => {
          var _a;
          return (_a = a.dt) == null ? void 0 : _a.localeCompare(b.dt);
        },
        sortDirections: ["ascend", "descend"]
      },
      {
        title: "音质",
        key: "quality",
        width: 100,
        render: (_, record) => {
          var _a;
          const quality = [];
          if (record.sq) quality.push("无损");
          if (((_a = record.h) == null ? void 0 : _a.br) >= 32e4) quality.push("320K");
          return quality.join(" / ") || "标准";
        }
      },
      {
        title: "备注",
        key: "status",
        width: 120,
        render: (_, record) => {
          if (record.isNoCopyright) return /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "error", children: "无版权" });
          if (record.isVIP) return /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "warning", children: "VIP" });
          if (record.isPay) return /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "success", children: "付费" });
          if (record.uploaded) return /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "processing", children: "已上传" });
        }
      },
      // 歌曲大小
      {
        title: "歌曲大小",
        dataIndex: "size",
        key: "size",
        width: 120,
        render: (size2) => formatFileSize(size2)
      },
      // 歌曲后缀
      {
        title: "歌曲后缀",
        dataIndex: "ext",
        key: "ext",
        width: 100,
        render: (ext) => /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "blue", children: ext })
      }
    ];
    const handleTableChange = (pagination, filters, sorter) => {
      setFilteredSongList((songList22) => {
        return songList22.sort((a, b) => {
          var _a;
          const order = sorter.order === "ascend" ? 1 : -1;
          return order * ((_a = a[sorter.columnKey]) == null ? void 0 : _a.localeCompare(b[sorter.columnKey]));
        });
      });
    };
    const uploadProgressRef = require$$0.useRef(null);
    const [uploadedSongList, setUploadedSongList] = require$$0.useState([]);
    const [uploadFailedSongList, setUploadFailedSongList] = require$$0.useState([]);
    const [toUploadingSongList, setToUploadingSongList] = require$$0.useState([]);
    const [uploading, setUploading] = require$$0.useState(false);
    const resetData = () => {
      setUploadedSongList([]);
      setToUploadingSongList([]);
      setUploadFailedSongList([]);
    };
    const handleBatchUpload = async (songs) => {
      var _a;
      try {
        if (uploading) return;
        resetData();
        setUploading(true);
        console.log("将要批量上传的选中的歌曲", songs);
        const uploadSongList = filteredSongList.filter((song2) => !song2.uploaded);
        console.log("uploadSongList", uploadSongList);
        setToUploadingSongList(uploadSongList);
        await UploadConfirm({
          total: songs.length,
          uploaded: 0,
          toUpload: uploadSongList
        });
        if (!uploadSongList.length) return msgError("没有可上传的歌曲");
        (_a = uploadProgressRef.current) == null ? void 0 : _a.open();
        const tasks = uploadSongList.map((song2) => async () => {
          try {
            const res = await uploadSong(song2);
            song2.uploaded = true;
            setUploadedSongList((list) => [...list, song2]);
            return res;
          } catch (error) {
            song2.uploaded = true;
            setUploadFailedSongList((list) => [...list, song2]);
            return error;
          }
        });
        const results = await promiseLimit(tasks);
        getSongList(singerList);
        const successCount = results.filter((r) => !(r instanceof Error)).length;
        const failedCount = results.length - successCount;
        msgSuccess(`上传完成: 成功${successCount}首，失败${failedCount}首`);
      } catch (error) {
        console.log("error", error);
      } finally {
        setUploading(false);
      }
    };
    const handleUploadAll = async () => {
      handleBatchUpload(filteredSongList);
    };
    const handleUploadSelected = async () => {
      handleBatchUpload(selectedRows);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      (singerList == null ? void 0 : singerList.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["upload-list"], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SearchForm, { onSearch: handleSearch, songList: songList2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          antd.Table,
          {
            rowSelection,
            dataSource: filteredSongList,
            columns,
            scroll: { y: 400, x: 1e3 },
            size: "small",
            loading,
            rowKey: ({ artists, id, name: name2 }) => name2 + artists + id,
            onChange: handleTableChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["upload-footer"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            UploadStats,
            {
              selectedRows,
              filteredSongList
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Button,
            {
              type: "primary",
              onClick: () => handleUploadSelected(),
              disabled: !selectedRows.length,
              loading: uploading,
              children: "批量上传"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Button,
            {
              type: "primary",
              onClick: () => handleUploadAll(),
              loading: uploading,
              children: "全部上传"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Empty,
        {
          description: "请先选择歌手",
          style: {
            height: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        UploadProgress,
        {
          ref: uploadProgressRef,
          total: toUploadingSongList.length,
          uploadedList: uploadedSongList,
          uploadFailedSongList
        }
      )
    ] });
  }
  const UploadConfirm = ({ total, uploaded, toUpload }) => {
    return confirm(
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["upload-confirm"], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["confirm-item"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: "总计歌曲：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.value, children: [
            total,
            " 首"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["confirm-item"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: "已上传：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.value, children: [
            uploaded,
            " 首"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["confirm-item"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: "待上传：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.value, children: [
            toUpload.length,
            " 首",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.size, children: [
              "（",
              formatFileSize(toUpload.reduce((acc, cur) => acc + cur.size, 0)),
              "）"
            ] })
          ] })
        ] })
      ] }),
      "上传歌曲"
    );
  };
  const { TabPane } = antd.Tabs;
  function QuickUpload(props, ref) {
    const [visible, setVisible] = require$$0.useState(false);
    const open = () => {
      reset();
      getSingerList();
      setVisible(true);
    };
    const close = () => setVisible(false);
    const reset = () => {
      setSingerList([]);
    };
    const [currentTab, setCurrentTab] = require$$0.useState("1");
    const [singerList, setSingerList] = require$$0.useState([]);
    const [loading, setLoading] = require$$0.useState(false);
    const getSingerList = async () => {
      try {
        setLoading(true);
        const res = await getArtists();
        setSingerList(res);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    const [chooseList, setChooseList] = require$$0.useState([]);
    const handleChoose = (value2) => {
      console.log(value2);
      setChooseList(value2);
      setCurrentTab("2");
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      reset
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        title: "云盘快速上传",
        width: 900,
        centered: true,
        open: visible,
        footer: null,
        onCancel: close,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          antd.Tabs,
          {
            defaultActiveKey: "1",
            activeKey: currentTab,
            className: styles["quick-upload-tabs"],
            onChange: (key) => setCurrentTab(key),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabPane, { tab: "歌曲选择", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SingerChoose,
                {
                  singerList,
                  loading,
                  onChoose: handleChoose
                }
              ) }, "1"),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabPane, { tab: "上传列表", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UploadList, { singerList: chooseList }) }, "2")
            ]
          }
        )
      }
    );
  }
  const QuickUpload$1 = require$$0.forwardRef(QuickUpload);
  const MatchCorrect = require$$0.forwardRef((props, ref) => {
    const [visible, setVisible] = require$$0.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      reset
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        title: "云盘匹配纠正",
        open: visible,
        onCancel: close,
        footer: null
      }
    );
  });
  const QualityUpgrade = require$$0.forwardRef((props, ref) => {
    const [visible, setVisible] = require$$0.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      reset
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        title: "云盘音质提升",
        open: visible,
        onCancel: close,
        width: 800,
        footer: null
      }
    );
  });
  const LocalUpload = require$$0.forwardRef((props, ref) => {
    const [visible, setVisible] = require$$0.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      reset
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        title: "云盘本地上传",
        open: visible,
        onCancel: close,
        footer: null
      }
    );
  });
  const VipSongA = require$$0.forwardRef((props, ref) => {
    const [visible, setVisible] = require$$0.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      reset
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        title: "网页VIP歌曲A",
        open: visible,
        onCancel: close,
        width: 800,
        footer: null
      }
    );
  });
  const VipSongB = require$$0.forwardRef((props, ref) => {
    const [visible, setVisible] = require$$0.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      reset
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        title: "网页VIP歌曲B",
        open: visible,
        onCancel: close,
        width: 800,
        footer: null
      }
    );
  });
  const CloudExport = require$$0.forwardRef((props, ref) => {
    const [visible, setVisible] = require$$0.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      reset
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        title: "云盘导出",
        open: visible,
        onCancel: close,
        footer: null,
        centered: true
      }
    );
  });
  const CloudImport = require$$0.forwardRef((props, ref) => {
    const [visible, setVisible] = require$$0.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      reset
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        title: "云盘导入",
        open: visible,
        onCancel: close,
        footer: null
      }
    );
  });
  const ButtonGroup = () => {
    const quickUploadRef = require$$0.useRef(null);
    const handleQuickUpload = () => {
      quickUploadRef.current.open();
    };
    const matchCorrectRef = require$$0.useRef(null);
    const qualityUpgradeRef = require$$0.useRef(null);
    const localUploadRef = require$$0.useRef(null);
    const vipSongARef = require$$0.useRef(null);
    const vipSongBRef = require$$0.useRef(null);
    const cloudExportRef = require$$0.useRef(null);
    const cloudImportRef = require$$0.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["button-group"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tooltip, { title: "云盘快速上传", placement: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Button,
        {
          type: "primary",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(icons.CloudUploadOutlined, {}),
          onClick: handleQuickUpload,
          className: styles$1["button"]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickUpload$1, { ref: quickUploadRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCorrect, { ref: matchCorrectRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QualityUpgrade, { ref: qualityUpgradeRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LocalUpload, { ref: localUploadRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VipSongA, { ref: vipSongARef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VipSongB, { ref: vipSongBRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CloudExport, { ref: cloudExportRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CloudImport, { ref: cloudImportRef })
    ] });
  };
  function App() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "App", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroup, {}) });
  }
  const theme = {
    // 品牌色
    token: {
      // 主色
      colorPrimary: "#C20C0C",
      // 网易云特征红色
      colorPrimaryHover: "#D81E06",
      colorPrimaryActive: "#A00606",
      // 文字颜色
      colorText: "#333333",
      colorTextSecondary: "#666666",
      colorTextTertiary: "#999999",
      colorTextDescription: "#666666",
      // 背景色
      colorBgContainer: "#FFFFFF",
      colorBgLayout: "#F5F5F5",
      colorBgMask: "rgba(0, 0, 0, 0.45)",
      // 边框颜色
      colorBorder: "#E1E1E1",
      colorBorderSecondary: "#F0F0F0",
      // 链接颜色
      colorLink: "#0C73C2",
      colorLinkHover: "#2994E7",
      colorLinkActive: "#095C9C",
      // 成功、警告、错误状态色
      colorSuccess: "#52C41A",
      colorWarning: "#FAAD14",
      colorError: "#FF4D4F",
      // 字体
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      fontSize: 14,
      // 圆角
      borderRadius: 4,
      borderRadiusLG: 8,
      borderRadiusSM: 2,
      // 间距
      marginXS: 8,
      marginSM: 12,
      margin: 16,
      marginMD: 20,
      marginLG: 24,
      marginXL: 32,
      // 动画
      motionDurationFast: "0.1s",
      motionDurationMid: "0.2s",
      motionDurationSlow: "0.3s",
      motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      motionEaseOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      motionEaseIn: "cubic-bezier(0.4, 0, 1, 1)"
    },
    // 组件级别的样式定制
    components: {
      Button: {
        colorPrimary: "#C20C0C",
        algorithm: true
        // 启用算法
      },
      Input: {
        colorBorder: "#E1E1E1",
        algorithm: true
      }
    }
  };
  var zh_CN$6 = {};
  var interopRequireDefault = { exports: {} };
  (function(module) {
    function _interopRequireDefault2(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }
    module.exports = _interopRequireDefault2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(interopRequireDefault);
  var interopRequireDefaultExports = interopRequireDefault.exports;
  var zh_CN$5 = {};
  Object.defineProperty(zh_CN$5, "__esModule", {
    value: true
  });
  zh_CN$5.default = void 0;
  var locale$3 = {
    // Options
    items_per_page: "条/页",
    jump_to: "跳至",
    jump_to_confirm: "确定",
    page: "页",
    // Pagination
    prev_page: "上一页",
    next_page: "下一页",
    prev_5: "向前 5 页",
    next_5: "向后 5 页",
    prev_3: "向前 3 页",
    next_3: "向后 3 页",
    page_size: "页码"
  };
  zh_CN$5.default = locale$3;
  var zh_CN$4 = {};
  var zh_CN$3 = {};
  var zh_CN$2 = {};
  var objectSpread2 = { exports: {} };
  var defineProperty = { exports: {} };
  var toPropertyKey = { exports: {} };
  var _typeof = { exports: {} };
  (function(module) {
    function _typeof2(o) {
      "@babel/helpers - typeof";
      return module.exports = _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof2(o);
    }
    module.exports = _typeof2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(_typeof);
  var _typeofExports = _typeof.exports;
  var toPrimitive = { exports: {} };
  (function(module) {
    var _typeof2 = _typeofExports["default"];
    function toPrimitive2(t, r) {
      if ("object" != _typeof2(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof2(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    module.exports = toPrimitive2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(toPrimitive);
  var toPrimitiveExports = toPrimitive.exports;
  (function(module) {
    var _typeof2 = _typeofExports["default"];
    var toPrimitive2 = toPrimitiveExports;
    function toPropertyKey2(t) {
      var i = toPrimitive2(t, "string");
      return "symbol" == _typeof2(i) ? i : i + "";
    }
    module.exports = toPropertyKey2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(toPropertyKey);
  var toPropertyKeyExports = toPropertyKey.exports;
  (function(module) {
    var toPropertyKey2 = toPropertyKeyExports;
    function _defineProperty(e, r, t) {
      return (r = toPropertyKey2(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(defineProperty);
  var definePropertyExports = defineProperty.exports;
  (function(module) {
    var defineProperty2 = definePropertyExports;
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread22(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          defineProperty2(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    module.exports = _objectSpread22, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(objectSpread2);
  var objectSpread2Exports = objectSpread2.exports;
  var common = {};
  Object.defineProperty(common, "__esModule", {
    value: true
  });
  common.commonLocale = void 0;
  common.commonLocale = {
    yearFormat: "YYYY",
    dayFormat: "D",
    cellMeridiemFormat: "A",
    monthBeforeYear: true
  };
  var _interopRequireDefault$3 = interopRequireDefaultExports.default;
  Object.defineProperty(zh_CN$2, "__esModule", {
    value: true
  });
  zh_CN$2.default = void 0;
  var _objectSpread2 = _interopRequireDefault$3(objectSpread2Exports);
  var _common = common;
  var locale$2 = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _common.commonLocale), {}, {
    locale: "zh_CN",
    today: "今天",
    now: "此刻",
    backToToday: "返回今天",
    ok: "确定",
    timeSelect: "选择时间",
    dateSelect: "选择日期",
    weekSelect: "选择周",
    clear: "清除",
    month: "月",
    year: "年",
    previousMonth: "上个月 (翻页上键)",
    nextMonth: "下个月 (翻页下键)",
    monthSelect: "选择月份",
    yearSelect: "选择年份",
    decadeSelect: "选择年代",
    previousYear: "上一年 (Control键加左方向键)",
    nextYear: "下一年 (Control键加右方向键)",
    previousDecade: "上一年代",
    nextDecade: "下一年代",
    previousCentury: "上一世纪",
    nextCentury: "下一世纪",
    yearFormat: "YYYY年",
    cellDateFormat: "D",
    monthBeforeYear: false
  });
  zh_CN$2.default = locale$2;
  var zh_CN$1 = {};
  Object.defineProperty(zh_CN$1, "__esModule", {
    value: true
  });
  zh_CN$1.default = void 0;
  const locale$1 = {
    placeholder: "请选择时间",
    rangePlaceholder: ["开始时间", "结束时间"]
  };
  zh_CN$1.default = locale$1;
  var _interopRequireDefault$2 = interopRequireDefaultExports.default;
  Object.defineProperty(zh_CN$3, "__esModule", {
    value: true
  });
  zh_CN$3.default = void 0;
  var _zh_CN$2 = _interopRequireDefault$2(zh_CN$2);
  var _zh_CN2$1 = _interopRequireDefault$2(zh_CN$1);
  const locale = {
    lang: Object.assign({
      placeholder: "请选择日期",
      yearPlaceholder: "请选择年份",
      quarterPlaceholder: "请选择季度",
      monthPlaceholder: "请选择月份",
      weekPlaceholder: "请选择周",
      rangePlaceholder: ["开始日期", "结束日期"],
      rangeYearPlaceholder: ["开始年份", "结束年份"],
      rangeMonthPlaceholder: ["开始月份", "结束月份"],
      rangeQuarterPlaceholder: ["开始季度", "结束季度"],
      rangeWeekPlaceholder: ["开始周", "结束周"]
    }, _zh_CN$2.default),
    timePickerLocale: Object.assign({}, _zh_CN2$1.default)
  };
  locale.lang.ok = "确定";
  zh_CN$3.default = locale;
  var _interopRequireDefault$1 = interopRequireDefaultExports.default;
  Object.defineProperty(zh_CN$4, "__esModule", {
    value: true
  });
  zh_CN$4.default = void 0;
  var _zh_CN$1 = _interopRequireDefault$1(zh_CN$3);
  zh_CN$4.default = _zh_CN$1.default;
  var _interopRequireDefault = interopRequireDefaultExports.default;
  Object.defineProperty(zh_CN$6, "__esModule", {
    value: true
  });
  zh_CN$6.default = void 0;
  var _zh_CN = _interopRequireDefault(zh_CN$5);
  var _zh_CN2 = _interopRequireDefault(zh_CN$4);
  var _zh_CN3 = _interopRequireDefault(zh_CN$3);
  var _zh_CN4 = _interopRequireDefault(zh_CN$1);
  const typeTemplate = "${label}不是一个有效的${type}";
  const localeValues = {
    locale: "zh-cn",
    Pagination: _zh_CN.default,
    DatePicker: _zh_CN3.default,
    TimePicker: _zh_CN4.default,
    Calendar: _zh_CN2.default,
    // locales for all components
    global: {
      placeholder: "请选择"
    },
    Table: {
      filterTitle: "筛选",
      filterConfirm: "确定",
      filterReset: "重置",
      filterEmptyText: "无筛选项",
      filterCheckall: "全选",
      filterSearchPlaceholder: "在筛选项中搜索",
      emptyText: "暂无数据",
      selectAll: "全选当页",
      selectInvert: "反选当页",
      selectNone: "清空所有",
      selectionAll: "全选所有",
      sortTitle: "排序",
      expand: "展开行",
      collapse: "关闭行",
      triggerDesc: "点击降序",
      triggerAsc: "点击升序",
      cancelSort: "取消排序"
    },
    Modal: {
      okText: "确定",
      cancelText: "取消",
      justOkText: "知道了"
    },
    Tour: {
      Next: "下一步",
      Previous: "上一步",
      Finish: "结束导览"
    },
    Popconfirm: {
      cancelText: "取消",
      okText: "确定"
    },
    Transfer: {
      titles: ["", ""],
      searchPlaceholder: "请输入搜索内容",
      itemUnit: "项",
      itemsUnit: "项",
      remove: "删除",
      selectCurrent: "全选当页",
      removeCurrent: "删除当页",
      selectAll: "全选所有",
      deselectAll: "取消全选",
      removeAll: "删除全部",
      selectInvert: "反选当页"
    },
    Upload: {
      uploading: "文件上传中",
      removeFile: "删除文件",
      uploadError: "上传错误",
      previewFile: "预览文件",
      downloadFile: "下载文件"
    },
    Empty: {
      description: "暂无数据"
    },
    Icon: {
      icon: "图标"
    },
    Text: {
      edit: "编辑",
      copy: "复制",
      copied: "复制成功",
      expand: "展开",
      collapse: "收起"
    },
    Form: {
      optional: "（可选）",
      defaultValidateMessages: {
        default: "字段验证错误${label}",
        required: "请输入${label}",
        enum: "${label}必须是其中一个[${enum}]",
        whitespace: "${label}不能为空字符",
        date: {
          format: "${label}日期格式无效",
          parse: "${label}不能转换为日期",
          invalid: "${label}是一个无效日期"
        },
        types: {
          string: typeTemplate,
          method: typeTemplate,
          array: typeTemplate,
          object: typeTemplate,
          number: typeTemplate,
          date: typeTemplate,
          boolean: typeTemplate,
          integer: typeTemplate,
          float: typeTemplate,
          regexp: typeTemplate,
          email: typeTemplate,
          url: typeTemplate,
          hex: typeTemplate
        },
        string: {
          len: "${label}须为${len}个字符",
          min: "${label}最少${min}个字符",
          max: "${label}最多${max}个字符",
          range: "${label}须在${min}-${max}字符之间"
        },
        number: {
          len: "${label}必须等于${len}",
          min: "${label}最小值为${min}",
          max: "${label}最大值为${max}",
          range: "${label}须在${min}-${max}之间"
        },
        array: {
          len: "须为${len}个${label}",
          min: "最少${min}个${label}",
          max: "最多${max}个${label}",
          range: "${label}数量须在${min}-${max}之间"
        },
        pattern: {
          mismatch: "${label}与模式不匹配${pattern}"
        }
      }
    },
    Image: {
      preview: "预览"
    },
    QRCode: {
      expired: "二维码过期",
      refresh: "点击刷新",
      scanned: "已扫描"
    },
    ColorPicker: {
      presetEmpty: "暂无",
      transparent: "无色",
      singleColor: "单色",
      gradientColor: "渐变色"
    }
  };
  zh_CN$6.default = localeValues;
  var zh_CN = zh_CN$6;
  const zhCN = /* @__PURE__ */ getDefaultExportFromCjs(zh_CN);
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.ConfigProvider, { locale: zhCN, theme, children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
  );

})(React, antd, ReactDOM, @ant-design/icons, node-forge);