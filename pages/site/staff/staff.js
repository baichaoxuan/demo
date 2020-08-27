const app = getApp()
Page({
  data: {
    list:[],
    has_record:false,
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    const that = this;
    app.ajax('siteMyStaff',{},function(d){
      if (d.code==1) {
        that.data.list = d.data
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.data.has_record = that.data.list.length > 0;
      that.setData(that.data);
    })
  },
  staff_add:function(){
    wx.navigateTo({
      url: '/pages/site/staff/staffAdd',
    })
  },
  staff_details:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.addrid
    wx.navigateTo({
      url: '/pages/site/staff/staffAdd?id='+id,
    })
  }
})