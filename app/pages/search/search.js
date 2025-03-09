// 搜索页 JavaScript
const app = getApp()

Page({
  data: {
    // 搜索参数
    query: '',
    searching: false,
    showClearButton: false,
    
    // 筛选参数
    activeFilter: 'all',
    filters: [
      { id: 'all', name: '全部' },
      { id: 'jieqi', name: '节气' },
      { id: 'festival', name: '节日' },
      { id: 'almanac', name: '黄历' },
      { id: 'event', name: '日程' },
      { id: 'date', name: '日期' }
    ],
    
    // 搜索历史
    searchHistory: [],
    showHistory: true,
    
    // 搜索结果
    hasResult: false,
    searchResults: {
      jieqi: [],
      festival: [],
      almanac: [],
      event: [],
      date: []
    },
    
    // 无结果时的推荐
    recommendations: [
      { id: 1, title: '传统节日', icon: 'calendar-alt', description: '查看中国传统节日列表' },
      { id: 2, title: '今日宜忌', icon: 'book', description: '查看今天的黄历吉凶宜忌' },
      { id: 3, title: '本月节气', icon: 'sun', description: '查看本月节气信息' }
    ]
  },
  
  onLoad: function() {
    // 加载历史搜索记录
    this.loadSearchHistory();
  },
  
  onShow: function() {
    // 页面显示时自动聚焦搜索框
    this.setData({
      showHistory: this.data.query.length === 0
    });
  },
  
  // 加载搜索历史
  loadSearchHistory: function() {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({
      searchHistory: history.slice(0, 10) // 最多显示10条历史记录
    });
  },
  
  // 保存搜索记录
  saveSearchHistory: function(query) {
    if (!query.trim()) return;
    
    let history = wx.getStorageSync('searchHistory') || [];
    
    // 如果已存在，先移除旧的
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    
    // 添加到历史记录开头
    history.unshift(query);
    
    // 限制历史记录数量，最多保存20条
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    // 保存到本地存储
    wx.setStorageSync('searchHistory', history);
    
    // 更新页面数据
    this.setData({
      searchHistory: history.slice(0, 10)
    });
  },
  
  // 清空历史记录
  clearSearchHistory: function() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory');
          this.setData({
            searchHistory: []
          });
        }
      }
    });
  },
  
  // 输入变化
  onInputChange: function(e) {
    const query = e.detail.value;
    this.setData({
      query: query,
      showClearButton: query.length > 0,
      showHistory: query.length === 0 && !this.data.searching
    });
  },
  
  // 清除输入
  clearInput: function() {
    this.setData({
      query: '',
      showClearButton: false,
      searching: false,
      hasResult: false,
      showHistory: true
    });
  },
  
  // 执行搜索
  search: function() {
    const query = this.data.query.trim();
    if (!query) return;
    
    this.setData({
      searching: true,
      showHistory: false
    });
    
    // 保存搜索历史
    this.saveSearchHistory(query);
    
    // 模拟搜索API调用
    wx.showLoading({
      title: '搜索中...'
    });
    
    setTimeout(() => {
      // 模拟搜索结果
      const results = this.mockSearchResults(query);
      
      // 检查是否有结果
      const hasResult = this.checkHasResults(results);
      
      this.setData({
        searchResults: results,
        hasResult: hasResult
      });
      
      wx.hideLoading();
    }, 500);
  },
  
  // 检查是否有搜索结果
  checkHasResults: function(results) {
    return Object.values(results).some(items => items.length > 0);
  },
  
  // 点击搜索历史项
  onHistoryItemTap: function(e) {
    const query = e.currentTarget.dataset.query;
    this.setData({
      query: query,
      showClearButton: true
    });
    this.search();
  },
  
  // 切换过滤器
  changeFilter: function(e) {
    const filterId = e.currentTarget.dataset.id;
    this.setData({
      activeFilter: filterId
    });
    
    // 如果正在搜索，重新过滤结果
    if (this.data.searching) {
      this.search();
    }
  },
  
  // 模拟搜索结果 (实际应用中应调用API)
  mockSearchResults: function(query) {
    const filter = this.data.activeFilter;
    const results = {
      jieqi: [],
      festival: [],
      almanac: [],
      event: [],
      date: []
    };
    
    // 根据筛选条件过滤结果
    if (filter === 'all' || filter === 'jieqi') {
      if (query.includes('节气') || query.includes('春分') || query.includes('立夏')) {
        results.jieqi = [
          {
            id: 1,
            title: '春分',
            icon: 'sun',
            description: '2023年春分：3月20日，昼夜平分，春季中点',
            date: '2023-03-20'
          },
          {
            id: 2,
            title: '清明',
            icon: 'cloud-sun',
            description: '2023年清明：4月5日，祭祀扫墓，踏青节气',
            date: '2023-04-05'
          }
        ];
      }
    }
    
    if (filter === 'all' || filter === 'festival') {
      if (query.includes('节日') || query.includes('春节') || query.includes('元宵')) {
        results.festival = [
          {
            id: 1,
            title: '春节',
            icon: 'calendar-alt',
            description: '2023年春节：1月22日，农历正月初一',
            date: '2023-01-22'
          },
          {
            id: 2,
            title: '元宵节',
            icon: 'moon',
            description: '2023年元宵节：2月5日，正月十五',
            date: '2023-02-05'
          }
        ];
      }
    }
    
    if (filter === 'all' || filter === 'almanac') {
      if (query.includes('黄历') || query.includes('宜') || query.includes('忌')) {
        results.almanac = [
          {
            id: 1,
            title: '结婚黄道吉日',
            icon: 'heart',
            description: '2023年3月适合结婚的日子：3月6日、3月18日',
            date: '2023-03'
          }
        ];
      }
    }
    
    if (filter === 'all' || filter === 'event') {
      results.event = []; // 这里应该从用户的日程数据中搜索
    }
    
    if (filter === 'all' || filter === 'date') {
      if (query.includes('日期') || query.includes('农历') || query.includes('阳历')) {
        results.date = [
          {
            id: 1,
            title: '农历转换',
            icon: 'exchange-alt',
            description: '农历二月初二：对应公历2023年2月22日',
            date: '2023-02-22'
          }
        ];
      }
    }
    
    return results;
  },
  
  // 点击搜索结果项
  onResultItemTap: function(e) {
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;
    const date = e.currentTarget.dataset.date;
    
    switch(type) {
      case 'jieqi':
      case 'festival':
      case 'almanac':
        // 如果有日期，跳转到具体日期详情页
        if (date) {
          wx.navigateTo({
            url: `/app/pages/day-detail/day-detail?date=${date}`
          });
        }
        break;
      case 'event':
        // 跳转到日程详情
        wx.navigateTo({
          url: `/app/pages/event-detail/event-detail?id=${id}`
        });
        break;
      case 'date':
        // 跳转到日期详情
        wx.navigateTo({
          url: `/app/pages/day-detail/day-detail?date=${date}`
        });
        break;
    }
  },
  
  // 返回上一页
  back: function() {
    wx.navigateBack();
  },
  
  // 语音搜索 (调用微信接口)
  voiceSearch: function() {
    // 目前微信小程序基础库暂无直接语音识别API，这里是示例
    wx.showToast({
      title: '语音搜索开发中',
      icon: 'none'
    });
  },
  
  // 点击推荐项
  onRecommendTap: function(e) {
    const id = e.currentTarget.dataset.id;
    
    switch(id) {
      case 1: // 传统节日
        this.setData({
          query: '传统节日',
          showClearButton: true
        });
        this.search();
        break;
      case 2: // 今日宜忌
        this.setData({
          query: '今日宜忌',
          showClearButton: true
        });
        this.search();
        break;
      case 3: // 本月节气
        this.setData({
          query: '本月节气',
          showClearButton: true
        });
        this.search();
        break;
    }
  }
}); 