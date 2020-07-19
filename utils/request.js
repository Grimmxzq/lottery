const app = getApp();
const apiHttp = app.REQUEST_URL; //请求域名


function fun(url, method, data, header) {
  data = data || {};
  header = header || {
    // 'content-type' : method == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
    'content-type' : 'application/json'
  };
  let token = wx.getStorageSync("token");
  if (token) {
    let uid = wx.getStorageSync('userInfo').uid;
    data.token = token;
    data.uid = uid;
    if (!header || !header["token"]) {
      header["token"] = token;
    }
  }
  wx.showNavigationBarLoading();
  let promise = new Promise(function(resolve, reject) {
    wx.request({
      url: apiHttp + url,
      header: header,
      data: data,
      method: method,
      timeout: 10000, //超时定为10s
      success: function(res) {
        console.log(res);
        if (res.data.code) {
          switch (res.data.code) {
            case 200: //成功
                resolve(res.data);
              break;
            case 404 || 503: //缺少code
              wx.showToast({
                icon: 'none',
                title: '授权失败，请重新授权',
              })
              break;
            default:
              resolve(res.data);
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '状态码：' + res.statusCode + '。服务器异常,请稍后再试',
          })
        }
        // if (typeof res.data === "object") {
        //   if (res.data.status) {
        //     if (res.data.status === -200) {
        //       wx.showToast({
        //         title: "为确保能向您提供最准确的服务，请退出应用重新授权",
        //         icon: "none"
        //       });
        //       reject("请重新登录");
        //     } else if (res.data.status === -201) {
        //       wx.showToast({
        //         title: res.data.msg,
        //         icon: "none"
        //       });
        //       setTimeout(function() {
        //         wx.navigateTo({
        //           url: "/pages/user/supplement/supplement"
        //         });
        //       }, 1000);
        //       reject(res.data.msg);
        //     }
        //   }
        // }
        
      },
      fail: function(e) {
        console.log(e);
        reject(e);
      },
      complete: function() {
        wx.hideNavigationBarLoading();
      }
    });
  });
  return promise;
}
module.exports = {
  apiHttp: apiHttp,
  "get": function(url, data, header) {
    return fun(url, "GET", data, header);
  },
  "post": function(url, data, header) {
    return fun(url, "POST", data, header);
  }
};