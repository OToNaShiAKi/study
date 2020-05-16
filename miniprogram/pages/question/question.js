// miniprogram/pages/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    questions: [],
    total: 0,
    key: ''
  },

  onLoad() {
    wx.startPullDownRefresh()
  },

  onPullDownRefresh() {
    this.loadQuestion((questions, total) => {
      wx.stopPullDownRefresh()
      this.setData({ questions, total })
    })
  },

  onReachBottom() {
    const old = this.data.questions;
    if (old.length < this.data.total) {
      const limit = 9;
      this.loadQuestion((questions, total) => {
        questions = old.concat(questions)
        this.setData({ questions, total })
      }, old.length / limit)
    }
  },

  onShareAppMessage(page) {
    if(page.from === 'button') {
      const id = page.target.id;
      for(let question of this.data.questions) {
        if(question._id === id) {
          let title = question.question.desc;
          return {
            title: title.length > 6 ? title.slice(0, 6) + '…' : title,
            path: 'pages/question/question',
            imageUrl: question.question.fileIDs[0]
          }
        }
      }
    }
  },

  loadQuestion(call, page = 0) {
    wx.cloud.callFunction({
      name: "getPublish",
      data: { page, key: this.data.key },
    }).then(res => {
      let {questions, total} = res.result;
      for (let question of questions)
        question.time = new Date(question.time).toLocaleString();
      call && call(questions, total);
    })
  },

  search(event) {
    this.setData({ key: event.detail });
    wx.startPullDownRefresh()
  },

  publish() {
    wx.getSetting({
      success: res => {
        const info = res.authSetting["scope.userInfo"];
        if(info) 
          wx.getUserInfo({
            success: this.userInfo.bind(this)
          })
        else 
          this.setData({ show: false })
      }
    })
  },

  userInfo(event) {
    if(this.data.show)
      event = event.userInfo;
    else {
      this.setData({ show: true });
      event = event.detail;
    }
    delete event.language;
    delete event.city;
    delete event.country;
    delete event.gender;
    delete event.province;
    wx.navigateTo({
      url: '/pages/publish/publish',
      success: res => {
        res.eventChannel.emit('userInfo', event)
      }
    })
  }
})