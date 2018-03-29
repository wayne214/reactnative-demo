import React, {Component} from 'react';
import {connect} from 'react-redux';
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
    locationAction,
    saveWeather
} from '../../action/home';
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
import * as API from '../../constants/api';
import * as ConstValue from '../../constants/constValue';
import Carousel from 'react-native-snap-carousel';
import HomeCell from '../../components/home/homeCell';
import {
    fetchData,
    getHomePageCountAction,
    changeTab,
    updateVersionAction,
} from '../../action/app';
import {
    changeOrderTabAction,
    refreshDriverOrderList,
} from '../../action/driverOrder'
import {
    saveUserCarList,
    setUserCarAction,
    setCurrentCharacterAction,
    queryEnterpriseNatureSuccessAction,
    setOwnerCharacterAction,
    setCompanyCodeAction,
    saveCompanyInfoAction,
    setDriverCharacterAction
} from '../../action/user';

import WeatherCell from '../../components/home/weatherCell';
import CharacterChooseCell from '../../../src/components/login/characterChooseCell';
import Toast from '../../utils/toast';

import JPushModule from 'jpush-react-native';
import LittleButtonCell from '../../components/home/littleButtonCell';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import {width, height} from '../../constants/dimen';
import NavigatorBar from '../../components/common/navigatorbar';
import DeviceInfo from 'react-native-device-info';

import DriverUp from '../../../assets/img/character/driverUp.png';
import DriverDown from '../../../assets/img/character/driverDown.png';
import OwnerUp from '../../../assets/img/character/ownerUp.png';
import OwnerDown from '../../../assets/img/character/ownerDown.png';
import MessageNewMine from '../../../assets/img/oldMine/newMessage.png';
import MessageMine from '../../../assets/img/oldMine/message.png';
import locationIcon from '../../../assets/home/location.png';
import bannerImage1 from '../../../assets/home/banner1.png';
import bannerImage2 from '../../../assets/home/banner2.png';
import signIcon from '../../../assets/home/sign_icon.png';
import receiptIcon from '../../../assets/home/receipt_icon.png';
import dispatchIcon from '../../../assets/home/despatch_icon.png';
import receiveIcon from '../../../assets/home/receive_icon.png';
import roadIcon from '../../../assets/home/road_abnormality.png';

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

let currentTime = 0;
let lastTime = 0;
let locationData = '';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            acceptMessge: '',
            plateNumber: '',
            setUserCar: false,
            limitNumber: '',
            plateNumberObj: {},
            modalVisible: false,
            character: '司机',
            bubbleSwitch: false,
            show: false,
            // CarOwnerState: params ? params.CarOwnerState : ''
        };

        this.getCurrentPosition = this.getCurrentPosition.bind(this);
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
        this.compareVersion = this.compareVersion.bind(this);

    }


    componentWillReceiveProps(nextProps) {
        if (this.props.location !== nextProps.location) {
            this.getWeather(nextProps.location);
            this.vehicleLimit(nextProps.location);
        }
    }

    componentDidMount() {
        const {userInfo} = this.props;
        if (userInfo && userInfo.userId) {
            this.getCurrentPosition(0);
            if (this.props.currentStatus == 'driver') {
                this.compareVersion();
                this.queryEnterpriseNature();
            }
        }

        this.listener = DeviceEventEmitter.addListener('refreshHome', (data) => {
            const {userInfo} = this.props;
            if(data){
                this.getHomePageCount(data, userInfo.phone)
            }else {
                if (this.props.plateNumber) {
                    this.getHomePageCount(this.props.plateNumber, userInfo.phone)
                }
            }
        });

    }

    componentWillUnmount() {
        this.listener.remove();
    }

    compareVersion() {
        currentTime = new Date().getTime();
        this.props.compareVersionAction({
            version: DeviceInfo.getVersion(),
            platform: Platform.OS === 'ios' ? '1': '2',
        }, (result)=>{
            lastTime = new Date().getTime();
            ReadAndWriteFileUtil.appendFile('版本对比', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                locationData.district, lastTime - currentTime, '首页');
            if (result) {
                this.props.updateVersion(result); // 升级正式的时候放开
                // this.setData();
            }else {
                this.setData();
            }
        }, ()=>{
            this.setData();
        });
    }

    // 获取当前位置
    getCurrentPosition(type) {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            this.props.getLocationAction(data.city);
            locationData = data;
            if (type === 1) {
                ReadAndWriteFileUtil.appendFile('定位', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, 0, '定位');
                // TimeToDoSomething.uploadDataFromLocalMsg();
            } else {
                this.getWeather(data.city);
                if (this.props.currentStatus == 'driver') {
                    this.vehicleLimit(data.city);
                }
            }
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    setData() {
        Storage.get(StorageKey.CarSuccessFlag).then((value) => {
            console.log('---value', value);
            if (value && value * 1 === 1) {
                this.getUserCar();
            } else {
                setTimeout(() => {
                    // 开发中reload后，保存车辆列表信息，后面切换车辆会用到
                    Storage.get(StorageKey.userCarList).then((carList) => {
                        this.saveUserCarList(carList);
                    });
                    Storage.get(StorageKey.PlateNumberObj).then((plateNumObj) => {
                        if (plateNumObj) {
                            const plateNumber = plateNumObj.carNum;
                            console.log('home_plateNumber=', plateNumber);
                            if (plateNumber !== null) {
                                this.setState({
                                    plateNumber: plateNumber,
                                    plateNumberObj: plateNumObj,
                                });
                                if (value === 3) {
                                    const {userInfo} = this.props;
                                    this.saveUserCarInfo(plateNumObj);
                                    this.getHomePageCount(plateNumber, userInfo.phone);
                                } else {
                                    if (plateNumber) {
                                        this.setUserCar(plateNumber, this.setUserCarSuccessCallBack);
                                    }
                                }
                            }
                        }
                    });
                }, 200);
            }
        });
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
        this.props.vehicleLimit(cityName,
            (result) => {
                if (result && result !== '') {
                    this.setState({
                        limitNumber: '今日限行 ' + result,
                    });
                } else {
                    this.setState({
                        limitNumber: '',
                    });
                }
            });
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
                this.props.navigation.dispatch({
                    type: RouteType.ROUTE_CHOOSE_CAR,
                    params: {
                        carList: result,
                        currentCar: '',
                        flag: true,
                    }
                })
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
    setUserCar(plateNumber, setUserCarSucCallBack) {
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
        this.props._refreshOrderList(0);
        this.props._refreshOrderList(1);
        this.props._refreshOrderList(2);
        this.props._refreshOrderList(3);
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

        console.log('ownerVerifiedState==', result);
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
                    this.props.dispatch(changeTab('goods'));

                    this.setState({
                        bubbleSwitch: false,
                        show: false,
                    })
                } else {
                    if (result.certificationStatus == '1202') {
                        this.props.setCompanyCodeAction(result.companyCode);
                        this.props.saveCompanyInfoAction(result);
                        this.props.setOwnerCharacterAction('12');
                        this.props.setCurrentCharacterAction('personalOwner');
                        this.props.dispatch(changeTab('goods'));
                        this.setState({
                            bubbleSwitch: false,
                            show: false,
                        })
                    } else {
                        this.props.setOwnerCharacterAction('13');
                        this.props.navigation.dispatch({
                            type: RouteType.ROUTE_PERSON_OWNER_VERIFIED,
                            params: {
                                comeFrom: 'home'
                            }
                        });
                        // this.props.navigation.navigate('PersonownerVerifiedStatePage');
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
                        this.props.dispatch(changeTab('goods'));

                        this.setState({
                            bubbleSwitch: false,
                            show: false,
                        })
                    } else {
                        if (result.certificationStatus == '1202') {
                            this.props.setCompanyCodeAction(result.companyCode);
                            this.props.saveCompanyInfoAction(result);
                            this.props.setOwnerCharacterAction('22');
                            this.props.setCurrentCharacterAction('businessOwner');
                            this.props.dispatch(changeTab('goods'));
                            this.setState({
                                bubbleSwitch: false,
                                show: false,
                            })
                        } else {
                            this.props.setOwnerCharacterAction('23');
                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_ENTERPRISE_OWNER_VERIFIED_DETAIL,
                                params: {
                                    comeFrom: 'home'
                                }
                            });
                            // this.props.navigation.navigate('EnterpriseownerVerifiedStatePage');
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
                            this.props.navigation.dispatch({
                               type: RouteType.ROUTE_DRIVER_VERIFIED,
                               params: {resultInfo: value, commitSuccess: () => {
                                   this.setState({
                                       bubbleSwitch: false,
                                       show: false,
                                   })
                               }}
                            });
                            // this.props.navigation.navigate('VerifiedPage', {
                            //     resultInfo: value,
                            //     commitSuccess: () => {
                            //         this.setState({
                            //             bubbleSwitch: false,
                            //             show: false,
                            //         })
                            //     }
                            // });
                        } else {
                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_DRIVER_VERIFIED,
                                params: { commitSuccess: () => {
                                    this.setState({
                                        bubbleSwitch: false,
                                        show: false,
                                    })
                                }}
                            });
                            // this.props.navigation.navigate('VerifiedPage', {
                            //     commitSuccess: () => {
                            //         this.setState({
                            //             bubbleSwitch: false,
                            //             show: false,
                            //         })
                            //     }
                            // });
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
            this.props.navigation.dispatch({
                type: RouteType.ROUTE_DRIVER_VERIFIED,
                params: { commitSuccess: () => {
                    this.setState({
                        bubbleSwitch: false,
                        show: false,
                    })
                }}
            });
            // this.props.navigation.navigate('VerifiedPage', {
            //     commitSuccess: () => {
            //         this.setState({
            //             bubbleSwitch: false,
            //             show: false,
            //         })
            //     }
            // });
        }
    }

    // 查询司机对应企业性质
    queryEnterpriseNature() {
        this.props.httpQueryEnterpriseNatureAction({phone: global.phone})
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

    // 切换订单tab
    changeOrderTab(orderTab) {
        this.props._changeOrderTab(orderTab);
    }


    render() {
        const {homePageState} = this.props;
        const limitView =  1==1 ?
            <View style={styles.limitViewStyle}>
                <Text style={{
                    fontSize: 14,
                    color: LIGHT_BLACK_TEXT_COLOR,
                    alignSelf: 'center'
                }}>{this.state.limitNumber}</Text>
            </View> : null;
        let date = new Date();
        let stateView;
        if (this.props.currentStatus == 'driver') {
            switch (this.props.driverStatus) {
                case '1' || 1:
                    stateView =
                        <View style={{backgroundColor: '#FFFAF4', height: 35, width, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#F77F4F', fontSize: 15}}>您的当前状态：认证中</Text>
                        </View>
                    break;
                case '2' || 2:
                    stateView = null;
                    break;
                case '3' || 3:
                    stateView =
                        <View style={{backgroundColor: '#FFFAF4', height: 35, width, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#F77F4F', fontSize: 15}}>您的当前状态：认证驳回</Text>
                        </View>
                    break;
                default:
                    stateView = null;
                    break;
            }

        }

        const driverView = <View style={{marginTop: 10, backgroundColor: WHITE_COLOR, width: width,}}>
            <HomeCell
                title="接单"// 文字
                describe="方便接单，快速查看"
                padding={10}// 文字与文字间距
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}// 背景色
                badgeText={homePageState === null ? 0 : homePageState.pendingCount}// 消息提示
                renderImage={() => <Image source={receiptIcon}/>}// 图标
                clickAction={() => { // 点击事件
                    if (this.props.driverStatus == 2) {
                        this.props._changeBottomTab('driverGoods');
                        DeviceEventEmitter.emit('resetGood')
                    } else {
                        {/*DeviceEventEmitter.emit('certification');*/}
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
                badgeText={homePageState === null ? 0 : homePageState.notYetShipmentCount}
                renderImage={() => <Image source={dispatchIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.props._changeBottomTab('driverOrder');
                        this.changeOrderTab(1);
                        this.props._refreshOrderList(1);
                    } else {
                        {/*DeviceEventEmitter.emit('certification');*/}
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
                        this.props._changeBottomTab('driverOrder');
                        this.changeOrderTab(2);
                        this.props._refreshOrderList(2);
                    } else {
                        {/*DeviceEventEmitter.emit('certification');*/}
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
                        this.props._changeBottomTab('driverOrder');
                        this.changeOrderTab(3);
                        this.props._refreshOrderList(3);
                    } else {
                        {/*DeviceEventEmitter.emit('certification');*/}
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
                    if(this.props.driverStatus == 2) {
                        this.props.navigation.dispatch({
                            type: RouteType.ROUTE_UPLOAD_ABNORMAL_PAGE,
                        });
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
                backgroundColor: '#ffffff'

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
                                    marginLeft: 15,
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
                        fontSize: 19,
                        marginTop: 10,
                        fontWeight: 'bold'
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
                            this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }})

                            // this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST_PAGE})
                        }}
                    >
                        <View>
                            <Image
                                style={{
                                    marginRight: 15,
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
            <View style={{backgroundColor: '#e6eaf2', height: 0.5}}/>
            {stateView}
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
                        <Text style={styles.icon}>&#xe695;</Text>
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
                                <WeatherCell weatherIcon={this.props.weather.weather}/>
                            </View>
                            <Text style={{
                                marginRight: 10,
                                fontSize: 14,
                                color: LIGHT_BLACK_TEXT_COLOR,
                                alignSelf: 'center'
                            }}> {this.props.weather.weather ? this.props.weather.weather : '暂无'}</Text>

                            <Text style={{
                                marginRight: 10,
                                fontSize: 14,
                                color: LIGHT_BLACK_TEXT_COLOR,
                                alignSelf: 'center'
                            }}>{this.props.weather.temperatureLow ?
                                this.props.weather.temperatureLow : '--'}℃/{this.props.weather.temperatureHigh ?
                                this.props.weather.temperatureHigh : '--'}℃</Text>
                        </View>
                        {limitView}
                    </View>
                    {driverView}
                </View>
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
        backgroundColor: '#e6eaf2',
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
        jpushIcon: state.jpush.get('jpushIcon'),
        location: state.home.get('location'),
        plateNumber: state.user.get('plateNumber'),
        plateNumberObj: state.user.get('plateNumberObj'),
        routes: state.nav.routes,
        userCarList: state.user.get('userCarList'),
        versionUrl: state.app.get('versionUrl'),
        driverStatus: state.user.get('driverStatus'),
        ownerStatus: state.user.get('ownerStatus'),
        currentStatus: state.user.get('currentStatus'),
        carrierCode: state.user.get('companyCode'),
        weather: state.home.get('weather'),
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
        getLocationAction: (data) => {
            dispatch(locationAction(data));
        },
        getWeather: (city) => {
            dispatch(fetchData({
                body: {},
                method: 'POST',
                api: API.API_GET_WEATHER + '?city=' + city.city,
                success: (data) => {
                    console.log('city=', data);
                    dispatch(saveWeather({data}));
                },
                fail: (data) => {
                    console.log('city=', data);
                }
            }));
        },
        vehicleLimit: (params,callBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_VEHICLE_LIMIT,
                success: (result) => {
                    console.log('限行', result);
                    callBack && callBack(result)
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
                        dispatch(getHomePageCountAction(result));
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
                        dispatch(queryEnterpriseNatureSuccessAction(data));
                    }
                },
            }))
        },
        _changeBottomTab: (tab) => {
            dispatch(changeTab(tab));
        },
        _changeOrderTab: (orderTab) => {
            dispatch(changeOrderTabAction(orderTab));
        },
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        },
        setCompanyCodeAction: (result) => {
            dispatch(setCompanyCodeAction(result));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
        saveCompanyInfoAction: (result) => {
            dispatch(saveCompanyInfoAction(result));
        },
        updateVersion: (data) => {
            dispatch(updateVersionAction(data));
        },
        compareVersionAction: (params, compareSuccessCallBack, compareFailCallBack) => {
            dispatch(fetchData({
                api: API.API_COMPARE_VERSION,
                body: {
                    version: params.version,
                    platform: params.platform,
                },
                success: (data) => {
                    console.log('compare version success', data);
                    compareSuccessCallBack && compareSuccessCallBack(data);
                },
                fail: (err) => {
                    console.log('???', err);
                    compareFailCallBack && compareFailCallBack(err);
                },
            }));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

