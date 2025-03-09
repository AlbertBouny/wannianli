// 提示：自定义tabBar组件应该位于项目根目录下的custom-tab-bar文件夹中
// 该文件只是作为过渡，指向正确目录的组件
console.warn('警告：自定义tabBar正在使用错误路径，请将tabBar组件移至项目根目录下的custom-tab-bar文件夹中');

// 导入正确路径下的组件
const correctTabBar = require('../../custom-tab-bar/index.js');

// 导出正确的组件
module.exports = correctTabBar; 