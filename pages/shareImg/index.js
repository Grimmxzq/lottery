// pages/shareImg/index.js
var app = getApp();
/// 获取canvas转化后的rpx
const rate = function(rpx) { 
  return rpx / app.globalData.radio
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphonex: false, //适配iphonex以上版本
    canvasHeight: app.globalData.windowHeight,
    canvasWidth: 0,
    lid: 0,
    prizeImg: '',
    num: 0,
    times: '',
    name: '',
    desc: '',
    isSave: false //能否点击保存 默认不能
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '生成海报中...',
    })
    const shareInfo = wx.getStorageSync('shareInfo');
    this.setData({
      isIphonex: app.globalData.isIphoneX,
      lid: shareInfo.lid,
      prizeImg: shareInfo.img,
      num: shareInfo.num,
      times: shareInfo.times,
      name: shareInfo.name,
      desc: shareInfo.desc
    });
    this.getCodeUrl();
  },
  // 获取小程序码
  getCodeUrl() {
    let url ="https://www.forevermisstogether.top/wx/static/image/2020070820005292007.jpg";
    this.init(url);
  },
  /**
   * 初始化海报
   */
  init(codeImg) {
    // codeImg 小程序码图片
    let that = this;
    let avatarImg = wx.getStorageSync('userInfo').avatarUrl; //用户头像
    let nickName = wx.getStorageSync('userInfo').nickName;
    let prizeImg = that.data.prizeImg; //奖品图片
    this.getImageAll([avatarImg, prizeImg, codeImg]).then(((res) => {
      let avatarImg = res[0];
      let prizeImg = res[1];
      let codeImg = res[2];
      // 使用 wx.createContext 获取绘图上下文 context
      let ctx = wx.createCanvasContext('shareCanvas');
      let canvasWidth = rate(700); //定义canvas宽度
      let canvasHeight = rate(2000); //定义canvas高度
      let windowWidth = app.globalData.windowWidth;
      /// 直径
      const diameter = rate(100);
      /// 圆参数 
      const arc = {
        radii: diameter / 2,
        // x: rate(40),
        x: windowWidth / 2,
        y: rate(40)
      };
      
      // 1.设置 canvas 的背景并填充canvas
      ctx.setFillStyle('#e76a59');
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 2.添加头像
      ctx.save();
      ctx.beginPath();
      ctx.arc(arc.x - (arc.radii / 2), arc.y + arc.radii, arc.radii, 0, Math.PI * 2, false); //画圆
      ctx.clip(); //剪切
      ctx.drawImage(avatarImg.path, arc.x - (arc.radii * 1.5), arc.y, diameter, diameter);
      ctx.restore();

      // 3.添加用户名
      ctx.setFontSize(14);
      ctx.setFillStyle('white');
      ctx.fillText( nickName, (canvasWidth - ctx.measureText(nickName).width) / 2, 90);

      // 4.添加副标题
      ctx.setFontSize(16);
      ctx.fillText( '邀请你来参加抽奖', (canvasWidth - ctx.measureText('邀请你来参加抽奖').width) / 2, 115);

      const prizeImgHeight = (prizeImg.height / prizeImg.width) * (canvasWidth - 50);
      // 5.添加背景容器
      ctx.setFillStyle('#fff');
      ctx.fillRect(10, 130, canvasWidth - 20, prizeImgHeight + 15);

      // 6.绘制奖品图片
      ctx.save();
      ctx.fillRect(25, 145, canvasWidth - 50, prizeImgHeight);
      ctx.drawImage(prizeImg.path, 25, 145, canvasWidth - 50, prizeImgHeight);
      ctx.restore();

      // 7.奖品名称
      const name = that.data.name;
      const num = that.data.num;
      ctx.setFontSize(16);
      ctx.fillRect(10,prizeImgHeight + 145, canvasWidth - 20, that.drawText(ctx, '奖品：' + name + ' x ' + num, 25, prizeImgHeight + 170, 148, canvasWidth - 50) - prizeImgHeight - 145);
      ctx.setFillStyle('#000');
      const prizeHeight = that.drawText(ctx, '奖品：' + name + ' x ' + num, 25, prizeImgHeight + 170, 148, canvasWidth - 50);
      // debugger

      // 8.开奖日期
      const time = that.data.times;
      ctx.setFillStyle('#fff');
      ctx.fillRect(10, prizeHeight, canvasWidth - 20, 20);
      ctx.setFontSize(12);
      ctx.setFillStyle('#999');
      ctx.fillText( time + ' 自动开奖', 25, prizeHeight + 20);
      

      // 9.绘制线条
      ctx.setFillStyle('#fff');
      ctx.fillRect(10, prizeHeight+ 20, canvasWidth - 20, 11);
      ctx.setFillStyle('#eee');
      ctx.fillRect( 25, prizeHeight + 29, canvasWidth - 50, 1);
      ctx.fillRect( 25, prizeHeight + 30, canvasWidth - 50, 1);

      // 10.绘制小程序码
      ctx.setFillStyle('#fff');
      ctx.fillRect(10, prizeHeight+ 31, canvasWidth - 20, 150);
      ctx.save();
      ctx.fillRect(25, prizeHeight + 40, canvasWidth - 50, 130);
      ctx.drawImage(codeImg.path, 25, prizeHeight + 40, canvasWidth - 50, 130);
      ctx.restore();

      // 11.提示
      ctx.setFillStyle('#fff');
      ctx.fillRect(10, prizeHeight+ 160, canvasWidth - 20, 31);
      const tips = "长按识别小程序，参与抽奖";
      ctx.setFontSize(12);
      ctx.setFillStyle('#999');
      ctx.fillText( tips, (canvasWidth - ctx.measureText(tips).width) / 2, prizeHeight + 190);

      // --------------------
      ctx.setFillStyle('#fff');
      ctx.fillRect(10, prizeHeight+ 191, canvasWidth - 20, 11);
      ctx.setFillStyle('#eee');
      ctx.fillRect( 25, prizeHeight + 200, canvasWidth - 50, 2);

      // 12.抽奖说明
      // const name = that.data.name;
      const desc = that.data.desc;
      ctx.setFontSize(12);
      ctx.setFillStyle('#fff');
      ctx.fillRect(10, prizeHeight+ 201, canvasWidth - 20, that.drawText(ctx, '抽奖说明：' + desc, 25, prizeHeight + 40 + 190, 148, canvasWidth - 55) - prizeHeight - 191);
      ctx.setFillStyle('#999');
      const prizeState = that.drawText(ctx, '抽奖说明：' + desc, 25, prizeHeight + 40 + 190, 148, canvasWidth - 55);

      // debugger
      that.setData({
        canvasHeight: prizeState + 30,
        canvasWidth,
        isSave: true
      })
      ctx.draw();
      wx.hideLoading();
    })).catch((err) => {
      console.log("图片生成失败", err);
    })
  },
  /**
   * 图片生成临时路径
   */
  getImage: function (url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: function (res) {
          resolve(res)
        },
        fail: function (e) {
          console.log("图片生成临时路径生成失败");
          wx.showToast({
            title: '图片生成失败' +url,
            icon: 'none'
          })
          reject("图片生成临时路径生成失败");
        }
      })
    })
  },
  /**
   * 等待图片全部生成
   */
  getImageAll: function (image_src) {
    let that = this;
    var all = [];
    image_src.map(function (item) {
      all.push(that.getImage(item))
    })
    return Promise.all(all)
  },
  /**
 * 多行文本溢出
 * @param {Object} context - canvas组件的绘图上下文
 * @param {String} text - 文本内容
 * @param {Number} maxWidth - 文本最大宽度
 * @param {Number} maxRow - 文本最多显示行数
 * @param {String} font - 字体样式
 * @param {String} color - 文本颜色
 * @param {Number} lineHeight - 文本行高
 * @param {Number} x - 文本的x坐标
 * @param {Number} y - 文本的y坐标
 * @param {Boolean} broken - 单词是否截断显示【true → 单词截断显示，适用于：纯中文、中英混排、纯英文（不考虑英文单词的完整性）】【false → 单词完整显示，考虑英文单词的完整性，仅适用于纯英文】
 */
  drawTextOverflow:function(context, text, maxWidth, maxRow, font, color, lineHeight, x, y, broken = true) {
    let arr = [];
    let temp = '';
    let row = [];
    let separator = broken ? '' : ' ';
  
    text = text.replace(/[\r\n]/g, ''); // 去除回车换行符
    arr = text.split(separator);
  
    context.font = font;  // 注意：一定要先设置字号，否则会出现文本变形
    context.fillStyle = color;
  
    if (context.measureText(text).width <= maxWidth) {
      row.push(text);
    } else {
      for (let i = 0; i < arr.length; i++) {
        // 超出最大行数且字符有剩余，添加...
        if (row.length == maxRow && i < arr.length - 1) {
          row[row.length - 1] += '...';
          break;
        }
  
        // 字符换行计算
        if (context.measureText(temp).width < maxWidth) {
          temp += arr[i] + separator;
  
          // 遍历到最后一位字符
          if (i === arr.length - 1) {
            row.push(temp);
          }
        } else {
          i--;  // 防止字符丢失
          row.push(temp);
          temp = '';
        }
      }
    }
  
    // 绘制文本
    for (let i = 0; i < row.length; i++) {
      context.fillText(row[i], x, y + i * lineHeight, maxWidth);
    }
  
    return row.length * lineHeight;  // 返回文本高度
  },
  /**
   * 文本换行
   */
  drawText: function(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    str = str.replace(/[\r\n]/g, ' '); // 去除回车换行符
    for (let i = 0; i < str.length; i++) {
        lineWidth += ctx.measureText(str[i]).width;
        if (lineWidth > canvasWidth) {
            ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
            initHeight += 20; //16为字体的高度
            lineWidth = 0;
            lastSubStrIndex = i;
            titleHeight += 20;
        }
        if (i == str.length - 1) { //绘制剩余部分
            ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
        }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 20;
    return initHeight
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
  // 
  handleError(e) {
    console.log(e);
  },
  // 保存图片
  saveImg() {
    var that = this;
    let canvasWidth = that.data.canvasWidth;
    let canvasHeight = that.data.canvasHeight;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          console.log("用户已授权")
          wx.showLoading({
            title: '保存图片中...',
          })
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: canvasWidth,
            height: canvasHeight,
            destWidth: canvasWidth * 2,
            destHeight: canvasHeight * 2,
            canvasId: 'shareCanvas',
            success: function (res) {
              console.log(res)
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail(err) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail: function (err) {
              wx.hideLoading();
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          });
        } else {
          if (res.authSetting['scope.writePhotosAlbum'] == false) {
            console.log("用户未授权获取相册功能");
            wx.showModal({
              title: '获取相册授权',
              content: '检测到未授权相册，是否前往授权？',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(res) {
                      console.log(res.authSetting);
                      if (res.authSetting['scope.writePhotosAlbum'] == true) {
                        wx.showToast({
                          title: '相册授权成功'
                        })
                      } else {
                        wx.showToast({
                          title: '相册授权失败',
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
            wx.showLoading({
              title: '保存图片中...',
            })
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: canvasWidth,
              height: canvasHeight,
              destWidth: canvasWidth * 2,
              destHeight: canvasHeight * 2,
              canvasId: 'shareCanvas',
              success: function (res) {
                console.log(res)
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '保存成功'
                    })
                  },
                  fail(err) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
              },
              fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              }
            });
          }
        }
      },
      fail(error){
        wx.showToast({
          title: error,
          icon: 'none'
        })
      }
    })
  }
})