// 城市选择页面
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 热门城市
    hotCities: [
      { name: '北京', code: '101010100' },
      { name: '上海', code: '101020100' },
      { name: '广州', code: '101280101' },
      { name: '深圳', code: '101280601' },
      { name: '杭州', code: '101210101' },
      { name: '南京', code: '101190101' },
      { name: '武汉', code: '101200101' },
      { name: '成都', code: '101270101' },
      { name: '重庆', code: '101040100' }
    ],
    // 城市索引
    letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
    // 所有城市（按字母分组）
    cityList: {},
    // 当前选择的字母索引
    currentLetter: '',
    // 搜索关键词
    searchKeyword: '',
    // 搜索结果
    searchResults: [],
    // 是否显示搜索结果
    showSearchResults: false,
    // 当前定位城市
    currentCity: { name: '定位中...', code: '' },
    // 是否显示加载中
    loading: true,
    // 是否允许获取地理位置
    locationAuth: true,
    // 是否自动跳转到当前定位城市的字母索引
    autoScrollToLetter: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCityData();
    this.getCurrentLocation();
  },

  /**
   * 初始化城市数据（模拟数据，实际应从API获取）
   */
  initCityData: function () {
    // 模拟城市数据（简化数据，实际项目中应有更完整的数据）
    const cityData = {
      'A': [
        { name: '安庆', code: '101220601' },
        { name: '鞍山', code: '101070301' },
        { name: '安阳', code: '101180201' }
      ],
      'B': [
        { name: '北京', code: '101010100' },
        { name: '保定', code: '101090201' },
        { name: '宝鸡', code: '101110901' },
        { name: '包头', code: '101080201' }
      ],
      'C': [
        { name: '长春', code: '101060101' },
        { name: '常州', code: '101191101' },
        { name: '长沙', code: '101250101' },
        { name: '成都', code: '101270101' },
        { name: '重庆', code: '101040100' }
      ],
      // ... 其他字母的城市数据
    };

    this.setData({
      cityList: cityData,
      loading: false
    });
  },

  /**
   * 获取当前位置
   */
  getCurrentLocation: function () {
    const that = this;

    // 模拟获取地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // 实际项目中，应该根据经纬度调用逆地理编码接口获取城市信息
        // 这里简化处理，直接模拟一个城市
        setTimeout(() => {
          that.setData({
            currentCity: { name: '广州', code: '101280101' },
            locationAuth: true
          });
        }, 1000);
      },
      fail: function () {
        that.setData({
          currentCity: { name: '未能获取位置', code: '' },
          locationAuth: false
        });

        wx.showToast({
          title: '获取位置失败，请开启位置权限',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  /**
   * 重新获取位置权限
   */
  reauthorizeLocation: function () {
    const that = this;
    
    wx.openSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation']) {
          that.getCurrentLocation();
        }
      }
    });
  },

  /**
   * 点击字母索引
   */
  tapLetter: function (e) {
    const letter = e.currentTarget.dataset.letter;
    this.setData({
      currentLetter: letter,
      autoScrollToLetter: true
    });
  },

  /**
   * 搜索城市
   */
  searchCity: function (e) {
    const keyword = e.detail.value;
    
    this.setData({
      searchKeyword: keyword
    });

    if (!keyword) {
      this.setData({
        showSearchResults: false,
        searchResults: []
      });
      return;
    }

    // 从城市列表中搜索匹配的城市
    let results = [];
    const cityList = this.data.cityList;
    
    for (const letter in cityList) {
      const cities = cityList[letter];
      const matchedCities = cities.filter(city => city.name.indexOf(keyword) > -1);
      results = results.concat(matchedCities);
    }

    this.setData({
      searchResults: results,
      showSearchResults: true
    });
  },

  /**
   * 清除搜索
   */
  clearSearch: function () {
    this.setData({
      searchKeyword: '',
      showSearchResults: false,
      searchResults: []
    });
  },

  /**
   * 选择城市
   */
  selectCity: function (e) {
    const city = e.currentTarget.dataset.city;
    
    // 保存选择的城市到本地存储
    wx.setStorageSync('selectedCity', city);
    
    // 返回上一页或首页
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.switchTab({
          url: '/app/pages/home/home'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  }
}) 