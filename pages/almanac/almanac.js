// Almanac page JavaScript
const app = getApp()
const util = require('../../utils/util.js')

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
      dayGanZhi: '辛丑',
      festival: '', // 可能的节日
      term: '' // 可能的节气
    },
    
    // 黄历信息
    almanacInfo: {
      // 今日吉凶
      todayLuck: '吉',
      
      // 宜忌事项
      suit: [
        { name: '搬家', description: '今日搬家，和顺百事兴，百事顺遂，生活舒适。' },
        { name: '出行', description: '今日出行，顺风顺水，无灾无难。' },
        { name: '祭祀', description: '今日祭祀，诚心诚意，神灵享之。' },
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
      
      // 吉神方位
      goodDirection: [
        { name: '喜神', direction: '正南' },
        { name: '财神', direction: '东北' },
        { name: '福神', direction: '西南' }
      ],
      
      // 凶神方位
      badDirection: [
        { name: '五鬼', direction: '正东' },
        { name: '绝命', direction: '正北' },
        { name: '天狗', direction: '西北' }
      ],
      
      // 冲煞
      clash: {
        animal: '蛇',
        direction: '西南',
        yearGod: '岁破'
      },
      
      // 彭祖百忌
      pengZu: ['丁不剃头头必生疮', '未不服药毒气入肠']
    },
    
    // 时辰信息
    hourInfo: [
      { hour: '子时 (23:00-0:59)', luck: '吉', suit: '祈福、祭祀', avoid: '动土' },
      { hour: '丑时 (1:00-2:59)', luck: '凶', suit: '修饰垣墙', avoid: '出行' },
      { hour: '寅时 (3:00-4:59)', luck: '吉', suit: '祭祀、祈福', avoid: '经络' },
      { hour: '卯时 (5:00-6:59)', luck: '平', suit: '会友、访友', avoid: '安葬' },
      { hour: '辰时 (7:00-8:59)', luck: '凶', suit: '纳采', avoid: '出行' },
      { hour: '巳时 (9:00-10:59)', luck: '吉', suit: '求嗣、开光', avoid: '动土' },
      { hour: '午时 (11:00-12:59)', luck: '平', suit: '宴会、结婚', avoid: '置产' },
      { hour: '未时 (13:00-14:59)', luck: '凶', suit: '祈福', avoid: '服药' },
      { hour: '申时 (15:00-16:59)', luck: '吉', suit: '纳财、开业', avoid: '安葬' },
      { hour: '酉时 (17:00-18:59)', luck: '平', suit: '造车器', avoid: '祈福' },
      { hour: '戌时 (19:00-20:59)', luck: '凶', suit: '祭祀', avoid: '出行' },
      { hour: '亥时 (21:00-22:59)', luck: '吉', suit: '求婚', avoid: '造庙' }
    ],
    
    // 页面状态
    showHourDetail: false,
    loading: true
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
    const currentDate = this.data.currentDate.date;
    
    wx.navigateTo({
      url: '/pages/date-picker/date-picker?date=' + currentDate
    });
  },
  
  // 切换时辰详情显示状态
  toggleHourDetail: function () {
    this.setData({
      showHourDetail: !this.data.showHourDetail
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
  
  // 跳转到黄历设置页
  goToSettings: function () {
    wx.navigateTo({
      url: '/pages/almanac-settings/almanac-settings'
    });
  },

  // 添加 onShow 方法
  onShow: function() {
    // 更新自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1  // 黄历是第二个tab，索引为1
      });
    }
  }
}) 