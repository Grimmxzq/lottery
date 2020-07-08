//app.js
var util = require("utils/util.js");

App({

  onLaunch: function (options) {
  // console.log(options)
    let that=this
    this.globalData.scene = options.scene;
    // 适配iphonex及以上版本
    wx.getSystemInfo({
      complete: (res) => {
        // console.log(res);
        let model = res.model;
        let iphoneArr = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max'];
        iphoneArr.forEach( item => {
          if (model.search(item) != -1) {
            that.globalData.isIphoneX = true;
          }
        })
      },
    })
    //获取本地用户数据 判断是否登录
    try {
      var value = wx.getStorageSync('userInfo') || null;
      if (value) {
        that.globalData.userInfo = value;
        that.globalData.isLogon = true;
      } else {
        that.globalData.userInfo = null;
        that.globalData.isLogon = false;
      }
    } catch (e) {
      that.globalData.userInfo = null;
      that.globalData.isLogon = false;
    }
  },

  // PICE_URL: "https://service.maggie.vip/coinmarketcap/",
  // REQ_URL: 'https://service.maggie.vip/giftcard/api/',
  // FILE_URL: "https://giftcard-prod-bucket.maggie.vip/",
  REQUEST_URL: "https://www.forevermisstogether.top/wx/",
  globalData: {
    userInfo: null, //用户信息
    appId: null,    //
    isLogon: false, //是否登录
    scene:null,     //
    invitorId:null,
    userId:null,    //
    introduction: null,
    isIphoneX: false //适配iphonex及以上版本
  },
  state:{
    loginLock:false
  }
})