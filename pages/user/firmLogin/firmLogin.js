//获取应用实例
const app = getApp()

Page({
  data: {
    phone:'',
    pwd:'',
    is_apply:false,
    id:'',
    is_user:true,
  },

  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },
  onShow:function(){
    this.is_apply()
  },
  // 判断是否有正在申请中的
  is_apply:function(){
    const that = this;
    app.ajax('firmApply', {}, function (d) {
      if (d.code == 1) {
        var apply_list = d.data.list
        if(apply_list.length == 0){
          that.data.is_apply = false;
          that.setData(that.data)
        }
        if(apply_list.company){
          that.data.id = apply_list.id
          that.data.is_apply = true;
          that.setData(that.data)
        }
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
    })
  },
  formSubmit:function(e){
    let {account,password} = e.detail.value
    if (!account || !password) {
      wx.showToast({
        icon:'none',
        title:'账号密码不能为空'
      })
      return false
     }else if(password<6){
      wx.showToast({
        icon:'none',
        title:'请输入6-18位的密码'
      })
      return false
     };
     var pm = {
      account:account,
      password:password
     }
     app.ajax('firmLogin', pm, function (d) {
      if (d.code == 1) {
        app.globalData.token = d.data.token;
        app.globalData.type = 'firm'; //登录身份
        wx.setStorageSync('token', app.globalData.token+','+app.globalData.type); //登录标记缓存
        wx.reLaunch({
          url: '/pages/user/index/index',
        });
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
     })
  },
  go_firmInformation:function(){
    if(this.data.is_apply){
      wx.navigateTo({
        url: '../firestatus/firestatus?id='+this.data.id,
      })
    }else{
      wx.navigateTo({
        url: '../firmInformation/firmLogin',
      })
    }
  },
  go_deposit_refund:function(){
    wx.navigateTo({
      url: '../firestatus/firestatus?id='+this.data.id,
    })
  }
})