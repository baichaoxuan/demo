//获取应用实例
const app = getApp()

Page({
  data: {
    user:{},
    site:{},
    is_red:0,
  },

  onLoad: function (options) {
    if (app.globalData.type == 'user') {
      wx.reLaunch({
        url: '/pages/site/index/index',
      })
      return false;
    }

  },
  onShow: function (e) {
    const that = this;
    // 设置用户信息
    app.gsetLgSite(function () {
      that.setData({
        user:app.globalData.user,
        site:app.globalData.site,
        is_red:app.globalData.is_red,
      })
    }); 
    app.editTabBar1();    //显示自定义的底部导航
  },
  // 用户授权后 绑定微信账号
  getUserInfo:function(res){
    const that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.gsetWxSiteUser(res.detail, function(){
        // 重新设置用户信息
        app.gsetLgSite(function () {
          that.setData({
            user:app.globalData.user,
            site:app.globalData.site,
          })
        });
      });
    }
  },
  onPullDownRefresh: function () {
    var that = this;
    // 获取最新金额
    app.gsetLgSite(function () {
      
    });
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  //可抵扣回桶
  go_back:function(){
    wx.navigateTo({
      url:'../backBucket/backBucket'
    })
  },
  //待平台回收
  go_huishou:function(){
    wx.navigateTo({
      url:'../backWait/backWait'
    })
  },
  // 代收押金桶
  go_bucketyj:function(){
    wx.navigateTo({
      url:'../backBucketYj/backBucketYj'
    })
  },
  //扫二维码
  SweepQrCode:function(){
    wx.scanCode({
      success: (res) => {
        var pathArr = res.path.split('=')
        if(pathArr.length == 2){
          if(res.path){
            wx.navigateTo({
              url:'/'+res.path,
            })
          }else{
            wx.showToast({
              title:'请扫描合法的二维码',
              icon: 'none'});
          }
        }else if(pathArr.length == 3){
          for (var i in pathArr) {
            var path = pathArr[0]+'='+pathArr[1]+'%3D'+pathArr[2]
          }
          if(res.path){
            wx.navigateTo({
              url:'/'+path,
            })
          }else{
            wx.showToast({
              title:'请扫描合法的二维码',
              icon: 'none'});
          }
        }
      },
      fail: (res) => {
      }
    })
  },

})