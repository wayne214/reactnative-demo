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
import { changeTab, showFloatDialog, logout, appendLogToFile } from '../../action/app';
import { changeOrderTopTab } from '../../action/order';
import Drawer from 'react-native-drawer';
import Linking from '../../utils/linking';
import ControlPanel from '../../components/app/controlPanel';
import Upgrade from '../../components/app/upgrade';
// import Image from '../../components/common/image';
import SplashScreen from 'react-native-splash-screen'
import NavigatorBar from '../../components/common/navigatorbar';
import ICON_ROUTE from '../../../assets/img/app/icon_route.png';
import { fetchData, getInitStateFromDB, setAppState, redictLogin, getGameUrl, receiveInSiteNotice, upgrade } from '../../action/app';
import { CARRIER_DETAIL_INFO, CAR_DETAIL_INFO, CITY_COUNTRY, GAME_ADDRESS, INSITE_NOTICE } from '../../constants/api';
import { updateMsgList, dispatchRefreshMessageList } from '../../action/message';
import BaseComponent from '../../components/common/baseComponent'
import User from '../../models/user';
import Storage from '../../utils/storage';
import JPushModule from 'jpush-react-native';
import { openNotification } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import Toast from '../../utils/toast'
// import LoginContainer from '../user/shipperLogin';
import Button from '../../components/common/button'
import Geolocation from 'Geolocation'
import codePush from 'react-native-code-push'
import TimeToDoSomething from '../../logUtil/timeToDoSomething.js'
import ReadAndWriteFileUtil from '../../logUtil/readAndWriteFileUtil.js'

import {getAddressWithLocation,getAMapLocation} from '../../logUtil/geolocation.js'

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
            const alertTitle = map.messsageType == 2 ? '鎮ㄦ湁鏂扮殑绯荤粺鍏憡' : '鏀跺埌涓�鏉℃柊娑堟伅'//messageType 1=绔欏唴淇� 2=绯荤粺鍏憡
            Alert.alert('娓╅Θ鎻愮ず',alertTitle,[
                {
                    text: '蹇界暐',
                    onPress:()=>{}
                },
                {
                    text: '鏌ョ湅',
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
        this._routeTab();
        console.log('------aaa', this.props);

        // JPush
        if (IS_IOS) {
            /**
             * 鐩戝惉锛氱偣鍑绘帹閫佷簨浠�
             * iOS10 涓嶇APP鍦ㄥ墠鍙� 杩樻槸鍚庡彴 杩樻槸宸茬粡琚潃姝�  閫氳繃鐐瑰嚮閫氱煡妯箙 閮借蛋杩欎釜鏂规硶
             */
            // 鐐瑰嚮閫氱煡鍚庯紝灏嗕細瑙﹀彂姝や簨浠�
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
        // TODO 鑾峰彇鍩庡競鍒楄〃
        // this.props._getCityOfCountry();
        const value = await Storage.get('float')
        if (value && value * 1 === 1 && this.props.user.userId) {
            // show float dialog
            this.timer = setTimeout(() => this.props.dispatch(showFloatDialog(true)), 2000);
        }
        const { user } = this.props;
        if (!user || !user.userId) {
            this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE, mode: 'reset', params: { title: '' } })
        }
        this.props.navigation.setParams({ _openControlPanel: this.openControlPanel, currentRole: user.currentUserRole })

        this.uploadLoglistener = DeviceEventEmitter.addListener('nativeSendMsgToRN', (data) => {
            this._getCurrentPosition();
        })

        // 鑾峰彇绔欏唴鍏憡
        if(user.userId){
            // this.props.getNotice()
        }
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
            // console.log("   鐢ㄦ埛鏈櫥褰� 涓嶆彁浜ゆ棩蹇� ");
            return
        }
        Geolocation.getCurrentPosition(location => {
            const locationData = getAMapLocation(location.coords.longitude, location.coords.latitude)
            global.locationData = locationData
            // console.log("瀹氫綅淇℃伅",global.locationData);
            //todo 涓婁紶鏃ュ織寮�鍏�
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

    _pushToMessageList(message){// messageType 1=绔欏唴淇� 2=绯荤粺鍏憡
        if (message && message.extras && IS_ANDROID){
            const extras = JSON.parse(message.extras)
            message.messageType = extras.messsageType
        }
        const messageType = message.messsageType || message.messageType || 1
        if (messageType == 1) {
            // 绔欏唴淇�
            this._pushToMessageListWithType(1)
        }else{
            // 鍏憡
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
            this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST,params: { title: '娑堟伅', currentTab: parseInt(messageType) -1} })
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
        Toast.show('鍐嶆寜涓�娆￠��鍑�')
        this.lastPressTimer = Date.now()
        return true
    }

    codePushStatusDidChange (status) {
        switch(status) {
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.props.dispatch(upgrade({
                    text: '姝ｅ湪涓嬭浇鏇存柊鍐呭',
                    busy: true,
                    downloaded: false,
                }));
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                this.props.dispatch(upgrade({
                    text: '姝ｅ湪鏇存柊鍐呭',
                    busy: true,
                    downloaded: true,
                }));
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                this.props.dispatch(upgrade({
                    text: '鏇存柊鎴愬姛',
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
        this.props.dispatch(appendLogToFile('鎴戠殑琛岀▼','鏌ョ湅涓汉涓績',0))
    }

    _routeTab () {
        Animated.timing(this.state.rotateValue,
            {
                toValue: 1
            }
        ).start(() => this.state.rotateValue.setValue(0));
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
    const { app, nav } = state;
    return {
        nav,
        user: app.get('user'),
        tabs: app.get('tabs'),
        driverTabs: app.get('driverTabs'),
        upgrade: app.get('upgrade'),
        appState: app.get('appState'),
        currentTab: app.get('currentTab'),
        legalAccount: app.get('legalAccount'),
        upgradeForce: app.get('upgradeForce'),
        upgradeForceUrl: app.get('upgradeForceUrl'),
        showFloatDialog: app.get('showFloatDialog'),
        openNotification: app.get('openNotification')
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
            //// 鎵胯繍鏂� 1 濮旀墭鏂�2
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
        }
    }
}

Main = codePush({
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    updateDialog: {
        title: '娓╅Θ鎻愮ず',
        descriptionPrefix: '',
        optionalUpdateMessage: '',
        appendReleaseDescription: true,
        optionalInstallButtonLabel: '鏇存柊',
        optionalIgnoreButtonLabel: '鏆備笉鏇存柊',
        mandatoryUpdateMessage: '鍗冲皢鏇存柊app',
        mandatoryContinueButtonLabel: '鏇存柊',
    }
})(MainContainer)
codePush.allowRestart()

export default connect(mapStateToProps, mapDispatchToProps)(Main);