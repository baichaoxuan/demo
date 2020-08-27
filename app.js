const config = require('./config');

App({
  urls:null, // 接口列表
  host:'https://www.jczgss.com', // 环境前缀-版本校验接口返回设置
  globalData: {
    token: '', //登录用户标记
    type: 'user', //当前登录用户身份 user:用户,site:水站
    user: {}, //用户信息
    site: {}, //站点信息
    is_red:{},//是否显示红点
  },
  onLaunch: function () {
    // 接口信息
    this.urls = config.configUrl(this.host);
    // tokes 处理
    var tokens = wx.getStorageSync('token')+',';
    var tarr = tokens.split(',');
    this.globalData.token = tarr[0];
    this.globalData.type = tarr[1];
    // console.log([tokens, tarr, this.globalData]);
    if (this.globalData.type=='') this.globalData.type = 'user';
  },
  // 当小程序启动，或从后台进入前台显示
  onShow: function() {
    this.ckVersion();
  },
  isCkVersion:false,
  // 校验环境版本 并记录微信账号信息
  ckVersion(){
    var that = this;
    if (that.isCkVersion) {
      // console.log('校验中..');
      return false;
    }
    that.isCkVersion = true;
    wx.request({
      url: "https://www.jczgss.com/user/index/index",
      data: { 'version': that.urls.version },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'X-Requested-With': 'xmlhttprequest'
      },
      success: function (res) {
        // 环境不变且登录标记有效则返回不处理
        if (that.host == res.data.data.host && that.globalData.token != '') {
          that.isCkVersion = false;
          return false;
        }
        // 重新设置路径
        that.host = res.data.data.host;
        that.urls = config.configUrl(that.host);
        // 检查当前微信号信息 记录当前微信号密钥信息 生成普通用户信息
        wx.login({
          success: res => {
            // {errMsg: "login:ok", code: "071TDqUN0b3vOa2jVKWN0ZwwUN0TDqUV"}
            // 发送 res.code 到后台换取 openId, sessionKey, unionId 
            // sessionKey 需要缓存记录，用于解密一些加密信息
            wx.request({
              url: that.urls.userWxOpenid,
              data: { 'code': res.code },
              method: 'GET',
              dataType: 'json',
              success: function (res) {
                var d = res.data;
                if (d.code == 1) {
                  wx.setStorageSync('session_key', d.data.session_key); //用于解密
                  // 登录普通用户去往普通用户首页
                  that.globalData.token = d.data.token;
                  that.globalData.type = 'user'; //普通用户登录身份
                  wx.setStorageSync('token', that.globalData.token+','+that.globalData.type); //登录标记缓存
                  that.gsetLgUser(function(){
                    wx.reLaunch({url: '/pages/user/index/index'});
                  });
                } else {
                  wx.showToast({ "title": d.msg, "icon": "none" });
                }
              },
              fail: function (res) {
                console.log(['fail', res]);
              },
              complete:function(){
                that.isCkVersion = false;
              }
            })
          }
        })
      },
      fail: function (d) {
        that.isCkVersion = false;
        console.log(['fail', d]);
      }
    })
  },
  // 绑定微信账号
  gsetWxUser(res, callback) {
    var that = this;
    // 可以将 res 发送给后台解码出 unionId 需要用户登录的缓存 sessionKey
    var pm = {rets:res.encryptedData, iv:res.iv, session_key:wx.getStorageSync('session_key')};
    that.ajax('userWxInfo',pm,function(d){
      if (d.code == '1') {
        if (callback) callback();
      }else{
        wx.showToast({ "title": d.msg, "icon": "none" });
      }
    });
  },
  // 绑定微信账号
  gsetWxSiteUser(res, callback) {
    var that = this;
    // 可以将 res 发送给后台解码出 unionId 需要用户登录的缓存 sessionKey
    var pm = {rets:res.encryptedData, iv:res.iv, session_key:wx.getStorageSync('session_key')};
    that.ajax('sitewxinfo',pm,function(d){
      if (d.code == '1') {
        if (callback) callback();
      }else{
        wx.showToast({ "title": d.msg, "icon": "none" });
      }
    });
  },
  // 重新设置普通用户信息
  gsetLgUser(callback) {
    var that = this;
    that.ajax('userInfo',{},function(d){
      if (d.code == '1') {
        // that.globalData.type = 'user';
        that.globalData.user = d.data.user;
        that.globalData.site = {};
        if (callback) callback();
      }else{
        wx.showToast({ "title": d.msg, "icon": "none" });
      }
    },0);
  },
  // 重新设置水站登录用户信息
  gsetLgSite(callback) {
    var that = this;
    that.ajax('siteUserInfo',{},function(d){
      if (d.code == '1') {
        that.globalData.user = d.data.user;
        that.globalData.site = d.data.site;
        that.globalData.is_red = d.data.is_red;
        if (callback) callback();
      }else{
        wx.showToast({ "title": d.msg, "icon": "none" });
      }
    },0);
  },
  // 对象继承
  extends(){
    var arg = arguments;
    var i = 1;
    var target = arg[0]||{};
    for (; i < arg.length;i++) {
      var a = arg[i];
      for (var key in a) {
        target[key] = a[key];
      }
    }
    return target;
  },
  // 封装处理
  ajax:function(urlkey,params,callback,is_loading){
    var url = this.urls[urlkey]; //可简化为变量
    this._ajax(url,params,callback,{is_loading:is_loading});
  },
  requesting: {},
  _ajax:function(url,params,callback,opt){
    const that = this;
    opt = that.extends({type:"POST",dataType:"json",is_loading:1},opt||{});
    var ukey = url.replace(/[^A-Za-z0-9]+/gm,'');
    // 防止重复提交 30秒内不可重复提交
    var nowTime = new Date().getTime();
    if (that.requesting.ukey && nowTime-that.requesting.ukey>30000) return false;
    that.requesting[ukey] = nowTime;
    // 是否显示logining 默认是
    if(opt.is_loading) wx.showLoading({title: '加载中',icon: 'loading',});
    // 添加附加参数
    params.token = that.globalData.token;
    params.version = that.urls.version;
    wx.request({
      url: url,
      data: params,
      method: opt.type,
      header: {
        'content-type': 'application/json',
        'X-Requested-With': 'xmlhttprequest'
      },
      dataType: opt.dataType,
      success: function (res) {
        delete that.requesting[ukey];
        if(opt.is_loading) wx.hideLoading();
        // 登录标记失效处理：检查版本+记录微信信息后 回到普通用户首页
        if (res.data.code == -444) {
          that.globalData.token = '';
          wx.removeStorageSync('token');
          that.ckVersion();
          return false;
        }
        callback(res.data);
      },
      fail: function(res){
        delete that.requesting[ukey];
        if(opt.is_loading) wx.hideLoading();
        console.log(res);
        wx.showToast({title: "请求错误",icon: 'none'});
      }
    })
  },
  
  //第一种底部  
  editTabBar: function () {
    //使用getCurrentPages可以获取当前加载中所有的页面对象的一个数组，数组最后一个就是当前页面。
    var curPageArr = getCurrentPages();    //获取加载的页面
    var curPage = curPageArr[curPageArr.length - 1];    //获取当前页面的对象
    var pagePath = curPage.route;    //当前页面url
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }
    
    var tabBar = {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/user/index/index",
          "text": "首页",
          "iconPath": "/images/shouye1.png",
          "selectedIconPath": "/images/shouye2.png",
          "clas": "menu-item",
          "selectedColor": "#4c92f7",
          active: true
        },
        {
          "pagePath": "/pages/user/cart/cart",
          "text": "购物车",
          "iconPath": "/images/gouwucheman3.png",
          "selectedIconPath": "/images/gouwucheman9.png",
          "selectedColor": "#4c92f7",
          "clas": "menu-item",
          active: false
        },
        {
          "pagePath": "/pages/user/mine/mine",
          "text": "我的",
          "iconPath": "/images/geren.png",
          "selectedIconPath": "/images/gerenmen.png",
          "selectedColor": "#4c92f7",
          "clas": "menu-item",
          active: false
        }
      ],
      "position": "bottom"
    };
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true;    //根据页面地址设置当前页面状态    
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },
  //第二种底部，原理同上
  editTabBar1: function () {
    var curPageArr = getCurrentPages();
    var curPage = curPageArr[curPageArr.length - 1];
    var pagePath = curPage.route;
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }
    var tabBar = {
      "color": "#000",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/site/index/index",
          "text": "送水订单",
          "iconPath": "/images/order.png",
          "selectedIconPath": "/images/order-hl.png",
          "clas": "menu-item2",
          "selectedColor": "#4c92f7",
          active: false
        },
        {
          "pagePath": "/pages/site/mine/mine",
          "text": "我的",
          "iconPath": "/images/wode.png",
          "selectedIconPath": "/images/wode-hl.png",
          "selectedColor": "#4c92f7",
          "clas": "menu-item2",
          active: true
        },
      ],
      "position": "bottom"
    };
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pagePath) {
        tabBar.list[i].active = true; 
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  }
})