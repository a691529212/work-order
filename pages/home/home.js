// pages/home/home.js
var app = getApp();
var unique = app.globalData.unique;
var context = null;
var page = 1;
var pageSize = 10;
import control from '../../module/control.js';
import uiTool from "../../module/ui_tool.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '暂无通知',
    notice_id: 0,
    index: -1,
    unique,
    lastPage: 1,
    orderList: null,
    orderInUse: null,
    top1: 0,
    top2: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: options.msg,
    })
    context = this;
    unique = app.globalData.unique;
    var top1, top2;
    if (unique == 0) {
      top1 = "170rpx"
      top2 = "290rpx"
    } else {
      top1 = "60rpx"
      top2 = "180rpx"
    }
    context.setData({
      unique: unique,
      top1: top1,
      top2: top2
    })
    wx.setNavigationBarTitle({
      title: '我的工单',
    })

    control.notice(res => {
      if (res.errorCode == 0) {
        context.setData({
          text: res.data.notice_title,
          notice_id: res.data.id
        })
      }
    })

  },
  queryOrder: function () {
    //查询未处理的工单数
    control.orderInUse(res => {
      if (res.errorCode == 0) {
        context.setData({
          orderInUse: res.data.Count_NotShutDown
        })
      }
    });

    var date = {
      page: page,
      size: pageSize,
    }
    var index = context.data.index;
    if (index != -1) {
      date.progress = index;
    }
    control.queryOrder(date, res => {
      var code = res.errorCode;
      wx.stopPullDownRefresh();
      if (code == 0) {
        var orderList = context.data.orderList;
        if (page == 1) {
          orderList = [];
        }
        for (let i = 0; i < res.data.data.length; i++) {
          var state = res.data.data[i].progress;
          var date = res.data.data[i];
          date.state = uiTool.progress2state(state);
          date.level = uiTool.level2state(date.level);
          orderList.push(date)
        }
        context.setData({
          orderList: orderList,
          lastPage: res.data.last_page
        })
      } else if (code === 10404 && res.msg === "暂无数据") {
        context.setData({
          orderList: [],
          lastPage: 0
        })

      }
      else {
        wx.showToast({
          title: res.msg,
        })
      }
    });
  },
  getOrder: function () {
    control.getOrder(res => {
      console.log(res)
      wx.showToast({
        title: res.msg,
      })
      page = 1;
      this.queryOrder();
    })
  },
  /**
   * 工单列表点击事件
   */
  item_click: function (o) {
    var info = o.currentTarget.dataset.info;
    wx.navigateTo({
      url: '/pages/order_detail/order_detail?id=' + info.id,
    })
  },

  /**
   * 全部 未处理  待回复 变化
   */
  check: function (data) {
    var index = data.currentTarget.dataset.index;
    page = 1;
    context.setData({
      index: index
    })
    this.queryOrder();
  },
  // 自动接单switch
  switch_change: function (o) {
    var open = o.detail.value;
  },
  create_order: function () {
    wx.redirectTo({
      url: '/pages/create_order/create_order',
    })
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
    this.queryOrder();
    // 页面显示

  },
  notice_info: function () {
    wx.navigateTo({
      url: '/pages/notice/notice?id=' + context.data.notice_id,
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
    console.log("refresh")
    page = 1;
    this.queryOrder()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("bottom")
    if (page == context.data.lastPage) {
      wx.showToast({
        title: '没有更多',
      })
    } else {
      page = page + 1;
      this.queryOrder();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})