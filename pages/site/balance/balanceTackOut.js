const app = getApp()
Page({
  data: {
    isShowZhezhao:false,
    list:{},
    has_password:'',
    value:'',
    amount:'',//提现金额
    tx_password:'',//提现密码
  },
  onLoad: function (options) {
  },
  onShow: function () {
    const that = this;
    app.ajax('siteWithdrawal',{},function(d){
      if (d.code==1) {
       that.data.list = d.data,
       that.data.has_password = d.data.has_password,
       that.data.isShowZhezhao =false
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  hidZhezhao:function(){
    this.setData({
      isShowZhezhao:false
    })
  },
  getInputValue(e){
    this.setData({
      tx_password:e.detail.value
    })
  },
  // 确认提现密码
  balance_check:function(){
    const that =this;
    var pm = {
      amount:that.data.amount,
      tx_password:that.data.tx_password
    }
    app.ajax('siteWithdrawalTj',pm,function(d){
      if (d.code==1) {
        wx.navigateTo({
          url: '/pages/site/balance/balanceCheck?id='+d.data.id,
        })
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  // 用户授权后 绑定微信账号
  getUserInfo:function(res){
    const that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      var res = res.detail
      var pm = {
        rets:res.encryptedData, 
        iv:res.iv, 
        session_key:wx.getStorageSync('session_key'),
        sign:'withdrawal'
      };
      app.ajax('sitewxinfo',pm,function(d){
        if (d.code == '1') {
          that.onShow()
        }else{
          wx.showToast({ "title": d.msg, "icon": "none" });
        }
      });
    }
  },
  // 确认提现
  formSubmit:function(e){
    const that = this;
    var inputValue = e.detail.value;
    var balance=that.data.list.balance*1
    if(inputValue.minPrice>=10 & inputValue.minPrice <= balance){
      if(that.data.list.tx_nickname){
        if(that.data.has_password == 0){
          wx.navigateTo({
            url: '/pages/site/loginShizhi/passwordAmend',
          })
        }else if(that.data.has_password == 1){
          that.setData({
            isShowZhezhao:true,
            amount:inputValue.minPrice,
            value:inputValue.minPrice,
          })
        }
      }else{
        wx.showToast({title: "请绑定提现微信",icon: 'none'});
      }
    }else if(inputValue.minPrice<10){
      wx.showToast({title: "最低提现额为10元",icon: 'none'});
    }else if(inputValue.minPrice>balance){
      wx.showToast({title: "不可超出可提现余额",icon: 'none'});
    }else{
      wx.showToast({title: '提现金额不能为空',icon: 'none'});
    }
  },
  // 全部提现
  allTx:function(){
    this.setData({
      value:this.data.list.balance
    })
  },
  //忘记密码
  forget_password:function(){
    wx.navigateTo({
      url: '/pages/site/loginShizhi/passwordAmend',
    })
  },
  // 查看提现记录
  go_balancelist:function(){
    wx.navigateTo({
      url: '/pages/site/balanceList/balanceList',
    })
  },
})