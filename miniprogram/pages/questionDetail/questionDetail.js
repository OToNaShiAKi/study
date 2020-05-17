// miniprogram/pages/questionDetail/questionDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card: {},
    comments: [],
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    const db = wx.cloud.database();
    const questions = db.collection('questions');
    this.setData({ card: { _id: options._id }})
    wx.startPullDownRefresh()
    questions.doc(options._id).get().then(res => {
      const card = res.data;
      card.time = new Date(card.time).toLocaleString();
      this.setData({ card })
    });
  },

  onPullDownRefresh(page) {
    this.loadComment((comments, total) => {
      wx.stopPullDownRefresh()
      this.setData({ comments, total })
    });
  },

  onReachBottom() {
    const old = this.data.comments;
    if (old.length < this.data.total) {
      const limit = 9;
      this.loadComment((comments, total) => {
        comments = old.concat(comments)
        this.setData({ comments, total })
      }, old.length / limit)
    }
  },

  loadComment(call, page = 0) {
    wx.cloud.callFunction({
      name: "getComment",
      data: { page, publishID: this.data.card._id},
    }).then(res => {
      let { comments, total } = res.result;
      for (let comment of comments)
        comment.time = new Date(comment.time).toLocaleString();
      call && call(comments, total);
    })
  }
})