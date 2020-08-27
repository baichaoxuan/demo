
const app = getApp();

Page({
  data: {
      is_balance:1,                     //是否使用余额
      balance:"0.0",                    //余额
      addr:{},                            //收货地址信息
      whaddr:{},                          //仓库
      list:[],                            //商品列表
      pdt_num:0,                           //商品数量
      total_amount:'0.00',                 //订单金额
      is_delivery:0,                       //是否配送
      min_delivery_num:120,                //配送最低数量
      is_submiting:false,                  //是否提交中..
      host:'',      //图片前缀
      is_bindwx:false,                     //是否绑定微信
      isPayFrom:false,                 //是否支付成功后显示
  },

  onLoad: function (options) {
    const that = this;
    if (that.data.isPayFrom) return false;
    that.data.host = app.urls.host;
    let user = app.globalData.user;
    that.data.is_bindwx = user.openid ? true:false;
    app.ajax('orderUrl',{},function(d){
      if(d.code==1) {
        let region = (d.data.addr.area+'::').split(":");
        d.data.addr.area = region[0]+' '+region[1]+' '+region[2];
        // d.data.whaddr.area = region[0]+' '+region[1]+' '+region[2];
        that.data = app.extends(that.data, d.data);
        that.setData(that.data);
      } else {
        wx.showToast({
          title: d.msg,
          icon: 'none',
        })
      }
    });
  },

  // 切换是否使用余额
  useBalance:function(event){
    var is_balance = this.data.is_balance?0:1;
    this.setData({
      is_balance:is_balance
    });
  },

  // 提交订单
  submitOrder:function(){
    var that = this;
    that.setData({is_submiting:true});
    var pm = {}
    pm.is_balance = this.data.is_balance;
    app.ajax('subOrderUrl',pm,function(d){
      if(d.code==1) {
        if(d.data.pay_status == '1') {
          wx.showToast({
            title: '余额支付成功',
            icon: 'none',
          })
          setTimeout(function(){
            wx.redirectTo({
              url:'../orderOk/orderOk?id='+d.data.id
            });
          },1000)
        } else {
          that.wxPay(d.data.id, d.data.jsapi);
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
          app.ajax('ckOrderStatusUrl',{id:id},function(d){
            if (d.code==1 && d.data.pay_status==1) {
              wx.redirectTo({
                url:'../orderOk/orderOk?id='+id
              });
            } else {
              wx.showToast({title: d.msg,icon: 'none'});
            }
          })
        },
        fail (res) {
          wx.redirectTo({
            url:'../orderView/orderView?id='+id
          });
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
  // 跳转地址
  skip_addr:function(){
    wx.navigateTo({
      url:'/pages/site/adress/adress?from=order'
    })
  }

})