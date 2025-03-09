Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 图标名称
    name: {
      type: String,
      value: ''
    },
    // 图标大小（rpx单位）
    size: {
      type: Number,
      value: 32
    },
    // 图标颜色
    color: {
      type: String,
      value: 'inherit' // 默认继承父元素颜色
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    svgPath: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function() {
      // 计算SVG图标的路径
      if (this.data.name) {
        this.setData({
          svgPath: `/app/assets/icons/${this.data.name}.svg`
        });
      }
    }
  },

  /**
   * 监听属性变化
   */
  observers: {
    'name': function(name) {
      if (name) {
        this.setData({
          svgPath: `/app/assets/icons/${name}.svg`
        });
      } else {
        this.setData({
          svgPath: ''
        });
      }
    }
  }
}) 