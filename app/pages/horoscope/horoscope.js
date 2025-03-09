// pages/horoscope/horoscope.js
Page({
  data: {
    // 选中的星座信息
    selectedZodiac: {
      name: '白羊座',
      icon: 'aries',
      date: '3月21日-4月19日'
    },
    
    // 运势类型和日期
    fortuneType: 'today',  // today, tomorrow, week, month, year
    fortuneDate: '2023年3月9日',
    
    // 运势数据
    fortune: {
      overallRating: 4,  // 1-5星
      love: 85,          // 百分比
      career: 70,        // 百分比
      wealth: 65,        // 百分比
      health: 90,        // 百分比
      luckyColor: {
        name: '红色',
        hexCode: '#e63946'
      },
      luckyNumber: '6',
      luckyDirection: '东南',
      luckyTime: '14:00-16:00',
      analysis: '今天的整体运势相当不错。太阳与水星相位良好，给你带来清晰的思考和良好的沟通能力。工作上有望得到领导赏识，财运也相对平稳。爱情方面桃花运旺盛，单身者有望遇到心仪对象。',
      suggestion: '建议今天主动表达自己的想法，多与人沟通交流。工作上可以大胆提出创新点子。感情方面适合告白或约会。身体方面注意多补充水分，避免过度劳累。'
    },
    
    // 星座选择器状态
    showZodiacList: false,
    
    // 最近使用的星座
    recentZodiacs: [
      {
        name: '白羊座',
        icon: 'aries',
        date: '3月21日-4月19日'
      },
      {
        name: '双子座',
        icon: 'gemini',
        date: '5月21日-6月21日'
      },
      {
        name: '天秤座',
        icon: 'libra',
        date: '9月23日-10月23日'
      }
    ],
    
    // 所有星座
    allZodiacs: [
      { name: '白羊座', icon: 'aries', date: '3月21日-4月19日' },
      { name: '金牛座', icon: 'taurus', date: '4月20日-5月20日' },
      { name: '双子座', icon: 'gemini', date: '5月21日-6月21日' },
      { name: '巨蟹座', icon: 'cancer', date: '6月22日-7月22日' },
      { name: '狮子座', icon: 'leo', date: '7月23日-8月22日' },
      { name: '处女座', icon: 'virgo', date: '8月23日-9月22日' },
      { name: '天秤座', icon: 'libra', date: '9月23日-10月23日' },
      { name: '天蝎座', icon: 'scorpio', date: '10月24日-11月22日' },
      { name: '射手座', icon: 'sagittarius', date: '11月23日-12月21日' },
      { name: '摩羯座', icon: 'capricorn', date: '12月22日-1月19日' },
      { name: '水瓶座', icon: 'aquarius', date: '1月20日-2月18日' },
      { name: '双鱼座', icon: 'pisces', date: '2月19日-3月20日' }
    ],
    
    // 加载状态
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果有传入参数，加载指定星座
    if (options && options.zodiac) {
      this.loadZodiacFortune(options.zodiac);
    } else {
      // 加载默认或上次查看的星座
      this.loadDefaultZodiac();
    }
  },

  /**
   * 加载默认星座或上次查看的星座
   */
  loadDefaultZodiac: function () {
    // 尝试从本地缓存获取上次查看的星座
    const lastZodiac = wx.getStorageSync('lastZodiac');
    if (lastZodiac) {
      this.setData({
        selectedZodiac: JSON.parse(lastZodiac)
      });
    }
    
    this.loadFortuneData();
  },

  /**
   * 加载指定星座的运势
   */
  loadZodiacFortune: function (zodiacName) {
    // 查找指定星座
    const zodiac = this.data.allZodiacs.find(z => z.name === zodiacName);
    if (zodiac) {
      this.setData({
        selectedZodiac: zodiac
      });
      
      // 保存到本地缓存
      wx.setStorageSync('lastZodiac', JSON.stringify(zodiac));
      
      // 更新最近使用的星座
      this.updateRecentZodiacs(zodiac);
      
      this.loadFortuneData();
    }
  },

  /**
   * 加载运势数据
   */
  loadFortuneData: function () {
    this.setData({ loading: true });
    
    // 获取当前日期
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    let dateText = '';
    switch (this.data.fortuneType) {
      case 'today':
        dateText = `${year}年${month}月${day}日`;
        break;
      case 'tomorrow':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateText = `${tomorrow.getFullYear()}年${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日`;
        break;
      case 'week':
        dateText = `${year}年${month}月${day}日 - ${month}月${day+6}日`;
        break;
      case 'month':
        dateText = `${year}年${month}月`;
        break;
      case 'year':
        dateText = `${year}年`;
        break;
    }
    
    this.setData({
      fortuneDate: dateText
    });
    
    // 这里应该调用真实的API获取运势数据
    // 为演示，使用模拟数据，并添加一个延迟模拟网络请求
    setTimeout(() => {
      // 模拟不同星座的不同运势
      const fortune = {
        ...this.data.fortune,
        overallRating: this.getRandomRating(1, 5),
        love: this.getRandomRating(50, 100),
        career: this.getRandomRating(50, 100),
        wealth: this.getRandomRating(50, 100),
        health: this.getRandomRating(50, 100)
      };
      
      this.setData({
        fortune: fortune,
        loading: false
      });
    }, 1000);
  },

  /**
   * 获取随机评分
   */
  getRandomRating: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * 更新最近使用的星座
   */
  updateRecentZodiacs: function (zodiac) {
    // 获取当前最近使用的星座列表
    let recentZodiacs = [...this.data.recentZodiacs];
    
    // 检查是否已存在
    const existingIndex = recentZodiacs.findIndex(z => z.name === zodiac.name);
    if (existingIndex !== -1) {
      // 如果已存在，则移除它
      recentZodiacs.splice(existingIndex, 1);
    }
    
    // 将新星座添加到最前面
    recentZodiacs.unshift(zodiac);
    
    // 保留最多3个最近使用的星座
    if (recentZodiacs.length > 3) {
      recentZodiacs = recentZodiacs.slice(0, 3);
    }
    
    this.setData({
      recentZodiacs: recentZodiacs
    });
    
    // 保存到本地缓存
    wx.setStorageSync('recentZodiacs', JSON.stringify(recentZodiacs));
  },

  /**
   * 切换运势类型
   */
  changeFortune: function (e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      fortuneType: type
    });
    
    this.loadFortuneData();
  },

  /**
   * 显示星座选择器
   */
  showZodiacSelector: function () {
    this.setData({
      showZodiacList: true
    });
  },

  /**
   * 隐藏星座选择器
   */
  hideZodiacSelector: function () {
    this.setData({
      showZodiacList: false
    });
  },

  /**
   * 选择星座
   */
  selectZodiac: function (e) {
    const zodiac = e.currentTarget.dataset.zodiac;
    this.setData({
      selectedZodiac: zodiac,
      showZodiacList: false
    });
    
    // 保存到本地缓存
    wx.setStorageSync('lastZodiac', JSON.stringify(zodiac));
    
    // 更新最近使用的星座
    this.updateRecentZodiacs(zodiac);
    
    this.loadFortuneData();
  },

  /**
   * 分享运势
   */
  shareHoroscope: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const zodiacName = this.data.selectedZodiac.name;
    const fortuneType = this.data.fortuneType;
    
    return {
      title: `${zodiacName}今日运势`,
      path: `/pages/horoscope/horoscope?zodiac=${zodiacName}&type=${fortuneType}`,
      imageUrl: '/assets/images/share-horoscope.png'
    };
  }
}) 