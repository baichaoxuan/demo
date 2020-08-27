// pages/user/balance/balanceQuestion.js
Page({
  data: {
    index:'',
    is_show:false,
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  show_content:function(e){
    var is_show = !this.data.is_show
    var index = e.currentTarget.dataset.value
    this.setData({
      index:index,
      is_show:is_show
    })
  }
})