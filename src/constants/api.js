export const HOME_DATA = '/mjWarehouseResourceController/queryResForPhone';

// 司机登录
export const CAR_LOGIN = '/driver/exclude/driverLogin';
// 承运商登录
export const SHIPPER_LOGIN = '/carrier/exclude/login';

export const ADD_ROUTER = '/carrierLineInfo/add';

// 获取验证码
export const GET_SMS_CODE = '/carrier/exclude/sendSms';

// 图形验证码
export const GET_IMG_CODE = '/carrier/exclude/getImg';

// 校验验证码
export const CHECK_SMG_CODE = '/carrier/exclude/checkPhone';

// 注册
export const USER_REGISTER = '/carrier/exclude/register';

export const OOS_CONFIG = '/oss/tst/exclude/getPolicy.shtml?p=';

// 修改承运商密码
export const UPDATE_PASSWORD = '/carrier/updatePassword';

// 承运商忘记密码
export const CARRIER_FORGET_PASSWORD = '/carrier/exclude/forgetPassword'

// 全国城市列表
export const CITY_COUNTRY = '/regionArea/exclude/query';

// 添加车辆
export const SAVE_CAR_INFO = '/carInfo/saveCarInfo';

// 添加司机
export const SAVE_DRIVER_INFO = '/driver/saveDriverInfo';

//删除司机
export const DELETE_DRIVER_INFO = '/driver/deleteDriverInfo';

// 车辆管理列表、车辆绑定司机列表
export const QUERY_CAR_LIST = '/carInfo/queryCarInfoList';

//删除车辆
export const DELETE_CAR = '/carInfo/deleteCarInfo';

// 解绑司机
export const UNBIND_DRIVER = '/carInfo/unbindDriver';

// 绑定司机
export const BIND_DRIVER = '/carInfo/bindDriver';

// 司机列表
export const DRIVER_LIST = '/driver/queryDriverInfoList';

//获取车辆信息详情
export const GET_CAR_INFO = '/carInfo/getCarInfo';

//更新车辆信息
export const EDIT_CAR_INFO = '/carInfo/updateCarInfo';

//申请认证车辆信息
export const CERTIFICATION_CAR_INFO = '/carInfo/certificationCarInfo';

//路线列表
export const ROUTE_LIST = '/carrierLineInfo/list';

//编辑路线
export const EDIT_ROUTE = '/carrierLineInfo/update';

//删除路线
export const DELETE_ROUTE = '/carrierLineInfo/delete';

// 系统公告
export const SYSTEM_MESSAGE = '/note/queryNoteList';

// 系统公告详情
export const SYSTEM_MSG_DETAIL = '/note/getNoteInfo';

// 更新系统公告（已读未读）
export const SYSTEM_READ_ORNOT = '/note/updateNoteInfo';

// 更新站内信
export const UPDATE_WEB_MSG = '/message/updateMessageInfo';

// 站内信
export const STACK_MSG_LIST = '/message/queryMessageList';

// 站内信详情
export const STACK_MSG_DETAIL = '/message/getMessageInfo';

//承运商详情
export const GET_AUTHINFO_DETAIL = '/carrier/query';

//获取反馈列表
export const GET_FEEDBACK_LIST = '/problem/queryFeedList';

//获取问题列表
export const GET_PROBLEM_LIST = '/problem/queryProblemList';

//查询单个问题详情
export const GET_PROBLEM_DETAILS = '/problem/queryProblem';

//查询单个反馈详情
export const GET_FEEDBACK_DETAILS = '/problem/queryFeedBack';

//反馈
export const ADD_FEEDBACK = '/problem/saveFeedBack';

// 公司认证
export const ADD_COMPANY_AUTH = '/carrier/certification';

//获取电子签章图片
export const GET_ESIGN_IMAGE = '/esign/exclude/getSealImage';

//获取电子签章信息
export const GET_ESIGN_INFO = '/esign/getEsignInfo';

//编辑电子签章信息
export const EDIT_ESIGN_INFO = '/esign/updateEsignInfo';

//获取承运合同列表
export const GET_CARRIR_BARGAIN_LIST = '/orderApp/companyContract';

// 货源列表
export const GOODS_SOURCE_LIST = '/resourceApp/getResourceList';

// 货源详情
export const RESOURCE_DETAIL = '/resourceApp/getResourceDetail';

// 承运商订单列表
export const GET_COMPANY_ORDER_LIST = '/orderApp/getCompanyOrder';

// 获取待确认（派单中）的承运单
export const ENTRUST_ORDER_UNCONFIRMED = '/orderApp/getGoodsByCompanyId';

// 获取待调度的承运单
export const ENTRUST_ORDER_UNDISPATCH = '/orderApp/getGoodsWithDispatch';

// 承运单详情
export const ENTRUST_ORDER_DETAIL = '/orderApp/getDispatchDetail'

// 确认交付
export const CONFIRM_DELIVERY = '/orderApp/confirmDeliver'

// 申请协调
export const APPLY_COORDINATION = '/orderApp/companyAssort'


// 承运商接受派单
export const ACCEPT_DISPATCH = '/orderApp/acceptDispatch';

//保存联系人信息
export const SAVE_CONTACT_MESSAGE = '/contect/exclude/saveContactInfo';

// 我的行程
export const TRAVEL_ONOFCAR = '/orderApp/companyTripCar';


// 承运商调度车辆
export const DISPATCH_CAR = '/orderApp/dispatchCar';

// 确认承运
export const TRANSPORT_CONFIRM = '/orderApp/confirmLoading';

//查询司机所属承运商列表
export const CARRIER_INFO_LIST = '/carrier/queryCarrierInfoList';


//承运商抢单 报价
export const ROB_GOODS = '/orderApp/robGoods';

//承运商竞价 报价
export const BIDDING_GOODS = '/orderApp/biddingGoods';

// 承运商抢单（报价）列表
export const BIDDING_LIST = '/orderApp/getBiddingByCompanyId';

// 承运商详细信息
export const CARRIER_DETAIL_INFO = '/carrier/query';

// 司机详细信息
export const CAR_DETAIL_INFO = '/driver/queryDriverInfo';

// 订单详情
export const GET_ORDER_DETAIL = '/orderApp/getOrderDetail'

// 抢单详情
export const GET_BIDDING_DETAIL = '/orderApp/getBiddingDetail'

// 确认承运所需的货源信息 (货源详情)
export const CONFIRM_TRANSPORT_DETAIL = '/orderApp/getShuntingDetail'

// 上传出库单
export const UPLOAD_BILL_OUT_IMAGE = '/orderApp/uploadbillOutImg'

// 确认装货
export const CONFIRM_INSTALL = '/orderApp/confirmShipment'


// 合同路径
export const GET_CONTRACT_PATH = '/orderApp/viewContract'

// 确认到达
export const CONFIRM_ARRIVEL = '/orderApp/confirmArrive'

// 申请结算
export const APPLY_CLEAR = '/orderApp/balance'

//修改司机密码
export const UPDATE_DRIVER_PASSWORD = '/driver/updatePassword'

//司机忘记密码
export const DRIVER_FORGET_PASSWORD = '/driver/exclude/forgetPassword'

// 承运方确认结算
export const CLEAR_CONFIRM = '/orderApp/confirmBalance'

// 结算详情
export const CLEAR_DETAIL = '/orderApp/balanceDetail'

// 协调结果
export const COORDINATE_RESULT = '/orderApp/assortResult'

//根据驾驶证号查询司机
export const  SELECT_DRIVER_INFO = '/driver/queryDriverInfoByDriverNumber'

//根据手机号码查询司机
export const  SELECT_DRIVER_INFO_BY_PHONE = '/driver/queryDriverInfoByPhone'

// 下载APP二维码
export const API_DOWNLOAD_APP = '/img/carrier_qr_code.png';

//发票说明
export const SETTLEMENT_EXPLAIN  = '/settlement_explain.html'

//注册协议
export const REGISTER_PROTOCOL  = '/registration_protocol.html'

//关于我们
export const ABOUT_US  = '/about_us.html'

//添加银行卡信息
export const ADD_BANK_CARD_INFO = '/bankCard/saveBankCard';

//查询银行卡列表
export const QUERY_BANK_CARD_LIST = '/bankCard/queryListBankCard';

//删除银行卡信息
export const DELETE_BANK_CARD = '/bankCard/deleteBankCard';

//查询银行卡信息
export const QUERY_BANK_CARD_BY_ID = '/bankCard/queryBankCard';

//编辑银行卡信息
export const EDIT_BANK_CARD_INFO = '/bankCard/updateBankCard';

// H5游戏链接
export const GAME_ADDRESS = '/orderApp/getH5GameUrl';


// 删除待调度且已取消的订单
export const DELETE_ORDER_UNDISPATCH = '/orderApp/delDispatch'

export const ORDER_RESOURCE_STATE = '/orderApp/getResourceState'
