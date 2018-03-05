import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as ConstValue from '../../constants/constValue';
import Carousel from 'react-native-snap-carousel';
import HomeCell from '../../components/home/homeCell';
import {fetchData, getHomePageCountAction} from '../../action/app';
import {saveWeather} from '../../action/home';
import {
    saveUserCarList,
    setUserCarAction,
    queryEnterpriseNatureSuccessAction,
} from '../../action/user';
import {API_GET_WEATHER} from '../../constants/api';
import locationIcon from '../../../assets/home/location.png';
import bannerImage1 from '../../../assets/home/banner1.png';
import bannerImage2 from '../../../assets/home/banner2.png';
import signIcon from '../../../assets/home/sign_icon.png';
import receiptIcon from '../../../assets/home/receipt_icon.png';
import dispatchIcon from '../../../assets/home/despatch_icon.png';
import receiveIcon from '../../../assets/home/receive_icon.png';
import roadIcon from '../../../assets/home/road_abnormality.png';
import WeatherCell from '../../components/home/weatherCell';
import {width, height} from '../../constants/dimen';
import {changeTab, showFloatDialog, logout, appendLogToFile} from '../../action/app';
import NavigatorBar from '../../components/common/navigatorbar';
import DriverUp from '../../../assets/img/character/driverUp.png';
import DriverDown from '../../../assets/img/character/driverDown.png';
import OwnerUp from '../../../assets/img/character/ownerUp.png';
import OwnerDown from '../../../assets/img/character/ownerDown.png';
import MessageNewMine from '../../../assets/img/oldMine/newMessage.png';
import MessageMine from '../../../assets/img/oldMine/message.png';
import Fromto from '../../../assets/img/home/fromto.png';
import CharacterChooseCell from '../../../src/components/login/characterChooseCell';
import Toast from '../../utils/toast';
import JPushModule from 'jpush-react-native';
import LittleButtonCell from '../../components/home/littleButtonCell';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
    Image,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction
} from '../../action/user';
import {
    WHITE_COLOR,
    BLUE_CONTACT_COLOR,
    DEVIDE_LINE_COLOR,
    COLOR_SEPARATE_LINE,
    LIGHT_GRAY_TEXT_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
    COLOR_LIGHT_GRAY_TEXT,
    REFRESH_COLOR,
} from '../../constants/colors';
import * as RouteType from "../../constants/routeType";

const images = [
    bannerImage1,
    bannerImage2,
];

function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = 28;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const itemHeight = 125 * itemWidth / 335;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            acceptMessge: '',
            plateNumber: '',
            setUserCar: false,
            weather: '天气',
            temperatureLow: '--',
            temperatureHigh: '--',
            weatherNum: '',
            limitNumber: '',
            plateNumberObj: {},
            modalVisible: false,
            character: '司机',
            bubbleSwitch: false,
            show: false,
            // CarOwnerState: params ? params.CarOwnerState : ''
        };

        this.getWeather = this.getWeather.bind(this);
        this.vehicleLimit = this.vehicleLimit.bind(this);
        this.searchDriverState = this.searchDriverState.bind(this);
        this.searchDriverStateSucCallBack = this.searchDriverStateSucCallBack.bind(this);
        this.ownerVerifiedHome = this.ownerVerifiedHome.bind(this);
        this.ownerVerifiedHomeSucCallBack = this.ownerVerifiedHomeSucCallBack.bind(this);
        this.ownerVerifiedHomeFailCallBack = this.ownerVerifiedHomeFailCallBack.bind(this);

        this.getUserCar = this.getUserCar.bind(this);
        this.getUserCarSuccessCallBack = this.getUserCarSuccessCallBack.bind(this);
        this.getUserCarMine = this.getUserCarMine.bind(this);
        this.getUserCarMineSuccessCallBack = this.getUserCarMineSuccessCallBack.bind(this);
        this.saveUserCarList = this.saveUserCarList.bind(this);
        this.setUserCar = this.setUserCar.bind(this);
        this.setUserCarSuccessCallBack = this.setUserCarSuccessCallBack.bind(this);

    }


    componentWillReceiveProps(nextProps) {
        if (this.props.location !== nextProps.location) {
            this.getWeather(nextProps.location);
            this.vehicleLimit(nextProps.location);
        }
    }

    componentDidMount() {
        // if (this.state.CarOwnerState) {
        //     this.props.setCurrentCharacterAction('owner');
        //     this.setState({
        //         bubbleSwitch: false,
        //         show: false,
        //     })
        // }

        // this.getCurrentPosition(0);

        if (this.props.currentStatus == 'driver') {
            this.queryEnterpriseNature();
        }
        // if (Platform.OS === 'android') {
        //     JPushModule.notifyJSDidLoad((resultCode) => {
        //         if (resultCode === 0) {
        //         }
        //     });
        //     // 收到自定义消息后触发
        //     JPushModule.addReceiveCustomMsgListener((message) => {
        //         console.log(message);
        //     });
        //     // 收到推送时将会触发此事件
        //     JPushModule.addReceiveNotificationListener((message) => {
        //         console.log('home,ANreceive notification: ', message);
        //
        //         this.props.setMessageListIcon(true);
        //         this.saveMessage(message.alertContent);
        //         if (message.alertContent.indexOf('认证') < 0) {
        //             this.speechContent(message.alertContent, 0);
        //         }
        //         if (message.alertContent.indexOf('新货源') > -1) {
        //             Alert.alert('提示', '您有新的订单，是否进入货源界面', [
        //                 {
        //                     text: '确定',
        //                     onPress: () => {
        //                         DeviceEventEmitter.emit('resetGood');
        //                         this.props.navigation.navigate('GoodsSource');
        //                     },
        //                 },
        //                 {text: '取消'},
        //             ], {cancelable: false});
        //         }
        //
        //         if (message.alertContent.indexOf('快来竞拍吧') > -1) {
        //             Alert.alert('提示', '您有新的货源可以竞拍', [
        //                 {
        //                     text: '确定',
        //                     onPress: () => {
        //                         this.props.navigation.navigate('Order');
        //                         this.changeOrderTab(1);
        //                         DeviceEventEmitter.emit('changeOrderTabPage', 1);
        //                     },
        //                 },
        //                 {text: '取消'},
        //             ], {cancelable: false});
        //         }
        //
        //         if (message.alertContent.indexOf('竞价成功') > -1) {
        //             Alert.alert('提示', '恭喜您，竞价成功, 是否进入订单页面', [
        //                 {
        //                     text: '确定',
        //                     onPress: () => {
        //                         this.props.navigation.navigate('Order');
        //                         this.changeOrderTab(1);
        //                         DeviceEventEmitter.emit('changeOrderTabPage', 1);
        //                     },
        //                 },
        //                 {text: '取消'},
        //             ], {cancelable: false});
        //         }
        //
        //         if (message.alertContent.indexOf('竞拍失败') > -1) {
        //
        //         }
        //
        //         if (message.alertContent.indexOf('实名认证>已认证通过') > -1) {
        //
        //         }
        //
        //         if (message.alertContent.indexOf('实名认证>已认证驳回') > -1) {
        //
        //         }
        //
        //         if (message.alertContent.indexOf('资质认证>已认证通过') > -1) {
        //
        //         }
        //
        //         if (message.alertContent.indexOf('资质认证>已认证驳回') > -1) {
        //
        //         }
        //
        //
        //     });
        //     // 点击通知后，将会触发此事件
        //     JPushModule.addReceiveOpenNotificationListener((map) => {
        //         console.log('home,ANOpening notification!', map);
        //
        //         this.props.setMessageListIcon(true);
        //         this.saveMessage(map.alertContent);
        //         if (map.alertContent.indexOf('竞价成功') > -1) {
        //             this.props.navigation.navigate('Order');
        //             this.changeOrderTab(1);
        //             DeviceEventEmitter.emit('changeOrderTabPage', 1);
        //         }
        //         if (map.alertContent.indexOf('新货源') > -1) {
        //             DeviceEventEmitter.emit('resetGood');
        //             this.props.navigation.navigate('GoodsSource');
        //         }
        //     });
        // }
        // -----------jpush  ios start
        // if (Platform.OS === 'ios') {
        //     NativeAppEventEmitter.addListener(
        //         'OpenNotification',
        //         (notification) => {
        //             console.log('打开推送', notification);
        //
        //             this.props.setMessageListIcon(true);
        //             this.saveMessage(notification.aps.alert);
        //             if (notification.aps.alert.indexOf('竞价成功') > -1) {
        //                 this.props.navigation.navigate('Order');
        //                 this.changeOrderTab(1);
        //                 DeviceEventEmitter.emit('changeOrderTabPage', 1);
        //             }
        //             if (notification.aps.alert.indexOf('新货源') > -1) {
        //                 DeviceEventEmitter.emit('resetGood');
        //                 this.props.navigation.navigate('GoodsSource');
        //             }
        //         },
        //     );
        //     NativeAppEventEmitter.addListener(
        //         'ReceiveNotification',
        //         (notification) => {
        //             console.log('-------------------收到推送----------------', notification);
        //
        //             this.props.setMessageListIcon(true);
        //             this.saveMessage(notification.aps.alert);
        //             if (notification.aps.alert.indexOf('认证') < 0) {
        //                 this.speechContent(notification.aps.alert, 0);
        //             }
        //             if (notification.aps.alert.indexOf('新货源') > -1) {
        //                 Alert.alert('提示', '您有新的订单，是否进入货源界面', [
        //                     {
        //                         text: '确定',
        //                         onPress: () => {
        //                             // this.props.navigator.popToTop();
        //                             DeviceEventEmitter.emit('resetGood');
        //                             this.props.navigation.navigate('GoodsSource');
        //                         },
        //                     },
        //                     {text: '取消'},
        //                 ], {cancelable: false});
        //             }
        //
        //             if (notification.aps.alert.indexOf('快来竞拍吧') > -1) {
        //                 Alert.alert('提示', '您有新的货源可以竞拍', [
        //                     {
        //                         text: '确定',
        //                         onPress: () => {
        //                             this.props.navigation.navigate('Order');
        //                             this.changeOrderTab(1);
        //                             DeviceEventEmitter.emit('changeOrderTabPage', 1);
        //                         },
        //                     },
        //                     {text: '取消'},
        //                 ], {cancelable: false});
        //             }
        //
        //             if (notification.aps.alert.indexOf('竞价成功') > -1) {
        //                 Alert.alert('提示', '恭喜您，竞价成功, 是否进入订单页面', [
        //                     {
        //                         text: '确定',
        //                         onPress: () => {
        //                             this.props.navigation.navigate('Order');
        //                             this.changeOrderTab(1);
        //                             DeviceEventEmitter.emit('changeOrderTabPage', 1);
        //                         },
        //                     },
        //                     {text: '取消'},
        //                 ], {cancelable: false});
        //             }
        //
        //             if (notification.aps.alert.indexOf('竞拍失败') > -1) {
        //
        //             }
        //
        //             if (notification.aps.alert.indexOf('实名认证>已认证通过') > -1) {
        //
        //             }
        //
        //             if (notification.aps.alert.indexOf('实名认证>已认证驳回') > -1) {
        //
        //             }
        //
        //             if (notification.aps.alert.indexOf('资质认证>已认证通过') > -1) {
        //
        //             }
        //
        //             if (notification.aps.alert.indexOf('资质认证>已认证驳回') > -1) {
        //
        //             }
        //
        //
        //         },
        //     );
        //
        //
        // }
        // -----------jpush  ios end

        // this.listener = DeviceEventEmitter.addListener('refreshHome', () => {
        //     if (this.props.currentStatus == 'driver') {
        //         if (this.props.plateNumber) {
        //             const {userInfo} = this.props;
        //             this.getHomePageCount(this.props.plateNumber, userInfo.phone)
        //         }
        //     } else {
        //         this.getCarrierHomePageCount();
        //     }
        // });
        // this.getUserCarListener = DeviceEventEmitter.addListener('getUserCar', () => {
        //     this.getUserCar();
        // });


        // this.notifyCertificationListener = DeviceEventEmitter.addListener('certification', () => {
        //     if (this.props.currentStatus == 'driver') {
        //         if (this.props.driverStatus == 1) {
        //             Alert.alert('提示', '认证资料正在审核中');
        //         } else if (this.props.driverStatus == 3) {
        //             Alert.alert('提示', '认证资料已驳回，请重新上传资料');
        //         }
        //     } else {
        //         if (this.props.ownerStatus == 11 || this.props.ownerStatus == 21) {
        //             Alert.alert('提示', '认证资料正在审核中');
        //         } else if (this.props.ownerStatus == 13 || this.props.ownerStatus == 23) {
        //             Alert.alert('提示', '认证资料已驳回，请重新上传资料');
        //         }
        //     }
        // });

        // this.Listener = DeviceEventEmitter.addListener('restToLoginPage', (message) => {
        //     Toast.showShortCenter(message);
        //     this.resetTo(0, 'Login');
        // });

        // this.bindCarListener = DeviceEventEmitter.addListener('bindUserCar', (value) => {
        //     if (value) {
        //         this.setUserCar(value);
        //     }
        // });

        // // 上传日志功能
        // // TimeToDoSomething.sendMsgToNative();
        // this.logListener = NativeAppEventEmitter.addListener('nativeSendMsgToRN', (data) => {
        //     this.getCurrentPosition(1);
        // });
        // 我的界面车辆列表监听
        // this.getUserCarMineListener = DeviceEventEmitter.addListener('getUserCarMine', (data) => {
        //     this.getUserCarMine();
        // });
    }

    componentWillUnmount() {
        // this.listener.remove();
        // this.getUserCarListener.remove();
        // this.Listener.remove();
        // this.bindCarListener.remove();
        // this.notifyCarStatusListener.remove();
        // this.notifyCertificationListener.remove();
        // this.logListener.remove();
        // this.getUserCarMineListener.remove();
    }

    // 获取首页状态数量
    getHomePageCount(plateNumber, phone) {
        if (plateNumber) {
            this.props.getHomePageCountAction({plateNumber: plateNumber, driverPhone: phone})
        }
    }

    getWeather(city) {
        this.props.getWeather({city: city});
    }

    vehicleLimit(cityName) {
        this.props.vehicleLimit({cityName: cityName})
    }

    // 获取车辆列表
    getUserCar() {
        Storage.get(StorageKey.USER_INFO).then((value) => {
            if (value) {
                this.props.getUserCarAction({phoneNum: value.phone}, this.getUserCarSuccessCallBack)
            }
        });
    }

    // 获取车辆列表成功
    getUserCarSuccessCallBack(result) {
        if (result) {
            if (result.length > 1) {
                this.saveUserCarList(result);
                this.props.navigation.navigate('ChooseCar', {
                    carList: result,
                    currentCar: '',
                    flag: true,
                });
            } else if (result.length === 1) {

                this.saveUserCarList(result);
                this.setState({
                    plateNumber: result[0].carNum,
                    plateNumberObj: result[0],
                });
                this.saveUserCarInfo(result[0]);
                this.setUserCar(result[0].carNum, this.setUserCarSuccessCallBack);
            }
        } else {
            Alert.alert('提示', '您的账号未绑定车辆，请添加车辆');
        }
    }

    // 获取车辆列表
    getUserCarMine() {
        Storage.get(StorageKey.USER_INFO).then((value) => {
            if (value) {
                console.log('value', value);
                this.props.getUserCarMineAction({phoneNum: value.phone}, this.getUserCarMineSuccessCallBack);
            }
        });
    }

    // 获取车辆列表成功
    getUserCarMineSuccessCallBack(result) {
        if (result) {
            if (result.length != 0)
                this.saveUserCarList(result);
        } else {
            Alert.alert('提示', '您的账号未绑定车辆，请添加车辆');
        }
    }

    // 设置车辆
    setUserCar(plateNumber,setUserCarSucCallBack) {
        Storage.get(StorageKey.USER_INFO).then((value) => {
            if (value) {
                this.props.setUserCarAction({
                    plateNumber: plateNumber,
                    phoneNum: value.phone
                }, setUserCarSucCallBack)
            }
        });
    }

    // 设置车辆成功
    setUserCarSuccessCallBack(result) {

        const userInfo = this.props.userInfo;

        console.log('设置车辆成功了', this.props.plateNumber, userInfo.phone);
        this.getHomePageCount(this.props.plateNumber, userInfo.phone);
        this.saveUserCarInfo(this.props.plateNumberObj);
        Storage.save('setCarSuccessFlag', '2');
        DeviceEventEmitter.emit('updateOrderList');
        DeviceEventEmitter.emit('resetGood');
    }

    // 保存车牌号对象
    saveUserCarInfo(plateNumberObj) {
        this.props.saveUserSetCarSuccess(plateNumberObj);
    }

    // 保存车辆列表
    saveUserCarList(carList) {
        this.props.saveUserCarListAction(carList);
    }

    // 获取首页状态数量
    getCarrierHomePageCount() {
        currentTime = new Date().getTime();
        if (this.props.carrierCode) {
            HTTPRequest({
                url: API.API_CARRIER_INDEX_STATUS_NUM,
                params: {
                    carrierCode: this.props.carrierCode,
                },
                loading: () => {
                },
                success: (responseData) => {
                    lastTime = new Date().getTime();
                    ReadAndWriteFileUtil.appendFile('获取首页状态数量', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                        locationData.district, lastTime - currentTime, '首页');
                    if (responseData.result) {
                        this.props.getCarrierHomoPageCountAction(responseData.result);
                    }
                },
                error: () => {
                },
                finish: () => {
                },
            });
        }
    }

    ownerVerifiedHome(ownerVerifiedHomeSucCallBack, ownerVerifiedHomeFailCallBack) {

        if (this.props.userInfo) {
            if (this.props.userInfo.phone) {
                this.props.ownerVerifiedHomeAction({
                    busTel: global.phone,
                }, ownerVerifiedHomeSucCallBack, ownerVerifiedHomeFailCallBack)
            }
        }
    }

    ownerVerifiedHomeSucCallBack(result) {
        debugger
        console.log('ownerVerifiedState==', result.toString());
        // let result = result;
        this.setState({
            verifiedState: result && result.certificationStatus,
        });
        // 首页状态
        if (result.companyNature == '个人') {
            if (result.status == '10') {
                Toast.show('个人车主身份被禁用');
                return
            } else {
                // 确认个人车主
                if (result.certificationStatus == '1201') {
                    this.props.setOwnerCharacterAction('11');
                    this.props.setCurrentCharacterAction('personalOwner');
                    this.setState({
                        bubbleSwitch: false,
                        show: false,
                    })
                } else {
                    if (result.certificationStatus == '1202') {
                        this.props.setCompanyCodeAction(result.companyCode);
                        this.props.setOwnerCharacterAction('12');
                        this.props.setCurrentCharacterAction('personalOwner');
                        this.setState({
                            bubbleSwitch: false,
                            show: false,
                        })
                    } else {
                        this.props.setOwnerCharacterAction('13');
                        this.props.navigation.navigate('PersonownerVerifiedStatePage');
                        this.setState({
                            show: false,
                        })
                    }
                }
            }

        } else {
            if (result.companyNature == '企业') {
                if (result.status == '10') {
                    Toast.show('企业车主身份被禁用');
                    return
                } else {
                    // 确认企业车主
                    if (result.certificationStatus == '1201') {
                        this.props.setOwnerCharacterAction('21');
                        this.props.setCurrentCharacterAction('businessOwner');
                        this.setState({
                            bubbleSwitch: false,
                            show: false,
                        })
                    } else {
                        if (result.certificationStatus == '1202') {
                            this.props.setCompanyCodeAction(result.companyCode);
                            this.props.setOwnerCharacterAction('22');
                            this.props.setCurrentCharacterAction('businessOwner');
                            this.setState({
                                bubbleSwitch: false,
                                show: false,
                            })
                        } else {
                            this.props.setOwnerCharacterAction('23');
                            this.props.navigation.navigate('EnterpriseownerVerifiedStatePage');
                            this.setState({
                                show: false,
                            })
                        }
                    }
                }
            } else {
                this.props.navigation.dispatch({
                    type: RouteType.ROUTE_CHARACTER_OWNER,
                })
                this.setState({
                    show: false,
                })
            }
        }
    }

    ownerVerifiedHomeFailCallBack(result) {
        if (result.message == '没有车主角色') {
            this.props.navigation.dispatch({
                type: RouteType.ROUTE_CHARACTER_OWNER,
            })
            this.setState({
                show: false,
            })
        }
    }

    searchDriverState(searchDriverStateSucCallBack) {
        this.props.searchDriverStateAction({}, searchDriverStateSucCallBack)
    }

    searchDriverStateSucCallBack(result) {
        if (result) {
            if (result.status == '10') {
                this.props.setDriverCharacterAction('4');
                this.setState({
                    bubbleSwitch: false,
                    show: false,
                })
                Toast.show('司机身份已经被禁用，如需帮助请联系客服');
                return
            } else {
                if (result.certificationStatus == '1201') {
                    this.props.setDriverCharacterAction('1');
                }
                if (result.certificationStatus == '1202') {
                    this.props.setDriverCharacterAction('2');
                }
                if (result.certificationStatus == '1203') {
                    this.props.setDriverCharacterAction('3');
                }
                if (result.certificationStatus == '1203') {
                    Storage.get(StorageKey.changePersonInfoResult).then((value) => {
                        if (value) {
                            this.props.navigation.navigate('VerifiedPage', {
                                resultInfo: value,
                                commitSuccess: () => {
                                    this.setState({
                                        bubbleSwitch: false,
                                        show: false,
                                    })
                                }
                            });
                        } else {
                            this.props.navigation.navigate('VerifiedPage', {
                                commitSuccess: () => {
                                    this.setState({
                                        bubbleSwitch: false,
                                        show: false,
                                    })
                                }
                            });
                        }
                    });

                    this.setState({
                        show: false,
                    })

                } else {
                    this.props.setCurrentCharacterAction('driver');

                    this.setState({
                        bubbleSwitch: false,
                        show: false,
                    })
                }
            }
        } else {
            this.props.navigation.navigate('VerifiedPage', {
                commitSuccess: () => {
                    this.setState({
                        bubbleSwitch: false,
                        show: false,
                    })
                }
            });
        }
    }

    // 查询司机对应企业性质
    queryEnterpriseNature() {
        this.props.httpQueryEnterpriseNatureAction({phone:global.phone})
    }

    getCurrentWeekday(day) {
        let weekday = new Array(7);
        weekday[0] = "周日";
        weekday[1] = "周一";
        weekday[2] = "周二";
        weekday[3] = "周三";
        weekday[4] = "周四";
        weekday[5] = "周五";
        weekday[6] = "周六";
        return weekday[day];
    }

    renderImg(item, index) {
        console.log('------item-----', item);
        return (
            <Image
                style={{
                    width: itemWidth,
                    height: itemHeight,
                }}
                resizeMode='contain'
                source={item.item}
            />
        );
    }


    render() {
        const limitView = this.state.limitNumber || this.state.limitNumber !== '' ?
            <View style={styles.limitViewStyle}>
                <Text style={{
                    fontSize: 14,
                    color: LIGHT_BLACK_TEXT_COLOR,
                    alignSelf: 'center'
                }}>{this.state.limitNumber}</Text>
            </View> : null;
        let date = new Date();

        const driverView = <View style={{marginTop: 10, backgroundColor: WHITE_COLOR, width: width,}}>
            <HomeCell
                title="接单"// 文字
                describe="方便接单，快速查看"
                padding={10}// 文字与文字间距
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}// 背景色
                // badgeText={homePageState === null ? 0 : homePageState.pendingCount}// 消息提示
                renderImage={() => <Image source={receiptIcon}/>}// 图标
                clickAction={() => { // 点击事件
                    if (this.props.driverStatus == 2) {
                        DeviceEventEmitter.emit('resetGood');
                        this.props.navigation.navigate('GoodsSource');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="发运"
                describe="一键发运，安全无忧"
                padding={10}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                // badgeText={homePageState === null ? 0 : homePageState.notYetShipmentCount}
                renderImage={() => <Image source={dispatchIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(1);
                        DeviceEventEmitter.emit('changeOrderTabPage', 1);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="签收"
                describe="签收快捷，免去后顾之忧"
                padding={10}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={signIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(2);
                        DeviceEventEmitter.emit('changeOrderTabPage', 2);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="回单"
                describe="接收回单，方便快捷"
                padding={8}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={receiveIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(3);
                        DeviceEventEmitter.emit('changeOrderTabPage', 3);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="道路异常"
                describe="道路异常，上传分享"
                padding={8}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={roadIcon}/>}
                clickAction={() => {
                    console.log('dianjile ma')
                    this.props.getWeather({city: '北京'});
                    // if (this.props.driverStatus == 2) {
                    //     this.props.navigation.navigate('UploadAbnormal');
                    // } else {
                    //     DeviceEventEmitter.emit('certification');
                    // }
                }}
            />
        </View>;

        const carrierView = <View style={{marginTop: 10, backgroundColor: WHITE_COLOR, width: width,}}>
            <HomeCell
                title="接单"// 文字
                describe="方便接单，快速查看"
                padding={10}// 文字与文字间距
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}// 背景色
                // badgeText={carrierHomePageState === null ? 0 : carrierHomePageState.notYetReceiveCount}// 消息提示
                renderImage={() => <Image source={receiptIcon}/>}// 图标
                clickAction={() => { // 点击事件
                    if (this.props.ownerStatus == 12 || this.props.ownerStatus == 22) {
                        this.props.navigation.navigate('GoodsSource');
                        DeviceEventEmitter.emit('resetGood');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="调度"
                describe="一键调度，快捷无忧"
                padding={10}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                // badgeText={carrierHomePageState === null ? 0 : carrierHomePageState.noDispatchCount}
                renderImage={() => <Image source={dispatchIcon}/>}
                clickAction={() => {
                    if (this.props.ownerStatus == 12 || this.props.ownerStatus == 22) {
                        this.changeOrderTab(1);
                        DeviceEventEmitter.emit('changeOrderTabPage', 1);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
        </View>;

        return <View style={styles.containerView}>

            <View style={{
                height: 64,
                ...Platform.select({
                    ios: {
                        paddingTop: 15,
                    },
                    android: {
                        paddingTop: 0,
                    },
                }),
                flexDirection: 'row',
                alignItems: 'center',

            }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({
                                bubbleSwitch: !this.state.bubbleSwitch,
                                show: !this.state.show,
                            })
                        }}
                    >
                        <View>
                            <Image
                                style={{
                                    marginLeft: 10,
                                    marginTop: 10,
                                }}
                                source={
                                    this.props.currentStatus == 'driver' ?
                                        this.state.bubbleSwitch ? DriverUp : DriverDown
                                        : this.state.bubbleSwitch ? OwnerUp : OwnerDown
                                }
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flex: 2,
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        textAlign: 'center',
                        color: LIGHT_BLACK_TEXT_COLOR,
                        fontSize: 18,
                        marginTop: 10,
                    }}>首页</Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {


                        }}
                    >
                        <View>
                            <Image
                                style={{
                                    marginRight: 10,
                                    marginTop: 10,
                                }}
                                source={
                                    this.props.jpushIcon === true ? MessageNewMine : MessageMine
                                }
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{backgroundColor: '#FFFAF4', height: 35, width, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#F77F4F', fontSize: 15}}>您的当前状态：认证中</Text>
            </View>
            <ScrollView>
                <View style={styles.locationStyle}>
                    <Image source={locationIcon}/>
                    <Text
                        style={styles.locationText}>{this.props.location ? '您所在的位置：' + this.props.location : '定位失败'}</Text>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 0,
                        }}
                        onPress={() => {
                            this.getCurrentPosition(0);
                        }}
                    >
                        <Text style={styles.icon}>&#xe66b;</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Carousel
                        data={images}
                        renderItem={this.renderImg}
                        sliderWidth={width}
                        itemWidth={itemWidth}
                        hasParallaxImages={true}
                        firstItem={1}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.8}
                        enableMomentum={true}
                        loop={true}
                        loopClonesPerSide={2}
                        autoplay={true}
                        autoplayDelay={500}
                        autoplayInterval={3000}
                        removeClippedSubviews={false}
                    />
                </View>


                {true ?
                    <View>
                        <View style={styles.weather}>
                            <View style={styles.date}>
                                <Text style={styles.day}>
                                    {date.getUTCDate()}
                                </Text>
                                <Text style={styles.week}>
                                    {this.getCurrentWeekday(date.getDay())}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginLeft: 20}}>
                                <View style={{
                                    marginRight: 15,
                                    justifyContent: 'center',
                                }}>

                                    <WeatherCell weatherIcon={'晴todo'}/>
                                </View>
                                <Text style={{
                                    marginRight: 10,
                                    fontSize: 14,
                                    color: LIGHT_BLACK_TEXT_COLOR,
                                    alignSelf: 'center'
                                }}> {'天气todo'}</Text>

                                <Text style={{
                                    marginRight: 10,
                                    fontSize: 14,
                                    color: LIGHT_BLACK_TEXT_COLOR,
                                    alignSelf: 'center'
                                }}>{-99}℃/{99}℃</Text>
                            </View>
                            {limitView}
                        </View>
                        {this.props.currentStatus == 'driver' ? driverView : carrierView}
                    </View>
                    :
                    <View style={{marginLeft: 10}}>

                        <View style={{flexDirection: 'row', height: 67, alignItems: 'center'}}>
                            <Image
                                style={{}}
                                source={Fromto}/>
                            <View style={{marginTop: 5, marginLeft: 10}}>
                                <Text style={{height: 23, fontSize: 15, color: '#333333'}}>北京市朝阳区</Text>
                                <Text style={{height: 23, fontSize: 15, color: '#333333'}}>内蒙古自治区呼和浩特市新城区</Text>
                            </View>
                        </View>
                        <LittleButtonCell marginLeft={20} color='#FF6B6B' buttonWidth={30} title='自营'/>

                        <View style={{flexDirection: 'row', height: 67, alignItems: 'center'}}>
                            <View style={{flex: 1.5}}>
                                <Image
                                    style={{}}
                                    source={Fromto}/>
                            </View>
                            <View style={{marginTop: 5, marginLeft: 10, flex: 6.5}}>
                                <View style={{flexDirection: 'row',}}>
                                    <View style={styles.textBackground}>
                                        <Text style={styles.textBackgroundFont}>有</Text>
                                    </View>
                                    <LittleButtonCell marginLeft={8} color='#999999' buttonWidth={30} title='水饺'/>
                                </View>
                                <View style={{flexDirection: 'row', marginTop: 8}}>
                                    <View style={styles.textBackgroundBlue}>
                                        <Text style={styles.textBackgroundFont}>求</Text>
                                    </View>
                                    <LittleButtonCell marginLeft={8} color='#0092FF' buttonWidth={70}
                                                      title='4.2米-7.2米车'/>
                                    <LittleButtonCell marginLeft={8} color='#0092FF' buttonWidth={46} title='冷藏车'/>
                                </View>
                            </View>
                            <View style={{width: 1, backgroundColor: '#E6EAF2'}}/>
                            <View style={{
                                flex: 3,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: 15
                            }}>
                                <Text style={{color: '#FF8500', fontSize: 21}}>2344.00</Text>
                                <Text style={{color: '#666666', fontSize: 14}}>元</Text>
                            </View>
                        </View>
                        <View style={{
                            backgroundColor: '#0092FF',
                            width: 108,
                            height: 34,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: width - 140
                        }}>
                            <Text style={{fontSize: 15, color: '#ffffff'}}>我的报价</Text>
                        </View>
                    </View>
                }
            </ScrollView>
            {this.state.show ?
                <CharacterChooseCell
                    carClick={() => {
                        this.ownerVerifiedHome(this.ownerVerifiedHomeSucCallBack, this.ownerVerifiedHomeFailCallBack);
                    }}
                    driverClick={() => {
                        this.searchDriverState(this.searchDriverStateSucCallBack);
                    }}
                /> : null}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        backgroundColor: DEVIDE_LINE_COLOR,
        height: 0.5,
        marginLeft: 50,
    },
    imageView: {
        paddingRight: 15,
        paddingLeft: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subView: {
        marginLeft: 45,
        marginRight: 45,
        backgroundColor: WHITE_COLOR,
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: LIGHT_GRAY_TEXT_COLOR,
    },
    modalTitle: {
        fontSize: 17,
        color: LIGHT_BLACK_TEXT_COLOR,
        marginTop: 25,
        marginBottom: 20,
        alignSelf: 'center',
    },
    // 水平的分割线
    horizontalLine: {
        height: 1,
        backgroundColor: COLOR_SEPARATE_LINE,
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 17,
        color: BLUE_CONTACT_COLOR,
        textAlign: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: WHITE_COLOR,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
    },
    activeDot: {
        width: 6,
        height: 6,
        backgroundColor: BLUE_CONTACT_COLOR,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
    },
    container: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                height: 50,
            },
        }),
        backgroundColor: WHITE_COLOR,
        width: width,
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: ConstValue.StatusBar_Height,
            },
            android: {
                paddingTop: 0,
            },
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    centerContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    icon: {
        fontFamily: 'iconfont',
        fontSize: 15,
        color: REFRESH_COLOR,
        alignSelf: 'center',
        paddingRight: 15,
    },
    weather: {
        height: 50,
        width: width,
        backgroundColor: WHITE_COLOR,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    day: {
        fontSize: 22,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    date: {
        marginLeft: 20,
    },
    week: {
        fontSize: 13,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    containerView: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },
    limitViewStyle: {
        position: 'absolute',
        right: 0,
        marginRight: 20,
    },
    locationStyle: {
        padding: 10,
        flexDirection: 'row',
    },
    locationText: {
        fontSize: 14,
        color: COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
    },
    divideLine: {
        height: 1,
        backgroundColor: LIGHT_GRAY_TEXT_COLOR,
    },
    textBackground: {
        justifyContent: 'center',
        backgroundColor: '#999999',
        height: 17,
        width: 17,
        alignItems: 'center',
        borderRadius: 2,
    },
    textBackgroundBlue: {
        justifyContent: 'center',
        backgroundColor: '#0092FF',
        height: 17,
        width: 17,
        alignItems: 'center',
        borderRadius: 2,
    },
    textBackgroundFont: {
        fontSize: 10,
        color: '#ffffff',
    },


});


function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
        homePageState: state.app.get('getHomePageCount'),
        carrierHomePageState: state.app.get('getCarrierHomePageCount'),
        jpushIcon: state.jpush.get('jpushIcon'),
        location: state.app.get('locationData'),
        plateNumber: state.user.get('plateNumber'),
        plateNumberObj: state.user.get('plateNumberObj'),
        routes: state.nav.routes,
        userCarList: state.user.get('userCarList'),
        speechSwitchStatus: state.app.get('speechSwitchStatus'),
        versionUrl: state.app.get('versionUrl'),
        driverStatus: state.user.get('driverStatus'),
        ownerStatus: state.user.get('ownerStatus'),
        currentStatus: state.user.get('currentStatus'),
        carrierCode: state.user.get('companyCode'),
    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        setCurrentCharacterAction: (result) => {
            dispatch(setCurrentCharacterAction(result));
        },
        getHomoPageCountAction: (response) => {
            dispatch(getHomePageCountAction(response));
        },
        saveUserCarListAction: (data) => {
            dispatch(saveUserCarList(data));
        },
        saveUserSetCarSuccess: (plateNumberObj) => {
            dispatch(setUserCarAction(plateNumberObj));
        },
        queryEnterpriseNatureAction: (data) => {
            dispatch(queryEnterpriseNatureSuccessAction(data));
        },
        getWeather: (city) => {
            dispatch(fetchData({
                body: {},
                method: 'POST',
                api: API_GET_WEATHER + '?city=' + city.city,
                success: (data) => {
                    console.log('city=', data);
                    dispatch(saveWeather({data}));
                },
                fail: (data) => {
                    console.log('city=', data);
                }
            }));
        },
        vehicleLimit: (params) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_VEHICLE_LIMIT,
                success: (result) => {
                    if (result && result !== '') {
                        this.setState({
                            limitNumber: '今日限行 ' + result,
                        });
                    } else {
                        this.setState({
                            limitNumber: '',
                        });
                    }
                },
                fail: (data) => {

                }
            }));
        },
        getHomePageCountAction: (params) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_INDEX_STATUS_NUM,
                success: (result) => {
                    if (result) {
                        this.props.getHomoPageCountAction(result);
                    }
                },
                fail: (data) => {

                }
            }));
        },
        ownerVerifiedHomeAction: (params, ownerVerifiedHomeSucCallBack, ownerVerifiedHomeFailCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_QUERY_COMPANY_INFO,
                success: (data) => {
                    ownerVerifiedHomeSucCallBack(data);
                },
                fail: (data) => {
                    ownerVerifiedHomeFailCallBack(data);
                }
            }))
        },
        searchDriverStateAction: (params, searchDriverStateSucCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_DRIVER_QUERY_DRIVER_INFO + global.phone,
                success: (data) => {
                    searchDriverStateSucCallBack(data);
                },
            }))
        },
        getUserCarAction: (params, getUserCarSucCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_QUERY_ALL_BIND_CAR_BY_PHONE,
                success: (data) => {
                    getUserCarSucCallBack(data);
                },
            }))
        },
        getUserCarMineAction: (params, getUserCarMineSucCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_QUERY_ALL_BIND_CAR_BY_PHONE,
                success: (data) => {
                    getUserCarMineSucCallBack(data);
                },
            }))
        },
        setUserCarAction: (params, setUserCarSucCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_SET_USER_CAR,
                success: (data) => {
                    setUserCarSucCallBack(data);
                },
            }))
        },
        httpQueryEnterpriseNatureAction: (params) => {
            dispatch(fetchData({
                body: {},
                method: 'POST',
                api: API.API_QUERY_ENTERPRISE_NATURE + params.phone,
                success: (data) => {
                    if(data){
                        this.props.queryEnterpriseNatureAction(data);
                    }
                },
            }))
        },


    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

