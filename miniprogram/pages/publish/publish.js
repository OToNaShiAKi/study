// miniprogram/pages/publish/publish.js
let system = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    desc: "",
    userLocation: {},
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const channel = this.getOpenerEventChannel();
    channel.on && channel.on('userInfo', userInfo => {
      this.setData({ userInfo })
    });
    wx.getSystemInfo({
      success: ({ model }) => {
        system = model;
      }
    })
  },

  getInput(event) {
    this.setData({ desc: event.detail.value.trim() });
  },

  location() {
    const { latitude, longitude } = this.data.userLocation;
    wx.chooseLocation({
      latitude,
      longitude,
      success: location => {
        delete location.errMsg;
        this.setData({ userLocation: location })
      }
    })
  },

  chooseLocation() {
    wx.getSetting({
      success: res => {
        const location = res.authSetting["scope.userLocation"];
        if(location)
          this.location()
        else 
          wx.authorize({
            scope: 'scope.userLocation',
            success: location,
            fail: res => {
              wx.showModal({
                title: '打开设置面板',
                content: '当前未授权，是否打开设置面板授权',
                success: res => {
                  if (res.confirm)
                    wx.openSetting({
                      success: res => {
                        const location = res.authSetting["scope.userLocation"];
                        if (location)
                          this.location()
                      }
                    })
                }
              })
            }
          })
      }
    })

  },

  chooseImage() {
    const images = this.data.images;
    wx.chooseImage({
      count: 9 - images.length,
      success: res => {
        this.setData({ images: images.concat(res.tempFilePaths)})
      }
    })
  },

  remove(event) {
    const index = event.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1)
    this.setData({ images })
  },

  preview(event) {
    const current = event.currentTarget.dataset.src;
    wx.previewImage({
      urls: this.data.images,
      current
    })
  },

  publish() {
    wx.showLoading({ title: '上传图片' })
    const { title, desc, images, userInfo, userLocation } = this.data;
    const fileIDs = images.map(image => {
      const path = image.split('tmp/').pop();
      return wx.cloud.uploadFile({
        cloudPath: "publish/" + path,
        filePath: image
      }).then(res => res.fileID)
    })
    Promise.all(fileIDs).then(ids => {
      wx.showLoading({ title: '验证内容安全' })
      return wx.cloud.callFunction({
        name: "checkContent",
        data: {
          title,
          desc,
          fileIDs: ids,
          userInfo,
          userLocation,
          system
        }
      })
    }).then(res => {
      if(!res.result.status) throw res;
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        complete: () => {
          wx.navigateBack();
          const pages = getCurrentPages();
          pages[pages.length - 2].onPullDownRefresh();
        }
      })
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
      wx.showToast({
        icon: "none",
        title: err.result.message
      })
    })
  }

})