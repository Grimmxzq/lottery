// pages/introduces/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc: '',
    fileList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = wx.getStorageSync('imgAndText');
    if (data) {
      this.setData({
        desc: data.text,
        fileList: data.imgs
      })
    }
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
  descInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  afterRead(event) {
    console.log(event);
    const { file } = event.detail;
    const { fileList } = this.data;
    file.forEach((item) => {
      fileList.push({
        url: item.path
      })
    })
    this.setData({
      fileList
    })
  },
  deleteRead(e) {
    const id = e.detail.index;
    const { fileList } = this.data;
    fileList.splice(id, 1);
    this.setData({
      fileList
    })
  },
  getImage: function (url) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.REQUEST_URL + 'lottery/UploadFile/',
        filePath: url.url,
        name: 'image',
        timeout: 20000,
        header: {
          'token': wx.getStorageSync("token")
        },
        success(res) {
          console.log(res);
          let data;
          data = JSON.parse(res.data);
          if (data.code == 200) {
            resolve({
              url: data.data.url
            });
          } else {
            wx.showToast({
              icon: 'none',
              title: '图片上传失败，请重新上传',
            })
          }
        },
        fail(err) {
          console.log(err);
          wx.showToast({
            icon: 'none',
            title: '图片上传失败，请重新上传',
          })
        }
      })
    })
  },
  getImageAll: function (image_src) {
    let that = this;
    var all = [];
    image_src.map(function (item) {
      all.push(that.getImage(item))
    })
    return Promise.all(all)
  },
  saveButton() {
    const {desc, fileList} = this.data;
    wx.showLoading();
    this.getImageAll(fileList).then((res) => {
      const files = res;
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      wx.setStorage({
        data: {
          text: desc,
          imgs: files
        },
        key: 'imgAndText',
        success() {
          prevPage.setData({
            introduce: {
              text: desc,
              imgs: files
            },
          })
          wx.nextTick(() => {
            wx.navigateBack({
              delta: 1 //想要返回的层级
            })
          })
        }
      })
    })
  }
})