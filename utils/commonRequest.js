const Request = require("./request");//导入模块
const app = getApp();
module.exports = {
  'gologin': function (loginRes, userInfo, callback) {
    Request.post("user/UserLogin/", {
      code: loginRes.code,
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    }).then(res => { //成功回调
      console.log(res);
      userInfo.uid = res.data.uid;
      app.globalData.userInfo = userInfo;
      app.globalData.isLogon = true;
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorage({
        data: res.data.token,
        key: 'token',
        success() {
          wx.hideLoading({
            complete: () => {
              wx.showToast({
                title: '授权成功',
              });
              callback(res);
            },
          })
        }
      })
    }).catch(err => {
      wx.showToast({
        title: err,
      });
      callback(err);
    }); //异常回调
  }
}