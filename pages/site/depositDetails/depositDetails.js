const app = getApp();
Page({
  data: {
    id:'', //订单id
    list:{}, 
    host:'',      //图片前缀
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
  onShow(){
    var that = this;
    var id = that.data.id;
    app.ajax('deositInfo',{id:id},function(d){
      if (d.code==1) {
        var list = d.data;
        that.data.list = list;
      } else {
        wx.showToast({title: d.msg, icon: 'none'});
      }
      that.setData(that.data);
    })
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

})