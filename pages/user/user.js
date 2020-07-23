// pages/user/user.js
const app = getApp()
const Request = require("../../utils/request");//导入模块
const commonRequest = require("../../utils/commonRequest");//导入模块
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showOneButtonDialog: false, //联系我们弹框是否显示
    noDuty: false, //免责声明弹框是否显示
    buttons: [
      {
        text: '一键复制微信号'
      }
    ],
    dutyButtons: [
      {
        text: '确定'
      }
    ],
    wxCode: 'xzq1628957104'
  },
  getUserInfo: function (e) { //获取头像昵称
    wx.showLoading({
      title: '登录中...',
    })
    const that = this;
    const userInfo = e.detail.userInfo;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: loginRes => {
          commonRequest.gologin(loginRes, userInfo, (res) => {
            console.log(res);
            that.setData({
              userInfo: e.detail.userInfo,
              hasUserInfo: true
            });
          })
        },
        fail:res=>{
          wx.showToast({
            title: res,
          });
          wx.hideLoading();
        }
      })
      // common.reLogin(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)
    } else {
      wx.hideLoading({
        complete: (res) => {
          wx.showToast({
            icon: 'none',
            title: '已取消授权',
          })
        }
      });
    }
  }, 
  authentication:function(){
    wx:wx.navigateTo({
    url: '../authentication/authentication',
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })},
  redPackageRecord:function(){
    wx:wx.navigateTo({
      url: '../redPackageRecord/redPackageRecord',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  myAddGiftCard: function () { //跳转我生成的礼品卡页面

    wx: wx.navigateTo({
      url: '../myAddGiftCard/myAddGiftCard',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  walletAddress: function() { //钱包地址页面
    // wx: wx.navigateTo({
    //   url: '../walletAddressList/walletAddressList',
    // })
    const that = this;
    wx.getSetting({
      success(res) {
        console.log("vres.authSetting['scope.address']：",res.authSetting['scope.address'])
        if (res.authSetting['scope.address']) {
          console.log("用户已授权")
          wx.chooseAddress({
            success(res) {
              console.log(res);
              that.addressRequest(res);
            },
            fail() {
              console.log("已取消");
            }
          })
        } else {
          if (res.authSetting['scope.address'] == false) {
            console.log("用户未授权获取通用地址功能");
            wx.showModal({
              title: '获取通讯地址授权',
              content: '检测到未授权通讯地址，是否前往授权？',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(res) {
                      console.log(res.authSetting);
                      if (res.authSetting['scope.address'] == true) {
                        wx.showToast({
                          title: '地址授权成功'
                        })
                      } else {
                        wx.showToast({
                          title: '地址授权失败',
                          icon: 'none'
                        })
                      }
                    }
                  })
                } else if (res.cancel) {
                  wx.showToast({
                    title: '授权已取消',
                    icon: 'none'
                  })
                }
              },
              fail() {
                wx.showToast({
                  title: '程序错误，请稍后再试',
                  icon: 'none'
                })
              }
            })
          } else {
            console.log("第一次授权")
            wx.chooseAddress({
              success(res) {
                that.addressRequest(res);
              },
              fail() {
                console.log("已取消");
              }
            })
          }
        }
      },
      fail() {
        wx.showToast({
          title: '系统错误',
          icon: 'none'
        })
      }
    })
  },
  // 收货地址数据请求
  addressRequest(res) {
    // console.log(res.userName)
    // console.log(res.postalCode)
    // console.log(res.provinceName)
    // console.log(res.cityName)
    // console.log(res.countyName)
    // console.log(res.detailInfo)
    // console.log(res.nationalCode)
    // console.log(res.telNumber)
    wx.showLoading({
      title: '授权中...'
    });
    Request.post('user/AddressUser/',{
      userName: res.userName,
      postalCode: res.postalCode,
      provinceName: res.provinceName,
      cityName: res.cityName,
      countyName: res.countyName,
      detailInfo: res.detailInfo,
      nationalCode: res.nationalCode,
      telNumber: res.telNumber
    }).then((res) => {
      console.log(res);
      const {code, message} = res;
      if (code === 200) {
        wx.showToast({
          title: '授权成功',
        })
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
  },
  myGiftCard: function () { //我生成的礼品卡
    wx: wx.navigateTo({
      url: '../myGiftCard/myGiftCard',
    })
  },
  // 中奖纪录
  wonList() {
    wx: wx.navigateTo({
      url: '../wonList/index',
    })
  },
  myBalance: function () {//我的余额
    wx: wx.navigateTo({
      url: '../myBalance/myBalance',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
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
    let that=this
    wx.setStorage({
      key: "tabIndex",
      data: 2
    })
    if (app.globalData.userInfo) { //在app页面获取userInfo信息
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

        }
      })
    }
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

  // },
  myMessage: function () {
    wx.navigateTo({
      url: '../message/message'
    })
  },
  contact: function() { //前往成为赞助商页面
    this.setData({
      showOneButtonDialog: true
    })
  },
  // 常见问题说明
  asks() {
    wx.navigateTo({
      url: '../asks/index',
    })
  },
  // 免责弹框隐藏
  tapDutyDialogClose() {
    this.setData({
      noDuty: false
    })
  },
  // 联系我们弹框隐藏
  tapDialogClose: function () {
    this.setData({
      showOneButtonDialog: false
    })
  },
  // 免责弹框显示
  showDutyDialog() {
    this.setData({
      noDuty: true
    })
  },
  // 复制微信号
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
  // 去投诉页面
  goComplaint() {
    wx.navigateTo({
      url: '../complaint/index',
    })
  }
})