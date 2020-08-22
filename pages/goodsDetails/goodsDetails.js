// pages/goodsDetails/goodsDetails.js
var app = getApp();
const Request = require("../../utils/request");//导入模块
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false, //页面内容是否展示
    isIphonex: false, //适配iphonex以上版本
    lid: 0, //商品ID
    winning: [], //获奖名单
    getPrizeInfo: null, //获奖信息
    swipers: [], //图片轮播
    details: null, //抽奖详情
    isShowLogin: false, //是否显示登录框
    isJoin: 2, //默认没有参与抽奖 0.参与抽奖 1.待开奖 2.已开奖 3.已开奖 + 已中奖 4.已开奖 + 未中奖
    joinPeople: 0, //参与人数
    joinPeopleImg: [], //参与人数头像
    getAward: false, //是否中奖
    isShowPrizeDialog: false, //是否展示获奖框
    introduce: null,
    randomPrize: {} //精选抽奖
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    console.log(options);
    let id = '';
    if (options.scene) {
      id = decodeURIComponent(options.scene);
    } else {
      id = options.id; //商品id
    }
    const swipers = this.data.swipers;
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
          swipers,
          joinPeople: data.content.count,
          joinPeopleImg: data.content.userlist,
          isShow: true,
          introduce: data.content.introduce,
          winning: data.status === 3 || data.status === 4 ? data.Winning : [],
          getPrizeInfo: data.status === 3 || data.status === 4 ? data.prizes : []
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
    const that = this;
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
        that.getRandomPrize();
        break;
      case 4: //已开奖 + 未中奖
        status = num;
        getAward = false;
        isShowPrizeDialog = true;
        that.getRandomPrize();
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
  previewImageAndText(url) {
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
            console.log(data);
            wx.showToast({
              title: '参与成功',
              complete: function() {
                console.log(typeof that.data.details.condition)
                if (that.data.details.condition === 'i' || that.data.details.condition === 's' && that.data.details.people === data.count) {
                  // 如果当前抽奖类型为按人数抽奖
                  // 且
                  // 参与人数 === 预定人数
                  // 则
                  // 请求开奖接口
                  Request.post('lottery/UpLottery/',{
                    lid: that.data.lid
                  }).then((res) => {
                    console.log(res);
                    const {code,message} = res;
                    if (code === 200) {
                      that.onLoad({
                        id: that.data.lid
                      });
                    } else {
                      wx.showToast({
                        title: '系统错误' + message,
                        icon: 'none'
                      })
                    }
                  }).catch((err) => {
                    wx.showToast({
                      title: '系统错误,请重新进入',
                      icon: 'none',
                      success() {
                        wx.navigateBack();
                      }
                    })
                  })
                } else {
                  that.setData({
                    isJoin: 1,
                    joinPeople: data.count,
                    joinPeopleImg: data.userList
                  });
                }
              }
            })
            // wx.getSetting({
            //   withSubscriptions: true,
            //   success(res){
            //     console.log(res);
            //     if (res.subscriptionsSetting.mainSwitch) {
            //       console.log("111")
            //       wx.requestSubscribeMessage({
            //         tmplIds: ['-EzU6FCX73GVmVw58dkRWOm7beyEgXXfJm4mVbMjP9g'],
            //         success (res) { 
            //           console.log("用户允许通知");
            //           console.log(res);
            //           wx.showToast({
            //             title: '参与成功',
            //             complete: function() {
            //               let count = that.data.joinPeople;
            //               let joinPeopleImg = that.data.joinPeopleImg.unshift(value.avatarUrl);
            //               that.setData({
            //                 isJoin: 1,
            //                 joinPeople: count++,
            //                 joinPeopleImg
            //               });
            //             }
            //           })
            //         },
            //         fail(err) {
            //           console.log(err);
            //           wx.showToast({
            //             title: err.message,
            //             icon: 'none'
            //           })
            //         }
            //       })
            //     }
            //   },
            //   fail(err) {
            //     wx.showToast({
            //       title: '获取用户订阅消息失败',
            //     })
            //   }
            // })
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
    console.log(111)
    this.setData({
      isShowPrizeDialog: false,
      isJoin: 2
    })
  },
  // 分享
  shareImg() {
    let that = this;
    let value = wx.getStorageSync('userInfo');
    if (value) {
      wx.setStorage({
        // data: {
        //   lid: that.data.lid,
        //   img: that.data.details.prize[0].img,
        //   num: that.data.details.prize[0].num,
        //   times: that.data.details.time,
        //   name: that.data.details.prize[0].name,
        //   desc: that.data.details.desc
        // },
        data: {
          lid: that.data.lid,
          img: that.data.details.prize[0].img,
          num: that.data.details.prize[0].num,
          times: that.data.details.time,
          name: that.data.details.prize[0].name,
          desc: that.data.details.desc,
          condition: that.data.details.condition,
          prize: that.data.details.prize
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
  },
  // 图片加载失败
  errImg(e) {
    console.log(e);
    const idx = e.currentTarget.dataset.errIndex;
    const details = this.data.details;
    details.userlist[idx].avatarUrl = '../../images/err.jpg';
    this.setData({
      details
    })
  },
  // 复制微信号
  copyCode() {
    const that = this;
    wx.setClipboardData({
      data: that.data.details.startuser.wxid,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // 去个人中心
  goUser() {
    wx.switchTab({
      url: '../user/user',
    })
  },
  // 获取精选抽奖信息
  getRandomPrize() {
    const that = this;
    Request.post('lottery/RandomLottery/').then((res) => {
      console.log(res);
      const {code, data,msg} = res;
      if (code === 200) {
        that.setData({
          randomPrize: data
        })
      } else {
        
      }
    }).catch((err)=> {
      console.log(err);
    })
  },
  goDetails(e) {
    console.log(e);
    const lid = e.currentTarget.dataset.lid;
    wx.navigateTo({
      url: '../goodsDetails/goodsDetails?id=' + lid,
    })
  }
})