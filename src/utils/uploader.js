/**
 * 上传管理器类
 */
export class Uploader {
  /**
   * @param {Object} config 上传配置
   * @param {boolean} showAll 是否显示所有歌曲
   */
  constructor(config, showAll = false) {
    this.songs = [];
    this.config = config;

    // 过滤器配置
    this.filter = {
      text: "",
      noCopyright: true,
      vip: true,
      pay: true,
      lossless: false,
      all: showAll,
      songIndexs: [],
    };

    // 分页配置
    this.page = {
      current: 1,
      max: 1,
      limitCount: 50,
    };

    // 批量上传配置
    this.batchUpload = {
      threadMax: 2,
      threadCount: 2,
      working: false,
      finnishThread: 0,
      songIndexs: [],
    };
  }

  /**
   * 开始上传流程
   */
  async start() {
    // 显示上传对话框
    const result = await Swal.fire({
      title: "云盘上传",
      html: this.createUploadDialog(),
      showCancelButton: true,
      confirmButtonText: "开始上传",
      cancelButtonText: "关闭",
      width: "800px",
      didOpen: () => this.onDialogOpen(),
    });

    if (result.isConfirmed) {
      await this.startUpload();
    }
  }

  /**
   * 创建上传对话框HTML
   */
  createUploadDialog() {
    return `
                <div class="upload-dialog">
                    <div class="filter-section">
                        <input type="text" placeholder="搜索歌曲..." id="search-input">
                        <div class="filter-options">
                            <label><input type="checkbox" id="filter-copyright"> 包含无版权歌曲</label>
                            <label><input type="checkbox" id="filter-vip"> 包含VIP歌曲</label>
                            <label><input type="checkbox" id="filter-pay"> 包含付费歌曲</label>
                            <label><input type="checkbox" id="filter-lossless"> 仅无损音质</label>
                        </div>
                    </div>
                    <div class="song-list">
                        <table id="song-table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="select-all"></th>
                                    <th>歌曲名</th>
                                    <th>艺术家</th>
                                    <th>专辑</th>
                                    <th>音质</th>
                                    <th>状态</th>
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
    // 绑定事件处理
    this.bindEvents();

    // 获取歌曲信息
    await this.fetchSongInfo();

    // 渲染数据
    this.renderData();
  }

  /**
   * 绑定事件处理
   */
  bindEvents() {
    // 搜索输入框
    document.getElementById("search-input").addEventListener("input", (e) => {
      this.filter.text = e.target.value;
      this.renderData();
    });

    // 过滤选项
    document
      .getElementById("filter-copyright")
      .addEventListener("change", (e) => {
        this.filter.noCopyright = e.target.checked;
        this.renderData();
      });
    // ... 其他过滤选项事件绑定 ...

    // 分页按钮
    document.getElementById("prev-page").addEventListener("click", () => {
      if (this.page.current > 1) {
        this.page.current--;
        this.renderData();
      }
    });

    document.getElementById("next-page").addEventListener("click", () => {
      if (this.page.current < this.page.max) {
        this.page.current++;
        this.renderData();
      }
    });
  }

  /**
   * 获取歌曲信息
   */
  async fetchSongInfo() {
    try {
      const response = await new Promise((resolve, reject) => {
        weapiRequest("/api/v1/playlist/detail", {
          data: { id: this.config.playlistId },
          onload: resolve,
          onerror: reject,
        });
      });

      if (response.code === 200) {
        this.songs = response.playlist.tracks;
        this.page.max = Math.ceil(this.songs.length / this.page.limitCount);
      }
    } catch (error) {
      showTip("获取歌曲信息失败", "error");
    }
  }

  /**
   * 渲染歌曲列表
   */
  renderData() {
    const tbody = document.querySelector("#song-table tbody");
    tbody.innerHTML = "";

    // 应用过滤和分页
    const filteredSongs = this.filterSongs();
    const startIndex = (this.page.current - 1) * this.page.limitCount;
    const endIndex = Math.min(
      startIndex + this.page.limitCount,
      filteredSongs.length
    );

    // 渲染当前页的歌曲
    for (let i = startIndex; i < endIndex; i++) {
      const song = filteredSongs[i];
      const tr = document.createElement("tr");
      tr.innerHTML = `
                    <td><input type="checkbox" data-index="${i}"></td>
                    <td>${escapeHTML(song.name)}</td>
                    <td>${escapeHTML(getArtistInfo(song))}</td>
                    <td>${escapeHTML(getAlbumInfo(song))}</td>
                    <td>${getQualityDesc(song.quality)}</td>
                    <td class="status">待上传</td>
                `;
      tbody.appendChild(tr);
    }

    // 更新分页信息
    document.getElementById(
      "page-info"
    ).textContent = `${this.page.current}/${this.page.max}页 共${filteredSongs.length}首`;
  }

  /**
   * 过滤歌曲
   */
  filterSongs() {
    return this.songs.filter((song) => {
      if (!this.filter.all) {
        if (!this.filter.noCopyright && !song.copyright) return false;
        if (!this.filter.vip && song.fee === 1) return false;
        if (!this.filter.pay && song.fee === 4) return false;
        if (this.filter.lossless && song.quality !== "lossless") return false;
      }

      if (this.filter.text) {
        const searchText = this.filter.text.toLowerCase();
        const songName = song.name.toLowerCase();
        const artistName = getArtistInfo(song).toLowerCase();
        const albumName = getAlbumInfo(song).toLowerCase();

        return (
          songName.includes(searchText) ||
          artistName.includes(searchText) ||
          albumName.includes(searchText)
        );
      }

      return true;
    });
  }

  /**
   * 开始上传选中的歌曲
   */
  async startUpload() {
    const selectedIndexes = Array.from(
      document.querySelectorAll('#song-table input[type="checkbox"]:checked')
    ).map((checkbox) => parseInt(checkbox.dataset.index));

    if (selectedIndexes.length === 0) {
      showTip("请选择要上传的歌曲", "warning");
      return;
    }

    this.batchUpload.songIndexs = selectedIndexes;
    this.batchUpload.working = true;
    this.batchUpload.finnishThread = 0;

    // 创建上传线程
    for (let i = 0; i < this.batchUpload.threadCount; i++) {
      this.uploadThread(i);
    }
  }

  /**
   * 上传线程
   */
  async uploadThread(threadIndex) {
    while (this.batchUpload.working && this.batchUpload.songIndexs.length > 0) {
      const songIndex = this.batchUpload.songIndexs.shift();
      if (songIndex === undefined) break;

      try {
        await this.uploadSong(songIndex);
      } catch (error) {
        console.error("Upload failed:", error);
        this.updateSongStatus(songIndex, "上传失败", "error");
      }
    }

    this.batchUpload.finnishThread++;
    if (this.batchUpload.finnishThread === this.batchUpload.threadCount) {
      this.batchUpload.working = false;
      showTip("批���上传完成", "success");
    }
  }

  /**
   * 上传单首歌曲
   */
  async uploadSong(songIndex) {
    const song = this.songs[songIndex];
    this.updateSongStatus(songIndex, "正在上传...", "info");

    // 获取音乐URL
    const urlRes = await new Promise((resolve, reject) => {
      weapiRequest("/api/song/enhance/player/url/v1", {
        data: {
          ids: [song.id],
          level: this.config.level || "standard",
        },
        onload: resolve,
        onerror: reject,
      });
    });

    if (!urlRes.data?.[0]?.url) {
      throw new Error("获取音乐URL失败");
    }

    // 上传到云盘
    const uploadRes = await this.uploadToCloud(song, urlRes.data[0].url);

    // 匹配云盘歌曲
    await this.matchCloudSong(song, uploadRes.songId);

    this.updateSongStatus(songIndex, "上传成功", "success");
  }

  /**
   * 更新歌曲状态显示
   */
  updateSongStatus(songIndex, status, type = "info") {
    const statusCell = document.querySelector(
      `#song-table tr:nth-child(${songIndex + 1}) .status`
    );
    if (statusCell) {
      statusCell.textContent = status;
      statusCell.className = `status ${type}`;
    }
  }

  // ... 更多上传相关方法 ...
}
