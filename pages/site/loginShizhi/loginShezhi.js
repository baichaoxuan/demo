const app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user:{},
    site:{},
  },

  onLoad: function (options) {
    const that = this;
    that.setData({
      user:app.globalData.user,
      site:app.globalData.site,
    })

  },
// 退出登录
  logOut:function(){
    app.ajax('logOutUrl', {}, function (d) {
      if (d.code == 1) {
        wx.removeStorageSync('token');
        app.globalData.token = '';
        wx.reLaunch({
          url: '/pages/public/index/index',
        });
      }else{
        wx.showToast({ "title": d.msg, "icon": "none" });
      }
     });
  },
  // tologs:function(){     //切换登录页
  //   wx.navigateTo({
  //     url: '/pages/public/index/index',
  //   })
  // },
  // 修改密码页
  password_state:function(){
    wx.navigateTo({
      url: '/pages/site/loginShizhi/passwordState',
    })
  },
  
})