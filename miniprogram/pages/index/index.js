// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveClass: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "getLiveClass"
    }).then(res => {
      this.setData({
        liveClass: res.result
      })
    })
  },

  jumpTo() {
    let jump = this.data.liveClass.jump;
    jump.fail = err => {
      wx.showToast({
        title: '打开三方小程序失败',
        icon: 'none'
      })
    }
    wx.navigateToMiniProgram(jump);
  }
})