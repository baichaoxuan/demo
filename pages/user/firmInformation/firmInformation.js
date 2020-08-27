//获取应用实例
const app = getApp()

Page({
  data: {
    placeholder:'如您企业的平均订水桶数、预算、送水时间、是否需要提供发票及其他需求描述',
    phone:'',
    pwd:'',
    array:[],
    isShow:true,
    host:'',
    pic:'',
    index:'',
    id:'', //企业id
    firm_id:'',//编辑信息的id
    latlng:'',
    list:{},
    area:'',
    address:'',
    firmname:'',
  },

  onLoad: function (options) {
    this.get_firmperson();
    this.setData({
      firm_id:options.id
    })
  },
  onShow:function(){
  this.setData({
    host:app.host
  })
   this.get_firmStatus();
  },
  // 获取企业人数
  get_firmperson:function(){
    const that = this
    app.ajax('firmApply', {}, function (d) {
      if (d.code == 1) {
        var array = d.data.staff_arr
        for(var i = 0;i < array.length; i++){
          that.data.array.push(array[i].value)
        }
        that.data.id = d.data.list.id
        that.data.arr = d.data.staff_arr
        that.setData(that.data)
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
    })
  },
  // 获取所在区域
  getLocation:function(){
    var that = this;
    wx.chooseLocation({
      success(res) {
        that.setData({
          area: res.address,
          address: res.name,
          latlng: res.latitude+','+res.longitude,
        })
      },
      fail: function () {
      }
    })
  },
  bindPickerChange: function (e) {
    console.log(e)
    this.setData({
      index: e.detail.value,
      isShow:false
    })
  },
  //获取value值
  getInputValue(e){
    this.setData({
      firmname:e.detail.value
    })
  },
   // 上传图片
  insertImage(e) {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        });
        wx.uploadFile({
          url: app.urls.firmImg, //上传图片接口
          filePath: tempFilePaths[0],
          name: 'imgfile',//这个名字不可以改
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'xmlhttprequest'
          },
          formData: {
            token: app.globalData.token,
            // version: "5.5"
          },
          success(res) {
            var dataSrc = JSON.parse(res.data);
            that.data.pic = dataSrc.data.pic
            that.setData(that.data)
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        });
      }
    })
  },
  formSubmit:function(e){
    const that = this
    var pic = that.data.pic
    var index = that.data.index
    var array = that.data.arr
    var total_staff = that.data.list.total_staff
    var total_id = array[index || total_staff - 1].id 
    var charter_url = that.data.list.charter_url
    var latlng = that.data.list.latlng
    let {firmName,area,address,atherNeed,name,mobile,post} = e.detail.value
    if (!firmName) {
      wx.showToast({icon:'none',title:'公司名称不能为空'})
      return false
     }else if(!area & !address){
      wx.showToast({icon:'none',title:'请选择企业地址'})
      return false
     }else if(!name){
      wx.showToast({icon:'none',title:'您的名字不能为空'})
      return false
     }else if(!mobile){
      wx.showToast({icon:'none',title:'您的电话不能为空'})
      return false
     }else if(!post){
      wx.showToast({icon:'none',title:'您的职位不能为空'})
      return false
     }else if(!pic & !charter_url){
      wx.showToast({icon:'none',title:'营业执照不能为空'})
      return false
     }else if(!index & !total_staff){
      wx.showToast({icon:'none',title:'请选择企业人数'})
      return false
     }
     
     var pm = {
      id:that.data.id,
      company:firmName,
      charter_url:pic || charter_url,
      total_staff:total_id || total_staff,
      area:area,
      address:address,
      latlng:that.data.latlng ||latlng,
      config:atherNeed || '',
      truename:name,
      mobile:mobile,
      job:post
     }
     app.ajax('firmCompanySave', pm, function (d) {
      if (d.code == 1) {
        wx.redirectTo({
          url: '../firestatus/firestatus?id='+d.data.id,
        })
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
     })
  },
  // 重新编辑企业信息
  get_firmStatus:function(){
    const that = this;
    app.ajax('firmInfo', {id:that.data.firm_id}, function (d) {
      if (d.code == 1) {
        var list = d.data.list;
        that.data.list = list;
        if(list.company){
          that.data.isShow=false;
        }
      }else{
        wx.showToast({title: d.msg,icon: 'none',})
      }
      that.setData(that.data)
    })
  },
})