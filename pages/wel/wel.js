// pages/wel/wel.js
var app = getApp();
import control from '../../module/control.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: function (res) {
        console.log("getSystemInfo", res)
      },
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2196f3',
    })
    wx.setNavigationBarTitle({
      title: '客服管理',
    })

    control.getJudge(res => {
      var code = res.data;
      if (code != 1) {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      } else {
        // 注释
        console.log("------------", "sdkfjfslkdfjl")

        control.logIn();
      }
    });
  },
  wwww: function (o) {
    console.log(o)
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