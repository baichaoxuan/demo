const app = getApp();
Page({
  data: {
    isShowZhezhao:false,
    balance:'0.00', //余额
    freeya_use_amount:'0.00',
    freeya_canuse_amount:'0.00',
  },
  onLoad: function (options) {
  },
  onShow: function(){
    const that = this;
    app.ajax('firmfreeya',{},function(d){
      if (d.code==1) {
        that.data.freeya_amount = d.data.freeya_amount.toFixed(2)
        that.data.freeya_use_amount = d.data.freeya_use_amount.toFixed(2)
        that.data.freeya_canuse_amount = d.data.freeya_canuse_amount.toFixed(2)
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  // 跳转交易记录
  go_record:function(){
    wx.navigateTo({
      url: '/pages/user/firmdeposit/info',
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    // 获取最新金额
    app.gsetLgUser(function () {
      that.onShow();
    });

  },
  onReachBottom: function () {
    this.getPage();
  },
  showZhezhao:function(){
    this.setData({
      isShowZhezhao:true
    })
  },
  hidZhezhao:function(){
    this.setData({
      isShowZhezhao:false
    })
  },
})