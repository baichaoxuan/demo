// pages/site/depositRefund/depositOk.js
Page({
  data: {
    id:'',
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
    })
  },
  onReady: function () {

  },
})