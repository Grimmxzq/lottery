// pages/examples/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [0],
    collapseData: [
      {
        title: '引导加好友',
        tips: '配合快捷加粉功能，设置个人微信加粉',
        content: `动动小手，点击上方↑↑↑「加好友」，就可以找我玩，参与更多票圈福利`
      },
      {
        title: '个人号加粉',
        tips: '',
        content: `喜欢 xxx 的小伙伴，欢迎来认识下我~ xxx（微信号）\n\n每周都有最新款，xxx 供货，亲自挑选，价格美丽有优惠\n\n七天无理由退换，xxx 年老店售后无忧，还会免费提供搭配建议，陪你聊天~\n\n上新时都配有福利抽奖，概率超大，带上好姐妹一起来吧\n\n本次奖品是 xxx，开奖后添加微信号 xxx 兑奖，包邮寄送`
      },
      {
        title: '引导关注公众号',
        tips: '配合快捷加粉功能，设置公众号加粉',
        content: `动动小手，点击上方↑↑↑「去了解」，就可以第一时间获取最新福利推文啦`
      },
      {
        title: '仅公众号粉丝可参与',
        tips: '配合【仅公众号粉丝可参与】功能使用',
        content: `庆祝 xxx ，特别给大家送上一份心意\n\n仅限公众号 xxx 粉丝参与。在公众号后台对话框回复 xxx ，获取抽奖入口。\n\n推文经常有抽奖福利，记得关注常看哦`
      },
      {
        title: '引导参与者组队',
        tips: '配合组队功能的使用',
        content: '记得拉上好友，一起组队参与，一人中奖，全团有份，获取成倍惊喜'
      },
      {
        title: '领奖方式说明',
        tips: '配合发放奖品方式设置',
        content: `开奖后，记得在 xxx 日内「填写地址，邮寄送达/添加客服微信 xxx ，私信截图兑奖」`
      },
      {
        title: '节日活动',
        tips: '',
        content: `圣诞节又要到了~ 很久没跟大家见面的我来发福利啦\n\n用心（且出血）的给大家准备了一份超长礼物清单，详情可戳图文↓↓↓查看`
      },
      {
        title: '门店促销',
        tips: '',
        content: `深秋季节，小店给顾客们送来一份好口福~ 全新菜品 xxx ，欢迎来店品尝\n\n提前参与抽奖，幸运霸王餐、超额折扣......更优惠的价格，更诱人的美味\n\n门店地址：xxx\n\n兑奖说明：中奖后 xxx 日内到店消费有效。请幸运儿添加小店微信 xxx 预约`
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  // 复制
  copyMsg(e) {
    const id = e.currentTarget.dataset.index;
    const data = this.data.collapseData[id].content;
    wx.setClipboardData({
      data,
      success (res) {
        wx.getClipboardData({
          success (res) {
            wx.showToast({
              title: '内容已复制',
              icon: 'none'
            })
          },
          fail() {
            wx.showToast({
              title: '复制失败',
              icon: 'none'
            })
          }
        })
      },
      fail() {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  },
  // 应用
  applyMsg(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    const id = e.currentTarget.dataset.index;
    const data = this.data.collapseData[id].content;
    prevPage.setData({
      desc: data,
    })
    wx.nextTick(() => {
      wx.navigateBack({
        delta: 1 //想要返回的层级
      })
    })
  }
})