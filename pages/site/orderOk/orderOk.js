const app = getApp();
Page({
  data: {
    id:'',                    //订单id
  },

  onLoad: function (options) {
    if(options.id) {
      this.setData({id:options.id});
    }
  },
})