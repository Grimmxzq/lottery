// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingText: "暂无更多消息"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this;
    that.setData({
      loadingText: "加载中..."
    })
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(() => {
      wx.hideLoading({
        complete: (res) => {
          wx.showToast({
            title: '刷新成功',
          });
          wx.stopPullDownRefresh();
          that.setData({
            loadingText: "暂无更多消息"
          })
        },
      })
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})