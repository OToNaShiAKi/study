// components/answer/answer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    publishID: String,
    userInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    comment: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getInput(event) {
      this.setData({ comment: event.detail.value.trim() });
    },
    publish() {
      wx.showLoading({ title: '安全校验' })
      wx.cloud.callFunction({
        name: "sendComment",
        data: this.data
      }).then(res => {
        if (res.result.status !== 200) throw res;
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: res.result.message,
        })
        this.setData({ show: true })
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: err.result.message,
        })
      })
    },
  }
})
