//获取应用实例
const app = getApp()

Page({
  data: {
    phone:'',
    pwd:''
  },

  onLoad: function (options) {

  },
  
  // 用户微信登录
  wxuserlogin:function(options){
    app.globalData.type = 'user';
    app.globalData.token = '';
    wx.reLaunch({
      url: '/pages/user/index/index',
    })
  },
  formSubmit:function(e){
    let {phone,pwd} = e.detail.value
    if (!phone || !pwd) {
      wx.showToast({
        icon:'none',
        title:'账号密码不能为空'
      })
      return false
     }else if(pwd<6){
      wx.showToast({
        icon:'none',
        title:'请输入6-20位的密码'
      })
      return false
     };
     
     var pm = {
       uname:phone,
       upass:pwd
     }
     app.ajax('loginUrl', pm, function (d) {
      if (d.code == 1) {
        app.globalData.token = d.data.token;
        app.globalData.type = 'site'; //登录身份
        wx.setStorageSync('token', app.globalData.token+','+app.globalData.type); //登录标记缓存
        console.log(d.data.type)
        if(d.data.type == 'manage'){
          wx.reLaunch({
            url: '/pages/site/mine/mine',
          });
        }else if(d.data.type == 'staff'){
          wx.reLaunch({
            url: '/pages/staff/index/index',
          });
        }
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
     })
  },
})