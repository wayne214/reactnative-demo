
//登录
// export const LOGIN = 'http://192.168.26.99:8080//loginCtl/userLogin.shtml';
export const LOGIN = '/loginCtl/userLogin.shtml';

// 注册
// export const REGISTER = 'http://192.168.26.99:8080//register/registerUser.shtml';
export const REGISTER = '/register/registerUser.shtml';

//图形验证码
// export const API_IMAGE_VCODE = 'http://192.168.26.99:8080//captcha.jpg?suffix=';
export const API_IMAGE_VCODE = '/captcha.jpg?suffix=';

// 发送短信验证码
// export const API_SEND_SMS = 'http://192.168.26.99:8080//sms/send.shtml';
export const API_SEND_SMS = '/sms/send.shtml';

// 忘记登录密码 (拿短信验证码和新密码 设置登录密码）
export const API_RE_SET_LOGIN_PWD = '/register/retrievePWD.shtml';

// 修改登录密码 （拿旧密码 设置新密码）
export const API_MODIFY_LOGIN_PWD = '/userInfo/resetPassword.shtml';

//忘记密码时校验手机号是否已经注册
export const CHECK_PHONE = '/register/checkMobileIsUsed.shtml';




export const OOS_CONFIG = '/oss/tst/exclude/getPolicy.shtml?p=';

//公司认证
export const ADD_COMPANY_AUTH = '/goods/userCenter/CompanyCertification';

//公司驳回重新认证
export const RE_ADD_COMPANY_AUTH = '/goods/userCenter/reCompanyCertification';

//获取公司认证详情
export const GET_COMPANY_AUTH_DETAIL = '/goods/userCenter/queryCompanyAuth';

//获取公司印章图片
export const GET_COMPANY_ESIGN_IMAGE = '/goods/userCenter/exclude/getSealImageCompany';

//获取个人印章图片
export const GET_PERSON_ESIGN_IMAGE = '/goods/userCenter/exclude/getSealImagePerson';

//修改公司印章
export const UPDATE_COMPANY_ESIGN_INFO = '/goods/userCenter/upCompanyEsign';

//修改个人印章
export const UPDATE_PERSON_ESIGN_INFO = '/goods/userCenter/upPersonEsign';

//发布干线
export const PUBLISH_GROUD_LINE = '/goods/resourceInfo/publishTrunk';

//重新发布干线
export const AGAIN_PUBLISH_GROUD_LINE = '/goods/resourceInfo/updateTrunk';

//发布卡班
export const PUBLISH_ON_TIME = '/goods/resourceInfo/publishCabannes';

//获取卡班详情和发货日期列表
export const PUBLISH_ON_TIME_DETAIL = '/goods/resourceInfo/queryCabanneInfoDays';

//获取卡班路线
export const GET_ONTIME_ROUTE = '/goods/resourceInfo/queryCabanneInfoListAll';

//获取卡班出发时刻表
export const GET_ONTIME_TIME = '/goods/resourceInfo/queryCabanneInfoTime';

//获取卡班运费
export const GET_FREIGHT_MONEY = '/goods/resourceInfo/getCabannePrice';

//重新发布卡班
export const UPDATE_PUBLISH_ON_TIME = '/goods/resourceInfo/updateCabannes';

//消息列表
export const MESSAGE_LIST = '/goods/message/queryMymessage';

//消息详情
export const MESSAGE_DETAIL = '/goods/message/queryMymessageInfo';

//标记已读或删除
export const UPDATE_MESSAGE = '/goods/message/readOrDel';

// order
// 确定装货
export const CONFIRM_LOADING = 'goods/orders/confirmLoading';

// 货主申请结算
export const APPLY_CLEAR  = 'goods/orders/goodsOwnerBalance';

// 货主申请协调
export const APPLY_COORDINATION  = 'goods/orders/goodsOwnerConsult';

// 货主确认收货
export const RECEIVE_CONFIRM = 'goods/orders/goodsOwnerReceipt';

// 协调结果
export const COORDINATE_RESULT = 'goods/orders/goodsOwnerResult'

// 校验添加发票
export const CHECK_INVOICE = 'goods/orders/invoiceYes'

// 结算 信息
export const CLEAR_DETAIL = 'goods/orders/orderBatchPaymentResponse'

// 查询订单详情
export const GET_ORDER_DETAIL = 'goods/orders/toOrderDetail'

// 订单列表
export const ORDER_LIST = 'goods/orders/toOrderList'

// 上传装货清单
export const UPLOAD_BILL_GOODS_IMAGES = 'goods/orders/uploadGoodsImg'

// 撮合模式上传回单
export const UPLOAD_BILL_BACK_IMAGES = '/goods/orders/uploadGoodsImgByMatch'



//添加发票信息
export const ADD_INVOICE_INFO = '/goods/invoice/addInvoice'

//修改发票信息
export const UPDATE_INVOICE_INFO = '/goods/invoice/editInvoice'

//获取发票信息
export const GET_INVOICE_INFO = '/goods/invoice/getInvoice'

// 全国城市列表
export const CITY_COUNTRY = '/regionArea/exclude/query';

// 获取合同前缀
export const GET_CONTRACT_HEADER = 'goods/orders/viewContract'

export const GET_USER_INFO = '/goods/userCenter/queryMemberDetail';

export const GET_CONFIGNOR_LIST = '/goods/resourceInfo/resourceList';

export const CANCEL_GOODS_RESOURCE = '/goods/resourceInfo/cancleResource';

export const DEL_GOODS_RESOURCE = '/goods/resourceInfo/resourceDel';

export const GOODS_RESOURCE_DETAIL = '/goods/resourceInfo/resourceDetail';

export const SHIPPER_LIST_BYID = '/goods/resourceInfo/yqdShowResourceById';

export const AGRESS_SHIPPER_RESOURCE = '/goods/resourceInfo/checkCompany';

export const REFUSE_SHIPPER_RESOURCE = '/goods/resourceInfo/refuseCompany';

//提交个人认证
export const COMMIT_PERSON_AUTH = '/goods/userCenter/personCertification';

//查询个人认证信息
export const SELECT_PERSON_AUTH_INFO = '/goods/userCenter/queryPersonAuth';

//关于我们
export const ABOUT_US  = '/goods/about_us.html';

//注册协议
export const REGISTER_AGREEMENT = '/goods/registration_protocol.html';

//自营委托协议
export const ZIYING_AGREEMENT = '/goods/zy_tip.html';

//第三方委托协议
export const THIRD_TIP_AGREEMENT = '/goods/third_tip.html';

//找路线
export const FIND_ROUTE = '/goods/resourceInfo/getInvoice';

//个体重新认证
export const AGAIN_COMMIT_PERSON_AUTH = '/goods/userCenter/rePersonCertification';

// 是否配置发票信息
export const IS_INVOICE_CONFIG = '/goods/orders/invoiceYes'

export const H5_GAME_ADDRESS = '/goods/userCenter/getH5GameUrl'

// 申请开发票
export const REQUEST_INVOICE = '/goods/orders/orderInvoice'