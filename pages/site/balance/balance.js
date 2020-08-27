const app = getApp();
Page({
  data: {
    balance:'0.00', //余额
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //记录列表
    page:1, //当前第几页
  },
  onLoad: function (options) {
  },
  onShow: function(){
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
    if(that.data.tab_active) pm.gstatus = that.data.tab_active;
    pm.page = that.data.page;
    app.ajax('myBillIndex',pm,function(d){
      if (d.code==1) {
        var list = d.data.list;
        that.data.balance = d.data.balance
        that.data.list = that.data.list.concat(list);
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
  go_balance_takeout:function(){
    wx.navigateTo({
      url: '/pages/site/balance/balanceTackOut',
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    // 获取最新金额
    app.gsetLgUser(function () {
      that.onShow();
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   * 上拉加载更多
   */
  onReachBottom: function () {
    this.getPage();
  },

})