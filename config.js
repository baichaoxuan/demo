//  配置域名链接
function configUrl (host) {
  let default_host = 'https://www.jczgss.com';
  let hostname = (host||default_host).replace('https://','');
  host = 'https://'+hostname;
  const config = {
    host:`https://${hostname}`,
    version: '1.4',                                                //版本号与设置一致为测试
    socketUrl:`wss://${hostname}`,                                 //socket地址

    // 普通用户接口
    userWxOpenid: `${host}/user/wx/openid`,                        //普通用户获取token
    userWxInfo: `${host}/user/wx/info`,                            //设置微信用户信息
    userInfo: `${host}/user/my.index/index`,                       //普通用户信息
    userCategory: `${host}/user/mall.product/category_list`,       //商品分类
    userBanner: `${host}/user/mall.product/ad_banner`,             //banner
    userProduct: `${host}/user/mall.product/page`,                 //分页获取商品列表
    userProInfo: `${host}/user/mall.product/info`,                 //商品详情
    userBuy: `${host}/user/mall.cart/direct_buy`,                  //立即购买
    userAddCart: `${host}/user/mall.cart/add`,                     //加入购物车
    userSubOrder: `${host}/user/mall.order/submit`,                //提交订单
    userCart: `${host}/user/mall.cart/index`,                      //查看购物车
    userCartSub: `${host}/user/mall.cart/submit`,                  //提交购物车
    userDelCart: `${host}/user/mall.cart/del`,                     //删除购物车
    userOrder: `${host}/user/my.order/index`,                      //分页获取订单
    userOrderMall: `${host}/user/mall.order/index`,                //查看用户提交订单
    userOrderInfo: `${host}/user/my.order/info`,                   //订单详情
    userOrderCancle: `${host}/user/my.order/cancel`,               //取消订单
    userOrderPay: `${host}/user/my.order/get_pay`,                 //订单支付
    userOrderStatus: `${host}/user/mall.order/status`,              //订单支付
    userOrderReceive: `${host}/user/my.order/receive`,              //确认收货
    userGetData: `${host}/user/my.index/get_data`,                  //获取订单数
    userAddr: `${host}/user/my.addr/index`,                         //地址列表
    userAddrDel:`${host}/user/my.addr/del`,                         //删除地址列表
    userAddrDefault:`${host}/user/my.addr/set_default`,             //默认地址
    userAddrRedact:`${host}/user/my.addr/addr_info`,                //编辑地址
    userAddrEdit:`${host}/user/my.addr/addr_edit`,                  //添加地址
    userTime:`${host}/user/mall.order/delivery_time`,               //配送时间
    userBills:`${host}/user/my.index/bills`,                         //资金流水
    userActivity:`${host}/user/my.activity/index`,                   //充值首页
    userActivityList:`${host}/user//my.activity/alist`,                //活动列表
    userActivityRecharge:`${host}/user/my.activity/recharge`,        //充值接口
    userActivityStatus:`${host}/user/my.activity/status`,             //充值成功
    userDeposit:`${host}/user/my.deposit/index`,                     //押金
    userDepositPage:`${host}/user/my.deposit/page`,                  //押金记录
    userDepositInfo:`${host}/user/my.deposit/info`,                  //押金记录详情
    userDepositApply:`${host}/user/my.deposit/apply_mall_sorder`,    //申请退押金页
    userDepositSorderSave:`${host}/user/my.deposit/apply_save`,       //退押金提交
    userDepositCancel:`${host}/user/my.deposit/cancel`,               //取消订单
    userDepositSorder:`${host}/user/my.deposit/sorder`,               //押金记记录
    userDepositSorderItem:`${host}/user/my.deposit/sorder_item`,      //已退押金详情
    // 企业用户接口
    firmRead:`${host}/user/firm.index/firm_read`,                      //是否有申请成功的企业未读
    firmPassInfo:`${host}/user/firm.index/pass_info`,                  //申请成功企业详情
    firmApply:`${host}/user/firm.index/apply`,                          //注册接口
    firmAccountSave:`${host}/user/firm.index/account_save`,             //账号信息保存
    firmCompanySave:`${host}/user/firm.index/company_save`,             //公司信息保存
    firmDel:`${host}/user/firm.index/del`,                              //删除审核失败企业
    firmInfo:`${host}/user/firm.index/info`,                            //查询企业信息
    firmImg:`${host}/user/firm.index/up_temp_img`,                       //上传图片
    firmLogin:`${host}/user/firm.login/lg`,                              //登录
    firmLogout:`${host}/user/firm.freeya/logout`,                        //退出登录
    firmfreeya:`${host}/user/firm.freeya/index`,                         //免押首页
    firmfreeyaPage:`${host}/user/firm.freeya/page`,                      //免押金使用明细
    firmfreeyaFind:`${host}/user/my.deposit/freeya_find`,                //企业申请退款明细

    // 水站接口
    sitewxinfo: `${host}/site/wx/info`,                             //设置微信用户信息
    loginUrl:`${host}/site/wx/login`,                              //用户登录
    logOutUrl:`${host}/site/wx/logout`,                            //退出登录
    siteUserInfo:`${host}/site/my.index/index`,                    //水站用户信息及水站信息
    addrUrl:`${host}/site/my.index/addr_save`,                     //修改地址提交
    acategoryListUrl:`${host}/site/mall.product/category_list`,    //获取商品分类
    productUrl:`${host}/site/mall.product/page`,                   //获取所有商品列表
    productDetailUrl:`${host}/site/mall.product/info`,             //获取商品详情
    shopCarUrl:`${host}/site/mall.cart/index`,                     //查看购物车
    addCarUrl:`${host}/site/mall.cart/add`,                        //加入购物车，更新数量
    delCarUrl:`${host}/site/mall.cart/del`,                        //删除购物车商品
    subCarUrl:`${host}/site/mall.cart/submit`,                     //提交购物车
    buyUrl:`${host}/site/mall.cart/direct_buy`,                    //直接购买商品
    orderUrl:`${host}/site/mall.order/index`,                      //查看提交订单
    subOrderUrl:`${host}/site/mall.order/submit`,                  //提交订单
    ckOrderStatusUrl:`${host}/site/mall.order/status`,             //查看支付订单是否成功
    myOrderIndex:`${host}/site/my.order/index`,                    //分页获取采购单
    myOrderInfo:`${host}/site/my.order/info`,                      //查看订单详情
    myOrderCancel:`${host}/site/my.order/cancel`,                  //订单取消
    myOrderReceive:`${host}/site/my.order/receive`,                //订单确认收货
    myOrderGetPay:`${host}/site/my.order/get_pay`,                 //获取订单支付参数
    myBillIndex:`${host}/site/my.index/bills`,                     //获取资金记录
    deositIndex:`${host}/site/my.deposit/index`,                   //获取押金
    deositPages:`${host}/site/my.deposit/page`,                     //获取押金记录
    deositInfo:`${host}/site/my.deposit/info`,                      //获取押金记录详情
    myMorder:`${host}/site/my.morder/index`,                         //用户订单
    myMorderInfo:`${host}/site/my.morder/info`,                      //用户订单详情
    myMorderAcceptOrder:`${host}/site/my.morder/accept_order`,        //接单.拒单
    myMorderNotarize:`${host}/site/my.morder/notarize_delivery`,      //确认送达
    myMorderBucketback:`${host}/site/my.morder/bucketback`,            //回桶
    myMorderBucketbackTj:`${host}/site/my.morder/bucketback_tj`,       //回桶提交
    myMorderPayQr:`${host}/site/my.morder/pay_qr`,                     //二维码
    bucketDeduct:`${host}/site/my.index/bucket_deduct`,               //可抵扣桶数
    bucketRecycle:`${host}/site/my.index/bucket_recycle`,             //待平台回收桶
    bucketIndex:`${host}/site/mall.bucket/index`,                     //查看回桶订单
    bucketSubmit:`${host}/site/mall.bucket/submit`,                   //提交回桶订单
    bucketStatus:`${host}/site/mall.bucket/status`,                   //查看回桶状态
    despositSorder:`${host}/site/my.deposit/sorder`,                  //查看退押金范围
    depositSave:`${host}/site/my.deposit/sorder_save`,                //提交退押金申请
    depositPage:`${host}/site/my.deposit/sorder_page`,                //分页获取退押金记录
    depositInfo:`${host}/site/my.deposit/sorder_info`,                //退押金记录详情
    depositCancel:`${host}/site/my.deposit/sorder_cancel`,            //取消申请
    productWholesale:`${host}/site/mall.product/cx_wholesale_price`,  //详情页商品阶梯价
    siteMorderSorder:`${host}/site/my.sorder/index`,                  //用户退桶订单列表
    siteMorderSorderInfo:`${host}/site/my.sorder/info`,               //用户退桶订单详情
    siteMorderSorderBucketback:`${host}/site/my.sorder/bucketback`,   //回桶详情
    siteMorderSorderBucketbackTj:`${host}/site/my.sorder/bucketback_tj`, //回桶提交
    siteBucketDeposit:`${host}/site/my.index/bucket_deposit`,          //代收押金桶
    siteUorderIndex:`${host}/site/mall.uorder/index`,                  //扫码落地页
    siteUorderSubmit:`${host}/site/mall.uorder/submit`,                 //提交订单
    siteUorderStatus:`${host}/site/mall.uorder/status`,                 //查看支付状态
    siteGetNum:`${host}/site/my.index/get_sign_num`,                    //水站首页的数量
    siteWithdrawal:`${host}/site/my.withdrawal/index`,                  //水站提现
    siteWithdrawalTxpassword:`${host}/site/my.withdrawal/set_txpassword`,//设置提现密码
    siteWithdrawalTj:`${host}/site/my.withdrawal/tj_save`,                //提现提交
    siteWithdrawalWlog:`${host}/site/my.withdrawal/wlog`,                 //提现申请列表
    siteWithdrawalWinfo:`${host}/site/my.withdrawal/winfo`,                //提现申请详情
    siteMyStaff:`${host}/site/my.staff/index`,                             //员工列表
    siteMyStaffEdit:`${host}/site/my.staff/edit`,                          //员工编辑页
    siteMyStaffSave:`${host}/site/my.staff/s_save`,                        //员工提交
    siteMyStaffDel:`${host}/site/my.staff/del`,                            //删除员工
    siteSetPassword:`${host}/site/my.index/set_password`,                  //重置登录密码
    siteDesignateStaff:`${host}/site/my.morder/designate_staff`,            //指派员工
    siteSorderStaff:`${host}/site/my.sorder/designate_staff`,               //指派员工
    // 员工接口
    staffMorder:`${host}/site/staff.morder/index`,                          //用户订单列表
    staffMorderInfo:`${host}/site/staff.morder/info`,                       //用户订单详情
    staffMorderDelivery:`${host}/site/staff.morder/notarize_delivery`,      //确认送达
    staffMorderBucketback:`${host}/site/staff.morder/bucketback`,           //回桶
    staffMorderTj:`${host}/site/staff.morder/bucketback_tj`,                //回桶提交
    staffMorderStatus:`${host}/site/staff.morder/get_bucketorder_status`,   //查看是否支付成功
    staffSorder:`${host}/site/staff.sorder/index`,                          //用户退押订单
    staffSorderInfo:`${host}/site/staff.sorder/info`,                       //用户退押
    staffSorderBucketback:`${host}/site/staff.sorder/bucketback`,           //回桶详情
    staffSorderTj:`${host}/site/staff.sorder/bucketback_tj`,                 //回桶提交
    staffGetSignNum:`${host}/site/staff.index/get_sign_num`,                 //订单数量标签
  };
  return config
};
module.exports = {
  configUrl: configUrl
}