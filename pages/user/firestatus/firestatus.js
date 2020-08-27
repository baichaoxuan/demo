//获取应用实例
const app = getApp()

Page({
  data: {
    id:'',
    audit_status:'',
    audited:'',
    reason:'',//失败的原因
  },

  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },
  onShow:function(){
    id:'',
    this.get_firmStatus();
    this.get_seccss();
  },
  get_firmStatus:function(){
    const that = this;
    app.ajax('firmApply', {id:that.data.id}, function (d) {
      if (d.code == 1) {
        var list = d.data.list
        that.data.audit_status = list.audit_status
        that.data.reason = list.reason
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
      that.setData(that.data)
    })
  },
  // 获取申请成功
  get_seccss(){
    const that = this;
    app.ajax('firmPassInfo', {id:that.data.id}, function (d) {
      if (d.code == 1) {
        that.data.audited = d.data.audited
      }
      that.setData(that.data)
    })
  },
  go_balance(){
    wx.navigateBack({
      delta: 2
    })
  },
  // 申请失败,重新申请
  del_firm(){
    const that = this;
    app.ajax('firmDel', {id:that.data.id}, function (d) {
      if (d.code == 1) {
        wx.navigateBack({
          delta: 1
        })
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
      that.setData(that.data)
    })
  },
  // 修改企业
  go_balancelist(){
    wx.redirectTo({
      url: '../firmInformation/firmInformation?id='+this.data.id,
    })
  },
  // 企业登录
  go_login(){
    wx.redirectTo({
      url: '../firmLogin/firmLogin',
    })
  },
})