// 城市选择页 JavaScript
const app = getApp()

Page({
  data: {
    // 搜索相关
    searchValue: '',
    showSearchResult: false,
    searchResults: [],
    searchHistory: [],
    searching: false,
    
    // 城市列表
    locationCity: { id: '101010100', name: '北京', isDefault: false, isLocationBased: true },
    defaultCity: { id: '101010100', name: '北京', isDefault: true, isLocationBased: false },
    recentCities: [
      { id: '101020100', name: '上海', isDefault: false, isLocationBased: false },
      { id: '101280101', name: '广州', isDefault: false, isLocationBased: false },
      { id: '101280601', name: '深圳', isDefault: false, isLocationBased: false }
    ],
    
    // 热门城市
    hotCities: [
      { id: '101010100', name: '北京', isDefault: false, isLocationBased: false },
      { id: '101020100', name: '上海', isDefault: false, isLocationBased: false },
      { id: '101280101', name: '广州', isDefault: false, isLocationBased: false },
      { id: '101280601', name: '深圳', isDefault: false, isLocationBased: false },
      { id: '101210101', name: '杭州', isDefault: false, isLocationBased: false },
      { id: '101030100', name: '天津', isDefault: false, isLocationBased: false },
      { id: '101110101', name: '西安', isDefault: false, isLocationBased: false },
      { id: '101190101', name: '南京', isDefault: false, isLocationBased: false }
    ],
    
    // 定位相关
    locating: false,
    locationFailed: false,
    
    // 加载状态
    loading: false
  },

  onLoad: function (options) {
    // 加载搜索历史
    this.loadSearchHistory();
    
    // 开始定位
    this.startLocationService();
  },
  
  // 加载搜索历史
  loadSearchHistory: function() {
    // 从本地存储获取搜索历史，实际开发中应该调用API
    const searchHistory = [
      { id: '101270101', name: '成都', isDefault: false, isLocationBased: false },
      { id: '101180101', name: '郑州', isDefault: false, isLocationBased: false }
    ];
    
    this.setData({
      searchHistory: searchHistory
    });
  },
  
  // 开始定位服务
  startLocationService: function() {
    this.setData({
      locating: true,
      locationFailed: false
    });
    
    // 模拟定位过程
    setTimeout(() => {
      // 模拟定位成功
      this.setData({
        locating: false,
        locationFailed: false,
        locationCity: { id: '101010100', name: '北京', isDefault: false, isLocationBased: true }
      });
    }, 1500);
  },
  
  // 处理搜索输入
  handleSearchInput: function(e) {
    const value = e.detail.value;
    this.setData({
      searchValue: value,
      showSearchResult: !!value
    });
    
    if (value) {
      this.searchCity(value);
    }
  },
  
  // 清空搜索输入
  clearSearchInput: function() {
    this.setData({
      searchValue: '',
      showSearchResult: false,
      searchResults: []
    });
  },
  
  // 搜索城市
  searchCity: function(keyword) {
    this.setData({
      searching: true
    });
    
    // 模拟搜索过程
    setTimeout(() => {
      // 模拟搜索结果
      let results = [];
      
      if (keyword === '北' || keyword === '北京') {
        results.push({ id: '101010100', name: '北京', isDefault: false, isLocationBased: false });
        results.push({ id: '101060101', name: '长春市 北安区', isDefault: false, isLocationBased: false });
        results.push({ id: '101050101', name: '哈尔滨市 北岗区', isDefault: false, isLocationBased: false });
      } else if (keyword === '上' || keyword === '上海') {
        results.push({ id: '101020100', name: '上海', isDefault: false, isLocationBased: false });
      } else if (keyword === '广' || keyword === '广州') {
        results.push({ id: '101280101', name: '广州', isDefault: false, isLocationBased: false });
        results.push({ id: '101251401', name: '广东省 广州市', isDefault: false, isLocationBased: false });
        results.push({ id: '101251402', name: '广东省 广州市 天河区', isDefault: false, isLocationBased: false });
      }
      
      this.setData({
        searchResults: results,
        searching: false
      });
    }, 500);
  },
  
  // 添加搜索历史
  addSearchHistory: function(city) {
    // 检查是否已存在于历史记录中
    const index = this.data.searchHistory.findIndex(item => item.id === city.id);
    
    let newHistory = [...this.data.searchHistory];
    
    if (index !== -1) {
      // 已存在，将其移到最前面
      newHistory.splice(index, 1);
    }
    
    // 添加到历史记录开头
    newHistory.unshift(city);
    
    // 限制历史记录数量
    if (newHistory.length > 10) {
      newHistory = newHistory.slice(0, 10);
    }
    
    this.setData({
      searchHistory: newHistory
    });
    
    // 保存到本地存储，实际开发中应该调用API
    // wx.setStorageSync('citySearchHistory', newHistory);
  },
  
  // 清空搜索历史
  clearSearchHistory: function() {
    wx.showModal({
      title: '清空确认',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            searchHistory: []
          });
          
          // 清除本地存储，实际开发中应该调用API
          // wx.removeStorageSync('citySearchHistory');
        }
      }
    });
  },
  
  // 选择城市
  selectCity: function(e) {
    const city = e.currentTarget.dataset.city;
    
    // 如果选择的是搜索结果中的城市，添加到搜索历史
    if (this.data.showSearchResult) {
      this.addSearchHistory(city);
    }
    
    // 将选中的城市信息返回
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 上一个页面
    
    // 如果上一个页面存在，调用其方法更新城市
    if (prevPage) {
      // 实际开发中，应该调用天气页面的更新城市方法
      // prevPage.updateCity(city);
    }
    
    // 返回上一页
    wx.navigateBack();
  },
  
  // 重新定位
  refreshLocation: function() {
    this.startLocationService();
  },
  
  // 设置为默认城市
  setAsDefault: function(e) {
    const city = e.currentTarget.dataset.city;
    
    // 更新默认城市
    this.setData({
      defaultCity: { ...city, isDefault: true }
    });
    
    // 更新各列表中对应城市的默认状态
    this.updateCityDefaultStatus(city.id);
    
    wx.showToast({
      title: '已设为默认城市',
      icon: 'success',
      duration: 2000
    });
  },
  
  // 更新城市默认状态
  updateCityDefaultStatus: function(cityId) {
    // 更新定位城市
    if (this.data.locationCity.id === cityId) {
      this.setData({
        'locationCity.isDefault': true
      });
    } else {
      this.setData({
        'locationCity.isDefault': false
      });
    }
    
    // 更新最近使用的城市
    const recentCities = this.data.recentCities.map(city => {
      return {
        ...city,
        isDefault: city.id === cityId
      };
    });
    
    // 更新热门城市
    const hotCities = this.data.hotCities.map(city => {
      return {
        ...city,
        isDefault: city.id === cityId
      };
    });
    
    this.setData({
      recentCities,
      hotCities
    });
  }
}) 