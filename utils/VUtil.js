var baseUrl = 'https://daili.360yingketong.com/';
// var baseUrl = 'https://daili.dev.360yingketong.com/';
var app = getApp();

function getUrl() {
  return baseUrl;
}
// 设置网络请求通用信息
function setNetConfig(info) {
  wx.setStorage({
    key: 'netConfig',
    data: info,
    success: () => {
      app.globalData.netConfig = info
    }
  })
}

function getNetConfig(callBack) {
  if (app.globalData.netConfig) {
    callBack(app.globalData.netConfig)
  } else {
    wx.getStorage({
      key: 'netConfig',
      success: function (res) {
        callBack(res.data);
      },
    })
  }
}

function ResultBean(data) {
  this.code;
  this.errorMsg;
  this.data = data
  function setCode(code) {
    this.code = code;
  }
}
ResultBean.setCode = function (code) {
  ResultBean.code = code;
}

/**
 * 网络请求
 */
function request(param1, param2, param3, param4) {
  wx.showNavigationBarLoading()
  var paramNum = arguments.length;
  var url = baseUrl + param1;
  var netConfig = app.globalData.netConfig;
  // 常规get请求 
  if (paramNum == 3) {
    var requestData = {
      url: url,
      data: param2,
      success: (res) => {

        if (res.data.code === 10410) {
          token(() => {
            request(param1, param2, param3, param4)
          })
        } else {
          param3(res.data)
        }
      }, fail: () => {
        var date = {
          url: url,
          requestData: data,
        }
        console.error("ERROR :", data)
      }, complete: () => {
        //TODO
        wx.hideNavigationBarLoading()
      }
    }
    for (var value in netConfig) {
      requestData[value] = netConfig[value]
    }
    normalRequest(requestData)
  } else {
    /**
     * url 请求地址
     * param2 : data 
     * param3 : method
     * param4 : 回调
     */
    var requestData = {
      url: url,
      data: param2,
      success: (res) => {
        if (res.data.code === 10410) {
          token(() => {
            request(param1, param2, param3, param4)
          })
        } else {
          param4(res.data)
        }
      }, fail: () => {
        var date = {
          url: url,
          requestData: data,
        }
        console.error("ERROR :", data)
      }, complete: () => {
        //TODO
        wx.hideNavigationBarLoading()
      }
    }
    for (var value in netConfig) {
      requestData[value] = netConfig[value]
    }
    requestData.method = param3
    requestWithMethod(requestData)
  }

}

function normalRequest(requestData) {
  wx.request(requestData);
}

function requestWithMethod(requestData) {
  wx.request(requestData)
}

/**
 * object 对象合并
 * o1     对象一
 * o2     对象二
 */
function mergeObj(o1, o2) {
  for (var key in o2) {
    o1[key] = o2[key]
  }
  return o1;
}

/**
 *  showModal
 * title : 标题
 * content : 内容
 * callBack : 回调
 */
function showModal(title, content, callBack) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    success: (res) => {
      callBack(res)
    }
  })
}

//token
function token(callBack) {
  wx.login({
    success: res => {
      var code = res.code;
      wx.setStorage({
        key: 'code',
        data: code,
      })
      var date = {};
      date.code = code;
      wx.getSetting({
        success: res => {
          wx.getUserInfo({
            success: res => {
              var iv = res.iv;
              var encryptedData = res.encryptedData;
              date.iv = iv;
              date.encryptedData = encryptedData;
              app.globalData.userInfo = res.userInfo;
              wx.setStorage({
                key: 'userInfo',
                data: res.userInfo,
              })
            },
            complete: () => {
              vUtil.request("token", date, (res) => {
                var code = res.code;
                switch (code) {
                  case 0:
                    app.globalData.token = res.data.token;
                    callBack(res);
                    vUtil.setNetConfig({ header: { token: res.data.token } })
                    break;
                  default:
                    wx.showToast({ title: res.msg })
                }
              })
            }
          })
        }
      })
    }
  })
}

module.exports = {
  request: request,
  mergeObj: mergeObj,
  showModal: showModal,
  setNetConfig: setNetConfig,
  getUrl: getUrl
}