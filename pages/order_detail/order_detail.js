// pages/order_detail/order_detail.js
import control from "../../module/control.js";
import uiTool from "../../module/ui_tool.js";
import util from "../../utils/VUtil.js"
var context = null;
var app = getApp();
var unique = app.globalData.unique;
var id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: null,
    progress: 0,
    unique,
    screenHeight: 0,
    screenWidth: 0,
    show: true,
    starList: ["/img/pinj_s.png", "/img/pinj_s.png", "/img/pinj_s.png", "/img/pinj_s.png"],
    index: 3,
    content: null,
    level: "非常满意",
    reportStarList: [],
    content: '',
    des: '',
    url: util.getUrl(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    context = this;
    unique = app.globalData.unique;
    context.setData({
      unique: unique
    })
    wx.setNavigationBarTitle({
      title: '工单详情',
    })

  },
  item_click: function (options) {
    console.log("----------")
    var index = options.currentTarget.dataset.index;
    var starList = [];
    var str = ""
    switch (index) {
      case 0:
        str = "不满意"
        break;
      case 1:
        str = "一般"
        break;
      case 2:
        str = "满意"
        break;
      case 3:
        str = "非常满意"
        break;
    }
    for (let i = 0; i < context.data.starList.length; i++) {
      if (i <= index) {
        starList.push("/img/pinj_s.png");
      } else {
        starList.push("/img/pinj.png");
      }
    }
    context.setData({
      starList: starList,
      index: index,
      level: str
    })

  },
  ww: function (opt) {
    console.log(opt)
  },
  img_click: function (options) {
    console.log(options)
    var data = options.currentTarget.dataset.date.file_url
    var list = [];
    for (let i = 0; i < data.length; i++) {
      list.push(context.data.url + data[i])
    }
    wx.previewImage({
      urls: list,
    })
  },

  input: function (e) {
    var content = e.detail.value
    context.setData({
      content: content
    })
  },
  confrim: function () {
    var content = context.data.content;
    var index = context.data.index + 1;
    var id = context.data.orderDetail.details.id;
    var data = {
      id: id,
      comment: index,
      content: content
    }
    control.evaluate(data, res => {
      console.log(res)
      if (res.errorCode == 0) {
        context.setData({
          show: true
        })
        this.queryInfo();

      }
    })
  },
  //继续反馈
  askmore: function () {
    wx.navigateTo({
      url: '/pages/ask_more/ask_more?id=' + context.data.orderDetail.details.id
    })
  },

  // 
  tapDes: function (o) {
    var des = o.currentTarget.dataset.des;
    var data = {};
    if (des == "关闭工单") {
      wx.showModal({
        title: '您的问题是否成功解决?',
        cancelText: '未解决',
        confirmText: '已解决',
        success: function (o) {
          console.log(o)
          var cancel = o.cancel;
          if (cancel) {
            data.progress = 4
          } else {
            data.progress = 3
          }
          control.closeOrder(context.data.orderDetail.details.id, data, res => {
            console.log(res)
            if (res.errorCode == 0) {
              context.queryInfo();
            }
          })
        },
      })
    } else if ("评价服务") {
      wx.getSystemInfo({
        success: function (res) {
          console.log(res)
          context.setData({
            screenHeight: res.screenHeight,
            screenWidth: res.windowWidth,
            show: !context.data.show
          })
        },
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

    context.queryInfo();
  },

  /**
   * 查询工单详情
   */
  queryInfo: function () {
    control.queryDetail(id, res => {
      console.log(res)
      var progress = res.data.details.progress;
      var state = uiTool.progress2state(progress);
      var pro = uiTool.progress2pro(progress);
      var data = res.data;
      data.state = state;
      var record = data.record;
      for (let i = 0; i < record.length; i++) {
        let type = record[i].type;
        var color = "#262132"
        if (type == 1) {
          color = "#262132";
        } else {
          color = "#4b9cd6"
        }
        record[i].color = color;
      }
      var list = [];
      var str = "";
      if (progress == 5) {
        var comment = data.estimate.comment - 1;
        switch (comment) {
          case 0:
            str = "不满意"
            break;
          case 1:
            str = "一般"
            break;
          case 2:
            str = "满意"
            break;
          case 3:
            str = "非常满意"
            break;
        }
        for (let i = 0; i < 4; i++) {
          if (i <= comment) {
            list.push("/img/pinj_s.png");
          } else {
            list.push("/img/pinj.png");
          }
        }
      }
      if (data.estimate.content) {
        context.setData({
          content: data.estimate.content,
        })
      }
      context.setData({
        orderDetail: data,
        progress: pro,
        reportStarList: list,
        des: str
      })
    })
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