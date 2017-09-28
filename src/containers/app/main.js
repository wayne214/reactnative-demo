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
  }

  static propTypes = {
    dispatch: React.PropTypes.func,
    currentTab: React.PropTypes.string.isRequired,
    tabs: React.PropTypes.instanceOf(Immutable.List),
    upgrade: React.PropTypes.object
  }

  componentWillMount() {
    if (Platform.OS === 'android') BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  async componentDidMount () {

    if (Platform.OS === 'android') {
      this.timer = setTimeout(() => {
  			SplashScreen.hide()
  		}, 2000)
    }

    AppState.addEventListener('change', this._handleAppStateChange);
    this.props._getCityOfCountry();
    const value = await Storage.get('float')
    if (value && value * 1 === 1 && this.props.user.userId) {
      // show float dialog
      this.timer = setTimeout(() => this.props.dispatch(showFloatDialog(true)), 2000);
    }
    const { user } = this.props;
    if (!user || !user.userId) {
      this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN, mode: 'reset', params: { title: '' } })
    }
    this.props.navigation.setParams({ _openControlPanel: this.openControlPanel, currentRole: user.currentUserRole })


    // JPush

  /**
   * iOS Only
   * 监听：应用没有启动的状态点击推送打开应用
   * @param {Function} cb = (notification) => {}
   */
    JPushModule.addOpenNotificationLaunchAppListener( (notification) => {
      console.log(" ===== 监听：应用没有启动的状态点击推送打开应用 ",notification);
      // Alert.alert('应用没有启动的状态点击推送打开应用','3qrwwqer',[{text: 'ok',onPress:()=>{}}])
    })

    /**
     * 监听：接收推送事件
     * @param {} cb = (Object）=> {}
     */
    if (Platform.OS === 'ios' && NativeModules.NativeModule.IOS_OS_VERSION < 10) {
      JPushModule.addReceiveNotificationListener((map) => {
        const currentRoute = this.props.nav.routes[this.props.nav.index].routeName
        if (currentRoute === RouteType.ROUTE_MESSAGE_LIST) {
          /**
           * 如果当前在消息列表 肯定已经登录 直接刷新
           */
          this._pushToMessageList(map.messsageType || map.messageType)
        }else{
          const alertTitle = map.messsageType == 2 ? '您有新的系统公告' : '收到一条新消息'//messageType 1=站内信 2=系统公告
          // 不在消息列表 alert 提醒
          Alert.alert('温馨提示',alertTitle,[
            {
              text: '忽略',
              onPress:()=>{}
            },
            {
              text: '查看',
              onPress:()=>{
                this._pushToMessageList(map.messsageType || map.messageType)
              }
            }
          ])
        }
        console.log(" ===== addReceiveNotificationListener ",map);
      });
    };


    if (Platform.OS === 'ios') {
      // 每次启动后清空角标
      JPushModule.setBadge(0, (success) => {
        console.log(success)
      });
    } else {
      JPushModule.addReceiveCustomMsgListener((message) => {
        console.log("收到 android 自定义消息 ",message);
      });
      JPushModule.addReceiveNotificationListener((message) => {
        console.log("收到 Android 通知: ",message);
      })
      JPushModule.addReceiveOpenNotificationListener((message) => {
		    // console.log("Android 点击通知 触发", message);
        // Toast.show('点击通知 触发', message)
        this._pushToMessageList(message.messsageType || message.messageType)
		  });
    }

  /**
   * 监听：点击推送事件
   * iOS10 不管APP在前台 还是后台 还是已经被杀死  通过点击通知横幅 都走这个方法
   *
   */
    // 点击通知后，将会触发此事件
    if (Platform.OS === 'ios') {
      JPushModule.addReceiveOpenNotificationListener((message) => {
        console.log("点击通知 触发", message);
        this._pushToMessageList(message.messsageType || message.messageType)
      });
    }

    if (Platform.OS === 'ios') TimeToDoSomething.sendMsgToNative();
    this.uploadLoglistener = DeviceEventEmitter.addListener('nativeSendMsgToRN', (data) => {
      this._getCurrentPosition();
    })

    // this.uploadLoglistener = NativeAppEventEmitter.addListener('nativeSendMsgToRN', (data) => {
    //   this._getCurrentPosition();
    // });

    // 获取站内公告
    if(user.userId){
      this.props.getNotice()
    }
    // Geolocation.requestAuthorization()
    Geolocation.getCurrentPosition(location => {
      const locationData = getAMapLocation(location.coords.longitude, location.coords.latitude)
      global.locationData = locationData
    }, fail => {
      console.log('-------fail:', fail)
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
      console.log("   用户未登录 不提交日志 ");
      return
    }
    Geolocation.getCurrentPosition(location => {
      const locationData = getAMapLocation(location.coords.longitude, location.coords.latitude)
      global.locationData = locationData
        console.log(" ======= = binggo ",global.locationData);
      TimeToDoSomething.uploadDataFromLocalMsg();
    }, fail => {
      console.log('-------fail:', fail)
    }, {
      timeout: 10 * 1000,
      maximumAge: 60 * 1000,
      enableHighAccuracy: false
    })
  }
  _handleAppStateChange(appState) {
    const previousAppStates = this.state.appState
    console.log(" ====== previousAppStates appState = ",previousAppStates,appState);
    this.setState({
      appState,
      previousAppStates,
    });
  }

  componentWillReceiveProps(props) {
    if (props && !props.legalAccount) {
      new User().delete();
      props.dispatch(logout());
      this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN, mode: 'reset', params: { title: '' } })
    }
  }

  _pushToMessageList(messageType=1){// messageType 1=站内信 2=系统公告
    const {user} = this.props
    if (!(user && user.userId)) {
      this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN, mode: 'reset', params: { title: '' } });
      return;
    };

    console.log(" ----- ",this.props.nav);
    const currentRoute = this.props.nav.routes[this.props.nav.index].routeName
    console.log(" ----currentRoute- ",currentRoute);
    // Toast.show('currentRoute', currentRoute)
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

    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
      JPushModule.removeReceiveCustomMsgListener();
      JPushModule.removeReceiveNotificationListener();
    }else{
      JPushModule.removeReceiveOpenNotificationListener(()=>{
        console.log(" ==== 移除 点击推送事件 监听 ");
      });
      JPushModule.removeOpenNotificationLaunchAppEventListener(()=>{
        console.log(" === 移除启动 launch监听");
      })
      JPushModule.removeReceiveNotificationListener(()=>{
        console.log(" === 移除 接收推送事件 的监听");
      })
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
    this.props.dispatch(changeTab('route'));
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
    }
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
