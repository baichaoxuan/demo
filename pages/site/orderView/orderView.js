const app = getApp();
Page({
  data: {
    id:'', //订单id
    info:{}, //订单信息
    host:'',      //图片前缀
    region:'',
  },
  onLoad: function (options) {
    var that = this;
    that.data.host = app.urls.host;
    if (!options.id) {
      wx.showToast({title: '订单参数异常',icon: 'none'});
      return false;
    }
    that.data.id = options.id;
  },
  onShow(){
    var that = this;
    var id = that.data.id;
    app.ajax('myOrderInfo',{id:id},function(d){
      if (d.code==1) {
        var info = d.data;
        var region = (d.data.area+'::').split(":");
        info.gstatus_name = that.get_gstatus_name(info.gstatus);
        that.data.info = info;
        that.data.region = region;
        that.setData(that.data);
      } else {
        wx.showToast({title: d.msg, icon: 'none'});
      }
    })
  },
  get_gstatus_name(gstgatus) {
    return ['已取消','待付款','待发货','待收货','已完成'][gstgatus];
  },
  // 取消订单
  cancelOrder:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    var that = this;
    wx.showModal({
      content: '订单一旦取消，无法恢复，是否确认取消',
      success (res) {
        if (res.confirm) {
          app.ajax('myOrderCancel',{id:dataset.id},function(d){
            if (d.code==1) {
              that.onShow();
            } else {
              wx.showToast({title: d.msg,icon: 'none'});
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })

  },
  // 支付订单
  payOrder:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    var that = this;
    var id = dataset.id;
    app.ajax('myOrderGetPay',{id:dataset.id},function(d){
      if (d.code == 1) {
        const jsonData = JSON.parse(d.data);
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
            // console.log(res);
          },
        });
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    })
  },
  // 发货订单
  receiveOrder:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    var that = this;
    wx.showModal({
      content: '是否确认收货',
      success (res) {
        if (res.confirm) {
          app.ajax('myOrderReceive',{id:dataset.id},function(d){
            if (d.code==1) {
              that.onShow();
            } else {
              wx.showToast({title: d.msg,icon: 'none'});
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  copy:function(e){
    var that = this;
    wx.setClipboardData({
      data: that.data.id,
      success (res) {
        wx.showToast({title: "复制成功",icon: 'none'});
      },
      fail:function(res){
        wx.showToast({title: "复制失败",icon: 'none'});
      }
    })
  },

})