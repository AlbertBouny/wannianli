/**
 * 工具函数集合
 */

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {String} format - 格式字符串(yyyy-MM-dd HH:mm:ss)
 * @return {String} 格式化后的日期字符串
 */
const formatDate = (date, format = 'yyyy-MM-dd') => {
  if (!date) return '';
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'));
  }
  if (typeof date === 'number') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  
  return format.replace(/yyyy/g, year)
    .replace(/MM/g, month < 10 ? '0' + month : month)
    .replace(/dd/g, day < 10 ? '0' + day : day)
    .replace(/HH/g, hour < 10 ? '0' + hour : hour)
    .replace(/mm/g, minute < 10 ? '0' + minute : minute)
    .replace(/ss/g, second < 10 ? '0' + second : second);
};

/**
 * 解析日期字符串为Date对象
 * @param {String} dateString - 日期字符串，格式如 "2023-09-08"
 * @return {Date} 日期对象
 */
const parseDate = (dateString) => {
  if (!dateString) return new Date();
  
  // 处理 yyyy-MM-dd 格式
  if (dateString.indexOf('-') > -1) {
    return new Date(dateString.replace(/-/g, '/'));
  }
  
  // 如果是时间戳
  if (!isNaN(dateString)) {
    return new Date(parseInt(dateString));
  }
  
  return new Date(dateString);
};

/**
 * 在给定日期上增加或减少天数
 * @param {Date} date - 日期对象
 * @param {Number} days - 要增加或减少的天数
 * @return {Date} 新的日期对象
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * 格式化数字，保留指定小数位数
 * @param {Number} num - 数字
 * @param {Number} digits - 小数位数
 * @return {String} 格式化后的数字字符串
 */
const formatNumber = (num, digits = 2) => {
  return parseFloat(num.toFixed(digits)).toString();
};

/**
 * 获取当前日期是星期几
 * @param {Date} date - 日期对象
 * @return {String} 星期几
 */
const getWeekday = (date) => {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return '周' + weekdays[date.getDay()];
};

/**
 * 计算两个日期之间的天数差
 * @param {Date} date1 - 日期1
 * @param {Date} date2 - 日期2
 * @return {Number} 天数差
 */
const daysBetween = (date1, date2) => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * 判断是否为同一天
 * @param {Date} date1 - 日期1
 * @param {Date} date2 - 日期2
 * @return {Boolean} 是否为同一天
 */
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @return {Object} 拷贝后的对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  const result = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
};

module.exports = {
  formatDate,
  parseDate,
  addDays,
  formatNumber,
  getWeekday,
  daysBetween,
  isSameDay,
  deepClone
}; 