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
  TouchableOpacity
} from 'react-native';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import styles from '../../../assets/css/main';
import Tabar from '../../components/app/tabBar';
import { changeTab, showFloatDialog, logout } from '../../action/app';
import { changeOrderTopTab } from '../../action/order';
import Drawer from 'react-native-drawer';
import Linking from '../../utils/linking';
import ControlPanel from '../../components/app/controlPanel';
import Upgrade from '../../components/app/upgrade';
// import Image from '../../components/common/image';
import NavigatorBar from '../../components/common/navigatorbar';
import ICON_ROUTE from '../../../assets/img/app/icon_route.png';
import { fetchData, getInitStateFromDB, setAppState, redictLogin, getGameUrl } from '../../action/app';
import { CARRIER_DETAIL_INFO, CAR_DETAIL_INFO, CITY_COUNTRY, GAME_ADDRESS } from '../../constants/api';
import { updateMsgList } from '../../action/message';
import User from '../../models/user';
import Storage from '../../utils/storage';
import JPushModule from 'jpush-react-native';
import { openNotification } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import Toast from '../../utils/toast'
// import LoginContainer from '../user/shipperLogin';
import Button from '../../components/common/button'

const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const getRegistrationIdEvent = "getRegistrationId";

class MainContainer extends React.Component {

  constructor(props) {
    if (Platform.OS === 'android') {
      JPushModule.initPush();
      JPushModule.notifyJSDidLoad(() => console.log('fuck'));
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
    this._forceUpgrade = this._forceUpgrade.bind(this)
    this.openControlPanel = this.openControlPanel.bind(this)
    this._handleAppStateChange = this._handleAppStateChange.bind(this)
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
    JPushModule.addOpenNotificationLaunchAppListener( (notification) => {
      Alert.alert('应用没有启动的状态点击推送打开应用','3qrwwqer',[{text: 'ok',onPress:()=>{
        console.log(" ===== 监听：应用没有启动的状态点击推送打开应用 ",notification);
      }}])
    })
    JPushModule.addReceiveNotificationListener((map) => {
      Alert.alert('addReceiveNotificationListener','3qrwwqer',[{text: 'ok',onPress:()=>{
        console.log(" ===== addReceiveNotificationListener ",map);
      }}])
    });

    if (Platform.OS === 'ios') {

      this.notifySubscription = NativeAppEventEmitter.addListener('ReceiveNotification',(notification) => {
        JPushModule.setBadge(0, (success) => {
          console.log(success)
        });
        console.log(`app --- 最新状态 ${this.state.appState}`)
        console.log('iOS  ----ReceiveNotification ',notification)
        if (notification.messsageId) {
          if (this.state.appState == 'background') {
            this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST})
          }else if(this.state.appState == 'active') {
            if(NativeModules.NativeModule.IOS_OS_VERSION < 10){
              Alert.alert('温馨提示','您有新消息',[
                {text: '忽略',onPress: ()=>{}},
                {text: '查看',onPress: ()=>{
                  this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST})
                }}
              ])
            }
          }
        };
      });
      console.log(" ======== this is notifySubscription",this.notifySubscription);
      //iOS 10 之后才有  监听 OpenNotification 事件，点击推送的时候会执行这个回调
      this.openNotifySubscription = NativeAppEventEmitter.addListener('OpenNotification',(notification) => {
        JPushModule.setBadge(0, (success) => {
          console.log(success)
        });
        console.log('iOS ----OpenNotification ',notification,this.props.user)
        if (notification.messsageId) {
          setTimeout(()=>{
            console.log("------ 1 秒后 ?? user是谁？",this.props.user);
            if (this.props.user && this.props.user.userId) {
              this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST})
            }else{
              this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN, mode: 'reset', params: { title: '' } })
            }
          }, 1000);
        }
      });
      console.log(" ======== this is openNotifySubscription",this.openNotifySubscription)
      // 每次启动后清空角标
      JPushModule.setBadge(0, (success) => {
        console.log(success)
      });
    }else{
      JPushModule.addReceiveCustomMsgListener((message) => {
        // this.setState({pushMsg: message});
        console.log("收到 android 自定义消息 ",message);
      });
      JPushModule.addReceiveNotificationListener((message) => {
        console.log("收到 Android 通知: ",message);
      })
      // 点击通知后，将会触发此事件
      JPushModule.addReceiveOpenNotificationListener((message) => {
        console.log("Android 点击通知 触发", message);//if (notification.messsageId) {
        this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST})
        // this.props.dispatch(openNotification(true));
        // const currentRoute = this.props.router.getCurrentRoute();
        // if (currentRoute.key === 'MESSAGE_PAGE' || currentRoute.key === 'MESSAGE_DETAIL_PAGE') this.props.dispatch(updateMsgList());
        // if (currentRoute.key === 'MESSAGE_DETAIL_PAGE') return this.props.router.pop();
        // if (currentRoute.key !== 'MESSAGE_PAGE') this.props.router.push(RouteType.ROUTE_MESSAGE_LIST);
      });



      // JPushModule.addReceiveCustomMsgListener((message) => {
      //   // this.setState({pushMsg: message});
      //   console.log("===== get android push message ",message);
      // });
      // JPushModule.addReceiveNotificationListener((message) => {
      //   console.log("receive android notification: " + message);
      // })
    }
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

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.timer && clearTimeout(this.timer)
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
      JPushModule.removeReceiveCustomMsgListener();
      JPushModule.removeReceiveNotificationListener();
    }else{
      this.notifySubscription && this.notifySubscription.remove();
      this.openNotifySubscription && this.openNotifySubscription.remove();
    }
  }

  handleBack () {
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
  }

  _routeTab () {
    Animated.timing(this.state.rotateValue,
      {
        toValue: 1
      }
    ).start(() => this.state.rotateValue.setValue(0));
    this.props.dispatch(changeTab('route'));
  }

  /**
   * [_forceUpgrade description] 强制升级
   * @return {[type]} [description]
   */
  _forceUpgrade () {
    if (Platform.OS === 'android') {
      Toast.show('开始下载')
      NativeModules.NativeModule.upgradeForce(this.props.upgradeForceUrl).then(response => {
        this.setState({ showUpgrade: true });
      });
    } else {
      NativeModules.NativeModule.toAppStore();
    }
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

        {
          this.props.upgradeForce && !this.props.showFloatDialog &&
            <View style={ styles.upgradeContainer }>
              <View style={ styles.upgradeView }>
                <Image style={{ width: 50, height: 55, marginTop: 15 }} source={ require('../../../assets/img/app/upgrade_icon.png')}/>
                <Text style={ styles.upgradeText }>冷链马甲承运方升级啦，界面焕然一新，修复了已知bug,赶快升级体验吧</Text>
                <Button onPress={ this._forceUpgrade } title='立即更新' style={{ backgroundColor: 'white', width: 100, height: Platform.OS === 'ios' ? 40 : 30, borderColor: 'white' }} textStyle={{ fontSize: 12, color: '#17a9df' }}/>
                {
                  Platform.OS === 'android' && this.state.showUpgrade &&
                    <Button onPress={ this._installApk } title='已下载，立即安装' style={{ backgroundColor: 'white', width: 100, height: 30, borderColor: 'white' }} textStyle={{ fontSize: 12, color: '#1ab036' }}/>
                }
              </View>
            </View>
        }
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
