const app = getApp();
Page({
  data: {
    product:'',
    list:[],  //购物车商品
    history_buys:[], //历史购买
    pdt_num:0, //选中商品数量
    total_amount:0, //选中商品金额
    cart_min_product_num:0,  //配送最小数量
    host:'',
    is_all_checked:true, //全选标记
    list_check:[], //item选择标记 与list对应 默认全选
    wholesalePrice:{},
  },
  
  onLoad: function (options) {
    const that = this;
    that.data.host = app.urls.host;
  },
  onShow: function (options) {
    const that = this;
    that.is_all_checked = true;
    app.ajax('shopCarUrl', {}, function (d) {
      if (d.code == 1) {
        that.data = app.extends(that.data, d.data);
        var list_check = [];
        for(var i=0;i<d.data.list.length;i++){
          list_check.push(true);
        }
        that.data.list_check = list_check;
        that.setData(that.data);
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    })
  },

  // 初始话金额与数量提示
  reset_cart_info(){
    var list = this.data.list;
    var list_check = this.data.list_check;
    var pdt_num = 0;
    var total_amount = 0;
    for(var i=0;i<list.length;i++) {
      if (!list_check[i]) continue;
      pdt_num += list[i].num;
      total_amount += parseInt(list[i].amount);
    }
    this.setData({
      pdt_num:pdt_num,
      total_amount:total_amount.toFixed(2),
    });
  },
  // 全选标记
  isAllCheck:function(e){
    let is_all_checked = this.data.is_all_checked;
    is_all_checked = !is_all_checked;
    var list = this.data.list;
    var list_check = this.data.list_check;
    for(var i=0;i<list.length;i++) {
      list_check[i] = is_all_checked;
    }
    this.setData({
      is_all_checked:is_all_checked,
      list_check:list_check,
    })
    this.reset_cart_info();
  },
  // 单条选择
  itemCheck:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    var list_check = this.data.list_check;
    var is_all_checked = this.data.is_all_checked;
    list_check[dataset.index] = !list_check[dataset.index];
    if(!list_check[dataset.index]) is_all_checked=false;
    this.setData({
      list_check:list_check,
      is_all_checked:is_all_checked,
    })
    this.reset_cart_info();
  },
  // 修改数量
  itemSetNum:function(index){
    var that = this;
    var item = this.data.list[index];
    var pm = {};
    pm.pid = item.id;
    pm.num = item.num;
    pm.addtype = 1;
    app.ajax('addCarUrl', pm, function (d) {
      if (d.code == 1) {
        that.data.list[index].amount = d.data.amount;
        that.data.list[index].cost_price = d.data.cost_price;
        that.setData({
          list:that.data.list,
        });
        that.reset_cart_info();
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    },0)
  },
  // 控制购物车的数量
  jianshao:function(e){
    let index = e.target.dataset.index;
    let num = this.data.list[index].num
    if(num<=1) return false;
    this.data.list[index].num--;
    this.itemSetNum(index);
  },
  zengjia:function(e){
    let index = e.target.dataset.index;
    let num = this.data.list[index].num
    this.data.list[index].num++;
    this.itemSetNum(index);
  },
  Manual:function(e){
    let index = e.target.dataset.index;
    let num = parseInt(e.detail.value);
    if (isNaN(num)) num = 1;
    this.data.list[index].num = num;
    setTimeout(() => {
      this.itemSetNum(index);
    }, 2000);
  },
  // 删除商品
  del_item: function (e) {
    var that = this;
    let index = e.target.dataset.index;
    var item = this.data.list[index];
    var pm = {};
    pm.pid = item.id;
    app.ajax('delCarUrl', pm, function (d) {
      if (d.code == 1) {
        that.data.list.splice(index, 1);
        that.data.list_check.splice(index, 1);
        that.setData({
          list:that.data.list,
          list_check:that.data.list_check,
        });
        that.reset_cart_info();
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    })
  },

  /**
   * 显示删除按钮
   */
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    this.setXmove(productIndex, -20)
  },
  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    this.setXmove(productIndex, 0)
  },

  /**
   * 设置movable-view位移
   */
  setXmove: function (productIndex, xmove) {
    let productList = this.data.product
    productList[productIndex].xmove = xmove

    this.setData({
      product: productList
    })
  },

  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },
   /**
   * 处理touchstart事件
   */
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
  },
   /**
   * 处理touchend事件
   */
  handleTouchEnd(e) {
    if(e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e)
    } else if(e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },

  // 加入购物车 历史购买
  add2cart:function(e){
    var that = this;
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    app.ajax('addCarUrl',{pid:dataset.id,num:1},function(d){
      if (d.code==1) {
        wx.showToast({title: '加入购物车成功',icon: 'none'});
        that.onShow();
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    });
    return false;
  },
  // 进入商品详情 历史购买
  go2info:function(e){
    var dataset = e.target.dataset;//获取到绑定的数据
    wx.navigateTo({
      url: '/pages/site/shop/info?id='+dataset.id,
    })
  },
  // 提交购物车
  submit_cart:function(e){
    var pida = [];
    var list = this.data.list;
    var list_check = this.data.list_check;
    for(var i=0;i<list.length;i++) {
      if (!list_check[i]) continue;
      pida.push(list[i].id);
    }
    if(pida.length == 0){
      wx.showToast({title:'请选择商品提交',icon: 'none'});
      return false;
    }

    app.ajax('subCarUrl',{pids:pida.join(',')},function(d){
      if (d.code==1) {
        wx.navigateTo({
          url: '/pages/site/orderSubmit/orderSubmit',
        })
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    });
  }

})