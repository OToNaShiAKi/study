// components/userInfo/userInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUser(event) {
      if ('userInfo' in event.detail) {
        let userInfo = event.detail.userInfo;
        userInfo.cloudID = event.detail.cloudID;
        this.triggerEvent('info', userInfo);
      }
      else {
        wx.showToast({
          icon: "none",
          title: "未授权无法使用",
        })
        this.setData({show: true})
      }
    }
  }
})
