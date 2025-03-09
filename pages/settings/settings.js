// 设置页 JavaScript
const app = getApp()

Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: '/assets/icons/default-avatar.png',
      nickName: '未登录',
      isLogin: false
    },
    
    // 是否是会员
    isVIP: false,
    
    // 应用设置
    settings: {
      // 主题设置
      theme: {
        isDarkMode: false,
        colorScheme: 'red' // red, blue, green, purple
      },
      
      // 通知设置
      notification: {
        allowPush: true,
        allowVibrate: true,
        allowSound: true,
        scheduleReminder: true,
        festivalReminder: true,
        weatherAlert: true
      },
      
      // 日历设置
      calendar: {
        showLunar: true,
        showHoliday: true,
        showWeekend: true,
        firstDayMonday: false,
        defaultView: 'month' // month, week, agenda
      },
      
      // 天气设置
      weather: {
        autoLocation: true,
        temperatureUnit: 'celsius', // celsius, fahrenheit
        showAirQuality: true
      },
      
      // 黄历设置
      almanac: {
        showGoodBad: true,
        showDirection: true,
        showHourDetail: false
      }
    },
    
    // 设置列表
    settingsList: [
      { 
        id: 'account',
        title: '账号与安全',
        icon: '/assets/icons/settings/account.png',
        items: [
          { id: 'profile', title: '个人资料', type: 'navigator', url: '/pages/settings/profile/profile' },
          { id: 'security', title: '账号安全', type: 'navigator', url: '/pages/settings/security/security' },
          { id: 'vip', title: '会员中心', type: 'navigator', url: '/pages/settings/vip/vip' }
        ] 
      },
      { 
        id: 'common',
        title: '通用设置',
        icon: '/assets/icons/settings/common.png',
        items: [
          { id: 'theme', title: '主题设置', type: 'navigator', url: '/pages/settings/theme/theme' },
          { id: 'notification', title: '消息通知', type: 'navigator', url: '/pages/settings/notification/notification' },
          { id: 'language', title: '语言', type: 'picker', options: ['简体中文', '繁体中文', 'English'], current: 0 }
        ] 
      },
      { 
        id: 'features',
        title: '功能设置',
        icon: '/assets/icons/settings/features.png',
        items: [
          { id: 'calendar', title: '日历设置', type: 'navigator', url: '/pages/settings/calendar/calendar' },
          { id: 'weather', title: '天气设置', type: 'navigator', url: '/pages/settings/weather/weather' },
          { id: 'almanac', title: '黄历设置', type: 'navigator', url: '/pages/settings/almanac/almanac' }
        ] 
      },
      { 
        id: 'other',
        title: '其他',
        icon: '/assets/icons/settings/other.png',
        items: [
          { id: 'about', title: '关于我们', type: 'navigator', url: '/pages/settings/about/about' },
          { id: 'feedback', title: '意见反馈', type: 'navigator', url: '/pages/settings/feedback/feedback' },
          { id: 'privacy', title: '隐私政策', type: 'navigator', url: '/pages/settings/privacy/privacy' },
          { id: 'terms', title: '服务条款', type: 'navigator', url: '/pages/settings/terms/terms' },
          { id: 'clear', title: '清除缓存', type: 'button', action: 'clearCache' }
        ] 
      }
    ],
    
    // 缓存大小
    cacheSize: '0KB'
  },

  onLoad: function () {
    // 获取用户信息
    this.getUserInfo();
    
    // 获取缓存大小
    this.getCacheSize();
  },
  
  onShow: function () {
    // 页面显示时更新用户信息和设置
    this.getUserInfo();
    this.getSettings();
    
    // 更新自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3  // 设置是第四个tab，索引为3
      });
    }
  },
  
  // 获取用户信息
  getUserInfo: function() {
    // 这里应该是登录逻辑，现在先用模拟数据
    const isLogin = true; // 模拟用户已登录
    
    if (isLogin) {
      this.setData({
        'userInfo.avatarUrl': 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqCebzaSoDUfYqDu7PQoRicJrPL5S11Piao3oZGFJIAFU6OSfU3KRnicicZ3mVaPgQGwQvDHK5E9OXXBg/132',
        'userInfo.nickName': '万年历用户',
        'userInfo.isLogin': true,
        'isVIP': true // 模拟是VIP用户
      });
    }
  },
  
  // 获取设置信息
  getSettings: function() {
    // 这里应该从本地存储或API获取设置，现在使用模拟数据
    // wx.getStorageSync('appSettings');
  },
  
  // 获取缓存大小
  getCacheSize: function() {
    // 这里应该获取实际缓存大小，现在使用模拟数据
    this.setData({
      cacheSize: '12.5MB'
    });
  },
  
  // 清除缓存
  clearCache: function() {
    wx.showLoading({
      title: '正在清理...',
    });
    
    // 这里应该实际清除缓存
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        cacheSize: '0KB'
      });
      
      wx.showToast({
        title: '清理完成',
        icon: 'success'
      });
    }, 1500);
  },
  
  // 修改设置
  changeSetting: function(e) {
    const { type, id } = e.currentTarget.dataset;
    
    if (type === 'switch') {
      const value = e.detail.value;
      const path = `settings.${id}`;
      
      this.setData({
        [path]: value
      });
      
      // 保存设置到本地存储或API
      // wx.setStorageSync('appSettings', this.data.settings);
    }
  },
  
  // 修改语言设置
  changeLanguage: function(e) {
    const index = e.detail.value;
    const languages = ['简体中文', '繁体中文', 'English'];
    
    wx.showToast({
      title: `已切换到${languages[index]}`,
      icon: 'success'
    });
    
    // 更新设置列表中的语言选择
    const settingsList = this.data.settingsList;
    const commonIndex = settingsList.findIndex(group => group.id === 'common');
    
    if (commonIndex !== -1) {
      const languageIndex = settingsList[commonIndex].items.findIndex(item => item.id === 'language');
      
      if (languageIndex !== -1) {
        settingsList[commonIndex].items[languageIndex].current = index;
        
        this.setData({
          settingsList: settingsList
        });
      }
    }
  },
  
  // 跳转到登录页
  goToLogin: function() {
    if (!this.data.userInfo.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },
  
  // 处理设置项点击
  handleItemClick: function(e) {
    const { type, id, url, action } = e.currentTarget.dataset;
    
    if (type === 'navigator' && url) {
      wx.navigateTo({
        url: url
      });
    } else if (type === 'button' && action) {
      if (action === 'clearCache') {
        this.clearCache();
      }
    }
  }
}) 