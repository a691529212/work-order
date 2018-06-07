
var uiTool = function () {
}

function progress2state(progress) {
  var date = {
    state: '',
    color: '',
  }
  switch (progress) {
    case 0:
      date.state = "待派发";
      date.color = "#d9474d"
      break;
    case 1:
      date.state = "处理中";
      date.color = "#d9474d"
      break;
    case 2:
      date.state = "已回复";
      date.color = "#ffd300"
      break;
    case 3:
      date.state = "已解决";
      date.color = "#ffd300"
      break;
    case 4:
      date.state = "未解决";
      date.color = "#2196f3"
      break;
    case 5:
      date.state = "已评论";
      date.color = "#ffd300"
      break;
    default:
      date.state = "其他"
      date.color = "#ffd300"
      break;
  }
  return date;
}

function progress2pro(progress) {
  var pro = 0;
  var des = "";
  var img = ["/img/pd.png", "/img/cl.png", "/img/gb.png", "/img/pj.png"];
  switch (progress) {
    case 0:
      pro = 0;
      des = "关闭工单"
      img.splice(0, 1, "/img/pd_s.png")
      break
    case 1:
    case 2:
      pro = 35;
      des = "关闭工单"
      img.splice(0, 2, "/img/pd_s.png", "/img/cl_s.png")
      break;
    case 3:
    case 4:
      pro = 67;
      des = "评价服务"
      img.splice(0, 3, "/img/pd_s.png", "/img/cl_s.png", "/img/gb_s.png")
      break
    case 5:
      pro = 100;
      img.splice(0, 4, "/img/pd_s.png", "/img/cl_s.png", "/img/gb_s.png", "/img/pj_s.png")
      break
  }
  var data = {
    progress: pro,
    des: des,
    img: img
  }
  return data;
}

function level2state(level) {
  var str = ""
  switch (level) {
    case 1:
      str = "一般"
      break;
    case 2:
      str = "加急"
      break;
    case 3:
      str = "特急"
      break;
  }
  return str;
}

module.exports = {
  progress2state: progress2state,
  progress2pro: progress2pro,
  level2state: level2state
}