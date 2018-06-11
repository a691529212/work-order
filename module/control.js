import vUtil from "../utils/VUtil.js";
/**
 * type 1 盈客云
 * type 2 盈客云备用
 */
var appType = 1;
var app = getApp();
var control = function () {
}

function getType() {
  return appType
}
/**
 * 获取判断条件
 * 1 审核中
 * 2 线上
 */
function getJudge(callback) {
  //设置status返回值
  // vUtil.request("api/setSecretkey?status=1", {}, res => {

  // })
  vUtil.request("api/getSecretkey", { type: appType }, res => {
    callback(res)
  })
}
/**
 * 微信登录 获取token
 */
function logIn() {
  wx.login({
    success: res => {
      var code = res.code;
      var date = {};
      date.code = code;
      date.type = appType;
      // vUtil.request("api/getUser/" + code, null, res => {
      //   console.log("=-=-=-=-=",res)
      // })
      // wx.request({
      //   url: 'https://platform.dev.360yingketong.com/api/getUser/' + code,
      //   success: res => {
      //     console.log(res)
      //   }

      // })
      wx.getSetting({
        success: setting => {
          vUtil.request("getToken", JSON.stringify(date), "POST", (res) => {
            console.log(res)
            var code = res.errorCode;
            if (code == 20404) {
              var openId = res.data.openid;
              wx.redirectTo({
                url: '/pages/login/login?openId=' + openId,
              })
            } else {
              var token = res.data.token;
              app.globalData.token = token;
              app.globalData.unique = res.data.unique;
              console.log(app.globalData)
              wx.redirectTo({
                url: '/pages/home/home?unique=' + res.data.unique,
              })
            }
          })
        }
      })
    }
  })
}

/**
 * 账号密码登录 
 * 
 */
function accountLogIn(data) {
  data.type = appType;
  vUtil.request("login", JSON.stringify(data), "POST", (res) => {
    var code = res.errorCode;
    if (code == 0) {
      var token = res.data.token;
      app.globalData.token = token;
      app.globalData.unique = res.data.unique;
      wx.redirectTo({
        url: '/pages/home/home',
      })
    } else {
      wx.showToast({
        title: res.msg,
      })
    }
    console.log(res)
  })
}

/**
 * 工单分类
 * 
 */
function typeworkers(callback) {
  vUtil.request("typeworkers", { token: app.globalData.token }, (res) => {
    console.log(res)
    callback(res)
  })
}

// 新建工单
function createOrder(data, callback) {
  data.token = app.globalData.token;
  vUtil.request("/ticket", JSON.stringify(data), "POST", res => {
    console.log(res)
    callback(res)
  })
}

//查询工单
function queryOrder(data, callback) {
  data.token = app.globalData.token;
  vUtil.request("api/myList", data, res => {
    console.log(res);
    callback(res)
  })
}

/**
 * 查询工单详情
 */
function queryDetail(id, callback) {
  var data = {
    token: app.globalData.token
  }
  vUtil.request("api/myDetailsList/" + id, data, res => {
    callback(res);
  });
}

/**
 * 回复工单
 */
function replyOrder(data, callback) {
  data.token = app.globalData.token
  vUtil.request("api/reply", JSON.stringify(data), "POST", res => {
    callback(res);
  })
}

/**
 * 领取工单
 */
function getOrder(calback) {
  var data = {
    token: app.globalData.token
  }
  vUtil.request("api/receiveTicket", data, res => {
    calback(res)
  })
}

function notice(callBack) {
  var data = {
    token: app.globalData.token
  }
  vUtil.request("api/notice", data, res => {
    callBack(res);
  })
}

function orderInUse(callBack) {
  var data = {
    token: app.globalData.token
  }
  vUtil.request("api/notshutdown", data, res => {
    callBack(res);
  })
}

function closeOrder(id, data, callback) {
  data.token = app.globalData.token;
  vUtil.request("api/close/" + id, data, res => {
    callback(res)
  })

}

function evaluate(data, callback) {
  data.token = app.globalData.token;
  vUtil.request("api/evaluate", JSON.stringify(data), "POST", res => {
    callback(res);
  })
}

function getNoticeInfo(data, callback) {
  vUtil.request("api/notice/" + data, { token: app.globalData.token }, res => {
    callback(res)
  })
}
module.exports = {
  logIn: logIn,
  accountLogIn: accountLogIn,
  typeworkers: typeworkers,
  createOrder: createOrder,
  queryOrder: queryOrder,
  queryDetail: queryDetail,
  replyOrder: replyOrder,
  getOrder: getOrder,
  notice: notice,
  orderInUse: orderInUse,
  closeOrder: closeOrder,
  evaluate: evaluate,
  getJudge: getJudge,
  getNoticeInfo: getNoticeInfo,
  getType: getType
};