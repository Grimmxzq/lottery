// pages/add/add.js
//获取应用实例
var app = getApp();
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['钱包地址领奖', '收货地址领奖', '手机号领奖', '添加官方微信领奖'],
    popUp: false,
    lock: false,
    expireTime: false,
    wayOfGiving: 0,
    vipExpiryTime: null,
    WechatAccept: false,
    byte: false,
    bytenumber: false,
    Wechat: null,
    newDate: false,
    pickDate: '',
    name: '', // 奖品名称
    amount: '', //奖品数量
    picKey: 'giftCard/cover/default.png',
    src: 'https://maggie-public.oss-cn-beijing.aliyuncs.com/littleApps/583594514074129397.png',
    index: 0,
    pageback: false,
    multiArray: [ //时间选择器
      ['', ''],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      ['00', '30']
    ],
    multiIndex: [0, 0, 0], //展示时间
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    prizeNum: [0], //当前奖项数量
    nameTotalVal: [], //所有奖品名称value值
    amountTotalValue: [], //所有奖品数量的value值
    imgsValue: ['https://maggie-public.oss-cn-beijing.aliyuncs.com/littleApps/583594514074129397.png'], //所有图片的地址
    condition: ["按时间自动开奖", "按人数自动开奖", "即开即中"], //开奖条件
    showCondition: 0,
    isIphonex: false, //适配iphonex以上版本
    switch1Checked: false, //高级功能是否开启 默认不开启
    isVip: false //是否是高级用户 默认false
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      common.uploadInfo(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)

    }
  },
  addImgTxt: function () {
    wx: wx.navigateTo({
      url: '../editor/editor',
    })
  },
  Wechat: function (event) {
    let that = this;
    that.setData({
      Wechat: event.detail.value
    })

  },
  isHome: function () {
    this.setData({
      popUp: !this.data.popUp
    })
  },
  advanced: function () {//进入高级页面
    let that = this
    if (that.data.vipExpiryTime == null) {
      that.setData({
        expireTime: !this.data.expireTime
      })
    } else {
      wx: wx.navigateTo({
        url: '../addaAdvanced/addAdvanced',
      })
    }
  },
  copy: function (event) { //复制
    wx.setClipboardData({
      data: 'xzq1628957104',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  inputchange: function ( e ) { //输入奖品名称时判断字节
    var that = this;
    var nowIdx=e.currentTarget.dataset.index;//获取当前索引
    var val=e.detail.value;//获取输入的值
    var oldVal=this.data.nameTotalVal;
    oldVal[nowIdx]=val;//修改对应索引值的内容
    if (val.length >= 20) {

      that.setData({
        byte: true
      })
    } else if (val.length < 20) {

      that.setData({
        byte: false
      })
    }
    that.setData({
      name: e.detail.value.replace(/\s+/g, ''),
      nameTotalVal: oldVal
    })
  },
  numberchange: function (e) { //输入数量判断
    var that = this;
    var nowIdx=e.currentTarget.dataset.index;//获取当前索引
    var val=e.detail.value;//获取输入的值
    var oldVal=this.data.amountTotalValue;
    oldVal[nowIdx]=val;//修改对应索引值的内容
    that.setData({
      amount: e.detail.value.replace(/\s+/g, ''),
      amountTotalValue: oldVal
    })
  },
  // 添加图片
  cehngePhoto: function (e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    const imgsValue = that.data.imgsValue;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0]
        // common.req({
        //   url: 'gift/uploadGiftCardCover',
        //   data: {},
        //   header: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   dataType: 'json',
        //   method: 'POST',
        //   success: function (uploadGiftCardCoverRes) {
        //     console.log(uploadGiftCardCoverRes)
        //     var filename = new Date().getTime() + util.getSuffix(tempFilePath);
        //     var formdata = {};
        //     // 注意formdata里append添加的键的大小写
        //     formdata.key = uploadGiftCardCoverRes.data.data.dir + filename;   //存储在oss的文件路径
        //     formdata.policy = uploadGiftCardCoverRes.data.data.policy;   //policy
        //     formdata.OSSAccessKeyId = uploadGiftCardCoverRes.data.data.accessId;   //accessKeyId
        //     formdata.success_action_status = "200";   //成功后返回的操作码
        //     formdata.Signature = uploadGiftCardCoverRes.data.data.signature;    //签名
        //     formdata['x-oss-security-token'] = uploadGiftCardCoverRes.data.data.securityToken;
        //     that.setData({
        //       picKey: formdata.key
        //     })
        //     console.log(that.data.picKey)
        //     wx: wx.uploadFile({
        //       url: app.FILE_URL,
        //       filePath: tempFilePath,
        //       name: 'file',
        //       formData: formdata,
        //       success: function (uploadFileRes) {
        //         console.log(uploadFileRes)
        //       },
        //     })
        //   },
        // })
        imgsValue[index] = tempFilePath;
        that.setData({
          imgsValue
        })
      }
    })
  },

  formSubmit: function (e) {
    let that = this
    that.setData({
      lock: true
    })
    if (that.data.wayOfGiving == 3 && that.data.Wechat == null) {
      wx.showToast({
        title: '请填写客服微信号',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        lock: false
      })
      return
    }
    let date = new Date();
    let hour = date.getHours() //计算小时数
    let minute = date.getMinutes() //计算分数
    let hous = that.data.multiArray[1][that.data.multiIndex[1]]
    let min = that.data.multiIndex[2]
    var minut = '';
    if (min == '0') {
      minut = '00'
    } else if (min == '1') {
      minut = 30
    }
    if (that.data.multiIndex[0] <= 0) {
      if (that.data.multiIndex[1] < hour) { //判断时间是否在当前时间之后
        that.setData({
          newDate: true
        })
      } else if (that.data.multiIndex[1] > hour) {
        that.setData({
          newDate: false
        })
      } else if (that.data.multiIndex[1] == hour) {
        if (minut < minute) {
          that.setData({
            newDate: true
          })
        } else {
          that.setData({
            newDate: false
          })
        }

      }
    } else {
      that.setData({
        newDate: false
      })
    }
    var str = that.data.multiArray[0][that.data.multiIndex[0]]
    let mon = str.slice(0, 2)
    let day = str.slice(3, 5)
    let year = date.getFullYear();
    if (mon < (date.getMonth() + 1)) {
      year = year + 1
    }
    let awardTime = year + '-' + mon + '-' + day + ' ' + hous + ":" + minut + ":00"
    if (that.data.amount > 0 && that.data.name != '' && that.data.byte == false) { //判断名称数量是否合法
      if (that.data.newDate == false) { //判断是时间是否合法
        common.req({
          url: 'gift/createGiftCard',
          data: {
            "type": "0000",
            "level": "0000",
            "name": that.data.name,
            "amount": that.data.amount,
            "picPath": that.data.picKey,
            "awardTime": awardTime,
            "sponsor": '',
            "introduction": app.globalData.introduction,
            "msgFormId": e.detail.formId,
            "wayOfGiving": parseInt(that.data.wayOfGiving) + 1,
            "awardWechat": that.data.Wechat
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          dataType: 'json',
          method: 'POST',
          success: function (res) {
            common.uploadInfo(that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
            wx.reLaunch({
              url: '../giftParticulars/giftParticulars?awardTime=' + res.data.data.awardTime + '&giftId=' + res.data.data.id + '&picPath=' + res.data.data.picPath + '&name=' + res.data.data.name + '&smallProgramCodePath=' + res.data.data.smallProgramCodePath + '&amount=' + res.data.data.amount + '&nickName=' + that.data.userInfo.nickName,
            })
          },

          complete: function (res) {
            that.setData({
              lock: false
            })
          },

        })
      } else {
        that.setData({
          lock: false
        })
        wx.showToast({
          title: '请检查开奖时间',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      that.setData({
        lock: false
      })
      wx.showToast({
        title: '奖品名称或数量不符合标准!',
        icon: 'none',
        duration: 2000
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '抽奖助手'
    })




    var dateObj = []; //生成最近三天的日期
    var date = new Date();
    var hour = date.getHours() //计算小时数
    var minute = date.getMinutes() //计算分数

    for (var i = 0; i < 3; i++) {
      let day;
      if (i == 0) {
        day = (date.getDay() + 0) % 7;
        date.setDate(date.getDate() + 0);
      } else if (i > 0) {
        day = (date.getDay() + 1) % 7;
        date.setDate(date.getDate() + 1);
      }
      let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');

      dateObj.push(((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "月" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "日" + " " + show_day[day])

    }
    if (minute < 30) { //如果分数小于30则把时间提高到30分
      that.setData({
        "multiIndex[2]": 1
      })
      that.setData({
        "multiIndex[1]": hour
      })
    } else if (minute >= 30) { //如果分数大于30则把小时提高一小时，分数为00
      that.setData({
        "multiIndex[1]": (hour + 1)
      })
      that.setData({
        "multiIndex[2]": 0
      })
    }
    that.setData({
      "multiArray[0]": dateObj,
      isIphonex: app.globalData.isIphoneX
    })

  },
  bindPickerChange: function (e) {
    let that = this
    console.log(e.detail.value)
    if (e.detail.value == 3) {
      that.setData({
        WechatAccept: true
      })
    } else {
      that.setData({
        WechatAccept: false,
        Wechat: null
      })
    }
    that.setData({
      wayOfGiving: e.detail.value
    })

  },
  // 开奖时间选择
  bindMultiPickerChange: function (e) {
    var that = this;
    let date = new Date();
    let hour = date.getHours() //计算小时数
    let minute = date.getMinutes() //计算分数
    let hous = that.data.multiIndex[1]
    let min = that.data.multiIndex[2]
    var minut = '';
    if (that.data.multiIndex[2] == '0') {
      minut = 0
    } else if (that.data.multiIndex[2] == '1') {
      minut = 30
    }
    if (that.data.multiIndex[0] <= 0) {
      if (that.data.multiIndex[1] < hour) { //判断时间是否在当前时间之后
        that.setData({
          newDate: true
        })
      } else if (that.data.multiIndex[1] > hour) {
        that.setData({
          newDate: false
        })
      } else if (that.data.multiIndex[1] == hour) {
        if (minut < minute) {
          that.setData({
            newDate: true
          })
        } else {
          that.setData({
            newDate: false
          })
        }

      }
    } else {
      that.setData({
        newDate: false
      })
    }
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    if (app.globalData.userInfo) { //在app页面获取userInfo
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

        }
      })
    }
    wx.getStorage({
      key: 'isVip',
      success (res) {
        that.setData({
          isVip: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.setData({
      introduction: app.globalData.introduction
    })

    // common.req({
    //   url: 'user/getVipExpiryTime',
    //   data: {},
    //   dataType: 'json',
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(res)
    //     if (((new Date(res.data.data.vipExpiryTime.replace(/-/g, "\/"))) > (new Date()))) {
    //       that.setData({
    //         vipExpiryTime: res.data.data.vipExpiryTime
    //       })
    //     } else {
    //       that.setData({
    //         vipExpiryTime: null
    //       })
    //     }
    //   },
    // })
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
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    prevPage.setData({
      id: 1
    })

    //   wx.navigateBack();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 添加奖项
   */
  addPrize: function () {
    var num = this.data.prizeNum;
    num.push(1);
    this.setData({
      prizeNum: num
    });
  },
  /**
   * 删除奖项
   */
  deletePrize: function (e) {
    var nowidx=e.currentTarget.dataset.index;//当前索引
    var nameTotalVal=this.data.nameTotalVal;//所有的input值
    var amountTotalValue=this.data.amountTotalValue;//所有的input值
    var imgsValue=this.data.imgsValue;//所有的input值
    var oldarr=this.data.prizeNum;//循环内容
    oldarr.splice(nowidx,1);    //删除当前索引的内容，这样就能删除view了
    nameTotalVal.splice(nowidx,1);//view删除了对应的input值也要删掉
    amountTotalValue.splice(nowidx,1);
    imgsValue.splice(nowidx,1)
    if (oldarr.length < 1) {
        oldarr = [0]  //如果循环内容长度为0即删完了，必须要留一个默认的。这里oldarr只要是数组并且长度为1，里面的值随便是什么
    }
    this.setData({
      prizeNum:oldarr,
        nameTotalVal,
        amountTotalValue,
        imgsValue
    })
  },
  /**
   * 选择开奖条件
   */
  bindPickerChangeCondition: function(e) {
    this.setData({
      showCondition: e.detail.value * 1
    })
  },
  /**
   * 查看示例
   */
  goExample: function () {
    wx.navigateTo({
      url: '../example/example',
    })
  },
  /**
   * 高级功能开启
   */
  switch1Change: function (e) {
    // 此处需要严格判断 判定是否有权限开启
    let isChecked;
    if(this.data.isVip) {
      // 若是vip 
      isChecked = e.detail.value;
    } else {
      isChecked = false;
      wx.showToast({
        title: "您还不是高级用户",
        icon: "none"
      })
    }
    this.setData({
      switch1Checked: isChecked
    })
  },
  /**
   * 高级功能提示
   */
  heighterTip() {
    wx.showModal({
      title: '提示',
      content: '此功能为高级用户专属功能，若想使用，请联系客服',
      showCancel: false
    })
  },
  /**
   * 去设置参与人员页面
   */
  goUsersPage() {
    wx.navigateTo({
      url: '../totalUsers/totalUsers',
    })
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})