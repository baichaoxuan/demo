// pages/embody/embody.js
const app = getApp();
Page({
  data: {
    deposit_amount:'0.00',
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //记录列表
    page:1, //当前第几页
    total_num:0, //总桶数
    have_deposit:'',//是否有正在退款中的
    sorder_id:'',
    is_user:true,//判断是否是用户
    deposit_num:'',
  },
  onLoad: function (options) {

  },
  onShow: function () {
    var user = app.globalData.user;
    var type = app.globalData.type;
    var is_user
    // console.log(type)
    if(type == 'user'){
      is_user=1
    }else if(type == 'firm'){
      is_user=0
    }
    this.setData({is_user:is_user})
    this.data.deposit_amount = user.deposit_amount;
    this.data.page = 1;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.getPage();

    
  },
  getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    if(that.data.tab_active) pm.gstatus = that.data.tab_active;
    pm.page = that.data.page;
    app.ajax('userDeposit',pm,function(d){
      if (d.code==1) {
        var list = d.data.list;
        var total_num = d.data.total_num
        that.data.list = that.data.list.concat(list);
        that.data.total_num = total_num;
        that.data.deposit_amount = d.data.deposit_amount;
        that.data.sorder_id = d.data.sorder_id
        that.data.have_deposit = d.data.have_deposit
        that.data.deposit_num = d.data.deposit_num
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
  getUserInfo:function(res){
    const that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.gsetWxUser(res.detail, function(){
        // 重新设置用户信息
        app.gsetLgUser(function () {
          wx.showToast({title:"绑定微信成功！",icon: 'none'});
          that.deposit_refund();
        });
      });
    }
    
  },
  // 退押
  deposit_refund:function(){
    const that = this;
    if(that.data.total_num == 0 ){
        wx.showToast({title: '您没有押金可以退回哦',icon: 'none'});
      }else{
        var have_deposit = that.data.have_deposit
        if(have_deposit == 0){
          wx.navigateTo({
            url: '/pages/user/depositRefund/depositRefund',
          })
        }else{
          var sorder_id = that.data.sorder_id
          wx.showModal({
            title: '提示',
            content: '当前已有押金正在申请退款中无法重复提交申请',
            confirmText:'查看订单',
            success (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/user/depositRecord/depositDetails?id='+sorder_id,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })   
        }  
      }
  },
  // 退押
  go_deposit_refund:function(){
    var sorder_id = this.data.sorder_id
    wx.navigateTo({
      url: '/pages/user/depositRecord/depositDetails?id='+sorder_id,
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    // 获取最新金额
    app.gsetLgUser(function () {
      that.show();
    });

  },
  onPullDownRefresh: function () {
    this.show();
  },
  onReachBottom: function () {
    this.getPage();
  },
  onShareAppMessage: function () {
    this.getPage();
  }
})