Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#e63946",
    list: [
      {
        pagePath: "/pages/home/home",
        iconPath: "./icons/日历.png",
        selectedIconPath: "./icons/日历 (1).png",
        text: "日历"
      },
      {
        pagePath: "/pages/almanac/almanac",
        iconPath: "./icons/黄历2 (1).png",
        selectedIconPath: "./icons/黄历2.png",
        text: "黄历"
      },
      {
        pagePath: "/pages/weather/weather",
        iconPath: "./icons/天气.png",
        selectedIconPath: "./icons/天气 (1).png",
        text: "天气"
      },
      {
        pagePath: "/pages/settings/settings",
        iconPath: "./icons/我的.png",
        selectedIconPath: "./icons/我的 (1).png",
        text: "我的"
      }
    ]
  },
  attached() {
    // 初始化时设置选中项，默认为0（首页）
    let selected = 0;
    try {
      selected = this.getTabBarIndex();
    } catch (error) {
      console.log('初始化tabBar选中项出错，使用默认值', error);
    }
    this.setData({ selected });
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    },
    getTabBarIndex() {
      const pages = getCurrentPages();
      // 添加安全检查
      if (!pages || pages.length === 0) {
        return 0;
      }
      
      const currentPage = pages[pages.length - 1];
      if (!currentPage || !currentPage.route) {
        return 0;
      }
      
      const url = `/${currentPage.route}`;
      
      for(let i = 0; i < this.data.list.length; i++) {
        if(this.data.list[i].pagePath === url) {
          return i;
        }
      }
      return 0;
    }
  }
}) 