(function () {
  "use strict";

 
  // #region ================ 云盘管理功能 ================

  /**
   * 云盘管理器类
   */
  class CloudManager {
    constructor() {
      this.songs = [];
      this.page = {
        current: 1,
        max: 1,
        size: 50,
      };
      this.filter = {
        text: "",
        quality: "all",
      };
    }

    /**
     * 初始化云盘管理界面
     */
    async init() {
      const result = await Swal.fire({
        title: "云盘管理",
        html: this.createManagerDialog(),
        width: "900px",
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => this.onDialogOpen(),
      });
    }

    /**
     * 创建管理界面HTML
     */
    createManagerDialog() {
      return `
                <div class="cloud-manager">
                    <div class="toolbar">
                        <div class="search-box">
                            <input type="text" placeholder="搜索云盘歌曲..." id="cloud-search">
                            <select id="quality-filter">
                                <option value="all">全部音质</option>
                                <option value="lossless">无损</option>
                                <option value="high">高品质</option>
                                <option value="standard">标准</option>
                            </select>
                        </div>
                        <div class="actions">
                            <button id="batch-match">批量匹配</button>
                            <button id="batch-delete">批量删除</button>
                            <button id="export-list">导出列表</button>
                            <button id="import-songs">导入歌曲</button>
                        </div>
                    </div>
                    <div class="song-list">
                        <table id="cloud-song-table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="select-all"></th>
                                    <th>歌曲名</th>
                                    <th>艺术家</th>
                                    <th>专辑</th>
                                    <th>音质</th>
                                    <th>��小</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="pagination">
                        <button id="prev-page">上一页</button>
                        <span id="page-info"></span>
                        <button id="next-page">下一页</button>
                    </div>
                </div>`;
    }

    /**
     * 对话框打开后的处理
     */
    async onDialogOpen() {
      this.bindEvents();
      await this.loadCloudSongs();
      this.renderSongList();
    }

    /**
     * 绑定事件处理
     */
    bindEvents() {
      // 搜索和过滤
      document.getElementById("cloud-search").addEventListener("input", (e) => {
        this.filter.text = e.target.value;
        this.renderSongList();
      });

      document
        .getElementById("quality-filter")
        .addEventListener("change", (e) => {
          this.filter.quality = e.target.value;
          this.renderSongList();
        });

      // 批量操作按钮
      document
        .getElementById("batch-match")
        .addEventListener("click", () => this.batchMatch());
      document
        .getElementById("batch-delete")
        .addEventListener("click", () => this.batchDelete());
      document
        .getElementById("export-list")
        .addEventListener("click", () => this.exportList());
      document
        .getElementById("import-songs")
        .addEventListener("click", () => this.importSongs());

      // 分页按钮
      document.getElementById("prev-page").addEventListener("click", () => {
        if (this.page.current > 1) {
          this.page.current--;
          this.renderSongList();
        }
      });

      document.getElementById("next-page").addEventListener("click", () => {
        if (this.page.current < this.page.max) {
          this.page.current++;
          this.renderSongList();
        }
      });
    }

    /**
     * 加载云盘歌曲
     */
    async loadCloudSongs() {
      try {
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/v1/cloud/get", {
            data: {
              limit: this.page.size,
              offset: (this.page.current - 1) * this.page.size,
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code === 200) {
          this.songs = response.data;
          this.page.max = Math.ceil(response.count / this.page.size);
        }
      } catch (error) {
        showTip("获取云盘歌曲失败", "error");
      }
    }

    /**
     * 渲染歌曲列表
     */
    renderSongList() {
      const tbody = document.querySelector("#cloud-song-table tbody");
      tbody.innerHTML = "";

      const filteredSongs = this.filterSongs();
      for (const song of filteredSongs) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td><input type="checkbox" data-id="${song.songId}"></td>
                    <td>${escapeHTML(song.songName)}</td>
                    <td>${escapeHTML(song.artist)}</td>
                    <td>${escapeHTML(song.album)}</td>
                    <td>${getQualityDesc(song.quality)}</td>
                    <td>${formatFileSize(song.fileSize)}</td>
                    <td>
                        <button class="match-btn" data-id="${
                          song.songId
                        }">匹配</button>
                        <button class="delete-btn" data-id="${
                          song.songId
                        }">删除</button>
                    </td>
                `;
        tbody.appendChild(tr);
      }

      // 更新分页信息
      document.getElementById(
        "page-info"
      ).textContent = `${this.page.current}/${this.page.max}页`;
    }

    /**
     * 过滤歌曲
     */
    filterSongs() {
      return this.songs.filter((song) => {
        if (
          this.filter.quality !== "all" &&
          song.quality !== this.filter.quality
        ) {
          return false;
        }

        if (this.filter.text) {
          const searchText = this.filter.text.toLowerCase();
          return (
            song.songName.toLowerCase().includes(searchText) ||
            song.artist.toLowerCase().includes(searchText) ||
            song.album.toLowerCase().includes(searchText)
          );
        }

        return true;
      });
    }

    /**
     * 批量匹配
     */
    async batchMatch() {
      const selectedIds = this.getSelectedSongIds();
      if (selectedIds.length === 0) {
        showTip("请选择要匹配的歌曲", "warning");
        return;
      }

      const result = await showConfirm(
        `确定要匹配中的 ${selectedIds.length} 首歌曲吗？`
      );
      if (!result) return;

      let success = 0;
      let failed = 0;

      for (const songId of selectedIds) {
        try {
          await this.matchSong(songId);
          success++;
        } catch (error) {
          console.error("Match failed:", error);
          failed++;
        }
      }

      showTip(
        `匹配完成 成功: ${success}, 失败: ${failed}`,
        failed > 0 ? "warning" : "success"
      );

      // 重新加载列表
      await this.loadCloudSongs();
      this.renderSongList();
    }

    /**
     * ���量删除
     */
    async batchDelete() {
      const selectedIds = this.getSelectedSongIds();
      if (selectedIds.length === 0) {
        showTip("请选择要删除的歌曲", "warning");
        return;
      }

      const result = await showConfirm(
        `确定要删除选中的 ${selectedIds.length} 首歌曲吗？此操作不可恢复！`
      );
      if (!result) return;

      try {
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/cloud/del", {
            data: { songIds: selectedIds },
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code === 200) {
          showTip("删除成功", "success");
          await this.loadCloudSongs();
          this.renderSongList();
        } else {
          throw new Error(response.message || "删除失败");
        }
      } catch (error) {
        showTip("删除失败: " + error.message, "error");
      }
    }

    /**
     * 导出歌曲列表
     */
    async exportList() {
      const exportData = this.songs.map((song) => ({
        name: song.songName,
        artist: song.artist,
        album: song.album,
        quality: song.quality,
        size: song.fileSize,
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `网易云音乐云盘导出_${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();

      URL.revokeObjectURL(url);
    }

    /**
     * 导入歌曲
     */
    async importSongs() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const content = await file.text();
          const songs = JSON.parse(content);

          // 创建上传任务
          const uploader = new Uploader({
            songs,
            mode: "import",
          });

          await uploader.start();
        } catch (error) {
          showTip("导入失败: " + error.message, "error");
        }
      };

      input.click();
    }

    /**
     * 获取选中的歌曲ID
     */
    getSelectedSongIds() {
      return Array.from(
        document.querySelectorAll(
          '#cloud-song-table input[type="checkbox"]:checked'
        )
      )
        .map((checkbox) => checkbox.dataset.id)
        .filter((id) => id);
    }

    /**
     * 匹配单首歌曲
     */
    async matchSong(songId) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/cloud/match", {
          data: { songId },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error(response.message || "匹配失败");
      }

      return response.data;
    }
  }

  // #endregion ================ 云盘管理功能 ================

  // #region ================ 播放列表处理功能 ================

  /**
   * 播放列表排序器类
   */
  class PlaylistSorter {
    constructor(playlistId) {
      this.playlistId = playlistId;
      this.songs = [];
    }

    /**
     * 显示排序对话框
     */
    async showSortDialog() {
      const result = await Swal.fire({
        title: "播放列表排序",
        html: `
                    <div class="sort-options">
                        <div class="sort-group">
                            <label><input type="radio" name="sort-type" value="time"> 按时间排序</label>
                            <label><input type="radio" name="sort-type" value="name"> 按名称排序</label>
                            <label><input type="radio" name="sort-type" value="artist"> 按艺术家排序</label>
                        </div>
                        <div class="sort-order">
                            <label><input type="radio" name="sort-order" value="asc" checked> 升序</label>
                            <label><input type="radio" name="sort-order" value="desc"> 降序</label>
                        </div>
                    </div>
                `,
        showCancelButton: true,
        confirmButtonText: "开始排序",
        cancelButtonText: "取消",
      });

      if (result.isConfirmed) {
        const sortType = document.querySelector(
          'input[name="sort-type"]:checked'
        ).value;
        const sortOrder = document.querySelector(
          'input[name="sort-order"]:checked'
        ).value;
        await this.sortPlaylist(sortType, sortOrder);
      }
    }

    /**
     * 排序播放列表
     */
    async sortPlaylist(sortType, sortOrder) {
      try {
        // 获取播放列表详情
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/v1/playlist/detail", {
            data: { id: this.playlistId },
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code !== 200) {
          throw new Error("获取播放列表失败");
        }

        this.songs = response.playlist.tracks;

        // 排序
        this.songs.sort((a, b) => {
          let compareResult = 0;
          switch (sortType) {
            case "time":
              compareResult = a.dt - b.dt;
              break;
            case "name":
              compareResult = a.name.localeCompare(b.name);
              break;
            case "artist":
              const artistA = getArtistInfo(a);
              const artistB = getArtistInfo(b);
              compareResult = artistA.localeCompare(artistB);
              break;
          }
          return sortOrder === "desc" ? -compareResult : compareResult;
        });

        // 更新播放列表顺序
        const songIds = this.songs.map((song) => song.id);
        await this.updatePlaylistOrder(songIds);

        showTip("排序完成", "success");
      } catch (error) {
        showTip("排序失败: " + error.message, "error");
      }
    }

    /**
     * 更新播放列表顺序
     */
    async updatePlaylistOrder(songIds) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/playlist/manipulate/tracks", {
          data: {
            pid: this.playlistId,
            trackIds: JSON.stringify(songIds),
            op: "update",
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error(response.message || "更新播放列表失败");
      }
    }
  }

  // #endregion ================ 播放列表处理功能 ================

  // #region ================ 评论功能增强 ================

  /**
   * 评论功能增强器类
   */
  class CommentEnhancer {
    constructor() {
      this.ipInfoMap = new Map();
    }

    /**
     * 初始化评论增强功能
     */
    init() {
      // 处理已有评论
      document.querySelectorAll(".itm").forEach((item) => {
        this.processCommentItem(item);
      });

      // 监听新评论
      const commentList = document.querySelector(".m-cmmt");
      if (commentList) {
        this.observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              if (node.classList?.contains("itm")) {
                this.processCommentItem(node);
              }
            }
          }
        });

        this.observer.observe(commentList, {
          childList: true,
          subtree: true,
        });
      }

      // 增强评论框
      this.enhanceCommentBox();
    }

    /**
     * 处理单个评论项
     */
    async processCommentItem(item) {
      const commentId = item.getAttribute("data-id");
      if (!commentId || item.querySelector(".ip-info")) return;

      try {
        const ipInfo = await this.getCommentIpInfo(commentId);
        if (!ipInfo) return;

        // 添加IP信息标签
        const infoTag = document.createElement("span");
        infoTag.className = "ip-info";
        infoTag.textContent = `[${ipInfo.location}]`;

        const timeNode = item.querySelector(".time");
        if (timeNode) {
          timeNode.parentNode.insertBefore(infoTag, timeNode.nextSibling);
        }
      } catch (error) {
        console.error("处理评论IP信息失败:", error);
      }
    }

    /**
     * 获取评论IP信息
     */
    async getCommentIpInfo(commentId) {
      if (this.ipInfoMap.has(commentId)) {
        return this.ipInfoMap.get(commentId);
      }

      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/comment/ip/info", {
          data: { commentId },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code === 200 && response.data) {
        this.ipInfoMap.set(commentId, response.data);
        return response.data;
      }
      return null;
    }

    /**
     * 增强评论框功能
     */
    enhanceCommentBox() {
      const commentBox = document.querySelector(".m-cmmt");
      if (!commentBox) return;

      // 添加IP选择器
      const ipSelector = document.createElement("div");
      ipSelector.className = "ip-selector";
      ipSelector.innerHTML = `
                <select id="ip-region">
                    <option value="">选择发送IP区域</option>
                    <option value="北京">北京</option>
                    <option value="上海">上海</option>
                    <option value="广州">广州</option>
                    <option value="深圳">深圳</option>
                </select>
            `;

      const textArea = commentBox.querySelector("textarea");
      if (textArea) {
        textArea.parentNode.insertBefore(ipSelector, textArea.nextSibling);
      }

      // 修改评论发送逻辑
      this.hookCommentSubmit();
    }

    /**
     * Hook评论提交功能
     */
    hookCommentSubmit() {
      const originalSend = window.send;
      window.send = async (...args) => {
        const ipRegion = document.querySelector("#ip-region")?.value;
        if (ipRegion) {
          // 根据选择的地区设置IP
          const ip = await this.getRandomIp(ipRegion);
          args[0].ip = ip;
        }
        return originalSend.apply(window, args);
      };
    }

    /**
     * 获取指定地区的随机IP
     */
    async getRandomIp(region) {
      // 这里简化处理,实际应该有一个IP地址库
      const ipMap = {
        北京: "1.1.1.1",
        上海: "2.2.2.2",
        广州: "3.3.3.3",
        深圳: "4.4.4.4",
      };
      return ipMap[region] || "";
    }

    /**
     * 添加自定义IP评论功能
     */
    addCustomIPComment() {
      const commentBox = document.querySelector(".m-cmmt");
      if (!commentBox) return;

      const ipSelector = document.createElement("select");
      ipSelector.className = "ip-selector";
      ipSelector.innerHTML = `
                <option value="">默认IP</option>
                <option value="北京">北京</option>
                <option value="上海">上海</option>
                <option value="广州">广州</option>
                <option value="深圳">深圳</option>
            `;

      // 插入到评论框前
      const textArea = commentBox.querySelector(".u-txt");
      if (textArea) {
        textArea.parentNode.insertBefore(ipSelector, textArea);
      }

      // Hook评论发送
      const originalSend = window.comment.send;
      window.comment.send = function (...args) {
        const selectedIP = ipSelector.value;
        if (selectedIP) {
          args[0].data.ip = selectedIP;
        }
        return originalSend.apply(this, args);
      };
    }
  }

  // #endregion ================ 评论功能增强 ================

  // #region ================ 歌词处理功能 ================

  /**
   * 歌词处理器类
   */
  class LyricProcessor {
    constructor() {
      // 歌词时间戳正则
      this.timestampRegex = /\[(?<min>\d+):(?<sec>\d+)(?:\.|:)*(?<ms>\d+)*\]/g;
      this.lyricLineRegex =
        /^(?<timestamps>(?:\[.+?\])+)(?!\[)(?<content>.+)$/gm;
    }

    /**
     * 解析歌词文本
     * @param {string} lrc 歌词文本
     * @returns {Array} 解析后的歌词数组
     */
    parse(lrc) {
      const lyrics = [];
      let match;

      while ((match = this.lyricLineRegex.exec(lrc)) !== null) {
        const { timestamps, content } = match.groups;
        const times = this.parseTimestamps(timestamps);

        for (const time of times) {
          lyrics.push({
            time,
            text: this.trimLyricContent(content),
          });
        }
      }

      // 按时间排序
      return lyrics.sort((a, b) => a.time - b.time);
    }

    /**
     * 解析时间戳
     * @param {string} timestamps 时间戳字符串
     * @returns {Array} 时间戳数组(毫秒)
     */
    parseTimestamps(timestamps) {
      const times = [];
      let match;

      while ((match = this.timestampRegex.exec(timestamps)) !== null) {
        const { min, sec, ms } = match.groups;
        const totalMs =
          parseInt(min) * 60000 +
          parseInt(sec) * 1000 +
          (ms ? parseInt(ms.padEnd(3, "0")) : 0);
        times.push(totalMs);
      }

      return times;
    }

    /**
     * 清理歌词内容
     * @param {string} content 歌词内容
     * @returns {string} 清理后的内容
     */
    trimLyricContent(content) {
      return content
        .trim()
        .replace(/\s+/g, " ") // 合并空白字符
        .replace(/\/\/|\\\\/g, ""); // 移除特殊字符
    }

    /**
     * 合并多个歌词
     * @param {string} mainLyric 主歌词
     * @param {string} subLyric 副歌词
     * @returns {string} 合并后的歌词
     */
    combine(mainLyric, subLyric) {
      const mainLines = this.parse(mainLyric);
      const subLines = this.parse(subLyric);

      // 使用二分查找匹配最近的歌词
      const combined = mainLines.map((main) => {
        const nearest = this.findNearestLyric(main.time, subLines);
        if (nearest && Math.abs(nearest.time - main.time) < 1000) {
          // 1秒内视为同步
          return {
            time: main.time,
            text: `${main.text} // ${nearest.text}`,
          };
        }
        return main;
      });

      // 转回LRC格式
      return this.convertToLRC(combined);
    }

    /**
     * 二分查找最近的歌词
     */
    findNearestLyric(time, lyrics) {
      let left = 0;
      let right = lyrics.length - 1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midTime = lyrics[mid].time;

        if (midTime === time) {
          return lyrics[mid];
        }

        if (midTime < time) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      // 找到最近的一个
      const leftLyric = lyrics[left];
      const rightLyric = lyrics[right];

      if (!leftLyric) return rightLyric;
      if (!rightLyric) return leftLyric;

      return Math.abs(time - leftLyric.time) < Math.abs(time - rightLyric.time)
        ? leftLyric
        : rightLyric;
    }

    /**
     * 转换为LRC格式
     */
    convertToLRC(lyrics) {
      return lyrics
        .map((lyric) => {
          const time = lyric.time;
          const min = Math.floor(time / 60000);
          const sec = Math.floor((time % 60000) / 1000);
          const ms = time % 1000;

          const timestamp = `[${min.toString().padStart(2, "0")}:${sec
            .toString()
            .padStart(2, "0")}.${ms.toString().padStart(3, "0")}]`;
          return `${timestamp}${lyric.text}`;
        })
        .join("\n");
    }

    /**
     * 下载歌词
     * @param {number} songId 歌曲ID
     * @param {string} fileName 文件名
     */
    async download(songId, fileName) {
      try {
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/song/lyric", {
            data: {
              id: songId,
              cp: false,
              tv: 0,
              lv: 0,
              rv: 0,
              kv: 0,
              yv: 0,
              ytv: 0,
              yrv: 0,
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code !== 200) {
          throw new Error("获取歌词失败");
        }

        let lyric = "";

        // 合并原版歌词和翻译
        if (response.lrc?.lyric) {
          lyric = response.lrc.lyric;
          if (response.tlyric?.lyric) {
            lyric = this.combine(lyric, response.tlyric.lyric);
          }
        }

        // 下载歌词文件
        const blob = new Blob([lyric], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.lrc`;
        a.click();

        URL.revokeObjectURL(url);
      } catch (error) {
        showTip("下载歌词失败: " + error.message, "error");
      }
    }
  }

  // #endregion ================ 歌词处理功能 ================

  // #region ================ 设置面板功能 ================

  /**
   * 设置管理器类
   */
  class SettingsManager {
    constructor() {
      // 默认设置
      this.defaultSettings = {
        // 下载设置
        download: {
          quality: "lossless",
          format: "artist-title",
          folder: "downloads",
          threads: 3,
        },
        // 上传设置
        upload: {
          autoMatch: true,
          skipExists: true,
          threads: 2,
        },
        // 云盘设置
        cloud: {
          autoClean: false,
          cleanSize: 1024, // MB
          backupList: true,
        },
        // 界面设置
        ui: {
          theme: "auto",
          fontSize: 14,
          showIpLocation: true,
          showQuality: true,
        },
        // 功能开关
        features: {
          enhanceComment: true,
          enhanceLyric: true,
          enhancePlaylist: true,
        },
      };

      // 当前设置
      this.settings = this.loadSettings();
    }

    /**
     * 加载设置
     */
    loadSettings() {
      const saved = GM_getValue("settings");
      return saved
        ? { ...this.defaultSettings, ...JSON.parse(saved) }
        : { ...this.defaultSettings };
    }

    /**
     * 保存设置
     */
    saveSettings() {
      GM_setValue("settings", JSON.stringify(this.settings));
    }

    /**
     * 显示设置面板
     */
    async showPanel() {
      const result = await Swal.fire({
        title: "脚本设置",
        html: this.createSettingsPanel(),
        width: "800px",
        showCancelButton: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消",
        didOpen: () => this.initPanelValues(),
      });

      if (result.isConfirmed) {
        this.saveSettingsFromPanel();
        showTip("设置已保存", "success");
        location.reload(); // 重载页面以应用新设置
      }
    }

    /**
     * 创建设置面板HTML
     */
    createSettingsPanel() {
      return `
                <div class="settings-panel">
                    <div class="settings-tabs">
                        <button class="tab-btn active" data-tab="download">下载设置</button>
                        <button class="tab-btn" data-tab="upload">上传设置</button>
                        <button class="tab-btn" data-tab="cloud">云盘设置</button>
                        <button class="tab-btn" data-tab="ui">界面设置</button>
                        <button class="tab-btn" data-tab="features">功能开关</button>
                    </div>
                    <div class="settings-content">
                        <div class="tab-content active" id="download-settings">
                            <div class="setting-item">
                                <label>默认音质</label>
                                <select id="setting-quality">
                                    ${Object.entries(QUALITY_LEVELS)
                                      .map(
                                        ([key, name]) =>
                                          `<option value="${key}">${name}</option>`
                                      )
                                      .join("")}
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>文件名格式</label>
                                <select id="setting-filename">
                                    <option value="artist-title">艺术家 - 标题</option>
                                    <option value="title-artist">标题 - 艺术家</option>
                                    <option value="title">仅标题</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>下载线程数</label>
                                <input type="number" id="setting-threads" min="1" max="5">
                            </div>
                        </div>
                        <div class="tab-content" id="upload-settings">
                            <div class="setting-item">
                                <label>自动匹配</label>
                                <input type="checkbox" id="setting-automatch">
                            </div>
                            <div class="setting-item">
                                <label>跳过已��在</label>
                                <input type="checkbox" id="setting-skipexists">
                            </div>
                            <div class="setting-item">
                                <label>上传线程数</label>
                                <input type="number" id="setting-upload-threads" min="1" max="3">
                            </div>
                        </div>
                        <div class="tab-content" id="cloud-settings">
                            <div class="setting-item">
                                <label>自动清理</label>
                                <input type="checkbox" id="setting-autoclean">
                            </div>
                            <div class="setting-item">
                                <label>清理阈值(MB)</label>
                                <input type="number" id="setting-cleansize" min="100">
                            </div>
                            <div class="setting-item">
                                <label>备份列表</label>
                                <input type="checkbox" id="setting-backup">
                            </div>
                        </div>
                        <div class="tab-content" id="ui-settings">
                            <div class="setting-item">
                                <label>主题</label>
                                <select id="setting-theme">
                                    <option value="auto">自动</option>
                                    <option value="light">浅色</option>
                                    <option value="dark">深色</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>字体大小</label>
                                <input type="number" id="setting-fontsize" min="12" max="20">
                            </div>
                            <div class="setting-item">
                                <label>显示IP归属</label>
                                <input type="checkbox" id="setting-showip">
                            </div>
                        </div>
                        <div class="tab-content" id="features-settings">
                            <div class="setting-item">
                                <label>评论增强</label>
                                <input type="checkbox" id="setting-enhance-comment">
                            </div>
                            <div class="setting-item">
                                <label>歌词增强</label>
                                <input type="checkbox" id="setting-enhance-lyric">
                            </div>
                            <div class="setting-item">
                                <label>播放列表增强</label>
                                <input type="checkbox" id="setting-enhance-playlist">
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * 初始化面板值
     */
    initPanelValues() {
      // 绑定标签切换
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          document
            .querySelectorAll(".tab-btn")
            .forEach((b) => b.classList.remove("active"));
          document
            .querySelectorAll(".tab-content")
            .forEach((c) => c.classList.remove("active"));

          e.target.classList.add("active");
          document
            .getElementById(`${e.target.dataset.tab}-settings`)
            .classList.add("active");
        });
      });

      // 设置当前值
      const s = this.settings;

      // 下载设置
      document.getElementById("setting-quality").value = s.download.quality;
      document.getElementById("setting-filename").value = s.download.format;
      document.getElementById("setting-threads").value = s.download.threads;

      // 上传设置
      document.getElementById("setting-automatch").checked = s.upload.autoMatch;
      document.getElementById("setting-skipexists").checked =
        s.upload.skipExists;
      document.getElementById("setting-upload-threads").value =
        s.upload.threads;

      // 云盘设置
      document.getElementById("setting-autoclean").checked = s.cloud.autoClean;
      document.getElementById("setting-cleansize").value = s.cloud.cleanSize;
      document.getElementById("setting-backup").checked = s.cloud.backupList;

      // 界面设置
      document.getElementById("setting-theme").value = s.ui.theme;
      document.getElementById("setting-fontsize").value = s.ui.fontSize;
      document.getElementById("setting-showip").checked = s.ui.showIpLocation;

      // 功能开关
      document.getElementById("setting-enhance-comment").checked =
        s.features.enhanceComment;
      document.getElementById("setting-enhance-lyric").checked =
        s.features.enhanceLyric;
      document.getElementById("setting-enhance-playlist").checked =
        s.features.enhancePlaylist;
    }

    /**
     * 从面板保存设置
     */
    saveSettingsFromPanel() {
      // 下载设置
      this.settings.download.quality =
        document.getElementById("setting-quality").value;
      this.settings.download.format =
        document.getElementById("setting-filename").value;
      this.settings.download.threads = parseInt(
        document.getElementById("setting-threads").value
      );

      // 上传设置
      this.settings.upload.autoMatch =
        document.getElementById("setting-automatch").checked;
      this.settings.upload.skipExists =
        document.getElementById("setting-skipexists").checked;
      this.settings.upload.threads = parseInt(
        document.getElementById("setting-upload-threads").value
      );

      // 云盘设置
      this.settings.cloud.autoClean =
        document.getElementById("setting-autoclean").checked;
      this.settings.cloud.cleanSize = parseInt(
        document.getElementById("setting-cleansize").value
      );
      this.settings.cloud.backupList =
        document.getElementById("setting-backup").checked;

      // 界面设置
      this.settings.ui.theme = document.getElementById("setting-theme").value;
      this.settings.ui.fontSize = parseInt(
        document.getElementById("setting-fontsize").value
      );
      this.settings.ui.showIpLocation =
        document.getElementById("setting-showip").checked;

      // 功能开关
      this.settings.features.enhanceComment = document.getElementById(
        "setting-enhance-comment"
      ).checked;
      this.settings.features.enhanceLyric = document.getElementById(
        "setting-enhance-lyric"
      ).checked;
      this.settings.features.enhancePlaylist = document.getElementById(
        "setting-enhance-playlist"
      ).checked;

      this.saveSettings();
    }
  }

  // #endregion ================ 设置面板功能 ================

  // #region ================ 主程序类 ================

  /**
   * 主程序类
   * 统一管理所有功能模块
   */
  class MainProgram {
    constructor() {
      console.log("MainProgram start ====================================");
      // 初始化各功能模块
      this.settings = new SettingsManager();
      this.uploader = null;
      this.cloudManager = new CloudManager();
      this.commentEnhancer = new CommentEnhancer();
      this.lyricProcessor = new LyricProcessor();

      // 注册菜单项
      this.registerMenuItems();

      // 初始化功能
      this.initFeatures();
    }

    /**
     * 注册菜单项
     */
    registerMenuItems() {
      // 添加菜单到页面顶部
      const menuContainer = document.createElement("div");
      menuContainer.className = "custom-menu";
      menuContainer.innerHTML = `
                <div class="menu-item" id="uploadBtn">上传管理</div>
                <div class="menu-item" id="cloudBtn">云盘管理</div>
                <div class="menu-item" id="settingsBtn">设置</div>
            `;

      // 插入到导航栏
      const nav = document.querySelector(".m-top");
      if (nav) {
        nav.appendChild(menuContainer);
      }

      // 绑定事件
      document.getElementById("uploadBtn").onclick = () => this.showUploader();
      document.getElementById("cloudBtn").onclick = () =>
        this.cloudManager.init();
      document.getElementById("settingsBtn").onclick = () =>
        this.settings.showPanel();
    }

    /**
     * 初始化功能
     */
    initFeatures() {
      const features = this.settings.settings.features;

      // 评论增强
      if (features.enhanceComment) {
        this.commentEnhancer.init();
      }

      // 歌词增强
      if (features.enhanceLyric) {
        // 监听播放器变化
        this.observePlayer();
      }

      // 播放列表增强
      if (features.enhancePlaylist) {
        this.enhancePlaylist();
      }
    }

    /**
     * 显示上传管理器
     */
    showUploader() {
      if (!this.uploader) {
        const config = this.settings.settings.upload;
        this.uploader = new Uploader(config);
      }
      this.uploader.start();
    }

    /**
     * 监听播放器变化
     */
    observePlayer() {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            const player = document.querySelector(".m-player");
            if (player) {
              this.enhancePlayer(player);
            }
          }
        }
      });

      // 开始监听
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    /**
     * 增强播放器功能
     * @param {Element} player 播放器元素
     */
    enhancePlayer(player) {
      // 添加下载按钮
      const downloadBtn = document.createElement("div");
      downloadBtn.className = "download-btn";
      downloadBtn.innerHTML = '<i class="u-icn u-icn-81"></i>';
      downloadBtn.title = "下载当前歌曲";
      downloadBtn.onclick = () => this.downloadCurrentSong();

      const operation = player.querySelector(".oper");
      if (operation) {
        operation.appendChild(downloadBtn);
      }
    }

    /**
     * 下载当前播放的歌曲
     */
    async downloadCurrentSong() {
      const player = document.querySelector(".m-player");
      if (!player) return;

      const songInfo = {
        id: player.getAttribute("data-track-id"),
        name: player.querySelector(".name").textContent,
        artist: player.querySelector(".by").textContent,
      };

      if (songInfo.id) {
        const config = this.settings.settings.download;
        await batchDownloadSongs([songInfo], config);
      }
    }

    /**
     * 增强播放列表功能
     */
    enhancePlaylist() {
      // 监听播放列表页面
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            const playlist = document.querySelector(".m-playlist");
            if (playlist) {
              this.addPlaylistFeatures(playlist);
            }
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    /**
     * 添加播放列表功能
     * @param {Element} playlist 播放列表元素
     */
    addPlaylistFeatures(playlist) {
      const id = new URL(location.href).pathname.split("/").pop();
      if (!id) return;

      // 添加排序按钮
      const sortBtn = document.createElement("div");
      sortBtn.className = "u-btn2 u-btn2-1";
      sortBtn.innerHTML = "<i>排序</i>";
      sortBtn.onclick = () => {
        const sorter = new PlaylistSorter(id);
        sorter.showSortDialog();
      };

      const operations = playlist.querySelector(".n-songtb");
      if (operations) {
        operations.appendChild(sortBtn);
      }
    }
  }

  // #endregion ================ 主程序类 ================

  // #region ================ 初始化 ================

  // 等待DOM加载完成
  window.addEventListener("DOMContentLoaded", () => {
    // 创建主程序实例
    window.cloudMusicEnhancer = new MainProgram();
  });

  // #endregion ================ 初始化 ================

  // #region ================ 批量处理功能 ================

  /**
   * 批量下载上传类
   */
  class ncmDownUploadBatch {
    constructor(songs, config) {
      this.hasError = false;
      this.songs = songs;
      this.songIdIndexsMap = {};
      this.playerApiSongIds = [];
      this.downloadApiSongIds = [];

      // 分类歌曲ID
      for (let i = 0; i < songs.length; i++) {
        const songId = songs[i].id;
        this.songIdIndexsMap[songId] = i;
        if (songs[i].api.url === "/api/song/enhance/player/url/v1") {
          this.playerApiSongIds.push(songId);
        } else {
          this.downloadApiSongIds.push(songId);
        }
      }

      this.successSongsId = [];
      this.skipSongs = [];
      this.failSongs = [];
      this.config = config;
      this.log = "";
    }

    // 开始上传
    async startUpload() {
      // 获取文件详情
      await this.fetchFileDetail();

      // 获取云盘ID
      await this.fetchCloudId();

      // 导入歌曲
      await this.importSongs();

      // 完成处理
      this.final();
    }

    // 获取文件详情
    async fetchFileDetail() {
      // 使用播放器API获取
      await this.fetchFileDetailByPlayerApi(0);

      // 使用下载API获取
      await this.fetchFileDetailByDownloadApi();
    }

    // 获取云盘ID
    async fetchCloudId() {
      for (
        let offset = 0;
        offset < this.songs.length;
        offset += CHECK_API_LIMIT
      ) {
        await this.fetchCloudIdSub(offset);
      }
    }

    // 导入歌曲
    async importSongs() {
      for (
        let offset = 0;
        offset < this.songs.length;
        offset += IMPORT_API_LIMIT
      ) {
        await this.importSongsSub(offset);
      }
    }

    // 完成处理
    final() {
      // 更新云盘状态
      this.updateSongCloudStatus();

      // 显示结果
      let resultMsg = `处理完成:\n成功: ${this.successSongsId.length}首\n`;
      if (this.skipSongs.length > 0) {
        resultMsg += `跳过: ${this.skipSongs.length}首\n`;
      }
      if (this.failSongs.length > 0) {
        resultMsg += `失败: ${this.failSongs.length}首\n`;
      }
      showTips(resultMsg, this.hasError ? "error" : "success");
    }
  }

  // #endregion ================ 批量处理功能 ================

  // #region ================ 专辑详情功能 ================

  /**
   * 专辑详情类
   */
  class AlbumDetail {
    constructor() {
      this.domReady = false;
      this.dataFetched = false;
      this.flag = true;
      this.albumSongList = [];
      this.albumRes = null;
      this.albumDiscList = [];

      const params = new URLSearchParams(location.search);
      this.albumId = Number(params.get("id"));
    }

    // 获取专辑数据
    async fetchAlbumData() {
      const res = await weapiRequest("/api/v1/album/" + this.albumId);
      if (res.code === 200) {
        this.albumRes = res;
        this.albumSongList = res.songs;
        this.createDiscList();
        this.dataFetched = true;
        this.checkStartCreateDom();
      }
    }

    // 创建碟片列表
    createDiscList() {
      const discs = {};
      for (const song of this.albumSongList) {
        const disc = song.disc || 1;
        if (!discs[disc]) {
          discs[disc] = [];
        }
        discs[disc].push(song);
      }

      this.albumDiscList = Object.entries(discs)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([disc, songs]) => ({
          disc: Number(disc),
          songs,
        }));
    }

    // DOM准备完成
    onDomReady() {
      this.domReady = true;
      this.checkStartCreateDom();
    }

    // 检查开始创建DOM
    checkStartCreateDom() {
      if (this.domReady && this.dataFetched && this.flag) {
        this.flag = false;
        this.createDoms();
      }
    }

    // 创建DOM元素
    createDoms() {
      // 添加信息
      this.appendInfos();

      // 添加按钮
      this.appendBtns();

      // 创建碟片表格
      this.createDiscTable();
    }
  }

  // #endregion ================ 专辑详情功能 ================

  // #region ================ 播放列表详情功能 ================

  /**
   * 播放列表详情类
   */
  class PlaylistDetail {
    constructor() {
      this.domReady = false;
      this.dataFetched = false;
      this.flag = true;

      const params = new URLSearchParams(location.search);
      this.playlistId = Number(params.get("id"));
      this.playlist = null;
      this.playlistSongList = [];
      this.playableSongList = [];
      this.rowHTMLList = [];
    }

    // 获取完整播放列表数据
    async fetchPlaylistFullData() {
      const res = await weapiRequest("/api/v6/playlist/detail", {
        data: { id: this.playlistId },
      });

      if (res.code === 200) {
        this.playlist = res.playlist;
        await this.getPlaylistAllSongs(res.playlist.trackIds);
        this.dataFetched = true;
        this.checkStartCreateDom();
      }
    }

    // 获取播放列表所有歌曲
    async getPlaylistAllSongs(trackIds) {
      for (let i = 0; i < trackIds.length; i += 1000) {
        const ids = trackIds.slice(i, i + 1000).map((t) => t.id);
        await this.getPlaylistAllSongsSub(ids, i);
      }
    }

    // DOM准备完成
    onDomReady() {
      this.domReady = true;
      this.checkStartCreateDom();
    }

    // 检查开始创建DOM
    checkStartCreateDom() {
      if (this.domReady && this.dataFetched && this.flag) {
        this.flag = false;
        this.createDoms();
      }
    }

    // 创建DOM元素
    createDoms() {
      // 渲染播放全部按钮
      this.renderPlayAllBtn();

      // 添加功能按钮
      this.appendBtns();

      // 填充歌曲表格
      this.fillTableSong();
    }

    // 渲染播放全部按钮
    renderPlayAllBtn() {
      const playAllBtn = document.querySelector(".m-info .btns .btn-play");
      if (!playAllBtn) return;

      // 修改播放按钮点击事件
      playAllBtn.onclick = () => {
        // 过滤可播放歌曲
        this.playableSongList = this.playlistSongList.filter(
          (song) => !song.noCopyrightRcmd
        );

        // 播放第一首歌
        if (this.playableSongList.length > 0) {
          weapiRequest("/api/song/enhance/player/url/v1", {
            data: {
              ids: [this.playableSongList[0].id],
              level: this.settings.download.quality,
            },
            onload: (res) => {
              if (res.code === 200 && res.data[0]) {
                // 播放歌曲
                this.playSong(res.data[0]);
              }
            },
          });
        }
      };
    }

    // 添加功能按钮
    appendBtns() {
      const btnsArea = document.querySelector(".m-info .btns");
      if (!btnsArea) return;

      // 添加下载按钮
      const downloadBtn = document.createElement("a");
      downloadBtn.className = "u-btn2 u-btn2-2";
      downloadBtn.innerHTML = "<i>下载</i>";
      downloadBtn.onclick = () => this.downloadPlaylist();
      btnsArea.appendChild(downloadBtn);

      // 添加上传按钮
      const uploadBtn = document.createElement("a");
      uploadBtn.className = "u-btn2 u-btn2-2";
      uploadBtn.innerHTML = "<i>上传</i>";
      uploadBtn.onclick = () => this.uploadPlaylist();
      btnsArea.appendChild(uploadBtn);

      // 添加排序按钮
      const sortBtn = document.createElement("a");
      sortBtn.className = "u-btn2 u-btn2-2";
      sortBtn.innerHTML = "<i>排序</i>";
      sortBtn.onclick = () => this.showSortDialog();
      btnsArea.appendChild(sortBtn);
    }
  }

  // #endregion ================ 播放列表详情功能 ================

  // #region ================ 评论功能增强 ================

  /**
   * 评论功能增强器类
   */
  class CommentEnhancer {
    constructor() {
      this.ipInfoMap = new Map();
    }

    /**
     * 初始化评论增强功能
     */
    init() {
      // 处理已有评论
      document.querySelectorAll(".itm").forEach((item) => {
        this.processCommentItem(item);
      });

      // 监听新评论
      const commentList = document.querySelector(".m-cmmt");
      if (commentList) {
        this.observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              if (node.classList?.contains("itm")) {
                this.processCommentItem(node);
              }
            }
          }
        });

        this.observer.observe(commentList, {
          childList: true,
          subtree: true,
        });
      }

      // 增强评论框
      this.enhanceCommentBox();
    }

    /**
     * 处理单个评论项
     */
    async processCommentItem(item) {
      const commentId = item.getAttribute("data-id");
      if (!commentId || item.querySelector(".ip-info")) return;

      try {
        const ipInfo = await this.getCommentIpInfo(commentId);
        if (!ipInfo) return;

        // 添加IP信息标签
        const infoTag = document.createElement("span");
        infoTag.className = "ip-info";
        infoTag.textContent = `[${ipInfo.location}]`;

        const timeNode = item.querySelector(".time");
        if (timeNode) {
          timeNode.parentNode.insertBefore(infoTag, timeNode.nextSibling);
        }
      } catch (error) {
        console.error("处理评论IP信息失败:", error);
      }
    }

    /**
     * 获取评论IP信息
     */
    async getCommentIpInfo(commentId) {
      if (this.ipInfoMap.has(commentId)) {
        return this.ipInfoMap.get(commentId);
      }

      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/comment/ip/info", {
          data: { commentId },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code === 200 && response.data) {
        this.ipInfoMap.set(commentId, response.data);
        return response.data;
      }
      return null;
    }

    /**
     * 增强评论框功能
     */
    enhanceCommentBox() {
      const commentBox = document.querySelector(".m-cmmt");
      if (!commentBox) return;

      // 添加IP选择器
      const ipSelector = document.createElement("div");
      ipSelector.className = "ip-selector";
      ipSelector.innerHTML = `
            <select id="ip-region">
                <option value="">选择发送IP区域</option>
                <option value="北京">北京</option>
                <option value="上海">上海</option>
                <option value="广州">广州</option>
                <option value="深圳">深圳</option>
            </select>
        `;

      const textArea = commentBox.querySelector("textarea");
      if (textArea) {
        textArea.parentNode.insertBefore(ipSelector, textArea.nextSibling);
      }

      // 修改评论发送逻辑
      this.hookCommentSubmit();
    }

    /**
     * Hook评论提交功能
     */
    hookCommentSubmit() {
      const originalSend = window.send;
      window.send = async (...args) => {
        const ipRegion = document.querySelector("#ip-region")?.value;
        if (ipRegion) {
          // 根据选择的地区设置IP
          const ip = await this.getRandomIp(ipRegion);
          args[0].ip = ip;
        }
        return originalSend.apply(window, args);
      };
    }

    /**
     * 获取指定地区的随机IP
     */
    async getRandomIp(region) {
      // 这里简化处理,实际应该有一个IP地址库
      const ipMap = {
        北京: "1.1.1.1",
        上海: "2.2.2.2",
        广州: "3.3.3.3",
        深圳: "4.4.4.4",
      };
      return ipMap[region] || "";
    }

    /**
     * 添加自定义IP评论功能
     */
    addCustomIPComment() {
      const commentBox = document.querySelector(".m-cmmt");
      if (!commentBox) return;

      const ipSelector = document.createElement("select");
      ipSelector.className = "ip-selector";
      ipSelector.innerHTML = `
            <option value="">默认IP</option>
            <option value="北京">北京</option>
            <option value="上海">上海</option>
            <option value="广州">广州</option>
            <option value="深圳">深圳</option>
        `;

      // 插入到评论框前
      const textArea = commentBox.querySelector(".u-txt");
      if (textArea) {
        textArea.parentNode.insertBefore(ipSelector, textArea);
      }

      // Hook评论发送
      const originalSend = window.comment.send;
      window.comment.send = function (...args) {
        const selectedIP = ipSelector.value;
        if (selectedIP) {
          args[0].data.ip = selectedIP;
        }
        return originalSend.apply(this, args);
      };
    }
  }

  // #endregion ================ 评论功能增强 ================

  // #region ================ 歌词处理功能 ================

  /**
   * 歌词处理器类
   */
  class LyricProcessor {
    constructor() {
      // 歌词时间戳正则
      this.timestampRegex = /\[(?<min>\d+):(?<sec>\d+)(?:\.|:)*(?<ms>\d+)*\]/g;
      this.lyricLineRegex =
        /^(?<timestamps>(?:\[.+?\])+)(?!\[)(?<content>.+)$/gm;
    }

    /**
     * 解析歌词文本
     * @param {string} lrc 歌词文本
     * @returns {Array} 解析后的歌词数组
     */
    parse(lrc) {
      const lyrics = [];
      let match;

      while ((match = this.lyricLineRegex.exec(lrc)) !== null) {
        const { timestamps, content } = match.groups;
        const times = this.parseTimestamps(timestamps);

        for (const time of times) {
          lyrics.push({
            time,
            text: this.trimLyricContent(content),
          });
        }
      }

      // 按时间排序
      return lyrics.sort((a, b) => a.time - b.time);
    }

    /**
     * 解析时间戳
     * @param {string} timestamps 时间戳字符串
     * @returns {Array} 时间戳数组(毫秒)
     */
    parseTimestamps(timestamps) {
      const times = [];
      let match;

      while ((match = this.timestampRegex.exec(timestamps)) !== null) {
        const { min, sec, ms } = match.groups;
        const totalMs =
          parseInt(min) * 60000 +
          parseInt(sec) * 1000 +
          (ms ? parseInt(ms.padEnd(3, "0")) : 0);
        times.push(totalMs);
      }

      return times;
    }

    /**
     * 清理歌词内容
     * @param {string} content 歌词内容
     * @returns {string} 清理后的内容
     */
    trimLyricContent(content) {
      return content
        .trim()
        .replace(/\s+/g, " ") // 合并空白字符
        .replace(/\/\/|\\\\/g, ""); // 移除特殊字符
    }

    /**
     * 合并多个歌词
     * @param {string} mainLyric 主歌词
     * @param {string} subLyric 副歌词
     * @returns {string} 合并后的歌词
     */
    combine(mainLyric, subLyric) {
      const mainLines = this.parse(mainLyric);
      const subLines = this.parse(subLyric);

      // 使用二分查找匹配最近的歌词
      const combined = mainLines.map((main) => {
        const nearest = this.findNearestLyric(main.time, subLines);
        if (nearest && Math.abs(nearest.time - main.time) < 1000) {
          // 1秒内视为同步
          return {
            time: main.time,
            text: `${main.text} // ${nearest.text}`,
          };
        }
        return main;
      });

      // 转回LRC格式
      return this.convertToLRC(combined);
    }

    /**
     * 二分查找最近的歌词
     */
    findNearestLyric(time, lyrics) {
      let left = 0;
      let right = lyrics.length - 1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midTime = lyrics[mid].time;

        if (midTime === time) {
          return lyrics[mid];
        }

        if (midTime < time) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      // 找到最近的一个
      const leftLyric = lyrics[left];
      const rightLyric = lyrics[right];

      if (!leftLyric) return rightLyric;
      if (!rightLyric) return leftLyric;

      return Math.abs(time - leftLyric.time) < Math.abs(time - rightLyric.time)
        ? leftLyric
        : rightLyric;
    }

    /**
     * 转换为LRC格式
     */
    convertToLRC(lyrics) {
      return lyrics
        .map((lyric) => {
          const time = lyric.time;
          const min = Math.floor(time / 60000);
          const sec = Math.floor((time % 60000) / 1000);
          const ms = time % 1000;

          const timestamp = `[${min.toString().padStart(2, "0")}:${sec
            .toString()
            .padStart(2, "0")}.${ms.toString().padStart(3, "0")}]`;
          return `${timestamp}${lyric.text}`;
        })
        .join("\n");
    }

    /**
     * 下载歌词
     * @param {number} songId 歌曲ID
     * @param {string} fileName 文件名
     */
    async download(songId, fileName) {
      try {
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/song/lyric", {
            data: {
              id: songId,
              cp: false,
              tv: 0,
              lv: 0,
              rv: 0,
              kv: 0,
              yv: 0,
              ytv: 0,
              yrv: 0,
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code !== 200) {
          throw new Error("获取歌词失败");
        }

        let lyric = "";

        // 合并原版歌词和翻译
        if (response.lrc?.lyric) {
          lyric = response.lrc.lyric;
          if (response.tlyric?.lyric) {
            lyric = this.combine(lyric, response.tlyric.lyric);
          }
        }

        // 下载歌词文件
        const blob = new Blob([lyric], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.lrc`;
        a.click();

        URL.revokeObjectURL(url);
      } catch (error) {
        showTip("下载歌词失败: " + error.message, "error");
      }
    }
  }

  // #endregion ================ 歌词处理功能 ================

  // #region ================ 设置面板功能 ================

  /**
   * 设置管理器类
   */
  class SettingsManager {
    constructor() {
      // 默认设置
      this.defaultSettings = {
        // 下载设置
        download: {
          quality: "lossless",
          format: "artist-title",
          folder: "downloads",
          threads: 3,
        },
        // 上传设置
        upload: {
          autoMatch: true,
          skipExists: true,
          threads: 2,
        },
        // 云盘设置
        cloud: {
          autoClean: false,
          cleanSize: 1024, // MB
          backupList: true,
        },
        // 界面设置
        ui: {
          theme: "auto",
          fontSize: 14,
          showIpLocation: true,
          showQuality: true,
        },
        // 功能开关
        features: {
          enhanceComment: true,
          enhanceLyric: true,
          enhancePlaylist: true,
        },
      };

      // 当前设置
      this.settings = this.loadSettings();
    }

    /**
     * 加载设置
     */
    loadSettings() {
      const saved = GM_getValue("settings");
      return saved
        ? { ...this.defaultSettings, ...JSON.parse(saved) }
        : { ...this.defaultSettings };
    }

    /**
     * 保存设置
     */
    saveSettings() {
      GM_setValue("settings", JSON.stringify(this.settings));
    }

    /**
     * 显示设置面板
     */
    async showPanel() {
      const result = await Swal.fire({
        title: "脚本设置",
        html: this.createSettingsPanel(),
        width: "800px",
        showCancelButton: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消",
        didOpen: () => this.initPanelValues(),
      });

      if (result.isConfirmed) {
        this.saveSettingsFromPanel();
        showTip("设置已保存", "success");
        location.reload(); // 重载页面以应用新设置
      }
    }

    /**
     * 创建设置面板HTML
     */
    createSettingsPanel() {
      return `
            <div class="settings-panel">
                <div class="settings-tabs">
                    <button class="tab-btn active" data-tab="download">下载设置</button>
                    <button class="tab-btn" data-tab="upload">上传设置</button>
                    <button class="tab-btn" data-tab="cloud">云盘设置</button>
                    <button class="tab-btn" data-tab="ui">界面设置</button>
                    <button class="tab-btn" data-tab="features">功能开关</button>
                </div>
                <div class="settings-content">
                    <div class="tab-content active" id="download-settings">
                        <div class="setting-item">
                            <label>默认音质</label>
                            <select id="setting-quality">
                                ${Object.entries(QUALITY_LEVELS)
                                  .map(
                                    ([key, name]) =>
                                      `<option value="${key}">${name}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>文件名格式</label>
                            <select id="setting-filename">
                                <option value="artist-title">艺术家 - 标题</option>
                                <option value="title-artist">标题 - 艺术家</option>
                                <option value="title">仅标题</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>下载线程数</label>
                            <input type="number" id="setting-threads" min="1" max="5">
                        </div>
                    </div>
                    <div class="tab-content" id="upload-settings">
                        <div class="setting-item">
                            <label>自动匹配</label>
                            <input type="checkbox" id="setting-automatch">
                        </div>
                        <div class="setting-item">
                            <label>跳过已在</label>
                            <input type="checkbox" id="setting-skipexists">
                        </div>
                        <div class="setting-item">
                            <label>上传线程数</label>
                            <input type="number" id="setting-upload-threads" min="1" max="3">
                        </div>
                    </div>
                    <div class="tab-content" id="cloud-settings">
                        <div class="setting-item">
                            <label>自动清理</label>
                            <input type="checkbox" id="setting-autoclean">
                        </div>
                        <div class="setting-item">
                            <label>清理阈值(MB)</label>
                            <input type="number" id="setting-cleansize" min="100">
                        </div>
                        <div class="setting-item">
                            <label>备份列表</label>
                            <input type="checkbox" id="setting-backup">
                        </div>
                    </div>
                    <div class="tab-content" id="ui-settings">
                        <div class="setting-item">
                            <label>主题</label>
                            <select id="setting-theme">
                                <option value="auto">自动</option>
                                <option value="light">浅色</option>
                                <option value="dark">深色</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>字体大小</label>
                            <input type="number" id="setting-fontsize" min="12" max="20">
                        </div>
                        <div class="setting-item">
                            <label>显示IP归属</label>
                            <input type="checkbox" id="setting-showip">
                        </div>
                    </div>
                    <div class="tab-content" id="features-settings">
                        <div class="setting-item">
                            <label>评论增强</label>
                            <input type="checkbox" id="setting-enhance-comment">
                        </div>
                        <div class="setting-item">
                            <label>歌词增强</label>
                            <input type="checkbox" id="setting-enhance-lyric">
                        </div>
                        <div class="setting-item">
                            <label>播放列表增强</label>
                            <input type="checkbox" id="setting-enhance-playlist">
                        </div>
                    </div>
                </div>
            </div>`;
    }

    /**
     * 初始化面板值
     */
    initPanelValues() {
      // 绑定标签切换
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          document
            .querySelectorAll(".tab-btn")
            .forEach((b) => b.classList.remove("active"));
          document
            .querySelectorAll(".tab-content")
            .forEach((c) => c.classList.remove("active"));

          e.target.classList.add("active");
          document
            .getElementById(`${e.target.dataset.tab}-settings`)
            .classList.add("active");
        });
      });

      // 设置当前值
      const s = this.settings;

      // 下载设置
      document.getElementById("setting-quality").value = s.download.quality;
      document.getElementById("setting-filename").value = s.download.format;
      document.getElementById("setting-threads").value = s.download.threads;

      // 上传设置
      document.getElementById("setting-automatch").checked = s.upload.autoMatch;
      document.getElementById("setting-skipexists").checked =
        s.upload.skipExists;
      document.getElementById("setting-upload-threads").value =
        s.upload.threads;

      // 云盘设置
      document.getElementById("setting-autoclean").checked = s.cloud.autoClean;
      document.getElementById("setting-cleansize").value = s.cloud.cleanSize;
      document.getElementById("setting-backup").checked = s.cloud.backupList;

      // 界面设置
      document.getElementById("setting-theme").value = s.ui.theme;
      document.getElementById("setting-fontsize").value = s.ui.fontSize;
      document.getElementById("setting-showip").checked = s.ui.showIpLocation;

      // 功能开关
      document.getElementById("setting-enhance-comment").checked =
        s.features.enhanceComment;
      document.getElementById("setting-enhance-lyric").checked =
        s.features.enhanceLyric;
      document.getElementById("setting-enhance-playlist").checked =
        s.features.enhancePlaylist;
    }

    /**
     * 从面板保存设置
     */
    saveSettingsFromPanel() {
      // 下载设置
      this.settings.download.quality =
        document.getElementById("setting-quality").value;
      this.settings.download.format =
        document.getElementById("setting-filename").value;
      this.settings.download.threads = parseInt(
        document.getElementById("setting-threads").value
      );

      // 上传设置
      this.settings.upload.autoMatch =
        document.getElementById("setting-automatch").checked;
      this.settings.upload.skipExists =
        document.getElementById("setting-skipexists").checked;
      this.settings.upload.threads = parseInt(
        document.getElementById("setting-upload-threads").value
      );

      // 云盘设置
      this.settings.cloud.autoClean =
        document.getElementById("setting-autoclean").checked;
      this.settings.cloud.cleanSize = parseInt(
        document.getElementById("setting-cleansize").value
      );
      this.settings.cloud.backupList =
        document.getElementById("setting-backup").checked;

      // 界面设置
      this.settings.ui.theme = document.getElementById("setting-theme").value;
      this.settings.ui.fontSize = parseInt(
        document.getElementById("setting-fontsize").value
      );
      this.settings.ui.showIpLocation =
        document.getElementById("setting-showip").checked;

      // 功能开关
      this.settings.features.enhanceComment = document.getElementById(
        "setting-enhance-comment"
      ).checked;
      this.settings.features.enhanceLyric = document.getElementById(
        "setting-enhance-lyric"
      ).checked;
      this.settings.features.enhancePlaylist = document.getElementById(
        "setting-enhance-playlist"
      ).checked;

      this.saveSettings();
    }
  }

  // #endregion ================ 设置面板功能 ================

  // #region ================ 云盘匹配纠正功能 ================

  /**
   * 云盘匹配纠正类
   */
  class CloudMatcher {
    constructor() {
      this.songs = [];
      this.filter = {
        text: "",
        notMatch: false,
        songs: [],
        filterInput: null,
        notMatchCb: null,
      };
      this.controls = {
        tbody: null,
        pageArea: null,
        cloudDesc: null,
      };
      this.page = {
        current: 1,
        max: 1,
        limitCount: 50,
      };
    }

    /**
     * 开始匹配流程
     */
    async start() {
      this.showMatchDialog();
    }

    /**
     * 显示匹配对话框
     */
    async showMatchDialog() {
      await Swal.fire({
        showCloseButton: true,
        showConfirmButton: false,
        width: 800,
        html: `
                <style>
                    table {
                        width: 100%;
                        border-spacing: 0px;
                        border-collapse: collapse;
                    }
                    table th, table td {
                        text-align: left;
                        text-overflow: ellipsis;
                    }
                    table tbody {
                        display: block;
                        width: 100%;
                        max-height: 400px;
                        overflow-y: auto;
                    }
                    table thead tr, table tbody tr, table tfoot tr {
                        box-sizing: border-box;
                        table-layout: fixed;
                        display: table;
                        width: 100%;
                    }
                </style>
                <input class="swal2-input" type="text" value="${
                  this.filter.text
                }" id="text-filter" placeholder="歌曲过滤">
                <input class="form-check-input" type="checkbox" value="" id="cb-notmatch" ${
                  this.filter.notMatch ? "checked" : ""
                }><label class="form-check-label" for="cb-notmatch">未匹配歌曲</label>
                <table border="1" frame="hsides" rules="rows">
                    <thead>
                        <tr>
                            <th>操作</th>
                            <th>歌曲标题</th>
                            <th>歌手</th>
                            <th>时长</th>
                            <th>文件信息</th>
                            <th>上传日期</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `,
        footer: "<div id='page-area'></div><br><div id='cloud-desc'></div>",
        didOpen: () => {
          this.onDialogOpen();
        },
      });
    }

    /**
     * 对话框打开后的处理
     */
    onDialogOpen() {
      let container = Swal.getHtmlContainer();
      let footer = Swal.getFooter();
      let tbody = container.querySelector("tbody");

      this.popupObj = {
        container,
        tbody,
        footer,
      };

      // 绑定过滤器事件
      let filterInput = container.querySelector("#text-filter");
      filterInput.addEventListener("change", () => {
        let filtertext = filterInput.value.trim();
        if (this.filter.text != filtertext) {
          this.filter.text = filtertext;
          this.applyFilter();
        }
      });

      let notMatchCb = container.querySelector("#cb-notmatch");
      notMatchCb.addEventListener("change", () => {
        this.filter.notMatch = notMatchCb.checked;
        this.applyFilter();
      });

      // 获取云盘歌曲信息
      this.fetchCloudSongInfo();
    }

    /**
     * 获取云盘歌曲信息
     */
    fetchCloudSongInfo() {
      this.popupObj.tbody.innerHTML = "正在获取云盘歌曲信息...";
      this.fetchCloudSongInfoSub(0);
    }

    /**
     * 获取云盘歌曲信息子方法
     */
    fetchCloudSongInfoSub(offset) {
      weapiRequest("/api/v1/cloud/get", {
        data: {
          limit: 1000,
          offset,
        },
        onload: (res) => {
          if (res.code === 200) {
            this.popupObj.tbody.innerHTML = `正在获取${offset + 1}到${Math.min(
              offset + 1000,
              res.count
            )}首云盘歌曲`;

            // 处理歌曲数据
            res.data.forEach((song) => {
              if (!song.simpleSong.privilege.cs) {
                let songItem = {
                  id: song.songId,
                  name: song.songName,
                  album: song.album,
                  albumid: song.simpleSong.al?.id || 0,
                  artists: song.artist,
                  dt: duringTimeDesc(song.simpleSong.dt || 0),
                  filename: song.fileName,
                  fileSize: song.fileSize,
                  bitrate: song.bitrate,
                  picUrl:
                    song.simpleSong.al?.picUrl ||
                    "http://p4.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg",
                  addTime: new Date(song.addTime).toLocaleDateString(),
                  isNoCopyright: song.simpleSong.privilege.st < 0,
                  isVIP: song.simpleSong.privilege.fee === 1,
                  isPay: song.simpleSong.privilege.fee === 4,
                  uploaded: false,
                  needMatch: true,
                };
                this.songs.push(songItem);
              }
            });

            // 继续获取或完成
            if (res.hasMore) {
              this.fetchCloudSongInfoSub(offset + 1000);
            } else {
              this.createTableRows();
              this.applyFilter();
            }
          }
        },
      });
    }

    /**
     * 创建表格行
     */
    createTableRows() {
      for (let i = 0; i < this.songs.length; i++) {
        const song = this.songs[i];
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td><button type="button" class="swal2-styled">匹配</button></td>
                <td>
                    <a href="https://music.163.com/album?id=${
                      song.albumid
                    }" target="_blank">
                        <img src="${
                          song.picUrl
                        }?param=50y50&quality=100" title="${song.album}">
                    </a>
                </td>
                <td>
                    <a href="https://music.163.com/song?id=${
                      song.id
                    }" target="_blank">${song.name}</a>
                </td>
                <td>${song.artists}</td>
                <td>${song.dt}</td>
                <td>${fileSizeDesc(song.fileSize)} ${
          song.ext ? song.ext.toUpperCase() : ""
        }</td>
                <td>${song.addTime}</td>
            `;

        // 添加匹配按钮事件
        const btn = tr.querySelector("button");
        btn.addEventListener("click", () => this.showMatchPopup(song));

        song.tablerow = tr;
      }
    }

    /**
     * 应用过滤器
     */
    applyFilter() {
      this.filter.songIndexs = [];
      const filterText = this.filter.text;
      const isNotMatch = this.filter.notMatch;

      for (let i = 0; i < this.songs.length; i++) {
        const song = this.songs[i];

        // 应用文本过滤
        if (filterText.length > 0) {
          const searchText = filterText.toLowerCase();
          if (
            !song.name.toLowerCase().includes(searchText) &&
            !song.album.toLowerCase().includes(searchText) &&
            !song.artists.toLowerCase().includes(searchText)
          ) {
            continue;
          }
        }

        // 应用未匹配过滤
        if (isNotMatch && !song.needMatch) {
          continue;
        }

        this.filter.songIndexs.push(i);
      }

      // 更新分页
      this.page.current = 1;
      this.page.max = Math.ceil(
        this.filter.songIndexs.length / this.page.limitCount
      );

      // 渲染数据
      this.renderData();
      this.renderFilterInfo();
    }

    /**
     * 渲染数据
     */
    renderData() {
      if (this.filter.songIndexs.length === 0) {
        this.popupObj.tbody.innerHTML = "空空如也";
        this.popupObj.footer.innerHTML = "";
        return;
      }

      this.popupObj.tbody.innerHTML = "";
      const songBegin = (this.page.current - 1) * this.page.limitCount;
      const songEnd = Math.min(
        this.filter.songIndexs.length,
        songBegin + this.page.limitCount
      );

      // 添加当前页的歌曲
      for (let i = songBegin; i < songEnd; i++) {
        this.popupObj.tbody.appendChild(
          this.songs[this.filter.songIndexs[i]].tablerow
        );
      }

      // 生成分页按钮
      this.renderPagination();
    }

    /**
     * 渲染分页
     */
    renderPagination() {
      let pageIndexs = [1];
      const floor = Math.max(2, this.page.current - 2);
      const ceil = Math.min(this.page.max - 1, this.page.current + 2);

      for (let i = floor; i <= ceil; i++) {
        pageIndexs.push(i);
      }

      if (this.page.max > 1) {
        pageIndexs.push(this.page.max);
      }

      this.popupObj.footer.innerHTML = "";
      pageIndexs.forEach((pageIndex) => {
        const pageBtn = document.createElement("button");
        pageBtn.setAttribute("type", "button");
        pageBtn.className = "swal2-styled";
        pageBtn.innerHTML = pageIndex;

        if (pageIndex !== this.page.current) {
          pageBtn.addEventListener("click", () => {
            this.page.current = pageIndex;
            this.renderData();
          });
        } else {
          pageBtn.style.background = "white";
        }

        this.popupObj.footer.appendChild(pageBtn);
      });
    }

    /**
     * 显示匹配弹窗
     */
    async showMatchPopup(song) {
      const result = await Swal.fire({
        title: `歌曲 ${song.name} 匹配纠正`,
        input: "number",
        inputLabel: "目标歌曲ID",
        footer: "ID为0时解除匹配 歌曲页面网址里的数字就是ID",
        inputValidator: (value) => {
          if (!value) {
            return "内容为空";
          }
        },
      });

      if (result.isConfirmed) {
        await this.matchSong(song.id, result.value);
      }
    }

    /**
     * 匹配歌曲
     */
    async matchSong(fromId, toId) {
      try {
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/cloud/user/song/match", {
            data: {
              songId: fromId,
              adjustSongId: toId,
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code === 200) {
          let msg = toId > 0 ? "匹配成功" : "解除匹配成功";
          if (response.matchData) {
            msg = `${response.matchData.songName} 成功匹配到 ${response.matchData.simpleSong.name}`;
          }
          showTips(msg, "success");

          // 更新列表
          if (response.matchData) {
            this.updateSongInList(fromId, response.matchData);
          }
        } else {
          showTips(response.message || response.msg || "匹配失败", "error");
        }
      } catch (error) {
        console.error("Match failed:", error);
        showTips("匹配失败", "error");
      }
    }
  }

  // #endregion ================ 云盘匹配纠正功能 ================

  // #region ================ 云盘音质提升功能 ================

  /**
   * 云盘音质提升类
   */
  class CloudUpgrader {
    constructor() {
      this.songs = [];
      this.filter = {
        text: "",
        songs: [],
        filterInput: null,
      };
      this.page = {
        current: 1,
        max: 1,
        limitCount: 50,
      };
      this.batchUpgrade = {
        threadMax: 1,
        threadCount: 1,
        working: false,
        finnishThread: 0,
        songIndexs: [],
      };
    }

    /**
     * 开始提升流程
     */
    async start() {
      // 检查会员状态
      const userRes = await new Promise((resolve, reject) => {
        weapiRequest(`/api/v1/user/detail/${unsafeWindow.GUser.userId}`, {
          onload: resolve,
          onerror: reject,
        });
      });

      if (userRes.profile.vipType <= 10) {
        showTips("当前不是会员,无法获取无损以上音源", "error");
        return;
      }

      // 显示音质选择对话框
      const result = await Swal.fire({
        title: "云盘音质提升",
        input: "select",
        inputOptions: { lossless: "无损", hires: "Hi-Res" },
        inputPlaceholder: "选择目标音质",
        confirmButtonText: "下一步",
        showCloseButton: true,
        footer:
          "<div>寻找网易云音源比云盘音质好的歌曲,然后进行删除并重新上传</div><div>⚠️可能出现删除了歌曲但上传失败的情况</div><div>部分歌曲无法判断是否能提升</div>",
        inputValidator: (value) => {
          if (!value) {
            return "请选择目标音质";
          }
        },
      });

      if (result.isConfirmed) {
        this.targetLevel = result.value;
        this.targetWeight = levelWeight[result.value];
        this.showUpgradeDialog();
      }
    }

    /**
     * 显示升级对话框
     */
    async showUpgradeDialog() {
      await Swal.fire({
        title: "云盘音质提升",
        showCloseButton: true,
        showConfirmButton: false,
        width: 800,
        html: `
                <style>
                    table {
                        width: 100%;
                        border-spacing: 0;
                        border-collapse: collapse;
                    }
                    table th, table td {
                        text-align: left;
                        padding: 8px;
                    }
                    table tbody {
                        max-height: 400px;
                        overflow-y: auto;
                    }
                </style>
                <input class="swal2-input" type="text" id="text-filter" placeholder="歌曲过滤">
                <button type="button" class="swal2-confirm swal2-styled" id="btn-upgrade-batch">全部提升音质</button>
                <table border="1">
                    <thead>
                        <tr>
                            <th>操作</th>
                            <th>歌曲标题</th>
                            <th>歌手</th>
                            <th>云盘音源</th>
                            <th>目标音源</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `,
        footer: "<div id='page-area'></div>",
        didOpen: () => {
          this.onDialogOpen();
        },
      });
    }

    /**
     * 对话框打开后的处理
     */
    onDialogOpen() {
      const container = Swal.getHtmlContainer();
      const tbody = container.querySelector("tbody");
      const footer = Swal.getFooter();

      this.popupObj = {
        container,
        tbody,
        footer,
      };

      // 绑定搜索事件
      const filterInput = container.querySelector("#text-filter");
      filterInput.addEventListener("input", (e) => {
        this.filter.text = e.target.value.trim();
        this.applyFilter();
      });

      // 绑定批量升级按钮
      this.btnUpgradeBatch = container.querySelector("#btn-upgrade-batch");
      this.btnUpgradeBatch.addEventListener("click", () =>
        this.startBatchUpgrade()
      );

      // 获取云盘歌曲
      this.fetchCloudSongs();
    }

    /**
     * 获取云盘歌曲
     */
    async fetchCloudSongs() {
      this.popupObj.tbody.innerHTML = "正在查找云盘歌曲...";
      await this.fetchCloudSongsSub(0, []);
    }

    /**
     * 获取云盘歌曲子方法
     */
    async fetchCloudSongsSub(offset, songIds) {
      try {
        const res = await new Promise((resolve, reject) => {
          weapiRequest("/api/v1/cloud/get", {
            data: {
              limit: 1000,
              offset,
            },
            onload: resolve,
            onerror: reject,
          });
        });

        this.popupObj.tbody.innerHTML = `正在搜索第${offset + 1}到${Math.min(
          offset + 1000,
          res.count
        )}云盘歌曲`;

        // 处理歌曲数据
        res.data.forEach((song) => {
          if (song.simpleSong.privilege.toast) return;
          if (
            song.simpleSong.privilege.fee === 0 &&
            song.simpleSong.privilege.flLevel === "none"
          )
            return;
          if (song.simpleSong.privilege.fee === 4) return;
          if (song.simpleSong.privilege.playMaxBrLevel === "none") return;

          const cloudWeight =
            levelWeight[song.simpleSong.privilege.plLevel] || 0;
          if (cloudWeight >= this.targetWeight) return;

          songIds.push({ id: song.simpleSong.id });
          this.popupObj.tbody.innerHTML = `正在搜索第${offset + 1}到${Math.min(
            offset + 1000,
            res.count
          )}云盘歌曲 找到${songIds.length}首可能有提升的歌曲`;
        });

        if (res.hasMore) {
          await this.fetchCloudSongsSub(offset + 1000, songIds);
        } else {
          await this.filterTargetLevelSongs(0, songIds);
        }
      } catch (error) {
        console.error("获取云盘歌曲失败:", error);
        showTips("获取云盘歌曲失败", "error");
      }
    }

    /**
     * 过滤目标音质歌曲
     */
    async filterTargetLevelSongs(offset, songIds) {
      if (offset >= songIds.length) {
        this.createTableRows();
        this.applyFilter();
        return;
      }

      try {
        const res = await new Promise((resolve, reject) => {
          weapiRequest("/api/v3/song/detail", {
            data: {
              c: JSON.stringify(songIds.slice(offset, offset + 1000)),
            },
            onload: resolve,
            onerror: reject,
          });
        });

        // 处理歌曲数据
        res.data.forEach((song) => {
          if (song.simpleSong.privilege.toast) return;
          if (
            song.simpleSong.privilege.fee === 0 &&
            song.simpleSong.privilege.flLevel === "none"
          )
            return;
          if (song.simpleSong.privilege.fee === 4) return;
          if (song.simpleSong.privilege.playMaxBrLevel === "none") return;

          const cloudWeight =
            levelWeight[song.simpleSong.privilege.plLevel] || 0;
          if (cloudWeight >= this.targetWeight) return;

          songIds.push({ id: song.simpleSong.id });
          this.popupObj.tbody.innerHTML = `正在搜索第${offset + 1}到${Math.min(
            offset + 1000,
            res.count
          )}云盘歌曲 找到${songIds.length}首可能有提升的歌曲`;
        });

        if (res.hasMore) {
          await this.fetchCloudSongsSub(offset + 1000, songIds);
        } else {
          await this.filterTargetLevelSongs(0, songIds);
        }
      } catch (error) {
        console.error("获取云盘歌曲失败:", error);
        showTips("获取云盘歌曲失败", "error");
      }
    }

    /**
     * 创建表格行
     */
    createTableRows() {
      for (let i = 0; i < this.songs.length; i++) {
        const song = this.songs[i];
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td><button type="button" class="swal2-styled">提升</button></td>
                <td>${escapeHTML(song.name)}</td>
                <td>${escapeHTML(song.artist)}</td>
                <td>${levelDesc(song.cloudLevel)}</td>
                <td>${levelDesc(song.targetLevel)}</td>
            `;

        // 添加提升按钮事件
        const btn = tr.querySelector("button");
        btn.addEventListener("click", () => this.upgradeSong(song));

        song.tablerow = tr;
      }
    }

    /**
     * 应用过滤器
     */
    applyFilter() {
      this.filter.songIndexs = [];
      const filterText = this.filter.text;

      for (let i = 0; i < this.songs.length; i++) {
        const song = this.songs[i];

        if (filterText.length > 0) {
          const searchText = filterText.toLowerCase();
          if (
            !song.name.toLowerCase().includes(searchText) &&
            !song.artist.toLowerCase().includes(searchText)
          ) {
            continue;
          }
        }

        this.filter.songIndexs.push(i);
      }

      // 更新分页
      this.page.current = 1;
      this.page.max = Math.ceil(
        this.filter.songIndexs.length / this.page.limitCount
      );

      // 渲染数据
      this.renderData();
    }

    /**
     * 开始批量提升
     */
    async startBatchUpgrade() {
      if (this.batchUpgrade.working) {
        return;
      }

      const result = await Swal.fire({
        title: "确认提升音质",
        text: `确定要提升 ${this.songs.length} 首歌曲的音质吗？`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    /**
     * 渲染数据
     */
    renderData() {
      if (this.filter.songIndexs.length === 0) {
        this.popupObj.tbody.innerHTML = "空空如也";
        this.popupObj.footer.innerHTML = "";
        return;
      }

      this.popupObj.tbody.innerHTML = "";
      const songBegin = (this.page.current - 1) * this.page.limitCount;
      const songEnd = Math.min(
        this.filter.songIndexs.length,
        songBegin + this.page.limitCount
      );

      // 添加当前页的歌曲
      for (let i = songBegin; i < songEnd; i++) {
        this.popupObj.tbody.appendChild(
          this.songs[this.filter.songIndexs[i]].tablerow
        );
      }
    }

    /**
     * 提升单首歌曲音质
     */
    async upgradeSong(song) {
      try {
        // 获取目标音质URL
        const urlRes = await new Promise((resolve, reject) => {
          weapiRequest("/api/song/enhance/player/url/v1", {
            data: {
              ids: [song.id],
              level: this.targetLevel,
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (!urlRes.data?.[0]?.url) {
          throw new Error("获取音源失败");
        }

        // 删除云盘歌曲
        await this.deleteCloudSong(song.id);

        // 上传新音源
        await this.uploadNewSource(song, urlRes.data[0]);

        showTips("音质提升成功", "success");
        this.updateSongStatus(song.id, "提升成功", "success");
      } catch (error) {
        console.error("Upgrade failed:", error);
        showTips("音质提升失败", "error");
        this.updateSongStatus(song.id, "提升失败", "error");
      }
    }

    /**
     * 删除云盘歌曲
     */
    async deleteCloudSong(songId) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/cloud/del", {
          data: {
            songIds: [songId],
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error("删除云盘歌曲失败");
      }
    }

    /**
     * 上传新音源
     */
    async uploadNewSource(song, urlInfo) {
      // 获取音频文件
      const audioBlob = await this.downloadAudio(urlInfo.url);

      // 获取上传token
      const tokenRes = await this.getUploadToken(song, audioBlob.size);

      // 上传文件
      await this.uploadFile(audioBlob, tokenRes);

      // 提交文件信息
      await this.submitFileInfo(song, tokenRes);
    }

    /**
     * 下载音频
     */
    async downloadAudio(url) {
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType: "blob",
          onload: resolve,
          onerror: reject,
        });
      });

      return response.response;
    }

    /**
     * 获取上传token
     */
    async getUploadToken(song, fileSize) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/nos/token/alloc", {
          data: {
            filename: song.filename,
            length: fileSize,
            ext: song.ext || "mp3",
            type: "audio",
            bucket: "jd-musicrep-privatecloud-audio-public",
            local: false,
            nos_product: 3,
            md5: song.md5,
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error("获取上传token失败");
      }

      return response.result;
    }

    /**
     * 上传文件
     */
    async uploadFile(audioBlob, tokenRes) {
      const chunkSize = UPLOAD_CHUNK_SIZE;
      let offset = 0;
      let context = null;

      while (offset < audioBlob.size) {
        const complete = offset + chunkSize >= audioBlob.size;
        const chunk = audioBlob.slice(offset, offset + chunkSize);

        let url = `http://45.127.129.8/jd-musicrep-privatecloud-audio-public/${encodeURIComponent(
          tokenRes.objectKey
        )}?offset=${offset}&complete=${complete}&version=1.0`;
        if (context) url += `&context=${context}`;

        const response = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "POST",
            url,
            headers: {
              "x-nos-token": tokenRes.token,
              "Content-Type": "audio/mpeg",
            },
            data: chunk,
            onload: resolve,
            onerror: reject,
          });
        });

        const res = JSON.parse(response.response);
        if (complete) {
          return res;
        }

        offset = res.offset;
        context = res.context;

        // 更新上传进度
        const progress = Math.round((offset / audioBlob.size) * 100);
        this.updateSongStatus(song.id, `上传中 ${progress}%`);
      }
    }

    /**
     * 提交文件信息
     */
    async submitFileInfo(song, tokenRes) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/upload/cloud/info/v2", {
          data: {
            md5: song.md5,
            songId: song.id,
            filename: song.filename,
            song: song.name,
            album: song.album,
            artist: song.artist,
            bitrate: String(song.bitrate),
            resourceId: tokenRes.resourceId,
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error("提交文件信息失败");
      }

      return response;
    }
  }

  // #endregion ================ 云盘音质提升功能 ================

  // #region ================ 本地文件上传功能 ================

  /**
   * 本地文件上传管理器类
   */
  class LocalFileUploader {
    constructor() {
      this.files = [];
      this.uploadedCount = 0;
      this.failedFiles = [];
    }

    /**
     * 开始上传流程
     */
    async start() {
      // 显示文件选择对话框
      const result = await Swal.fire({
        title: "本地文件上传",
        html: `
                <div class="upload-local">
                    <input type="file" id="file-input" multiple accept=".mp3,.flac,.m4a,.wav">
                    <div class="file-list">
                        <table id="file-table">
                            <thead>
                                <tr>
                                    <th>文件名</th>
                                    <th>大小</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `,
        showCancelButton: true,
        confirmButtonText: "开始上传",
        cancelButtonText: "取消",
        didOpen: () => {
          this.bindFileInput();
        },
      });

      if (result.isConfirmed && this.files.length > 0) {
        await this.startUpload();
      }
    }

    /**
     * 绑定文件输入事件
     */
    bindFileInput() {
      const fileInput = document.getElementById("file-input");
      fileInput.addEventListener("change", (e) => {
        this.files = Array.from(e.target.files);
        this.renderFileList();
      });
    }

    /**
     * 渲染文件列表
     */
    renderFileList() {
      const tbody = document.querySelector("#file-table tbody");
      tbody.innerHTML = "";

      this.files.forEach((file, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${escapeHTML(file.name)}</td>
                <td>${fileSizeDesc(file.size)}</td>
                <td class="status">待上传</td>
            `;
        tbody.appendChild(tr);
      });
    }

    /**
     * 开始上传文件
     */
    async startUpload() {
      // 显示上��进度��话框
      await Swal.fire({
        title: "上传进度",
        html: `<div class="upload-progress">
                <div id="progress-text">准备上传...</div>
                <div class="progress-bar">
                    <div id="progress" style="width: 0%"></div>
                </div>
            </div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      // 开始上传
      for (let i = 0; i < this.files.length; i++) {
        try {
          await this.uploadFile(this.files[i], i);
          this.uploadedCount++;
        } catch (error) {
          console.error("Upload failed:", error);
          this.failedFiles.push(this.files[i]);
        }
        this.updateProgress();
      }

      // 完成上传
      this.onUploadComplete();
    }

    /**
     * 上传单个文件
     */
    async uploadFile(file, index) {
      // 读取文件标签信息
      const tags = await this.readFileTags(file);

      // 获取上传token
      const tokenRes = await this.getUploadToken(file);

      // 分片上传文件
      await this.uploadFileChunks(file, tokenRes, index);

      // 提交文件信息
      await this.submitFileInfo(file, tags, tokenRes);
    }

    /**
     * 更新进度
     */
    updateProgress() {
      const total = this.files.length;
      const finished = this.uploadedCount + this.failedFiles.length;
      const progress = Math.round((finished / total) * 100);

      document.getElementById("progress").style.width = `${progress}%`;
      document.getElementById(
        "progress-text"
      ).textContent = `已完成: ${finished}/${total} (成功: ${this.uploadedCount}, 失败: ${this.failedFiles.length})`;
    }

    /**
     * 上传完成处理
     */
    onUploadComplete() {
      let message = "上传完成";
      if (this.failedFiles.length > 0) {
        message += `\n失败 ${
          this.failedFiles.length
        } 个文件:\n${this.failedFiles.map((f) => f.name).join("\n")}`;
      }

      Swal.fire({
        title: "上传结果",
        text: message,
        icon: this.failedFiles.length > 0 ? "warning" : "success",
      });
    }

    /**
     * 获取上传token
     */
    async getUploadToken(file) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/nos/token/alloc", {
          data: {
            filename: file.name,
            length: file.size,
            ext: file.ext || "mp3",
            type: "audio",
            bucket: "jd-musicrep-privatecloud-audio-public",
            local: false,
            nos_product: 3,
            md5: file.md5,
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error("获取上传token失败");
      }

      return response.result;
    }

    /**
     * 上传文件分片
     */
    async uploadFileChunks(file, tokenRes, index) {
      const chunkSize = UPLOAD_CHUNK_SIZE;
      let offset = 0;
      let context = null;

      while (offset < file.size) {
        const complete = offset + chunkSize >= file.size;
        const chunk = file.file.slice(offset, offset + chunkSize);

        let url = `http://45.127.129.8/jd-musicrep-privatecloud-audio-public/${encodeURIComponent(
          tokenRes.objectKey
        )}?offset=${offset}&complete=${complete}&version=1.0`;
        if (context) url += `&context=${context}`;

        const response = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "POST",
            url,
            headers: {
              "x-nos-token": tokenRes.token,
              "Content-Type": "audio/mpeg",
            },
            data: chunk,
            onload: resolve,
            onerror: reject,
          });
        });

        const res = JSON.parse(response.response);
        if (complete) {
          return res;
        }

        offset = res.offset;
        context = res.context;

        // 更新上传进度
        const progress = Math.round((offset / file.size) * 100);
        this.updateUploadProgress(progress);
      }
    }

    /**
     * 提交文件信息
     */
    async submitFileInfo(file, tags, tokenRes) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/upload/cloud/info/v2", {
          data: {
            md5: file.md5,
            songId: file.id,
            filename: file.name,
            song: file.name,
            album: file.album,
            artist: file.artist,
            bitrate: String(file.bitrate),
            resourceId: tokenRes.resourceId,
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error("提交文件信息失败");
      }

      return response;
    }

    /**
     * 读取文件标签信息
     */
    readFileTags(file) {
      return new Promise((resolve, reject) => {
        jsmediatags.read(file, {
          onSuccess: (tag) => {
            const tags = {
              title: tag.tags.title || "",
              artist: tag.tags.artist || "",
              album: tag.tags.album || "",
              year: tag.tags.year || "",
              comment: tag.tags.comment || "",
              genre: tag.tags.genre || "",
              track: tag.tags.track || "",
              picture: tag.tags.picture || null,
            };
            resolve(tags);
          },
          onError: (error) => {
            console.warn("Read tags failed:", error);
            resolve({});
          },
        });
      });
    }

    /**
     * 更新上传进度
     */
    updateUploadProgress(progress) {
      const progressBar = document.getElementById("progress");
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      const progressText = document.getElementById("progress-text");
      if (progressText) {
        progressText.textContent = `上传中... ${progress}%`;
      }
    }

    /**
     * 更新文件状态
     */
    updateFileStatus(index, status, type = "info") {
      const statusCell = document.querySelector(
        `#file-table tr:nth-child(${index + 1}) .status`
      );
      if (statusCell) {
        statusCell.textContent = status;
        statusCell.className = `status ${type}`;
      }
    }
  }

  // #endregion ================ 本地文件上传功能 ================

  // #region ================ 云盘导入导出功能 ================

  /**
   * 云盘导入导出管理器类
   */
  class CloudImportExport {
    constructor() {
      this.songs = [];
      this.exportData = null;
    }

    /**
     * 导出云盘数据
     */
    async exportCloud() {
      // 显示导出对话框
      await Swal.fire({
        title: "导出云盘数据",
        html: `<div id="export-progress">正在获取云盘数据...</div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      try {
        // 获取所有云盘歌曲
        await this.fetchAllCloudSongs();

        // 生成导出数据
        this.exportData = {
          version: "1.0",
          timestamp: Date.now(),
          songs: this.songs.map((song) => ({
            id: song.songId,
            name: song.songName,
            artist: song.artist,
            album: song.album,
            addTime: song.addTime,
            bitrate: song.bitrate,
            fileSize: song.fileSize,
            fileName: song.fileName,
            md5: song.md5,
          })),
        };

        // 下载文件
        const blob = new Blob([JSON.stringify(this.exportData, null, 2)], {
          type: "application/json;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const filename = `cloud_songs_${new Date()
          .toISOString()
          .slice(0, 10)}.json`;

        GM_download({
          url,
          name: filename,
          onload: () => {
            URL.revokeObjectURL(url);
            showTips("导出成功", "success");
          },
        });
      } catch (error) {
        console.error("Export failed:", error);
        showTips("导出失败", "error");
      }
    }

    /**
     * 获取所有云盘歌曲
     */
    async fetchAllCloudSongs() {
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/v1/cloud/get", {
            data: {
              limit: 1000,
              offset,
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code === 200) {
          this.songs = this.songs.concat(response.data);
          hasMore = response.hasMore;
          offset += 1000;

          // 更新进度
          document.getElementById(
            "export-progress"
          ).textContent = `已获取 ${this.songs.length} 首歌曲...`;
        } else {
          throw new Error("获取云盘歌曲失败");
        }
      }
    }

    /**
     * 导入云盘数据
     */
    async importCloud() {
      // 显示文件选择对话框
      const result = await Swal.fire({
        title: "导入云盘数据",
        html: `
                <div class="import-cloud">
                    <input type="file" id="import-file" accept=".json">
                    <div id="import-progress"></div>
                </div>
            `,
        showCancelButton: true,
        confirmButtonText: "开始导入",
        cancelButtonText: "取消",
      });

      if (!result.isConfirmed) return;

      const fileInput = document.getElementById("import-file");
      if (!fileInput.files || fileInput.files.length === 0) {
        showTips("请选择要导入的文件", "warning");
        return;
      }

      try {
        // 读取文件内容
        const fileContent = await this.readFileContent(fileInput.files[0]);
        const importData = JSON.parse(fileContent);

        // 验证数据格式
        if (!this.validateImportData(importData)) {
          throw new Error("导入文件格式不正确");
        }

        // 开始导入
        await this.startImport(importData.songs);
      } catch (error) {
        console.error("Import failed:", error);
        showTips("导入失败: " + error.message, "error");
      }
    }

    /**
     * 读取文件内容
     */
    readFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }

    /**
     * 验证导入数据格式
     */
    validateImportData(data) {
      return (
        data &&
        data.version &&
        Array.isArray(data.songs) &&
        data.songs.every(
          (song) =>
            song.id &&
            song.name &&
            song.artist &&
            song.album &&
            song.fileName &&
            song.md5
        )
      );
    }

    /**
     * 开始导入
     */
    async startImport(songs) {
      // 显示导入进度对话框
      await Swal.fire({
        title: "导入进度",
        html: `<div class="import-progress">
                <div id="progress-text">准备导入...</div>
                <div class="progress-bar">
                    <div id="progress" style="width: 0%"></div>
                </div>
            </div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      let success = 0;
      let failed = 0;

      // 开始导入
      for (let i = 0; i < songs.length; i++) {
        try {
          await this.importSong(songs[i]);
          success++;
        } catch (error) {
          console.error("Import song failed:", error);
          failed++;
        }

        // 更新进度
        const progress = Math.round(((i + 1) / songs.length) * 100);
        this.updateProgress(progress, success, failed);
      }

      // 完成导入
      this.onImportComplete(success, failed);
    }

    /**
     * 导入单首歌曲
     */
    async importSong(song) {
      // 获取音乐URL
      const urlRes = await new Promise((resolve, reject) => {
        weapiRequest("/api/song/enhance/player/url/v1", {
          data: {
            ids: [song.id],
            level: "lossless",
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (!urlRes.data?.[0]?.url) {
        throw new Error("获取音乐URL失败");
      }

      // 下载音频文件
      const audioBlob = await this.downloadAudio(urlRes.data[0].url);

      // 获取上传token
      const tokenRes = await this.getUploadToken(song, audioBlob.size);

      // 上传文件
      await this.uploadFile(audioBlob, tokenRes);

      // 提交文件信息
      await this.submitFileInfo(song, tokenRes);
    }

    /**
     * 下载音频
     */
    async downloadAudio(url) {
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType: "blob",
          onload: resolve,
          onerror: reject,
        });
      });

      return response.response;
    }

    /**
     * 获取上传token
     */
    async getUploadToken(song, fileSize) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/nos/token/alloc", {
          data: {
            filename: song.filename,
            length: fileSize,
            ext: song.ext || "mp3",
            type: "audio",
            bucket: "jd-musicrep-privatecloud-audio-public",
            local: false,
            nos_product: 3,
            md5: song.md5,
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error("获取上传token失败");
      }

      return response.result;
    }
  }

  // #endregion ================ 云盘导入导出功能 ================

  // #region ================ 歌单排序功能 ================

  /**
   * 歌单排序管理器类
   */
  class PlaylistSorter {
    constructor(playlistId) {
      this.playlistId = playlistId;
      this.songs = [];
    }

    /**
     * 显示排序对话框
     */
    async showSortDialog() {
      const result = await Swal.fire({
        title: "歌单排序",
        input: "select",
        inputOptions: {
          time: "按时间排序",
          hot: "按热度排序",
          comment: "按评论数排序",
        },
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      });

      if (result.isConfirmed) {
        await this.sortPlaylist(result.value);
      }
    }

    /**
     * 排序播放列表
     */
    async sortPlaylist(sortType) {
      try {
        // 获取播放列表详情
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/v1/playlist/detail", {
            data: { id: this.playlistId },
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code !== 200) {
          throw new Error("获取播放列表失败");
        }

        this.songs = response.playlist.tracks;

        // 排序
        this.songs.sort((a, b) => {
          let compareResult = 0;
          switch (sortType) {
            case "time":
              compareResult = a.dt - b.dt;
              break;
            case "hot":
              compareResult = b.playCount - a.playCount;
              break;
            case "comment":
              compareResult = b.commentCount - a.commentCount;
              break;
          }
          return compareResult;
        });

        // 更新播放列表顺序
        const songIds = this.songs.map((song) => song.id);
        await this.updatePlaylistOrder(songIds);

        showTip("排序完成", "success");
      } catch (error) {
        showTip("排序失败: " + error.message, "error");
      }
    }

    /**
     * 更新播放列表顺序
     */
    async updatePlaylistOrder(songIds) {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/playlist/manipulate/tracks", {
          data: {
            pid: this.playlistId,
            trackIds: JSON.stringify(songIds),
            op: "update",
          },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code !== 200) {
        throw new Error(response.message || "更新播放列表失败");
      }
    }
  }

  // #endregion ================ 歌单排序功能 ================

  // #region ================ 专辑页加载 Disc 信息功能 ================

  /**
   * 专辑信息加载器类
   */
  class AlbumInfoLoader {
    constructor(albumId) {
      this.albumId = albumId;
      this.albumInfo = null;
      this.discList = [];
    }

    /**
     * 加载专辑信息
     */
    async loadAlbumInfo() {
      try {
        const response = await new Promise((resolve, reject) => {
          weapiRequest(`/api/v1/album/${this.albumId}`, {
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code === 200) {
          this.albumInfo = response;
          this.processDiscInfo();
          this.renderDiscInfo();
        }
      } catch (error) {
        console.error("Load album info failed:", error);
        showTips("加载专辑信息失败", "error");
      }
    }

    /**
     * 处理碟片信息
     */
    processDiscInfo() {
      // 按碟片分组歌曲
      this.albumInfo.songs.forEach((song) => {
        const discInfos = song.cd ? song.cd.split(" ") : [];
        if (discInfos.length > 0) {
          const discIndex = parseInt(discInfos[0]);
          while (this.discList.length < discIndex) {
            this.discList.push(null);
          }
          if (this.discList[discIndex - 1] === null) {
            let discTitle = `Disc ${discIndex}`;
            if (discInfos.length > 1) {
              discTitle += " " + discInfos.slice(1).join(" ");
            }
            this.discList[discIndex - 1] = {
              title: discTitle,
              songs: [],
            };
          }
          this.discList[discIndex - 1].songs.push(song);
        }
      });
    }

    /**
     * 渲染碟片信息
     */
    renderDiscInfo() {
      const tableRows = document.querySelectorAll(".m-table-album tr");
      const tableParent = document.querySelector("div:has(> .m-table-album)");
      let isTableCreated = false;

      this.discList.forEach((disc, index) => {
        if (disc === null) return;
        isTableCreated = true;
        tableParent.innerHTML += `
                <div class="u-title u-title-1 f-cb" style="margin-top: 10px">
                    <h3><span class="f-ff2">${disc.title}</span></h3>
                    <span class="sub s-fc3">${disc.songs.length}首歌</span>
                </div>
                <table class="m-table m-table-album">
                    <thead>
                        <tr>
                            <th class="first w1"><div class="wp">&nbsp;</div></th>
                            <th><div class="wp">歌曲标题</div></th>
                            <th class="w2-1"><div class="wp">时长</div></th>
                            <th class="w4"><div class="wp">歌手</div></th>
                        </tr>
                    </thead>
                    <tbody id="ncmextend-disc-${index}"></tbody>
                </table>
            `;

        let tbody = tableParent.querySelector(`#ncmextend-disc-${index}`);
        disc.songs.forEach((songItem, songIndex) => {
          tableRows.forEach((tableRow) => {
            if (Number(tableRow.id.slice(0, -13)) === songItem.id) {
              tableRow.querySelector(".num").innerHTML = songItem.no;
              tableRow.className = songIndex % 2 == 0 ? "even " : "";
              if (songItem.privilege.st < 0) tableRow.className += "js-dis";
              tbody.appendChild(tableRow);
            }
          });
        });
      });

      if (isTableCreated) {
        const originTitle = document.querySelector(".n-songtb .u-title");
        originTitle.parentNode.removeChild(originTitle);
        tableParent.removeChild(tableParent.firstChild);
      }
    }
  }

  // #endregion ================ 专辑页加载 Disc 信息功能 ================

  // #region ================ VIP歌曲下载上传功能 ================

  /**
   * VIP歌曲处理器类
   */
  class VIPSongHandler {
    constructor() {
      this.vipSongs = [];
    }

    /**
     * 检查VIP限免歌曲
     */
    async checkVIPSongs() {
      try {
        const response = await new Promise((resolve, reject) => {
          weapiRequest("/api/v1/vip/free/songs", {
            onload: resolve,
            onerror: reject,
          });
        });

        if (response.code === 200) {
          this.vipSongs = response.data;
          this.showVIPSongList();
        }
      } catch (error) {
        console.error("Check VIP songs failed:", error);
        showTips("获取VIP限免歌曲失败", "error");
      }
    }

    /**
     * 显示VIP歌曲列表
     */
    async showVIPSongList() {
      const result = await Swal.fire({
        title: "VIP限免歌曲",
        html: `
                <div class="vip-songs">
                    <table id="vip-song-table">
                        <thead>
                            <tr>
                                <th>歌曲名</th>
                                <th>歌手</th>
                                <th>专辑</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.vipSongs
                              .map(
                                (song) => `
                                <tr data-id="${song.id}">
                                    <td>${escapeHTML(song.name)}</td>
                                    <td>${escapeHTML(
                                      song.ar.map((a) => a.name).join(",")
                                    )}</td>
                                    <td>${escapeHTML(song.al.name)}</td>
                                    <td>
                                        <button class="download-btn">下载</button>
                                        <button class="upload-btn">上传云盘</button>
                                    </td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            `,
        showCloseButton: true,
        showConfirmButton: false,
        width: "800px",
        didOpen: () => {
          this.bindVIPSongButtons();
        },
      });
    }

    /**
     * 绑定VIP歌曲按钮事件
     */
    bindVIPSongButtons() {
      // 下载按钮
      document.querySelectorAll(".download-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const songId = e.target.closest("tr").dataset.id;
          await this.downloadVIPSong(songId);
        });
      });

      // 上传按钮
      document.querySelectorAll(".upload-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const songId = e.target.closest("tr").dataset.id;
          await this.uploadVIPSong(songId);
        });
      });
    }

    /**
     * 下载VIP歌曲
     */
    async downloadVIPSong(songId) {
      try {
        // 获取歌曲URL
        const urlRes = await new Promise((resolve, reject) => {
          weapiRequest("/api/song/enhance/player/url/v1", {
            data: {
              ids: [songId],
              level: "lossless",
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (!urlRes.data?.[0]?.url) {
          throw new Error("获取音乐URL失败");
        }

        // 获取歌曲信息
        const songRes = await new Promise((resolve, reject) => {
          weapiRequest("/api/v3/song/detail", {
            data: {
              c: JSON.stringify([{ id: songId }]),
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (!songRes.songs?.[0]) {
          throw new Error("获取歌曲信息失败");
        }

        const song = songRes.songs[0];
        const filename = generateFileName(
          song.name,
          getArtistInfo(song),
          "artist-title"
        );

        // 下载文件
        GM_download({
          url: urlRes.data[0].url,
          name: `${filename}.${urlRes.data[0].type.toLowerCase()}`,
          onload: () => {
            showTips("下载成功", "success");
          },
          onerror: (error) => {
            console.error("Download failed:", error);
            showTips("下载失败", "error");
          },
        });
      } catch (error) {
        console.error("Download VIP song failed:", error);
        showTips("下载失败: " + error.message, "error");
      }
    }

    /**
     * 上传VIP歌曲到云盘
     */
    async uploadVIPSong(songId) {
      try {
        // 获取歌曲URL
        const urlRes = await new Promise((resolve, reject) => {
          weapiRequest("/api/song/enhance/player/url/v1", {
            data: {
              ids: [songId],
              level: "lossless",
            },
            onload: resolve,
            onerror: reject,
          });
        });

        if (!urlRes.data?.[0]?.url) {
          throw new Error("获取音乐URL失败");
        }

        // 下载音频文件
        const audioBlob = await this.downloadAudio(urlRes.data[0].url);

        // 获取上传token
        const tokenRes = await this.getUploadToken(songId, audioBlob.size);

        // 上传文件
        await this.uploadFile(audioBlob, tokenRes);

        // 提交文件信息
        await this.submitFileInfo(songId, tokenRes);

        showTips("上传成功", "success");
      } catch (error) {
        console.error("Upload VIP song failed:", error);
        showTips("上传失败: " + error.message, "error");
      }
    }
  }

  // #endregion ================ VIP歌曲下载上传功能 ================
})();
