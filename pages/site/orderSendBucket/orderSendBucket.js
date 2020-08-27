const app = getApp();
Page({
  data: {
    tab_active:'unbucketback', // unbucketback:待回桶,unstorage:待平台回收,completed:已完成
    delivery_status:'',//送达状态 1：送达；0未送达
    bucketback_status:'',//回桶状态 1：已回桶；0：未回桶
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //订单列表
    staff:[],
    page:1, //当前第几页
    host:'',      //图片前缀
    isCancel:false, //取消订单
  },
  onLoad: function (options) {
    var that = this;
    that.data.host = app.urls.host;
  },
  onShow: function(){
    this.data.page = 1;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.data.delivery_status='',
    this.data.bucketback_status='',
    this.getPage();
    this.getStaff();
  },
  // 获取数据
  getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    if(that.data.tab_active) pm.gstatus = that.data.tab_active;
    pm.page = that.data.page;
    app.ajax('siteMorderSorder',pm,function(d){
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
  // 获取员工
  getStaff:function(){
    const that = this;
    app.ajax('siteMyStaff',{},function(d){
      if (d.code==1) {
        // var staffArr = []
        var staffList = d.data
        that.data.staff =staffList
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
      phoneNumber:mobile,
    })
  },
  // 退桶回收
  go_bucket:function(e){
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/site/orderSendBucket/sendBucket?id='+orderid,
    })
  },
  // 切换列表
  getList:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    if (dataset.gstatus != this.data.tab_active) {
      this.data.tab_active = dataset.gstatus;
      this.onShow();
    }
  },
  //指派员工
  bindPickerChange: function(e) {
    const that = this
    var staff = this.data.staff[e.detail.value];
    var pm ={
      id:e.target.dataset.orderid,
      staff_id:staff.id
    }
    app.ajax('siteSorderStaff',pm,function(d){
      if (d.code==1) {
        wx.showToast({title: d.msg,icon: 'none'});
        that.onShow()
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    })
  },
})