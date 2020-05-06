// components/stageCard/stageCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stage: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    open: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    detail() {
      this.setData({
        open: !this.data.open
      })
    }
  }
})
