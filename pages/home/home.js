// pages/home/home.js
const app = getApp()

Page({
  data: {
    // 日历数据
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    selectedDate: new Date().toISOString().substring(0, 10), // 格式：YYYY-MM-DD
    viewMode: 'month', // month 或 week
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    dayRows: [], // 月视图的日期行数据
    currentWeek: [], // 周视图的日期数据
    
    // 选中日期的信息
    selectedDayInfo: {
      day: new Date().getDate(),
      weekday: '周' + '日一二三四五六'[new Date().getDay()],
      lunarMonth: '正月',  // 示例数据，实际应该根据农历转换
      lunarDay: '初一'     // 示例数据，实际应该根据农历转换
    },
    
    // 当日黄历数据
    todayAlmanac: {
      good: '祭祀 出行 搬家 入宅',
      bad: '安葬 开市 动土 破土'
    },
    
    // 天气数据
    weatherInfo: {
      city: '北京',
      temperature: 25,
      condition: '晴',
      low: 18,
      high: 27
    },
    
    // 事件数据
    events: [
      {
        id: 1,
        title: '产品讨论会',
        startTime: '09:30',
        endTime: '11:00',
        location: '会议室A',
        type: '工作',
        color: '#4A6FDC'
      },
      {
        id: 2,
        title: '午餐约会',
        startTime: '12:30',
        endTime: '13:30',
        location: '意大利餐厅',
        type: '个人',
        color: '#E67C73'
      }
    ]
  },
  
  onLoad: function (options) {
    // 初始化日历数据
    this.initCalendarData();
    
    // 获取天气数据
    this.getWeatherData();
    
    // 获取黄历数据
    this.getAlmanacData();
    
    // 获取事件数据
    this.getEventData();
  },
  
  onShow: function() {
    // 更新自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0  // 首页是第一个tab，索引为0
      });
    }
  },
  
  // 初始化日历数据
  initCalendarData: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const today = now.getDate();
    
    this.generateCalendarData(year, month, today);
  },
  
  // 生成日历数据
  generateCalendarData: function(year, month, selectedDay) {
    // 获取当月第一天是星期几
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    
    // 获取当月天数
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // 获取上个月天数
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
    
    // 生成日历网格数据（6行7列）
    let dayRows = [];
    let dayCount = 1;
    let nextMonthDay = 1;
    
    // 生成6行日期数据
    for (let i = 0; i < 6; i++) {
      let days = [];
      
      // 每行7列（周日到周六）
      for (let j = 0; j < 7; j++) {
        let day = {};
        
        // 第一行中，如果未到当月第一天，显示上月日期
        if (i === 0 && j < firstDayOfMonth) {
          day = {
            day: daysInPrevMonth - (firstDayOfMonth - j - 1),
            lunarDay: '廿九', // 示例数据，实际需要转换
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
            isWeekend: j === 0 || j === 6,
            fullDate: `${year}-${month === 1 ? 12 : month - 1}-${daysInPrevMonth - (firstDayOfMonth - j - 1)}`,
            eventCount: 0
          };
        } 
        // 当月日期
        else if (dayCount <= daysInMonth) {
          const isToday = year === new Date().getFullYear() && 
                         month === new Date().getMonth() + 1 && 
                         dayCount === new Date().getDate();
          
          day = {
            day: dayCount,
            lunarDay: this.getLunarDay(dayCount), // 示例函数，需要实现
            isCurrentMonth: true,
            isToday: isToday,
            isSelected: dayCount === selectedDay,
            isWeekend: j === 0 || j === 6,
            fullDate: `${year}-${month < 10 ? '0' + month : month}-${dayCount < 10 ? '0' + dayCount : dayCount}`,
            eventCount: this.getEventCountForDate(year, month, dayCount) // 示例函数，需要实现
          };
          dayCount++;
        } 
        // 下个月日期
        else {
          day = {
            day: nextMonthDay,
            lunarDay: '初一', // 示例数据，实际需要转换
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
            isWeekend: j === 0 || j === 6,
            fullDate: `${year}-${month === 12 ? 1 : month + 1}-${nextMonthDay < 10 ? '0' + nextMonthDay : nextMonthDay}`,
            eventCount: 0
          };
          nextMonthDay++;
        }
        
        days.push(day);
      }
      
      dayRows.push({ days: days });
      
      // 如果已经生成完当月所有日期且已进入下月，可以提前结束
      if (dayCount > daysInMonth && i >= 4) {
        break;
      }
    }
    
    // 更新数据
    this.setData({
      currentYear: year,
      currentMonth: month,
      dayRows: dayRows,
      // 同时更新周视图数据（假设选中日期所在的周）
      currentWeek: this.getWeekData(year, month, selectedDay || new Date().getDate())
    });
  },
  
  // 获取周视图数据
  getWeekData: function(year, month, day) {
    // 获取指定日期是星期几（0-6）
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    
    // 计算本周第一天（周日）的日期
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - dayOfWeek);
    
    // 生成本周7天的数据
    let weekData = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(firstDayOfWeek);
      currentDate.setDate(firstDayOfWeek.getDate() + i);
      
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();
      
      const isToday = currentYear === new Date().getFullYear() && 
                     currentMonth === new Date().getMonth() + 1 && 
                     currentDay === new Date().getDate();
      
      weekData.push({
        day: currentDay,
        lunarDay: this.getLunarDay(currentDay), // 示例函数，需要实现
        isToday: isToday,
        isSelected: currentYear === year && currentMonth === month && currentDay === day,
        isWeekend: i === 0 || i === 6,
        fullDate: `${currentYear}-${currentMonth < 10 ? '0' + currentMonth : currentMonth}-${currentDay < 10 ? '0' + currentDay : currentDay}`,
        eventCount: this.getEventCountForDate(currentYear, currentMonth, currentDay) // 示例函数，需要实现
      });
    }
    
    return weekData;
  },
  
  // 日期切换处理
  dateChange: function(e) {
    const dateStr = e.detail.value; // 格式为 "YYYY-MM" 或 "YYYY-MM-DD"
    const dateParts = dateStr.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    
    // 更新日历数据
    this.generateCalendarData(year, month, 1); // 默认选中当月1号
    
    // 更新选中日期信息
    this.updateSelectedDayInfo(year, month, 1);
  },
  
  // 返回今天
  goToToday: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 更新日历数据
    this.generateCalendarData(year, month, day);
    
    // 更新选中日期信息
    this.updateSelectedDayInfo(year, month, day);
    
    // 更新选中日期
    this.setData({
      selectedDate: `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    });
  },
  
  // 切换视图模式（月/周）
  switchMode: function(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      viewMode: mode
    });
  },
  
  // 选择日期
  selectDate: function(e) {
    const dateStr = e.currentTarget.dataset.date; // 格式为 "YYYY-MM-DD"
    const dateParts = dateStr.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    
    // 如果选择的是非当前月份的日期，需要切换月份
    if (month !== this.data.currentMonth) {
      this.generateCalendarData(year, month, day);
    } else {
      // 仅更新选中状态
      this.updateSelectedState(day);
    }
    
    // 更新选中日期信息
    this.updateSelectedDayInfo(year, month, day);
    
    // 更新选中日期
    this.setData({
      selectedDate: dateStr
    });
    
    // 获取选中日期的事件数据
    this.getEventData(dateStr);
  },
  
  // 更新选中状态
  updateSelectedState: function(selectedDay) {
    let dayRows = this.data.dayRows;
    let currentWeek = this.data.currentWeek;
    
    // 更新月视图选中状态
    for (let i = 0; i < dayRows.length; i++) {
      for (let j = 0; j < dayRows[i].days.length; j++) {
        if (dayRows[i].days[j].isCurrentMonth && dayRows[i].days[j].day === selectedDay) {
          dayRows[i].days[j].isSelected = true;
        } else {
          dayRows[i].days[j].isSelected = false;
        }
      }
    }
    
    // 更新周视图选中状态
    for (let i = 0; i < currentWeek.length; i++) {
      if (currentWeek[i].day === selectedDay && currentWeek[i].isCurrentMonth) {
        currentWeek[i].isSelected = true;
      } else {
        currentWeek[i].isSelected = false;
      }
    }
    
    this.setData({
      dayRows: dayRows,
      currentWeek: currentWeek
    });
  },
  
  // 更新选中日期信息
  updateSelectedDayInfo: function(year, month, day) {
    const date = new Date(year, month - 1, day);
    const weekday = '周' + '日一二三四五六'[date.getDay()];
    
    // 获取农历信息（示例，实际需要转换）
    const lunarInfo = this.getLunarInfo(year, month, day);
    
    this.setData({
      selectedDayInfo: {
        day: day,
        weekday: weekday,
        lunarMonth: lunarInfo.lunarMonth,
        lunarDay: lunarInfo.lunarDay
      }
    });
  },
  
  // 获取事件数据
  getEventData: function(dateStr) {
    // 模拟获取事件数据，实际应从本地存储或服务器获取
    let events = [];
    
    // 如果未指定日期，使用当前选中日期
    if (!dateStr) {
      dateStr = this.data.selectedDate;
    }
    
    // 模拟数据
    if (dateStr === this.formatDate(new Date())) {
      events = [
        {
          id: 1,
          title: '产品讨论会',
          startTime: '09:30',
          endTime: '11:00',
          location: '会议室A',
          type: '工作',
          color: '#4A6FDC'
        },
        {
          id: 2,
          title: '午餐约会',
          startTime: '12:30',
          endTime: '13:30',
          location: '意大利餐厅',
          type: '个人',
          color: '#E67C73'
        }
      ];
    } else {
      // 其他日期随机生成0-3个事件
      const eventCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < eventCount; i++) {
        events.push({
          id: 100 + i,
          title: `示例事件 ${i + 1}`,
          startTime: `${10 + i}:00`,
          endTime: `${11 + i}:00`,
          location: i % 2 === 0 ? '公司' : '家里',
          type: i % 2 === 0 ? '工作' : '个人',
          color: i % 2 === 0 ? '#4A6FDC' : '#E67C73'
        });
      }
    }
    
    this.setData({
      events: events
    });
  },
  
  // 获取天气数据
  getWeatherData: function() {
    // 模拟获取天气数据，实际应从API获取
    // 随机一个天气状况
    const conditions = ['晴', '多云', '小雨', '阴', '雷阵雨', '小雪'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // 随机气温
    const temp = Math.floor(15 + Math.random() * 15);
    const low = temp - Math.floor(Math.random() * 8);
    const high = temp + Math.floor(Math.random() * 8);
    
    this.setData({
      weatherInfo: {
        city: '北京',
        temperature: temp,
        condition: randomCondition,
        low: low,
        high: high
      }
    });
  },
  
  // 获取黄历数据
  getAlmanacData: function() {
    // 模拟获取黄历数据，实际应从API或本地数据获取
    const goodThings = ['祭祀', '出行', '搬家', '入宅', '开市', '安床', '理发', '修造', '动土', '上梁'];
    const badThings = ['安葬', '开光', '破土', '行丧', '伐木', '作梁', '嫁娶', '出行', '安门'];
    
    // 随机生成宜忌项目
    const goodCount = 2 + Math.floor(Math.random() * 3);
    const badCount = 2 + Math.floor(Math.random() * 3);
    
    let good = [];
    let bad = [];
    
    for (let i = 0; i < goodCount; i++) {
      good.push(goodThings[Math.floor(Math.random() * goodThings.length)]);
    }
    
    for (let i = 0; i < badCount; i++) {
      bad.push(badThings[Math.floor(Math.random() * badThings.length)]);
    }
    
    this.setData({
      todayAlmanac: {
        good: [...new Set(good)].join(' '), // 去重
        bad: [...new Set(bad)].join(' ')    // 去重
      }
    });
  },
  
  // 跳转到添加事件页面
  addEvent: function() {
    wx.navigateTo({
      url: `/pages/add-event/add-event?date=${this.data.selectedDate}`
    });
  },
  
  // 查看事件详情
  viewEvent: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/day-detail/day-detail?date=${this.data.selectedDate}&eventId=${id}`
    });
  },
  
  // 跳转到黄历页面
  goToAlmanac: function() {
    wx.navigateTo({
      url: `/pages/almanac/almanac?date=${this.data.selectedDate}`
    });
  },
  
  // 跳转到天气页面
  goToWeather: function() {
    wx.switchTab({
      url: '/pages/weather/weather'
    });
  },
  
  // 工具函数：获取某日期的农历信息（示例实现）
  getLunarInfo: function(year, month, day) {
    // 实际应使用农历转换库，这里返回示例数据
    return {
      lunarMonth: '正月',
      lunarDay: '初一'
    };
  },
  
  // 工具函数：获取某日的农历日（示例实现）
  getLunarDay: function(day) {
    // 示例数据，实际需要使用农历转换库
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                     '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                     '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    return lunarDays[(day - 1) % 30];
  },
  
  // 工具函数：获取某日的事件数量（示例实现）
  getEventCountForDate: function(year, month, day) {
    // 示例实现，实际应查询数据库或本地存储
    return Math.floor(Math.random() * 3); // 随机返回0-2的数量
  },
  
  // 工具函数：格式化日期为YYYY-MM-DD
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
}) 