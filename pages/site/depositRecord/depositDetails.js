const app = getApp();
Page({
  data: {
    list:[],
    apply_id:'',
  },
  onLoad: function (options) {
    const that = this;
    that.data.apply_id = options.id
    that.data.host = app.urls.host;
    that.setData(that.data)
  },
  onShow: function () {
    const that = this;
    var apply_id = that.data.apply_id
    var pm = {
      id:apply_id
    }
    app.ajax('depositInfo', pm, function (d) {
      if (d.code == 1) {
        var list = d.data
        that.data.list = list
        that.setData(that.data);
        list.gstatus_name = that.get_gstatus_name(list.gstatus)
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
      that.setData(that.data);
    },'GET')
  },
  // 进入申请退款的列表
  // get_list(){
  //   const that = this;
  //   var id = that.data.id
  //   console.log(id)
  //   app.ajax('depositInfo',{id:id},function(d){
  //     if (d.code==1) {
  //       console.log(d)
  //       var list = d.data
  //       that.data.list = list
  //       that.setData(that.data);
  //       list.gstatus_name = that.get_gstatus_name(list.gstatus);
  //     } else {
  //       wx.showToast({title: d.msg,icon: 'none'});
  //     }
  //     that.setData(that.data);
  //   })
  // },
  get_gstatus_name(gstgatus) {
    return ['已取消','待回收','待退款','已完成'][gstgatus];
  },
  onReady: function () {

  },
  copy:function(e){
    var that = this;
    wx.setClipboardData({
      data: that.id,
      success (res) {
        wx.showToast({title: "复制成功",icon: 'none'});
      },
      fail:function(res){
        wx.showToast({title: "复制失败",icon: 'none'});
      }
    })
  },
  cancelOrder:function(e){
    const that = this
    var id= e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认取消退款申请？',
      success (res) {
        if (res.confirm) {
          app.ajax('depositCancel',{id:id},function(d){
            if (d.code==1) {
              wx.showToast({title:'已取消',icon: 'none'});
              that.onShow()
            } else {
              wx.showToast({title: d.msg,icon: 'none'});
            }
          })
        }
      }
    })
  },
})