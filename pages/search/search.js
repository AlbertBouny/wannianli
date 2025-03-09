// 搜索页 JavaScript
const app = getApp()

Page({
  data: {
    // 搜索输入
    searchText: '',
    searchHistory: [],
    
    // 搜索结果
    searchResults: [],
    
    // 热门搜索
    hotSearches: [
      '春节', '清明节', '2023年日历', 
      '端午节', '中秋节', '国庆节',
      '农历生日', '节气', '黄道吉日'
    ],
    
    // 页面状态
    showResults: false,
    isLoading: false,
    isEmpty: false,
    
    // 搜索分类
    categories: [
      { id: 'all', name: '全部' },
      { id: 'date', name: '日期' },
      { id: 'festival', name: '节日' },
      { id: 'event', name: '事件' },
      { id: 'almanac', name: '黄历' }
    ],
    currentCategory: 'all',
    
    // 模拟的搜索结果
    mockResults: {
      date: [
        { id: 1, type: 'date', title: '2023年1月1日', subtitle: '星期日 农历腊月初十', icon: '/assets/icons/results/date.png' },
        { id: 2, type: 'date', title: '2023年5月1日', subtitle: '星期一 农历三月十二 劳动节', icon: '/assets/icons/results/date.png' },
        { id: 3, type: 'date', title: '2023年10月1日', subtitle: '星期日 农历八月十七 国庆节', icon: '/assets/icons/results/date.png' }
      ],
      festival: [
        { id: 4, type: 'festival', title: '2023年春节', subtitle: '1月22日 农历正月初一', icon: '/assets/icons/results/festival.png' },
        { id: 5, type: 'festival', title: '2023年中秋节', subtitle: '9月29日 农历八月十五', icon: '/assets/icons/results/festival.png' },
        { id: 6, type: 'festival', title: '2023年国庆节', subtitle: '10月1日-10月7日', icon: '/assets/icons/results/festival.png' }
      ],
      event: [
        { id: 7, type: 'event', title: '项目会议', subtitle: '2023年3月15日 14:00-16:00', icon: '/assets/icons/results/event.png' },
        { id: 8, type: 'event', title: '团队建设活动', subtitle: '2023年5月20日 全天', icon: '/assets/icons/results/event.png' }
      ],
      almanac: [
        { id: 9, type: 'almanac', title: '2023年2月黄道吉日', subtitle: '适合婚嫁、乔迁、开业', icon: '/assets/icons/results/almanac.png' },
        { id: 10, type: 'almanac', title: '2023年清明节祭祀', subtitle: '4月5日 农历二月十五', icon: '/assets/icons/results/almanac.png' }
      ]
    }
  },

  onLoad: function (options) {
    // 如果有传入的搜索关键词，直接执行搜索
    if (options && options.keyword) {
      this.setData({
        searchText: options.keyword
      });
      this.doSearch();
    }
    
    // 加载搜索历史
    this.loadSearchHistory();
  },
  
  // 输入框输入事件
  onInput: function (e) {
    this.setData({
      searchText: e.detail.value
    });
    
    // 如果输入为空，清空结果
    if (!e.detail.value) {
      this.clearResults();
    }
  },
  
  // 清空输入框
  clearInput: function () {
    this.setData({
      searchText: ''
    });
    this.clearResults();
  },
  
  // 清空搜索结果
  clearResults: function () {
    this.setData({
      showResults: false,
      searchResults: [],
      isEmpty: false
    });
  },
  
  // 执行搜索
  doSearch: function () {
    const keyword = this.data.searchText.trim();
    
    if (!keyword) {
      return;
    }
    
    // 显示加载状态
    this.setData({
      isLoading: true,
      showResults: true
    });
    
    // 保存到搜索历史
    this.saveSearchHistory(keyword);
    
    // 这里应该是实际的搜索逻辑，现在使用模拟数据
    setTimeout(() => {
      // 模拟搜索结果
      let results = [];
      const category = this.data.currentCategory;
      
      if (category === 'all') {
        // 合并所有分类的结果
        Object.values(this.data.mockResults).forEach(items => {
          results = results.concat(items);
        });
      } else if (this.data.mockResults[category]) {
        results = this.data.mockResults[category];
      }
      
      // 根据关键词过滤结果
      results = results.filter(item => 
        item.title.toLowerCase().includes(keyword.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(keyword.toLowerCase())
      );
      
      this.setData({
        searchResults: results,
        isLoading: false,
        isEmpty: results.length === 0
      });
    }, 500);
  },
  
  // 加载搜索历史
  loadSearchHistory: function () {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({
      searchHistory: history
    });
  },
  
  // 保存搜索历史
  saveSearchHistory: function (keyword) {
    let history = this.data.searchHistory;
    
    // 如果已存在，先移除
    history = history.filter(item => item !== keyword);
    
    // 添加到最前面
    history.unshift(keyword);
    
    // 限制最多保存10条历史
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    this.setData({
      searchHistory: history
    });
    
    // 保存到本地存储
    wx.setStorageSync('searchHistory', history);
  },
  
  // 清空搜索历史
  clearSearchHistory: function () {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史吗？',
      success: res => {
        if (res.confirm) {
          this.setData({
            searchHistory: []
          });
          wx.setStorageSync('searchHistory', []);
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 点击历史或热门搜索项
  tapSearchItem: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchText: keyword
    });
    this.doSearch();
  },
  
  // 改变搜索分类
  changeCategory: function (e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    });
    
    if (this.data.showResults && this.data.searchText) {
      this.doSearch();
    }
  },
  
  // 点击搜索结果项
  tapResultItem: function (e) {
    const item = e.currentTarget.dataset.item;
    
    // 根据不同类型跳转到对应页面
    switch (item.type) {
      case 'date':
        // 提取日期并跳转到日期详情页
        wx.navigateTo({
          url: `/pages/day-detail/day-detail?date=${encodeURIComponent(item.title)}`
        });
        break;
        
      case 'festival':
        // 跳转到节日详情页
        wx.navigateTo({
          url: `/pages/festival-detail/festival-detail?id=${item.id}`
        });
        break;
        
      case 'event':
        // 跳转到事件详情页
        wx.navigateTo({
          url: `/pages/event-detail/event-detail?id=${item.id}`
        });
        break;
        
      case 'almanac':
        // 跳转到黄历详情页
        wx.navigateTo({
          url: `/pages/almanac-detail/almanac-detail?date=${encodeURIComponent(item.title)}`
        });
        break;
    }
  }
}) 