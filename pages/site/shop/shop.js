const app = getApp();
Page({
  data: {
    cates:[], //分类列表
    now_cid:0, //当前分类id
    no_record:0, //初始是否有记录
    is_has_more:1, //是否还有更多了
    list:[], //记录列表
    page:1, //当前第几页
    host:'',      //图片前缀
  },
  onLoad: function (options) {
    var that = this;
    that.data.host = app.urls.host;
    if (options.cid) {
      this.data.now_cid = options.cid;
    }
    app.ajax('acategoryListUrl',{},function(d){
      if (d.code==1) {
        that.data.cart_num = d.data.cart_num;
        that.data.cates = d.data.list;
        if(that.data.now_cid==0) that.data.now_cid = d.data.default_id;
        that.init();
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
    });
  },
  // 初始化显示
  init: function(){
    this.data.page = 1;
    this.data.is_has_more = 1;
    this.data.list = [];
    this.getPage();
  },
  // 获取数据
  getPage:function(){
    var that = this;
    if (that.data.is_has_more==0 || that.data.no_record==1) return false;
    var pm = {};
    if(that.data.now_cid) pm.category_id = that.data.now_cid;
    pm.page = that.data.page;
    app.ajax('productUrl',pm,function(d){
      if (d.code==1) {
        that.data.list = that.data.list.concat(d.data.list);
        // 无更多时设置
        if (d.data.pcount <= d.data.page) {
          that.data.is_has_more = 0;
        } else {
          that.data.page++;
        }
        // 无记录时设置
        if (d.count == 0) {
          that.data.is_has_more = 1;
          that.data.no_record = 1;
        }
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作 
   * 刷新页面 第一页开始
   */
  onPullDownRefresh: function () {
    this.init();
  },
  /**
   * 页面上拉触底事件的处理函数
   * 上拉加载更多
   */
  onReachBottom: function () {
    this.getPage();
  },
  // 切换列表
  getList:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    if (dataset.cid != this.data.now_cid) {
      this.data.now_cid = dataset.cid;
      this.init();
    }
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
  // 进入详情
  go2info:function(e){
    var dataset = e.currentTarget.dataset;//获取到绑定的数据
    wx.navigateTo({
      url: 'info?id='+dataset.id,
    })
  },

})