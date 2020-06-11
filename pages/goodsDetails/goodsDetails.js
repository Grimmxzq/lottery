// pages/goodsDetails/goodsDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphonex: false, //适配iphonex以上版本
    joinUsers: [
      "http:\/\/img.alicdn.com\/imgextra\/i4\/2200734032419\/O1CN01sjKQSm1TjwgG5gonD_!!2200734032419.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i2\/2206521257455\/O1CN01vnj6eK24wRH2vKSxd_!!2206521257455.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i2\/2206521257455\/O1CN01fiCXU124wRH5qOglp_!!2206521257455.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i4\/2206521257455\/O1CN01Delf3P24wRH4InzVj_!!2206521257455.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i2\/2206521257455\/O1CN01CnY6Tc24wRH6qg4VV_!!2206521257455.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i1\/2206521257455\/O1CN01b0QSg324wRHAAJ6pj_!!2206521257455.jpg"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isIphonex: app.globalData.isIphoneX
    })
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
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 图片预览
   */
  previewImage: function(url) {
    console.log(url);
    wx.previewImage({
      urls: [url.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  /**
   * 查看参与人
   */
  checkJoinUser: function () {
    wx.navigateTo({
      url: '../joinUser/joinUser',
    })
  },
  /**
   * 去首页
   */
  goIndex: function () {
    wx.switchTab({
      url: '../home/home',
    })
  },
  /**
   * 参与抽奖
   */
  signUp: function () {
    // withSubscriptions --- 获取用户订阅消息的订阅状态
    wx.getSetting({
      withSubscriptions: true,
      success(res){
        console.log(res);
        // if (!res.subscriptionsSetting) {

        // }
        wx.showToast({
          title: '参与成功',
        })
      },
      fail(err) {
        wx.showToast({
          title: '获取用户订阅消息失败',
        })
      }
    })
  }
})