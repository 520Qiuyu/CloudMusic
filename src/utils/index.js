import forge from "node-forge";

// #region ================ 工具函数 ================

/**
 * 格式化文件大小
 * @param {number} size 文件大小(字节)
 * @returns {string} 格式化后的大小
 */
export const formatFileSize = (size) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  return size.toFixed(index > 0 ? 1 : 0) + units[index];
};

/**
 * 格式化时长
 * @param {number} ms 毫秒数
 * @returns {string} 格式化后的时长(mm:ss)
 */
export const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * 获取音质描述
 * @param {string} level 音质等级
 * @returns {string} 音质描述
 */
export const getQualityDesc = (level) => {
  return QUALITY_LEVELS[level] || level;
};

/**
 * 将数组分割成多个小数组
 * @param {Array} array - 被分割的数组
 * @param {number} size - 小数组的大小
 * @returns {Array} - 一个包含小数组的数组
 */
export function chunkArray(array, size) {
  if (size <= 0) {
    throw new Error("Size must be greater than 0");
  }
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * 获取歌曲的艺术家
 * @param {Object} song 歌曲信息
 * @returns {string} 艺术家名称
 */
export const getArtistTextInSongDetail = (song) => {
  return song.ar ? song.ar.map((ar) => ar.name).join() : song.pc?.ar || "";
};

/**
 * 获取歌曲的专辑
 * @param {Object} song 歌曲信息
 * @returns {string} 专辑名称
 */
export const getAlbumTextInSongDetail = (song) => {
  return song.al ? song.al.name : song.pc?.alb || "";
};



// #endregion ================ 工具函数 ================

// #region ================ 加密相关 ================

export const IV = "0102030405060708";
export const PRESET_KEY = "0CoJUm6Qyw8W8jud";
export const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
const weapi = (object) => {
  const text = JSON.stringify(object);
  const secretKey = Array.from({ length: 16 }, () => BASE62.charAt(Math.floor(Math.random() * 62))).join("");
  return {
    params: aesEncrypt(aesEncrypt(text, PRESET_KEY, IV), secretKey, IV),
    encSecKey: rsaEncrypt(secretKey.split("").reverse().join(""), PUBLIC_KEY),
  };
};

// #endregion ================ 加密相关 ================

// #region ================ 网络请求相关 ================

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
 * @param {string} url 请求URL
 * @param {Object} config 请求配置
 * @param {Object} config.data 请求数据
 * @param {string} config.clientType 客户端类型
 * @param {string} config.ip IP地址
 * @param {Function} config.onload 成功回调
 * @param {Function} config.onerror 错误回调
 */
export const weapiRequest = (url, config) => {
  // 准备请求数据
  const data = config.data || {};
  const clientType = config.clientType || "pc";

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
  if (config.ip) {
    headers["X-Real-IP"] = config.ip;
    headers["X-Forwarded-For"] = config.ip;
  }

  // 发送请求
  GM_xmlhttpRequest({
    url: url.replace("api", "weapi") + `?csrf_token=${data.csrf_token}`,
    method: "POST",
    responseType: "json",
    headers,
    cookie: CLIENT_CONFIG[clientType].cookie,
    data: `params=${encodeURIComponent(
      encryptedData.params
    )}&encSecKey=${encodeURIComponent(encryptedData.encSecKey)}`,
    onload: (res) => config.onload(res.response),
    onerror: config.onerror,
  });
};

// #endregion ================ 网络请求相关 ================

// #region ================ 歌曲信息相关 ================

/**
 * 获取歌曲艺术家信息
 * @param {Object} song 歌曲信息对象
 * @returns {string} 艺术家名称(多个用逗号分隔)
 */
export const getArtistInfo = (song) => {
  if (song.ar && song.ar[0].name && song.ar[0].name.length > 0) {
    return song.ar.map((ar) => ar.name).join(",");
  }
  if (song.pc && song.pc.ar && song.pc.ar.length > 0) {
    return song.pc.ar;
  }
  return "";
};

/**
 * 获取歌曲专辑信息
 * @param {Object} song 歌曲信息对象
 * @returns {string} 专辑名称
 */
export const getAlbumInfo = (song) => {
  if (song.al && song.al.name && song.al.name.length > 0) {
    return song.al.name;
  }
  if (song.pc && song.pc.alb && song.pc.alb.length > 0) {
    return song.pc.alb;
  }
  return "";
};

/**
 * 生成文件名(不含扩展名)
 * @param {string} title 歌曲标题
 * @param {string} artist 艺术家
 * @param {string} format 文件名格式('title'|'artist-title'|'title-artist')
 * @returns {string} 格式化后的文件名
 */
export const generateFileName = (title, artist, format = "artist-title") => {
  if (format === "title" || !artist || artist.length === 0) {
    return title;
  }
  if (format === "artist-title") {
    return `${artist} - ${title}`;
  }
  if (format === "title-artist") {
    return `${title} - ${artist}`;
  }
  return title;
};

// #endregion ================ 歌曲信息相关 ================

// #region ================ UI工具函数 ================

/**
 * HTML转义
 * @param {string} text 需要转义的文本
 * @returns {string} 转义后的文本
 */
export const escapeHTML = (text) => {
  const escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  };
  return text.replace(/[&<>'"]/g, (char) => escapeMap[char] || char);
};

/**
 * 显示确认对话框
 * @param {string} message 提示信息
 * @returns {Promise<boolean>} 用户确认结果
 */
export const showConfirm = async (message) => {
  const result = await Swal.fire({
    title: "确认",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  });
  return result.isConfirmed;
};

/**
 * 显示提示信息
 * @param {string} message 提示信息
 * @param {'success'|'error'|'info'|'warning'} type 提示类型
 */
export const showTip = (message, type = "info") => {
  Swal.fire({
    text: message,
    icon: type,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });
};

// #endregion ================ UI工具函数 ================

// #region ================ 下载功能 ================

/**
 * 批量下载歌曲
 * @param {Array} songList 歌曲列表
 * @param {Object} config 下载配置
 */
export async function batchDownloadSongs(songList, config) {
  const downloadQueue = [];

  // 准备下载队列
  for (const song of songList) {
    if (config.filter && !config.filter(song)) continue;

    downloadQueue.push({
      song,
      status: "pending",
    });
  }

  // 创建进度提示
  const progressBox = await Swal.fire({
    title: "批量下载中",
    html: `
                <div class="download-progress">
                    <div id="download-status">准备下载 ${downloadQueue.length} 首歌曲...</div>
                    <div class="progress-bar">
                        <div id="progress-inner" style="width: 0%"></div>
                    </div>
                </div>
            `,
    showConfirmButton: false,
    allowOutsideClick: false,
  });

  // 开始下载
  const threads = [];
  const threadCount = config.threadCount || 3;

  for (let i = 0; i < threadCount; i++) {
    threads.push(downloadThread(i));
  }

  // 下载线程
  async function downloadThread(threadIndex) {
    while (true) {
      // 获取待下载任务
      const task = downloadQueue.find((t) => t.status === "pending");
      if (!task) break;

      // 标记为进行中
      task.status = "downloading";

      try {
        // 获取下载链接
        const urlRes = await new Promise((resolve, reject) => {
          weapiRequest("/api/song/enhance/player/url/v1", {
            data: {
              ids: [task.song.id],
              level: config.level || "standard",
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (!urlRes.data?.[0]?.url) {
          throw new Error("获取下载链接失败");
        }

        // 开始下载
        await new Promise((resolve, reject) => {
          const fileName =
            generateFileName(
              task.song.name,
              getArtistInfo(task.song),
              config.fileNameFormat
            ) + ".mp3";

          GM_download({
            url: urlRes.data[0].url,
            name: fileName,
            onload: resolve,
            onerror: reject,
          });
        });

        task.status = "success";
      } catch (error) {
        console.error("Download failed:", error);
        task.status = "error";
      }

      // 更新进度
      updateProgress();
    }
  }

  // 更新进度显示
  function updateProgress() {
    const finished = downloadQueue.filter(
      (t) => t.status === "success" || t.status === "error"
    ).length;
    const progress = ((finished / downloadQueue.length) * 100).toFixed(1);
    const successful = downloadQueue.filter(
      (t) => t.status === "success"
    ).length;
    const failed = downloadQueue.filter((t) => t.status === "error").length;

    document.getElementById("progress-inner").style.width = `${progress}%`;
    document.getElementById(
      "download-status"
    ).textContent = `已完成: ${finished}/${downloadQueue.length} (成功: ${successful}, 失败: ${failed})`;

    if (finished === downloadQueue.length) {
      setTimeout(() => {
        Swal.close();
        showTip(
          `下载完成 成功: ${successful}, 失败: ${failed}`,
          failed > 0 ? "warning" : "success"
        );
      }, 1000);
    }
  }

  // 等待所有线程完成
  await Promise.all(threads);
}

// #endregion ================ 下载功能 ================
