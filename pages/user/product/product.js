const app = getApp();
Page({
  data: {
    userInfo: {},
    id:0,
    product:{},
    host:'',
    cart_num:0,  //当前购物车数
    isRuleTrue:false,
    num:1, //直接购买数量
    subPrice:'0.00', //小计数量
    isShow:false,
    deposit_price:'',
  },
  onLoad: function (options) {
    const that = this;
    that.data.host = app.urls.host;
    if (!options.id) {
      wx.showToast({title: '参数异常',icon: 'none'});
      return false;
    }
    app.gsetLgUser(function(d){
      that.setData({
        userInfo: app.globalData.user,
      })
    });
    that.data.id = options.id;
    app.ajax('userProInfo',{id:that.data.id}, function (d) {
      if(d.code == 1){
        that.data.cart_num = d.data.cart_num;
        var product = d.data.product;
        product.content = that.handleText(product.content);
        that.data.product = product;
        that.data.subPrice = product.retail_price; // *1
        that.data.deposit_price = d.data.deposit_price
        that.setData(that.data);
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    });
  },
  showRule: function () {
    this.setData({
      isRuleTrue: true
    })
  },
  //关闭透明层
  hideRule: function () {
    this.setData({
      isRuleTrue: false
    })
  },
  // 处理富文本数据
  handleText: function (str) {
    str = str.replace(/\<img/gi, '<img style="width:100%;margin:0 auto;height:auto;display:block;"');
    str = str.replace(/<p>/ig, '<p class="p_class">')
    return str
  },
  // 控制购物车的数量
  jianshao:function(e){
    let num = this.data.num;
    let price = this.data.product.retail_price;
    if(num<=1) return false;
    num--
    let subPrice = num*price
    this.setData({
      num:num,
      subPrice:subPrice.toFixed(2)
    })
  },
  zengjia:function(e){
    let num = this.data.num;
    let price = this.data.product.retail_price;
    num++
    let subPrice = num*price
    this.setData({
      num:num,
      subPrice:subPrice.toFixed(2)
    })
  },
  Manual:function(e){
    let num = parseInt(e.detail.value);
    // if (isNaN(num)) num = 1;
    let price = this.data.product.retail_price;
    let subPrice = num*price
    this.setData({
      num:num,
      subPrice:subPrice.toFixed(2)
    })
  },
  // 加入购物车
  add2cart:function(e){
    var that = this;
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    app.ajax('userAddCart',{pid:dataset.id,num:1},function(d){
      if (d.code==1) {
        wx.showToast({title: '加入购物车成功',icon: 'none'});
        that.setData({
          cart_num:that.data.cart_num+1,
        });
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    });
    return false;
  },
  
  // 立即购买
  directBuy:function(){
    var that = this;
    var pm = {
      pid:this.data.id,
      num:this.data.num
    }
    app.ajax('userBuy', pm, function (d) {
      let data = d.data
      if (d.code == 1) {
        wx.navigateTo({
          url: '/pages/user/orderSubmit/orderSubmit',
        })
      }else{
        wx.showToast({title: d.msg,icon: 'none'});
      }
     })
  },
  // 展示说明
  show:function(){
    this.setData({
      isShow:true
    })
  },
  close_show:function(){
    this.setData({
      isShow:false
    })
  },
  onShareAppMessage: function () {
    return {
        title: '[好友推荐]'+this.data.product.name,
        path: '/pages/user/product/product?id='+this.data.id// 路径，传递参数到指定页面。
    }
  }
})