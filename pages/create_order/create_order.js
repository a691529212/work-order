// pages/create_order/create_order.js
import control from '../../module/control.js';
import util from "../../utils/VUtil.js"
var app = getApp();
var context = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0],
    multiArray: [['账户问题', '产品问题'], ['忘记密码', '忘记账号', '余额不足', '付费缴费', '其他']],
    childList: null,
    title: null,
    des: null,
    imgList: ["/img/add.png"],
    imgData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context = this;
    wx.setNavigationBarTitle({
      title: '新建工单',
    })
    // 获取工单分类
    control.typeworkers((res) => {
      console.log("工单分类 :", res.data);
      var fatherList = [];
      var childList = [];
      for (let i = 0; i < res.data.length; i++) {
        fatherList.push(res.data[i])
        childList.push(res.data[i].children)
      }
      var multiArray = [];
      multiArray.push(fatherList);
      multiArray.push(childList[0])
      context.setData({
        multiArray: multiArray,
        childList: childList
      })
    })
  },
  my_order: function () {
    wx.redirectTo({
      url: '/pages/home/home',
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = context.data.childList[data.multiIndex[0]];
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  input_title: function (o) {
    var title = o.detail.value
    title = title.trim();
    context.setData({
      title: title
    })
    return title;
  },
  input_des: function (o) {
    var des = o.detail.value
    des = des.trim();
    context.setData({
      des: des
    })
    return des;
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
          console.log("complete------------")
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
  // 提交
  confrim: function () {
    wx.showLoading({
      title: '提交中...',
    })
    var imgList = [];
    imgList = context.data.imgList;
    this.upFile(imgList);
  },

  upFile: function (imgList) {
    var index = context.data.imgData.length;
    var result = "fail_img"
    if (imgList[index] == "/img/add.png") {
      console.log(context.data.imgData)
      var id = context.data.multiArray[1][context.data.multiIndex[1]].id;
      var title = context.data.title;
      var content = context.data.des;
      var file = context.data.imgData;
      var data = {
        category_id: id,
        title: title,
        content: content,
        file: file
      }
      control.createOrder(data, res => {
        if (res.errorCode == 0) {
          wx.hideLoading();
          wx.redirectTo({
            url: '/pages/home/home?msg=' + res.msg,
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
          console.log(res)
          console.log(JSON.parse(res.data))
          result = JSON.parse(res.data).data[0];
        }, fail: error => {
          console.log("fail--->",error)
        }, complete: () => {
          context.data.imgData.push(result);
          context.upFile(imgList);
        }
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

  }
})