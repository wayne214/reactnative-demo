import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  Text,
  Platform,
  TextInput,
  ScrollView,
  NativeModules,
  TouchableOpacity,
  Clipboard,
  Keyboard
} from 'react-native';
import { fetchData, loadUser, loginSuccess, refreshTravel ,appendLogToFile} from '../../action/app';
import BaseComponent from '../../components/common/baseComponent';
import NavigatorBar from '../../components/common/navigatorbar';
import Button from '../../components/common/button';
import Logo from '../../../assets/img/app/logo.png';
import styles from '../../../assets/css/login';
import * as RouteType from '../../constants/routeType';
import { CAR_LOGIN, TEST, SHIPPER_LOGIN } from '../../constants/api';
import Storage from '../../utils/storage';
import User from '../../models/user';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import JPushModule from 'jpush-react-native';
import ReadAndWriteFileUtil from '../../logUtil/readAndWriteFileUtil.js'
import Geolocation from 'Geolocation'
import {getAMapLocation} from '../../logUtil/geolocation.js'

let startTime = 0;
let endTime = 0;

class LoginContainer extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentRole: 1,
      password: '',
      username: '',
      showUpgrade: false,
      passwordWindowIsShow: true,
    };
    this._login = this._login.bind(this);
    this.title = props.navigation.state.params.title;
    this._forceUpgrade = this._forceUpgrade.bind(this);
    this._installApk = this._installApk.bind(this);
    this._clearCopyText = this._clearCopyText.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  _login() {
    if (!Regex.test('mobile', (this.state.username+'').trim() )) return Toast.show('手机号格式不正确');
    if (!Regex.test('password', (this.state.password+'').trim() )) return Toast.show('密码格式不正确');
    this.props.login({
      username: this.state.username.trim(),
      password: this.state.password.trim(),
    }, this.props.navigation, this.state.currentRole);
  }

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

  _clearCopyText(){
    Clipboard.setString('');
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: <NavigatorBar
              hiddenBackIcon={ true }
              style={{ borderBottomColor: 'white' }}
              router={ navigation }/>
    };
  };

  componentWillMount () {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    Geolocation.getCurrentPosition(location => {
      const locationData = getAMapLocation(location.coords.longitude, location.coords.latitude)
      global.locationData = locationData

    }, fail => {
      console.log('-------fail:', fail)
    }, {
      timeout: 5000,
      maximumAge: 1000,
      enableHighAccuracy: false
    })
    ReadAndWriteFileUtil.writeFile();
  }

  componentDidMount(){
    super.componentDidMount();
  }
  componentWillUnmount () {
    super.componentWillUnmount();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidHide(){
    this.refs.password && this.refs.password.blur();
    this.setState({ passwordWindowIsShow: true});
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={ styles.container }>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={ false }>
          <Image source={ Logo } style={ styles.logo }/>

          <View style={ styles.logoContainer }>
            <View style={ styles.cell }>
              <Text style={ styles.iconFont }>&#xe613;</Text>
              <TextInput
                ref='phoneNumber'
                style={ styles.input }
                multiline={ false }
                placeholder='请输入手机号'
                keyboardType='numeric'
                value={ this.state.username }
                underlineColorAndroid={ 'transparent' }
                onChangeText={ (text) => this.setState({ username: text }) }/>

                <View
                  opacity={(this.state.username+'').trim().length>0? 1: 0} >
                  <TouchableOpacity
                    opacityActive={ 1 }
                    onPress={ () => {
                      this.setState({ username: ''})
                    } }
                    >
                    <Text
                      style={ styles.iconFontRight }>&#xe634;</Text>
                  </TouchableOpacity>
                </View>

            </View>

            <View style={ [styles.cell, { marginTop: 20 }] }>
              <Text style={ styles.iconFont }>&#xe615;</Text>
              <View style={ styles.passwordContainer }>
                <TextInput
                  ref='password'
                  style={ styles.input }
                  multiline={ false }
                  placeholder='请输入密码'
                  secureTextEntry={ !this.state.showPwd }
                  value={ this.state.password }
                  underlineColorAndroid={ 'transparent' }
                  onSubmitEditing={Keyboard.dismiss}
                  onChangeText={ (text) => this.setState({ password: text }) }/>
                <TouchableOpacity
                  visible={this.state.passwordWindowIsShow}
                  style={ styles.passwordWindow }
                  opacityActive={ 1 }
                  onPress={ () => {
                    Clipboard.setString('');
                    this.refs.password.focus()
                    this.setState({ passwordWindowIsShow: false})
                  } }>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={ styles.bottomView }>
            <View style={ styles.forgetView }>
              <Text onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_CAR_LOGIN,params:{title:'',driverLogin: 'driverLogin'}}) } style={ styles.text }>员工(司机)登录</Text>
            </View>
            <View style={ styles.registerView }>
              <Text onPress={ () => this.props.navigation.dispatch({type: RouteType.PASSWORD_PAGE, params: {title: '忘记密码', forgetPassword: 'carrierForgetPassword' }}) } style={ styles.text }>忘记密码</Text>
            </View>
          </View>

          <View style={ styles.loginBtn }>
            <Button
              title='登录'
              style={ styles.btn }
              textStyle={ styles.btnText }
              onPress={ this._login }/>
          </View>
          <View style={ [styles.loginBtn, { marginTop: 20, paddingBottom: 20 }] }>
            <Button
              title='注册'
              style={ styles.btnRegister }
              textStyle={ styles.btnRegText }
              onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_REGISTER,params:{title:'注册'}}) }/>
          </View>
        </ScrollView>

        { this.props.loading ? this._renderLoadingView() : null }

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
        { this._renderUpgrade(this.props) }
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { app, user } = state;
  return {
    loading: app.get('loading'),
    user: app.get('user'),
    upgradeForce: app.get('upgradeForce'),
    showFloatDialog: app.get('showFloatDialog'),
    upgrade: app.get('upgrade'),
    upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login: (body, navigation, currentRole) => {
      startTime = new Date().getTime();
      dispatch(fetchData({
        body,
        method: 'GET',
        api: SHIPPER_LOGIN,
        successToast: true,
        msg: '登录成功',
        showLoading: true,
        success: (data) => {
          // 冻结账号
          dispatch(loginSuccess());
          // console.log('lqq--corporation--',data.corporation);
          const user = new User({
            userId: data.id,
            driverName: data.driverName,
            driverNumber: data.driverNumber,
            phoneNumber: data.phoneNumber,
            refCount: data.refCount,
            carrierType: data.carrierType,
            certificationStatus: data.certificationStatus,
            companyName: data.companyName,
            corporation: data.corporation,
            loginSign: data.loginSign,
            username: data.username,
            currentUserRole: 1
          });
          user.save();
          dispatch(loadUser(user));
          navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'route' } })
          console.log('lqq---user--',user);
          dispatch(appendLogToFile('登录','用户登录-承运商登录',startTime))
          startTime = new Date().getTime();
          JPushModule.setAlias(user.userId, () => {
            console.log("Set alias succeed");
            dispatch(appendLogToFile('登录','设置推送别名成功',startTime))
          }, () => {
            console.warn("Set alias failed");
            dispatch(appendLogToFile('登录','设置推送别名失败',startTime))
          });
        }
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
