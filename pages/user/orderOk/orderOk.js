const app = getApp();
Page({
  data: {
    id:0,
  },

  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },

})