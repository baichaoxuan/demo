const app = getApp();
Page({
  data: {
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //记录列表
    page:1, //当前第几页
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.data.page = 1;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.getPage();
  },
   // 获取数据
   getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    pm.page = that.data.page;
    app.ajax('siteWithdrawalWlog',pm,function(d){
      if (d.code==1) {
        var list = d.data.list;
        that.data.list = list;
        // 无更多时设置
        if (d.data.pcount <= d.data.page) {
          that.data.is_has_more = 0;
        } else {
          that.data.page++;
        }
        // 无记录时设置
        if (d.count == 0) {
          that.data.is_has_more = 1;
          that.data.no_record = 1;
        }
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  go_balanceDetails:function(e){
    var balance_id = e.target.dataset.id
    // console.log(e)
    wx.navigateTo({
      url: '/pages/site/balance/balanceCheck?id='+balance_id,
    })
  }
})