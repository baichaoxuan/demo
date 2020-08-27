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
    } else if (userinfo.txPassword.length == 0 ){
      wx.showToast({
        title: "请填写提现密码",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.affirmPassword.length == 0){
      wx.showToast({
        title: "请填写确认密码",
        icon: 'none',
        duration: 2000
      });
    }else if(userinfo.txPassword != userinfo.affirmPassword){
      wx.showToast({
        title: "两次密码不一致",
        icon: 'none',
        duration: 2000
      });
    }else{
      let myInfo = {
        password: userinfo.loginPassword,
        tx_password:userinfo.txPassword,
        tx_password_confirm:userinfo.affirmPassword,
      };
      app.ajax('siteWithdrawalTxpassword', myInfo, function (d) {
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