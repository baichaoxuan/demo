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
    app.ajax('siteMorderSorderInfo', pm, function (d) {
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
    that.getStaff()
  },
  get_gstatus_name(gstgatus) {
    return ['','待取桶','待平台回收','已完成'][gstgatus];
  },
   // 获取员工
   getStaff:function(){
    const that = this;
    app.ajax('siteMyStaff',{},function(d){
      if (d.code==1) {
        // var staffArr = []
        var staffList = d.data
        that.data.staff =staffList
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
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
  // 联系客户
  call_up:function(e){
    var mobile = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber:mobile,
    })
  },
   // 退桶回收
   go_bucket:function(e){
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/site/orderSendBucket/sendBucket?id='+orderid,
    })
  },
   //指派员工
   bindPickerChange: function(e) {
    const that = this;
   var staff = this.data.staff[e.detail.value];
   var pm ={
     id:that.data.apply_id,
     staff_id:staff.id
   }
   app.ajax('siteSorderStaff',pm,function(d){
     if (d.code==1) {
       wx.showToast({title: d.msg,icon: 'none'});
       that.onShow()
     } else {
       wx.showToast({title: d.msg,icon: 'none'});
     }
   })
 },
})