// 黄历设置页面 JavaScript
const app = getApp()

Page({
  data: {
    // 黄历设置
    almanacSettings: {
      showGoodBad: true,      // 显示宜忌
      showDirection: true,    // 显示方位
      showHourDetail: false,  // 显示时辰详情
      showStars: true,        // 显示吉神凶煞
      showTheme: 'default',   // 显示主题 default/traditional/simple
      reminderTime: '08:00',  // 提醒时间
      enableReminder: true    // 启用提醒
    },
    
    // 主题选项
    themeOptions: [
      { id: 'default', name: '默认主题' },
      { id: 'traditional', name: '传统主题' },
      { id: 'simple', name: '简约主题' }
    ],
    
    // 当前主题索引
    themeIndex: 0,
    
    // 当前主题名称
    currentThemeName: '默认主题'
  },

  onLoad: function () {
    // 加载保存的设置
    this.loadAlmanacSettings();
  },
  
  // 加载黄历设置
  loadAlmanacSettings: function() {
    const savedSettings = wx.getStorageSync('almanacSettings');
    if (savedSettings) {
      // 更新设置
      this.setData({
        almanacSettings: savedSettings
      });
      
      // 更新主题相关数据
      this.updateThemeData();
    }
  },
  
  // 更新主题相关数据
  updateThemeData: function() {
    const showTheme = this.data.almanacSettings.showTheme;
    const themeOptions = this.data.themeOptions;
    
    // 查找主题索引
    let themeIndex = 0;
    for (let i = 0; i < themeOptions.length; i++) {
      if (themeOptions[i].id === showTheme) {
        themeIndex = i;
        break;
      }
    }
    
    // 查找主题名称
    let currentThemeName = themeOptions[themeIndex].name;
    
    this.setData({
      themeIndex: themeIndex,
      currentThemeName: currentThemeName
    });
  },
  
  // 保存设置
  saveSettings: function() {
    wx.setStorageSync('almanacSettings', this.data.almanacSettings);
    wx.showToast({
      title: '设置已保存',
      icon: 'success',
      duration: 2000
    });
  },
  
  // 切换开关设置
  toggleSetting: function(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    const settingKey = `almanacSettings.${key}`;
    
    this.setData({
      [settingKey]: value
    });
    
    // 保存设置
    this.saveSettings();
  },
  
  // 更改主题
  changeTheme: function(e) {
    const value = e.detail.value;
    const themes = this.data.themeOptions;
    
    this.setData({
      'almanacSettings.showTheme': themes[value].id,
      themeIndex: value,
      currentThemeName: themes[value].name
    });
    
    // 保存设置
    this.saveSettings();
  },
  
  // 更改提醒时间
  changeReminderTime: function(e) {
    const time = e.detail.value;
    
    this.setData({
      'almanacSettings.reminderTime': time
    });
    
    // 保存设置
    this.saveSettings();
  },
  
  // 重置设置
  resetSettings: function() {
    wx.showModal({
      title: '重置设置',
      content: '确定要恢复默认设置吗？',
      success: (res) => {
        if (res.confirm) {
          const defaultSettings = {
            showGoodBad: true,
            showDirection: true,
            showHourDetail: false,
            showStars: true,
            showTheme: 'default',
            reminderTime: '08:00',
            enableReminder: true
          };
          
          this.setData({
            almanacSettings: defaultSettings,
            themeIndex: 0,
            currentThemeName: this.data.themeOptions[0].name
          });
          
          // 保存设置
          this.saveSettings();
        }
      }
    });
  }
}) 