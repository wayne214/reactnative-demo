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
import { fetchData, loadUser, loginSuccess } from '../../action/app';
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
// import JPushModule from 'jpush-react-native';

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
    // this._forceUpgrade = this._forceUpgrade.bind(this);
    // this._installApk = this._installApk.bind(this);
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

  // _forceUpgrade () {
  //   if (Platform.OS === 'android') {
  //     Toast.show('开始下载')
  //     NativeModules.NativeModule.upgradeForce(this.props.upgradeForceUrl).then(response => {
  //       this.setState({ showUpgrade: true });
  //     });
  //   } else {
  //     NativeModules.NativeModule.toAppStore();
  //   }
  // }

  // _installApk() {
  //   NativeModules.NativeModule.installApk();
  // }

  _clearCopyText(){
    Clipboard.setString(''); 
  }
  
  componentWillMount () {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
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
        <NavigatorBar
          title=' '
          router={ navigation }
          hiddenBackIcon={ true }
          style={{ borderBottomColor: 'white'}}/>

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
                keyboardType={ 'phone-pad' }
                value={ this.state.username }
                underlineColorAndroid={ 'transparent' }
                onChangeText={ (text) => this.setState({ username: text }) }/>
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
              <Text onPress={ () => this.props.router.push(RouteType.ROUTE_CAR_LOGIN, {driverLogin: 'driverLogin'}) } style={ styles.text }>员工(司机)登录</Text>
            </View>
            <View style={ styles.registerView }>
              <Text onPress={ () => this.props.router.push(RouteType.PASSWORD_PAGE, {title: '忘记密码', forgetPassword: 'carrierForgetPassword' }) } style={ styles.text }>忘记密码</Text>
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
              onPress={ () => this.props.router.push(RouteType.ROUTE_REGISTER) }/>
          </View>
        </ScrollView>

        { this.props.loading ? this._renderLoadingView() : null }
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { app, user } = state;
  return {
    loading: app.get('loading'),
    user: app.get('user'),
    // upgradeForce: app.get('upgradeForce'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login: (body, navigation, currentRole) => {
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
          navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'route' } })
          // console.log('lqq---user--',user);
          dispatch(loadUser(user));
          // JPushModule.setAlias(user.userId, () => {
          //   // Toast.show('设置别名成功',user.userId)
          //   console.log("Set alias succeed");
          // }, () => {
          //   // Toast.show('设置别名失败')
          //   console.warn("Set alias failed");
          // });
        }
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
