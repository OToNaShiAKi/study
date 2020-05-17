// components/questionCard/questionCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    card: {
      type:Object,
      observer(value) {
        if(value._id) {
          const db = wx.cloud.database();
          const comments = db.collection('comments');
          comments.where({
            publishID: value._id
          }).watch({
            onChange: snapshot => {
              let count = snapshot.docs.length;
              if (count > 10000)
                count = Math.floor(count / 10000) + 'w+'
              else if (count > 1000)
                count = Math.floor(count / 1000) + 'k+'
              this.setData({ count })
            },
            onError: err => {
              console.error('the watch closed because of error', err)
            }
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    answer: true,
    userInfo: {},
    count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview(event) {
      const urls = this.data.card.question.fileIDs;
      const current = event.currentTarget.dataset.src;
      wx.previewImage({
        urls,
        current
      })
    },

    publish() {
      wx.getSetting({
        success: res => {
          const info = res.authSetting["scope.userInfo"];
          if (info)
            wx.getUserInfo({
              success: this.userInfo.bind(this)
            })
          else
            this.setData({ show: false })
        }
      })
    },

    userInfo(event) {
      if (this.data.show)
        event = event.userInfo;
      else 
        event = event.detail;
      delete event.language;
      delete event.city;
      delete event.country;
      delete event.gender;
      delete event.province;
      this.setData({ show: true, answer: false, userInfo: event });
    },

    pageTo() {
      const route = getCurrentPages().pop().route;
      if (!route.includes('questionDetail'))
        wx.navigateTo({
          url: '/pages/questionDetail/questionDetail?_id=' + this.data.card._id
        })
    }
  }
})
