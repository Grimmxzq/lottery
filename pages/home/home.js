// pages/home/home.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js");
const Request = require("../../utils/request");//导入模块

function setDate(date) {
  let getHours, getMinutes, getMonth, getDate;

  if (date.getMonth() < 9) {
    getMonth = '0' + (parseInt(date.getMonth()) + 1)
  } else {
    getMonth = date.getMonth()
  }
  if (date.getDate() < 10) {
    getDate = '0' + date.getDate()
  } else {
    getDate = date.getDate()
  }

  if (date.getHours() < 10) {
    getHours = '0' + date.getHours()
  } else {
    getHours = date.getHours()
  }
  if (date.getMinutes() < 10) {
    getMinutes = '0' + date.getMinutes()
  } else {
    getMinutes = date.getMinutes()
  }
  let newData = getMonth + "月" + getDate + "日 " + getHours + ":" + getMinutes
  return newData;

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    page: 1,
    size: 5,
    stopLoading: false,
    loadingText: '正在加载...',
    showOneButtonDialog: false,
    buttons: [
      {
        text: '一键复制微信号'
      }
    ],
    wxCode: 'xzq1628957104'
  },
  trunSponsor: function() { //前往成为赞助商页面
    this.setData({
      showOneButtonDialog: true
    })
  },
  tapDialogClose: function () {
    this.setData({
      showOneButtonDialog: false
    })
  },
  tapDialogButton(e) {
    console.log(e);
    const that = this;
    if (e.detail.index === 0) {
      wx.setClipboardData({
        data: that.data.wxCode,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
              console.log(res.data) // data
            }
          })
        }
      })
    }
  },
  particulars: function (e) { //查看详情
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../particulars/particulars?giftId=' + id +"&pageId=0"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
    this.getDataList();
  },
  // 获取数据
  getDataList(isRefresh) {
    const fresh = isRefresh || false;
    let that = this;
    let page = this.data.page;
    let arr = this.data.lists;
    Request.post('lottery/Index/',{
      page,
      size: that.data.size
    }).then((res) => {
      console.log(res);
      const { code, data, message } = res;
      if (code === 200) {
        // if (fresh) {
        //   wx.nextTick(() => {
        //     wx.showToast({
        //       title: '刷新成功',
        //     })
        //   })
        // }
        for(var i=0; i<data.content.length; i++) {
          const item = data.content[i];
          arr.push(item);
        }
        page++;
        that.setData({
          page: page,
          lists: arr
        })
        if (data.content.length < 5) {
          that.setData({
            stopLoading: true,
            loadingText: '暂无更多数据'
          })
        }
      } else {
        wx.showToast({
          title: message,
          icon: 'none'
        });
      }
      if (fresh) {
        wx.stopPullDownRefresh() //停止下拉刷新
      }
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: err,
      });
      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that=this
    wx.setStorage({
      key: "tabIndex",
      data: 0
    })
    // setTimeout(()=>{
    //   wx.hideLoading({
    //     complete: (res) => {},
    //   })
    // }, 3000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.stopLoading) return false;
    this.getDataList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function() {
    wx.showLoading();
    this.setData({
      page: 1,
      stopLoading: false,
      lists: []
    })
    this.getDataList(true);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 点击去详情页面
   */
  goDetails(e) {
    console.log(e);
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      // url: '../particulars/particulars?giftId=' + 2 +"&pageId=0",
      url: '../goodsDetails/goodsDetails?id=' + id
    })
  }
})