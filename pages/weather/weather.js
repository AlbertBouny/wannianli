// Weather page JavaScript
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    // 当前城市信息
    currentCity: {
      id: '101010100',
      name: '北京',
      isLocating: false,
      locationFailed: false
    },
    
    // 城市列表
    cities: [
      { id: '101010100', name: '北京', isDefault: true, isLocationBased: true },
      { id: '101020100', name: '上海', isDefault: false, isLocationBased: false },
      { id: '101280101', name: '广州', isDefault: false, isLocationBased: false }
    ],
    
    // 实时天气数据
    currentWeather: {
      temperature: 25,
      condition: '晴',
      conditionIcon: '/assets/icons/weather/sunny.png',
      feelsLike: 27,
      humidity: 40,
      wind: '东北风3级',
      updateTime: '10:00'
    },
    
    // 空气质量指数
    airQuality: {
      aqi: 75,
      level: '良',
      pm25: 35,
      pm10: 55,
      no2: 30,
      so2: 15,
      o3: 65,
      co: 0.8
    },
    
    // 天气预警
    weatherAlerts: [
      {
        type: '高温预警',
        level: '橙色',
        content: '预计未来24小时内最高气温将升至37℃以上，请注意防暑降温。',
        pubTime: '2023-07-15 08:30'
      }
    ],
    
    // 24小时预报
    hourlyForecast: [],
    
    // 7天预报
    dailyForecast: [],
    
    // 页面状态
    loading: true,
    refreshing: false
  },

  onLoad: function (options) {
    // 初始化页面数据
    this.initForecastData()
    this.loadWeatherData()
  },
  
  onPullDownRefresh: function () {
    this.setData({
      refreshing: true
    })
    this.loadWeatherData()
    wx.stopPullDownRefresh()
  },
  
  // 初始化预报数据
  initForecastData: function () {
    // 生成24小时预报模拟数据
    const hourlyData = []
    const now = new Date()
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now)
      hour.setHours(hour.getHours() + i)
      
      hourlyData.push({
        time: hour.getHours() + ':00',
        temperature: Math.round(20 + Math.random() * 10),
        condition: this.getRandomCondition(),
        conditionIcon: this.getRandomWeatherIcon()
      })
    }
    
    // 生成7天预报模拟数据
    const dailyData = []
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    for (let i = 0; i < 7; i++) {
      const day = new Date(now)
      day.setDate(day.getDate() + i)
      
      dailyData.push({
        date: util.formatDate(day),
        weekday: weekdays[day.getDay()],
        tempHigh: Math.round(25 + Math.random() * 5),
        tempLow: Math.round(18 + Math.random() * 5),
        condition: this.getRandomCondition(),
        conditionIcon: this.getRandomWeatherIcon()
      })
    }
    
    this.setData({
      hourlyForecast: hourlyData,
      dailyForecast: dailyData
    })
  },
  
  // 加载天气数据
  loadWeatherData: function () {
    // 这里应该调用实际的天气API
    // 模拟API请求延迟
    setTimeout(() => {
      this.setData({
        loading: false,
        refreshing: false
      })
    }, 1000)
  },
  
  // 生成随机天气状况（模拟数据）
  getRandomCondition: function () {
    const conditions = ['晴', '多云', '阴', '小雨', '中雨', '大雨']
    return conditions[Math.floor(Math.random() * conditions.length)]
  },
  
  // 生成随机天气图标（模拟数据）
  getRandomWeatherIcon: function () {
    const icons = [
      '/assets/icons/weather/sunny.png',
      '/assets/icons/weather/cloudy.png',
      '/assets/icons/weather/overcast.png',
      '/assets/icons/weather/light-rain.png',
      '/assets/icons/weather/moderate-rain.png',
      '/assets/icons/weather/heavy-rain.png'
    ]
    return icons[Math.floor(Math.random() * icons.length)]
  },
  
  // 切换城市
  switchCity: function () {
    wx.navigateTo({
      url: '/pages/location-select/location-select'
    })
  },
  
  // 刷新定位
  refreshLocation: function () {
    this.setData({
      'currentCity.isLocating': true,
      'currentCity.locationFailed': false
    })
    
    // 模拟定位过程
    setTimeout(() => {
      // 模拟定位成功
      this.setData({
        'currentCity.isLocating': false,
        'currentCity.locationFailed': false
      })
      this.loadWeatherData()
    }, 1500)
  },
  
  // 显示天气预警详情
  showAlertDetail: function (e) {
    const index = e.currentTarget.dataset.index
    const alert = this.data.weatherAlerts[index]
    
    wx.showModal({
      title: alert.type + ' ' + alert.level,
      content: alert.content,
      showCancel: false
    })
  },
  
  // 展开/收起每日天气详情
  toggleDailyDetail: function (e) {
    const index = e.currentTarget.dataset.index
    const key = `dailyForecast[${index}].showDetail`
    this.setData({
      [key]: !this.data.dailyForecast[index].showDetail
    })
  },

  // 添加 onShow 方法
  onShow: function() {
    // 更新自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2  // 天气是第三个tab，索引为2
      });
    }
  }
}) 