const app = getApp()
Page({
  data: {
    id:'',
    list:{},
  },
  onLoad: function (options) {
    const that = this;
    this.setData({
      id:options.id
    })
    app.ajax('siteWithdrawalWinfo',{id:options.id},function(d){
      if (d.code==1) {
        that.data.list = d.data
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  onShow: function () {

  },
  // 去提现记录
  go_balancelist:function(){
    wx.navigateTo({
      url: '/pages/site/balanceList/balanceList',
    })
  },
  //返回余额
  go_balance:function(){
    wx.navigateBack({
      // url: '/pages/site/balance/balance',
      delta: 2
    })
  }

})