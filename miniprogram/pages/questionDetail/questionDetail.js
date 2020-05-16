// miniprogram/pages/questionDetail/questionDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    const questions = db.collection('questions');
    const comments = db.collection('comments');
    questions.doc(options._id).get().then(res => {
      const card = res.data;
      card.time = new Date(card.time).toLocaleString();
      this.setData({ card })
    });
    comments.where({ publishID: options._id }).get().then(res => {
      console.log(res.data);
    })
  }
})