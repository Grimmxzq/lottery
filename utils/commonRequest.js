const Request = require("./request");//导入模块
const app = getApp();
module.exports = {
  'gologin': function (loginRes, userInfo, callback) {
    wx.getImageInfo({
      src: userInfo.avatarUrl,
      success: function (url) {
        wx.uploadFile({
          url: app.REQUEST_URL + 'lottery/UploadFile/',
          filePath: url.path,
          name: 'image',
          timeout: 20000,
          success(e) {
            console.log(e);
            const data = JSON.parse(e.data);
            if (data.code == 200) {
              Request.post("user/UserLogin/", {
                code: loginRes.code,
                avatarUrl: data.data.url,
                nickName: userInfo.nickName
              }).then(res => { //成功回调
                userInfo.uid = res.data.uid;
                app.globalData.userInfo = userInfo;
                app.globalData.userInfo.avatarUrl = data.data.url;
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
            } else {
              wx.hideLoading();
              wx.showToast({
                icon: 'none',
                title: '获取用户头像失败3' + JSON.parse(data),
              })
            }
          },
          fail(err) {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '获取用户头像失败2',
            })
          }
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '获取用户头像失败1' + JSON.stringify(e),
          icon: 'none'
        })
      }
    })
  }
}