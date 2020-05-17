// miniprogram/pages/myData/myData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mine: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.cloud.callFunction({
      name: "getMyData",
      data: {
        type: options.type
      }
    }).then(res => {
      this.setData({ mine: res.result })
    })
    if (options.type === 'publish') 
      wx.setNavigationBarTitle({ title: '我的提问' })
    else if (options.type === 'comment') 
      wx.setNavigationBarTitle({ title: '我的回答' })
  },

  onShareAppMessage(page) {
    if (page.from === 'button') {
      const id = page.target.id;
      for (let item of this.data.mine) {
        if (item._id === id) {
          let title = item.question.desc;
          return {
            title: title.length > 6 ? title.slice(0, 6) + '…' : title,
            path: 'pages/question/question',
            imageUrl: item.question.fileIDs[0]
          }
        }
      }
    }
  }
})