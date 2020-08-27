const app = getApp();
Page({
  data: {
    id:0,   //地址ID
    truename:"" , //编辑地址时收货人名称
    area:"" , //省市区
    mobile: "",  //编辑地址时收货人电话
    address:"" , //用户详细地址
    latlng:"", //经纬度
    latitude:'',
    longitude:'',
    latlng:[],
    isMoren:false,
  },
  
  onLoad: function (options) {
    this.setData({
      id:options.id||0,
    })
  },
  onShow:function(){
    const that = this;
    if(that.data.id){
      var pm = {
        id:this.data.id,
      };
      app.ajax('userAddrRedact', pm, function (d) {
        if (d.code == 1) {
          that.data.truename = d.data.truename;
          that.data.mobile = d.data.mobile;
          that.data.area = d.data.area.replace(/:/g,'');
          that.data.address = d.data.address;
          that.data.latlng = d.data.latlng;
          that.setData(that.data);
        } else {
          wx.showToast({ "title": d.msg, "icon": "none" });
        }
      });
    }
  },
  formSubmit: function (e) {
    var userinfo = e.detail.value
    // console.log(userinfo)
    var that = this;
    userinfo.area = userinfo.area.replace("省", "省:").replace("市", "市:").replace("区", "区:");
    if (userinfo.truename.length == 0 ){
      wx.showToast({
        title: "请填写收货人",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.truename.length < 2 ){
      wx.showToast({
        title: "收货人长度在2—10个字符之间",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.mobile.length < 11 ){
      wx.showToast({
        title: "请输入正确的号码",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.area=='' ){
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
    }else if (userinfo.address.length < 4 ){
      wx.showToast({
        title: "详细地址长度在4—100位字符之间",
        icon: 'none',
        duration: 2000
      });
    }
    let myInfo = {
      id:that.data.id,
      area: userinfo.area,
      truename: userinfo.truename,
      mobile: userinfo.mobile,
      address: userinfo.address,
      latlng:that.data.latlng,
      is_default:that.data.isMoren
    };
    // console.log(myInfo)
    app.ajax('userAddrEdit', myInfo, function (d) {
      if (d.code == 1) {
        wx.showToast({
          title: "保存成功",
          icon: 'none',
          duration: 2000,
          mask: true,
          success: function () {
            wx.navigateBack({
              delta: 1
            });
          },
        });
      } else {
        wx.showToast({ "title": d.msg, "icon": "none" });
      }
    });
  },
  // 获取所在区域
  getLocation:function(){
    var that = this;
    wx.chooseLocation({
      success(res) {
        // console.log(res);
        that.setData({
          area: res.address,
          address: res.name,
          latlng: res.latitude+','+res.longitude,
        })
      },
      fail: function () {
      }
    })
  },
   // 删除地址
   delAddr(e){
    const that = this;
    var pm = {};
    pm.id = that.data.id;
    wx.showModal({
      content: '是否确认删除该地址？',
      success (res) {
        if (res.confirm) {
          app.ajax('userAddrDel', pm, function (d) {
            if (d.code == 1) {
              wx.showToast({title: d.msg, icon: 'none'});
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.showToast({title: d.msg, icon: 'none'});
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 设置默认
  switch1Change:function(e){
    var isMoren;
    if(e.detail.value){
      isMoren=1
    }else{
      isMoren=0
    }
    this.setData({
      isMoren:isMoren
    })
  }

})