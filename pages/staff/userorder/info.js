const app = getApp();
Page({
  data: {
    id:'', //订单id
    info:{}, //订单信息
    host:'',      //图片前缀
    region:'',
    bucket_item:[],
  },

  onLoad: function (options) {
    var that = this;
    that.data.host = app.urls.host;
    if (!options.id) {
      wx.showToast({title: '订单参数异常',icon: 'none'});
      return false;
    }
    that.data.id = options.id;

  },
  onShow: function () {
    var that = this;
    var id = that.data.id;
    app.ajax('staffMorderInfo',{id:id},function(d){
      if (d.code==1) {
        var info = d.data;
        var region = (d.data.area+'::').split(":");
        that.data.info = info;
        that.data.region = region;
        that.data.bucket_item = info.bucket_item;
        that.setData(that.data);
      } else {
        wx.showToast({title: d.msg, icon: 'none'});
      }
    })
  },
   //联系客户
   call_up:function(){
    wx.makePhoneCall({
      phoneNumber: '13520812193',
    })
  },
  //跳转回桶页面
  go_delivery:function(e){
      const that = this;
      var orderid = e.target.dataset.id
      var pm = {
        id:orderid,
        isSongda:true
      }
      app.ajax('staffMorderDelivery',pm,function(d){
        if (d.code==1) {
          wx.showToast({title: d.msg,icon: 'none'});
          that.onShow();
        } else {
          wx.showToast({title: d.msg,icon: 'none'});
        }
      })
      that.onShow()
  },
  //回桶
  go_bucket:function(e){
    var orderid = e.target.dataset.id
    wx.navigateTo({
      url:'../delivery/delivery?id='+orderid
    })
    this.onShow()
  },
  copy:function(e){
    var that = this;
    wx.setClipboardData({
      data: that.data.id,
      success (res) {
        wx.showToast({title: "复制成功",icon: 'none'});
      },
      fail:function(res){
        wx.showToast({title: "复制失败",icon: 'none'});
      }
    })
  },
})