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
// @require      https://cdn.jsdelivr.net/npm/node-forge@1.3.1/lib/index.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const s=document.createElement("style");s.textContent=o,document.head.append(s)})(" ._button-group_dcsms_1{position:fixed;right:20px;top:50%;width:44px;max-height:400px;overflow-y:auto;background:#ffffffe6;border-radius:22px;box-shadow:0 2px 10px #0000001a;padding:10px 0;z-index:999}._button-group_dcsms_1::-webkit-scrollbar{width:0;background:transparent}._button-group_dcsms_1 .ant-btn{width:36px;height:36px;padding:0;border:none;background:transparent;display:flex;align-items:center;justify-content:center;margin:4px auto;transition:all .3s}._button-group_dcsms_1 .ant-btn:hover{background:#c20c0c1a;color:#fff;transform:scale(1.1)}._button-group_dcsms_1 .ant-btn:active{transform:scale(.95)}._button-group_dcsms_1 .ant-btn .anticon{font-size:20px;color:#666}._button-group_dcsms_1 .ant-btn:hover .anticon{color:#fff}._button-group_dcsms_1 .ant-tooltip .ant-tooltip-inner{background-color:#000c;border-radius:4px;font-size:12px;padding:4px 8px}._button-group_dcsms_1 .ant-tooltip .ant-tooltip-arrow-content{background-color:#000c}._quick-upload-tabs_10bds_1 .ant-spin{width:100%;height:100%}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-default{border-color:#d9d9d9;color:#333}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-default:hover{border-color:#c20c0c;color:#c20c0c}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-primary{background:#c20c0c;border-color:#c20c0c}._quick-upload-tabs_10bds_1 .ant-modal-footer .ant-btn-primary:hover{background:#a40a0a;border-color:#a40a0a}._quick-upload-tabs_10bds_1 ._select_10bds_21{width:100%}._quick-upload-tabs_10bds_1 ._option-label_10bds_24{display:flex;align-items:center;gap:8px;justify-content:space-between;width:100%}._quick-upload-tabs_10bds_1 ._option-label_10bds_24 ._singer-name_10bds_31{font-weight:500}._quick-upload-tabs_10bds_1 ._option-label_10bds_24 ._tag-group_10bds_34 ._tag_10bds_34:not(:last-child){margin-right:8px}._singer-choose_10bds_38 ._singer-choose-form_10bds_38{display:flex;flex-direction:column;justify-content:space-between;height:400px}._singer-choose_10bds_38 ._singer-choose-form_10bds_38 ._btn-group_10bds_44{display:flex;justify-content:flex-end}._upload-list_10bds_49 .ant-table{margin:16px 0}._upload-footer_10bds_53{width:100%;display:flex;justify-content:flex-end;align-items:center;gap:8px}._upload-stats_10bds_61{color:#666;font-size:13px;margin-right:auto}._upload-stats_10bds_61 ._size-text_10bds_66{color:#999}._upload-stats_10bds_61 ._divider_10bds_69{margin:0 8px;color:#d9d9d9}._upload-confirm_10bds_74{padding:16px 0;font-size:14px}._upload-confirm_10bds_74 ._confirm-item_10bds_78{display:flex;align-items:center;margin-bottom:12px}._upload-confirm_10bds_74 ._confirm-item_10bds_78:last-child{margin-bottom:0}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._label_10bds_86{color:#666;width:80px;flex-shrink:0}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._value_10bds_91{color:#333;font-weight:500}._upload-confirm_10bds_74 ._confirm-item_10bds_78 ._value_10bds_91 ._size_10bds_66{margin-left:4px;color:#999;font-weight:400}._upload-progress_10bds_101 ._progress-header_10bds_101{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding:0 4px}._upload-progress_10bds_101 ._progress-header_10bds_101 ._progress-info_10bds_108{font-size:14px;color:#333}._upload-progress_10bds_101 ._progress-header_10bds_101 ._percentage_10bds_112{font-size:14px;font-weight:500;color:#1890ff}._upload-progress_10bds_101 ._progress-list_10bds_117{max-height:300px;overflow-y:auto;padding:0 4px}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122:last-child{border-bottom:none}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132{flex:1;min-width:0;padding-right:16px}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132 ._name_10bds_137{font-size:14px;color:#333}._upload-progress_10bds_101 ._progress-list_10bds_117 ._progress-item_10bds_122 ._song-info_10bds_132 ._artist_10bds_141{font-size:14px;color:#666;margin-left:4px}._uploadProgressModal_10bds_147 .ant-modal-body{padding:24px}._uploadProgressModal_10bds_147 ._progressContent_10bds_150{display:flex;flex-direction:column;align-items:center;gap:24px}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156{display:flex;flex-direction:column;align-items:center}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156 ._percentage_10bds_112{font-size:24px;font-weight:500;color:#333}._uploadProgressModal_10bds_147 ._progressInfo_10bds_156 ._detail_10bds_166{font-size:14px;color:#666;margin-top:4px}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171{display:flex;justify-content:space-around;width:100%;padding:16px 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179{text-align:center}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179 ._label_10bds_86{font-size:14px;color:#666;margin-bottom:8px}._uploadProgressModal_10bds_147 ._statsContainer_10bds_171 ._statsItem_10bds_179 ._value_10bds_91 .ant-tag{margin:0;font-size:14px;padding:4px 12px}._uploadProgressModal_10bds_147 ._failedList_10bds_192{width:100%}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedTitle_10bds_195{font-size:14px;color:#333;margin-bottom:12px;font-weight:500}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201{padding:8px 12px;background:#fff1f0;border-radius:4px;margin-bottom:8px}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201 ._songName_10bds_207{font-size:14px;color:#333;margin-bottom:4px}._uploadProgressModal_10bds_147 ._failedList_10bds_192 ._failedItem_10bds_201 ._errorMsg_10bds_212{font-size:12px;color:#ff4d4f}._uploadModal_10bds_217 .ant-modal-body{padding:24px}._progressSection_10bds_221{display:flex;flex-direction:column;align-items:center;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f0f0f0}._progressInfo_10bds_156{display:flex;flex-direction:column;align-items:center}._progressInfo_10bds_156 ._percentage_10bds_112{font-size:24px;font-weight:500;color:#333}._progressInfo_10bds_156 ._count_10bds_240{font-size:14px;color:#666;margin-top:4px}._statsContainer_10bds_171{display:flex;justify-content:center;gap:16px;margin-top:20px}._statsContainer_10bds_171 ._statsItem_10bds_179{text-align:center}._statsContainer_10bds_171 ._statsTag_10bds_255{padding:4px 12px;font-size:14px}._songList_10bds_260{max-height:300px;overflow-y:auto;padding-right:4px}._songList_10bds_260::-webkit-scrollbar{width:6px}._songList_10bds_260::-webkit-scrollbar-thumb{background-color:#d9d9d9;border-radius:3px}._songList_10bds_260::-webkit-scrollbar-thumb:hover{background-color:#bfbfbf}._songItem_10bds_276{display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:4px;background:#fafafa}._songItem_10bds_276:not(:last-child){margin-bottom:8px}._songItem_10bds_276:hover{background:#f5f5f5}._songInfo_10bds_291{display:flex;align-items:center;gap:8px;flex:1;min-width:0}._songInfo_10bds_291 ._songName_10bds_207{font-weight:500;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}._songInfo_10bds_291 ._artistName_10bds_305{color:#666;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent;border-radius:6px}::-webkit-scrollbar-thumb{background:#8080804d;border-radius:6px;transition:all .2s ease-in-out}::-webkit-scrollbar-thumb:hover{background:#80808080}*{scrollbar-width:thin;scrollbar-color:rgba(128,128,128,.3) transparent} ");

(function (React, antd, require$$0, forge) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

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
  var f = React, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
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
  var m = require$$0;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  var IconContext = /* @__PURE__ */ React.createContext({});
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n2) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n2[r] = t[r]);
      }
      return n2;
    }, _extends.apply(null, arguments);
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l2) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n2, i, u, a = [], f2 = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l2) ;
        else for (; !(f2 = (e = i.call(t)).done) && (a.push(e.value), a.length !== l2); f2 = true) ;
      } catch (r2) {
        o = true, n2 = r2;
      } finally {
        try {
          if (!f2 && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
        } finally {
          if (o) throw n2;
        }
      }
      return a;
    }
  }
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n2 = Array(a); e < a; e++) n2[e] = r[e];
    return n2;
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _typeof$1(o) {
    "@babel/helpers - typeof";
    return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof$1(o);
  }
  function toPrimitive$1(t, r) {
    if ("object" != _typeof$1(t) || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != _typeof$1(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function toPropertyKey$1(t) {
    var i = toPrimitive$1(t, "string");
    return "symbol" == _typeof$1(i) ? i : i + "";
  }
  function _defineProperty(e, r, t) {
    return (r = toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for (var n2 in r) if ({}.hasOwnProperty.call(r, n2)) {
      if (e.includes(n2)) continue;
      t[n2] = r[n2];
    }
    return t;
  }
  function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
      var s = Object.getOwnPropertySymbols(e);
      for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
  }
  var classnames = { exports: {} };
  /*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  */
  (function(module) {
    (function() {
      var hasOwn = {}.hasOwnProperty;
      function classNames2() {
        var classes = "";
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (arg) {
            classes = appendClass(classes, parseValue(arg));
          }
        }
        return classes;
      }
      function parseValue(arg) {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        }
        if (typeof arg !== "object") {
          return "";
        }
        if (Array.isArray(arg)) {
          return classNames2.apply(null, arg);
        }
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          return arg.toString();
        }
        var classes = "";
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
          }
        }
        return classes;
      }
      function appendClass(value2, newClass) {
        if (!newClass) {
          return value2;
        }
        if (value2) {
          return value2 + " " + newClass;
        }
        return value2 + newClass;
      }
      if (module.exports) {
        classNames2.default = classNames2;
        module.exports = classNames2;
      } else {
        window.classNames = classNames2;
      }
    })();
  })(classnames);
  var classnamesExports = classnames.exports;
  const classNames = /* @__PURE__ */ getDefaultExportFromCjs(classnamesExports);
  function bound01(n2, max) {
    if (isOnePointZero(n2)) {
      n2 = "100%";
    }
    var isPercent = isPercentage(n2);
    n2 = max === 360 ? n2 : Math.min(max, Math.max(0, parseFloat(n2)));
    if (isPercent) {
      n2 = parseInt(String(n2 * max), 10) / 100;
    }
    if (Math.abs(n2 - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n2 = (n2 < 0 ? n2 % max + max : n2 % max) / parseFloat(String(max));
    } else {
      n2 = n2 % max / parseFloat(String(max));
    }
    return n2;
  }
  function isOnePointZero(n2) {
    return typeof n2 === "string" && n2.indexOf(".") !== -1 && parseFloat(n2) === 1;
  }
  function isPercentage(n2) {
    return typeof n2 === "string" && n2.indexOf("%") !== -1;
  }
  function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }
    return a;
  }
  function convertToPercentage(n2) {
    if (n2 <= 1) {
      return "".concat(Number(n2) * 100, "%");
    }
    return n2;
  }
  function pad2(c) {
    return c.length === 1 ? "0" + c : String(c);
  }
  function rgbToRgb(r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    };
  }
  function hue2rgb(p2, q2, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p2 + (q2 - p2) * (6 * t);
    }
    if (t < 1 / 2) {
      return q2;
    }
    if (t < 2 / 3) {
      return p2 + (q2 - p2) * (2 / 3 - t) * 6;
    }
    return p2;
  }
  function hslToRgb(h, s, l2) {
    var r;
    var g;
    var b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l2 = bound01(l2, 100);
    if (s === 0) {
      g = l2;
      b = l2;
      r = l2;
    } else {
      var q2 = l2 < 0.5 ? l2 * (1 + s) : l2 + s - l2 * s;
      var p2 = 2 * l2 - q2;
      r = hue2rgb(p2, q2, h + 1 / 3);
      g = hue2rgb(p2, q2, h);
      b = hue2rgb(p2, q2, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, v };
  }
  function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f2 = h - i;
    var p2 = v * (1 - s);
    var q2 = v * (1 - f2 * s);
    var t = v * (1 - (1 - f2) * s);
    var mod = i % 6;
    var r = [v, q2, p2, p2, t, v][mod];
    var g = [t, v, v, q2, p2, p2][mod];
    var b = [p2, p2, t, v, v, q2][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHex(r, g, b, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16))
    ];
    return hex.join("");
  }
  function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };
  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l2 = null;
    var ok = false;
    var format = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l2 = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l2);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a = color.a;
      }
    }
    a = boundAlpha(a);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }
  var hueStep = 2;
  var saturationStep = 0.16;
  var saturationStep2 = 0.05;
  var brightnessStep1 = 0.05;
  var brightnessStep2 = 0.15;
  var lightColorCount = 5;
  var darkColorCount = 4;
  var darkColorMap = [{
    index: 7,
    opacity: 0.15
  }, {
    index: 6,
    opacity: 0.25
  }, {
    index: 5,
    opacity: 0.3
  }, {
    index: 5,
    opacity: 0.45
  }, {
    index: 5,
    opacity: 0.65
  }, {
    index: 5,
    opacity: 0.85
  }, {
    index: 4,
    opacity: 0.9
  }, {
    index: 3,
    opacity: 0.95
  }, {
    index: 2,
    opacity: 0.97
  }, {
    index: 1,
    opacity: 0.98
  }];
  function toHsv(_ref) {
    var r = _ref.r, g = _ref.g, b = _ref.b;
    var hsv = rgbToHsv(r, g, b);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v
    };
  }
  function toHex(_ref2) {
    var r = _ref2.r, g = _ref2.g, b = _ref2.b;
    return "#".concat(rgbToHex(r, g, b));
  }
  function mix(rgb1, rgb2, amount) {
    var p2 = amount / 100;
    var rgb = {
      r: (rgb2.r - rgb1.r) * p2 + rgb1.r,
      g: (rgb2.g - rgb1.g) * p2 + rgb1.g,
      b: (rgb2.b - rgb1.b) * p2 + rgb1.b
    };
    return rgb;
  }
  function getHue(hsv, i, light) {
    var hue;
    if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
      hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
    } else {
      hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
    }
    if (hue < 0) {
      hue += 360;
    } else if (hue >= 360) {
      hue -= 360;
    }
    return hue;
  }
  function getSaturation(hsv, i, light) {
    if (hsv.h === 0 && hsv.s === 0) {
      return hsv.s;
    }
    var saturation;
    if (light) {
      saturation = hsv.s - saturationStep * i;
    } else if (i === darkColorCount) {
      saturation = hsv.s + saturationStep;
    } else {
      saturation = hsv.s + saturationStep2 * i;
    }
    if (saturation > 1) {
      saturation = 1;
    }
    if (light && i === lightColorCount && saturation > 0.1) {
      saturation = 0.1;
    }
    if (saturation < 0.06) {
      saturation = 0.06;
    }
    return Number(saturation.toFixed(2));
  }
  function getValue(hsv, i, light) {
    var value2;
    if (light) {
      value2 = hsv.v + brightnessStep1 * i;
    } else {
      value2 = hsv.v - brightnessStep2 * i;
    }
    if (value2 > 1) {
      value2 = 1;
    }
    return Number(value2.toFixed(2));
  }
  function generate$1(color) {
    var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var patterns = [];
    var pColor = inputToRGB(color);
    for (var i = lightColorCount; i > 0; i -= 1) {
      var hsv = toHsv(pColor);
      var colorString = toHex(inputToRGB({
        h: getHue(hsv, i, true),
        s: getSaturation(hsv, i, true),
        v: getValue(hsv, i, true)
      }));
      patterns.push(colorString);
    }
    patterns.push(toHex(pColor));
    for (var _i = 1; _i <= darkColorCount; _i += 1) {
      var _hsv = toHsv(pColor);
      var _colorString = toHex(inputToRGB({
        h: getHue(_hsv, _i),
        s: getSaturation(_hsv, _i),
        v: getValue(_hsv, _i)
      }));
      patterns.push(_colorString);
    }
    if (opts.theme === "dark") {
      return darkColorMap.map(function(_ref3) {
        var index = _ref3.index, opacity = _ref3.opacity;
        var darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || "#141414"), inputToRGB(patterns[index]), opacity * 100));
        return darkColorString;
      });
    }
    return patterns;
  }
  var blue = ["#e6f4ff", "#bae0ff", "#91caff", "#69b1ff", "#4096ff", "#1677ff", "#0958d9", "#003eb3", "#002c8c", "#001d66"];
  blue.primary = blue[5];
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
  function _objectSpread2$1(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
        _defineProperty(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function canUseDom() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
  }
  function contains(root, n2) {
    if (!root) {
      return false;
    }
    if (root.contains) {
      return root.contains(n2);
    }
    var node = n2;
    while (node) {
      if (node === root) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
  var APPEND_ORDER = "data-rc-order";
  var APPEND_PRIORITY = "data-rc-priority";
  var MARK_KEY = "rc-util-key";
  var containerCache = /* @__PURE__ */ new Map();
  function getMark() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, mark = _ref.mark;
    if (mark) {
      return mark.startsWith("data-") ? mark : "data-".concat(mark);
    }
    return MARK_KEY;
  }
  function getContainer(option) {
    if (option.attachTo) {
      return option.attachTo;
    }
    var head = document.querySelector("head");
    return head || document.body;
  }
  function getOrder(prepend) {
    if (prepend === "queue") {
      return "prependQueue";
    }
    return prepend ? "prepend" : "append";
  }
  function findStyles(container) {
    return Array.from((containerCache.get(container) || container).children).filter(function(node) {
      return node.tagName === "STYLE";
    });
  }
  function injectCSS(css) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!canUseDom()) {
      return null;
    }
    var csp = option.csp, prepend = option.prepend, _option$priority = option.priority, priority = _option$priority === void 0 ? 0 : _option$priority;
    var mergedOrder = getOrder(prepend);
    var isPrependQueue = mergedOrder === "prependQueue";
    var styleNode = document.createElement("style");
    styleNode.setAttribute(APPEND_ORDER, mergedOrder);
    if (isPrependQueue && priority) {
      styleNode.setAttribute(APPEND_PRIORITY, "".concat(priority));
    }
    if (csp !== null && csp !== void 0 && csp.nonce) {
      styleNode.nonce = csp === null || csp === void 0 ? void 0 : csp.nonce;
    }
    styleNode.innerHTML = css;
    var container = getContainer(option);
    var firstChild = container.firstChild;
    if (prepend) {
      if (isPrependQueue) {
        var existStyle = (option.styles || findStyles(container)).filter(function(node) {
          if (!["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER))) {
            return false;
          }
          var nodePriority = Number(node.getAttribute(APPEND_PRIORITY) || 0);
          return priority >= nodePriority;
        });
        if (existStyle.length) {
          container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
          return styleNode;
        }
      }
      container.insertBefore(styleNode, firstChild);
    } else {
      container.appendChild(styleNode);
    }
    return styleNode;
  }
  function findExistNode(key) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var container = getContainer(option);
    return (option.styles || findStyles(container)).find(function(node) {
      return node.getAttribute(getMark(option)) === key;
    });
  }
  function syncRealContainer(container, option) {
    var cachedRealContainer = containerCache.get(container);
    if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
      var placeholderStyle = injectCSS("", option);
      var parentNode = placeholderStyle.parentNode;
      containerCache.set(container, parentNode);
      container.removeChild(placeholderStyle);
    }
  }
  function updateCSS(css, key) {
    var originOption = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var container = getContainer(originOption);
    var styles2 = findStyles(container);
    var option = _objectSpread2$1(_objectSpread2$1({}, originOption), {}, {
      styles: styles2
    });
    syncRealContainer(container, option);
    var existNode = findExistNode(key, option);
    if (existNode) {
      var _option$csp, _option$csp2;
      if ((_option$csp = option.csp) !== null && _option$csp !== void 0 && _option$csp.nonce && existNode.nonce !== ((_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce)) {
        var _option$csp3;
        existNode.nonce = (_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce;
      }
      if (existNode.innerHTML !== css) {
        existNode.innerHTML = css;
      }
      return existNode;
    }
    var newNode = injectCSS(css, option);
    newNode.setAttribute(getMark(option), key);
    return newNode;
  }
  function getRoot(ele) {
    var _ele$getRootNode;
    return ele === null || ele === void 0 || (_ele$getRootNode = ele.getRootNode) === null || _ele$getRootNode === void 0 ? void 0 : _ele$getRootNode.call(ele);
  }
  function inShadow(ele) {
    return getRoot(ele) instanceof ShadowRoot;
  }
  function getShadowRoot(ele) {
    return inShadow(ele) ? getRoot(ele) : null;
  }
  var warned = {};
  var preMessage = function preMessage2(fn) {
  };
  function warning$1(valid, message2) {
  }
  function note(valid, message2) {
  }
  function resetWarned() {
    warned = {};
  }
  function call(method, valid, message2) {
    if (!valid && !warned[message2]) {
      method(false, message2);
      warned[message2] = true;
    }
  }
  function warningOnce(valid, message2) {
    call(warning$1, valid, message2);
  }
  function noteOnce(valid, message2) {
    call(note, valid, message2);
  }
  warningOnce.preMessage = preMessage;
  warningOnce.resetWarned = resetWarned;
  warningOnce.noteOnce = noteOnce;
  function camelCase(input) {
    return input.replace(/-(.)/g, function(match, g) {
      return g.toUpperCase();
    });
  }
  function warning(valid, message2) {
    warningOnce(valid, "[@ant-design/icons] ".concat(message2));
  }
  function isIconDefinition(target) {
    return _typeof$1(target) === "object" && typeof target.name === "string" && typeof target.theme === "string" && (_typeof$1(target.icon) === "object" || typeof target.icon === "function");
  }
  function normalizeAttrs() {
    var attrs = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return Object.keys(attrs).reduce(function(acc, key) {
      var val = attrs[key];
      switch (key) {
        case "class":
          acc.className = val;
          delete acc.class;
          break;
        default:
          delete acc[key];
          acc[camelCase(key)] = val;
      }
      return acc;
    }, {});
  }
  function generate(node, key, rootProps) {
    if (!rootProps) {
      return /* @__PURE__ */ React.createElement(node.tag, _objectSpread2$1({
        key
      }, normalizeAttrs(node.attrs)), (node.children || []).map(function(child, index) {
        return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
      }));
    }
    return /* @__PURE__ */ React.createElement(node.tag, _objectSpread2$1(_objectSpread2$1({
      key
    }, normalizeAttrs(node.attrs)), rootProps), (node.children || []).map(function(child, index) {
      return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
    }));
  }
  function getSecondaryColor(primaryColor) {
    return generate$1(primaryColor)[0];
  }
  function normalizeTwoToneColors(twoToneColor) {
    if (!twoToneColor) {
      return [];
    }
    return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
  }
  var iconStyles = "\n.anticon {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
  var useInsertStyles = function useInsertStyles2(eleRef) {
    var _useContext = React.useContext(IconContext), csp = _useContext.csp, prefixCls = _useContext.prefixCls;
    var mergedStyleStr = iconStyles;
    if (prefixCls) {
      mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
    }
    React.useEffect(function() {
      var ele = eleRef.current;
      var shadowRoot = getShadowRoot(ele);
      updateCSS(mergedStyleStr, "@ant-design-icons", {
        prepend: true,
        csp,
        attachTo: shadowRoot
      });
    }, []);
  };
  var _excluded$1 = ["icon", "className", "onClick", "style", "primaryColor", "secondaryColor"];
  var twoToneColorPalette = {
    primaryColor: "#333",
    secondaryColor: "#E6E6E6",
    calculated: false
  };
  function setTwoToneColors(_ref) {
    var primaryColor = _ref.primaryColor, secondaryColor = _ref.secondaryColor;
    twoToneColorPalette.primaryColor = primaryColor;
    twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
    twoToneColorPalette.calculated = !!secondaryColor;
  }
  function getTwoToneColors() {
    return _objectSpread2$1({}, twoToneColorPalette);
  }
  var IconBase = function IconBase2(props) {
    var icon = props.icon, className = props.className, onClick = props.onClick, style = props.style, primaryColor = props.primaryColor, secondaryColor = props.secondaryColor, restProps = _objectWithoutProperties(props, _excluded$1);
    var svgRef = React__namespace.useRef();
    var colors = twoToneColorPalette;
    if (primaryColor) {
      colors = {
        primaryColor,
        secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
      };
    }
    useInsertStyles(svgRef);
    warning(isIconDefinition(icon), "icon should be icon definiton, but got ".concat(icon));
    if (!isIconDefinition(icon)) {
      return null;
    }
    var target = icon;
    if (target && typeof target.icon === "function") {
      target = _objectSpread2$1(_objectSpread2$1({}, target), {}, {
        icon: target.icon(colors.primaryColor, colors.secondaryColor)
      });
    }
    return generate(target.icon, "svg-".concat(target.name), _objectSpread2$1(_objectSpread2$1({
      className,
      onClick,
      style,
      "data-icon": target.name,
      width: "1em",
      height: "1em",
      fill: "currentColor",
      "aria-hidden": "true"
    }, restProps), {}, {
      ref: svgRef
    }));
  };
  IconBase.displayName = "IconReact";
  IconBase.getTwoToneColors = getTwoToneColors;
  IconBase.setTwoToneColors = setTwoToneColors;
  function setTwoToneColor(twoToneColor) {
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return IconBase.setTwoToneColors({
      primaryColor,
      secondaryColor
    });
  }
  function getTwoToneColor() {
    var colors = IconBase.getTwoToneColors();
    if (!colors.calculated) {
      return colors.primaryColor;
    }
    return [colors.primaryColor, colors.secondaryColor];
  }
  var _excluded = ["className", "icon", "spin", "rotate", "tabIndex", "onClick", "twoToneColor"];
  setTwoToneColor(blue.primary);
  var Icon = /* @__PURE__ */ React__namespace.forwardRef(function(props, ref) {
    var className = props.className, icon = props.icon, spin = props.spin, rotate = props.rotate, tabIndex = props.tabIndex, onClick = props.onClick, twoToneColor = props.twoToneColor, restProps = _objectWithoutProperties(props, _excluded);
    var _React$useContext = React__namespace.useContext(IconContext), _React$useContext$pre = _React$useContext.prefixCls, prefixCls = _React$useContext$pre === void 0 ? "anticon" : _React$useContext$pre, rootClassName = _React$useContext.rootClassName;
    var classString = classNames(rootClassName, prefixCls, _defineProperty(_defineProperty({}, "".concat(prefixCls, "-").concat(icon.name), !!icon.name), "".concat(prefixCls, "-spin"), !!spin || icon.name === "loading"), className);
    var iconTabIndex = tabIndex;
    if (iconTabIndex === void 0 && onClick) {
      iconTabIndex = -1;
    }
    var svgStyle = rotate ? {
      msTransform: "rotate(".concat(rotate, "deg)"),
      transform: "rotate(".concat(rotate, "deg)")
    } : void 0;
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return /* @__PURE__ */ React__namespace.createElement("span", _extends({
      role: "img",
      "aria-label": icon.name
    }, restProps, {
      ref,
      tabIndex: iconTabIndex,
      onClick,
      className: classString
    }), /* @__PURE__ */ React__namespace.createElement(IconBase, {
      icon,
      primaryColor,
      secondaryColor,
      style: svgStyle
    }));
  });
  Icon.displayName = "AntdIcon";
  Icon.getTwoToneColor = getTwoToneColor;
  Icon.setTwoToneColor = setTwoToneColor;
  var CloudUploadOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M518.3 459a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z" } }, { "tag": "path", "attrs": { "d": "M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z" } }] }, "name": "cloud-upload", "theme": "outlined" };
  var CloudUploadOutlined = function CloudUploadOutlined2(props, ref) {
    return /* @__PURE__ */ React__namespace.createElement(Icon, _extends({}, props, {
      ref,
      icon: CloudUploadOutlined$1
    }));
  };
  var RefIcon = /* @__PURE__ */ React__namespace.forwardRef(CloudUploadOutlined);
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
    const renderSingerList = React.useMemo(() => {
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
  const UploadProgress = React.forwardRef(
    ({ uploadedList, total, uploadFailedSongList, onClose }, ref) => {
      const [visible, setVisible] = React.useState(false);
      const open = () => setVisible(true);
      const close = () => {
        setVisible(false);
        onClose == null ? void 0 : onClose();
      };
      const reset = () => {
      };
      React.useImperativeHandle(ref, () => ({
        open,
        close,
        reset
      }));
      const uploadedCount = uploadedList.length;
      const failedCount = uploadFailedSongList.length;
      const percent = Math.floor((uploadedCount + failedCount) / total * 100);
      const isCompleted = uploadedCount + failedCount === total;
      const songListRef = React.useRef(null);
      React.useEffect(() => {
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
  const UploadStats = React.memo(({ selectedRows, filteredSongList }) => {
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
    const [songList2, setSongList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
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
    React.useEffect(() => {
      getSongList(singerList);
    }, [singerList]);
    const [filteredSongList, setFilteredSongList] = React.useState([]);
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
    const [selectedRows, setSelectedRows] = React.useState([]);
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
    const uploadProgressRef = React.useRef(null);
    const [uploadedSongList, setUploadedSongList] = React.useState([]);
    const [uploadFailedSongList, setUploadFailedSongList] = React.useState([]);
    const [toUploadingSongList, setToUploadingSongList] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
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
    const [visible, setVisible] = React.useState(false);
    const open = () => {
      reset();
      getSingerList();
      setVisible(true);
    };
    const close = () => setVisible(false);
    const reset = () => {
      setSingerList([]);
    };
    const [currentTab, setCurrentTab] = React.useState("1");
    const [singerList, setSingerList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
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
    const [chooseList, setChooseList] = React.useState([]);
    const handleChoose = (value2) => {
      console.log(value2);
      setChooseList(value2);
      setCurrentTab("2");
    };
    React.useImperativeHandle(ref, () => ({
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
  const QuickUpload$1 = React.forwardRef(QuickUpload);
  const MatchCorrect = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    React.useImperativeHandle(ref, () => ({
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
  const QualityUpgrade = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    React.useImperativeHandle(ref, () => ({
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
  const LocalUpload = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    React.useImperativeHandle(ref, () => ({
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
  const VipSongA = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    React.useImperativeHandle(ref, () => ({
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
  const VipSongB = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    React.useImperativeHandle(ref, () => ({
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
  const CloudExport = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    React.useImperativeHandle(ref, () => ({
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
  const CloudImport = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const reset = () => {
    };
    React.useImperativeHandle(ref, () => ({
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
    const quickUploadRef = React.useRef(null);
    const handleQuickUpload = () => {
      quickUploadRef.current.open();
    };
    const matchCorrectRef = React.useRef(null);
    const qualityUpgradeRef = React.useRef(null);
    const localUploadRef = React.useRef(null);
    const vipSongARef = React.useRef(null);
    const vipSongBRef = React.useRef(null);
    const cloudExportRef = React.useRef(null);
    const cloudImportRef = React.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1["button-group"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Tooltip, { title: "云盘快速上传", placement: "left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Button,
        {
          type: "primary",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
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
    function _defineProperty2(e, r, t) {
      return (r = toPropertyKey2(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    module.exports = _defineProperty2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(defineProperty);
  var definePropertyExports = defineProperty.exports;
  (function(module) {
    var defineProperty2 = definePropertyExports;
    function ownKeys2(e, r) {
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
        r % 2 ? ownKeys2(Object(t), true).forEach(function(r2) {
          defineProperty2(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys2(Object(t)).forEach(function(r2) {
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.ConfigProvider, { locale: zhCN, theme, children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
  );

})(React, antd, ReactDOM, forge);