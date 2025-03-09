// 设置页面
const app = getApp()

Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: '/assets/icons/default-avatar.png',
      nickName: '游客',
      isLogin: false
    },
    
    // 会员信息
    vipInfo: {
      isVip: false,
      level: 0,  // 0: 非会员, 1: 初级会员, 2: 高级会员
      expireDate: ''
    },
    
    // 应用设置
    appSettings: {
      theme: 'default', // default, dark, light
      notification: true,
      calendar: {
        defaultView: 'month', // month, week, day
        firstDayOfWeek: 0, // 0表示周日，1表示周一
        showLunar: true,
        showHoliday: true
      },
      weather: {
        autoLocation: true,
        temperatureUnit: 'celsius', // celsius, fahrenheit
        defaultCity: ''
      },
      almanac: {
        showDetail: true,
        showSuitableAvoid: true,
        showHourInfo: true
      }
    },
    
    // 设置列表
    settingsList: [
      {
        id: 'account',
        title: '账号设置',
        items: [
          { id: 'profile', title: '个人资料', icon: 'user', arrow: true, url: '/pages/profile/profile' },
          { id: 'vip', title: '会员服务', icon: 'vip', arrow: true, tag: '普通用户', url: '/pages/vip/vip' },
          { id: 'login', title: '登录/注册', icon: 'login', arrow: true, hidden: false, url: '/pages/login/login' }
        ]
      },
      {
        id: 'common',
        title: '通用设置',
        items: [
          { id: 'theme', title: '主题设置', icon: 'theme', arrow: true, url: '/pages/theme/theme' },
          { id: 'notification', title: '消息通知', icon: 'notification', switch: true, value: true },
          { id: 'language', title: '语言', icon: 'language', arrow: true, value: '简体中文', options: ['简体中文', '繁體中文', 'English'] }
        ]
      },
      {
        id: 'features',
        title: '功能设置',
        items: [
          { id: 'calendar', title: '日历设置', icon: 'calendar', arrow: true, url: '/pages/calendar-settings/calendar-settings' },
          { id: 'weather', title: '天气设置', icon: 'weather', arrow: true, url: '/pages/weather-settings/weather-settings' },
          { id: 'almanac', title: '黄历设置', icon: 'almanac', arrow: true, url: '/pages/almanac-settings/almanac-settings' }
        ]
      },
      {
        id: 'other',
        title: '其他',
        items: [
          { id: 'feedback', title: '意见反馈', icon: 'feedback', arrow: true, url: '/pages/feedback/feedback' },
          { id: 'about', title: '关于我们', icon: 'about', arrow: true, url: '/pages/about/about' },
          { id: 'cache', title: '清除缓存', icon: 'clear', arrow: true, tag: '12.5MB' }
        ]
      }
    ],
    
    // 缓存大小
    cacheSize: '0KB'
  },
  
  onLoad: function() {
    // 获取用户信息
    this.getUserInfo();
    // 获取缓存大小
    this.getCacheSize();
  },
  
  onShow: function() {
    // 每次显示页面时刷新用户信息和设置
    this.getUserInfo();
    this.getSettings();
  },
  
  // 获取用户信息
  getUserInfo: function() {
    const userInfo = app.globalData.userInfo;
    const isLogin = app.globalData.hasLogin;
    const isVip = app.globalData.isVip;
    
    // 更新登录状态和会员信息
    if (isLogin && userInfo) {
      this.setData({
        'userInfo.avatarUrl': userInfo.avatarUrl,
        'userInfo.nickName': userInfo.nickName,
        'userInfo.isLogin': true,
        'settingsList[0].items[2].hidden': true, // 隐藏登录按钮
        'vipInfo.isVip': isVip,
        'vipInfo.level': isVip ? 1 : 0,
        'vipInfo.expireDate': isVip ? '2023-12-31' : '',
        'settingsList[0].items[1].tag': isVip ? 'VIP会员' : '普通用户'
      });
    } else {
      this.setData({
        'userInfo.avatarUrl': '/assets/icons/default-avatar.png',
        'userInfo.nickName': '游客',
        'userInfo.isLogin': false,
        'settingsList[0].items[2].hidden': false, // 显示登录按钮
        'vipInfo.isVip': false,
        'vipInfo.level': 0,
        'vipInfo.expireDate': '',
        'settingsList[0].items[1].tag': '普通用户'
      });
    }
  },
  
  // 获取应用设置
  getSettings: function() {
    // 尝试从本地存储获取设置
    const settings = wx.getStorageSync('appSettings');
    if (settings) {
      this.setData({
        appSettings: settings,
        'settingsList[1].items[1].value': settings.notification
      });
    }
  },
  
  // 获取缓存大小
  getCacheSize: function() {
    // 小程序没有直接获取缓存大小的API
    // 这里模拟一个缓存大小
    const cacheSize = '12.5MB';
    this.setData({
      cacheSize: cacheSize,
      'settingsList[3].items[2].tag': cacheSize
    });
  },
  
  // 清除缓存
  clearCache: function() {
    wx.showLoading({
      title: '清除中...',
    });
    
    // 模拟清除缓存过程
    setTimeout(() => {
      // 实际应用中可以使用 wx.removeStorage() 清除特定的存储项
      // 或使用 wx.clearStorage() 清除所有本地缓存
      
      this.setData({
        cacheSize: '0KB',
        'settingsList[3].items[2].tag': '0KB'
      });
      
      wx.hideLoading();
      wx.showToast({
        title: '清除成功',
        icon: 'success',
        duration: 2000
      });
    }, 1000);
  },
  
  // 切换设置开关
  toggleSwitch: function(e) {
    const id = e.currentTarget.dataset.id;
    const value = e.detail.value;
    
    // 根据不同的设置ID处理不同的逻辑
    if (id === 'notification') {
      this.setData({
        'appSettings.notification': value,
        'settingsList[1].items[1].value': value
      });
      
      // 保存设置
      this.saveSettings();
    }
  },
  
  // 保存设置到本地存储
  saveSettings: function() {
    wx.setStorageSync('appSettings', this.data.appSettings);
  },
  
  // 切换语言
  changeLanguage: function() {
    const languages = this.data.settingsList[1].items[2].options;
    const currentLanguage = this.data.settingsList[1].items[2].value;
    
    wx.showActionSheet({
      itemList: languages,
      success: (res) => {
        const selectedLanguage = languages[res.tapIndex];
        if (selectedLanguage !== currentLanguage) {
          this.setData({
            'settingsList[1].items[2].value': selectedLanguage
          });
          
          wx.showToast({
            title: '语言已切换',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  },
  
  // 处理设置项点击
  onItemTap: function(e) {
    const id = e.currentTarget.dataset.id;
    const item = e.currentTarget.dataset.item;
    
    // 根据不同的设置项处理不同的逻辑
    switch (id) {
      case 'login':
        if (!this.data.userInfo.isLogin) {
          this.navigateToLogin();
        }
        break;
      case 'cache':
        this.clearCache();
        break;
      case 'language':
        this.changeLanguage();
        break;
      default:
        if (item.url) {
          wx.navigateTo({
            url: item.url
          });
        }
    }
  },
  
  // 跳转到登录页面
  navigateToLogin: function() {
    // 如果用户未登录，跳转到登录页面
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
}); 