const app = getApp();
Page({
  data: {
    tab_active:'', //当前活动项 状态 默认空为全部, 0:已取消,1:待付款,2:代发货,3:待收货,4:已完成
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //订单列表
    page:1, //当前第几页
    host:'',      //图片前缀
    timer:'',
    qgdjs_jo:{min:'00',sec:'00'}
  },
  onLoad: function (options) {
    var that = this;
    that.data.host = app.urls.host;
    if (options.gstatus) {
      that.data.tab_active = options.gstatus;
    }
    // that.countDown();
  },
  onShow: function(){
    this.data.page = 1;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.getPage();
  },
  // 获取数据
  getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    if(that.data.tab_active) pm.gstatus = that.data.tab_active;
    pm.page = that.data.page;
    app.ajax('userOrder',pm,function(d){
      // console.log(d)
      if (d.code==1) {
        var list = d.data.list;
        for (var i=0;i<list.length;i++) {
          list[i].gstatus_name = that.get_gstatus_name(list[i].gstatus);
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
  get_gstatus_name(gstgatus) {
    return ['已取消','待付款','待发货','待收货','已完成'][gstgatus];
  },
  onPullDownRefresh: function () {
    this.onShow();
  },
  onReachBottom: function () {
    this.getPage();
  },

  // 切换列表
  getList:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    // console.log(dataset,this.data.tab_active)
    if (dataset.gstatus != this.data.tab_active) {
      this.data.tab_active = dataset.gstatus;
      this.onShow();
    }
  },
  
  // 取消订单
  cancelOrder:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    var that = this;
    wx.showModal({
      content: '订单一旦取消，无法恢复，是否确认取消',
      success (res) {
        if (res.confirm) {
          app.ajax('userOrderCancle',{id:dataset.id},function(d){
            if (d.code==1) {
              var list = that.data.list;
              if (that.data.tab_active == '') {
                list[dataset.index].gstatus = 0
                list[dataset.index].gstatus_name = that.get_gstatus_name(0);
              } else {
                list.splice(dataset.index,1);
              }
              that.setData({
                list:list,
              });
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
    app.ajax('userOrderPay',{id:dataset.id},function(d){
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
    })
  },
  // 发货订单
  receiveOrder:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    console.log(dataset)
    var that = this;
    wx.showModal({
      content: '是否确认收货',
      success (res) {
        if (res.confirm) {
          app.ajax('userOrderReceive',{id:dataset.id},function(d){
            if (d.code==1) {
              var list = that.data.list;
              console.log(that.data.tab_active)
              if(that.data.tab_active) {
                list.splice(dataset.index, 1);
              } else {
                list[dataset.index].gstatus = 4
                list[dataset.index].gstatus_name = that.get_gstatus_name(4);
              }
              that.setData({
                list:list,
              });
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

})