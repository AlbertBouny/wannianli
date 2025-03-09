const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    // 日期信息
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    dateString: '', // 格式化为 YYYY-MM-DD
    selectedDate: '', // 选中的日期
    
    // 日历控制
    calendarTitle: '',
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    days: [], // 当月的日期数组
    prevMonthDays: [], // 上个月的日期数组（用于填充）
    nextMonthDays: [], // 下个月的日期数组（用于填充）
    
    // 天气信息
    weather: {
      city: '正在定位...',
      current: {
        temp: '--',
        condition: '未知',
        icon: 'unknown',
        updated: '--'
      },
      forecast: []
    },
    
    // 农历信息
    lunarInfo: {
      date: '',
      festival: '',
      term: '',
      zodiac: ''
    },
    
    // 今日日程
    todayEvents: [],
    
    // 本月日程
    monthEvents: {},
    
    // 视图控制
    viewType: 'month', // month, week, day
    isToday: true,
    showLunar: true,
    showHoliday: true,
    
    // 页面状态
    loading: true
  },
  
  onLoad: function() {
    // 获取当前日期
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dateString = util.formatDate(now);
    
    this.setData({
      year: year,
      month: month,
      day: day,
      dateString: dateString,
      selectedDate: dateString,
      calendarTitle: `${year}年${month}月`
    });
    
    // 初始化日历
    this.initCalendar();
    
    // 获取天气信息
    this.getWeatherInfo();
    
    // 获取日程信息
    this.loadEvents();
    
    // 获取用户设置
    this.getSettings();
  },
  
  onShow: function() {
    // 页面显示时检查是否有更新的日程
    this.loadEvents();
  },
  
  onPullDownRefresh: function() {
    // 下拉刷新
    this.getWeatherInfo();
    this.loadEvents();
    wx.stopPullDownRefresh();
  },
  
  // 初始化日历数据
  initCalendar: function() {
    const { year, month } = this.data;
    
    // 计算当月第一天是星期几
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    // 计算当月有多少天
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // 计算上个月需要显示的天数
    const daysFromPrevMonth = firstDay;
    
    // 计算上个月的总天数
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevMonthYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth, 0).getDate();
    
    // 计算需要显示的下个月的天数
    // 使日历保持6行，每行7天
    const totalCells = 6 * 7;
    const daysFromNextMonth = totalCells - daysFromPrevMonth - daysInMonth;
    
    // 生成日期数组
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i);
      const dateString = util.formatDate(date);
      const isToday = dateString === this.data.dateString;
      
      days.push({
        day: i,
        date: dateString,
        isToday: isToday,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isSelected: dateString === this.data.selectedDate,
        hasEvent: false, // 后面会更新
        isHoliday: false, // 后面会更新
        lunarDay: this.getLunarDay(date) // 获取农历日期
      });
    }
    
    // 生成上个月填充的日期
    const prevMonthDays = [];
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const day = daysInPrevMonth - daysFromPrevMonth + i + 1;
      const date = new Date(prevMonthYear, prevMonth - 1, day);
      const dateString = util.formatDate(date);
      
      prevMonthDays.push({
        day: day,
        date: dateString,
        isPrevMonth: true,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        lunarDay: this.getLunarDay(date)
      });
    }
    
    // 生成下个月填充的日期
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextMonthYear = month === 12 ? year + 1 : year;
    const nextMonthDays = [];
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(nextMonthYear, nextMonth - 1, i);
      const dateString = util.formatDate(date);
      
      nextMonthDays.push({
        day: i,
        date: dateString,
        isNextMonth: true,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        lunarDay: this.getLunarDay(date)
      });
    }
    
    this.setData({
      days: days,
      prevMonthDays: prevMonthDays,
      nextMonthDays: nextMonthDays,
      loading: false
    });
    
    // 更新今日农历信息
    this.updateTodayLunarInfo();
  },
  
  // 切换到上个月
  switchToPrevMonth: function() {
    let { year, month } = this.data;
    month--;
    
    if (month < 1) {
      month = 12;
      year--;
    }
    
    this.setData({
      year: year,
      month: month,
      calendarTitle: `${year}年${month}月`,
      isToday: false
    });
    
    this.initCalendar();
    this.loadEvents();
  },
  
  // 切换到下个月
  switchToNextMonth: function() {
    let { year, month } = this.data;
    month++;
    
    if (month > 12) {
      month = 1;
      year++;
    }
    
    this.setData({
      year: year,
      month: month,
      calendarTitle: `${year}年${month}月`,
      isToday: false
    });
    
    this.initCalendar();
    this.loadEvents();
  },
  
  // 返回今天
  backToToday: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dateString = util.formatDate(now);
    
    this.setData({
      year: year,
      month: month,
      day: day,
      dateString: dateString,
      selectedDate: dateString,
      calendarTitle: `${year}年${month}月`,
      isToday: true
    });
    
    this.initCalendar();
    this.loadEvents();
  },
  
  // 选择日期
  selectDate: function(e) {
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type; // current, prev, next
    let date;
    
    if (type === 'current') {
      date = this.data.days[index].date;
    } else if (type === 'prev') {
      date = this.data.prevMonthDays[index].date;
      // 如果选择的是上个月的日期，自动切换到上个月
      this.switchToPrevMonth();
    } else if (type === 'next') {
      date = this.data.nextMonthDays[index].date;
      // 如果选择的是下个月的日期，自动切换到下个月
      this.switchToNextMonth();
    }
    
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    
    const isToday = date === this.data.dateString;
    
    // 更新选中的日期
    this.setData({
      selectedDate: date,
      isToday: isToday
    });
    
    // 更新日期样式
    this.updateSelectedDay(date);
    
    // 获取选中日期的日程
    this.getSelectedDayEvents(date);
  },
  
  // 更新选中日期的样式
  updateSelectedDay: function(selectedDate) {
    const days = this.data.days.map(day => ({
      ...day,
      isSelected: day.date === selectedDate
    }));
    
    this.setData({
      days: days
    });
  },
  
  // 获取选中日期的日程
  getSelectedDayEvents: function(date) {
    const events = this.data.monthEvents[date] || [];
    
    this.setData({
      todayEvents: events
    });
  },
  
  // 获取农历日期
  getLunarDay: function(date) {
    // 实际应用中应调用农历算法库或API
    // 这里简化处理，返回固定格式
    return '初一'; // 假设为初一
  },
  
  // 更新今日农历信息
  updateTodayLunarInfo: function() {
    // 实际应用中应调用农历算法库或API
    // 这里使用模拟数据
    const lunarInfo = {
      date: '正月初一',
      festival: '春节',
      term: '立春',
      zodiac: '兔'
    };
    
    this.setData({
      lunarInfo: lunarInfo
    });
  },
  
  // 获取天气信息
  getWeatherInfo: function() {
    // 实际应用中应调用天气API
    // 这里使用模拟数据
    const weatherInfo = {
      city: '北京',
      current: {
        temp: '25°',
        condition: '晴',
        icon: 'sunny',
        updated: '10:00'
      },
      forecast: [
        { date: '今天', high: '25°', low: '15°', condition: '晴', icon: 'sunny' },
        { date: '明天', high: '26°', low: '16°', condition: '多云', icon: 'cloudy' },
        { date: '后天', high: '24°', low: '14°', condition: '阴', icon: 'overcast' }
      ]
    };
    
    this.setData({
      weather: weatherInfo
    });
  },
  
  // 加载日程信息
  loadEvents: function() {
    // 从本地存储获取所有日程
    const allEvents = wx.getStorageSync('events') || [];
    
    // 获取本月所有日程
    const monthEvents = {};
    
    // 按日期分组
    allEvents.forEach(event => {
      const date = event.date;
      if (!monthEvents[date]) {
        monthEvents[date] = [];
      }
      monthEvents[date].push(event);
    });
    
    // 获取今日日程
    const todayEvents = monthEvents[this.data.dateString] || [];
    
    // 标记有日程的日期
    const days = this.data.days.map(day => ({
      ...day,
      hasEvent: monthEvents[day.date] && monthEvents[day.date].length > 0
    }));
    
    this.setData({
      monthEvents: monthEvents,
      todayEvents: todayEvents,
      days: days
    });
  },
  
  // 获取用户设置
  getSettings: function() {
    // 从本地存储或全局数据获取设置
    const appSettings = wx.getStorageSync('appSettings') || app.globalData.appSettings || {};
    
    // 更新显示设置
    if (appSettings.calendar) {
      this.setData({
        viewType: appSettings.calendar.defaultView || 'month',
        showLunar: appSettings.calendar.showLunar !== undefined ? appSettings.calendar.showLunar : true,
        showHoliday: appSettings.calendar.showHoliday !== undefined ? appSettings.calendar.showHoliday : true
      });
    }
  },
  
  // 长按日期显示快捷菜单
  onDateLongPress: function(e) {
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type;
    let date;
    
    if (type === 'current') {
      date = this.data.days[index].date;
    } else if (type === 'prev') {
      date = this.data.prevMonthDays[index].date;
    } else if (type === 'next') {
      date = this.data.nextMonthDays[index].date;
    }
    
    wx.showActionSheet({
      itemList: ['查看详情', '添加日程'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 查看日期详情
          this.navigateToDayDetail(date);
        } else if (res.tapIndex === 1) {
          // 添加日程
          this.navigateToAddEvent(date);
        }
      }
    });
  },
  
  // 跳转到日期详情页
  navigateToDayDetail: function(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    
    wx.navigateTo({
      url: `/pages/day-detail/day-detail?year=${year}&month=${month}&day=${day}`
    });
  },
  
  // 跳转到添加日程页
  navigateToAddEvent: function(date) {
    wx.navigateTo({
      url: `/pages/add-event/add-event?date=${date}`
    });
  },
  
  // 跳转到城市选择页面
  navigateToCitySelect: function() {
    wx.navigateTo({
      url: '/pages/location-select/location-select'
    });
  },
  
  // 跳转到搜索页面
  navigateToSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },
  
  // 跳转到日程详情页面
  navigateToEventDetail: function(e) {
    const eventId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/day-detail/day-detail?date=${this.data.selectedDate}&eventId=${eventId}`
    });
  }
}) 