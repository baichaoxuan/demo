const app = getApp();
Page({
  data: {
    activity:'',
    isPayFrom:false,                 //是否支付成功后显示
  },
  onShow: function () {
    const that = this;
    app.ajax('userActivityList',{},function(d){
      if (d.code==1) {
        that.data.activity = d.data.activity
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  getUserInfo:function(res){
    const that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.gsetWxUser(res.detail, function(){
        // 重新设置用户信息
        app.gsetLgUser(function () {
          wx.showToast({title:"绑定微信成功！",icon: 'none'});
        });
      });
      var pm = {}
      pm.activity_id = res.target.dataset.id
      app.ajax('userActivityRecharge',pm,function(d){
        if (d.code==1) {
          that.wxPay(d.data.order_id, d.data.jsapi)
        } else {
          wx.showToast({title: d.msg,icon: 'none'});
        }
        that.setData(that.data);
      })
    }
  },
  // 调用微信支付
  wxPay(id, d) {
    const that = this;
      const jsonData = JSON.parse(d);
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
          app.ajax('userActivityStatus',{id:id},function(d){
            if (d.code==1 && d.data.pay_status==1) {
              wx.redirectTo({
                url:'/pages/user/balanceTopUp/balanceOk'
              });
            } else {
              wx.showToast({title: d.msg,icon: 'none'});
            }
          })
        },
        fail (res) {
          
        },
      });
  },
 
})