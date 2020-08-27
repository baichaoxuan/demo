const app = getApp();
Page({
  data: {
    balance:'0.00', //余额
    activity:'',
  },
  onLoad: function (options) {
  },
  onShow: function(){
    const that = this;
    app.ajax('userActivity',{},function(d){
      if (d.code==1) {
        that.data.balance = d.data.balance
        that.data.activity = d.data.activity
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  // 跳转交易记录
  go_record:function(){
    wx.navigateTo({
      url: '/pages/user/balance/balaceRecord',
    })
  },
  go_balanceDiscounts:function(){
    wx.navigateTo({
      url: '/pages/user/balanceTopUp/balanceDiscounts',
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
// 跳转常见问题
  go_issue:function(){
    wx.navigateTo({
      url: '/pages/user/balance/balanceQuestion',
    })
 },
})