const app = getApp();
Page({
  data: {
    orderid:'',
    total_num:0,  //需要回桶总数
    need_list:[], //需回桶列表
    new_list:[],  //修改退回数量
    list:[],      //实际回桶列表
    num:0,        //实际回桶数
    brand:[],     //添加桶品牌列表
    host:'',      //图片前缀
    is_amend:false,//展示修改数量
    ind_num:'',
  },
  onLoad: function (options) {
    const that = this;
    that.data.orderid = options.id
    that.data.host = app.urls.host;
    that.setData(that.data)
  },
  onShow:function(){
    const that = this;
    var orderid = that.data.orderid
    app.ajax('staffSorderBucketback', {id:orderid}, function(d){
      if (d.code==1) {
        that.data.brand = d.data.brand;
        that.data.total_num = d.data.total_num;
        that.data.need_list = d.data.list;
        // 数组同源时处理异常
        that.data.list = [];
        for(var i in d.data.list){
          that.data.list.push(app.extends({},d.data.list[i]));
          that.data.new_list.push(app.extends({},d.data.list[i]));
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
  // 数量变动后处理
  itemSetNum:function(){
    var num = [0,0]; //总数，cjts ,yatj
    for(var i in this.data.list) {
      var da = this.data.list[i];
      num[0] += da.num*1;
    }
    this.setData({
      list: this.data.list,
      num: num[0],
    });

  },
  // 控制退回数量
  amend_jianshao:function(e){
    let index = e.target.dataset.index;
    let num = this.data.new_list[index].num
    this.data.new_list[index].num--;
    this.amend_setNum();
  },
  amend_zengjia:function(e){
    let index = e.target.dataset.index;
    this.data.new_list[index].num++;
    this.amend_setNum();
  },
  amend_manual:function(e){
    let index = e.target.dataset.index;
    let num = parseInt(e.detail.value);
    this.data.new_list[index].num = num;
    setTimeout(() => {
      this.amend_setNum();
    }, 2000);
  },
  // 数量变动后处理
  amend_setNum:function(){
    var num = [0,0]; //总数，cjts ,yatj
    for(var i in this.data.new_list) {
      var da = this.data.new_list[i];
      num[0] += da.num*1;
    }
    this.setData({
      new_list: this.data.new_list,
      // total_num: num[0],
    });
  },
  // 确认
  amend_affirm:function(e){
    var index = e.target.dataset.index;
    var num =0; //总数，cjts ,yatj
    if(this.data.new_list[index].num == 0){
      this.data.new_list.splice(index, 1);
    }
    for(var i in this.data.new_list) {
      var da = this.data.new_list[i];
      num += da.num*1;
    }
    this.setData({
      need_list: this.data.new_list,
      new_list: this.data.new_list,
      total_num: num,
      is_amend:false,
    });
  },
  // 修改退桶数量
  revise_number:function(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      is_amend:true,
      ind_num:index
    })
  },
  // 返回
  amend_return:function(){
    this.setData({
      is_amend:false,
    })
  },
  // 添加其他品牌
  // bindPickerChange: function(e) {
  //   var brand = this.data.brand[e.detail.value];
  //   var ishas = 0;
  //   for(var i in this.data.list) {
  //     if (this.data.list[i].brand_id == brand.brand_id) {
  //       ishas = 1;
  //       break;
  //     }
  //   }
  //   if (ishas==0) {
  //     this.data.list.push({
  //       brand_id:brand.brand_id,
  //       name:brand.name,
  //       img:brand.img,
  //       num:1,
  //     })
  //     this.itemSetNum();
  //   }
  // },
  //提交回桶
  toSubmit:function(){
    var that = this;
    var num = that.data.num;
    var total_num = that.data.total_num
    if(num==0 || total_num ==0){
      wx.showToast({
        title: '回收桶数量与取桶数量不能为0桶',
        icon: 'none'
      });
    }else if(num != total_num){
      wx.showToast({
        title: '回收桶数量须等于取桶数量',
        icon: 'none'
      });
    }else{
      var brands = [];
      var num_arr = [];
      var yaids = [];
      var yanums = [];
      for(var i in this.data.list) {
        brands.push(this.data.list[i].brand_id);
        num_arr.push(this.data.list[i].num);
      }
      for(var i in this.data.need_list){
        yaids.push(this.data.need_list[i].deposit_id);
        yanums.push(this.data.need_list[i].num);
      }
      var pm = {};
      pm.sorder_id = that.data.orderid
      pm.brands = brands.join(',');
      pm.nums = num_arr.join(',');
      pm.yaids = yaids.join(',');
      pm.yanums = yanums.join(',');
      app.ajax('staffSorderTj', pm, function(d){
        if (d.code==1) {
          wx.showToast({title: d.msg,icon: 'none'});
          setTimeout(()=>{
            var pages = getCurrentPages();
            var prePage = pages[pages.length - 2];
            prePage.onLoad();
            wx.navigateBack({
              delta: 1
            });
          },1000)
        } else {
          wx.showToast({title: d.msg,icon: 'none'});
        }
        that.setData(that.data);
      })
    }
  },
})