// pages/deposit/deposit.js
const app = getApp();
Page({
  data: {
    num:1,
    host:'',
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //订单列表
    page:1, //当前第几页
    id:'',
    
  },
  getProduct:function(e){
    this.setData({
      num:e.target.dataset.num
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    var host = app.urls.host;
    that.setData({
      host:host
    })
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
    app.ajax('deositPages',pm,function(d){
      // console.log(d)
      if (d.code==1) {
        var list = d.data.list;
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
  viewOrder:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/site/depositDetails/depositDetails?id='+id
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})