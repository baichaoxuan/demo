const app = getApp();
Page({
  data: {
    is_show_reson:false, //是否展示退押金的理由
    list:[],//品牌桶押金列表
    need_list:[],
    host:'',
    product:'',
    pdt_num:0, //选中商品数量
    num:0,
    total_amount:0,//总价
    is_all_checked:true, //全选标记
    list_check:[], //item选择标记 与list对应 默认全选
    is_check:false,//选择原因
    is_check1:false,//选择原因
    is_check2:false,//选择原因
    items: [
      {value: '暂时没有订水需求', name: '暂时没有订水需求'},
      {value: '更换了其他订水渠道', name: '更换了其他订水渠道'},
      {value: '其它', name: '其它'},
    ],
    memo:'',
    isShow:false,//是否展示退呀说明
  },
  radioChange(e) {
    this.setData({
      memo:e.detail.value
    })
  },
  onLoad: function (options) {
    const that = this
    that.data.host = app.urls.host;
  },
  onShow: function (options) {
    const that = this;
    that.is_all_checked = true;
    app.ajax('despositSorder', {}, function (d) {
      if (d.code == 1) {
        that.data = app.extends(that.data, d.data);
        var list_check = [];
        for(var i=0;i<d.data.list.length;i++){
          list_check.push(true);
        }
        that.data.need_list = d.data.list;
        // 数组同源时处理异常
        that.data.list = [];
        for(var i in d.data.list){
          that.data.list.push(app.extends({},d.data.list[i]));
        }
        that.data.list_check = list_check;
        that.setData(that.data);
        that.reset_cart_info();
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    })
  },
  submit_embody:function(){
    this.setData({
      is_show_reson:true
    })
  },
  cancel:function(){
    this.setData({
      is_show_reson:false
    })
  },
  confirm:function(){
    const that = this;
    var pida = [];
    var nums = [];
    var memo = that.data.memo;
    var list = this.data.list;
    var list_check = this.data.list_check;
    for(var i=0;i<list.length;i++) {
      if (!list_check[i]) continue;
      pida.push(list[i].id);
      nums.push(list[i].num);
    }
    if(!memo){
      wx.showToast({title:'请选择申请原因',icon: 'none'});
      return false;
    }
    if(pida.length == 0 || nums.length == 0){
      wx.showToast({title:'请选择退押桶',icon: 'none'});
      return false;
    }
    var pm = {
      ids:pida.toString(),
      nums:nums.toString(),
      memo:memo
    };
    app.ajax('depositSave', pm, function (d) {
      if (d.code == 1) {
        wx.reLaunch({
          url: '/pages/site/depositRefund/depositOk?id='+d.data.id,
        })
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    })
  },
   // 控制退押金桶的数量
   jianshao:function(e){
    let index = e.target.dataset.index;
    let num = this.data.list[index].num
    if(num<=1) return false;
    this.data.list[index].num--;
    this.itemSetNum();
  },
  zengjia:function(e){
    let index = e.target.dataset.index;
    let num = this.data.list[index].num
    this.data.list[index].num++;
    this.itemSetNum();
  },
  Manual:function(e){
    let index = e.target.dataset.index;
    let num = parseInt(e.detail.value);
    if (isNaN(num)) num = 1;
    this.data.list[index].num = num;
    setTimeout(() => {
      this.itemSetNum();
    }, 2000);
  },
  itemSetNum:function(){
    var num = [0,0]; //总数
    for(var i in this.data.list) {
      var da = this.data.list[i];
      num[0] += da.num;
    }
    this.setData({
      list: this.data.list,
      num: num[0],
    });
    this.reset_cart_info()
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
      total_amount = parseInt(list[i].unit_price *pdt_num );
    }
    this.setData({
      num:pdt_num,
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
  // 退押金原因
  other:function(){
    var is_check=!this.data.is_check2
    this.setData({
      is_check2:is_check
    })
  },
  no_need:function(){
    var is_check=!this.data.is_check
    this.setData({
      is_check:is_check
    })
  },
  other_channels:function(){
    var is_check=!this.data.is_check1
    this.setData({
      is_check1:is_check
    })
  },
  every_show:function(){
    this.setData({
      isShow:true,
    })
  },
  close_show:function(){
    this.setData({
      isShow:false
    })
  },
})