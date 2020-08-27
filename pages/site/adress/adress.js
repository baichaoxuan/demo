const app = getApp();
Page({
  data: {
    region: ['所在地区 >'],
    site:{},
  },
  
  onLoad: function (options) {
    const that = this;
    let site = app.globalData.site;
    let region = site.area.split(":");
    that.setData({
      site:site,
      region:region,
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit: function (e) {
    var userinfo = e.detail.value
    var that = this;
    userinfo.customerArea = this.data.region.toString().replace(/,/g,':');
    if (userinfo.username.length == 0 ){
      wx.showToast({
        title: "请填写收货人",
        icon: 'none',
        duration: 2000
      });
    } else if (userinfo.username.length < 2 ){
      wx.showToast({
        title: "收货人长度在2—20个字符之间",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.usermobile.length < 11 ){
      wx.showToast({
        title: "请输入正确的号码",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.customerArea==[] ){
      wx.showToast({
        title: "请填写所在地区",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.address == "" ){
      wx.showToast({
        title: "请填写详细地址",
        icon: 'none',
        duration: 2000
        
      });
    } else if (userinfo.address.length < 5 ){
      wx.showToast({
        title: "详细地址长度在5—100位字符之间",
        icon: 'none',
        duration: 2000
      });
    }else{
      let myInfo = {
        token: that.data,
        area: userinfo.customerArea,
        truename: userinfo.username,
        mobile: userinfo.usermobile,
        address: userinfo.address
      };
      app.ajax('addrUrl', myInfo, function (d) {
        if (d.code == 1) {
          wx.showToast({
            title: "保存成功",
            icon: 'none',
            duration: 2000,
            mask: true,
          });
          // 重新设置用户信息
          app.gsetLgSite(function () {
            var pages = getCurrentPages();
            var prePage = pages[pages.length - 2];
            prePage.onLoad();
            wx.navigateBack({
              delta: 1
            });

          });

        } else {
          wx.showToast({ "title": d.msg, "icon": "none" });
        }
      });
    }
  },

})