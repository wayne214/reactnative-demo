export const HOME_DATA = '/mjWarehouseResourceController/queryResForPhone';

// 司机登录
export const CAR_LOGIN = '/driver/exclude/driverLogin';
// 承运商登录
export const SHIPPER_LOGIN = '/carrier/exclude/login';
// 新增常用路线
export const ADD_ROUTER = '/app/transportLine/addTransportLine';

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
export const QUERY_CAR_LIST = '/app/carrier/queryCarrierCarList';

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
export const ROUTE_LIST = '/app/transportLine/queryTransportLineList';

//编辑路线
export const EDIT_ROUTE = '/app/transportLine/editTransportLineInfo';

//删除路线
export const DELETE_ROUTE = '/app/transportLine/deleteTransportLineList';

// 系统公告
export const SYSTEM_MESSAGE = '/app/note/queryNoteList';

// 系统公告详情
export const SYSTEM_MSG_DETAIL = 'app/note/noteInfoDetail';

// 更新系统公告（已读未读）
export const SYSTEM_READ_ORNOT = '/app/note/updateNoteInfo';

// 更新站内信
export const UPDATE_WEB_MSG = '/app/message/readMessage';

// 站内信
export const STACK_MSG_LIST = '/app/message/queryMessageList';

// 站内信详情
export const STACK_MSG_DETAIL = '/app/message/getMessageInfo';

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
export const GET_ESIGN_INFO = '/app/esign/queryEsignByCarrierId';

//编辑电子签章信息
export const EDIT_ESIGN_INFO = '/app/esign/registerPersonEsignByCarrierId';

//获取承运合同列表
export const GET_CARRIR_BARGAIN_LIST = '/orderApp/companyContract';

// 货源列表
export const GOODS_SOURCE_LIST = '/app/goods/queryGoodsList';

// 货源详情
export const RESOURCE_DETAIL = '/app/goods/getGoodsInfo/';

// 承运商订单列表
export const GET_COMPANY_ORDER_LIST = '/orderApp/getCompanyOrder';

// 获取待确认（派单中）的承运单
export const ENTRUST_ORDER_UNCONFIRMED = '/app/myTransport/queryMyTransportList';

// 获取待调度的承运单
export const ENTRUST_ORDER_UNDISPATCH = '/app/myTransport/queryDispatchDocWithCarrier';

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
export const DISPATCH_CAR = '/app/goods/dispatchCar';

export const RE_DISPATCH_CAR = '/app/goods/redispatchCar';

// 确认承运
export const TRANSPORT_CONFIRM = '/orderApp/confirmLoading';

//查询司机所属承运商列表
export const CARRIER_INFO_LIST = '/carrier/queryCarrierInfoList';


//承运商抢单 报价
export const ROB_GOODS = '/orderApp/robGoods';

//承运商竞价 报价
export const BIDDING_GOODS = '/orderApp/biddingGoods';
// 抢单
export const BIDORDER = '/app/carrier/bidOrder';

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
import {WEB_SOCKET} from './setting';
/************************ 认证部分 接口 ************************/

/************  司机认证部分 接口 ************/

// 身份证正面
export const API_GET_IDCARD_INFO = `app/photo/idCard/faceSide`;

// 身份证反面
export const API_GET_IDCARD_TRUN_INFO = `app/photo/idCard/backSide`;

// 驾驶证主页
export const API_GET_DRIVER_INFO = `app/photo/drivingLicense/homepage`;

// 驾驶证副页
export const API_GET_DRIVER_TRUN_INFO = `app/photo/drivingLicense/vicePage`;

// 手持身份证
export const API_GET_HAND_PIC_INFO = `app/photo/idCard/handle`;

// 司机认证确认提交接口
export const API_AUTH_REALNAME_COMMIT = `app/rmc/driver/addDriver`;

// 司机认证详情接口
export const API_AUTH_REALNAME_DETAIL = `app/rmc/driver/queryDriverInfo/`;


/************  个人车主认证部分 接口 ************/

// 行驶证主页
export const API_GET_TRAVEL_INFO = `app/photo/vehicleLicense/homepage`;

// 行驶证副页
export const API_GET_TRAVEL_TRUN_INFO = `app/photo/vehicleLicense/vicePage`;

// 个人、企业车主认证
export const API_COMPANY_CERTIFICATION = `app/rmc/company/appInsertCertificationInfo`;

// 上传营业执照
export const API_GET_BUSINESS_LICENSE = `app/photo/businessLicense`;

// 根据手机号查询伙伴信息
export const API_QUERY_COMPANY_INFO = `app/rmc/company/queryCompanyInfoByBusTel`;
// 根据手机号查询司机信息
export const API_DRIVER_QUERY_DRIVER_INFO = `app/rmc/driver/queryDriverInfo/`;

// 交强险
export const API_GET_SEND_QIANGXIAN_INFO = `app/photo/insurance`;

// 车头照
export const API_GET_CAR_HEADER_INFO = `app/photo/vehicle`;

// 车长载重接口
export const API_LENGTH_AND_WEIGHT_COMMIT = `app/rmc/rmcCar/queryVehicleLengthAndWeight`;

// 车主增加车辆接口
export const API_AUTH_QUALIFICATIONS_COMMIT = `app/rmc/rmcCar/createCertificationQualification`;

/********************************司机订单API*************************************/
// 订单列表（全部）分页查询调度单
export const API_QUERY_DRIVER_ORDER_ALL = 'app/driverTransportOrder/queryDriverOrderAll';
// 订单列表（待发运）分页查询调度单
export const API_QUERY_DRIVER_ORDER_SHIPPING = 'app/driverTransportOrder/queryDriverOrderShipping';
// 订单列表（待回单）
export const API_QUERY_DRIVER_ORDER_RECEIPT = 'app/driverTransportOrder/queryDriverOrderReceipt';
// 订单列表（待签收）
export const API_QUERY_DRIVER_ORDER_SIGN= `app/driverTransportOrder/queryDriverOrderSign`;
// 订单详情
export const API_NEW_GET_GOODS_SOURCE = `app/transport/goodsSource`;
// 撮合订单详情
export const API_GET_GOODS_SOURCE_INFO = `app/driverTransportOrder/goodsSourceInfo`;
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
// 签收接口
export const API_NEW_SIGN = 'app/transport/sign';
// 撮合签收接口
export const API_MATCH_SIGN = 'app/driverTransportOrder/matchSign';
// 批量签收
export const API_TRANSPORT_BATCH_SIGN = 'app/transport/batchSign/v3.0';
// 回单接口
export const API_NEW_UPLOAD_RECEIPT = `app/transport/returnTransportOrder/v2.1`;
// 撮合回单接口
export const API_MATCH_UPLOAD_RECEIPT = `app/driverTransportOrder/matchInfoReceipt`;
// 批量回单接口
export const API_BATCH_UPLOAD_RECEIPT = `app/transport/batchUploadTransportOrder`;
// 获取上传回单照片数量接口
export const API_GET_UPLOAD_RECEIPT_IMAGE = `app/transport/getReceiptPicNumber`;
// 上传回单完成接口
export const API_UPLOAD_RECEIPT_IMAGE_FINISHED = `app/transport/batchUploadTransportOrderSuccess`;
// 回单照片展示接口
export const API_ORDER_PICTURE_SHOW = `app/transport/pictureList`;
// 撮合回单照片展示接口
export const API_QUERY_RECEIPT_PICTURE = `app/receiveMatch/queryReceivePic/`;
// 发运接口
export const API_NEW_DESPATCH = `app/transport/despatch`;
// 撮合订单发运接口
export const API_MATCH_DESPATCH = `app/driverTransportOrder/matchDespatch`;
// 上传出库单
export const API_UPLOAD_OUT_BOUND_ORDER = 'app/transport/uploadOutBoundOrder';

// 上传道路异常查询调度单
export const API_NEW_UPLOAD_DISPATCH_ORDER = `app/transport/finExceprionInfoByPlateNum`;
// 上传道路异常保存异常信息
export const API_NEW_UPLOAD_SAVE_EXCEPTIONINFO= `app/transport/saveExceptionInfo/`;

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

// 查询头像接口
export const API_QUERY_USER_AVATAR = `app/uam/queryUserAvatar`;
// 更换头像接口
// export const API_CHANGE_USER_AVATAR = `${HOST}app/uam/changeUserAvatar`;
export const API_CHANGE_USER_AVATAR = `app/uam/changeUserAvatarNew`;

// 道路异常-上传图片附件
export const API_UPLOAD_FILE = 'app/uam/uploadFile';
// 道路异常-上传视频附件
export const API_UPLOAD_VIDEO_FILE = `app/uam/uploadVideoFile`;


// 校验本月是否能够修改手机号接口
export const API_CHECK_IS_FIX_PHONE = 'app/uam/checkIsFixPhone/';
// 修改手机号判断登录密码是否正确
export const API_CHECK_PASSWORD = 'app/uam/checkPassword';
// 修改手机号发送短信验证码接口
export const API_FIX_PHONE_SEND_VERIFICATION = 'app/uam/fixPhoneSendVerification';
// 修改手机号判断是否已经注册接口 （true：已注册 false：未注册）
export const API_CHECK_PHONE_REGISTER = 'app/uam/checkPhoneRegister/';
// 修改手机号
export const API_MODIFY_USER_MOBILE_PHONE = 'app/uam/modifyUserMobile';

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
// 首页-状态数量统计
export const API_INDEX_STATUS_NUM = `app/dpc/queryIndexStatusNum`;
// 车主首页-状态数量统计
export const API_CARRIER_INDEX_STATUS_NUM = `app/dpc/queryCarrierDispatchCount`;

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
// 车主增加车辆发送验证码
export const API_CAR_OWNER_ADD_CAR_CODE = 'app/sendMsg/sendCarrierBindingCarSms';
// 车主开通司机账号
export const API_OPEN_DRIVER_ACCOUNT = 'app/carrier/openDriverAccount';

//WebSocket
export const API_WEBSOCKET = `${WEB_SOCKET}webSocket/`;
/** *****************************************************限行接口******************************************************/
// 限号接口
export const API_VEHICLE_LIMIT = `app/vehicleLimit/`;
// 版本比较接口
export const API_COMPARE_VERSION = `app/version/`
// 查询绑定的车辆信息
export const API_QUERY_ALL_BIND_CAR_BY_PHONE = `app/rmc/rmcCar/queryAllBindCarByPhone/v2.1.0`;
// 用户绑定车辆
export const API_SET_USER_CAR = `app/uam/addUserCar`;
//司机对应企业性质
export const API_QUERY_ENTERPRISE_NATURE = `app/rmc/queryEnterpriseNature/`;

/** ********************承运方运单接口******************************/
// 承运方--全部列表
export const API_CARRIER_QUERY_TRANSPORTORDERALL = `app/myTransport/queryTransportOrderAll`;
// 承运方--装车列表
export const API_CARRIER_QUERY_TRANSPORT_ORDER_LOADING = `app/myTransport/queryTransportOrderLoading`;
// 承运方--交付列表
export const API_CARRIER_QUERY_TRANSPORT_ORDER_PAY = `app/myTransport/queryTransportOrderPay`;
// 承运方--已完成列表
export const API_CARRIER_QUERY_TRANSPORT_ORDER_FINISH = `app/myTransport/queryTransportOrderFinish`;
// 承运方--运单详情
export const API_CARRIER_QUERY_TRANSPORT_ORDER_INFO = `app/myTransport/queryTransportOrderInfo`;

/** ********************电子签章******************/
//更新个人车主电子签章信息
export const UPDATE_PERSON_ESIGN_INFO = '/app/esign/updatePersonEsignByCarrierId';
//更新企业车主电子签章信息
export const UPDATE_COMPANY_ESIGN_INFO = '/app/esign/updateCarrierEsignByCarrierId';
// 新增企业车主电子签章
export const NEW_COMPANY_ESIGN_INFO = '/app/esign/registerCarrierEsignByCarrierId';

/** ********************单子信息******************/
// 查询出库单
export const API_QUERY_OUT_ORDER_IMG = 'app/transportInfo/queryOutOrderImg';
// 查询提货单
export const API_QUERY_RESOURCE_ATTACHMENTINFO = 'app/attachmentRestController/queryResourceAttachmentInfo';


// 订单调车车辆司机列表
export const API_QUERY_DRIVER_BID_CAR_LIST = 'app/goods/queryDriverBidCar';

// 承运商上传回执单接口
export const API_NEW_UPLOAD_CTC_ORDER_MATCH = `app/receiveMatch/uploadCtcOrderMatch`;

// 身份证校验接口
export const API_IDCARD_VALIDATE = 'app/IdCardValidate/validate?';

/** ********************行程信息******************/
// 行程车辆列表
export const API_CARRIERS_TRIP_LIST = 'app/transportInfo/carriersTripList';
// 运输轨迹列表
export const API_QUERY_TRANSPORT_LIST = 'app/transportInfo/queryTransportList/';

// 全国城市列表
export const CITY_COUNTRY_JSON = 'app/carrier/showAreaTree';