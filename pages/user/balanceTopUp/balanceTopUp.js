const app = getApp();
Page({
  data: {
    diseaseName:'',
    balance:'',
    addNum:'',
    is_blur:false,
  },
  onLoad: function (options) {

  },
  onShow: function () {
    const that = this;
    app.ajax('userActivityList',{},function(d){
      if (d.code==1) {
        that.data.balance = d.data.balance
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  diseaseNameInput: function(e) {
    var diseaseName = e.detail.value*1
    this.setData({
      diseaseName: diseaseName,
    })
   },
  //  失去焦点
  phoneOnBlur:function(){
    var diseaseName = this.data.diseaseName*1;
    var balance = this.data.balance*1
    var addNum = (balance+diseaseName).toFixed(2)
    
    this.setData({
      addNum: addNum,
      is_blur:true
    })
  },
  //协议跳转
  go_protocol:function(){
    wx.navigateTo({
      url: '/pages/user/balanceProtocol/balanceProtocol',
    })
  },
  // 确认充值
  getUserInfo:function(res){
    const that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.gsetWxUser(res.detail, function(){
        // 重新设置用户信息
        app.gsetLgUser(function () {
          wx.showToast({title:"绑定微信成功！",icon: 'none'});
          that.affirm_balance()
        });
      });
    }
  },
  // 
  affirm_balance:function(){
    const that = this;
    var diseaseName = that.data.diseaseName;
    var addNum = that.data.addNum;
    var balance = that.data.balance;
    if(addNum>balance){
      var pm = {}
      pm.amount = diseaseName
      app.ajax('userActivityRecharge',pm,function(d){
        if (d.code==1) {
          that.wxPay(d.data.order_id, d.data.jsapi)
        } else {
          wx.showToast({title: d.msg,icon: 'none'});
        }
        that.setData(that.data);
      })
    }else{
      wx.showToast({title:'请输入充值金额',icon: 'none'});
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