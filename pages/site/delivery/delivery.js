const app = getApp();
const io = require('../../../utils/weapp.socket.io.js');
Page({
  data: {
    orderid:'',
    total_num:0,  //需要回桶总数
    need_list:[], //需回桶列表
    list:[],      //实际回桶列表
    num:0,        //实际回桶数
    brand:[],     //添加桶品牌列表
    tips:'换桶需补交差价，差价不予退还',     //提示
    bucket_deposit_price:0,  //押金单价
    bucket_diff_price:0,   //差价单价
    isErweima:false,//是否显示二维码
    qrimg:'',     //付款二维码
    host:'',      //图片前缀
    cj_amount:'',
    ya_amount:'',
    add_amount:0.00,
  },
  onLoad: function (options) {
    const that = this;
    that.data.orderid = options.id
    that.data.host = app.urls.host;
    
    app.ajax('myMorderBucketback', {id:options.id}, function(d){
      if (d.code==1) {
        that.data.brand = d.data.brand;
        that.data.total_num = d.data.total_num;
        that.data.need_list = d.data.list;
        // 数组同源时处理异常
        that.data.list = [];
        for(var i in d.data.list){
          that.data.list.push(app.extends({},d.data.list[i]));
        }
        that.data.num = d.data.total_num;
        that.data.bucket_deposit_price = parseInt(d.data.bucket_deposit_price);
        that.data.bucket_diff_price = parseInt(d.data.bucket_diff_price);
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  onUnload: function() {
    this.closeSocket();
  },
  onHide: function () {
    this.closeSocket();
  },
  onShow: function(){
    this.openSocket();
  },

  // 控制数量
  jianshao:function(e){
    let index = e.target.dataset.index;
    let num = this.data.list[index].num
    if(num<=1) {
      this.data.list.splice(index, 1);
    } else {
      this.data.list[index].num--;
    }
    this.itemSetNum();
  },
  zengjia:function(e){
    let index = e.target.dataset.index;
    this.data.list[index].num++;
    this.itemSetNum();
  },
  Manual:function(e){
    let index = e.target.dataset.index;
    let num = parseInt(e.detail.value);
    if (isNaN(num) || num<=0) {
      this.data.list.splice(index, 1);
    } else {
      this.data.list[index].num = num;
    }
    setTimeout(() => {
      this.itemSetNum();
    }, 2000);
  },
  del_item: function (e) {
    let index = e.target.dataset.index;
    this.data.list.splice(index, 1);
    this.itemSetNum();
  },
  // 数量变动后处理
  itemSetNum:function(){
    var num = [0,0]; //总数，cjts ,yatj
    for(var i in this.data.list) {
      var da = this.data.list[i];
      num[0] += da.num;
      // 差价桶
      if (da.type==2) num[1] += da.num;
    }
    var cj_amount = this.data.bucket_diff_price*num[1];
    var ya_amount = this.data.bucket_deposit_price*(this.data.total_num - num[0]);
    var add_amount = cj_amount + ya_amount
    this.setData({
      cj_amount:cj_amount,
      ya_amount:ya_amount,
      list: this.data.list,
      num: num[0],
      add_amount:add_amount
    });

  },
  // 添加其他品牌
  bindPickerChange: function(e) {
    var brand = this.data.brand[e.detail.value];
    var ishas = 0;
    for(var i in this.data.list) {
      if (this.data.list[i].brand_id == brand.id) {
        ishas = 1;
        break;
      }
    }
    if (ishas==0) {
      this.data.list.push({
        brand_id:brand.id,
        type:brand.type,
        name:brand.name,
        image:brand.image,
        num:1,
      })
      this.itemSetNum();
    }
  },
  //提交回桶
  toSubmit:function(){
    var that = this;
    var brand_arr = [];
    var num_arr = [];
    for(var i in this.data.list) {
      brand_arr.push(this.data.list[i].brand_id);
      num_arr.push(this.data.list[i].num);
    }
    var pm = {};
    pm.id = that.data.orderid;
    pm.brand = brand_arr.join(',');
    pm.num = num_arr.join(',');
    app.ajax('myMorderBucketbackTj', pm, function(d){
      if (d.code==1) {
        if (d.data.need_pay == '1') {
          var qrimg = that.data.host + d.data.qr_url;
          that.setData({
            isErweima:true,
            qrimg: qrimg,
          })
          that.openSocket(); //启动socket通知
        } else {
          wx.navigateTo({
            url: '/pages/site/userorder/info?id='+that.data.orderid,
          })
        }
      } else {
        wx.showToast({title: d.msg,icon: 'none'});
      }
      that.setData(that.data);
    })
  },
  //关闭二维码
  QRcode_close:function(){
    this.setData({
      isErweima:false
    })
  },

  openSocket() {
    if (this.data.socketStatus == "connected" || this.data.orderid == "") return false;
    this.setData({ socketStatus: 'connecting' });

    var that = this
    // 打开信道
    const socket = (this.socket = io(
      app.urls.socketUrl
    ))
    // 监听服务器推送消息
    socket.on('message', function (d) {
      wx.navigateTo({
        url: '/pages/site/userorder/info?id='+that.data.orderid,
      })
    })
    
    socket.on('connect', () => {
      that.setData({ socketStatus: 'connected' });
      socket.emit('login', 'jc_mid_'+that.data.orderid);
    })
    socket.on('disconnect', reason => {
      that.setData({ socketStatus: 'closed' })
    })

  },
  closeSocket() {
    if (this.data.socketStatus === 'connected') {
      this.socket.close();
    }
  }
  
})