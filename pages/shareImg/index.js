// pages/shareImg/index.js
var app = getApp();
const Request = require("../../utils/request");//导入模块
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
    condition: '',
    prize: [],
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
      desc: shareInfo.desc,
      prize: shareInfo.prize,
      condition: shareInfo.condition
    });
    this.getCodeUrl();
  },
  // 获取小程序码
  getCodeUrl() {
    const that = this;
    Request.post('lottery/ProgramCode/',{
      scene: that.data.lid
    }).then((res) => {
      console.log(res);
      const {code,data, message} = res;
      if (code === 200) {
        this.init(data.url);
      } else {
        wx.showToast({
          title: message,
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: err.message,
        icon: 'none'
      });
    })
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
      let avatarImg = res[0]; //头像url
      let prizeImg = res[1]; //奖品url
      let codeImg = res[2]; //小程序码url

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
      
      // 1.设置 canvas 的背景颜色并填充canvas 定义2个部分分开填充
      let initHieght = 130; //定义顶部高度
      let leftLength = 25; //定义到左边的安全距离
      let safeDistance = 10; //定义安全距离
      let prizeImgHeight = (prizeImg.height / prizeImg.width) * (canvasWidth - 50); //设置奖品图片高度
      console.log("设置奖品图片高度", prizeImgHeight);
      // header部分
      ctx.setFillStyle('#e76a59');
      // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillRect(0, 0, canvasWidth, initHieght);
      // contain部分
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, initHieght, canvasWidth, canvasHeight - initHieght);

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

      // 5.绘制奖品图片
      let height1 = initHieght + safeDistance; //奖品图片距离顶部的高度
      ctx.save();
      ctx.fillRect(leftLength, height1, canvasWidth - 50, prizeImgHeight);
      ctx.drawImage(prizeImg.path, leftLength, height1, canvasWidth - 50, prizeImgHeight);
      ctx.restore();

      // 7.奖品标题
      let height2 = height1 + prizeImgHeight + safeDistance * 2; //奖品标题距离顶部的高度
      ctx.setFontSize(16);
      ctx.setFillStyle('#000');
      ctx.fillText( '奖品：', leftLength, height2);

      
      // ctx.setFillStyle('#f1341c');
      // ctx.fillRect(0, height1, canvasWidth, prizeImgHeight);
      // 8.奖品名称
      let height3 = height2 + safeDistance * 2; //奖品名称距离顶部的高度
      ctx.setFontSize(14);
      ctx.setFillStyle('#333');
      let d = height3;
      for (let i = 0; i < this.data.prize.length; i++) {
        const  item = this.data.prize[i];
        d = that.drawText( ctx,item.grade + ': ' + item.name + ' x ' + item.num + '份', leftLength, d, 30, canvasWidth - 50) + safeDistance * 2;
      }

      // 9.开奖日期
      let height4 = d; //开奖日期距离顶部的高度
      const time = that.data.times;
      ctx.setFontSize(12);
      ctx.setFillStyle('#999');
      // s 按人数开奖 t 按时间自动开奖 i 即开即中
      const way = that.data.condition === 's' ? '按人数开奖' : that.data.condition === 't' ? '按时间自动开奖' : '即开即中';
      ctx.fillText( time + ' ' + way, leftLength, height4);

      // 10.绘制线条
      let height5 = height4 + safeDistance; //线条距离顶部的高度
      ctx.setFillStyle('#eee');
      ctx.fillRect( 25, height5, canvasWidth - 50, 1);
      ctx.fillRect( 25, height5 + 1, canvasWidth - 50, 1);

      // 11.绘制小程序码
      let height6 = height5 + safeDistance + 1; //小程序码距离顶部的高度
      ctx.save();
      ctx.setFillStyle('#fff');
      ctx.fillRect(leftLength, height6, canvasWidth - 50, 130);
      ctx.drawImage(codeImg.path, (canvasWidth - 130) / 2, height6, 130, 130);
      ctx.restore();

      // 12.提示
      let height7 = height6 + safeDistance + 130; //提示距离顶部的高度
      ctx.setFillStyle('#fff');
      ctx.fillRect(10, height7, canvasWidth - 20, 32);
      const tips = "长按识别小程序，参与抽奖";
      ctx.setFontSize(12);
      ctx.setFillStyle('#999');
      ctx.fillText( tips, (canvasWidth - ctx.measureText(tips).width) / 2, height7);

      // 13.绘制线条
      let height8 = height7 + safeDistance; //线条距离顶部的高度
      ctx.setFillStyle('#eee');
      ctx.fillRect( 25, height8, canvasWidth - 50, 1);

      // 14.抽奖说明
      let height9 = height8 + safeDistance * 2; //抽奖说明距离顶部的高度
      const desc = that.data.desc;
      ctx.setFontSize(12);
      ctx.setFillStyle('#999');
      const prizeState = that.drawText(ctx, '抽奖说明：' + desc, 25, height9, 30, canvasWidth - 55) + safeDistance;

      // 15封边
      ctx.setFillStyle('#e76a59');
      ctx.fillRect(0, initHieght, safeDistance, prizeState);
      ctx.fillRect(canvasWidth - safeDistance, initHieght, safeDistance, prizeState);
      ctx.fillRect(0, prizeState, canvasWidth, safeDistance * 2);

      // debugger
      that.setData({
        canvasHeight: prizeState + safeDistance * 2,
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
   * @param {Object} context - canvas组件的绘图上下文
   * @param {String} str - 文本内容
   * @param {Number} leftWidth - 距离左边的距离
   * @param {Number} initHeight - 字体距离顶部的高度
   * @param {Number} titleHeight - 字体的行高
   * @param {Number} canvasWidth - 宽度
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