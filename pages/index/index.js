import vUtil from '../../utils/VUtil.js'
var app = getApp();
var context;

Page({
  data : {
    title : "赚钱游戏",
    des : "游戏·游戏娱乐",
    headUrl: "http://img3.imgtn.bdimg.com/it/u=2978378386,1652849511&fm=27&gp=0.jpg",
    wxID : "haoyou8858",
    phone : "15327325997",
    companyDes : "全国诚招代理商 一件代发 0加盟门槛 0代理费用 0库存风险",
    picList : []
  },

  onLoad: function() {
    context = this;
    var picList = []
    for(let i = 0 ; i < 9; i ++){
      picList.push(context.data.headUrl)
    }
    context.setData({
      picList : picList
    })
    wx.setNavigationBarTitle({
      title: context.data.title,
    })
    var url = app.doRequest();
    console.log(url)
    wx.request({
      url: url,
      success :(res)=>{
        console.log(res)
        var data = res.data.data;
        var headimg = data.attachurl + data.headimg;
        var picList = [];
        for (let i  = 0 ;i < data.photos.length; i ++){
          var item = data.photos[i];
          item.path = data.attachurl + item.path;
          picList.push(item)
        }
        wx.setNavigationBarTitle({
          title: data.name,
        })
        context.setData({
          title : data.name,
          des : data.desc,
          wxID : data.wechat,
          phone : data.phone,
          companyDes : data.bio,
          headUrl: headimg,
          picList : picList
        })
      }
    })

    // plugin.getData(this)
  },

  add_friend :function (){
    var title  = "提示"
    var wxId = context.data.wxID;
    var content = "是否要复制微信号 : " +wxId  + " ?"
    vUtil.showModal(title,content,(res)=>{
      wx.setClipboardData({
        data: wxId,
      })
    })
  },
  phone_call:function(){
    wx.makePhoneCall({
      phoneNumber: context.data.phone,
    })
  },
  item_click : function(e){
    var data = e.currentTarget.dataset.info;
    var urls = [];
    for (let i = 0; i < context.data.picList.length;i++){
      urls.push(context.data.picList[i].path);
    }
    wx.previewImage({
      urls: urls,
      current : data
    })
  }
})