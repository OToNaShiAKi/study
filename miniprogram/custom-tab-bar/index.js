// custom-tab-bar/index.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    color: "#808080",
    selectedColor: "#fc8a2e",
    active: "/pages/home/home",
    list: [{
      pagePath: "/pages/home/home",
      text: "首页",
      iconPath: "/assets/home.png",
      selectedIconPath: "/assets/home-select.png"
    }, {
      pagePath: "/pages/question/question",
      text: "问答",
      iconPath: "/assets/question.png",
      selectedIconPath: "/assets/question-select.png"
    }, {
      pagePath: "/pages/mine/mine",
      text: "我的",
      iconPath: "/assets/mine.png",
      selectedIconPath: "/assets/mine-select.png"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switch(event) {
      let active = event.currentTarget.dataset.path;
      this.setData({
        active
      })
      wx.switchTab({
        url: active
      })
    }
  }
})
