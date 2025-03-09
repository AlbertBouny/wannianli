// 添加日程页 JavaScript
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    // 当前模式：添加/编辑
    isEdit: false,
    eventId: null,
    
    // 表单数据
    title: '',
    location: '',
    notes: '',
    colorIndex: 0,
    colorList: [
      { name: '红色', value: '#e63946' },
      { name: '橙色', value: '#f77f00' },
      { name: '绿色', value: '#2a9d8f' },
      { name: '蓝色', value: '#1d3557' },
      { name: '紫色', value: '#7209b7' }
    ],
    
    // 日期时间
    date: '',
    startTime: '08:00',
    endTime: '09:00',
    isAllDay: false,
    
    // 重复规则
    repeatIndex: 0,
    repeatOptions: [
      { id: 'none', name: '不重复' },
      { id: 'daily', name: '每天' },
      { id: 'weekly', name: '每周' },
      { id: 'monthly', name: '每月' },
      { id: 'yearly', name: '每年' },
      { id: 'custom', name: '自定义' }
    ],
    
    // 提醒设置
    reminderIndex: 0,
    reminderOptions: [
      { id: 'none', name: '无提醒', value: 0 },
      { id: 'on_time', name: '事件开始时', value: 0 },
      { id: '5min', name: '5分钟前', value: 5 },
      { id: '15min', name: '15分钟前', value: 15 },
      { id: '30min', name: '30分钟前', value: 30 },
      { id: '1hour', name: '1小时前', value: 60 },
      { id: '2hour', name: '2小时前', value: 120 },
      { id: '1day', name: '1天前', value: 1440 },
      { id: '2day', name: '2天前', value: 2880 }
    ],
    
    // 分类和标签
    categoryIndex: 0,
    categoryOptions: [
      { id: 'default', name: '默认' },
      { id: 'work', name: '工作' },
      { id: 'personal', name: '个人' },
      { id: 'family', name: '家庭' },
      { id: 'holiday', name: '节假日' }
    ],
    tags: [],
    tagInput: '',
    
    // 农历信息
    lunarDate: '',
    lunarInfo: {
      lunar: '',
      suitable: [],
      avoid: []
    },
    showLunarInfo: true
  },
  
  onLoad: function(options) {
    // 从上一个页面传入的日期参数
    let date = options.date || util.formatDate(new Date());
    
    // 默认时间设置
    const now = new Date();
    let startHour = now.getHours();
    let startMinute = Math.ceil(now.getMinutes() / 5) * 5; // 将分钟向上取整到5的倍数
    
    // 如果分钟大于55，小时+1，分钟设为0
    if (startMinute >= 60) {
      startHour += 1;
      startMinute = 0;
    }
    
    // 如果小时超过23，设为23:55
    if (startHour >= 24) {
      startHour = 23;
      startMinute = 55;
    }
    
    // 格式化时间
    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    
    // 计算结束时间（默认开始时间后1小时）
    let endHour = startHour + 1;
    let endMinute = startMinute;
    
    // 如果结束小时超过23，设为23:59
    if (endHour >= 24) {
      endHour = 23;
      endMinute = 59;
    }
    
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    this.setData({
      date: date,
      startTime: startTime,
      endTime: endTime
    });
    
    // 获取并设置农历信息
    this.updateLunarInfo(date);
    
    // 编辑模式
    if (options.id) {
      this.loadEventData(options.id);
    }
  },
  
  // 加载农历信息
  updateLunarInfo: function(dateStr) {
    // 实际应用中应调用API或使用算法库计算农历信息
    // 这里使用模拟数据
    const lunarInfo = {
      lunar: '农历二月初三',
      suitable: ['祭祀', '出行', '订婚', '搬家'],
      avoid: ['安葬', '开工', '开张']
    };
    
    this.setData({
      lunarDate: dateStr,
      lunarInfo: lunarInfo
    });
  },
  
  // 加载已有事件数据（编辑模式）
  loadEventData: function(id) {
    // 实际应用中应从本地存储或服务器获取事件数据
    // 这里使用模拟数据
    const eventData = {
      id: id,
      title: '工作会议',
      location: '公司会议室',
      notes: '准备项目进度报告',
      colorIndex: 2, // 绿色
      date: '2023-03-15',
      startTime: '14:00',
      endTime: '16:00',
      isAllDay: false,
      repeatIndex: 1, // 每天
      reminderIndex: 3, // 15分钟前
      categoryIndex: 1, // 工作
      tags: ['项目', '会议']
    };
    
    this.setData({
      isEdit: true,
      eventId: id,
      ...eventData
    });
    
    // 更新农历信息
    this.updateLunarInfo(eventData.date);
  },
  
  // 表单输入处理
  onTitleInput: function(e) {
    this.setData({
      title: e.detail.value
    });
  },
  
  onLocationInput: function(e) {
    this.setData({
      location: e.detail.value
    });
  },
  
  onNotesInput: function(e) {
    this.setData({
      notes: e.detail.value
    });
  },
  
  // 日期选择
  onDateChange: function(e) {
    const date = e.detail.value;
    this.setData({
      date: date
    });
    
    // 更新农历信息
    this.updateLunarInfo(date);
  },
  
  // 时间选择
  onStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    });
  },
  
  onEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    });
  },
  
  // 全天事件切换
  onAllDayChange: function(e) {
    const isAllDay = e.detail.value;
    this.setData({
      isAllDay: isAllDay
    });
    
    // 如果是全天事件，设置开始时间为00:00，结束时间为23:59
    if (isAllDay) {
      this.setData({
        startTime: '00:00',
        endTime: '23:59'
      });
    }
  },
  
  // 重复规则选择
  onRepeatChange: function(e) {
    this.setData({
      repeatIndex: e.detail.value
    });
  },
  
  // 提醒设置选择
  onReminderChange: function(e) {
    this.setData({
      reminderIndex: e.detail.value
    });
  },
  
  // 分类选择
  onCategoryChange: function(e) {
    this.setData({
      categoryIndex: e.detail.value
    });
  },
  
  // 颜色选择
  onColorChange: function(e) {
    this.setData({
      colorIndex: e.detail.value
    });
  },
  
  // 农历信息显示/隐藏
  toggleLunarInfo: function() {
    this.setData({
      showLunarInfo: !this.data.showLunarInfo
    });
  },
  
  // 标签管理
  onTagInput: function(e) {
    this.setData({
      tagInput: e.detail.value
    });
  },
  
  addTag: function() {
    const tag = this.data.tagInput.trim();
    if (tag && this.data.tags.indexOf(tag) === -1) {
      this.setData({
        tags: [...this.data.tags, tag],
        tagInput: ''
      });
    }
  },
  
  removeTag: function(e) {
    const index = e.currentTarget.dataset.index;
    const tags = this.data.tags.filter((_, i) => i !== index);
    this.setData({
      tags: tags
    });
  },
  
  // 验证表单数据
  validateForm: function() {
    if (!this.data.title.trim()) {
      wx.showToast({
        title: '请输入日程标题',
        icon: 'none'
      });
      return false;
    }
    
    // 验证开始时间不晚于结束时间
    if (!this.data.isAllDay) {
      if (this.data.startTime > this.data.endTime) {
        wx.showToast({
          title: '开始时间不能晚于结束时间',
          icon: 'none'
        });
        return false;
      }
    }
    
    return true;
  },
  
  // 保存事件
  saveEvent: function() {
    if (!this.validateForm()) return;
    
    // 构建事件数据
    const eventData = {
      id: this.data.isEdit ? this.data.eventId : `event_${Date.now()}`,
      title: this.data.title,
      location: this.data.location,
      notes: this.data.notes,
      color: this.data.colorList[this.data.colorIndex].value,
      colorName: this.data.colorList[this.data.colorIndex].name,
      date: this.data.date,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      isAllDay: this.data.isAllDay,
      repeat: this.data.repeatOptions[this.data.repeatIndex].id,
      repeatName: this.data.repeatOptions[this.data.repeatIndex].name,
      reminder: this.data.reminderOptions[this.data.reminderIndex].id,
      reminderName: this.data.reminderOptions[this.data.reminderIndex].name,
      reminderValue: this.data.reminderOptions[this.data.reminderIndex].value,
      category: this.data.categoryOptions[this.data.categoryIndex].id,
      categoryName: this.data.categoryOptions[this.data.categoryIndex].name,
      tags: this.data.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 实际应用中应将事件数据保存到本地存储或服务器
    // 这里模拟保存操作
    console.log('保存事件数据', eventData);
    
    // 获取已有事件列表
    let events = wx.getStorageSync('events') || [];
    
    // 如果是编辑模式，更新现有事件
    if (this.data.isEdit) {
      events = events.map(event => event.id === eventData.id ? eventData : event);
    } else {
      // 添加新事件
      events.push(eventData);
    }
    
    // 保存到本地存储
    wx.setStorageSync('events', events);
    
    // 设置提醒（实际应用中应使用小程序订阅消息API）
    if (eventData.reminderValue > 0) {
      console.log(`已设置提醒：${eventData.reminderName}`);
    }
    
    // 提示保存成功并返回
    wx.showToast({
      title: this.data.isEdit ? '修改成功' : '添加成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  },
  
  // 删除事件
  deleteEvent: function() {
    if (!this.data.isEdit) return;
    
    wx.showModal({
      title: '删除确认',
      content: '确定要删除此日程吗？',
      success: (res) => {
        if (res.confirm) {
          // 获取已有事件列表
          let events = wx.getStorageSync('events') || [];
          
          // 过滤掉要删除的事件
          events = events.filter(event => event.id !== this.data.eventId);
          
          // 保存到本地存储
          wx.setStorageSync('events', events);
          
          // 提示删除成功并返回
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            }
          });
        }
      }
    });
  },
  
  // 取消编辑并返回
  cancelEdit: function() {
    // 如果表单已修改，显示确认对话框
    if (this.data.title || this.data.location || this.data.notes) {
      wx.showModal({
        title: '放弃编辑',
        content: '确定放弃当前编辑内容吗？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  }
}); 