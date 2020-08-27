//获取应用实例
const app = getApp()

Page({
  data: {
    phone:'',
    pwd:'',
    account:'',
    firm_id:0,
  },

  onLoad: function (options) {

  },
  onShow:function(){
    this.is_apply()
  },
  //判断是否填写一半
  is_apply:function(){
    const that = this;
    app.ajax('firmApply', {}, function (d) {
      if (d.code == 1) {
        var apply_list = d.data.list
        if(apply_list.account){
          that.data.account = apply_list.account
          that.data.firm_id =apply_list.id 
          that.setData(that.data)
        }
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
    })
  },
  formSubmit:function(e){
    const that = this
    let {name,pwd,password} = e.detail.value
    if (!name || !pwd || !password) {
      wx.showToast({
        icon:'none',
        title:'账号密码不能为空'
      })
      return false
     }else if(pwd<6 || password<6 || name<6){
      wx.showToast({
        icon:'none',
        title:'请输入6-20位的账号密码'
      })
      return false
     };
     
     var pm = {
      account:name,
      password:password,
      re_password:pwd,
      id:that.data.firm_id,
     }
     console.log(pm)
     app.ajax('firmAccountSave', pm, function (d) {
      if (d.code == 1) {
        wx.showToast({title: d.msg,icon: 'none',})
        wx.navigateTo({
          url: '../firmInformation/firmInformation?id='+d.data.id,
        })
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
     })
  },
  
  // 去登录
  go_firmlogin:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  go_firmprotocol(){
    wx.navigateTo({
      url: '../firmProtocol/firmProtocol',
    })
  }
})