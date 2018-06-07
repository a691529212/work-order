// pages/notice/notice.js
import control from '../../module/control.js';
var context = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context = this;
    wx.setNavigationBarTitle({
      title: '通知公告',
    })
    var id = options.id;
    control.getNoticeInfo(id, res => {
      console.log(res)
      var data = res.data;
      // data.notice_text = data.notice_text.replace(/\s/g, "&nbsp;").replace(/\r?\n/g, "<br/>");
      data.notice_text = data.notice_text.replace(/&nbsp;/ig, ' ')
      context.setData({
        notice: data
      })
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