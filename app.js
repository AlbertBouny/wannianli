// app.js
App({
  // 小程序启动时执行的生命周期函数
  onLaunch: function() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功', res.code)
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取系统信息 - 使用新的API替代已弃用的getSystemInfoSync
    try {
      // 获取设备信息
      const deviceInfo = wx.getDeviceInfo()
      // 获取窗口信息
      const windowInfo = wx.getWindowInfo()
      // 获取应用基础信息
      const appBaseInfo = wx.getAppBaseInfo()
      
      // 合并所有信息到systemInfo对象
      this.globalData.systemInfo = {
        ...deviceInfo,
        ...windowInfo,
        ...appBaseInfo
      }
    } catch (e) {
      console.error('获取系统信息失败', e)
    }
    
    // 初始化日期数据
    this.initDateData()
  },

  // 初始化日期相关数据
  initDateData: function() {
    const now = new Date()
    this.globalData.currentDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      timestamp: now.getTime()
    }
  },

  // 全局数据
  globalData: {
    userInfo: null,
    systemInfo: null,
    currentDate: null,
    theme: {
      primaryColor: "#e63946",
      backgroundColor: "#f8f9fa"
    },
    hasLogin: false,
    isVip: false,
    defaultCity: null
  }
}) 