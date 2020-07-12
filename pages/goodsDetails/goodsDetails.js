// pages/goodsDetails/goodsDetails.js
var app = getApp();
const Request = require("../../utils/request");//导入模块
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphonex: false, //适配iphonex以上版本
    lid: 0, //商品ID
    swipers: [], //图片轮播
    joinUsers: [
      "http:\/\/img.alicdn.com\/imgextra\/i4\/2200734032419\/O1CN01sjKQSm1TjwgG5gonD_!!2200734032419.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i2\/2206521257455\/O1CN01vnj6eK24wRH2vKSxd_!!2206521257455.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i2\/2206521257455\/O1CN01fiCXU124wRH5qOglp_!!2206521257455.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i4\/2206521257455\/O1CN01Delf3P24wRH4InzVj_!!2206521257455.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i2\/2206521257455\/O1CN01CnY6Tc24wRH6qg4VV_!!2206521257455.jpg",
      "http:\/\/img.alicdn.com\/imgextra\/i1\/2206521257455\/O1CN01b0QSg324wRHAAJ6pj_!!2206521257455.jpg"
    ], //参与抽奖人员头像
    details: null, //抽奖详情
    isShowLogin: false, //是否显示登录框
    isJoin: 2, //默认没有参与抽奖 0.参与抽奖 1.待开奖 2.已开奖 3.已开奖 + 已中奖 4.已开奖 + 未中奖
    getAward: false, //是否中奖
    isShowPrizeDialog: false //是否展示获奖框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const id = options.id; //商品id
    const swipers = this.data.swipers;
    wx.showLoading();
    Request.post('lottery/Particulars/',{
      lid: id
    }).then((res) => {
      console.log(res);
      const {code, data, message} = res;
      if (code === 200) {
        this.handleStatus(data.status);
        data.content.prize.forEach((item) => {
          swipers.push(item.img);
        });
        this.setData({
          details: data.content,
          swipers
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
    this.setData({
      isIphonex: app.globalData.isIphoneX,
      lid: id
    })
  },
  // 处理抽奖状态
  handleStatus(num) {
    let status = 0;
    let getAward = false;
    let isShowPrizeDialog = false;
    switch (num) {
      case 0: //参与抽奖
        status = num;
        getAward = false;
        isShowPrizeDialog = false;
        break;
      case 1: //待开奖
        status = num;
        getAward = false;
        isShowPrizeDialog = false;
        break;
      case 2: //已开奖
        status = num;
        getAward = false;
        isShowPrizeDialog = false;
        break;
      case 3: //已开奖 + 已中奖
        status = num;
        getAward = true;
        isShowPrizeDialog = true;
        break;
      case 4: //已开奖 + 未中奖
        status = num;
        getAward = true;
        isShowPrizeDialog = true;
        break;
    };
    this.setData({
      isJoin: status,
      getAward,
      isShowPrizeDialog
    });
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
    // 先判断登录
    const that = this;
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        Request.post('lottery/ParLottery/',{
          lid: that.data.lid * 1
        }).then((res) => {
          console.log(res);
          const {code, data, message} = res;
          if (code === 200) {
            wx.getSetting({
              withSubscriptions: true,
              success(res){
                console.log(res);
                if (res.subscriptionsSetting.mainSwitch) {
                  console.log("111")
                  wx.requestSubscribeMessage({
                    tmplIds: ['-EzU6FCX73GVmVw58dkRWOm7beyEgXXfJm4mVbMjP9g'],
                    success (res) { 
                      console.log("用户允许通知");
                      console.log(res);
                      wx.showToast({
                        title: '参与成功',
                        complete: function() {
                          that.setData({
                            isJoin: 2
                          });
                        }
                      })
                    },
                    fail(err) {
                      console.log(err);
                      wx.showToast({
                        title: err.message,
                        icon: 'none'
                      })
                    }
                  })
                }
              },
              fail(err) {
                wx.showToast({
                  title: '获取用户订阅消息失败',
                })
              }
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
            title: err,
          });
          wx.hideLoading();
        })
      } else {
        that.setData({
          isShowLogin: true
        })
      }
    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '您当前微信版本过低，请升级后再次尝试',
        icon: 'none'
      })
    }
  },
  // 关闭登录弹框
  closeLoginDialog: function() {
    this.setData({
      isShowLogin: false
    })
    this.changeStatus();
  },
  // 登录以后判断是否参与过抽奖
  changeStatus: function () {
    wx.showLoading();
    const that = this;
    Request.post('lottery/Particulars/',{
      lid: that.data.lid
    }).then((res) => {
      console.log(res);
      const {code, data, message} = res;
      if (code === 200) {
        this.handleStatus(data.status);
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
  // 弹框静止滑动
  stopTouchMove: function () {},
  // 关闭开奖框
  closePrizeDialog: function () {
    this.setData({
      isShowPrizeDialog: false
    })
  },
  // 分享
  shareImg() {
    let that = this;
    let value = wx.getStorageSync('userInfo');
    if (value) {
      wx.setStorage({
        data: {
          lid: that.data.lid,
          img: that.data.details.prize[0].img,
          num: that.data.details.prize[0].num,
          times: that.data.details.time,
          name: that.data.details.prize[0].name
        },
        key: 'shareInfo',
        success() {
          wx.navigateTo({
            url: '../shareImg/index',
          })
        },
        fail() {
          wx.showToast({
            title: '系统错误，请重启再试',
            icon: 'none'
          })
        }
      })
    } else {
      that.setData({
        isShowLogin: true
      })
    }
  }
})