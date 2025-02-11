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
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/antd@5.22.4/dist/antd.min.js
// @require      https://cdn.jsdelivr.net/npm/@ant-design/icons@5.5.2/dist/index.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js
// @connect      music.163.com
// @connect      interface.music.163.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

(_=>{if(typeof GM_addStyle=="function"){GM_addStyle(_);return}const o=document.createElement("style");o.textContent=_,document.head.append(o)})(" ._button-group_dcsms_1{position:fixed;right:20px;top:50%;width:44px;max-height:400px;overflow-y:auto;background:#ffffffe6;border-radius:22px;box-shadow:0 2px 10px #0000001a;padding:10px 0;z-index:999}._button-group_dcsms_1::-webkit-scrollbar{width:0;background:transparent}._button-group_dcsms_1 .ant-btn{width:36px;height:36px;padding:0;border:none;background:transparent;display:flex;align-items:center;justify-content:center;margin:4px auto;transition:all .3s}._button-group_dcsms_1 .ant-btn:hover{background:#c20c0c1a;color:#fff;transform:scale(1.1)}._button-group_dcsms_1 .ant-btn:active{transform:scale(.95)}._button-group_dcsms_1 .ant-btn .anticon{font-size:20px;color:#666}._button-group_dcsms_1 .ant-btn:hover .anticon{color:#fff}._button-group_dcsms_1 .ant-tooltip .ant-tooltip-inner{background-color:#000c;border-radius:4px;font-size:12px;padding:4px 8px}._button-group_dcsms_1 .ant-tooltip .ant-tooltip-arrow-content{background-color:#000c}._quick-upload-tabs_10bds_1 .ant-spin{width:100%;height:100%}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-default{border-color:#d9d9d9;color:#333}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-default:hover{border-color:#c20c0c;color:#c20c0c}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-primary{background:#c20c0c;border-color:#c20c0c}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-primary:hover{background:#a40a0a;border-color:#a40a0a}._quick-upload-tabs_10bds_1 ._select_10bds_21{width:100%}._quick-upload-tabs_10bds_1 ._option-label_10bds_24{display:flex;align-items:center;gap:8px;justify-content:space-between;width:100%}._quick-upload-tabs_10bds_1 ._option-label_10bds_24 ._singer-name_10bds_31{font-weight:500}._quick-upload-tabs_10bds_1 ._option-label_10bds_24 ._tag-group_10bds_34 ._tag_10bds_34:not(:last-child){margin-right:8px}._singer-choose_10bds_38 ._singer-choose-form_10bds_38{display:flex;flex-direction:column;justify-content:space-between;height:400px}._singer-choose_10bds_38 ._singer-choose-form_10bds_38 ._btn-group_10bds_44{display:flex;justify-content:flex-end}._upload-list_10bds_49 .ant-table{margin:16px 0}._upload-footer_10bds_53{width:100%;display:flex;justify-content:flex-end;align-items:center;gap:8px}._upload-stats_10bds_61{color:#666;font-size:13px;margin-right:auto}._upload-stats_10bds_61 ._size-text_10bds_66{color:#999}._upload-stats_10bds_61 ._divider_10bds_69{margin:0 8px;color:#d9d9d9}._upload-confirm_10bds_74{padding:16px 0;font-size:14px}._upload-confirm_10bds_74 ._confirm-item_10bds_78{display:flex;align-items:center;margin-bottom:12px}._upload-confirm_10bds_74 ._confirm-item_10bds_78:last-child{margin-bottom:0}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._label_10bds_86{color:#666;width:80px;flex-shrink:0}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._value_10bds_91{color:#333;font-weight:500}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._value_10bds_91 ._size_10bds_66{margin-left:4px;color:#999;font-weight:400}._upload-progress_10bds_101 ._progress-header_10bds_101{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding:0 4px}._upload-progress_10bds_101 ._progress-header_10bds_101 ._progress-info_10bds_108{font-size:14px;color:#333}._upload-progress_10bds_101 ._progress-header_10bds_101 ._percentage_10bds_112{font-size:14px;font-weight:500;color:#1890ff}._upload-progress_10bds_101 ._progress-list_10bds_117{max-height:300px;overflow-y:auto;padding:0 4px}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122:last-child{border-bottom:none}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132{flex:1;min-width:0;padding-right:16px}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132 ._name_10bds_137{font-size:14px;color:#333}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132 ._artist_10bds_141{font-size:14px;color:#666;margin-left:4px}._uploadProgressModal_10bds_147 .ant-modal-body{padding:24px}._uploadProgressModal_10bds_147 ._progressContent_10bds_150{display:flex;flex-direction:column;align-items:center;gap:24px}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156{display:flex;flex-direction:column;align-items:center}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156 ._percentage_10bds_112{font-size:24px;font-weight:500;color:#333}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156 ._detail_10bds_166{font-size:14px;color:#666;margin-top:4px}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171{display:flex;justify-content:space-around;width:100%;padding:16px 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179{text-align:center}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179 ._label_10bds_86{font-size:14px;color:#666;margin-bottom:8px}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179 ._value_10bds_91 .ant-tag{margin:0;font-size:14px;padding:4px 12px}._uploadProgressModal_10bds_147 ._failedList_10bds_192{width:100%}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedTitle_10bds_195{font-size:14px;color:#333;margin-bottom:12px;font-weight:500}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201{padding:8px 12px;background:#fff1f0;border-radius:4px;margin-bottom:8px}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201 ._songName_10bds_207{font-size:14px;color:#333;margin-bottom:4px}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201 ._errorMsg_10bds_212{font-size:12px;color:#ff4d4f}._uploadModal_10bds_217 .ant-modal-body{padding:24px}._progressSection_10bds_221{display:flex;flex-direction:column;align-items:center;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f0f0f0}._progressInfo_10bds_156{display:flex;flex-direction:column;align-items:center}._progressInfo_10bds_156 ._percentage_10bds_112{font-size:24px;font-weight:500;color:#333}._progressInfo_10bds_156 ._count_10bds_240{font-size:14px;color:#666;margin-top:4px}._statsContainer_10bds_171{display:flex;justify-content:center;gap:16px;margin-top:20px}._statsContainer_10bds_171 ._statsItem_10bds_179{text-align:center}._statsContainer_10bds_171 ._statsTag_10bds_255{padding:4px 12px;font-size:14px}._songList_10bds_260{max-height:300px;overflow-y:auto;padding-right:4px}._songList_10bds_260::-webkit-scrollbar{width:6px}._songList_10bds_260::-webkit-scrollbar-thumb{background-color:#d9d9d9;border-radius:3px}._songList_10bds_260::-webkit-scrollbar-thumb:hover{background-color:#bfbfbf}._songItem_10bds_276{display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:4px;background:#fafafa}._songItem_10bds_276:not(:last-child){margin-bottom:8px}._songItem_10bds_276:hover{background:#f5f5f5}._songInfo_10bds_291{display:flex;align-items:center;gap:8px;flex:1;min-width:0}._songInfo_10bds_291 ._songName_10bds_207{font-weight:500;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}._songInfo_10bds_291 ._artistName_10bds_305{color:#666;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}._songInfoColumn_19jjf_1{display:flex;align-items:center;gap:8px}._songInfoColumn_19jjf_1 ._songCover_19jjf_6{width:40px;height:40px;border-radius:4px}._songInfoColumn_19jjf_1 ._songInfo_19jjf_1{flex:1 1 0px;overflow:hidden}._songInfoColumn_19jjf_1 ._songInfo_19jjf_1 ._songName_19jjf_15{font-size:14px;color:#333;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}._songInfoColumn_19jjf_1 ._songInfo_19jjf_1 ._songId_19jjf_24{font-size:12px;color:#999}._footer_19jjf_29{margin-top:16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f0f0f0;padding:16px 0}._footer_19jjf_29 ._actions_19jjf_37{display:flex;gap:8px}._stats_19jjf_42{display:flex;align-items:center;gap:8px}._stats_19jjf_42 ._size_19jjf_47{color:#666}._stats_19jjf_42 ._divider_19jjf_50{color:#999;margin:0 4px}._stats_19jjf_42 .ant-tag{margin:0}._playlist_19jjf_58 .ant-modal-body{padding-bottom:0}._autoAddContent_19jjf_62 ._title_19jjf_62{font-size:16px;margin-bottom:8px}._autoAddContent_19jjf_62 ._statsWrapper_19jjf_66{margin-bottom:16px}._autoAddContent_19jjf_62 ._statsContent_19jjf_69{display:flex;gap:16px;background:#f5f5f5;padding:12px 16px;border-radius:8px}._autoAddContent_19jjf_62 ._statsContent_19jjf_69 ._label_19jjf_76{color:#666}._autoAddContent_19jjf_62 ._statsContent_19jjf_69 ._value_19jjf_79{color:#1890ff;font-size:18px;font-weight:700}._autoAddContent_19jjf_62 ._listHeader_19jjf_84{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}._autoAddContent_19jjf_62 ._listWrapper_19jjf_90{margin:8px 0;max-height:200px;overflow-y:auto;padding:12px;border:1px solid #d9d9d9;border-radius:8px;background:#fff}._autoAddContent_19jjf_62 ._listWrapper_19jjf_90::-webkit-scrollbar{width:6px;height:6px}._autoAddContent_19jjf_62 ._listWrapper_19jjf_90::-webkit-scrollbar-thumb{border-radius:3px;background:#0003}._autoAddContent_19jjf_62 ._listWrapper_19jjf_90::-webkit-scrollbar-track{border-radius:3px;background:#0000001a}._autoAddContent_19jjf_62 ._listItem_19jjf_111{margin-bottom:8px;display:flex;justify-content:space-between;padding:4px 8px;border-radius:4px;transition:all .3s;cursor:default;background:#fff}._autoAddContent_19jjf_62 ._listItem_19jjf_111:hover{background:#f5f5f5}._autoAddContent_19jjf_62 ._listItem_19jjf_111:last-child{margin-bottom:0}._autoAddContent_19jjf_62 ._listItem_19jjf_111 ._itemName_19jjf_127{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}._autoAddContent_19jjf_62 ._listItem_19jjf_111 ._itemCount_19jjf_133{color:#1890ff;margin-left:8px}._deleteConfirmation_19jjf_138{font-size:14px}._deleteConfirmation_19jjf_138 ._title_19jjf_62{font-size:16px;font-weight:700;margin-bottom:12px}._deleteConfirmation_19jjf_138 ._title_19jjf_62 ._count_19jjf_146{color:#1890ff}._deleteConfirmation_19jjf_138 ._songs_19jjf_149{max-height:220px;overflow-y:auto;margin:12px 0;padding:8px;background:#f8f8f8;border-radius:6px;border:1px solid #e8e8e8;line-height:1.6;color:#666}._deleteConfirmation_19jjf_138 ._songs_19jjf_149 ._songItem_19jjf_160{padding:4px 8px;border-radius:4px;transition:all .3s}._deleteConfirmation_19jjf_138 ._songs_19jjf_149 ._songItem_19jjf_160:hover{background:#f0f0f0}._deleteConfirmation_19jjf_138 ._songs_19jjf_149 ._songItem_19jjf_160:not(:last-child){margin-bottom:4px}._deleteConfirmation_19jjf_138 ._warning_19jjf_171{background:#fff2f0;border:1px solid #ffccc7;border-radius:6px;padding:5px;margin-top:12px}._deleteConfirmation_19jjf_138 ._warning_19jjf_171 ._text_19jjf_178{color:#ff4d4f;margin:0;display:flex;align-items:center;gap:8px}._deleteConfirmation_19jjf_138 ._warning_19jjf_171 ._icon_19jjf_185{flex:0 0 20px;display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;border-radius:50%;background:#ff4d4f;color:#fff;font-size:14px;font-weight:700}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent;border-radius:6px}::-webkit-scrollbar-thumb{background:#8080804d;border-radius:6px;transition:all .2s ease-in-out}::-webkit-scrollbar-thumb:hover{background:#80808080}*{scrollbar-width:thin;scrollbar-color:rgba(128,128,128,.3) transparent} ");

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
  const styles$2 = {
    "button-group": "_button-group_dcsms_1"
  };
  const QUALITY_LEVELS = {
    jymaster: "超清母带",
    dolby: "杜比全景声",
    sky: "沉浸环绕声",
    jyeffect: "高清环绕声",
    hires: "Hi-Res",
    lossless: "无损",
    exhigh: "极高",
    higher: "较高",
    standard: "标准",
    超清母带: "jymaster",
    杜比全景声: "dolby",
    沉浸环绕声: "sky",
    高清环绕声: "jyeffect",
    "Hi-Res": "hires",
    无损: "lossless",
    极高: "exhigh",
    较高: "higher",
    标准: "standard"
  };
  const BASE_CDN_URL = "https://fastly.jsdelivr.net/gh/520Qiuyu/cdn@latest/artist/";
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
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
  const getGlobalThis = () => {
    return typeof _unsafeWindow !== "undefined" ? _unsafeWindow : window;
  };
  const getGUser = () => {
    const globalThis = getGlobalThis();
    return globalThis.GUser || {};
  };
  const truncateString = (str, maxLength) => {
    let len = 0;
    let result = "";
    for (let char of str) {
      const charLen = char.charCodeAt(0) > 255 ? 2 : 1;
      if (len + charLen > maxLength) break;
      result += char;
      len += charLen;
    }
    return result;
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const msgSuccess = (content) => {
    antd.message.success(content);
  };
  const msgWarning = (content) => {
    antd.message.warning(content);
  };
  const msgError = (content) => {
    antd.message.error(content);
  };
  const confirm = (content, title2, otherOptions = {}) => {
    return new Promise((resolve, reject) => {
      antd.Modal.confirm({
        centered: true,
        content,
        icon: null,
        closable: true,
        title: title2 || "提示",
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
  const PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----";
  const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const aesEncrypt = (text2, key, iv) => {
    const cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(text2, "utf8"));
    cipher.finish();
    return forge.util.encode64(cipher.output.getBytes());
  };
  const rsaEncrypt = (text2, key) => {
    const publicKey = forge.pki.publicKeyFromPem(key);
    const encrypted = publicKey.encrypt(text2, "NONE");
    return forge.util.bytesToHex(encrypted);
  };
  const weapi = (object) => {
    const text2 = JSON.stringify(object);
    const secretKey = Array.from(
      { length: 16 },
      () => BASE62.charAt(Math.floor(Math.random() * 62))
    ).join("");
    return {
      params: aesEncrypt(aesEncrypt(text2, PRESET_KEY, IV), secretKey, IV),
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
    const {
      data = {},
      clientType = "pc",
      ip,
      onerror,
      onload,
      originResponse = false,
      ...rest
    } = config;
    const csrfToken = document.cookie.match(/_csrf=([^(;|$)]+)/);
    data.csrf_token = csrfToken ? csrfToken[1] : "";
    const encryptedData = weapi(data);
    console.log({
      url,
      data,
      encryptedData
    });
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
        onload: (res) => resolve(originResponse ? res : res.response),
        onerror: reject
      });
    });
  };
  const weapiFetch = async (url, config) => {
    const {
      data = {},
      clientType = "pc",
      ip,
      originResponse = false,
      ...rest
    } = config;
    const csrfToken = document.cookie.match(/_csrf=([^(;|$)]+)/);
    data.csrf_token = csrfToken ? csrfToken[1] : "";
    const encryptedData = weapi(data);
    console.log({
      url,
      data,
      encryptedData
    });
    const headers = {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": CLIENT_CONFIG[clientType].userAgent,
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9",
      origin: "https://music.163.com",
      referer: "https://music.163.com/"
    };
    if (ip) {
      headers["X-Real-IP"] = ip;
      headers["X-Forwarded-For"] = ip;
    }
    if (CLIENT_CONFIG[clientType].cookie) {
      headers.cookie = CLIENT_CONFIG[clientType].cookie;
    }
    try {
      const baseUrl = "https://music.163.com";
      const fullUrl = new URL(url.replace("api", "weapi"), baseUrl);
      fullUrl.searchParams.append("csrf_token", data.csrf_token);
      const response = await fetch(fullUrl.toString(), {
        method: "POST",
        headers,
        body: `params=${encodeURIComponent(
        encryptedData.params
      )}&encSecKey=${encodeURIComponent(encryptedData.encSecKey)}`,
        credentials: "include",
        // 包含cookies
        mode: "cors",
        // 启用CORS
        redirect: "follow"
        // 自动跟随重定向
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const result = await response.json();
      if (result.code !== 200 && !originResponse) {
        throw new Error(result.msg || result.message || "API请求失败");
      }
      return originResponse ? {
        headers: response.headers,
        ...result
      } : result;
    } catch (error) {
      console.error("请求失败:", error);
      throw new Error(`请求失败: ${error.message || "未知错误"}`);
    }
  };
  var browser = {};
  var canPromise$1 = function() {
    return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
  };
  var qrcode = {};
  var utils$1 = {};
  let toSJISFunction;
  const CODEWORDS_COUNT = [
    0,
    // Not used
    26,
    44,
    70,
    100,
    134,
    172,
    196,
    242,
    292,
    346,
    404,
    466,
    532,
    581,
    655,
    733,
    815,
    901,
    991,
    1085,
    1156,
    1258,
    1364,
    1474,
    1588,
    1706,
    1828,
    1921,
    2051,
    2185,
    2323,
    2465,
    2611,
    2761,
    2876,
    3034,
    3196,
    3362,
    3532,
    3706
  ];
  utils$1.getSymbolSize = function getSymbolSize(version2) {
    if (!version2) throw new Error('"version" cannot be null or undefined');
    if (version2 < 1 || version2 > 40) throw new Error('"version" should be in range from 1 to 40');
    return version2 * 4 + 17;
  };
  utils$1.getSymbolTotalCodewords = function getSymbolTotalCodewords(version2) {
    return CODEWORDS_COUNT[version2];
  };
  utils$1.getBCHDigit = function(data) {
    let digit = 0;
    while (data !== 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  };
  utils$1.setToSJISFunction = function setToSJISFunction(f2) {
    if (typeof f2 !== "function") {
      throw new Error('"toSJISFunc" is not a valid function.');
    }
    toSJISFunction = f2;
  };
  utils$1.isKanjiModeEnabled = function() {
    return typeof toSJISFunction !== "undefined";
  };
  utils$1.toSJIS = function toSJIS(kanji2) {
    return toSJISFunction(kanji2);
  };
  var errorCorrectionLevel = {};
  (function(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid2(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value2, defaultValue) {
      if (exports.isValid(value2)) {
        return value2;
      }
      try {
        return fromString(value2);
      } catch (e) {
        return defaultValue;
      }
    };
  })(errorCorrectionLevel);
  function BitBuffer$1() {
    this.buffer = [];
    this.length = 0;
  }
  BitBuffer$1.prototype = {
    get: function(index) {
      const bufIndex = Math.floor(index / 8);
      return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
    },
    put: function(num, length) {
      for (let i = 0; i < length; i++) {
        this.putBit((num >>> length - i - 1 & 1) === 1);
      }
    },
    getLengthInBits: function() {
      return this.length;
    },
    putBit: function(bit) {
      const bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= 128 >>> this.length % 8;
      }
      this.length++;
    }
  };
  var bitBuffer = BitBuffer$1;
  function BitMatrix$1(size2) {
    if (!size2 || size2 < 1) {
      throw new Error("BitMatrix size must be defined and greater than 0");
    }
    this.size = size2;
    this.data = new Uint8Array(size2 * size2);
    this.reservedBit = new Uint8Array(size2 * size2);
  }
  BitMatrix$1.prototype.set = function(row, col, value2, reserved) {
    const index = row * this.size + col;
    this.data[index] = value2;
    if (reserved) this.reservedBit[index] = true;
  };
  BitMatrix$1.prototype.get = function(row, col) {
    return this.data[row * this.size + col];
  };
  BitMatrix$1.prototype.xor = function(row, col, value2) {
    this.data[row * this.size + col] ^= value2;
  };
  BitMatrix$1.prototype.isReserved = function(row, col) {
    return this.reservedBit[row * this.size + col];
  };
  var bitMatrix = BitMatrix$1;
  var alignmentPattern = {};
  (function(exports) {
    const getSymbolSize3 = utils$1.getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version2) {
      if (version2 === 1) return [];
      const posCount = Math.floor(version2 / 7) + 2;
      const size2 = getSymbolSize3(version2);
      const intervals = size2 === 145 ? 26 : Math.ceil((size2 - 13) / (2 * posCount - 2)) * 2;
      const positions = [size2 - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions2(version2) {
      const coords = [];
      const pos = exports.getRowColCoords(version2);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  })(alignmentPattern);
  var finderPattern = {};
  const getSymbolSize2 = utils$1.getSymbolSize;
  const FINDER_PATTERN_SIZE = 7;
  finderPattern.getPositions = function getPositions(version2) {
    const size2 = getSymbolSize2(version2);
    return [
      // top-left
      [0, 0],
      // top-right
      [size2 - FINDER_PATTERN_SIZE, 0],
      // bottom-left
      [0, size2 - FINDER_PATTERN_SIZE]
    ];
  };
  var maskPattern = {};
  (function(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    const PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid2(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value2) {
      return exports.isValid(value2) ? parseInt(value2, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size2 = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size2; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size2; col++) {
          let module = data.get(row, col);
          if (module === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module;
            sameCountCol = 1;
          }
          module = data.get(col, row);
          if (module === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size2 = data.size;
      let points = 0;
      for (let row = 0; row < size2 - 1; row++) {
        for (let col = 0; col < size2 - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size2 = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size2; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size2; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k2 = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k2 * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern2, i, j) {
      switch (maskPattern2) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern2);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size2 = data.size;
      for (let col = 0; col < size2; col++) {
        for (let row = 0; row < size2; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p2 = 0; p2 < numPatterns; p2++) {
        setupFormatFunc(p2);
        exports.applyMask(p2, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p2, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p2;
        }
      }
      return bestPattern;
    };
  })(maskPattern);
  var errorCorrectionCode = {};
  const ECLevel$1 = errorCorrectionLevel;
  const EC_BLOCKS_TABLE = [
    // L  M  Q  H
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    1,
    2,
    2,
    4,
    1,
    2,
    4,
    4,
    2,
    4,
    4,
    4,
    2,
    4,
    6,
    5,
    2,
    4,
    6,
    6,
    2,
    5,
    8,
    8,
    4,
    5,
    8,
    8,
    4,
    5,
    8,
    11,
    4,
    8,
    10,
    11,
    4,
    9,
    12,
    16,
    4,
    9,
    16,
    16,
    6,
    10,
    12,
    18,
    6,
    10,
    17,
    16,
    6,
    11,
    16,
    19,
    6,
    13,
    18,
    21,
    7,
    14,
    21,
    25,
    8,
    16,
    20,
    25,
    8,
    17,
    23,
    25,
    9,
    17,
    23,
    34,
    9,
    18,
    25,
    30,
    10,
    20,
    27,
    32,
    12,
    21,
    29,
    35,
    12,
    23,
    34,
    37,
    12,
    25,
    34,
    40,
    13,
    26,
    35,
    42,
    14,
    28,
    38,
    45,
    15,
    29,
    40,
    48,
    16,
    31,
    43,
    51,
    17,
    33,
    45,
    54,
    18,
    35,
    48,
    57,
    19,
    37,
    51,
    60,
    19,
    38,
    53,
    63,
    20,
    40,
    56,
    66,
    21,
    43,
    59,
    70,
    22,
    45,
    62,
    74,
    24,
    47,
    65,
    77,
    25,
    49,
    68,
    81
  ];
  const EC_CODEWORDS_TABLE = [
    // L  M  Q  H
    7,
    10,
    13,
    17,
    10,
    16,
    22,
    28,
    15,
    26,
    36,
    44,
    20,
    36,
    52,
    64,
    26,
    48,
    72,
    88,
    36,
    64,
    96,
    112,
    40,
    72,
    108,
    130,
    48,
    88,
    132,
    156,
    60,
    110,
    160,
    192,
    72,
    130,
    192,
    224,
    80,
    150,
    224,
    264,
    96,
    176,
    260,
    308,
    104,
    198,
    288,
    352,
    120,
    216,
    320,
    384,
    132,
    240,
    360,
    432,
    144,
    280,
    408,
    480,
    168,
    308,
    448,
    532,
    180,
    338,
    504,
    588,
    196,
    364,
    546,
    650,
    224,
    416,
    600,
    700,
    224,
    442,
    644,
    750,
    252,
    476,
    690,
    816,
    270,
    504,
    750,
    900,
    300,
    560,
    810,
    960,
    312,
    588,
    870,
    1050,
    336,
    644,
    952,
    1110,
    360,
    700,
    1020,
    1200,
    390,
    728,
    1050,
    1260,
    420,
    784,
    1140,
    1350,
    450,
    812,
    1200,
    1440,
    480,
    868,
    1290,
    1530,
    510,
    924,
    1350,
    1620,
    540,
    980,
    1440,
    1710,
    570,
    1036,
    1530,
    1800,
    570,
    1064,
    1590,
    1890,
    600,
    1120,
    1680,
    1980,
    630,
    1204,
    1770,
    2100,
    660,
    1260,
    1860,
    2220,
    720,
    1316,
    1950,
    2310,
    750,
    1372,
    2040,
    2430
  ];
  errorCorrectionCode.getBlocksCount = function getBlocksCount(version2, errorCorrectionLevel2) {
    switch (errorCorrectionLevel2) {
      case ECLevel$1.L:
        return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 0];
      case ECLevel$1.M:
        return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 1];
      case ECLevel$1.Q:
        return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 2];
      case ECLevel$1.H:
        return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 3];
      default:
        return void 0;
    }
  };
  errorCorrectionCode.getTotalCodewordsCount = function getTotalCodewordsCount(version2, errorCorrectionLevel2) {
    switch (errorCorrectionLevel2) {
      case ECLevel$1.L:
        return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 0];
      case ECLevel$1.M:
        return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 1];
      case ECLevel$1.Q:
        return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 2];
      case ECLevel$1.H:
        return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 3];
      default:
        return void 0;
    }
  };
  var polynomial = {};
  var galoisField = {};
  const EXP_TABLE = new Uint8Array(512);
  const LOG_TABLE = new Uint8Array(256);
  (function initTables() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP_TABLE[i] = x;
      LOG_TABLE[x] = i;
      x <<= 1;
      if (x & 256) {
        x ^= 285;
      }
    }
    for (let i = 255; i < 512; i++) {
      EXP_TABLE[i] = EXP_TABLE[i - 255];
    }
  })();
  galoisField.log = function log(n2) {
    if (n2 < 1) throw new Error("log(" + n2 + ")");
    return LOG_TABLE[n2];
  };
  galoisField.exp = function exp(n2) {
    return EXP_TABLE[n2];
  };
  galoisField.mul = function mul(x, y) {
    if (x === 0 || y === 0) return 0;
    return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
  };
  (function(exports) {
    const GF = galoisField;
    exports.mul = function mul2(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  })(polynomial);
  const Polynomial = polynomial;
  function ReedSolomonEncoder$1(degree) {
    this.genPoly = void 0;
    this.degree = degree;
    if (this.degree) this.initialize(this.degree);
  }
  ReedSolomonEncoder$1.prototype.initialize = function initialize(degree) {
    this.degree = degree;
    this.genPoly = Polynomial.generateECPolynomial(this.degree);
  };
  ReedSolomonEncoder$1.prototype.encode = function encode(data) {
    if (!this.genPoly) {
      throw new Error("Encoder not initialized");
    }
    const paddedData = new Uint8Array(data.length + this.degree);
    paddedData.set(data);
    const remainder = Polynomial.mod(paddedData, this.genPoly);
    const start = this.degree - remainder.length;
    if (start > 0) {
      const buff = new Uint8Array(this.degree);
      buff.set(remainder, start);
      return buff;
    }
    return remainder;
  };
  var reedSolomonEncoder = ReedSolomonEncoder$1;
  var version = {};
  var mode = {};
  var versionCheck = {};
  versionCheck.isValid = function isValid(version2) {
    return !isNaN(version2) && version2 >= 1 && version2 <= 40;
  };
  var regex = {};
  const numeric = "[0-9]+";
  const alphanumeric = "[A-Z $%*+\\-./:]+";
  let kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  kanji = kanji.replace(/u/g, "\\u");
  const byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
  regex.KANJI = new RegExp(kanji, "g");
  regex.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
  regex.BYTE = new RegExp(byte, "g");
  regex.NUMERIC = new RegExp(numeric, "g");
  regex.ALPHANUMERIC = new RegExp(alphanumeric, "g");
  const TEST_KANJI = new RegExp("^" + kanji + "$");
  const TEST_NUMERIC = new RegExp("^" + numeric + "$");
  const TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  regex.testKanji = function testKanji(str) {
    return TEST_KANJI.test(str);
  };
  regex.testNumeric = function testNumeric(str) {
    return TEST_NUMERIC.test(str);
  };
  regex.testAlphanumeric = function testAlphanumeric(str) {
    return TEST_ALPHANUMERIC.test(str);
  };
  (function(exports) {
    const VersionCheck = versionCheck;
    const Regex = regex;
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode2, version2) {
      if (!mode2.ccBits) throw new Error("Invalid mode: " + mode2);
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid version: " + version2);
      }
      if (version2 >= 1 && version2 < 10) return mode2.ccBits[0];
      else if (version2 < 27) return mode2.ccBits[1];
      return mode2.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode2) {
      if (mode2 && mode2.id) return mode2.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid2(mode2) {
      return mode2 && mode2.bit && mode2.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value2, defaultValue) {
      if (exports.isValid(value2)) {
        return value2;
      }
      try {
        return fromString(value2);
      } catch (e) {
        return defaultValue;
      }
    };
  })(mode);
  (function(exports) {
    const Utils2 = utils$1;
    const ECCode2 = errorCorrectionCode;
    const ECLevel2 = errorCorrectionLevel;
    const Mode2 = mode;
    const VersionCheck = versionCheck;
    const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    const G18_BCH = Utils2.getBCHDigit(G18);
    function getBestVersionForDataLength(mode2, length, errorCorrectionLevel2) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel2, mode2)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode2, version2) {
      return Mode2.getCharCountIndicator(mode2, version2) + 4;
    }
    function getTotalBitsFromDataArray(segments2, version2) {
      let totalBits = 0;
      segments2.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version2);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments2, errorCorrectionLevel2) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments2, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel2, Mode2.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value2, defaultValue) {
      if (VersionCheck.isValid(value2)) {
        return parseInt(value2, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version2, errorCorrectionLevel2, mode2) {
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode2 === "undefined") mode2 = Mode2.BYTE;
      const totalCodewords = Utils2.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode2.getTotalCodewordsCount(version2, errorCorrectionLevel2);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode2 === Mode2.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode2, version2);
      switch (mode2) {
        case Mode2.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode2.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode2.KANJI:
          return Math.floor(usableBits / 13);
        case Mode2.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel2) {
      let seg;
      const ecl = ECLevel2.from(errorCorrectionLevel2, ECLevel2.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits2(version2) {
      if (!VersionCheck.isValid(version2) || version2 < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version2 << 12;
      while (Utils2.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils2.getBCHDigit(d) - G18_BCH;
      }
      return version2 << 12 | d;
    };
  })(version);
  var formatInfo = {};
  const Utils$3 = utils$1;
  const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
  const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
  const G15_BCH = Utils$3.getBCHDigit(G15);
  formatInfo.getEncodedBits = function getEncodedBits(errorCorrectionLevel2, mask) {
    const data = errorCorrectionLevel2.bit << 3 | mask;
    let d = data << 10;
    while (Utils$3.getBCHDigit(d) - G15_BCH >= 0) {
      d ^= G15 << Utils$3.getBCHDigit(d) - G15_BCH;
    }
    return (data << 10 | d) ^ G15_MASK;
  };
  var segments = {};
  const Mode$4 = mode;
  function NumericData(data) {
    this.mode = Mode$4.NUMERIC;
    this.data = data.toString();
  }
  NumericData.getBitsLength = function getBitsLength(length) {
    return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
  };
  NumericData.prototype.getLength = function getLength() {
    return this.data.length;
  };
  NumericData.prototype.getBitsLength = function getBitsLength2() {
    return NumericData.getBitsLength(this.data.length);
  };
  NumericData.prototype.write = function write(bitBuffer2) {
    let i, group, value2;
    for (i = 0; i + 3 <= this.data.length; i += 3) {
      group = this.data.substr(i, 3);
      value2 = parseInt(group, 10);
      bitBuffer2.put(value2, 10);
    }
    const remainingNum = this.data.length - i;
    if (remainingNum > 0) {
      group = this.data.substr(i);
      value2 = parseInt(group, 10);
      bitBuffer2.put(value2, remainingNum * 3 + 1);
    }
  };
  var numericData = NumericData;
  const Mode$3 = mode;
  const ALPHA_NUM_CHARS = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    " ",
    "$",
    "%",
    "*",
    "+",
    "-",
    ".",
    "/",
    ":"
  ];
  function AlphanumericData(data) {
    this.mode = Mode$3.ALPHANUMERIC;
    this.data = data;
  }
  AlphanumericData.getBitsLength = function getBitsLength3(length) {
    return 11 * Math.floor(length / 2) + 6 * (length % 2);
  };
  AlphanumericData.prototype.getLength = function getLength2() {
    return this.data.length;
  };
  AlphanumericData.prototype.getBitsLength = function getBitsLength4() {
    return AlphanumericData.getBitsLength(this.data.length);
  };
  AlphanumericData.prototype.write = function write2(bitBuffer2) {
    let i;
    for (i = 0; i + 2 <= this.data.length; i += 2) {
      let value2 = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
      value2 += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
      bitBuffer2.put(value2, 11);
    }
    if (this.data.length % 2) {
      bitBuffer2.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
    }
  };
  var alphanumericData = AlphanumericData;
  const Mode$2 = mode;
  function ByteData(data) {
    this.mode = Mode$2.BYTE;
    if (typeof data === "string") {
      this.data = new TextEncoder().encode(data);
    } else {
      this.data = new Uint8Array(data);
    }
  }
  ByteData.getBitsLength = function getBitsLength5(length) {
    return length * 8;
  };
  ByteData.prototype.getLength = function getLength3() {
    return this.data.length;
  };
  ByteData.prototype.getBitsLength = function getBitsLength6() {
    return ByteData.getBitsLength(this.data.length);
  };
  ByteData.prototype.write = function(bitBuffer2) {
    for (let i = 0, l2 = this.data.length; i < l2; i++) {
      bitBuffer2.put(this.data[i], 8);
    }
  };
  var byteData = ByteData;
  const Mode$1 = mode;
  const Utils$2 = utils$1;
  function KanjiData(data) {
    this.mode = Mode$1.KANJI;
    this.data = data;
  }
  KanjiData.getBitsLength = function getBitsLength7(length) {
    return length * 13;
  };
  KanjiData.prototype.getLength = function getLength4() {
    return this.data.length;
  };
  KanjiData.prototype.getBitsLength = function getBitsLength8() {
    return KanjiData.getBitsLength(this.data.length);
  };
  KanjiData.prototype.write = function(bitBuffer2) {
    let i;
    for (i = 0; i < this.data.length; i++) {
      let value2 = Utils$2.toSJIS(this.data[i]);
      if (value2 >= 33088 && value2 <= 40956) {
        value2 -= 33088;
      } else if (value2 >= 57408 && value2 <= 60351) {
        value2 -= 49472;
      } else {
        throw new Error(
          "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
        );
      }
      value2 = (value2 >>> 8 & 255) * 192 + (value2 & 255);
      bitBuffer2.put(value2, 13);
    }
  };
  var kanjiData = KanjiData;
  var dijkstra = { exports: {} };
  (function(module) {
    var dijkstra2 = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra2.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        while (u) {
          nodes.push(u);
          predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra2.single_source_shortest_paths(graph, s, d);
        return dijkstra2.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra2.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value2, cost) {
          var item = { value: value2, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    {
      module.exports = dijkstra2;
    }
  })(dijkstra);
  var dijkstraExports = dijkstra.exports;
  (function(exports) {
    const Mode2 = mode;
    const NumericData2 = numericData;
    const AlphanumericData2 = alphanumericData;
    const ByteData2 = byteData;
    const KanjiData2 = kanjiData;
    const Regex = regex;
    const Utils2 = utils$1;
    const dijkstra2 = dijkstraExports;
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex2, mode2, str) {
      const segments2 = [];
      let result;
      while ((result = regex2.exec(str)) !== null) {
        segments2.push({
          data: result[0],
          index: result.index,
          mode: mode2,
          length: result[0].length
        });
      }
      return segments2;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode2.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode2.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils2.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode2.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode2.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode2.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode2) {
      switch (mode2) {
        case Mode2.NUMERIC:
          return NumericData2.getBitsLength(length);
        case Mode2.ALPHANUMERIC:
          return AlphanumericData2.getBitsLength(length);
        case Mode2.KANJI:
          return KanjiData2.getBitsLength(length);
        case Mode2.BYTE:
          return ByteData2.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode2.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode2.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode2.BYTE, length: seg.length }
            ]);
            break;
          case Mode2.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode2.BYTE, length: seg.length }
            ]);
            break;
          case Mode2.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode2.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode2.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode2.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version2) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n2 = 0; n2 < prevNodeIds.length; n2++) {
            const prevNodeId = prevNodeIds[n2];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode2.getCharCountIndicator(node.mode, version2);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n2 = 0; n2 < prevNodeIds.length; n2++) {
        graph[prevNodeIds[n2]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode2;
      const bestMode = Mode2.getBestModeForData(data);
      mode2 = Mode2.from(modesHint, bestMode);
      if (mode2 !== Mode2.BYTE && mode2.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode2.toString(mode2) + ".\n Suggested mode is: " + Mode2.toString(bestMode));
      }
      if (mode2 === Mode2.KANJI && !Utils2.isKanjiModeEnabled()) {
        mode2 = Mode2.BYTE;
      }
      switch (mode2) {
        case Mode2.NUMERIC:
          return new NumericData2(data);
        case Mode2.ALPHANUMERIC:
          return new AlphanumericData2(data);
        case Mode2.KANJI:
          return new KanjiData2(data);
        case Mode2.BYTE:
          return new ByteData2(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version2) {
      const segs = getSegmentsFromString(data, Utils2.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version2);
      const path = dijkstra2.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils2.isKanjiModeEnabled())
      );
    };
  })(segments);
  const Utils$1 = utils$1;
  const ECLevel = errorCorrectionLevel;
  const BitBuffer = bitBuffer;
  const BitMatrix = bitMatrix;
  const AlignmentPattern = alignmentPattern;
  const FinderPattern = finderPattern;
  const MaskPattern = maskPattern;
  const ECCode = errorCorrectionCode;
  const ReedSolomonEncoder = reedSolomonEncoder;
  const Version = version;
  const FormatInfo = formatInfo;
  const Mode = mode;
  const Segments = segments;
  function setupFinderPattern(matrix, version2) {
    const size2 = matrix.size;
    const pos = FinderPattern.getPositions(version2);
    for (let i = 0; i < pos.length; i++) {
      const row = pos[i][0];
      const col = pos[i][1];
      for (let r = -1; r <= 7; r++) {
        if (row + r <= -1 || size2 <= row + r) continue;
        for (let c = -1; c <= 7; c++) {
          if (col + c <= -1 || size2 <= col + c) continue;
          if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
            matrix.set(row + r, col + c, true, true);
          } else {
            matrix.set(row + r, col + c, false, true);
          }
        }
      }
    }
  }
  function setupTimingPattern(matrix) {
    const size2 = matrix.size;
    for (let r = 8; r < size2 - 8; r++) {
      const value2 = r % 2 === 0;
      matrix.set(r, 6, value2, true);
      matrix.set(6, r, value2, true);
    }
  }
  function setupAlignmentPattern(matrix, version2) {
    const pos = AlignmentPattern.getPositions(version2);
    for (let i = 0; i < pos.length; i++) {
      const row = pos[i][0];
      const col = pos[i][1];
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
            matrix.set(row + r, col + c, true, true);
          } else {
            matrix.set(row + r, col + c, false, true);
          }
        }
      }
    }
  }
  function setupVersionInfo(matrix, version2) {
    const size2 = matrix.size;
    const bits = Version.getEncodedBits(version2);
    let row, col, mod;
    for (let i = 0; i < 18; i++) {
      row = Math.floor(i / 3);
      col = i % 3 + size2 - 8 - 3;
      mod = (bits >> i & 1) === 1;
      matrix.set(row, col, mod, true);
      matrix.set(col, row, mod, true);
    }
  }
  function setupFormatInfo(matrix, errorCorrectionLevel2, maskPattern2) {
    const size2 = matrix.size;
    const bits = FormatInfo.getEncodedBits(errorCorrectionLevel2, maskPattern2);
    let i, mod;
    for (i = 0; i < 15; i++) {
      mod = (bits >> i & 1) === 1;
      if (i < 6) {
        matrix.set(i, 8, mod, true);
      } else if (i < 8) {
        matrix.set(i + 1, 8, mod, true);
      } else {
        matrix.set(size2 - 15 + i, 8, mod, true);
      }
      if (i < 8) {
        matrix.set(8, size2 - i - 1, mod, true);
      } else if (i < 9) {
        matrix.set(8, 15 - i - 1 + 1, mod, true);
      } else {
        matrix.set(8, 15 - i - 1, mod, true);
      }
    }
    matrix.set(size2 - 8, 8, 1, true);
  }
  function setupData(matrix, data) {
    const size2 = matrix.size;
    let inc = -1;
    let row = size2 - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    for (let col = size2 - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (!matrix.isReserved(row, col - c)) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) === 1;
            }
            matrix.set(row, col - c, dark);
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || size2 <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }
  function createData(version2, errorCorrectionLevel2, segments2) {
    const buffer = new BitBuffer();
    segments2.forEach(function(data) {
      buffer.put(data.mode.bit, 4);
      buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version2));
      data.write(buffer);
    });
    const totalCodewords = Utils$1.getSymbolTotalCodewords(version2);
    const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel2);
    const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
    if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(0);
    }
    const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
    for (let i = 0; i < remainingByte; i++) {
      buffer.put(i % 2 ? 17 : 236, 8);
    }
    return createCodewords(buffer, version2, errorCorrectionLevel2);
  }
  function createCodewords(bitBuffer2, version2, errorCorrectionLevel2) {
    const totalCodewords = Utils$1.getSymbolTotalCodewords(version2);
    const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel2);
    const dataTotalCodewords = totalCodewords - ecTotalCodewords;
    const ecTotalBlocks = ECCode.getBlocksCount(version2, errorCorrectionLevel2);
    const blocksInGroup2 = totalCodewords % ecTotalBlocks;
    const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
    const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
    const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
    const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
    const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
    const rs = new ReedSolomonEncoder(ecCount);
    let offset = 0;
    const dcData = new Array(ecTotalBlocks);
    const ecData = new Array(ecTotalBlocks);
    let maxDataSize = 0;
    const buffer = new Uint8Array(bitBuffer2.buffer);
    for (let b = 0; b < ecTotalBlocks; b++) {
      const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
      dcData[b] = buffer.slice(offset, offset + dataSize);
      ecData[b] = rs.encode(dcData[b]);
      offset += dataSize;
      maxDataSize = Math.max(maxDataSize, dataSize);
    }
    const data = new Uint8Array(totalCodewords);
    let index = 0;
    let i, r;
    for (i = 0; i < maxDataSize; i++) {
      for (r = 0; r < ecTotalBlocks; r++) {
        if (i < dcData[r].length) {
          data[index++] = dcData[r][i];
        }
      }
    }
    for (i = 0; i < ecCount; i++) {
      for (r = 0; r < ecTotalBlocks; r++) {
        data[index++] = ecData[r][i];
      }
    }
    return data;
  }
  function createSymbol(data, version2, errorCorrectionLevel2, maskPattern2) {
    let segments2;
    if (Array.isArray(data)) {
      segments2 = Segments.fromArray(data);
    } else if (typeof data === "string") {
      let estimatedVersion = version2;
      if (!estimatedVersion) {
        const rawSegments = Segments.rawSplit(data);
        estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel2);
      }
      segments2 = Segments.fromString(data, estimatedVersion || 40);
    } else {
      throw new Error("Invalid data");
    }
    const bestVersion = Version.getBestVersionForData(segments2, errorCorrectionLevel2);
    if (!bestVersion) {
      throw new Error("The amount of data is too big to be stored in a QR Code");
    }
    if (!version2) {
      version2 = bestVersion;
    } else if (version2 < bestVersion) {
      throw new Error(
        "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
      );
    }
    const dataBits = createData(version2, errorCorrectionLevel2, segments2);
    const moduleCount = Utils$1.getSymbolSize(version2);
    const modules = new BitMatrix(moduleCount);
    setupFinderPattern(modules, version2);
    setupTimingPattern(modules);
    setupAlignmentPattern(modules, version2);
    setupFormatInfo(modules, errorCorrectionLevel2, 0);
    if (version2 >= 7) {
      setupVersionInfo(modules, version2);
    }
    setupData(modules, dataBits);
    if (isNaN(maskPattern2)) {
      maskPattern2 = MaskPattern.getBestMask(
        modules,
        setupFormatInfo.bind(null, modules, errorCorrectionLevel2)
      );
    }
    MaskPattern.applyMask(maskPattern2, modules);
    setupFormatInfo(modules, errorCorrectionLevel2, maskPattern2);
    return {
      modules,
      version: version2,
      errorCorrectionLevel: errorCorrectionLevel2,
      maskPattern: maskPattern2,
      segments: segments2
    };
  }
  qrcode.create = function create(data, options) {
    if (typeof data === "undefined" || data === "") {
      throw new Error("No input text");
    }
    let errorCorrectionLevel2 = ECLevel.M;
    let version2;
    let mask;
    if (typeof options !== "undefined") {
      errorCorrectionLevel2 = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
      version2 = Version.from(options.version);
      mask = MaskPattern.from(options.maskPattern);
      if (options.toSJISFunc) {
        Utils$1.setToSJISFunction(options.toSJISFunc);
      }
    }
    return createSymbol(data, version2, errorCorrectionLevel2, mask);
  };
  var canvas = {};
  var utils = {};
  (function(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size2 = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size2, opts);
      const symbolSize = Math.floor((size2 + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size2 + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  })(utils);
  (function(exports) {
    const Utils2 = utils;
    function clearCanvas(ctx, canvas2, size2) {
      ctx.clearRect(0, 0, canvas2.width, canvas2.height);
      if (!canvas2.style) canvas2.style = {};
      canvas2.height = size2;
      canvas2.width = size2;
      canvas2.style.height = size2 + "px";
      canvas2.style.width = size2 + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render2(qrData, canvas2, options) {
      let opts = options;
      let canvasEl = canvas2;
      if (typeof opts === "undefined" && (!canvas2 || !canvas2.getContext)) {
        opts = canvas2;
        canvas2 = void 0;
      }
      if (!canvas2) {
        canvasEl = getCanvasElement();
      }
      opts = Utils2.getOptions(opts);
      const size2 = Utils2.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size2, size2);
      Utils2.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size2);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas2, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas2 || !canvas2.getContext)) {
        opts = canvas2;
        canvas2 = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas2, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  })(canvas);
  var svgTag = {};
  const Utils = utils;
  function getColorAttrib(color, attrib) {
    const alpha = color.a / 255;
    const str = attrib + '="' + color.hex + '"';
    return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
  }
  function svgCmd(cmd, x, y) {
    let str = cmd + x;
    if (typeof y !== "undefined") str += " " + y;
    return str;
  }
  function qrToPath(data, size2, margin) {
    let path = "";
    let moveBy = 0;
    let newRow = false;
    let lineLength = 0;
    for (let i = 0; i < data.length; i++) {
      const col = Math.floor(i % size2);
      const row = Math.floor(i / size2);
      if (!col && !newRow) newRow = true;
      if (data[i]) {
        lineLength++;
        if (!(i > 0 && col > 0 && data[i - 1])) {
          path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
          moveBy = 0;
          newRow = false;
        }
        if (!(col + 1 < size2 && data[i + 1])) {
          path += svgCmd("h", lineLength);
          lineLength = 0;
        }
      } else {
        moveBy++;
      }
    }
    return path;
  }
  svgTag.render = function render(qrData, options, cb) {
    const opts = Utils.getOptions(options);
    const size2 = qrData.modules.size;
    const data = qrData.modules.data;
    const qrcodesize = size2 + opts.margin * 2;
    const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
    const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size2, opts.margin) + '"/>';
    const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
    const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
    const svgTag2 = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
    if (typeof cb === "function") {
      cb(null, svgTag2);
    }
    return svgTag2;
  };
  const canPromise = canPromise$1;
  const QRCode = qrcode;
  const CanvasRenderer = canvas;
  const SvgRenderer = svgTag;
  function renderCanvas(renderFunc, canvas2, text2, opts, cb) {
    const args = [].slice.call(arguments, 1);
    const argsNum = args.length;
    const isLastArgCb = typeof args[argsNum - 1] === "function";
    if (!isLastArgCb && !canPromise()) {
      throw new Error("Callback required as last argument");
    }
    if (isLastArgCb) {
      if (argsNum < 2) {
        throw new Error("Too few arguments provided");
      }
      if (argsNum === 2) {
        cb = text2;
        text2 = canvas2;
        canvas2 = opts = void 0;
      } else if (argsNum === 3) {
        if (canvas2.getContext && typeof cb === "undefined") {
          cb = opts;
          opts = void 0;
        } else {
          cb = opts;
          opts = text2;
          text2 = canvas2;
          canvas2 = void 0;
        }
      }
    } else {
      if (argsNum < 1) {
        throw new Error("Too few arguments provided");
      }
      if (argsNum === 1) {
        text2 = canvas2;
        canvas2 = opts = void 0;
      } else if (argsNum === 2 && !canvas2.getContext) {
        opts = text2;
        text2 = canvas2;
        canvas2 = void 0;
      }
      return new Promise(function(resolve, reject) {
        try {
          const data = QRCode.create(text2, opts);
          resolve(renderFunc(data, canvas2, opts));
        } catch (e) {
          reject(e);
        }
      });
    }
    try {
      const data = QRCode.create(text2, opts);
      cb(null, renderFunc(data, canvas2, opts));
    } catch (e) {
      cb(e);
    }
  }
  browser.create = QRCode.create;
  browser.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
  browser.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
  browser.toString = renderCanvas.bind(null, function(data, _, opts) {
    return SvgRenderer.render(data, opts);
  });
  const generateQRCode = async (text2, options = {}) => {
    try {
      const defaultOptions = {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.92,
        margin: 1,
        width: 200,
        ...options
      };
      const qrcode2 = await browser.toDataURL(text2, defaultOptions);
      return qrcode2;
    } catch (error) {
      console.error("生成二维码失败:", error);
      throw error;
    }
  };
  const getQrKey = () => weapiRequest("/api/login/qrcode/unikey", {
    data: {
      noCheckToken: 1,
      type: 1
    }
  });
  const getQrCode = (key) => {
    const loginUrl = `https://music.163.com/login?codekey=${key}`;
    return generateQRCode(loginUrl);
  };
  const getQrStatus = (key) => weapiFetch("/api/login/qrcode/client/login", {
    data: {
      key,
      type: 1
    },
    originResponse: true
  });
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
  const getCloudData = (limit = 200, offset = 0) => weapiRequest("/api/v1/cloud/get", {
    data: {
      limit,
      offset
    }
  });
  const deleteCloudSong = (songIds) => weapiRequest("/api/cloud/del", {
    data: {
      songIds
    }
  });
  const getPlaylistList = (uid = getGUser().userId, limit = 1001, offset = 0) => weapiRequest("/api/user/playlist", {
    data: {
      limit,
      offset,
      uid
    }
  });
  const createPlaylist = (name2) => weapiRequest("/api/playlist/create", {
    data: {
      name: name2
    }
  });
  const deletePlaylist = (pid) => weapiRequest("/api/playlist/delete", {
    data: {
      pid
    }
  });
  const addSongToPlaylist = (pid, trackIds) => weapiRequest("/api/playlist/manipulate/tracks", {
    data: {
      pid,
      // 歌单id
      trackIds,
      // 歌曲 id 数组
      op: "add"
      // 操作类型
    }
  });
  const getAlbumSongList = (id) => weapiRequest(`/api/v1/album/${id}`, {
    data: {}
  });
  const getSongUrl = (ids, encodeType = "flac", level = QUALITY_LEVELS.无损) => weapiRequest("/api/song/enhance/player/url/v1", {
    data: { ids, level, encodeType }
  });
  const getArtistTopSongList = (id) => weapiRequest("/api/artist/top/song", {
    data: {
      id,
      limit: 1e3,
      offset: 0
    }
  });
  const getArtistAllSongList = (id) => weapiRequest("/api/v1/artist/songs", {
    data: {
      id,
      private_cloud: "true",
      work_type: 1,
      order: "hot",
      //hot,time
      limit: 1e4,
      offset: 0
    }
  });
  const getArtistAlbumList = async (id, limit = 1e3, offset = 0) => {
    const res = await fetch(
      `/artist/album?id=${id}&limit=${limit}&offset=${offset}`
    );
    console.log("res", res);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const albumList = Array.from(doc.querySelectorAll("#m-song-module li"));
    return albumList.map((item) => {
      const cover = item.querySelector("img").getAttribute("src");
      const id2 = item.querySelector('a[title="播放"]').getAttribute("data-res-id");
      const name2 = item.querySelector("p.dec a.tit").textContent;
      const time = item.querySelector("span.s-fc3").textContent;
      return { cover, id: id2, name: name2, time };
    });
  };
  const select = "_select_10bds_21";
  const tag = "_tag_10bds_34";
  const divider$1 = "_divider_10bds_69";
  const label$1 = "_label_10bds_86";
  const value$1 = "_value_10bds_91";
  const size$1 = "_size_10bds_66";
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
  const songName$1 = "_songName_10bds_207";
  const errorMsg = "_errorMsg_10bds_212";
  const uploadModal = "_uploadModal_10bds_217";
  const progressSection = "_progressSection_10bds_221";
  const count$1 = "_count_10bds_240";
  const statsTag = "_statsTag_10bds_255";
  const songList = "_songList_10bds_260";
  const songItem$1 = "_songItem_10bds_276";
  const songInfo$1 = "_songInfo_10bds_291";
  const artistName = "_artistName_10bds_305";
  const styles$1 = {
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
    divider: divider$1,
    "upload-confirm": "_upload-confirm_10bds_74",
    "confirm-item": "_confirm-item_10bds_78",
    label: label$1,
    value: value$1,
    size: size$1,
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
    songName: songName$1,
    errorMsg,
    uploadModal,
    progressSection,
    count: count$1,
    statsTag,
    songList,
    songItem: songItem$1,
    songInfo: songInfo$1,
    artistName
  };
  function SingerChoose({ singerList, onChoose, loading }) {
    const renderSingerList = require$$0.useMemo(() => {
      return singerList.map((item) => {
        const { id, name: name2, count: count2, size: size2, sizeDesc } = item;
        return {
          ...item,
          label: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["option-label"], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1["singer-name"], children: name2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["tag-group"], children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "blue", className: styles$1["tag"], children: [
                count2,
                "首"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "green", className: styles$1["tag"], children: sizeDesc })
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1["singer-choose"], children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Spin, { tip: "正在加载中" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      antd.Form,
      {
        form: formRef,
        onFinish: handleChoose,
        className: styles$1["singer-choose-form"],
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { name: "singer", label: "歌手", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Select,
            {
              mode: "multiple",
              placeholder: "请选择歌手",
              allowClear: true,
              className: styles$1["select"],
              filterOption: (input, option) => {
                var _a;
                return ((_a = option.name) == null ? void 0 : _a.toLowerCase().indexOf(input.toLowerCase())) >= 0;
              },
              options: renderSingerList,
              getPopupContainer: (trigger) => trigger.parentNode
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { style: { marginBottom: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1["btn-group"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", htmlType: "submit", children: "选择" }) }) })
        ]
      }
    ) });
  }
  const SearchForm$1 = ({ onSearch, songList: songList2 }) => {
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
          className: styles$1.uploadModal,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.progressSection, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Progress,
                {
                  type: "circle",
                  percent,
                  status: isCompleted ? failedCount > 0 ? "exception" : "success" : "active",
                  format: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.progressInfo, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.percentage, children: [
                      percent,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.count, children: [
                      uploadedCount + failedCount,
                      "/",
                      total
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.statsContainer, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.statsItem, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "success", className: styles$1.statsTag, children: [
                  "成功：",
                  uploadedCount
                ] }) }),
                failedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.statsItem, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "error", className: styles$1.statsTag, children: [
                  "失败：",
                  failedCount
                ] }) })
              ] })
            ] }),
            (uploadedList.length > 0 || uploadFailedSongList.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.songList, ref: songListRef, children: [
              uploadFailedSongList.map((song2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.songItem, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.songInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.songName, children: song2.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.artistName, children: [
                    "- ",
                    song2.artists
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tag, { color: "error", children: "上传失败" })
              ] }, song2.id)),
              uploadedList.map((song2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.songItem, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.songInfo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.songName, children: song2.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.artistName, children: [
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["upload-stats"], children: [
      "已选择",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "blue", style: { margin: 0 }, children: [
        selectedRows.length,
        " 首"
      ] }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1["size-text"], children: +selectedSize && formatFileSize(selectedSize) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.divider, children: "/" }),
      "共",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "green", style: { margin: 0 }, children: [
        filteredSongList.length,
        " 首"
      ] }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1["size-text"], children: formatFileSize(totalSize) })
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
        allInfo.map(({ privileges, songs: songs2 }) => {
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
            const songsMap = Object.fromEntries(songs2.map((s) => [s.id, s]));
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
        render: (text2, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: record.picUrl,
              alt: text2,
              style: { width: "40px", height: "40px", borderRadius: "4px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: text2 }),
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
        defaultSortOrder: "descend",
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
    const handleBatchUpload = async (songs2) => {
      var _a;
      try {
        if (uploading) return;
        resetData();
        setUploading(true);
        console.log("将要批量上传的选中的歌曲", songs2);
        const uploadSongList = filteredSongList.filter((song2) => !song2.uploaded);
        console.log("uploadSongList", uploadSongList);
        setToUploadingSongList(uploadSongList);
        await UploadConfirm({
          total: songs2.length,
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
      (singerList == null ? void 0 : singerList.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["upload-list"], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SearchForm$1, { onSearch: handleSearch, songList: songList2 }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["upload-footer"], children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["upload-confirm"], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["confirm-item"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.label, children: "总计歌曲：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.value, children: [
            total,
            " 首"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["confirm-item"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.label, children: "已上传：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.value, children: [
            uploaded,
            " 首"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["confirm-item"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.label, children: "待上传：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.value, children: [
            toUpload.length,
            " 首",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles$1.size, children: [
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
            className: styles$1["quick-upload-tabs"],
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
  const TestModal = require$$0.forwardRef((props, ref) => {
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
    const [pageData, setPageData] = require$$0.useState({
      limit: 500,
      offset: 0
    });
    const handleGetCloudData = async () => {
      console.log("获取云盘数据");
      try {
        const res = await getCloudData(pageData.limit, pageData.offset);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const [songListName, setSongListName] = require$$0.useState("");
    const handleCreateSongList = async () => {
      console.log("新建歌单");
      try {
        const res = await createPlaylist(songListName);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const [addInfo, setAddInfo] = require$$0.useState({
      songId: "185620",
      playlistId: "12999288729"
    });
    const handleAddSong = async () => {
      console.log("添加歌曲");
      try {
        const res = await addSongToPlaylist(addInfo.playlistId, [addInfo.songId]);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const [userId, setUserId] = require$$0.useState("12999288729");
    const handleGetPlaylistList = async () => {
      console.log("获取歌单列表");
      try {
        const res = await getPlaylistList(userId);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const [songId2, setSongId] = require$$0.useState("2608471890");
    const handleGetSongUrl = async () => {
      console.log("获取歌曲URL");
      try {
        const res = await getSongUrl([songId2]);
        console.log("res", res);
        if (res.code === 200) {
          const url = res.data[0].url;
          await navigator.clipboard.writeText(url);
          msgSuccess("获取成功,已复制到剪切板");
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    const handleDeleteCloudSong = async () => {
      console.log("删除云盘歌曲");
      try {
        const res = await deleteCloudSong([songId2]);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const [albumId, setAlbumId] = require$$0.useState("242274622");
    const handleGetAlbumSongList = async () => {
      console.log("获取专辑歌曲列表");
      try {
        const res = await getAlbumSongList(albumId);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const [artistId, setArtistId] = require$$0.useState("3684");
    const handleGetArtistTopSongList = async () => {
      console.log("获取歌手歌曲列表");
      try {
        const res = await getArtistTopSongList(artistId);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const handleGetArtistAlbum = async () => {
      console.log("获取歌手专辑");
      try {
        const res = await getArtistAlbumList(artistId);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const handleGetArtistAllSongList = async () => {
      console.log("获取歌手全部歌曲");
      try {
        const res = await getArtistAllSongList(artistId);
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    const handleQrLogin = async () => {
      console.log("二维码登录");
      try {
        const keyRes = await getQrKey();
        if (keyRes.code !== 200) return msgError("获取二维码key失败");
        const key = keyRes.unikey;
        console.log("key", key);
        const qrcode2 = await getQrCode(key);
        const qrImg = document.createElement("img");
        qrImg.src = qrcode2;
        qrImg.style.width = "200px";
        qrImg.style.height = "200px";
        document.getElementById("qrcode-container").innerHTML = "";
        document.getElementById("qrcode-container").appendChild(qrImg);
        const timeOutTime = Date.now() + 2 * 60 * 1e3;
        while (Date.now() < timeOutTime) {
          const qrStatusRes = await getQrStatus(key);
          console.log("qrStatus", qrStatusRes);
          const { code } = qrStatusRes.response;
          if (code === 801) {
            console.log("等待扫码");
          } else if (code === 802) {
            console.log("授权中");
          } else if (code === 803) {
            console.log("授权成功");
            console.log("qrStatusRes", qrStatusRes);
            break;
          } else if (code === 800) {
            console.log("不存在或失效");
            break;
          }
          await sleep(1e3);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      antd.Modal,
      {
        title: "测试Modal",
        open: visible,
        onCancel: close,
        width: 800,
        footer: null,
        centered: true,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Form, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "获取云盘数据", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Input, { placeholder: "limit", style: { width: 100 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Input, { placeholder: "offset", style: { width: 100 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleGetCloudData, children: "获取云盘数据" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "新建歌单", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Input,
                {
                  placeholder: "请输入歌单名称",
                  value: songListName,
                  onChange: (e) => setSongListName(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleCreateSongList, children: "新建歌单" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "添加歌曲", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Input,
                {
                  placeholder: "请输入歌单id",
                  value: addInfo.playlistId,
                  onChange: (e) => setAddInfo({ ...addInfo, playlistId: e.target.value })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Input,
                {
                  placeholder: "请输入歌曲id",
                  value: addInfo.songId,
                  onChange: (e) => setAddInfo({ ...addInfo, songId: e.target.value })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleAddSong, children: "添加歌曲" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "获取歌单列表", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Input,
                {
                  placeholder: "请输入用户id",
                  value: userId,
                  onChange: (e) => setUserId(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleGetPlaylistList, children: "获取歌单列表" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "获取歌曲URL", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Input,
                {
                  placeholder: "请输入歌曲id",
                  value: songId2,
                  onChange: (e) => setSongId(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleGetSongUrl, children: "获取歌曲URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleDeleteCloudSong, children: "删除云盘歌曲" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "获取专辑歌曲列表", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Input,
                {
                  placeholder: "请输入专辑id",
                  value: albumId,
                  onChange: (e) => setAlbumId(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleGetAlbumSongList, children: "获取专辑歌曲列表" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "获取歌手歌曲列表", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Input,
                {
                  placeholder: "请输入歌手id",
                  value: artistId,
                  onChange: (e) => setArtistId(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleGetArtistTopSongList, children: "获取歌手热门歌曲列表" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleGetArtistAlbum, children: "获取歌手专辑" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleGetArtistAllSongList, children: "获取歌手全部歌曲" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Form.Item, { label: "二维码登录", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "qrcode-container" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", onClick: handleQrLogin, children: "二维码登录" })
          ] })
        ]
      }
    );
  });
  const songInfoColumn = "_songInfoColumn_19jjf_1";
  const songCover = "_songCover_19jjf_6";
  const songInfo = "_songInfo_19jjf_1";
  const songName = "_songName_19jjf_15";
  const songId = "_songId_19jjf_24";
  const footer = "_footer_19jjf_29";
  const actions = "_actions_19jjf_37";
  const stats = "_stats_19jjf_42";
  const size = "_size_19jjf_47";
  const divider = "_divider_19jjf_50";
  const playlist = "_playlist_19jjf_58";
  const autoAddContent = "_autoAddContent_19jjf_62";
  const title = "_title_19jjf_62";
  const statsWrapper = "_statsWrapper_19jjf_66";
  const statsContent = "_statsContent_19jjf_69";
  const label = "_label_19jjf_76";
  const value = "_value_19jjf_79";
  const listHeader = "_listHeader_19jjf_84";
  const listWrapper = "_listWrapper_19jjf_90";
  const listItem = "_listItem_19jjf_111";
  const itemName = "_itemName_19jjf_127";
  const itemCount = "_itemCount_19jjf_133";
  const deleteConfirmation = "_deleteConfirmation_19jjf_138";
  const count = "_count_19jjf_146";
  const songs = "_songs_19jjf_149";
  const songItem = "_songItem_19jjf_160";
  const warning = "_warning_19jjf_171";
  const text = "_text_19jjf_178";
  const icon = "_icon_19jjf_185";
  const styles = {
    songInfoColumn,
    songCover,
    songInfo,
    songName,
    songId,
    footer,
    actions,
    stats,
    size,
    divider,
    playlist,
    autoAddContent,
    title,
    statsWrapper,
    statsContent,
    label,
    value,
    listHeader,
    listWrapper,
    listItem,
    itemName,
    itemCount,
    deleteConfirmation,
    count,
    songs,
    songItem,
    warning,
    text,
    icon
  };
  const PlayList = (props, ref) => {
    const [visible, setVisible] = require$$0.useState(false);
    const [mode2, setMode] = require$$0.useState("edit");
    const isSelect = mode2 === "select";
    const open = (mode22) => {
      reset();
      if (mode22) {
        setMode(mode22);
      }
      setVisible(true);
      handleGetPlayList();
    };
    const close = () => {
      setVisible(false);
      setPlayList([]);
    };
    const reset = () => {
      setPlayList([]);
      res.current = null;
      setMode("add");
      setSelectedRows([]);
      setName("");
      setCreateModalVisible(false);
    };
    const res = require$$0.useRef(null);
    const submit = () => {
      return new Promise((resolve, reject) => {
        res.current = resolve;
      });
    };
    require$$0.useImperativeHandle(ref, () => ({
      open,
      close,
      submit
    }));
    const [loading, setLoading] = require$$0.useState(false);
    const [playList, setPlayList] = require$$0.useState([]);
    const handleGetPlayList = async () => {
      setLoading(true);
      try {
        const user = getGUser();
        if (!user) return antd.message.error("请先登录");
        const res2 = await getPlaylistList(user.userId);
        console.log("res", res2);
        if (res2.code === 200) {
          setPlayList((list) => [...list, ...res2.playlist]);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    const columns = [
      {
        title: "歌单",
        dataIndex: "name",
        key: "name",
        width: 220,
        ellipsis: true,
        render: (text2, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Image,
            {
              src: record.coverImgUrl,
              width: 40,
              height: 40,
              style: { borderRadius: "4px" },
              preview: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontWeight: 500,
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              },
              children: text2
            }
          )
        ] })
      },
      {
        title: "歌曲数",
        dataIndex: "trackCount",
        key: "trackCount",
        width: 100,
        align: "right",
        sorter: (a, b) => a.trackCount - b.trackCount,
        sortDirections: ["descend", "ascend"],
        render: (text2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            style: {
              color: "#666",
              fontSize: "13px"
            },
            children: [
              text2,
              " 首"
            ]
          }
        )
      },
      {
        title: "创建者",
        dataIndex: ["creator", "nickname"],
        key: "creator",
        width: 150,
        ellipsis: true
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        key: "updateTime",
        width: 200,
        render: (text2) => new Date(text2).toLocaleString(),
        sorter: (a, b) => a.updateTime - b.updateTime,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "播放量",
        dataIndex: "playCount",
        key: "playCount",
        width: 100,
        render: (text2) => {
          const count2 = text2 > 1e4 ? `${(text2 / 1e4).toFixed(1)}万` : text2;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: count2 });
        },
        sorter: (a, b) => a.playCount - b.playCount,
        sortDirections: ["descend", "ascend"]
      }
    ];
    const [selectedRows, setSelectedRows] = require$$0.useState([]);
    const rowSelection = {
      type: isSelect ? "radio" : "checkbox",
      selectedRowKeys: selectedRows.map((item) => item.id),
      onSelectAll: () => {
        setTimeout(() => {
          setSelectedRows(playList);
        }, 0);
      },
      onChange: (_, selectedRows2) => {
        setSelectedRows(selectedRows2);
      }
    };
    const handleConfirm = () => {
      var _a;
      if (!selectedRows.length) {
        msgWarning("请选择歌单");
        return;
      }
      if (selectedRows.length !== 1) return msgWarning("只能选择一个歌单");
      (_a = res.current) == null ? void 0 : _a.call(res, selectedRows[0]);
      close();
    };
    const [name2, setName] = require$$0.useState("");
    const [createModalVisible, setCreateModalVisible] = require$$0.useState(false);
    const handleCreate = async () => {
      if (!name2.trim()) {
        msgWarning("请输入歌单名称");
        return;
      }
      try {
        const res2 = await createPlaylist(name2.trim());
        if (res2.code === 200) {
          msgSuccess("新建成功");
          handleGetPlayList();
          setName("");
          setCreateModalVisible(false);
        } else {
          msgError("新建失败");
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    const handleDelete = async () => {
      if (!selectedRows.length) {
        msgWarning("请选择要删除的歌单");
        return;
      }
      try {
        await confirm(
          /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteConfirmContent, { playlists: selectedRows }),
          "删除歌单"
        );
        const proArr = selectedRows.map((item) => deletePlaylist(item.id));
        const res2 = await Promise.all(proArr);
        console.log("res", res2);
        msgSuccess("删除成功");
        handleGetPlayList();
        setSelectedRows([]);
      } catch (error) {
        console.log("error", error);
        msgError("删除失败");
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        antd.Modal,
        {
          title: "歌单列表",
          open: visible,
          onCancel: close,
          footer: null,
          centered: true,
          width: 800,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Table,
              {
                dataSource: playList,
                columns,
                rowKey: "id",
                size: "small",
                loading,
                scroll: { y: 400 },
                rowSelection
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.footer, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "已选择 ",
                selectedRows.length,
                " 个歌单"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => setCreateModalVisible(true), children: "新建歌单" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  antd.Button,
                  {
                    danger: true,
                    disabled: !selectedRows.length,
                    onClick: handleDelete,
                    children: "删除歌单"
                  }
                ),
                isSelect && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  antd.Button,
                  {
                    type: "primary",
                    onClick: handleConfirm,
                    disabled: selectedRows.length !== 1,
                    children: [
                      "选择(",
                      selectedRows.length,
                      ")"
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Modal,
        {
          title: "新建歌单",
          open: createModalVisible,
          onCancel: () => {
            setCreateModalVisible(false);
            setName("");
          },
          onOk: handleCreate,
          okText: "确定",
          cancelText: "取消",
          centered: true,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Input,
            {
              placeholder: "请输入歌单名称",
              value: name2,
              onChange: (e) => setName(e.target.value),
              onPressEnter: handleCreate,
              autoFocus: true
            }
          )
        }
      )
    ] });
  };
  const DeleteConfirmContent = ({ playlists }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.autoAddContent, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsWrapper, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.title, children: "总计：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.statsContent, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: "删除数量：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.value, children: playlists.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: " 个歌单" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.listHeader, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.title, children: "即将删除的歌单：" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: styles.listWrapper, children: playlists.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: styles.listItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemName, children: item.name }),
          item.trackCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.itemCount, children: [
            item.trackCount,
            "首"
          ] })
        ] }, item.id)) })
      ] })
    ] });
  };
  const PlayList$1 = require$$0.forwardRef(PlayList);
  const SearchForm = ({ onSearch, songList: songList2 }) => {
    const [form] = antd.Form.useForm();
    const getUniqueOptions = (key) => {
      const uniqueList = uniqueArrayByKey(
        songList2.map((item) => ({
          ...item,
          name: item.simpleSong.name,
          singer: item.simpleSong.singer
        })),
        key
      );
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { name: "artist", style: { marginBottom: 0, minWidth: 200 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Select,
        {
          mode: "multiple",
          allowClear: true,
          showSearch: true,
          placeholder: "歌手",
          maxTagCount: "responsive",
          options: getUniqueOptions("artist"),
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
  const Stats = require$$0.memo(({ selectedRows = [], filteredSongList = [] }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.stats, children: [
      "已选择 ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "blue", children: [
        selectedRows.length,
        " 首"
      ] }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.size, children: selectedRows.length > 0 && `${(selectedRows.reduce((acc, cur) => acc + cur.fileSize, 0) / 1024 / 1024).toFixed(2)}MB` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.divider, children: "/" }),
      "共",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "green", children: [
        filteredSongList.length,
        " 首"
      ] }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.size, children: filteredSongList.length > 0 && `${(filteredSongList.reduce((acc, cur) => acc + cur.fileSize, 0) / 1024 / 1024).toFixed(2)}MB` })
    ] });
  });
  Stats.displayName = "Stats";
  const CloudMusicManager = require$$0.forwardRef((props, ref) => {
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
    const [songList2, setSongList] = require$$0.useState([]);
    const [loading, setLoading] = require$$0.useState(false);
    const getCloudDataList = async () => {
      try {
        setLoading(true);
        const res = await getCloudData(1e4, 0);
        if (res.code === 200) {
          console.log("songList", res.data);
          setSongList(res.data);
          setFilteredSongList(res.data);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    require$$0.useEffect(() => {
      if (!visible) return;
      getCloudDataList();
    }, [visible]);
    const [filteredSongList, setFilteredSongList] = require$$0.useState([]);
    const handleSearch = (values) => {
      console.log("values", values);
      const { name: name2, artist: artist2, album } = values;
      const filtered = songList2.filter((song2) => {
        const nameMatch = !(name2 == null ? void 0 : name2.length) || name2.some(
          (n2) => {
            var _a;
            return (_a = song2.simpleSong.name) == null ? void 0 : _a.toLowerCase().includes(n2.toLowerCase());
          }
        );
        const artistMatch = !(artist2 == null ? void 0 : artist2.length) || artist2.some(
          (a) => song2.artist.toLowerCase().includes(a.toLowerCase())
        );
        const albumMatch = !(album == null ? void 0 : album.length) || album.some((a) => song2.album.toLowerCase().includes(a.toLowerCase()));
        const legacy = song2.simpleSong.al && song2.simpleSong.ar;
        const match = nameMatch && artistMatch && albumMatch && legacy;
        if (!match) {
          console.log("song", song2);
          console.log("nameMatch", nameMatch);
          console.log("artistMatch", artistMatch);
          console.log("albumMatch", albumMatch);
          console.log("legacy", legacy);
        }
        return match;
      });
      setFilteredSongList(filtered);
    };
    const [selectedRows, setSelectedRows] = require$$0.useState([]);
    const selectedRowKeys = require$$0.useMemo(
      () => selectedRows.map((item) => item.songId),
      [selectedRows]
    );
    const rowSelection = {
      type: "checkbox",
      fixed: true,
      selectedRowKeys,
      getCheckboxProps: (record) => ({
        disabled: record.uploaded
      }),
      onSelectAll: () => {
        setTimeout(() => {
          setSelectedRows(filteredSongList);
        }, 0);
      },
      onChange: (selectedRowKeys2, selectedRows2) => {
        setSelectedRows(selectedRows2);
      }
    };
    const handleTableChange = (pagination, filters, sorter) => {
      setFilteredSongList((songList22) => {
        return songList22.sort((a, b) => {
          var _a;
          const order = sorter.order === "ascend" ? 1 : -1;
          return order * ((_a = a[sorter.columnKey]) == null ? void 0 : _a.localeCompare(b[sorter.columnKey]));
        });
      });
    };
    const columns = [
      {
        title: "歌名",
        dataIndex: "simpleSong",
        key: "name",
        width: 250,
        sorter: (a, b) => {
          var _a;
          return (_a = a.simpleSong.name) == null ? void 0 : _a.localeCompare(b.simpleSong.name);
        },
        sortDirections: ["ascend", "descend"],
        render: (record) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.songInfoColumn, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: (_a = record.al) == null ? void 0 : _a.picUrl,
                alt: record.name,
                className: styles.songCover
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.songInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.songName, children: record.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.songId, children: record.id })
            ] })
          ] });
        }
      },
      {
        title: "歌手",
        dataIndex: "simpleSong",
        key: "artists",
        width: 200,
        sorter: (a, b) => {
          var _a, _b;
          const aArtists = (_a = a.simpleSong.ar) == null ? void 0 : _a.map((a2) => a2.name).join(",");
          const bArtists = (_b = b.simpleSong.ar) == null ? void 0 : _b.map((a2) => a2.name).join(",");
          return aArtists == null ? void 0 : aArtists.localeCompare(bArtists);
        },
        sortDirections: ["ascend", "descend"],
        ellipsis: true,
        render: (record) => {
          var _a;
          return (_a = record.ar) == null ? void 0 : _a.map((a) => a.name).join(",");
        }
      },
      {
        title: "专辑",
        dataIndex: "simpleSong",
        key: "album",
        width: 300,
        sorter: (a, b) => {
          var _a, _b, _c;
          return (_c = (_a = a.simpleSong.al) == null ? void 0 : _a.name) == null ? void 0 : _c.localeCompare((_b = b.simpleSong.al) == null ? void 0 : _b.name);
        },
        sortDirections: ["ascend", "descend"],
        defaultSortOrder: "ascend",
        ellipsis: true,
        render: (record) => {
          var _a;
          return (_a = record.al) == null ? void 0 : _a.name;
        }
      },
      {
        title: "大小",
        dataIndex: "fileSize",
        key: "fileSize",
        width: 100,
        sorter: (a, b) => a.fileSize - b.fileSize,
        sortDirections: ["ascend", "descend"],
        render: (size2) => `${(size2 / 1024 / 1024).toFixed(2)}MB`
      },
      {
        title: "比特率",
        dataIndex: "bitrate",
        key: "bitrate",
        width: 100,
        sorter: (a, b) => a.bitrate - b.bitrate,
        sortDirections: ["ascend", "descend"],
        render: (bitrate) => /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Tag, { color: "blue", children: [
          bitrate,
          "kbps"
        ] })
      },
      {
        title: "上传时间",
        dataIndex: "addTime",
        key: "addTime",
        width: 150,
        sorter: (a, b) => a.addTime - b.addTime,
        sortDirections: ["ascend", "descend"],
        render: (time) => new Date(time).toLocaleString()
      }
    ];
    const [addToPlayListByAlbumLoading, setAddToPlayListByAlbumLoading] = require$$0.useState(false);
    const handleAddToPlaylistByAlbum = async () => {
      var _a;
      try {
        setAddToPlayListByAlbumLoading(true);
        console.log("自动按专辑添加");
        const albumMap = /* @__PURE__ */ new Map();
        filteredSongList.forEach((song2) => {
          var _a2, _b, _c;
          const { simpleSong } = song2;
          const album = `${((_b = (_a2 = simpleSong.ar) == null ? void 0 : _a2[0]) == null ? void 0 : _b.name) || ""}-${(_c = simpleSong.al) == null ? void 0 : _c.name}`;
          if (!albumMap.has(album)) {
            albumMap.set(album, []);
          }
          albumMap.get(album).push(song2);
        });
        const totalSongs = filteredSongList.length;
        const albums = Array.from(albumMap.entries()).sort(
          ([, songsA], [, songsB]) => songsB.length - songsA.length
        );
        await confirm(
          /* @__PURE__ */ jsxRuntimeExports.jsx(AutoAddContent, { totalSongs, albums }),
          "自动按专辑添加",
          {
            width: "auto"
          }
        );
        const res = await getPlaylistList();
        console.log("res", res);
        if (res.code !== 200) return msgError("获取歌单失败");
        const playlist2 = res.playlist;
        for (const [album, songs2] of albums) {
          try {
            const playlistName = album;
            console.log("playlistName", playlistName, "songs", songs2);
            let playlistId = (_a = playlist2.find((p2) => p2.name === playlistName)) == null ? void 0 : _a.id;
            if (!playlistId) {
              const truncatedName = truncateString(playlistName, 40);
              const res3 = await createPlaylist(truncatedName);
              if (res3.code === 200) {
                playlistId = res3.id;
              } else {
                console.log("res", res3);
                debugger;
              }
              await sleep(1e3);
            }
            const songIds = songs2.map((song2) => song2.songId);
            const res2 = await addSongToPlaylist(playlistId, songIds);
            console.log("res", res2);
            if (res2.code !== 200) {
              console.log("添加歌曲失败", res2.message || res2.msg);
            }
            await sleep(500);
          } catch (error) {
            console.log("error", error);
          }
        }
        setSelectedRows([]);
        msgSuccess("添加成功");
      } catch (error) {
        console.log("error", error);
      } finally {
        setAddToPlayListByAlbumLoading(false);
      }
    };
    const playListRef = require$$0.useRef(null);
    const handleAddToPlaylist = async () => {
      try {
        console.log("添加到歌单");
        playListRef.current.open("select");
        const playlist2 = await playListRef.current.submit();
        if (!playlist2) return;
        const songIds = selectedRows.map((item) => item.songId);
        const res = await addSongToPlaylist(playlist2.id, songIds);
        console.log("res", res);
        if (res.code === 200) {
          setSelectedRows([]);
          msgSuccess("添加成功");
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    const handleCreatePlaylist = () => {
      console.log("新建歌单");
      playListRef.current.open();
    };
    const handleDeleteSong = async () => {
      try {
        const confirmContent = /* @__PURE__ */ jsxRuntimeExports.jsx(
          DeleteConfirmation,
          {
            selectedCount: selectedRows.length,
            songNames: selectedRows.map((item) => item.simpleSong.name)
          }
        );
        await confirm(confirmContent, "删除确认");
        const songIds = selectedRows.map((item) => item.songId);
        const res = await deleteCloudSong(songIds);
        console.log("res", res);
        if (res.code === 200) {
          msgSuccess("删除成功");
          reset();
          getCloudDataList();
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      antd.Modal,
      {
        title: "云盘音乐管理",
        open: visible,
        onCancel: close,
        footer: null,
        centered: true,
        width: 900,
        children: [
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
              rowKey: ({ songId: songId2 }) => songId2,
              onChange: handleTableChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.footer, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Stats,
              {
                selectedRows,
                filteredSongList
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.actions, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => setSelectedRows(filteredSongList), children: "全部选择" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Button,
                {
                  type: "primary",
                  onClick: handleAddToPlaylistByAlbum,
                  loading: addToPlayListByAlbumLoading,
                  children: "自动按专辑添加"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Button,
                {
                  type: "primary",
                  disabled: !selectedRows.length,
                  onClick: handleAddToPlaylist,
                  children: "添加到歌单"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: handleCreatePlaylist, children: "新建歌单" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Button,
                {
                  type: "primary",
                  danger: true,
                  disabled: !selectedRows.length,
                  onClick: handleDeleteSong,
                  children: "删除歌曲"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlayList$1, { ref: playListRef })
        ]
      }
    );
  });
  const AutoAddContent = ({ totalSongs, albums }) => {
    const handleCopy = () => {
      const text2 = albums.map(([name2, songs2]) => `${name2}（${songs2.length}首）`).join("\n");
      navigator.clipboard.writeText(text2).then(() => {
        antd.message.success("复制成功");
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.autoAddContent, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsWrapper, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.title, children: "总计：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsContent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: "歌曲数：" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.value, children: totalSongs }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: " 首" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: "歌单数：" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.value, children: albums.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.label, children: " 个" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.listHeader, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.title, children: "即将创建的歌单：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Button,
            {
              type: "link",
              size: "small",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(icons.CopyrightOutlined, {}),
              onClick: handleCopy,
              children: "复制列表"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: styles.listWrapper, children: albums.map(([name2, songs2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: styles.listItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.itemName, children: name2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.itemCount, children: [
            songs2.length,
            "首"
          ] })
        ] }, name2)) })
      ] })
    ] });
  };
  const DeleteConfirmation = ({ selectedCount, songNames }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.deleteConfirmation, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.title, children: [
        "您确定要删除以下 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.count, children: selectedCount }),
        " 首歌曲吗？"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.songs, children: songNames.map((name2, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.songItem, children: name2 }, index)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.warning, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.text, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.icon, children: "!" }),
        "注意：此操作不可恢复，删除后歌曲将从您的网易云音乐云盘中永久移除。"
      ] }) })
    ] });
  };
  const ButtonGroup = () => {
    const quickUploadRef = require$$0.useRef(null);
    const handleQuickUpload = () => {
      quickUploadRef.current.open();
    };
    const cloudMusicManagerRef = require$$0.useRef(null);
    const handleCloudMusicManager = () => {
      cloudMusicManagerRef.current.open();
    };
    const qualityUpgradeRef = require$$0.useRef(null);
    const localUploadRef = require$$0.useRef(null);
    const vipSongARef = require$$0.useRef(null);
    const vipSongBRef = require$$0.useRef(null);
    const cloudExportRef = require$$0.useRef(null);
    const cloudImportRef = require$$0.useRef(null);
    const testModalRef = require$$0.useRef(null);
    const handleTestModal = () => {
      testModalRef.current.open();
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$2["button-group"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tooltip, { title: "云盘快速上传", placement: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Button,
        {
          type: "primary",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(icons.CloudUploadOutlined, {}),
          onClick: handleQuickUpload,
          className: styles$2["button"]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tooltip, { title: "云盘歌曲管理", placement: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Button,
        {
          type: "primary",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(icons.CustomerServiceOutlined, {}),
          onClick: handleCloudMusicManager,
          className: styles$2["button"]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tooltip, { title: "testModal", placement: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Button,
        {
          type: "primary",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(icons.InfoCircleOutlined, {}),
          onClick: handleTestModal,
          className: styles$2["button"]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickUpload$1, { ref: quickUploadRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CloudMusicManager, { ref: cloudMusicManagerRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QualityUpgrade, { ref: qualityUpgradeRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LocalUpload, { ref: localUploadRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VipSongA, { ref: vipSongARef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VipSongB, { ref: vipSongBRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CloudExport, { ref: cloudExportRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CloudImport, { ref: cloudImportRef }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TestModal, { ref: testModalRef })
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

})(React, antd, ReactDOM, icons, forge);