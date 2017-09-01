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
// import JPushModule from 'jpush-react-native';
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
    // if (Platform.OS === 'android') {
    //   JPushModule.initPush();
    //   JPushModule.notifyJSDidLoad(() => console.log('fuck'));
    // }
    super(props);
    this.state = {
      showUpgrade: false,
      rotateValue: new Animated.Value(0)
    };
    this._routeTab = this._routeTab.bind(this);
    this._changeTab = this._changeTab.bind(this);
    this._forceUpgrade = this._forceUpgrade.bind(this)
    this._installApk = this._installApk.bind(this)
    this.openControlPanel = this.openControlPanel.bind(this);
  }

  static propTypes = {
    dispatch: React.PropTypes.func,
    currentTab: React.PropTypes.string.isRequired,
    tabs: React.PropTypes.instanceOf(Immutable.List),
    upgrade: React.PropTypes.object
  }


  _handleAppStateChange(currentAppState) {
    // console.log('currentAppState is ', currentAppState);
  }

  componentDidMount () {
    this.props.navigation.setParams({ _openControlPanel: this.openControlPanel })
  }

  componentWillReceiveProps(props) {
    // if (props && !props.legalAccount) {
    //   this.props.navigator.resetTo({
    //     name: 'login',
    //     component: LoginContainer
    //   });
    //   new User().delete();
    //   props.dispatch(logout());
    // }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    AppState.removeEventListener('change', this._handleAppStateChange);
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

    // this.props._getUserInfo(opts, this.props.user.currentUserRole);
    // // game url
    // this.props.getUrl({
    //   phone: this.props.user.phoneNumber
    // });     
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

  _installApk() {
    NativeModules.NativeModule.installApk();
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation
    const currentTab = state.params.currentTab
    if (currentTab === 'route') {
      return {
        header: <NavigatorBar
          title='我的行程'
          backIconFont='&#xe60a;'
          firstLevelIconFont='&#xe609;'
          secondLevelIconFont='&#xe60b;'
          thirdLevelIconFont='&#xe60f;'
          firstLevelIconFontStyle={{ fontSize: 24 }}
          backViewClick={ () => state.params._openControlPanel() }
          thirdLevelClick={ () => Linking.link('tel:4006635656') }
          secondLevelClick={ () => this.props.router.push(RouteType.ROUTE_MESSAGE_LIST) }
          firstLevelClick={ () => this.props.router.push(RouteType.ROUTE_CAR_LIST) }/>
      }
    } else if (currentTab === 'goods') {
      return {
        header: <NavigatorBar title='线路货源' hiddenBackIcon={ true }/>
      }
    } else if (currentTab === 'carriage') {
      return {
        header: <NavigatorBar title='我的承运' hiddenBackIcon={ true }/>
      }
    } else if (currentTab === 'order') {
      return {
        header: <NavigatorBar title='我的订单' hiddenBackIcon={ true }/>
      }
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
          click={ this.openControlPanel }
          changeTab={ this._changeTab } />
      </Drawer>
    );
  }

}

const mapStateToProps = (state) => {
  const { app } = state;
  return {
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
