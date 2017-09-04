import React from 'react';
import {
	View,
	Text,
	Image,
	Platform,
	TextInput,
	InteractionManager,
	TouchableOpacity,
	Keyboard,
	Clipboard
} from 'react-native';
import { connect } from 'react-redux';
import styles from '../../../assets/css/register';
import NavigatorBar from '../../components/common/navigatorbar';
import RegIcon from '../../../assets/img/user/reg_icon.png';
import BaseComponent from '../../components/common/baseComponent';
import Button from '../../components/common/button';
import Link from '../../utils/linking';
import MainContainer from '../app/main';
import Toast from '../../utils/toast';
import { UPDATE_PASSWORD, UPDATE_DRIVER_PASSWORD, CARRIER_FORGET_PASSWORD, DRIVER_FORGET_PASSWORD, SHIPPER_LOGIN, CAR_LOGIN} from '../../constants/api';
import * as RouteType from '../../constants/routeType';
import { fetchData, loadUser ,logout,loginSuccess } from '../../action/app';
import Regex from '../../utils/regex';
import User from '../../models/user';
// import JPushModule from 'jpush-react-native';

class PwdSteoTwoContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			// username: '',
			password: '',
			passwdAgain: '',
			passwordWindowIsShow: true,
		};
		this.phone = props.navigation.state.params.phone;
    this.title = props.navigation.state.params.title;
		this.verifyCode = props.navigation.state.params.verifyCode;
		this.type = props.navigation.state.params.verifyType;
		this.lastRouteKey = props.navigation.state.params.lastRouteKey;
		this.forgetPassword = props.navigation.state.params.forgetPassword;
		this._register = this._register.bind(this);
		this._keyboardDidHide = this._keyboardDidHide.bind(this);
	}
	componentWillMount () {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
  	super.componentWillUnmount();
		this.keyboardDidHideListener.remove();
  }

	_keyboardDidHide() {
		this.refs.inputpassword && this.refs.inputpassword.blur();
		this.refs.inputpasswordAgain && this.refs.inputpasswordAgain.blur();
		this.setState({ passwordWindowIsShow: true});
	}
	_register () {
		if (!(this.state.password+'').trim()) return Toast.show('请输入密码');
		if (!Regex.test('password', (this.state.password+'').trim())) return Toast.show('密码格式不正确，密码应为（6-24位）数字+英文字母组合');
		if (!(this.state.passwdAgain+'').trim()) return Toast.show('请再次输入密码');
		if (this.state.password !== this.state.passwdAgain) return Toast.show('两次密码不一致');
		if (this.props.user.currentUserRole === 1 || this.forgetPassword === 'carrierForgetPassword' ){
			this.props.updateCarrierPassword({
				phoneNumber: this.phone,
				// source: Platform.OS === 'android' ? 2 : 3, // 注册来源 1=PC,2=Android,3=IOS
				// username: this.state.username,
				password: this.state.password.trim(),
				verifyCode: this.verifyCode.trim(),
			}, this.props.navigation, this.props.user, this.lastRouteKey, this.props.navigator, this.forgetPassword,
				() => {
					this.props.shipperLogin({
					username: this.phone.trim(),
					password: this.state.password.trim(),
				}, this.props.navigation, this.state.currentRole);
			});
		}else if (this.props.user.currentUserRole === 2 || this.forgetPassword === 'driverForgetPassword' ){
			this.props.updateDriverPassword({
				phoneNumber: this.phone.trim(),
				password: this.state.password.trim(),
				checkNumber: this.verifyCode.trim(),
			}, this.props.navigation, this.props.user, this.lastRouteKey, this.props.navigator, this.forgetPassword,
				() => {
					this.props.driverLogin({
						username: this.phone.trim(),
						password: this.state.password.trim(),
					}, this.props.navigation, this.state.currentRole);
			});
		}

	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};

	render () {
		return (
			<View style={ styles.container }>
				<Text style={ styles.tipText }>设置登录密码</Text>

				<View style={ [styles.cellContainer, { marginTop: 20 }] }>
					<Text style={ styles.labelTextPwd }>设置密码</Text>
					<TextInput
						ref='inputpassword'
						placeholder='请输入密码'
						secureTextEntry={ true }
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						onSubmitEditing={Keyboard.dismiss}
						value={this.state.password}
						onChangeText={ (text) => this.setState({ password: text }) }/>
					<TouchableOpacity 
						visible={this.state.passwordWindowIsShow} 
						style={ styles.passwordWindow } 
						opacityActive={1} 
						onPress={()=>{
						this.setState({ passwordWindowIsShow: false});
						Clipboard.setString(''); 
						this.refs.inputpassword.focus()}}>
					</TouchableOpacity>
				</View>
				<View style={ styles.cellContainer }>
					<Text style={ styles.labelTextPwd }>确认密码</Text>
					<TextInput
						ref='inputpasswordAgain'
						placeholder='请输入密码'
						secureTextEntry={ true }
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						onSubmitEditing={Keyboard.dismiss}
						value={this.state.passwdAgain}
						onChangeText={ (text) => this.setState({ passwdAgain: text }) }/>
					<TouchableOpacity 
						visible={this.state.passwordWindowIsShow} 
						style={ styles.passwordWindow } 
						opacityActive={1} 
						onPress={()=>{
						this.setState({ passwordWindowIsShow: false});
						Clipboard.setString(''); 
						this.refs.inputpasswordAgain.focus()}}>
					</TouchableOpacity>
				</View>
				<View style={ [styles.loginBtn, { marginTop: 40 }] }>
					<Button
						title='完成修改'
						style={ styles.btn }
						textStyle={ styles.btnText }
						onPress={ this._register }/>
				</View>
				{ this.props.loading ? this._renderLoadingView() : null }
			</View>
		);
	}
}
function mapStateToProps (state) {
	const { app } = state;
	return {
		loading: app.get('loading'),
		user: app.get('user')
	};
}

function mapDispatchToProps (dispatch) {
	return {
		updateCarrierPassword: (body, navigation, user, lastRouteKey, navigator, forgetPassword, cb) => {
			dispatch(fetchData({
				body,
				api:  lastRouteKey === 'USER_INFO_PAGE' ? UPDATE_PASSWORD : CARRIER_FORGET_PASSWORD ,
				method: 'POST',
				msg: '修改成功',
				showLoading: true,
				successToast: true,
				success: () => {
					setTimeout(() => {
						if(user.currentUserRole === 1){
							navigator.dispatch({ type: 'ROUTE_LOGIN', mode: 'reset' });
							new User().delete();
							dispatch(logout());
						}else if(forgetPassword === 'carrierForgetPassword'){
							cb();
						}
					}, 0);
				},
			}));
		},
		updateDriverPassword: (body, router, user, lastRouteKey, navigator, forgetPassword, cb) => {
			dispatch(fetchData({
				body,
				api: lastRouteKey === 'USER_INFO_PAGE' ? UPDATE_DRIVER_PASSWORD : DRIVER_FORGET_PASSWORD,
				method: 'POST',
				msg: '修改成功',
				showLoading: true,
				successToast: true,
				success: () => {
					setTimeout(() => {
						if(user.currentUserRole === 2){
							navigator.dispatch({ type: 'ROUTE_CAR_LOGIN', mode: 'reset' });
							new User().delete();
							dispatch(logout());
						}else if(forgetPassword === 'driverForgetPassword'){
							cb();
						}
					}, 0);
				}

			}))
		},
		shipperLogin: (body, navigation, currentRole) => {
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
			    navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '' } });
					dispatch(loadUser(user));
					// JPushModule.setAlias(user.userId, () => {
					// 	// Toast.show('设置别名成功',user.userId)
					// 	console.log("Set alias succeed");
					// }, () => {
					// 	// Toast.show('设置别名失败')
					// 	console.warn("Set alias failed");
					// });
				}
			}));
		},
		driverLogin: (body, navigation, currentRole) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: CAR_LOGIN,
				successToast: true,
				msg: '登录成功',
				showLoading: true,
				success: (data) => {
					// 冻结账号
					dispatch(loginSuccess());
					const user = new User({
						userId: data.id,
						carId: data.carId,
						carrierId: data.carrierId,
						driverName: data.driverName,
						driverNumber: data.driverNumber,
						phoneNumber: data.driverPhone,
						refCount: data.refCount,
						carrierType: data.carrierType,
						certificationStatus: data.certificationStatus,
						companyName: data.companyName,
						corporation: data.corporation,
						username: data.username,
						currentUserRole: 2
					});
					user.save();
					dispatch(loadUser(user));
			    navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '' } });
					// JPushModule.setAlias(user.userId, () => {
					// 	console.log("Set alias succeed");
					// }, () => {
					// 	console.warn("Set alias failed");
					// });
				}
			}));
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PwdSteoTwoContainer);
