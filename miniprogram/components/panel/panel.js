// components/panel/panel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: String
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({ show: true })
    }
  }
})
