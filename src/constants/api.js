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

//修改挂车车辆信息
export const UPDATE_GCAR = '/carInfo/updateGInfo';

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
export const GOODS_SOURCE_LIST = '/app/goods/queryGoodsList';

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

// 催款
export const APPLY_CLEAR = '/orderApp/pressMoney'

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

export const ORDER_RESOURCE_STATE = '/orderApp/getResourceState';

//保存司机切换的承运商
export const SAVE_CHANGE_CARRIER = '/driver/switchCarrierRecord';


// 线路货源顶部广告
export const INSITE_NOTICE = '/siteNote/querySiteNoteList'


// 收集log
export const API_COLLECT_LOG = 'app/log/log'

/************************************************** 司机APP 接口 *************************************************/
import { XYT_HOST, WEB_SOCKET} from './setting';

/************************ 认证部分 接口 ************************/

/************  司机认证部分 接口 ************/

// 身份证正面
export const API_GET_IDCARD_INFO = `${XYT_HOST}app/photo/idCard/faceSide`;

// 身份证反面
export const API_GET_IDCARD_TRUN_INFO = `${XYT_HOST}app/photo/idCard/backSide`;

// 驾驶证主页
export const API_GET_DRIVER_INFO = `${XYT_HOST}app/photo/drivingLicense/homepage`;

// 驾驶证副页
export const API_GET_DRIVER_TRUN_INFO = `${XYT_HOST}app/photo/drivingLicense/vicePage`;

// 手持身份证
export const API_GET_HAND_PIC_INFO = `${XYT_HOST}app/photo/idCard/handle`;

// 司机认证确认提交接口
export const API_AUTH_REALNAME_COMMIT = `${XYT_HOST}app/rmc/driver/addDriver`;

// 司机认证详情接口
export const API_AUTH_REALNAME_DETAIL = `${XYT_HOST}app/rmc/driver/queryDriverInfo/`;


/************  个人车主认证部分 接口 ************/

// 行驶证主页
export const API_GET_TRAVEL_INFO = `${XYT_HOST}app/photo/vehicleLicense/homepage`;

// 行驶证副页
export const API_GET_TRAVEL_TRUN_INFO = `${XYT_HOST}app/photo/vehicleLicense/vicePage`;

// 个人、企业车主认证
export const API_COMPANY_CERTIFICATION = `${XYT_HOST}app/rmc/company/appInsertCertificationInfo`;

// 上传营业执照
export const API_GET_BUSINESS_LICENSE = `${XYT_HOST}app/photo/businessLicense`;

// 根据手机号查询伙伴信息
export const API_QUERY_COMPANY_INFO = `${XYT_HOST}app/rmc/company/queryCompanyInfoByBusTel`;
// 根据手机号查询司机信息
export const API_DRIVER_QUERY_DRIVER_INFO = `${XYT_HOST}app/rmc/driver/queryDriverInfo/`;

// 交强险
export const API_GET_SEND_QIANGXIAN_INFO = `${XYT_HOST}app/photo/insurance`;

// 车头照
export const API_GET_CAR_HEADER_INFO = `${XYT_HOST}app/photo/vehicle`;

// 车长载重接口
export const API_LENGTH_AND_WEIGHT_COMMIT = `${XYT_HOST}app/rmc/rmcCar/queryVehicleLengthAndWeight`;

// 车主增加车辆接口
export const API_AUTH_QUALIFICATIONS_COMMIT = `${XYT_HOST}app/rmc/rmcCar/createCertificationQualification`;

/********************************司机订单API*************************************/
// 订单列表（全部，待发运）分页查询调度单
export const API_NEW_DISPATCH_DOC_WITH_PAGE = 'app/transport/queryDeleveryWithPageV4';
// 订单列表（待回单）
export const API_NEW_GET_RECEIVE_ORDER_LIST = `app/transport/queryDelReceiptWithPageV4`;
// 运输中
export const API_NEW_GET_ORDER_LIST_TRANSPORT = `app/transport/queryTransportList`;

export const API_NEW_GET_GOODS_SOURCE = `app/transport/goodsSource`;
// 绑定GPS设备接口
export const API_BIND_OR_RELIEVE_GPS = `app/rmc/rmcCar/bindOrRelieveCarBarCode`;
// 获取gps设备信息
export const API_GET_GPS_DETAILS = `app/rmc/rmcCar/queryGpsInfoByCarNum`;
// 确认支付--现金
export const API_AC_COMFIRM_PAYMENT = `app/ac/confirmPayment`;
// 获取微信二维码
export const API_AC_GET_WECHAT_QRCODE = `app/ac/getWeChatQrCode`;
// 二维码支付
export const API_AC_QRCODE_PAYMENT = `app/ac/qrCodePayment/`;
// 根据单号获取结算金额
export const API_AC_GET_SETTLE_AMOUNT = `app/ac/getSettleAmount/`;
// 获取支付状态
export const API_AC_GET_SETTLE_STATE= `app/ac/queryStatusByOrderCode/`;
/********************************司机用户中心API*************************************/
//获取登录密钥
export const API_GET_SEC_TOKEN = 'app/uam/login/getSecToken';
// 通过密码登录
export const API_LOGIN_WITH_PSD = 'app/uam/login/loginWithPassword/v3.0';
// 获取登录验证码接口
export const API_GET_LOGIN_WITH_CODE = '/app/uam/message/getLoginIdentifyCode';
//登陆后绑定设备信息接口
export const API_BIND_DEVICE = `app/uam/login/bindDevice`;
// 天气接口
export const API_GET_WEATHER = `/app/weather/`;

export const API_LOGIN_WITH_CODE = '/app/uam/login/loginWithVerificationCode/v3.0';
// 修改密码
export const API_CHANGE_PSD_WITH_OLD_PSD = '/app/uam/login/modifyPassword';
// APP退出登录
export const API_USER_LOGOUT = 'app/user/logout/v3.0/';
// 根据司机id获取推送状态
export const API_NEW_GET_PUSHSTATUS_WITH_DRIVERID = 'app/uam/jpush/getPushStatusByUserId/';
// 更改状态
export const API_CHANGE_ACCEPT_MESSAGE = 'app/uam/jpush/setPushStatus';
// 注册获取短信验证码
export const API_UAM_REGISTER_IDENTIFY_CODE = `app/uam/register/identifyCode`;
// 用户注册接口
export const API_UAM_REGISTER = `app/uam/register`;
// 校验忘记密码的验证码是否正确
export const API_CHECK_IDENTIFY_CODE = `app/uam/message/checkForgetIdentifyCode`;
// 获取忘记密码验证码接口
export const API_GET_FORGET_PSD_CODE = `app/uam/message/getForgetIdentifyCode`;
// 根据验证码修改密码
export const API_NEW_CHANGE_PSD_WITH_CODE = `app/uam/login/forgetPassword`;

/********************************司机伙伴资源中心API*************************************/
// 根据手机号查询账号角色信息
export const API_INQUIRE_ACCOUNT_ROLE = 'app/rmc/company/queryAppRoleInfoByBusTel/';
/********************************司机调度中心 API*************************************/
// 取消接单
export const API_NEW_DRIVER_CANCEL_ORDER = 'app/dpc/driverAppCancelOrder';
// 接单--司机
export const API_NEW_DRIVER_RECEIVE_ORDER = 'app/dpc/driverAppReceiveOrder';
// 拒单--司机
export const API_NEW_DRIVER_REFUSE_ORDER = 'app/dpc/driverAppRefuseOrder';
// 根据时间获取获取货源列表--司机
export const API_NEW_GET_SOURCE_BY_DATE = 'app/dpc/queryDispatchDocByDateV2'; // 4.0版本--司机
/** ****************************司机运输中心接口**********************/
// 获取货源详情
/******************************司机APP资源中心接口**********************/
// 实名认证状态查询接口
export const API_AUTH_REALNAME_STATUS = 'app/rmc/auth/realName/status/';
// 资质认证详情接口
export const API_AUTH_QUALIFICATIONS_DETAIL = 'app/rmc/auth/qualifications/info';
// 资质认证状态查询接口
export const API_AUTH_QUALIFICATIONS_STATUS = 'app/rmc/auth/qualifications/status';
//根据司机手机号 查询伙伴下所有车辆列表
export const API_QUERY_CAR_LIST_BY_PHONE_NUM = 'app/rmc/driver/queryDriversByPhoneNum/';
// 司机管理-解绑绑定司机
export const API_DEL_DRIVER_COMPANION_RELATION = 'app/rmc/driver/delDriverCompanionRelation';
//通过手机号或司机名称
export const API_QUERY_DRIVERS_ALL = 'app/rmc/driver/queryDriversAll';
//通过手机号或司机名称
export const API_COMPANION_RELATION = 'app/rmc/driver/addDriverCompanionRelation';
//根据手机号查询
export const API_QUERY_CAR_INFO_BY_PHONE_NUM = 'app/rmc/rmcCar/queryCarInfoByCarNumForCompanion';
// 司机管理-绑定车辆
export const API_RMC_DRIVER_BINDING_CAR = 'app/rmc/driver/bindingCar';
//根据伙伴手机号 查询伙伴下所有车辆列表
export const API_QUERY_CAR_LIST_BY_COMPANIONINFO = 'app/rmc/rmcCar/queryCarListByCompanionInfo';
//车辆管理--绑定车辆与伙伴的关系&解除绑定车辆与伙伴的关系
export const API_BIND_RELIEVE_CAR_COMPANION = 'app/rmc/rmcCar/bindRelieveCarCompanionRelation';
// 车辆管理-绑定司机
export const API_BIND_CAR_DRIVER_RELATION = 'app/rmc/rmcCar/bindCarDriverRelation';
// 车辆管理--根据手机号查询司机
export const API_QUERY_DRIVERS_ALL_COMPANY = 'app/rmc/driver/queryDriversByCompanyPhone';
//根据车牌号搜索车辆信息返回
export const API_QUERY_CAR_INFO_BY_PHONE_NUM_DRIVER = 'app/rmc/rmcCar/queryCarInfoByCarNum';

//WebSocket
export const API_WEBSOCKET = `${WEB_SOCKET}webSocket/`;