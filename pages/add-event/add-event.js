// 添加日程页 JavaScript
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    // 表单数据
    formData: {
      id: '',  // 编辑时使用
      title: '',
      description: '',
      location: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      isAllDay: false,
      repeat: 'none',  // none, daily, weekly, monthly, yearly
      color: '#e63946',
      reminderTime: '15',  // 提前多少分钟提醒，为空则不提醒
    },
    
    // 日期选择器
    datePicker: {
      current: '',
      start: '2000-01-01',
      end: '2050-12-31'
    },
    
    // 时间选择器
    startTimePicker: {
      start: '00:00',
      end: '23:59'
    },
    endTimePicker: {
      start: '00:00',
      end: '23:59'
    },
    
    // 重复选项
    repeatOptions: [
      { value: 'none', name: '不重复' },
      { value: 'daily', name: '每天' },
      { value: 'weekly', name: '每周' },
      { value: 'monthly', name: '每月' },
      { value: 'yearly', name: '每年' }
    ],
    
    // 提醒时间选项
    reminderOptions: [
      { value: '', name: '不提醒' },
      { value: '0', name: '事件开始时' },
      { value: '5', name: '提前5分钟' },
      { value: '15', name: '提前15分钟' },
      { value: '30', name: '提前30分钟' },
      { value: '60', name: '提前1小时' },
      { value: '1440', name: '提前1天' }
    ],
    
    // 颜色选项
    colorOptions: [
      { value: '#e63946', name: '红色' },
      { value: '#f9a826', name: '橙色' },
      { value: '#2a9d8f', name: '绿色' },
      { value: '#457b9d', name: '蓝色' },
      { value: '#6a4c93', name: '紫色' }
    ],
    
    // 农历信息
    lunarInfo: {
      lunarMonth: '',
      lunarDay: '',
      lunarDate: '',
      suit: [],
      avoid: []
    },
    
    // 页面状态
    isEdit: false,
    loading: false
  },

  onLoad: function (options) {
    // 设置初始日期
    let initialDate = new Date();
    let dateString = util.formatDate(initialDate);
    
    // 如果有传入的日期参数，则使用传入的日期
    if (options.year && options.month && options.day) {
      const year = parseInt(options.year);
      const month = parseInt(options.month);
      const day = parseInt(options.day);
      
      initialDate = new Date(year, month - 1, day);
      dateString = util.formatDate(initialDate);
    }
    
    // 设置日期选择器范围
    const currentYear = new Date().getFullYear();
    this.setData({
      'datePicker.current': dateString,
      'datePicker.start': (currentYear - 5) + '-01-01',
      'datePicker.end': (currentYear + 5) + '-12-31',
      'formData.date': dateString
    });
    
    // 加载农历信息
    this.loadLunarInfo(dateString);
    
    // 如果有传入的事件ID，则是编辑模式
    if (options.id) {
      this.setData({
        isEdit: true,
        'formData.id': options.id
      });
      
      // 加载事件数据
      this.loadEventData(options.id);
    }
  },
  
  // 加载农历信息
  loadLunarInfo: function(dateString) {
    // 这里应该是实际的API调用，暂时使用模拟数据
    this.setData({
      'lunarInfo': {
        lunarMonth: '七月',
        lunarDay: '初七',
        lunarDate: '七月初七',
        suit: ['出行', '祭祀', '纳财'],
        avoid: ['安葬', '动土']
      }
    });
  },
  
  // 加载事件数据（编辑模式）
  loadEventData: function(eventId) {
    this.setData({
      loading: true
    });
    
    // 这里应该是实际的API调用，暂时使用模拟数据
    setTimeout(() => {
      if (eventId === '1') {
        this.setData({
          'formData': {
            id: '1',
            title: '产品评审会议',
            description: '讨论新功能设计与实现计划',
            location: '会议室A',
            date: this.data.formData.date,
            startTime: '14:00',
            endTime: '16:00',
            isAllDay: false,
            repeat: 'none',
            color: '#e63946',
            reminderTime: '15'
          },
          loading: false
        });
      } else if (eventId === '2') {
        this.setData({
          'formData': {
            id: '2',
            title: '家庭聚餐',
            description: '和家人共进晚餐',
            location: '福满楼餐厅',
            date: this.data.formData.date,
            startTime: '18:30',
            endTime: '20:30',
            isAllDay: false,
            repeat: 'none',
            color: '#457b9d',
            reminderTime: '60'
          },
          loading: false
        });
      } else if (eventId === '3') {
        this.setData({
          'formData': {
            id: '3',
            title: '发工资',
            description: '',
            location: '',
            date: this.data.formData.date,
            startTime: '09:00',
            endTime: '09:00',
            isAllDay: true,
            repeat: 'monthly',
            color: '#2a9d8f',
            reminderTime: ''
          },
          loading: false
        });
      } else {
        this.setData({
          loading: false
        });
        wx.showToast({
          title: '事件不存在',
          icon: 'none',
          duration: 2000
        });
        
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    }, 500);
  },
  
  // 表单输入处理
  handleInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
  },
  
  // 日期选择器变化
  bindDateChange: function(e) {
    const date = e.detail.value;
    this.setData({
      'formData.date': date
    });
    
    // 更新农历信息
    this.loadLunarInfo(date);
  },
  
  // 开始时间选择器变化
  bindStartTimeChange: function(e) {
    const time = e.detail.value;
    
    // 如果开始时间大于结束时间，自动调整结束时间
    if (time > this.data.formData.endTime) {
      this.setData({
        'formData.startTime': time,
        'formData.endTime': time
      });
    } else {
      this.setData({
        'formData.startTime': time
      });
    }
  },
  
  // 结束时间选择器变化
  bindEndTimeChange: function(e) {
    const time = e.detail.value;
    
    // 如果结束时间小于开始时间，给出提示
    if (time < this.data.formData.startTime) {
      wx.showToast({
        title: '结束时间不能早于开始时间',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    this.setData({
      'formData.endTime': time
    });
  },
  
  // 全天事件开关变化
  bindAllDayChange: function(e) {
    const isAllDay = e.detail.value;
    this.setData({
      'formData.isAllDay': isAllDay
    });
  },
  
  // 重复选项变化
  bindRepeatChange: function(e) {
    const repeatValue = this.data.repeatOptions[e.detail.value].value;
    this.setData({
      'formData.repeat': repeatValue
    });
  },
  
  // 提醒时间变化
  bindReminderChange: function(e) {
    const reminderValue = this.data.reminderOptions[e.detail.value].value;
    this.setData({
      'formData.reminderTime': reminderValue
    });
  },
  
  // 颜色选择
  selectColor: function(e) {
    const colorValue = e.currentTarget.dataset.color;
    this.setData({
      'formData.color': colorValue
    });
  },
  
  // 表单提交
  submitForm: function() {
    // 表单验证
    if (!this.data.formData.title.trim()) {
      wx.showToast({
        title: '请输入事件标题',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    this.setData({
      loading: true
    });
    
    // 这里应该是实际的API调用，暂时使用模拟数据
    setTimeout(() => {
      this.setData({
        loading: false
      });
      
      wx.showToast({
        title: this.data.isEdit ? '修改成功' : '添加成功',
        icon: 'success',
        duration: 2000
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }, 1000);
  },
  
  // 删除事件
  deleteEvent: function() {
    wx.showModal({
      title: '删除确认',
      content: '确定要删除该日程吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            loading: true
          });
          
          // 这里应该是实际的API调用，暂时使用模拟数据
          setTimeout(() => {
            this.setData({
              loading: false
            });
            
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            });
            
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
          }, 1000);
        }
      }
    });
  },
  
  // 取消编辑
  cancelEdit: function() {
    wx.navigateBack();
  }
}) 