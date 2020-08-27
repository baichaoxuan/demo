// pages/deposit/deposit.js
const app = getApp();
Page({
  data: {
    num:1,
    host:'',
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //订单列表
    list_down:[],//已完成订单列表
    page:1, //当前第几页
    id:'',
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
    var type = app.globalData.type
    var is_user
    if(type == 'user'){
      is_user=1
    }else if(type == 'firm'){
      is_user=0
    }
    this.setData({is_user:is_user})
    this.data.page = 1;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.getPage();
    this.deposit_down();
  },
  // 获取数据
  getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    if(that.data.tab_active) pm.gstatus = that.data.tab_active;
    pm.page = that.data.page;
    app.ajax('userDepositPage',pm,function(d){
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
    },'GET')
  },
  getProduct:function(e){
    var num =e.target.dataset.num
    this.setData({
      num:num
    })
  },
  deposit_down:function(){
    var that = this;
    var pm = {};
    pm.page = that.data.page;
    app.ajax('userDepositSorder',pm,function(d){
      if (d.code==1) {
        var list_down = d.data.list;
        that.data.list_down = list_down;
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
    },'GET')
  },
  viewOrder:function(e){
    var id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url:'/pages/user/depositDetails/depositDetails?id='+id
    });
  },
  // 已退押金的详情
  view_Order:function(e){
    var sorder_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/user/depositRecord/depositDetails?id='+sorder_id,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})