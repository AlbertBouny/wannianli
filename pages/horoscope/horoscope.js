// 星座运势页 JavaScript
const app = getApp()

Page({
  data: {
    // 当前选中的星座
    currentSign: null,
    
    // 星座列表
    signs: [
      { id: 'aries', name: '白羊座', icon: '/assets/icons/horoscope/aries.png', date: '3.21-4.19', element: '火象星座', personality: '热情、冲动' },
      { id: 'taurus', name: '金牛座', icon: '/assets/icons/horoscope/taurus.png', date: '4.20-5.20', element: '土象星座', personality: '稳重、固执' },
      { id: 'gemini', name: '双子座', icon: '/assets/icons/horoscope/gemini.png', date: '5.21-6.21', element: '风象星座', personality: '多变、聪明' },
      { id: 'cancer', name: '巨蟹座', icon: '/assets/icons/horoscope/cancer.png', date: '6.22-7.22', element: '水象星座', personality: '敏感、情绪化' },
      { id: 'leo', name: '狮子座', icon: '/assets/icons/horoscope/leo.png', date: '7.23-8.22', element: '火象星座', personality: '自信、慷慨' },
      { id: 'virgo', name: '处女座', icon: '/assets/icons/horoscope/virgo.png', date: '8.23-9.22', element: '土象星座', personality: '完美主义、挑剔' },
      { id: 'libra', name: '天秤座', icon: '/assets/icons/horoscope/libra.png', date: '9.23-10.23', element: '风象星座', personality: '和谐、优雅' },
      { id: 'scorpio', name: '天蝎座', icon: '/assets/icons/horoscope/scorpio.png', date: '10.24-11.22', element: '水象星座', personality: '神秘、执着' },
      { id: 'sagittarius', name: '射手座', icon: '/assets/icons/horoscope/sagittarius.png', date: '11.23-12.21', element: '火象星座', personality: '自由、乐观' },
      { id: 'capricorn', name: '摩羯座', icon: '/assets/icons/horoscope/capricorn.png', date: '12.22-1.19', element: '土象星座', personality: '务实、严谨' },
      { id: 'aquarius', name: '水瓶座', icon: '/assets/icons/horoscope/aquarius.png', date: '1.20-2.18', element: '风象星座', personality: '独立、创新' },
      { id: 'pisces', name: '双鱼座', icon: '/assets/icons/horoscope/pisces.png', date: '2.19-3.20', element: '水象星座', personality: '梦幻、敏感' }
    ],
    
    // 运势类型
    fortuneTypes: [
      { id: 'today', name: '今日运势' },
      { id: 'tomorrow', name: '明日运势' },
      { id: 'week', name: '本周运势' },
      { id: 'month', name: '本月运势' }
    ],
    
    // 当前运势类型
    currentFortuneType: 'today',
    
    // 运势数据
    fortune: null,
    
    // 星座列表是否显示
    showSignList: false,
    
    // 最近使用的星座
    recentSigns: [],
    
    // 页面状态
    loading: true
  },

  onLoad: function () {
    // 检查用户缓存的星座
    this.loadUserSign();
    
    // 加载最近使用的星座
    this.loadRecentSigns();
  },
  
  // 从缓存加载用户星座
  loadUserSign: function() {
    // 这里应该从本地存储或接口获取用户星座
    // 模拟获取到的星座是 leo
    const userSignId = 'leo';
    
    // 查找对应的星座对象
    const sign = this.data.signs.find(s => s.id === userSignId);
    
    if (sign) {
      this.setData({
        currentSign: sign
      });
      
      this.loadFortuneData(sign.id, this.data.currentFortuneType);
    } else {
      // 如果没有找到星座，显示星座选择列表
      this.setData({
        showSignList: true,
        loading: false
      });
    }
  },
  
  // 加载最近使用的星座
  loadRecentSigns: function() {
    // 从本地存储获取最近使用的星座
    const recentSignIds = ['leo', 'virgo', 'libra'];
    
    const recentSigns = recentSignIds
      .map(id => this.data.signs.find(s => s.id === id))
      .filter(sign => !!sign);
      
    this.setData({
      recentSigns: recentSigns
    });
  },
  
  // 加载星座运势数据
  loadFortuneData: function(signId, fortuneType) {
    this.setData({
      loading: true
    });
    
    // 模拟API请求
    setTimeout(() => {
      // 模拟获取星座运势数据
      const fortune = {
        // 基本信息
        date: '2023年7月15日',
        signId: signId,
        fortuneType: fortuneType,
        
        // 整体运势评分（1-5星）
        overall: 4,
        
        // 各方面运势（1-100分）
        aspects: {
          love: 85,
          career: 70,
          wealth: 65,
          health: 90
        },
        
        // 幸运色和数字
        lucky: {
          color: '红色',
          number: '6',
          direction: '东南',
          time: '上午10:00-12:00'
        },
        
        // 运势描述
        description: '今天整体运势不错，特别是在感情和健康方面有较好的表现。工作上可能面临一些小挑战，但不会造成大的影响。财务方面建议谨慎，不要盲目投资或大额消费。在人际交往中会有新的收获，可能结识有趣的朋友。',
        
        // 建议
        suggestions: [
          '穿戴红色饰品可能带来好运',
          '上午是处理重要事务的最佳时段',
          '今天适合与家人朋友共度时光',
          '健康状况良好，但仍需注意饮食规律'
        ]
      };
      
      this.setData({
        fortune: fortune,
        loading: false,
        showSignList: false
      });
      
      // 添加到最近使用
      this.addToRecentSigns(signId);
    }, 1000);
  },
  
  // 切换运势类型
  changeFortuneType: function(e) {
    const fortuneType = e.currentTarget.dataset.type;
    
    this.setData({
      currentFortuneType: fortuneType
    });
    
    if (this.data.currentSign) {
      this.loadFortuneData(this.data.currentSign.id, fortuneType);
    }
  },
  
  // 显示星座选择列表
  showSignSelector: function() {
    this.setData({
      showSignList: true
    });
  },
  
  // 选择星座
  selectSign: function(e) {
    const signId = e.currentTarget.dataset.id;
    const sign = this.data.signs.find(s => s.id === signId);
    
    if (sign) {
      this.setData({
        currentSign: sign
      });
      
      this.loadFortuneData(sign.id, this.data.currentFortuneType);
    }
  },
  
  // 添加到最近使用的星座
  addToRecentSigns: function(signId) {
    // 检查是否已在最近使用列表中
    const index = this.data.recentSigns.findIndex(s => s.id === signId);
    let newRecentSigns = [...this.data.recentSigns];
    
    // 找到对应的星座对象
    const sign = this.data.signs.find(s => s.id === signId);
    if (!sign) return;
    
    if (index !== -1) {
      // 已存在，将其移到最前面
      newRecentSigns.splice(index, 1);
    }
    
    // 添加到最前面
    newRecentSigns.unshift(sign);
    
    // 限制数量为3个
    if (newRecentSigns.length > 3) {
      newRecentSigns = newRecentSigns.slice(0, 3);
    }
    
    this.setData({
      recentSigns: newRecentSigns
    });
    
    // 保存到本地存储
    // wx.setStorageSync('recentSigns', newRecentSigns.map(s => s.id));
  },
  
  // 获取星星评分样式
  getStarClass: function(rating, position) {
    if (position <= rating) {
      return 'star-filled';
    } else {
      return 'star-empty';
    }
  },
  
  // 分享给朋友
  onShareAppMessage: function() {
    const signName = this.data.currentSign ? this.data.currentSign.name : '星座运势';
    const fortuneType = this.data.fortuneTypes.find(t => t.id === this.data.currentFortuneType);
    const typeName = fortuneType ? fortuneType.name : '运势';
    
    return {
      title: `${signName}${typeName}分享`,
      path: `/pages/horoscope/horoscope?sign=${this.data.currentSign ? this.data.currentSign.id : ''}&type=${this.data.currentFortuneType}`
    };
  }
}) 