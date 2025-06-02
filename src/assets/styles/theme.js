// 网易云音乐主题配置
const theme = {
  // 品牌色
  token: {
    // 主色
    colorPrimary: '#C20C0C', // 网易云特征红色
    colorPrimaryHover: '#D81E06',
    colorPrimaryActive: '#A00606',

    // 文字颜色
    colorText: '#333333',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    colorTextDescription: '#666666',

    // 背景色
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F5F5F5',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',

    // 边框颜色
    colorBorder: '#E1E1E1',
    colorBorderSecondary: '#F0F0F0',

    // 链接颜色
    colorLink: '#0C73C2',
    colorLinkHover: '#2994E7',
    colorLinkActive: '#095C9C',

    // 成功、警告、错误状态色
    colorSuccess: '#52C41A',
    colorWarning: '#FAAD14',
    colorError: '#FF4D4F',

    // 字体
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
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
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },

  // 组件级别的样式定制
  components: {
    Button: {
      colorPrimary: '#C20C0C',
      algorithm: true, // 启用算法
    },
    Input: {
      colorBorder: '#E1E1E1',
      algorithm: true,
    },
    Table: {},
  },
};

export default theme;
