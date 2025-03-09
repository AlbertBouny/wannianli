// pages/weather/weather.js
Page({
  data: {
    // 当前城市
    currentCity: '北京市',

    // 当前天气情况
    currentWeather: {
      temperature: 26,
      description: '晴',
      iconUrl: '/assets/icons/weather-sunny.svg',
      feelsLike: 24,
      humidity: 40,
      windSpeed: 3,
      pressure: 1013,
      visibility: 16.1,
      windDirection: '东北风'
    },

    // 小时天气预报
    hourlyForecast: [
      { time: '现在', temperature: 26, iconUrl: '/assets/icons/weather-sunny.svg' },
      { time: '16:00', temperature: 27, iconUrl: '/assets/icons/weather-sunny.svg' },
      { time: '17:00', temperature: 26, iconUrl: '/assets/icons/weather-sunny.svg' },
      { time: '18:00', temperature: 25, iconUrl: '/assets/icons/weather-sunny.svg' },
      { time: '19:00', temperature: 23, iconUrl: '/assets/icons/weather-cloudy.svg' },
      { time: '20:00', temperature: 21, iconUrl: '/assets/icons/weather-cloudy.svg' },
      { time: '21:00', temperature: 19, iconUrl: '/assets/icons/weather-cloudy.svg' },
      { time: '22:00', temperature: 18, iconUrl: '/assets/icons/weather-cloudy.svg' },
      { time: '23:00', temperature: 17, iconUrl: '/assets/icons/weather-cloudy.svg' }
    ],

    // 每日天气预报
    dailyForecast: [
      {
        date: '3月9日',
        dayName: '今天',
        lowTemp: 16,
        highTemp: 27,
        iconUrl: '/assets/icons/weather-sunny.svg',
        barWidth: 70,
        barLeft: 20
      },
      {
        date: '3月10日',
        dayName: '周一',
        lowTemp: 17,
        highTemp: 29,
        iconUrl: '/assets/icons/weather-sunny.svg',
        barWidth: 80,
        barLeft: 25
      },
      {
        date: '3月11日',
        dayName: '周二',
        lowTemp: 18,
        highTemp: 30,
        iconUrl: '/assets/icons/weather-sunny.svg',
        barWidth: 85,
        barLeft: 30
      },
      {
        date: '3月12日',
        dayName: '周三',
        lowTemp: 19,
        highTemp: 28,
        iconUrl: '/assets/icons/weather-cloudy.svg',
        barWidth: 75,
        barLeft: 35
      },
      {
        date: '3月13日',
        dayName: '周四',
        lowTemp: 17,
        highTemp: 25,
        iconUrl: '/assets/icons/weather-rainy.svg',
        barWidth: 65,
        barLeft: 25
      },
      {
        date: '3月14日',
        dayName: '周五',
        lowTemp: 16,
        highTemp: 22,
        iconUrl: '/assets/icons/weather-rainy.svg',
        barWidth: 55,
        barLeft: 20
      },
      {
        date: '3月15日',
        dayName: '周六',
        lowTemp: 15,
        highTemp: 24,
        iconUrl: '/assets/icons/weather-cloudy.svg',
        barWidth: 60,
        barLeft: 15
      }
    ],

    // 天气预警
    weatherAlert: {
      title: '高温预警',
      content: '今日最高温度可能达到 30°C，请注意防暑降温，减少户外活动时间，补充水分，避免中暑。',
      level: '黄色',
      time: '2023-07-15 08:30'
    },

    // 空气质量
    airQuality: {
      value: 75,
      level: '良',
      levelClass: 'good',
      description: '空气质量良好，可以正常进行户外活动。',
      recommendation: '敏感人群应减少户外运动',
      pm25: 35,
      pm10: 55,
      so2: 15,
      no2: 30,
      o3: 65,
      co: 0.8
    },

    // 生活指数
    lifeIndices: [
      { name: '紫外线', level: '中等', iconUrl: '/assets/icons/weather-sunny.svg', description: '涂擦SPF大于15、PA+防晒护肤品。' },
      { name: '穿衣', level: '舒适', iconUrl: '/assets/icons/cloth.svg', description: '建议穿薄外套或牛仔裤等服装。' },
      { name: '运动', level: '适宜', iconUrl: '/assets/icons/sport.svg', description: '天气较好，适宜进行各种户外运动。' },
      { name: '感冒', level: '低发', iconUrl: '/assets/icons/cold.svg', description: '各项气象条件适宜，无明显降温过程，发生感冒的几率较低。' },
      { name: '洗车', level: '较适宜', iconUrl: '/assets/icons/car-wash.svg', description: '较适宜洗车，未来一天无雨，风力较小，擦洗一新的汽车至少能保持一天。' },
      { name: '钓鱼', level: '较适宜', iconUrl: '/assets/icons/fishing.svg', description: '较适合垂钓，但风力稍大会对垂钓产生一定的影响。' },
      { name: '旅游', level: '适宜', iconUrl: '/assets/icons/travel.svg', description: '天气较好，但丝毫不会影响您出行的心情。适宜旅游。' },
      { name: '交通', level: '良好', iconUrl: '/assets/icons/traffic.svg', description: '天气较好，交通气象条件良好，车辆可以正常行驶。' }
    ],

    // 上次更新时间
    lastUpdateTime: '今天 10:00',

    // 加载状态
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果有传入城市参数，则使用传入的城市
    if (options && options.city) {
      this.setData({
        currentCity: options.city
      });
    }
    
    // 获取天气数据
    this.getWeatherData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getWeatherData();
    wx.stopPullDownRefresh();
  },

  /**
   * 获取天气数据
   */
  getWeatherData: function () {
    // 显示加载状态
    this.setData({
      loading: true
    });
    
    // 实际应用中应该调用天气API
    // 这里使用模拟数据
    setTimeout(() => {
      // 更新数据获取时间
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeStr = `今天 ${hours}:${minutes}`;
      
      // 随机判断是否显示天气预警
      const showAlert = Math.random() > 0.5;
      
      this.setData({
        lastUpdateTime: timeStr,
        'weatherAlert.time': `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${hours}:${minutes}`,
        weatherAlert: showAlert ? this.data.weatherAlert : null,
        loading: false
      });
    }, 1500);
  },

  /**
   * 选择城市
   */
  selectCity: function () {
    wx.navigateTo({
      url: '/pages/location-select/location-select'
    });
  },

  /**
   * 前往搜索页面
   */
  goToSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search?type=weather'
    });
  },

  /**
   * 显示生活指数详情
   */
  showIndexDetail: function (e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.lifeIndices[index];
    
    wx.showModal({
      title: item.name + '指数 - ' + item.level,
      content: item.description,
      showCancel: false
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.currentCity + '天气：' + this.data.currentWeather.temperature + '°，' + this.data.currentWeather.description,
      path: '/pages/weather/weather?city=' + this.data.currentCity
    };
  }
}) 