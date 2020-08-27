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
    items: [],
    reasons:'',
    isShow:false,//是否展示退呀说明
    addr:{},
    addr_id:'',
    array:[],
    array_key:'',
    mark:'',
    is_user:true,
    tui_xian:'0.00',
    tui_freeya:'0.00',
    is_open_freeya:'',
  },
  radioChange(e) {
    this.setData({
      reasons:e.detail.value
    })
  },
  onLoad: function (options) {
    const that = this
    that.data.host = app.urls.host;
    app.ajax('userTime',{},function(d){
      if(d.code==1) {
        that.setData({
          array:Object.values(d.data),
          array_key:Object.keys(d.data)
        })
      } else {
        wx.showToast({
          title: d.msg,
          icon: 'none',
        })
      }
    });
  },
  onShow: function (options) {
    const that = this;
    var type = app.globalData.type;
    var is_user
    if(type == 'user'){
      is_user=1
    }else if(type == 'firm'){
      is_user=0
    }
    this.setData({is_user:is_user})
    that.is_all_checked = true;
    app.ajax('userDepositApply', {addr_id:that.data.addr_id}, function (d) {
      if (d.code == 1) {
        if (d.data.addr.area) {
          let region = (d.data.addr.area+'::').split(":");
          d.data.addr.area = region[0]+' '+region[1]+' '+region[2];
        }
        that.data.addr = d.data.addr;
        that.data.addr_id = d.data.addr.id;
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
        that.data.items = d.data.reason;
        that.setData(that.data);
        that.reset_cart_info();
      }else{
        wx.showToast({title: d.msg, icon: 'none'});
      }
    })
  },
  submit_embody:function(){
    const that = this;
    var pida = [];
    var nums = [];
    var list = that.data.list;
    var list_check = that.data.list_check;
    var is_user = that.data.is_user
    for(var i=0;i<list.length;i++) {
      if (!list_check[i]) continue;
      pida.push(list[i].id);
      nums.push(list[i].num);
    }
    var pm = {
      ids:pida.toString(),
      nums:nums.toString(),
    };
    if(!is_user){
      app.ajax('firmfreeyaFind', pm, function (d) {
        if (d.code == 1) {
          that.data.tui_xian = (d.data.tui_xian*1).toFixed(2)
          that.data.tui_freeya= (d.data.tui_freeya*1).toFixed(2)
          that.data.is_open_freeya = d.data.is_open_freeya
          that.data.is_show_reson = true
        }else{
          wx.showToast({title: d.msg, icon: 'none'});
        }
        that.setData(that.data)
      })
    }
    if(is_user){
      this.setData({
        is_show_reson:true
      })
    }
    
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
    var reason = that.data.reasons;
    var list = that.data.list;
    var list_check = that.data.list_check;
    var delivery_t= that.data.array_key[that.data.index]
    for(var i=0;i<list.length;i++) {
      if (!list_check[i]) continue;
      pida.push(list[i].id);
      nums.push(list[i].num);
    }
    if(pida.length == 0 || nums.length == 0){
      wx.showToast({title:'请选择退押桶',icon: 'none'});
      return false;
    }
    if(!delivery_t){
      wx.showToast({title:'请选择上门时间',icon: 'none'});
      return false;
    }
    var pm = {
      ids:pida.toString(),
      nums:nums.toString(),
      reason:reason || '3',
      delivery_t:delivery_t,
      addr_id:that.data.addr_id,
      memo:that.data.mark 
    };
    app.ajax('userDepositSorderSave', pm, function (d) {
      if (d.code == 1) {
        wx.reLaunch({
          url: '/pages/user/depositRefund/depositOk?id='+d.data,
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
  // 跳转地址
  skip_addr:function(){
    var url = this.data.addr.area ? '../adress/adress':'../adress-add/adress-add';
      wx.navigateTo({
        url:url,
      })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      isShow:false
    })
  },
  //获取留言信息
  bindTextAreaBlur:function(e){
    this.setData({
      mark:e.detail.value
    })
  },
})