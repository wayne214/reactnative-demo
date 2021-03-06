import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addNavigationHelpers, StackNavigator} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator'
import * as RouteType from '../constants/routeType'


import SplashScreen from '../containers/app/splash'
import WelcomeScreen from '../containers/app/welcome'
import LoginScreen from '../containers/user/shipperLogin'

import MainScreen from '../containers/app/main'
import GoodsListContainer from '../containers/routes/goodsList';
import TravelContainer from '../containers/travel/travel';
import OrderContainer from '../containers/order/order';
import EntrustOrderContainer from '../containers/entrust/entrustOrder';
import SettingScreen from '../containers/user/setting';
import AgreementScreen from '../containers/user/agreement'

import HelpScreen from '../containers/user/help';
import HelpDetailScreen from '../containers/user/helpDetail';
import HelpDetailForFeedbackScreen from '../containers/user/helpDetailForFeedback';
import AddFeedbackScreen from '../containers/user/addFeedback';
import CompanyListScreen from '../containers/user/companyList';
import DriverManagerScreen from '../containers/user/driverManager';
import DriverInfoDetailScreen from '../containers/user/driverInfoDetail';
import AddDriverScreen from '../containers/user/addDriver';
import CarLoginScreen from '../containers/user/carLogin';
import RegisterScreen from '../containers/user/register';
import RegisterPwdScreen from '../containers/user/registerPwd';
import BargainScreen from '../containers/user/bargain';
import ShowESignImageScreen from '../containers/user/showESignImage';
import ShowESignInfoScreen from '../containers/user/showESignInfo';
import CarListScreen from '../containers/car/carList'
import MessageScreen from '../containers/message/message';
import MessageDetailScreen from '../containers/message/messageDetail'
import CarManageScreen from '../containers/user/car';
import AddCarScreen from '../containers/car/addCar';
import CarDetailScreen from '../containers/car/carDetail';
import EditCarScreen from '../containers/car/editCar';
import AuthInfoScreen from '../containers/user/authInfo';
import CardBankManageScreen from '../containers/user/bankCardManage';
import AddCardBankScreen from '../containers/user/addBankCard';
import CarBindDriverScreen from '../containers/car/carBindDriver';
import SelectDriverScreen from '../containers/car/selectDriver';

import GameScreen from '../containers/user/game'
import MyRouteScreen from '../containers/user/route';
import AddRouteScreen from '../containers/user/addRoute';
import EditRouteScreen from '../containers/user/editRoute';
import AuthRoleScreen from '../containers/user/authRole';
import CompanyAuthScreen from '../containers/user/companyAuth';
import PersonalAuthScreen from '../containers/user/personalAuth';
import PersonalAuthInfoScreen from '../containers/user/personalAuthInfo';
import UserInfoScreen from '../containers/user/userInfo';
import PwdStepOneScreen from '../containers/user/pwdStepOne';
import PwdStepTwoScreen from '../containers/user/pwdStepTwo';
import CustomServiceScreen from '../containers/user/customService';
import MessageSYSDetail from '../containers/message/messageSYSDetail'


// 货源列表
import GoodsListScreen from '../containers/routes/goodsList.js'
import PreOrderScreen from '../containers/routes/preOrder.js'
import RuleInstructionScreen from '../containers/routes/ruleInstruction.js'
import SearchGoodsScreen from '../containers/routes/searchGoods.js'
import BiddingListScreen from '../containers/routes/biddingList.js'
import GoodListDetail from '../containers/routes/goodListDetail.js'
import DispatchCarScreen from '../containers/order/dispatchCar.js'
import TransportConfirmScreen from '../containers/entrust/transportConfirm.js'
import EntrustOrderDetailScreen from '../containers/entrust/entrustOrderDetail.js'
import OrderDetailScreen from '../containers/order/orderDetail.js'
import LadingBillScreen from '../containers/order/ladingBill.js'
import UploadImageScreen from '../containers/order/uploadImages.js'
import ContractDetailScreen from '../containers/order/contractDetail.js'
import ConfirmDeliveryScreen from '../containers/order/confirmDelivery.js'
import BillDetailScreen from '../containers/order/billDetail.js'
import ApplyCoordinationScreen from '../containers/order/applyCoordination.js'



// 首页
import HomeScreen from '../containers/home/home';
import TakePhotoScreen from '../containers/home/takePhoto';
import TakePhotoFinishedScreen from '../containers/home/takePhotoFinished';
import UploadAbnormalScreen from '../containers/home/uploadAbnormal';

// 司机货源
import DriverGoodSourceScreen from '../containers/driverGoodSource/driverGoods';
import EntryGoodsDetailScreen from '../containers/driverGoodSource/entryGoodsDetail';


// 司机订单
import DriverOrderScreen from '../containers/driverOrder/driverOrder';
import EntryToBeShippedScreen from '../containers/driverOrder/entryToBeShipped';
import EntryToBeSignInScreen from '../containers/driverOrder/entryToBeSignin';
import ScanGPSScreen from '../containers/driverOrder/scanGPS';
import BindGPSScreen from '../containers/driverOrder/bindGPS';
import GPSDetailScreen from '../containers/driverOrder/gpsDetails';
import UploadODOScreen from '../containers/driverOrder/uploadODO';
import PayTypesScreen from '../containers/driverOrder/payTypes';
import WeChatPaymentScreen from '../containers/driverOrder/weChatPayment';
import SignInScreen from '../containers/driverOrder/signPage';
import SignSuccessScreen from '../containers/driverOrder/signSuccess';
import ReceiptSuccessScreen from '../containers/driverOrder/receiptSuccess';
import UploadReceiptScreen from '../containers/driverOrder/uploadReceipt';
import BatchUploadReceiptScreen from '../containers/driverOrder/batchUploadReceipt';
import BaiduMapScreen from '../containers/map/baiduMap';
import PhotoShowScreen from '../containers/driverOrder/imageViewer';
import ReceiptPhotoScreen from '../containers/driverOrder/receiptPhoto';

// 我的页面---承运商和司机公用
import MineScreen from '../containers/mine/mine';
import LoginForgetPWD from '../containers/login/forgetPwd';
import LoginForgetPWDTwo from '../containers/login/forgetPwdStepTwo';
import RegisterStepOne from '../containers/register/registerStepOne';

// 账号密码登录页
import LoginWithPwdScreen from '../containers/login/login';
import LoginWithSmsScreen from '../containers/login/loginSms';
import ModifyPwdScreen from '../containers/mine/modifyPassword';
import AboutUsScreen from '../containers/mine/aboutUs';
import DriverSettingScreen from '../containers/mine/setting';

// 认证
import DriverVerified from '../containers/driverVerified/driverVerified';
import DriverVerifiedDetail from '../containers/driverVerified/verifiedState';
import TakeCamera from '../containers/driverVerified/takeCamera';
import TakeCameraEnd from '../containers/driverVerified/takeCameraEnd';
import PersonCarOwnerAuth from '../containers/driverVerified/personCarOwnerAuth';
import CompanyCarOwnerAuth from '../containers/driverVerified/companyCarOwnerAuth';
import TakeCameraVertical from '../containers/driverVerified/takeCameraVertical';
import TakeCameraVerticalEnd from '../containers/driverVerified/takeCameraVerticalEnd';
import EnterpriseownerVerifiedState from '../containers/driverVerified/ownerVerified/enterpriseownerVerifiedState';
import PersonownerVerified from '../containers/driverVerified/ownerVerified/personownerVerifiedState';
import ShowBigImagePage from '../containers/driverVerified/verifiedShowBigImage';
import CarOwnerAddCar from '../containers/driverVerified/carOwnerAddCar';
import CarOwnerAddCarDetail from '../containers/driverVerified/carOwnerAddCarDetail';
import CarOwnerAddDriver from '../containers/driverVerified/carOwnerAddDriver';
import CarOwnerAddDriverDetail from '../containers/driverVerified/carOwnerAddDriverDetail';
import CarOwnerVerifiedMsgCode from '../containers/driverVerified/carOwnerVerifiedMsgCode';
import CarOwnerAddCarTwo from '../containers/driverVerified/carOwnerAddCarTwo';
import CarOwnerAddCarThree from '../containers/driverVerified/carOwnerAddCarThree';
import CarOwnerCreatDriver from '../containers/driverVerified/carOwnerCreatDriver';


// 选择车辆
import ChooseCarScreen from '../containers/mine/chooseCar';
import PersonInfoScreen from '../containers/mine/personInfo';
import CarInfoScreen from '../containers/mine/carInfo';
import CarDisableScreen from '../containers/mine/carDisablePage';
import ForgetPwdStepTwo from "../containers/login/forgetPwdStepTwo";
import DevicesBingScreen from '../containers/mine/devicesBind';
import CheckPhone from '../containers/login/checkPhone';
import CheckPhoneTwo from '../containers/login/checkPhoneStepTwo';
import DriverManageScreen from '../containers/mine/owner/driverManagement/driverManagement';
import BindCarScreen from '../containers/mine/owner/driverManagement/bindCarPage';
import AddDriverScreen2 from '../containers/mine/owner/driverManagement/addDriverPage';
import CharacterOwner from '../containers/login/character/characterOwner';
import CharacterList from '../containers/login/character/characterList';

// 车辆管理
import CarManagementScreen from '../containers/mine/owner/carManagement/carManagement';
import BindDriverScreen from '../containers/mine/owner/carManagement/bindDriverPage';
import AddCarPageScreen from '../containers/mine/owner/carManagement/addCarPage';
// 承运方电子签章-个体
import ShowESignInfoIndividual from '../containers/user/showESignInfoIndividual';
import ESignTemplateCompany from '../containers/user/eSignTemplateCompany';
import ESignTemplateIndividual from '../containers/user/eSignTemplateIndividual';
import ESignTemplateColor from '../containers/user/eSignTemplateColor';
import SetHorizontalTextScreen from '../containers/user/setHorizontalText';
import SetLastQuarterTextScreen from '../containers/user/setLastQuarterText';

import MessageListScreen from '../containers/mine/msgList';
import DevicesUnBindSuccScreen from '../containers/mine/devicesUnBindSucc';

import ArrangeCarList from '../containers/entrust/arrangeCarList';
import ArrangeDriverList from '../containers/entrust/arrangeDriverList';

import ShowZoomImageView from '../components/common/imageShow';

import TravelDetailScreen from '../containers/travel/travelDetail';
import ChangePhoneNo from '../containers/mine/changePhoneNo';
import ChangePhoneNoStepOne from '../containers/mine/changePhoneNoStepOne';
import ChangePhoneNoStepTwo from '../containers/mine/changePhoneNoStepTwo';

import HistoryOrderListScreen from '../containers/order/historyOrders/searchHistoryOrder';

export const AppNavigator = StackNavigator({
    Splash: {
        screen: SplashScreen,
        navigationOptions: {
            header: null
        }
    },
    Welcome: {
        screen: WelcomeScreen,
        navigationOptions: {
            header: null
        }
    },
    Main: {
        screen: MainScreen,
        navigationOptions: {
            header: null,
            // title: '主页',
            headerBackTitle: null
        }
    },
    [RouteType.ROUTE_CAR_LIST]: {screen: CarListScreen},
    [RouteType.ROUTE_HELP]: {
        screen: HelpScreen,
        navigationOptions: {
            // header: null,
            // title: '帮助',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_ADD_FEEDBACK]: {
        screen: AddFeedbackScreen,
        navigationOptions: {
            // header: null,
            // title: '反馈问题',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_HELP_DETAIL]: {
        screen: HelpDetailScreen,
        navigationOptions: {
            // header: null,
            // title: '反馈问题',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_HELP_DETAIL_FOR_FEEDBACK]: {
        screen: HelpDetailForFeedbackScreen,
        navigationOptions: {
            // header: null,
            // title: '反馈问题',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_REGISTER]: {
        screen: RegisterScreen,
        navigationOptions: {
            // header: null,
            // title: '注册-手机号',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_REGISTER_PWD]: {
        screen: RegisterPwdScreen,
        navigationOptions: {
            // header: null,
            // title: '注册-密码',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_BARGAIN]: {
        screen: BargainScreen,
        navigationOptions: {
            // header: null,
            // title: '承运合同',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_SHOW_ESIGN_IMAGE]: {
        screen: ShowESignImageScreen,
        navigationOptions: {
            // header: null,
            // title: '电子签章',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_UPDATE_ESIGN_INFO]: {
        screen: ShowESignInfoScreen,
        navigationOptions: {
            // header: null,
            // title: '电子签章',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_CAR_LOGIN]: {screen: CarLoginScreen},
    [RouteType.ROUTE_GAME_PAGE]: {screen: GameScreen},
    [RouteType.ROUTE_LOGIN]: {screen: LoginScreen},
    GoodsListContainer: {screen: GoodsListContainer},
    TravelContainer: {screen: TravelContainer},
    OrderContainer: {screen: OrderContainer},
    EntrustOrderContainer: {screen: EntrustOrderContainer},
    [RouteType.ROUTE_SETTING]: {
        screen: SettingScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_AGREEMENT_CONTENT]: {
        screen: AgreementScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_COMPANY_LIST]: {
        screen: CompanyListScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_DRIVER_MANAGER]: {
        screen: DriverManagerScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_DRIVER_INFO_DETAIL]: {
        screen: DriverInfoDetailScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_ADD_DRIVER]: {
        screen: AddDriverScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_MESSAGE_LIST]: {
        screen: MessageScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_MESSAGE_DETAIL]: {
        screen: MessageDetailScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_MY_CAR]: {
        screen: CarManageScreen,
        navigationOptions: {
            // header: null,
            // title: '车辆管理',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_ADD_CAR]: {
        screen: AddCarScreen,
        navigationOptions: {
            // header: null,
            // title: '新增车辆',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_EDIT_CAR]: {
        screen: EditCarScreen,
        navigationOptions: {
            // header: null,
            // title: '编辑车辆',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_CAR_DETAIL]: {
        screen: CarDetailScreen,
        navigationOptions: {
            // header: null,
            // title: '车辆详情',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_MY_ROUTE]: {
        screen: MyRouteScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_ADD_ROUTE]: {
        screen: AddRouteScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_EDIT_ROUNT_PAGE]: {
        screen: EditRouteScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_AUTH_ROLE]: {
        screen: AuthRoleScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_COMPANY_AUTH]: {
        screen: CompanyAuthScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_PERSONAL_AUTH]: {
        screen: PersonalAuthScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_PERSONAL_AUTH_DETAIL]: {
        screen: PersonalAuthInfoScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_USER_INFO]: {
        screen: UserInfoScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_PASSWORD_PAGE]: {
        screen: PwdStepOneScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_PASSWORD_TWO_PAGE]: {
        screen: PwdStepTwoScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_AUTH_INFO]: {
        screen: AuthInfoScreen,
        navigationOptions: {
            // header: null,
            // title: '公司认证详情',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_BANK_CARD_LIST]: {
        screen: CardBankManageScreen,
        navigationOptions: {
            // header: null,
            // title: '银行账户管理',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_ADD_BANK_CARD]: {
        screen: AddCardBankScreen,
        navigationOptions: {
            // header: null,
            // title: '添加银行卡',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_CAR_BIND_DRIVER]: {
        screen: CarBindDriverScreen,
        navigationOptions: {
            // header: null,
            // title: '车辆绑定司机',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_SELECTED_DRIVER]: {
        screen: SelectDriverScreen,
        navigationOptions: {
            // header: null,
            // title: '选择司机',
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_CUSTOME_SERVICE]: {
        screen: CustomServiceScreen,
        navigationOptions: {
            // header: null,
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_ROUTES_LIST]: {
        screen: GoodsListScreen
    },
    [RouteType.ROUTE_PRE_ORDER]: {
        screen: PreOrderScreen,
        navigationOptions: {
            headerBackTitle: null,
            headerStyle: {backgroundColor: 'white'},
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_RULE_INSTRUCTION]: {
        screen: RuleInstructionScreen,
        navigationOptions: {
            headerBackTitle: null,
            headerStyle: {backgroundColor: 'white'},
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_SEARCH_GOODS]: {
        screen: SearchGoodsScreen,
        navigationOptions: {
            headerBackTitle: null,
            headerStyle: {backgroundColor: 'white'},
            headerTintColor: 'black',
            headerTitle: '搜索'
        }
    },
    [RouteType.ROUTE_BIDDING_LIST]: {
        screen: BiddingListScreen,
        navigationOptions: {
            headerBackTitle: null,
            headerStyle: {backgroundColor: 'white'},
            headerTintColor: 'black',
        }
    },
    [RouteType.ROUTE_DISPATCH_CAR]: {
        screen: DispatchCarScreen,
        navigationOptions: {
            headerBackTitle: null,
            headerStyle: {backgroundColor: 'white'},
            headerTintColor: 'black',
            headerTitle: '调度车辆'
        }
    },
    [RouteType.ROUTE_TRANSPORT_CONFIRM]: {
        screen: TransportConfirmScreen,
        navigationOptions: {
            headerBackTitle: null,
            headerStyle: {backgroundColor: 'white'},
            headerTintColor: 'black',
            headerTitle: '承运单确认'
        }
    },
    [RouteType.ROUTE_ENTRUST_ORDER_DETAIL]: {
        screen: EntrustOrderDetailScreen,
        navigationOptions: {
            headerTitle: '委托详情',
            headerStyle: {backgroundColor: 'white'},
            headerBackTitle: null,
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_ORDER_DETAIL]: {
        screen: OrderDetailScreen,
        navigationOptions: {
            headerTitle: '订单详情',
            headerStyle: {backgroundColor: 'white'},
            headerBackTitle: null,
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_LADING_BILL]: {
        screen: LadingBillScreen,
        navigationOptions: {
            headerStyle: {backgroundColor: 'white'},
            headerBackTitle: null,
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_UPLOAD_IMAGES]: {
        screen: UploadImageScreen,
        navigationOptions: {
            headerTitle: '上传图片',
            headerStyle: {backgroundColor: 'white'},
            headerBackTitle: null,
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_CONTRACT_DETAIL]: {
        screen: ContractDetailScreen,
        navigationOptions: {
            headerStyle: {backgroundColor: 'white'},
            headerBackTitle: null,
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_CONFIRM_DELIVERY]: {
        screen: ConfirmDeliveryScreen,
        navigationOptions: {
            headerTitle: '确认交付',
            headerStyle: {backgroundColor: 'white'},
            headerBackTitle: null,
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_BILL_DETAIL]: {
        screen: BillDetailScreen,
        navigationOptions: {
            headerTitle: '',
            headerStyle: {backgroundColor: 'white'},
            headerBackTitle: null,
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_APPLY_COORDINATION]: {
        screen: ApplyCoordinationScreen,
        navigationOptions: {
            headerTitle: '申请协调',
            headerStyle: {backgroundColor: 'white'},
            headerBackTitle: null,
            headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_HOME_PAGE]: {
        screen: HomeScreen,
        navigationOptions: {
            // header: null,
            // title: '首页',
            // headerStyle: {backgroundColor: 'white'},
            // headerBackTitle: null,
            // headerTintColor: 'black'
        }
    },
    [RouteType.ROUTE_UPLOAD_ABNORMAL_PAGE]: {
        screen: UploadAbnormalScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_DRIVER_GOOD_PAGE]: {
        screen: DriverGoodSourceScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_DRIVER_ORDER_PAGE]: {
        screen: DriverOrderScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_ORDER_SHIPPED_PAGE]: {
        screen: EntryToBeShippedScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_ORDER_SIGN_IN_PAGE]: {
        screen: EntryToBeSignInScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_SCAN_GPS_PAGE]: {
        screen: ScanGPSScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_GPS_DETAIL_PAGE]: {
        screen: GPSDetailScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_BIND_GPS_PAGE]: {
        screen: BindGPSScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_UPLOAD_ODO_PAGE]: {
        screen: UploadODOScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_PHOTO_SHOW_PAGE]: {
        screen: PhotoShowScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_WECHAT_PAYMENT_PAGE]: {
        screen: WeChatPaymentScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_MAKE_COLLECTIONS_PAGE]: {
        screen: PayTypesScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_SIGN_IN_PAGE]: {
        screen: SignInScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_SIGN_SUCCESS_PAGE]: {
        screen: SignSuccessScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_RECEIPT_SUCCESS_PAGE]: {
        screen: ReceiptSuccessScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_UPLOAD_RECEIPT_PAGE]: {
        screen: UploadReceiptScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_BATCH_UPLOAD_RECEIPT_PAGE]: {
        screen: BatchUploadReceiptScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_BAIDU_MAP_PAGE]: {
        screen: BaiduMapScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_TAKE_PHOTO_PAGE]: {
        screen: TakePhotoScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_TAKE_PHOTO_FINISHED_PAGE]: {
        screen: TakePhotoFinishedScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_MINE_PAGE]: {
        screen: MineScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_LOGIN_WITH_PWD_PAGE]: {
        screen: LoginWithPwdScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_LOGIN_WITH_SMS_PAGE]: {
        screen: LoginWithSmsScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_DRIVER_VERIFIED]: {
        screen: DriverVerified,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_MODIFY_PWD]: {
        screen: ModifyPwdScreen,
        navigationOptions: {

        }
    },
    [RouteType.ROUTE_ABOUT_US]: {
        screen: AboutUsScreen,
        navigationOptions: {

        }
    },
    [RouteType.ROUTE_DRIVER_SETTING]: {
        screen: DriverSettingScreen,
        navigationOptions: {
        }
    },
    [RouteType.ROUTE_FORGET_PASSWORD]: {
        screen: LoginForgetPWD,
        navigationOptions: {
            // title:'忘记密码'
        }
    },
    [RouteType.ROUTE_FORGET_PASSWORD_TWO]: {
        screen: LoginForgetPWDTwo,
        navigationOptions: {
            // title:'忘记密码2'
        }
    },
    [RouteType.ROUTE_REDISTER_STEP_ONE]: {
        screen: RegisterStepOne,
        navigationOptions: {
        }
    },
    [RouteType.ROUTE_TAKE_CAMEAR]: {
        screen: TakeCamera,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_TAKE_CAMEAR_END]: {
        screen: TakeCameraEnd,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_DRIVER_VERIFIED_DETAIL]: {
        screen: DriverVerifiedDetail,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CHOOSE_CAR]: {
        screen: ChooseCarScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_PERSON_CAR_OWNER_AUTH]: {
        screen: PersonCarOwnerAuth,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH]: {
        screen: CompanyCarOwnerAuth,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_TAKE_CEMARA_VERTICAL]: {
        screen: TakeCameraVertical,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_TAKE_CEMARA_VERTICAL_END]: {
        screen: TakeCameraVerticalEnd,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_ENTERPRISE_OWNER_VERIFIED_DETAIL]: {
        screen: EnterpriseownerVerifiedState,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_PERSON_OWNER_VERIFIED]: {
        screen: PersonownerVerified,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_SHOW_BIG_IMAGE]: {
        screen: ShowBigImagePage,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CAR_OWNER_ADD_CAR]: {
        screen: CarOwnerAddCar,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CAR_OWNER_ADD_CAR_DETAIL]: {
        screen: CarOwnerAddCarDetail,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CAR_OWNER_ADD_DRIVER]: {
        screen: CarOwnerAddDriver,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CAR_OWNER_ADD_DRIVER_DETAIL]: {
        screen: CarOwnerAddDriverDetail,
        navigationOptions: {
            header: null
        }
    },
        [RouteType.ROUTE_PERSON_INFO]: {
        screen: PersonInfoScreen,
        navigationOptions: {
        }
    },
    [RouteType.ROUTE_CAR_INFO]: {
        screen: CarInfoScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CAR_DISABLE_PAGE]: {
        screen: CarDisableScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_DEVICES_BIND]: {
        screen: DevicesBingScreen,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    [RouteType.ROUTE_CHECK_PHONE]: {
        screen: CheckPhone,
        navigationOptions: {
            // title:'绑定设备'
        }
    },
    [RouteType.ROUTE_CHECK_PHONE_STEP_TWO]: {
        screen: CheckPhoneTwo,
        navigationOptions: {
            // title:'绑定设备'
        }
    },
    [RouteType.ROUTE_BIND_CAR]: {
        screen: BindCarScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_DRIVER_MANAGEMENT]: {
        screen: DriverManageScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_ADD_DRIVER2]: {
        screen: AddDriverScreen2,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_DRIVER_GOOD_DETAIL_PAGE]: {
        screen: EntryGoodsDetailScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CHARACTER_OWNER]: {
        screen: CharacterOwner,
        navigationOptions: {
            // header: null,
            // title:'选择owner角色'
        }
    },
    [RouteType.ROUTE_CAR_MANAGEMENT]: {
        screen: CarManagementScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_BIND_DRIVER]: {
        screen: BindDriverScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_ADD_CAR2]: {
        screen: AddCarPageScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CHARACTER_LIST]: {
        screen: CharacterList,
        navigationOptions: {

        }
    },

    [RouteType.ROUTE_CAR_OWNER_VERIFIED_MSG_CODE]: {
        screen: CarOwnerVerifiedMsgCode,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CAR_OWNER_ADD_CAR_TWO]: {
        screen: CarOwnerAddCarTwo,
        navigationOptions: {
            header: null
        }
    },

    [RouteType.ROUTE_CAR_OWNER_ADD_CAR_THREE]: {
        screen: CarOwnerAddCarThree,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_ESIGN_INDIVIDUAL]: {
        screen: ShowESignInfoIndividual,
        navigationOptions: {
            // title:'设置电子签章个体'
        }
    },
    [RouteType.ROUTE_ESIGN_TEMPLATE_INDIVIDUAL]: {
        screen: ESignTemplateIndividual,
        navigationOptions: {
            // title:'电子签章个体模板'
        }
    },
    [RouteType.ROUTE_ESIGN_TEMPLATE_COMPANY]: {
        screen: ESignTemplateCompany,
        navigationOptions: {
            // title:'电子签章公司模板'
        }
    },
    [RouteType.ROUTE_ESIGN_TEMPLATE_COLOR]: {
        screen: ESignTemplateColor,
        navigationOptions: {
            // title:'模板颜色'
        }
    },
    [RouteType.ROUTE_ESIGN_HORIZONTAL_TEXT]: {
        screen: SetHorizontalTextScreen,
        navigationOptions: {
            // title: '横向文',
            header: null
        }
    },
    [RouteType.ROUTE_ESIGN_LAST_QUARTER_TEXT]: {
        screen: SetLastQuarterTextScreen,
        navigationOptions: {
            // title: '下弦文'
            header: null
        }
    },
    [RouteType.ROUTE_GOOD_LIST_DETAIL]: {
        screen: GoodListDetail,
        navigationOptions: {
            // title: '下弦文'
            header: null
        }
    },
    [RouteType.ROUTE_MESSAGE_LIST_PAGE]: {
        screen: MessageListScreen,
        navigationOptions: {
            // title: '司机-消息列表'
            header: null
        }
    },
    [RouteType.ROUTE_DEVICES_UNBIND_SUCC]: {
        screen: DevicesUnBindSuccScreen,
        navigationOptions: {
            // title: '设备解绑成功'
            // header: null
        }
    },
    [RouteType.ROUTE_ARRANGE_CAR_LIST]: {
        screen: ArrangeCarList,
        navigationOptions: {
            // title: '安排车辆列表'
            header: null
        }
    },
    [RouteType.ROUTE_ARRANGE_DRIVER_LIST]: {
        screen: ArrangeDriverList,
        navigationOptions: {
            // title: '安排司机列表'
            header: null
        }
    },
    [RouteType.ROUTE_CAROWNER_CREAT_DRIVER]: {
        screen: CarOwnerCreatDriver,
        navigationOptions: {
            // title: '安排司机列表'
            header: null
        }
    },
    [RouteType.ROUTE_SHOW_ZOOM_IMAGE]: {
        screen: ShowZoomImageView,
        navigationOptions: {
            // title: '安排司机列表'
            header: null
        }
    },
    [RouteType.ROUTE_MESSAGE_DETAIL_MAIN]: {
        screen: MessageSYSDetail,
        navigationOptions: {
            // title: '消息详情'
            header: null
        }
    },
    [RouteType.ROUTE_CAR_TRANSPORT_INFO]: {
        screen: TravelDetailScreen,
        navigationOptions: {
            // title: '运输在途信息监控'
            header: null
        }
    },
    [RouteType.ROUTE_RECEIPT_PHOTO]: {
        screen: ReceiptPhotoScreen,
        navigationOptions: {
            header: null
        }
    },
    [RouteType.ROUTE_CHANGE_PHONE_NO]: {
        screen: ChangePhoneNo,// 更改手机号码
        navigationOptions: {

        }
    },
    [RouteType.ROUTE_CHANGE_PHONE_NO_STEP_ONE]: {
        screen: ChangePhoneNoStepOne,// 更改手机号码 第一步
        navigationOptions: {

        }
    },
    [RouteType.ROUTE_CHANGE_PHONE_NO_STEP_TWO]: {
        screen: ChangePhoneNoStepTwo,// 更改手机号码 第二步
        navigationOptions: {

        }
    },
    [RouteType.ROUTE_HISTORY_ORDER]: {
        screen: HistoryOrderListScreen,// 更改手机号码 第二步
        navigationOptions: {
            // title: '历史订单'
            header: null
        }
    },


}, {
    headerMode: 'screen',
    initialRouteName: 'Splash',
    // initialRouteName: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE,
    transitionConfig: TransitionConfiguration
});

const TransitionConfiguration = () => ({
    screenInterpolator: (sceneProps) => {
        const {scene} = sceneProps;
        const {route} = scene;
        const params = route.params || {};
        const transition = params.transition || 'forHorizontal';
        return CardStackStyleInterpolator[transition](sceneProps);
    },
});

const AppWithNavigationState = ({dispatch, nav}) => (
    <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})}/>
);

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
