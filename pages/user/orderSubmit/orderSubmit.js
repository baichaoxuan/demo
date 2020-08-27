const app = getApp();

Page({
  data: {
      is_balance:1,                     //是否使用余额
      balance:"0.0",                    //余额
      addr:{},                            //收货地址信息
      addr_id:0,                         //地址id
      list:[],                            //商品列表
      pdt_num:0,                           //商品数量
      total_amount:'0.00',                 //订单金额
      is_delivery:0,                       //是否配送
      min_delivery_num:120,                //配送最低数量
      is_submiting:false,                  //是否提交中..
      host:'',                              //图片前缀
      is_bindwx:false,                     //是否绑定微信
      array:[],                            //时间段
      array_key:[],
      index:'',                            //选中时间的下标
      isShow:true,
      isPayFrom:false,                 //是否支付成功后显示
      mark:'',
  },

  onLoad: function (options) {
    const that = this;
    app.ajax('userTime',{},function(d){
      if(d.code==1) {
        that.setData({
          array:Object.values(d.data),
          array_key:Object.keys(d.data)
        })
      } else {
        wx.showToast({
          title: d.msg,
          icon: 'none',
        })
      }
    });
  },
  onShow:function(){
    const that = this;
    if (that.data.isPayFrom) return false;
    that.data.host = app.urls.host;
    let user = app.globalData.user;
    that.data.is_bindwx = user.openid ? true:false;
    var pm = {
      addr_id:that.data.addr_id
    }
    app.ajax('userOrderMall',pm,function(d){
      if(d.code==1) {
        if (d.data.addr.area) {
          let region = (d.data.addr.area+'::').split(":");
          d.data.addr.area = region[0]+' '+region[1]+' '+region[2];
        }
        that.data = app.extends(that.data, d.data);
        that.setData(that.data);
        that.setData({
          addr_id:d.data.addr.id
        })
      } else {
        wx.showToast({
          title: d.msg,
          icon: 'none',
        })
      }
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      isShow:false
    })
  },

  // 切换是否使用余额
  useBalance:function(event){
    var is_balance = this.data.is_balance?0:1;
    this.setData({
      is_balance:is_balance
    });
  },
  //获取留言信息
  bindTextAreaBlur:function(e){
    this.setData({
      mark:e.detail.value
    })
    console.log(typeof(e.detail.value))
  },
  // 提交订单
  submitOrder:function(){
    var that = this;
    that.setData({is_submiting:true});
    var ps_time= that.data.array_key[that.data.index] || that.data.array_key[0]
    if(!ps_time){
      wx.showToast({
        title: '请选择配送时间',
        icon: 'none',
      })
    }
    var pm = {
      addr_id:that.data.addr_id,
      delivery_t:ps_time,
      mark:that.data.mark
    }
    pm.is_balance = that.data.is_balance;
    app.ajax('userSubOrder',pm,function(d){
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
    console.log(d)
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
          app.ajax('userOrderStatus',{id:id},function(d){
            if (d.code==1 && d.data.pay_status==1) {
              wx.redirectTo({
                url:'../orderView/orderView?id='+id
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
      app.gsetWxUser(res.detail, function(){
        // 重新设置用户信息
        app.gsetLgUser(function () {
          wx.showToast({title:"绑定微信成功！",icon: 'none'});
          that.setData({
            is_bindwx:true,
          })
        });
      });
    }
  },
  // 跳转地址
  skip_addr:function(){
    var url = this.data.addr.area ? '../adress/adress':'../adress-add/adress-add';
      wx.navigateTo({
        url:url,
      })
  }

})