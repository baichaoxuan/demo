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
    apply_id:'',//正在申请中的id
    isOneShow:false,
    isEveryShow:false,
    is_applying:'',//判断是否有申请中的服务单
  },
  onLoad: function (options) {

  },
  onShow: function () {
    var site = app.globalData.site;
    this.data.deposit_amount = site.deposit_amount;
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
    app.ajax('deositIndex',pm,function(d){
      if (d.code==1) {
        var list = d.data.list;
        var total_num = d.data.total_num;
        that.data.list = that.data.list.concat(list);
        that.data.total_num = total_num;
        that.data.apply_id = d.data.apply_id
        that.data.deposit_amount = d.data.deposit_amount;
        that.data.is_applying = d.data.is_applying;
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
  one_show:function(){
    if(this.data.total_num == 0){
      wx.showToast({title: '您没有押金可以退回哦',icon: 'none'});
    }else{
      var is_applying = this.data.is_applying
      if(is_applying == 0){
        wx.navigateTo({
          url: '/pages/site/depositRefund/depositRefund',
        })
      }else{
        var apply_id = this.data.apply_id
        wx.showModal({
          title: '提示',
          content: '当前已有押金正在申请退款中无法重复提交申请',
          confirmText:'查看订单',
          success (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/site/depositRecord/depositDetails?id='+apply_id,
              })
            } else if (res.cancel) {
            }
          }
        })   
      }
      
    }
    // var isOne = wx.getStorageSync('isFirst')
    // if(!isOne){
    //   wx.setStorage({
    //     data: 'isFirst',
    //     key: 'isFirst',
    //   })
    //   this.setData({
    //     isShow:true,
    //     isOneShow:true
    //   })
    // }else{
    //   var is_applying = this.data.is_applying
    //   if(is_applying == 0 ){
    //     wx.showModal({
    //       title: '提示',
    //       content: '请选择押金服务类型',
    //       confirmText:'退押金',
    //       cancelText:'历史记录',
    //       cancelColor:'#576B95',
    //       success (res) {
    //         if (res.confirm) {
    //           wx.navigateTo({
    //             url: '/pages/site/depositRefund/depositRefund',
    //           })
    //         } else if (res.cancel) {
    //           wx.navigateTo({
    //             url: '/pages/site/depositRecord/depositRecord',
    //           })
    //         }
    //       }
    //     })
    //   }else{
    //     wx.showModal({
    //       title: '提示',
    //       content: '当前已有押金正在申请退款中无法重复提交申请',
    //       confirmText:'查看订单',
    //       success (res) {
    //         if (res.confirm) {
    //           wx.navigateTo({
    //             url: '/pages/site/depositRecord/depositRecord',
    //           })
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //         }
    //       }
    //     })        
    //   }
    // }
    
  },
  view_details:function(){
    var apply_id = this.data.apply_id
    wx.navigateTo({
      url: '/pages/site/depositRecord/depositDetails?id='+apply_id,
    })
  },
  close_show:function(){
    if(this.data.isOneShow){
      wx.navigateTo({
        url: '/pages/site/depositRefund/depositRefund',
      })
    }
    if(this.data.isEveryShow){
      this.setData({
        isShow:false
      })
    } 
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