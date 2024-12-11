// #region ================ 样式注入 ================

// 注入自定义样式
GM_addStyle(`
    /* 通用样式 */
    .custom-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        background: #ec4141;
        color: white;
    }
    .custom-btn:hover {
        opacity: 0.9;
    }

    /* 上传/下载对话框样式 */
    .upload-dialog,
    .download-dialog {
        max-height: 500px;
        overflow-y: auto;
    }

    .filter-section {
        margin-bottom: 15px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
    }

    /* 进度条样式 */
    .progress-bar {
        width: 100%;
        height: 4px;
        background: #eee;
        border-radius: 2px;
        overflow: hidden;
    }

    #progress {
        height: 100%;
        background: #ec4141;
        transition: width 0.3s;
    }

    /* IP信息样式 */
    .ip-info {
        margin-left: 10px;
        color: #666;
        font-size: 12px;
    }

    /* 深色主题 */
    @media (prefers-color-scheme: dark) {
        .filter-section {
            background: #333;
        }
        .progress-bar {
            background: #333;
        }
    }
`);

// 注入自定义样式
GM_addStyle(`
    /* 通用样式 */
    .custom-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        background: #ec4141;
        color: white;
    }
    .custom-btn:hover {
        opacity: 0.9;
    }

    /* 设置面板样式 */
    .settings-panel {
        display: flex;
        height: 400px;
    }
    .settings-tabs {
        width: 150px;
        border-right: 1px solid #eee;
        padding: 10px 0;
    }
    .settings-content {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }
    .tab-btn {
        display: block;
        width: 100%;
        padding: 10px;
        text-align: left;
        border: none;
        background: none;
        cursor: pointer;
    }
    .tab-btn.active {
        background: #f5f5f5;
        color: #ec4141;
    }
    .tab-content {
        display: none;
    }
    .tab-content.active {
        display: block;
    }
    .setting-item {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
    }
    .setting-item label {
        width: 100px;
        margin-right: 10px;
    }

    /* 上传对话框样式 */
    .upload-dialog {
        max-height: 500px;
        overflow-y: auto;
    }
    .filter-section {
        margin-bottom: 15px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
    }
    .song-list table {
        width: 100%;
        border-collapse: collapse;
    }
    .song-list th, .song-list td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }
    .song-list tr:hover {
        background: #f5f5f5;
    }

    /* 云盘管理样式 */
    .cloud-manager {
        max-height: 600px;
        overflow-y: auto;
    }
    .toolbar {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
    }
    .search-box {
        display: flex;
        gap: 10px;
    }
    .actions {
        display: flex;
        gap: 10px;
    }

    /* IP信息样式 */
    .ip-info {
        margin-left: 10px;
        color: #666;
        font-size: 12px;
    }
    .ip-selector {
        margin: 10px 0;
    }

    /* 进度条样式 */
    .progress-bar {
        width: 100%;
        height: 4px;
        background: #eee;
        border-radius: 2px;
        overflow: hidden;
    }
    #progress-inner {
        height: 100%;
        background: #ec4141;
        transition: width 0.3s;
    }

    /* 深色主题 */
    @media (prefers-color-scheme: dark) {
        .tab-btn.active {
            background: #333;
        }
        .filter-section, .toolbar {
            background: #333;
        }
        .song-list tr:hover {
            background: #333;
        }
        .progress-bar {
            background: #333;
        }
    }
`);

// #endregion ================ 样式注入 ================
