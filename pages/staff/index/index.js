const app = getApp();
Page({
  data: {
    tab_active:'to_assign', //当前活动项 状态 默认空为全部, to_assign:待接单,dispatching:配送中,completed:已完成
    delivery_status:'',//送达状态 1：送达；0未送达
    bucketback_status:'',//回桶状态 1：已回桶；0：未回桶
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //订单列表
    page:1, //当前第几页
    host:'',      //图片前缀
    isCancel:false, //取消订单
    mall_sorder_num:0,
    mall_order_num: 0,
    truename:'',
    site_name:'',
  },
  onLoad: function (options) {
    var that = this;
    that.data.host = app.urls.host;
    if (options.gstatus) {
      this.data.tab_active = options.gstatus;
    }
  },
  onShow: function(){
    this.data.page = 1;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.data.delivery_status='',
    this.data.bucketback_status='',
    this.getPage();
    this.getNum();
  },
  // 获取数据
  getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    pm.page = that.data.page;
    app.ajax('staffMorder',pm,function(d){
      if (d.code==1) {
        var list = d.data.list;
        for (var i=0;i<list.length;i++) {
          if(list[i].gstatus =='dispatching'){
           list[i].gstatus_name = '配送中';
         }else if(list[i].gstatus =='completed'){
           list[i].gstatus_name = '已完成';
         }
       }
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
  // 获取数量
  getNum:function(){
    const that = this
    app.ajax('staffGetSignNum',{},function(d){
      if (d.code==1) {
        that.data.mall_order_num = d.data.mall_order_num
        that.data.mall_sorder_num = d.data.mall_sorder_num
        that.data.site_name = d.data.site_name
        that.data.truename = d.data.truename
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  onPullDownRefresh: function () {
    this.onShow();
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },2000)
  },
  onReachBottom: function () {
    this.getPage();
  },
  //联系客户
  call_up:function(e){
    var mobile = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
  },
  //送达
  go_delivery:function(e){
    const that = this;
    var orderid = e.target.dataset.orderid
    var pm = {
      id:orderid,
      isSongda:true
    }
    app.ajax('staffMorderDelivery',pm,function(d){
      if (d.code==1) {
        wx.showToast({title: d.msg,icon: 'none'});
        that.onShow();
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    }) 
  },
  //回桶
  go_bucket:function(e){
    var orderid = e.target.dataset.orderid
    wx.navigateTo({
      url:'../delivery/delivery?id='+orderid
    })
  },
  // 跳转送水订单页
  go_waterOrder:function(){
    wx.navigateTo({
      url: '/pages/staff/orderWater/index',
    })
  },
  // 跳转退桶订单页
  go_sendbucket:function(){
    wx.navigateTo({
      url: '/pages/staff/orderSendBucket/orderSendBucket',
    })
  },
  // 退出登录
  logOut:function(){
    app.ajax('logOutUrl', {}, function (d) {
      if (d.code == 1) {
        wx.removeStorageSync('token');
        app.globalData.token = '';
        wx.reLaunch({
          url: '/pages/public/index/index',
        });
      }else{
        wx.showToast({ "title": d.msg, "icon": "none" });
      }
     });
  },
})