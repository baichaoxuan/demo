const app = getApp();
Page({
  data: {
    id:0,
    product:{},
    host:'',
    cart_num:0,  //当前购物车数
    cart_min_product_num:0,  //配送最小数量
    isRuleTrue:false,
    num:1, //直接购买数量
    subPrice:'0.00', //小计数量
    wholesalePrice:{},
  },
  onLoad: function (options) {
    const that = this;
    that.data.host = app.urls.host;
    if (!options.id) {
      wx.showToast({title: '参数异常',icon: 'none'});
      return false;
    }
    that.data.id = options.id;
    app.ajax('productDetailUrl',{id:that.data.id}, function (d) {
      if(d.code == 1){
        that.data.cart_num = d.data.cart_num;
        that.data.cart_min_product_num = d.data.cart_min_product_num;
        var product = d.data.product;
        product.content = that.handleText(product.content);
        that.data.product = product;
        that.data.subPrice = product.cost_price; // *1
        that.setData(that.data);
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    });
   that.itemSetNum();
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
    let price = this.data.product.cost_price;
    if(num<=1) return false;
    num--;
    let subPrice = num*price;
    this.setData({
      num:num,
      subPrice:subPrice.toFixed(2)
    });
    this.itemSetNum();
  },
  zengjia:function(e){
    let num = this.data.num;
    let price = this.data.product.cost_price;
    num++
    let subPrice = num*price
    this.setData({
      num:num,
      subPrice:subPrice.toFixed(2)
    })
    this.itemSetNum();
  },
  Manual:function(e){
    let num = parseInt(e.detail.value);
    // if (isNaN(num)) num = 1;
    let price = this.data.product.cost_price;
    let subPrice = num*price
    this.setData({
      num:num,
      subPrice:subPrice.toFixed(2)
    });
    this.itemSetNum();
  },
  // 修改数量
  itemSetNum:function(index){
    var that = this;
    var pm = {};
    pm.pid = that.data.id;
    pm.num = that.data.num;
    app.ajax('productWholesale', pm, function (d) {
      if (d.code == 1) {
        that.setData({
          wholesalePrice:d.data
        })
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    },0)
  },
  // 加入购物车
  add2cart:function(e){
    var that = this;
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    app.ajax('addCarUrl',{pid:dataset.id,num:1},function(d){
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
    app.ajax('buyUrl', pm, function (d) {
      let data = d.data
      if (d.code == 1) {
        wx.navigateTo({
          url: '/pages/site/orderSubmit/orderSubmit',
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
  
})