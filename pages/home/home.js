// pages/home/home.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js");
var common = require("../../common.js");
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
    hidden:false,
    page: 1
  },
  trunSponsor: function() { //前往成为赞助商页面
    wx.navigateTo({
      url: '../sponsor/sponsor'
    })
  },
  shareIcon:function(){//显示提问框
let that=this
// that.setData({
//   hidden:true
// })
wx:wx.navigateTo({
  url: '../addaAdvanced/addAdvanced',
})
  },
  mCloseImg: function () {//隐藏提问框
    let that = this
    that.setData({
      hidden: false
    })

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
    // const id = options.id;
    // if (options.pageId == 'details') {
    //   wx.navigateTo({
    //     url: '../particulars/particulars?id=' + id
    //   })
    // } else if (options.pageId == 'giftParticulars') {
    //   wx.navigateTo({
    //     url: '../particulars/particulars?id=' + id
    //   })
    // }
    this.getDataList();
  },
  getDataList(isRefresh) {
    const fresh = isRefresh || false;
    let that = this;
    wx.showLoading();
    let page = this.data.page;
    Request.post('lottery/Index/',{
      page,
      size: 10
    }).then((res) => {
      console.log(res);
      const { code, data, message } = res;
      if (code === 200) {
        that.setData({
          page: page++,
          lists: data.content
        })
      } else {
        wx.showToast({
          title: message,
        });
      }
      if (fresh) {
        wx.nextTick(() => {
          wx.showToast({
            title: '刷新成功',
          })
          wx.stopPullDownRefresh() //停止下拉刷新
        })
      }
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: err,
      });
      if (fresh) {
        wx.stopPullDownRefresh() //停止下拉刷新
      }
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

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function() {
    this.setData({
      page: 1,
      lists: []
    })
    this.getDataList(true);
    // let that=this
    // 　　wx.showNavigationBarLoading() //在标题栏中显示加载
    // that.setData({
    //   list:[]
    // })
    //   common.req({
    //     url: 'getHomeGiftList',
    //     data: '',
    //     header: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     dataType: 'json',
    //     method: 'POST',
    //     success: function (res) {
    //       if (res.data.status == '1001') {
    //         wx.showToast({
    //           title: res.data.msg,
    //           icon: 'loading',
    //           duration: 3000
    //         })
    //       }
        
    //       for (var i = 0; i < res.data.data.length; i++) {
    //         let str = res.data.data[i].giftCard.awardTime;
    //         str = str.replace(/-/g, '/');
    //         let date = new Date(str);
    //         let awardTime = setDate(date)
        
    //         res.data.data[i].giftCard.awardTime= awardTime,
    //             res.data.data[i].giftCard.picPath = app.FILE_URL + res.data.data[i].giftCard.picPath
    //       }
    //       that.setData({
    //         list: res.data.data
    //       })

    //     },    
    //   complete: function () {
    //     // complete
    //     wx.hideNavigationBarLoading() //完成停止加载
    //     wx.stopPullDownRefresh() //停止下拉刷新
    //   }
    // })
   
    

    },  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // let that=this
    // that.setData({
    //   hidden: false
    // })
    // try {
    //   var value = wx.getStorageSync('userId')
    //   if (value) {
    //     app.globalData.userId = value
    //   }
    // } catch (e) {
     
    // }
    // console.log(app.globalData.userId)
    // return {
    //   title: '这里有很多通证礼品卡，要不来试试？',
    //   path: '/pages/home/home?invitorId=' + (app.globalData.userId || '')
    // }

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