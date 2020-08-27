const app = getApp();

Page({
  data: {
    list:[], //地址列表
    has_record:false, //是否有记录
  },

  onLoad: function (options){
  },
  onShow:function(){
    var that = this;
    that.data.list = [];
    app.ajax('userAddr', {}, function (d) {
      if (d.code == 1) {
        var list = d.data;
        for(var i=0;i<list.length;i++){
          list[i].area = list[i].area.replace(/:/g,'');
        }
        that.data.list = list;
      } else {
        wx.showToast({title: d.msg, icon: 'none'});
      }
      that.data.has_record = that.data.list.length > 0;
      that.setData(that.data);
    });
  },
  // 选择地址
  activityPage(e){
    let addrid = e.currentTarget.dataset.addrid;
    const pages = getCurrentPages();
    let prevPage = pages[pages.length-2];
    prevPage.setData({
      addr_id: addrid,
    })
    wx.navigateBack({
      delta: 1
    });
  },
  // 添加地址带上来源
  goAdd(){
      wx.navigateTo({
        url: '../adress-add/adress-add'
      });
  },
  // // 删除地址
  // delAddr(e){
  //   const that = this;
  //   var pm = {};
  //   pm.id = e.target.dataset.id;
  //   wx.showModal({
  //     content: '是否确认删除该地址？',
  //     success (res) {
  //       if (res.confirm) {
  //         app.ajax('userAddrDel', pm, function (d) {
  //           if (d.code == 1) {
  //             wx.showToast({title: d.msg, icon: 'none'});
  //             that.onShow();
  //           } else {
  //             wx.showToast({title: d.msg, icon: 'none'});
  //           }
  //         });
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  // 设置默认
  setDefault:function(e){
    var that = this;
    var pm = {};
    pm.id = e.target.dataset.id;
    app.ajax('userAddrDefault', pm, function (d) {
      if (d.code == 1) {
         wx.showToast({title: d.msg, icon: 'none'});
         that.onShow();
      } else {
         wx.showToast({title: d.msg, icon: 'none'});
      }
    });
  }
})