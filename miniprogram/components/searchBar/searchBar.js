// components/searchBar/searchBar.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    value: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search() {
      this.triggerEvent('search', this.data.value)
    },
    searchKey(event) {
      this.setData({ value: event.detail.value.trim() })
    }
  }
})
