// pages/ask_more/ask_more.js
import control from '../../module/control.js';
import util from "../../utils/VUtil.js"
var context = null;
var id = -1;
var app = getApp();
var unique = app.globalData.unique;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: ["/img/add.png"],
    imgData: [],
    content: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("|||||||||||||||||")
    context = this;
    id = options.id
    wx.setNavigationBarTitle({
      title: '继续反馈',
    })
  },
  itemClick: function (o) {
    console.log(o)
    var index = o.currentTarget.dataset.index;
    if (index == 5) {
      wx.showToast({
        title: '最多只能选择5张图片',
      })
    } else if (index == context.data.imgList.length - 1) {
      var count = 6 - context.data.imgList.length;
      wx.chooseImage({
        count: count,
        success: function (res) {
          var length = context.data.imgList.length - 1;
          var imgList = res.tempFilePaths;
          imgList.push("/img/add.png")
          if (length == 0) {
            context.setData({
              imgList: imgList
            })
          } else {
            var oldImgList = context.data.imgList
            oldImgList.pop();
            for (let i = 0; i < imgList.length; i++) {
              oldImgList.push(imgList[i])
            }
            context.setData({
              imgList: oldImgList
            })
          }
        },
        complete: function () {
        }
      })
    } else {
      var imgList = [];
      for (let i = 0; i < context.data.imgList.length; i++) {
        if (i < context.data.imgList.length - 1) {
          imgList.push(context.data.imgList[i]);
        }
      }
      wx.previewImage({
        urls: imgList,
        current: imgList[index],
      })
    }

  },
  input: function (o) {
    console.log(o);
    var value = o.detail.value;
    context.setData({
      content: value,
    })
  },
  sumbit: function () {
    if (context.data.content == null || context.data.content.length == 0 && context.data.imgList.length == 1) {
      wx.showToast({
        title: '请输入内容',
      })
    } else {
      this.upFile(context.data.imgList);
    }
  },
  upFile: function (imgList) {
    var index = context.data.imgData.length;
    var result = "fail_img"
    if (imgList[index] == "/img/add.png") {
      //todo 
      var tp = "agent";
      if (unique == 0) {
        tp = "reply"
      }
      var data = {
        ticket_id: id,
        content: context.data.content,
        type: tp,
        file: context.data.imgData
      }
      control.replyOrder(data, res => {
        console.log(res);
        if (res.errorCode == 0) {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
    } else {
      wx.uploadFile({
        url: util.getUrl() + "uploads",
        filePath: imgList[index],
        name: 'image[]',
        formData: {
          token: app.globalData.token
        },
        success: res => {
          console.log(JSON.parse(res.data))
          result = JSON.parse(res.data).data[0];
        }, fail: error => {
          console.log(error)
        }, complete: (e) => {
          console.log(e)
          context.data.imgData.push(result);
          context.upFile(imgList);
        }
      })
    }
  },
  itemLongClick: function (o) {
    var index = o.currentTarget.dataset.index;
    var count = context.data.imgList.length;
    var imgList = context.data.imgList;
    if (index < count - 1) {
      imgList.splice(index, 1);
    }
    context.setData({
      imgList: imgList
    })
    console.log(count)
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
    console.log("----------------------------------")
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

  }
})