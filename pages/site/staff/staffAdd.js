const app = getApp();
Page({
  data: {
    isMoren:1,
    id:0,
    truename:'',
    mobile:'',
    account:'',
    password:'',
    status:'',
  },
  onLoad: function (options) {
    this.setData({
      id:options.id||0,
    })
  },
  onReady: function () {

  },
  onShow: function () {
    const that = this;
    if(that.data.id){
      var pm = {
        id:this.data.id,
      };
      app.ajax('siteMyStaffEdit', pm, function (d) {
        if (d.code == 1) {
          that.data.truename = d.data.truename;
          that.data.mobile = d.data.mobile;
          that.data.account = d.data.account;
          that.data.password = d.data.password;
          that.data.isMoren = d.data.status;
          that.setData(that.data);
        } else {
          wx.showToast({ "title": d.msg, "icon": "none" });
        }
      });
    }
  },
  formSubmit: function (e) {
    const that = this;
    var userinfo = e.detail.value
    console.log(userinfo)
    if (userinfo.staffname.length == 0 ){
      wx.showToast({
        title: "请填写收货人",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.staffname.length < 2 ){
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
    }else if (userinfo.accountnumber.length==0 ){
      wx.showToast({
        title: "请填写登录账号",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.accountnumber.length<6 || userinfo.accountnumber.length > 18){
      wx.showToast({
        title: "请输入6-10数字或字母组合",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.password.length == 0 ){
      wx.showToast({
        title: "请填写登录密码",
        icon: 'none',
        duration: 2000
      });
    }else if (userinfo.password.length<6 || userinfo.password.length > 18 ){
      wx.showToast({
        title: "请输入6-10数字或字母组合",
        icon: 'none',
        duration: 2000
      });
    }
    let myInfo = {
      id:that.data.id,
      account: userinfo.accountnumber,
      password: userinfo.password,
      truename: userinfo.staffname,
      mobile: userinfo.mobile,
      status:that.data.isMoren,
    };
    // console.log(myInfo)
    app.ajax('siteMyStaffSave', myInfo, function (d) {
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
  },
  no_check:function(){
    wx.showToast({ "title": '登录账号不能修改', "icon": "none" });
  },
  // 删除员工
  delStaff(e){
    const that = this;
    var pm = {};
    pm.id = that.data.id;
    wx.showModal({
      content: '是否确认删除该员工？',
      success (res) {
        if (res.confirm) {
          app.ajax('siteMyStaffDel', pm, function (d) {
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
})