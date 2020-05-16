// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveClass: {},
    freeClass: [],
    active: 0,
    stageClass: [],
    more: false,
    load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "getLiveClass"
    }).then(res => {
      let more = this.data.stageClass.length + res.result.stage.classes.length < res.result.stage.count;
      this.setData({
        liveClass: res.result.live,
        freeClass: res.result.free,
        stageClass: res.result.stage.classes,
        more,
      })
    }).finally(() => {
      this.setData({ load: false })
    })
  },

  jumpTo(event) {
    let jump = event.currentTarget.dataset.jump;
    jump.fail = err => {
      wx.showToast({
        icon: 'none',
        title: '打开三方小程序失败'
      })
    }
    wx.navigateToMiniProgram(jump);
  },

  swiperSwitch(event) {
    this.setData({
      active: event.detail.current
    })
  },

  loadMore() {
    this.setData({ load: true })
    const limit = 3;
    let stageClass = this.data.stageClass
    const page = stageClass.length / limit;
    wx.cloud.callFunction({
      name: "getStageClass",
      data: { page }
    }).then(res => {
      let classes = res.result.classes
      let more = stageClass.length + classes.length < res.result.count;
      this.setData({
        stageClass: stageClass.concat(classes), 
        more 
      })
    }).finally(() => {
      this.setData({ load: false })
    })
  }
})