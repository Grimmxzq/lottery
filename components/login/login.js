// components/login/login.js
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
      const that = this;
      wx.getUserInfo({
        success: (res) => {
          wx.showLoading();
          console.log(res);
          wx.setStorage({
            key:"userInfo",
            data: res.userInfo,
            success: function () {
              that.cancelLogin();
              wx.hideLoading();
            }
          })
        },
        fail: () => {
          wx.showToast({
            title: '授权失败，请重新授权',
          })
        }
      })
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
