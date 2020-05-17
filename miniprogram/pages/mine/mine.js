// miniprogram/pages/mine/mine.js
Page({
  pageTo(event) {
    const type = event.currentTarget.id;
    wx.navigateTo({
      url: '/pages/myData/myData?type=' + type,
    })
  },

  qrcode() {
    wx.showLoading({
      title: '获取二维码'
    })
    wx.cloud.callFunction({
      name: 'miniCode'
    }).then(res => {
      wx.hideLoading();
      wx.previewImage({
        urls: [res.result]
      })
    })
  }
})