// // pages/cutImg/index.js
var app = getApp();
Page({
  data: {
      src:'',
      width: 500,//宽度
      height: 200,//高度
      isIphonex: false,
      index: 0
  },
  onLoad: function (options) {
    console.log(options);
      //获取到image-cropper对象
      this.cropper = this.selectComponent("#image-cropper");
      //开始裁剪
      this.setData({
          src: options.url,
          index: options.index,
          isIphonex: app.globalData.isIphoneX
      });
      wx.showLoading({
          title: '加载中'
      })
  },
  cropperload(e){
      console.log("cropper初始化完成");
  },
  loadimage(e){
      console.log("图片加载完成",e.detail);
      wx.hideLoading();
      //重置图片角度、缩放、位置
      this.cropper.imgReset();
  },
  clickcut(e) {
      console.log(e.detail);
      //点击裁剪框阅览图片
      wx.previewImage({
          current: e.detail.url, // 当前显示图片的http链接
          urls: [e.detail.url] // 需要预览的图片http链接列表
      })
  },
  restart() {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          console.log(res);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const tempFilePath = res.tempFilePaths[0];
          const imgInfo = res.tempFiles[0];
          if (imgInfo.size / 1024 / 1024 >= 10) {
            wx.showModal({
              title: '提示', // 标题
              content: "图片超过10MB啦~",// 内容
              showCancel: false, // 是否显示取消按钮
              confirmText: '确定', // 确认按钮的文字
            });
            return
          }
          // 判断图片格式
          const imgSplit = tempFilePath.split(".");
          const imgSLen = imgSplit.length;
          if (["jpg", "jpeg", "png"].includes(imgSplit[imgSLen - 1])) {
            console.log("格式正确");
          } else {
            console.log("格式错误");
            wx.showModal({
                title: '提示',
                content: "请选择正确的图片格式",
                showCancel: false,
                confirmText: '确定',
            });
            return
          }
          if (tempFilePath) {
            this.setData({
                src: tempFilePath
            });
          }
        },
        fail(err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        }
      })
  },
  cancel() {
      wx.navigateBack()
  },
  isUpload() {
      const that = this;
      wx.showLoading({
        title: '剪切中...',
      })
      this.cropper.getImg((e) => {
        console.log(e);
        wx.uploadFile({
            url: app.REQUEST_URL + 'lottery/UploadFile/',
            filePath: e.url,
            name: 'image',
            timeout: 20000,
            header: {
              'token': wx.getStorageSync("token")
            },
            success(res) {
              console.log(res);
              let data;
              data = JSON.parse(res.data);
              console.log(data);
              if (data.code == 200) {
                const pages = getCurrentPages() 
                const prevPage = pages[pages.length-2] // 上一页// 调用上一个页面的setData 方法，将数据存储
                
                prevPage.setData({
                    url: encodeURIComponent(data.data.url),
                    num: that.data.index
                })
                wx.navigateBack();
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
      });
  }
})