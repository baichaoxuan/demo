//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    unpay_num:0,//待付款数量
    unshipper_num:0,//待发货数量
    receive_num:0,//待收货数量
    cart_num:0, //购物车数量
    is_user:true,
  },
  onLoad: function () {
    var that = this;
    if (app.globalData.type == 'site') {
      wx.reLaunch({
        url: '/pages/site/index/index',
      })
      return false;
    }
  },
  onShow:function(){
    const that = this;
    var type = app.globalData.type
    console.log(type)
    var is_user
    if(type == 'user'){
      is_user=1
    }else if(type == 'firm'){
      is_user=0
    }
    that.setData({is_user:is_user})
    app.gsetLgUser(function(d){
      that.setData({
        userInfo: app.globalData.user,
      })
    });
    app.ajax('userGetData',{},function(d){
      if (d.code==1) {
        that.data.receive_num = d.data.receive_num;
        that.data.unpay_num = d.data.unpay_num;
        that.data.unshipper_num = d.data.unshipper_num;
        that.setData(that.data)
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    });
    app.ajax('userCategory',{},function(d){
      if (d.code==1) {
        that.data.cart_num = d.data.cart_num;
        that.setData(that.data)
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    });
    app.editTabBar();    //显示自定义的底部导航
  },
  getUserInfo:function(res){
    const that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.gsetWxUser(res.detail, function(){
        // 重新设置用户信息
        app.gsetLgUser(function () {
          that.setData({
            userInfo:app.globalData.user,
          })
          wx.showToast({title:"绑定微信成功！",icon: 'none'});
        });
      });
    }
  },
  tologs:function(){     //切换登录页
    wx.navigateTo({
      url: '/pages/public/index/index',
    })
  },
  skipOrder:function(){
    wx.navigateTo({
      url:'../order/order'
    })
  },
  // 去企业登录页
  go_firmLogin:function(){
    app.ajax('firmRead', {}, function (d) {
      if (d.code == 1) {
        if(d.data){
          wx.navigateTo({
            url: '../firestatus/firestatus?id='+d.data.id,
          })
        }else{
          wx.navigateTo({
            url: '../firmLogin/firmLogin',
          })
        }
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
    })
    
  },
  // 退出企业
  go_user(){
    app.ajax('firmLogout', {}, function (d) {
      if (d.code == 1) {
        wx.removeStorageSync('token');
        app.globalData.token = '';
        wx.reLaunch({
          url: '/pages/user/index/index',
        });
      }else{
        wx.showToast({ "title": d.msg, "icon": "none" });
      }
     });
  },
  go_firmdeposit(){
    wx.navigateTo({
      url: '../firmdeposit/firmdeposit',
    })
  }
})
