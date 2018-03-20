import React from 'react';
import {
    Text,
    Animated,
    NativeModules,
    Platform,
    Alert,
    View,
    Image,
    AppState,
    BackHandler,
    NativeAppEventEmitter,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import styles from '../../../assets/css/main';
import Tabar from '../../components/app/tabBar';
import {
    changeTab,
    showFloatDialog,
    logout,
    appendLogToFile,
    openNotification,
    getGameUrl,
    receiveInSiteNotice,
    upgrade,
    fetchData,
    getInitStateFromDB,
} from '../../action/app';
import { changeOrderTopTab } from '../../action/order';
import Drawer from 'react-native-drawer';
import Linking from '../../utils/linking';
import ControlPanel from '../../components/app/controlPanel';
import Upgrade from '../../components/app/upgrade';
import SplashScreen from 'react-native-splash-screen'
import ICON_ROUTE from '../../../assets/img/app/icon_route.png';
import { CARRIER_DETAIL_INFO, CAR_DETAIL_INFO, CITY_COUNTRY, GAME_ADDRESS, INSITE_NOTICE } from '../../constants/api';
import { updateMsgList, dispatchRefreshMessageList } from '../../action/message';
import BaseComponent from '../../components/common/baseComponent'
import User from '../../models/user';
import Storage from '../../utils/storage';
import JPushModule from 'jpush-react-native';
import {
    saveUserTypeInfoAction,
    loginSuccessAction,
    setUserNameAction,
    setCurrentCharacterAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction,
    saveCompanyInfoAction
} from '../../action/user';
import * as RouteType from '../../constants/routeType';
import Toast from '../../utils/toast'
import Button from '../../components/common/button'
import Geolocation from 'Geolocation'
import codePush from 'react-native-code-push'
import TimeToDoSomething from '../../logUtil/timeToDoSomething.js'
import ReadAndWriteFileUtil from '../../logUtil/readAndWriteFileUtil.js'
import ObjectUitls from '../../utils/objectUitls';
import LoginCharacter from '../../utils/loginCharacter';
import {getAddressWithLocation,getAMapLocation} from '../../logUtil/geolocation.js'
import StorageKey from '../../constants/storageKeys';

const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const getRegistrationIdEvent = "getRegistrationId";

class MainContainer extends BaseComponent {

    constructor(props) {
        if (Platform.OS === 'android') {
            JPushModule.initPush();
            JPushModule.notifyJSDidLoad(() => console.log(''));
        }
        super(props);
        this.state = {
            showUpgrade: false,
            rotateValue: new Animated.Value(0),
            appState: AppState.currentState,
            previousAppStates: '',
        };
        this._routeTab = this._routeTab.bind(this)
        this._changeTab = this._changeTab.bind(this)
        this.handleBack = this.handleBack.bind(this)
        this.openControlPanel = this.openControlPanel.bind(this)
        this._handleAppStateChange = this._handleAppStateChange.bind(this)
        this._pushToMessageList = this._pushToMessageList.bind(this)
        this.codePushStatusDidChange = this.codePushStatusDidChange.bind(this)
        this.codePushDownloadDidProgress = this.codePushDownloadDidProgress.bind(this)
        this._getCurrentPosition = this._getCurrentPosition.bind(this)
        this.insiteNotice = props.navigation.state.params.insiteNotice;
        this._doSomethingAfterReceiveNotification = this._doSomethingAfterReceiveNotification.bind(this)
        this._pushToMessageListWithType = this._pushToMessageListWithType.bind(this)
        console.log(" ==== main reload constructor");
    }

    static propTypes = {
        dispatch: PropTypes.func,
        currentTab: PropTypes.string.isRequired,
        tabs: PropTypes.instanceOf(Immutable.List),
        upgrade: PropTypes.object
    }

    _doSomethingAfterReceiveNotification(map){

        console.log(" === push ", map);
        if (this.state.appState == 'background') {
            this._pushToMessageList(map)//map.messsageType || map.messageType
        }else if(this.state.appState == 'active') {
            const alertTitle = map.messsageType == 2 ? '您有新的系统公告' : '收到一条新消息'//messageType 1=站内信 2=系统公告
            Alert.alert('温馨提示',alertTitle,[
                {
                    text: '忽略',
                    onPress:()=>{}
                },
                {
                    text: '查看',
                    onPress:()=>{
                        this._pushToMessageList(map)
                    }
                }
            ])
        }
    }
    componentWillMount() {
        if (Platform.OS === 'android') BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    async componentDidMount () {
        await Storage.get(StorageKey.USER_INFO).then((userInfo) => {
            if (userInfo && !ObjectUitls.isOwnEmpty(userInfo)){
                // 发送Action,全局赋值用户信息
                this.props.sendLoginSuccessAction(userInfo);
            }
        });
        await Storage.get(StorageKey.USER_CURRENT_STATE).then((status) => {
            if(status){
                this.props.setCurrentCharacterAction(status);
            }
        });
        await Storage.get(StorageKey.USER_TYPE_INFO).then((result) => {
            if (result){
                this.props.saveUserTypeInfoAction(result);
            }
        });
        this._routeTab();
        console.log('------aaa', this.props);
        // JPush
        if (IS_IOS) {
            /**
             * 监听：点击推送事件
             * iOS10 不管APP在前台 还是后台 还是已经被杀死  通过点击通知横幅 都走这个方法
             */
            // 点击通知后，将会触发此事件
            JPushModule.setBadge(0, (success) => {
            });
            console.log(" ==== add listener in did mount ");
            JPushModule.addReceiveOpenNotificationListener(this._pushToMessageList);
            if (NativeModules.NativeModule.IOS_OS_VERSION < 10) {
                JPushModule.addReceiveNotificationListener(this._doSomethingAfterReceiveNotification);
            };
        } else {
            JPushModule.addReceiveOpenNotificationListener(this._pushToMessageList);
        }
        if (Platform.OS === 'android') {
            this.timer = setTimeout(() => {
                SplashScreen.hide()
            }, 2000)
        }

        AppState.addEventListener('change', this._handleAppStateChange);
        // TODO 获取城市列表
        // this.props._getCityOfCountry();
        const value = await Storage.get('float')
        if (value && value * 1 === 1 && this.props.user.userId) {
            // show float dialog
            this.timer = setTimeout(() => this.props.dispatch(showFloatDialog(true)), 2000);
        }
        //
        // const userTypeInfo = await Storage.get(StorageKey.USER_TYPE_INFO);
        //
        // if (!userTypeInfo) {
        //     this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE, mode: 'reset', params: { title: '' } })
        // }else{
        //     const current = global.currentStatus == 'driver' ? 'Home' : 'goods';
        //
        //     this.props.dispatch(changeTab('driver'))
        //     this.props.navigation.setParams({ currentTab: 'driver', title: '' })
        // }


        const { user } = this.props;
        if (!user || !user.userId) {
            this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE, mode: 'reset', params: { title: '' } })
        }else {
            if(this.props.userTypeInfo) {
                LoginCharacter.setCharacter(this.props, this.props.userTypeInfo, 'main');
            }
        }


        this.props.navigation.setParams({ _openControlPanel: this.openControlPanel, currentRole: 2 })

        this.uploadLoglistener = DeviceEventEmitter.addListener('nativeSendMsgToRN', (data) => {
            this._getCurrentPosition();
        })


        // Geolocation.requestAuthorization()
        Geolocation.getCurrentPosition(location => {
            const locationData = getAMapLocation(location.coords.longitude, location.coords.latitude)
            global.locationData = locationData
        }, fail => {
            // console.log('-------fail:', fail)
        }, {
            timeout: 10 * 1000,
            maximumAge: 60 * 1000,
            enableHighAccuracy: false
        })
    }

    _getCurrentPosition(){
        // console.log(" -- main getcurrent this",this);
        const {user} = this.props
        if (!(user && user.userId)) {
            // console.log("   用户未登录 不提交日志 ");
            return
        }
        Geolocation.getCurrentPosition(location => {
            const locationData = getAMapLocation(location.coords.longitude, location.coords.latitude)
            global.locationData = locationData
            // console.log("定位信息",global.locationData);
            //todo 上传日志开关
            // TimeToDoSomething.uploadDataFromLocalMsg();
        }, fail => {
            // console.log('-------fail:', fail)
        }, {
            timeout: 10 * 1000,
            maximumAge: 60 * 1000,
            enableHighAccuracy: false
        })
    }
    _handleAppStateChange(appState) {
        const previousAppStates = this.state.appState
        // console.log(" ====== previousAppStates appState = ",previousAppStates,appState);
        this.setState({
            appState,
            previousAppStates,
        });
    }

    componentWillReceiveProps(props) {
        if (props && !props.legalAccount) {
            new User().delete();
            props.dispatch(logout());
            this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE, mode: 'reset', params: { title: '' } })
        }
    }

    _pushToMessageList(message){// messageType 1=站内信 2=系统公告
        if (message && message.extras && IS_ANDROID){
            const extras = JSON.parse(message.extras)
            message.messageType = extras.messsageType
        }
        const messageType = message.messsageType || message.messageType || 1
        if (messageType == 1) {
            // 站内信
            this._pushToMessageListWithType(1)
        }else{
            // 公告
            Storage.get('user').then(result => {
                if (result && result.userId) {
                    this._pushToMessageListWithType(2)
                }
            });
        }
    }
    _pushToMessageListWithType(messageType){
        const currentRoute = this.props.nav.routes[this.props.nav.index].routeName
        if (currentRoute === RouteType.ROUTE_MESSAGE_LIST) {
            this.props.dispatch(dispatchRefreshMessageList())
        } else if (currentRoute.key === RouteType.ROUTE_MESSAGE_DETAIL) {
            this.props.navigation.dispatch({ type: 'pop' })
        } else {
            this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST,params: { title: '消息', currentTab: parseInt(messageType) -1} })
        }
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.timer && clearTimeout(this.timer)
        this.uploadLoglistener && this.uploadLoglistener.remove()

        if (IS_ANDROID) {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
            JPushModule.removeReceiveCustomMsgListener();
            JPushModule.removeReceiveNotificationListener();
        }else{
            JPushModule.removeReceiveOpenNotificationListener(this._pushToMessageList);
            JPushModule.removeReceiveNotificationListener(this._doSomethingAfterReceiveNotification)
        }
    }

    handleBack () {
        let routeName = this.props.nav.routes.length>0?this.props.nav.routes[this.props.nav.index].routeName:'';
        if (routeName === 'ROUTE_LOGIN' || routeName === 'ROUTE_CAR_LOGIN') {
            return true;
        }


        if (this.props.nav.routes.length > 1) {
            this.props.navigation.dispatch({ type: 'pop' })
            return true
        }

        Storage.save('float', '2');
        this.props.dispatch(showFloatDialog(false));

        if (this.lastPressTimer && this.lastPressTimer + 2000 >= Date.now()) {
            return false
        }
        Toast.show('再按一次退出')
        this.lastPressTimer = Date.now()
        return true
    }

    codePushStatusDidChange (status) {
        switch(status) {
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.props.dispatch(upgrade({
                    text: '正在下载更新内容',
                    busy: true,
                    downloaded: false,
                }));
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                this.props.dispatch(upgrade({
                    text: '正在更新内容',
                    busy: true,
                    downloaded: true,
                }));
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                this.props.dispatch(upgrade({
                    text: '更新成功',
                    busy: true,
                    downloaded: true,
                }));
                break;
        }
    }

    codePushDownloadDidProgress (progress) {
        this.props.dispatch(upgrade({
            busy: true,
            progress: parseInt((progress.receivedBytes / progress.totalBytes) * 100) + '%' ///*+ '--' + receive + '/' + total*/
        }));
    }

    _renderBadge(badgeCount) {
        if (!badgeCount) {
            return null;
        }
        return (
            <Image style={ styles.badgeBg } source={ require('../../../assets/img/app/message_num_bg.png') }>
                <Text style={ styles.badgeText }>{ badgeCount }</Text>
            </Image>
        );
    }

    _changeTab(tab) {
        this.props.dispatch(changeTab(tab))
        this.props.navigation.setParams({ currentTab: tab, title: '' })
    }

    openControlPanel () {
        this._drawer.open();
        // get user detail info
        let opts;
        if (this.props.user.currentUserRole === 1) {
            opts = {};
        } else {
            opts = {
                carrierId: this.props.user.carrierId,
                driverId: this.props.user.userId
            };
        }

        this.props._getUserInfo(opts, this.props.user.currentUserRole);
        // game url
        this.props.getUrl({
            phone: this.props.user.phoneNumber
        });
        this.props.dispatch(appendLogToFile('我的行程','查看个人中心',0))
    }

    _routeTab () {
        Animated.timing(this.state.rotateValue,
            {
                toValue: 1
            }
        ).start(() => this.state.rotateValue.setValue(0));
        console.log('currentStatus=',global.currentStatus);
        this.props.dispatch(changeTab(global.currentStatus == 'driver' ? 'Home' : 'goods'));
    }

    render() {
        const { upgrade } = this.props;
        return (
            <Drawer
                tapToClose={ true }
                tweenDuration={ 200 }
                content={ <ControlPanel { ...this.props } drawer={this._drawer}/> }
                style={ styles.container }
                openDrawerOffset={ 100 }
                ref={ (ref) => this._drawer = ref }
                tweenHandler={(ratio) => ({
          main: { opacity: (2-ratio) / 2 }
        })}>

                <Tabar
                    { ...this.props }
                    note={this.insiteNotice}
                    changeTab={ this._changeTab }
                    openControlPanel={ this.openControlPanel } />

                { this._renderUpgrade(this.props) }

            </Drawer>
        );
    }

}

const mapStateToProps = (state) => {
    const { app, nav, user } = state;
    return {
        nav,
        user: user.get('userInfo'),
        tabs: app.get('tabs'),
        driverTabs: app.get('driverTabs'),
        upgrade: app.get('upgrade'),
        appState: app.get('appState'),
        currentTab: app.get('currentTab'),
        currentStatus: user.get('currentStatus'),
        legalAccount: app.get('legalAccount'),
        upgradeForce: app.get('upgradeForce'),
        upgradeForceUrl: app.get('upgradeForceUrl'),
        showFloatDialog: app.get('showFloatDialog'),
        openNotification: app.get('openNotification'),
        userTypeInfo: user.get('userTypeInfo')
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        _getCityOfCountry: () => {
            dispatch(fetchData({
                api: CITY_COUNTRY,
                method: 'GET',
                cache: true,
                cacheType: 'city'
            }));
        },
        _getUserInfo: (body, role) => {
            dispatch(fetchData({
                body,
                method: 'GET',
                api: role === 1 ? CARRIER_DETAIL_INFO : CAR_DETAIL_INFO,
                success: (data) => {
                    if (!data) return;
                    const user = new User({
                        carId: data.carId,
                        carrierType: data.carrierType,
                        certificationStatus: data.certificationStatus,
                        certificationTime: data.certificationTime,
                        companyName: data.companyName,
                        phoneNumber: data.phoneNumber || data.driverPhone,
                        username: data.username,
                        carrierId: data.carrierId,
                        driverName: data.driverName,
                        userId: role === 1 ? data.id : data.driverId,
                        driverNumber: data.driverNumber,
                        currentUserRole: body.carrierId ? 2 : 1,
                        corporation: data.corporation,
                    });
                    user.save();
                    dispatch(getInitStateFromDB());
                }
            }));
        },
        _changeOrderTopTab:(activeTab,activeSubTab)=>{
            dispatch(changeTab('order'))
            dispatch(changeOrderTopTab(activeTab,activeSubTab))
        },
        getUrl: (body) => {
            dispatch(fetchData({
                body,
                method: 'GET',
                api: GAME_ADDRESS,
                success: (data) => {
                    dispatch(getGameUrl(data))
                },
            }));
        },
        getNotice: ()=>{
            //// 承运方 1 委托方2
            dispatch(fetchData({
                body: {
                    publishTarget: 1
                },
                method: 'POST',
                api: INSITE_NOTICE,
                success: (data) => {
                    let noticeContent = ''
                    if (data && data.length > 0) {
                        data.forEach((item,index,array)=>{
                            noticeContent = noticeContent + (index == 0 ? '' : '            ') + item.noteContent
                        })
                    };
                    dispatch(receiveInSiteNotice(noticeContent))
                },
            }));
        },
        saveUserTypeInfoAction:(result)=>{
            dispatch(saveUserTypeInfoAction(result));
        },
        sendLoginSuccessAction: (result) => {
            dispatch(loginSuccessAction(result));
            dispatch(setUserNameAction(result.userName ? result.userName : result.phone))
        },
        setCurrentCharacterAction: (result) => {
            dispatch(setCurrentCharacterAction(result));
        },
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
        setCompanyCodeAction: (result) => {
            dispatch(setCompanyCodeAction(result));
        },
        setOwnerNameAction:(data)=>{
            dispatch(setOwnerNameAction(data));
        },
        saveCompanyInfoAction: (result) => {
            dispatch(saveCompanyInfoAction(result));
        },

    }
}

Main = codePush({
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    updateDialog: {
        title: '温馨提示',
        descriptionPrefix: '',
        optionalUpdateMessage: '',
        appendReleaseDescription: true,
        optionalInstallButtonLabel: '更新',
        optionalIgnoreButtonLabel: '暂不更新',
        mandatoryUpdateMessage: '即将更新app',
        mandatoryContinueButtonLabel: '更新',
    }
})(MainContainer)
codePush.allowRestart()

export default connect(mapStateToProps, mapDispatchToProps)(Main);
