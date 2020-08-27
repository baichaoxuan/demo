
const app = getApp();
Page({
  data: {
    host:'',
    orderid:'',
    balance:0.00,
    info:'',//订单信息
    infoItem:[],
    infoPrice:0.00,
    is_balance:1,
    is_bindwx:false,                     //是否绑定微信
    isPayFrom:false,                 //是否支付成功后显示
    is_submiting:false,                  //是否提交中.

  },
  onLoad: function (options) {
    const that = this;
    that.data.orderid = options.id
    that.data.host = app.urls.host;
    that.setData(that.data);
    app.ajax('siteUorderIndex', {id:options.id}, function(d){
        if (d.code==1) {
          if(d.data.info.pay_status != 0){
            wx.redirectTo({
              url:'/pages/site/bucketOrderSite/bucketOrderOk'
            });
          }else if(d.data.info.pay_status == 0){
            var info= d.data
            var infoItem = info.item
            var balance = parseInt(info.balance)
            var infoPrice= parseInt(info.info.price)
            that.data.infoItem = infoItem
            that.data.balance = balance
            that.data.infoPrice = infoPrice
            that.data.info = info.info
            if(balance > infoPrice){
              that.data.is_balance = 1
            }else{
              that.data.is_balance = 0
            }
          }
        } else {
          wx.showToast({title: d.msg,icon: 'none'});
        }
        that.setData(that.data);
    })

  },
   // 切换是否使用余额
   useBalance:function(event){
    var is_balance = this.data.is_balance?0:1;
    this.setData({
      is_balance:is_balance
    });
  },
  usePrice:function(){
    wx.showToast({
      title: '当前余额不足，已为您默认微信支付',
      icon:'none'
    })
    var is_balance = 0;
    this.setData({
      is_balance:is_balance
    });
  },
   // 提交订单
   submitOrder:function(){
    var that = this;
    that.setData({is_submiting:true});
    var pm = {}
    pm.id=that.data.orderid
    pm.is_balance = that.data.is_balance;
    app.ajax('siteUorderSubmit',pm,function(d){
      if(d.code==1) {
        if(d.data.pay_status == '1') {
          wx.showToast({
            title: '余额支付成功',
            icon: 'none',
          })
          setTimeout(function(){
            wx.redirectTo({
              url:'/pages/site/bucketOrder/bucketOrderOk'
            });
          },1000)
        } else {
          that.wxPay(that.data.orderid, d.data.jsapi);
        }
      } else {
        wx.showToast({
          title: d.msg,
          icon: 'none',
        })
        that.setData({is_submiting:false});
      }
    });
  },
  
  // 调用微信支付
  wxPay(id, d) {
    const that = this;
    if (d.code == 1) {
      const jsonData = JSON.parse(d.data);
      that.data.isPayFrom = true;
      //发起支付
      wx.requestPayment({
        'timeStamp': jsonData.timeStamp,
        'nonceStr': jsonData.nonceStr,
        'package': jsonData.package,
        'signType': jsonData.signType,
        'paySign': jsonData.paySign,
        'success': function (res) {
          //支付成功之后的操作
          app.ajax('siteUorderStatus',{id:id},function(d){
            if (d.code==1 && d.data.pay_status==1) {
              wx.redirectTo({
                url:'/pages/site/bucketOrderSite/bucketOrderOk'
              });
            } else {
              wx.showToast({title: d.msg,icon: 'none'});
            }
          })
        },
        fail (res) {
          that.setData({is_submiting:false});
        },
      });
    } else {
      wx.showToast({title: d.msg,icon: 'none'});
    }
  },

  // 用户授权后 绑定微信账号
  getUserInfo:function(res){
    const that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.gsetWxSiteUser(res.detail, function(){
        // 重新设置用户信息
        app.gsetLgSite(function () {
          wx.showToast({title:"绑定微信成功！",icon: 'none'});
          that.setData({
            is_bindwx:true,
          })
          that.submitOrder();
        });
      });
    }
  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})