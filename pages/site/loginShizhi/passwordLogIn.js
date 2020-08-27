const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  formSubmit: function (e) {
    var userinfo = e.detail.value
    var that = this;
    if (userinfo.loginPassword.length == 0){
      wx.showToast({
        title: "请填写登录密码",
        icon: 'none',
        duration: 2000
      });
    } else if (userinfo.new_password.length == 0 ){
      wx.showToast({
        title: "请填写提现密码",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.new_password_confirm.length == 0){
      wx.showToast({
        title: "请填写确认密码",
        icon: 'none',
        duration: 2000
      });
    }else if(userinfo.new_password != userinfo.new_password_confirm){
      wx.showToast({
        title: "两次密码不一致",
        icon: 'none',
        duration: 2000
      });
    }else{
      let myInfo = {
        password: userinfo.loginPassword,
        new_password:userinfo.new_password,
        new_password_confirm:userinfo.new_password_confirm,
      };
      app.ajax('siteSetPassword', myInfo, function (d) {
        if (d.code == 1) {
          wx.showToast({
           "title": d.msg,
           "icon": "none" ,
           success: function () {
            wx.navigateBack({
              delta: 1
            });
          },
        });
        } else {
          wx.showToast({ "title": d.msg, "icon": "none" });
        }
      });
    }
  },
})