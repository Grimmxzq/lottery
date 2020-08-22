// pages/complaint/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ["虚假抽奖","恶意营销","伪冒侵权","政治敏感","其他违规","诱导分享"],
    radio: '', //选择
    value: '', //联系方式
    message: '', //问题描述
    fileList: [],
    isDisabled: true,
    isLoading: false
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
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
      isDisabled: false
    });
  },
  afterRead(event) {
    const {fileList} = this.data;
    fileList.push({
      url:event.detail.file.path
    });
    this.setData({
      fileList
    })
  },
  deleteRead(event) {
    const {fileList} = this.data;
    const idx = event.detail.index;
    fileList.splice(idx, 1);
    this.setData({
      fileList
    })
  },
  onChange(event) {
    this.setData({
      value: event.detail
    })
  },
  submitButton() {
    const { value } = this.data;
    const that = this;
    if (value === '') {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '上传中...',
      success() {
        that.setData({
          isLoading: true
        })
      }
    });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '上传成功，我们会尽快处理',
        icon: 'none',
        success() {
          that.setData({
            isLoading: false
          })
        }
      })
    }, 2000);
  }
})