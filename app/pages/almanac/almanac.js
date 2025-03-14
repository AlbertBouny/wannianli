// Almanac page JavaScript
const app = getApp()
const util = require('../../../utils/util.js')

Page({
  data: {
    // 当前日期
    currentDate: {
      date: util.formatDate(new Date()),
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      weekday: '星期' + '日一二三四五六'.charAt(new Date().getDay())
    },
    
    // 农历信息
    lunarInfo: {
      lunarYear: '癸卯',
      lunarMonth: '七月',
      lunarDay: '初七',
      zodiac: '兔',
      yearGanZhi: '癸卯',
      monthGanZhi: '丁未',
      dayGanZhi: '辛酉',
      festival: '', // 可能的节日
      term: '' // 可能的节气
    },
    
    // 黄历信息
    almanacInfo: {
      // 今日吉凶
      todayLuck: '吉',
      
      // 宜忌事项
      suit: [
        { name: '搬家', description: '今日搬家，和顺百事兴，百事顺适，生活舒适。' },
        { name: '出行', description: '今日出行，顺风顺水，无灾无难。' },
        { name: '祭祀', description: '今日祭祀，诚心诚意，神灵佑之。' },
        { name: '纳财', description: '今日财运亨通，可以收账纳财。' },
        { name: '开业', description: '今日开业，生意兴隆，财源广进。' }
      ],
      avoid: [
        { name: '安葬', description: '今日安葬，不利后代，哭声不断。' },
        { name: '动土', description: '今日动土，必生灾祸，慎之戒之。' },
        { name: '破土', description: '今日破土，伤人丁，忌动土。' }
      ],
      
      // 胎神占方
      fetusGod: '厨灶栖外正北',
      
      // 五行
      wuxing: '洞下水',
      
      // 值神
      zhiShen: '勾陈',
      
      // 星宿
      starMansion: '房日兔',
      
      // 财神方位
      wealthGod: '正西',
      
      // 福神方位
      luckGod: '东南',
      
      // 喜神方位
      joyGod: '正南',
      
      // 阳贵神
      yangGuiGod: '西北',
      
      // 建除十二神
      twelveSigns: '开日',
      
      // 吉神宜趋
      goodGods: '月恩 四相\n阴德 天德合',
      
      // 凶神宜忌
      badGods: '五虚 八风\n九空 九焦',
      
      // 吉神方位
      goodDirection: [
        { name: '喜神', direction: '正南' },
        { name: '财神', direction: '东北' },
        { name: '福神', direction: '西南' }
      ],
      
      // 凶神方位
      badDirection: [
        { name: '五黄', direction: '正东' },
        { name: '绝命', direction: '正北' },
        { name: '天狗', direction: '西北' }
      ],
      
      // 冲煞
      clash: {
        animal: '羊',
        direction: '西南',
        yearGod: '岁破'
      },
      
      // 彭祖百忌
      pengZu: ['丁不剃头头必生疮', '丑不服药毒气入肠']
    },
    
    // 时辰信息
    hourInfo: [
      { hour: '子', luck: '吉', suit: '祭祀、祈福', avoid: '动土' },
      { hour: '丑', luck: '凶', suit: '修饰墓坟', avoid: '出行' },
      { hour: '寅', luck: '吉', suit: '祭祀、祈福', avoid: '经络' },
      { hour: '卯', luck: '平', suit: '会友、宴会', avoid: '安葬' },
      { hour: '辰', luck: '凶', suit: '纳采', avoid: '出行' },
      { hour: '巳', luck: '吉', suit: '求嗣、开张', avoid: '动土' },
      { hour: '午', luck: '平', suit: '宴会、结婚', avoid: '置产' },
      { hour: '未', luck: '凶', suit: '祭祀', avoid: '服药' },
      { hour: '申', luck: '吉', suit: '纳财、开业', avoid: '安葬' },
      { hour: '酉', luck: '平', suit: '造车器', avoid: '祭祀' },
      { hour: '戌', luck: '凶', suit: '祈福', avoid: '出行' },
      { hour: '亥', luck: '吉', suit: '求嗣', avoid: '造庭' }
    ],
    
    // 黄帝纪元年
    imperialYear: '四千七百二十二',
    
    // 当前周数
    weekOfYear: '11',
    
    // 界面状态控制
    showDetail: true,  // 是否显示详细信息
    showRecommendations: true,  // 是否显示推荐内容
    loading: true,  // 加载状态
    
    // 推荐内容
    recommendations: [
      {
        id: 1,
        title: '立冬来啦!过冬如修行，记得添衣暖~',
        source: '节庆研究所',
        likes: 2742,
        image: 'https://picsum.photos/600/300?random=1'
      },
      {
        id: 2,
        title: '立春迎春收春饼，顺应节气忌优郁',
        source: '传统节气研究',
        likes: 1685,
        image: 'https://picsum.photos/600/300?random=2'
      }
    ]
  },

  onLoad: function (options) {
    // 如果有传入的日期参数，则使用传入的日期
    if (options && options.date) {
      this.changeDate(options.date);
    } else {
      // 否则使用当前日期
      this.loadAlmanacData();
    }
  },
  
  onShow: function() {
    // 可能需要重新加载数据
    if (this.data.needReload) {
      this.loadAlmanacData();
      this.setData({
        needReload: false
      });
    }
  },
  
  onPullDownRefresh: function () {
    this.loadAlmanacData();
    wx.stopPullDownRefresh();
  },
  
  // 加载黄历数据
  loadAlmanacData: function () {
    // 这里应该是实际的API调用，暂时使用模拟数据
    this.setData({
      loading: true
    });
    
    setTimeout(() => {
      // 模拟获取数据完成
      this.setData({
        loading: false
      });
    }, 1000);
  },
  
  // 切换到指定日期
  changeDate: function (dateString) {
    const date = util.parseDate(dateString);
    const weekday = '星期' + '日一二三四五六'.charAt(date.getDay());
    
    this.setData({
      'currentDate.date': util.formatDate(date),
      'currentDate.year': date.getFullYear(),
      'currentDate.month': date.getMonth() + 1,
      'currentDate.day': date.getDate(),
      'currentDate.weekday': weekday
    });
    
    this.loadAlmanacData();
  },
  
  // 切换到前一天
  goPrevDay: function () {
    const currentDate = util.parseDate(this.data.currentDate.date);
    const prevDate = util.addDays(currentDate, -1);
    this.changeDate(util.formatDate(prevDate));
  },
  
  // 切换到后一天
  goNextDay: function () {
    const currentDate = util.parseDate(this.data.currentDate.date);
    const nextDate = util.addDays(currentDate, 1);
    this.changeDate(util.formatDate(nextDate));
  },
  
  // 弹出日期选择器
  showDatePicker: function () {
    // 方法1：使用微信原生日期选择器
    wx.showActionSheet({
      itemList: ['选择日期', '回到今天'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 选择日期
          wx.navigateTo({
            url: '/pages/day-detail/day-detail?selectable=true&date=' + this.data.currentDate.date
          });
        } else if (res.tapIndex === 1) {
          // 回到今天
          this.changeDate(util.formatDate(new Date()));
        }
      }
    });
  },
  
  // 查看宜忌详情
  showActivityDetail: function (e) {
    const type = e.currentTarget.dataset.type; // 'suit' 或 'avoid'
    const index = e.currentTarget.dataset.index;
    
    const activity = this.data.almanacInfo[type][index];
    
    wx.showModal({
      title: activity.name,
      content: activity.description,
      showCancel: false
    });
  },
  
  // 分享当天黄历
  onShareAppMessage: function () {
    const date = this.data.currentDate.date;
    const lunarDate = this.data.lunarInfo.lunarMonth + this.data.lunarInfo.lunarDay;
    
    return {
      title: date + ' ' + lunarDate + '黄历',
      path: '/pages/almanac/almanac?date=' + date
    };
  },
  
  // 点击分享按钮
  onShareTap: function() {
    // 打开分享操作菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  
  // 切换详情展示状态
  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },
  
  // 切换到好运页面
  switchToLuck: function() {
    wx.showToast({
      title: '即将推出',
      icon: 'none'
    });
  },
  
  // 查看更多推荐
  seeMoreRecommendations: function() {
    wx.showToast({
      title: '查看更多推荐',
      icon: 'none'
    });
  },
  
  // 打开推荐内容
  openRecommendation: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '打开推荐内容：' + id,
      icon: 'none'
    });
  },
  
  // 前往问问页面
  goToQuestion: function() {
    wx.showToast({
      title: '问问功能即将上线',
      icon: 'none'
    });
  },
  
  // 前往黄历设置页
  goToSettings: function () {
    wx.navigateTo({
      url: '/pages/almanac-settings/almanac-settings'
    });
  }
}) 
