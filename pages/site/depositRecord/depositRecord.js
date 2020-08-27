const app = getApp();
Page({
  data: {
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //记录列表
    num:'',
    price:'',
    page:1, //当前第几页
    host:'',      //图片前缀
  },
  onLoad: function (options) {
    var that = this;
    that.data.host = app.urls.host;
  },
  onShow: function () {
    this.data.page = 1;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.getPage();
  },
  getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    pm.page = that.data.page;
    app.ajax('depositPage',pm,function(d){
      if (d.code==1) {
        var list = d.data.list;
        that.data.list = list;
        for (var i=0;i<list.length;i++) {
          list[i].gstatus_name = that.get_gstatus_name(list[i].gstatus);
        }
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
    return ['已取消','待回收','待退款','已完成'][gstgatus];
  },
  // 取消申请
  cancelOrder:function(e){
    const that = this
    var id= e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认取消退款申请？',
      success (res) {
        if (res.confirm) {
          app.ajax('depositCancel',{id:id},function(d){
            if (d.code==1) {
              wx.showToast({title:'已取消',icon: 'none'});
              that.onShow()
            } else {
              wx.showToast({title: d.msg,icon: 'none'});
            }
          })
        }
      }
    })
  },
})