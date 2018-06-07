// pages/login/login.js
import control from '../../module/control.js'
var context = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: null,
    password: null,
    passFocus: false,
    openId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2196f3',
    })
    wx.setNavigationBarTitle({
      title: '登录',
    })
    context = this;
    console.log(options)
    context.setData({
      openId: options.openId
    })

  },
  //键入用户名
  input_account: function (o) {
    var account = o.detail.value;
    account = account.trim();
    context.setData({
      account: account
    })
    return account;

  },
  //键入用户名后 点击下一个
  next: function () {
    context.setData({
      passFocus: true,
    })
  },
  //键入密码
  input_password: function (o) {
    var password = o.detail.value.trim();
    context.setData({
      password: password
    })
    return password;
  },
  //登录点击事件
  login: function () {
    // wx.navigateTo({
    //   url: '/pages/home/home',
    // })
    var data = {}
    data.user_name = context.data.account;
    data.password = context.data.password;
    data.openid = context.data.openId
    control.accountLogIn(data);
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