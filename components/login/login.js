// components/login/login.js
const commonRequest = require("../../utils/commonRequest");//导入模块
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取用户信息
    getUserInfo: function( e ) {
      wx.showLoading({
        title: '登录中...',
      })
      // console.log(e);
      const that = this;
      const userInfo = e.detail.userInfo;
      if (e.detail.errMsg == 'getUserInfo:ok') {
        wx.login({
          success: loginRes => {
            console.log(loginRes);
            commonRequest.gologin(loginRes, userInfo, (res) => {
              that.cancelLogin();
            })
          },
          fail:res=>{
            wx.showToast({
              title: res,
            });
            wx.hideLoading();
          }
        })
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
    // 用户取消登录
    cancelLogin: function() {
      // 调用父组件关闭弹框方法
      this.triggerEvent("closeLoginDialog");
    },
    touchHandler: function() {
      return
    }
  }
})
