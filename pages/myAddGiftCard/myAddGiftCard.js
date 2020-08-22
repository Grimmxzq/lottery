// pages/myAddGiftCard/myAddGiftCard.js
const app = getApp()
const Request = require("../../utils/request");//导入模块
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wonListWidth: 0,
    wonListHeight: 0,
    // tab切换  
    currentTab: 0,
    closedList: {}, //未开奖
    openList: {}, //未中奖
    wonList: {} //已中奖
  },
  particulars: function (e) {
    console.log(e);
    const lid = e.currentTarget.dataset.lid;
    wx.navigateTo({
      url: '../goodsDetails/goodsDetails?id=' + lid,
    })
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading();
    Request.post('user/Participate/').then((res) => {
      console.log(res);
      const {code, data, message} = res;
      if (code === 200) {
        if (data) {
          console.log(data);
          that.setData({
            closedList: data.nostart, //待开奖
            openList: data.upstart, //未中奖
            wonList: data.start //中奖
          })
        } else {
          wx.showToast({
            title: message,
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: message,
          icon: 'none'
        })
      }
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: err.message,
      });
      wx.hideLoading();
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wonListWidth: res.windowWidth,
          wonListHeight: res.windowHeight
        });
      }

    });

  },
  moreData: function () {
    let that = this;
    let page;
    let listType;
    if (that.data.currentTab == 0) {
      page = that.data.openList.number
      listType = 'openList'
      if (that.data.openList.last) {
        return
      }
    } else if (that.data.currentTab == 1) {
      page = that.data.closedList.number
      listType = 'closedList'
      if (that.data.closedList.last) {
        return
      }
    } else if (that.data.currentTab == 2) {
      page = that.data.wonList.number
      listType = 'wonList'
      if (that.data.wonList.last) {
        return
      }
    }
    wx.showLoading({
      title: '玩命加载中...',
    })
    // 页数+1
    // common.req({
    //   url: 'user/getParticipatedGifts',
    //   data: {
    //     "page": parseInt(page) + 1,
    //     "listType": listType
    //   },
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   dataType: 'json',
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(res)
    //     if (res.data.data.closedList != null) {
    //       for (let i = 0; i < res.data.data.closedList.content.length; i++) {
    //         res.data.data.closedList.content[i].picPath = app.FILE_URL + res.data.data.closedList.content[i].picPath
    //         that.data.closedList.content.push(res.data.data.closedList.content[i])
    //       }
    //       res.data.data.closedList.content = that.data.closedList.content
    //       that.setData({
    //         closedList: res.data.data.closedList
    //       })
    //     } else if (res.data.data.openList != null) {
    //       for (let i = 0; i < res.data.data.openList.content.length; i++) {
    //         res.data.data.openList.content[i].picPath = app.FILE_URL + res.data.data.openList.content[i].picPath
    //         that.data.openList.content.push(res.data.data.openList.content[i])
    //       }
    //       res.data.data.openList.content = that.data.openList.content
    //       that.setData({
    //         openList: res.data.data.openList
    //       })
    //     } else if (res.data.data.wonList != null) {
    //       for (let i = 0; i < res.data.data.wonList.content.length; i++) {
    //         res.data.data.wonList.content[i].picPath = app.FILE_URL + res.data.data.wonList.content[i].picPath
    //         that.data.wonList.content.push(res.data.data.wonList.content[i])
    //       }
    //       res.data.data.wonList.content = that.data.wonList.content
    //       that.setData({
    //         wonList: res.data.data.wonList
    //       })
    //     }


    //     wx.hideLoading()
    //   },
    // })
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
  // onShareAppMessage: function() {

  // }
})