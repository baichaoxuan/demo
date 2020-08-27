const app = getApp();
Page({
  data: {
    isShowZhezhao:false,
    bucket_deposit_num:'0', 
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //记录列表
  },
  onLoad: function (options) {
  },
  onShow: function(){
    var user = app.globalData.user;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.getPage();
  },
  // 获取数据
  getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    app.ajax('siteBucketDeposit',pm,function(d){
      if (d.code==1) {
        var list = d.data.list;
        that.data.bucket_deposit_num = d.data.bucket_deposit_num;
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

})