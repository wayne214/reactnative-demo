import React from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import styles from '../../../assets/css/register';
import NavigatorBar from '../../components/common/navigatorbar';
import RegIcon from '../../../assets/img/user/reg_icon.png';
import BaseComponent from '../../components/common/baseComponent';
import Button from '../../components/common/button';
import Link from '../../utils/linking';
import { HOST } from '../../constants/setting';
import * as RouteType from '../../constants/routeType';
import { GET_IMG_CODE, GET_SMS_CODE, CHECK_SMG_CODE } from '../../constants/api';
import CountDownView from '../../components/common/countDownView';
import { fetchData } from '../../action/app';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';

class PwdStepOneContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			code: '',
			phone: '',
			verifyCode: '',
			verifyCodeKey: Math.floor(Math.random(1) * 100000000),
		};
    this.title = props.navigation.state.params.title;
	  this.lastRouteName = props.nav.routes[props.nav.index - 1].routeName;
	  this.forgetPassword = props.navigation.state.params.forgetPassword;
	  this._getMsgCode = this._getMsgCode.bind(this);
	  this._nextStepReg = this._nextStepReg.bind(this);
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
		// this.refs.inputphone && this.refs.inputphone.blur();
		// this.refs.inputcode && this.refs.inputcode.blur();
		// this.refs.inputphoneCode && this.refs.inputphoneCode.blur();
	}

	_getMsgCode () {
		const ref = this.countDownView;
		// if (!Regex.test('mobile', this.state.phone)) return Toast.show('手机号格式不正确');
		if(this.lastRouteName !== 'ROUTE_USER_INFO'){
			if (!Regex.test('mobile', (this.state.phone+'').trim())) return Toast.show('手机号格式不正确');
		}
		if (!(this.state.verifyCode+'').trim()) return Toast.show('请先输入图形验证码');
		this.props._getSmsCode({
			phoneNumber: this.lastRouteName === 'ROUTE_USER_INFO' ? this.props.user.phoneNumber : this.state.phone.trim(),
			verifyCode: this.state.verifyCode.trim(),
			verifyCodeKey: this.state.verifyCodeKey,
			verifyType: this.lastRouteName === 'ROUTE_USER_INFO'? 2 : 3, //验证类型: 1：注册 2：修改密码 3：忘记密码 4：新增司机
			loginType: this.lastRouteName === 'ROUTE_USER_INFO' ? (this.props.user.currentUserRole === 1  ?  2 : 1) : (this.forgetPassword === 'driverForgetPassword' ? 1 : 2)  // 1: 司机 2:承运商
		}, ref);
	}
	_nextStepReg () {
		if(this.lastRouteName !== 'ROUTE_USER_INFO')
		{
			if (!(this.state.phone+'').trim()) return Toast.show('请输入手机号码');
			if (!Regex.test('mobile', (this.state.phone+'').trim())) return Toast.show('手机号格式不正确');
		}
		if (!(this.state.verifyCode+'').trim()) return Toast.show('请先输入图形验证码');
		if (!(this.state.code+'').trim()) return Toast.show('请先获取验证码');
		this.props._checkSmsCode({
			phoneNumber: this.lastRouteName === 'ROUTE_USER_INFO' ? this.props.user.phoneNumber : this.state.phone.trim(),
			verifyCode: this.state.code.trim(),
			verifyType: this.lastRouteName === 'ROUTE_USER_INFO'? 2 : 3, // 验证类型1：注册 2：修改密码 3：忘记密码 4：新增司机
			loginType: this.lastRouteName === 'ROUTE_USER_INFO' ? (this.props.user.currentUserRole === 1  ?  2 : 1) : (this.forgetPassword === 'driverForgetPassword' ? 1 : 2),  // 1: 司机 2:承运商
			inviteCode: '',
		}, this.props.navigation, this.title, this.lastRouteName, this.forgetPassword);
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};
	
	render () {
		const { user } = this.props;
		let phoneNo;
		if(this.lastRouteName === 'ROUTE_USER_INFO'){
			phoneNo = (
				<View style={ [styles.cellContainer, { marginTop: 20 }] }>
					<Text style={ styles.labelText }>手机号</Text>
					<Text style= { styles.labelTextPhone }>{ user.phoneNumber}</Text>
				</View>)
		}else{
			phoneNo = (
				<View style={ [styles.cellContainer, { marginTop: 20 }] }>
					<Text style={ styles.labelText }>手机号</Text>
					<TextInput
						ref='inputphone'
						placeholder='请输入手机号码'
						keyboardType= 'numeric'
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						value={this.state.phone}
						onChangeText={ (text) => this.setState({ phone: text }) }/>
				</View>
			)
		}
		return (
			<View style={ styles.container }>
				<Text style={ styles.tipText }>请输入您的手机号</Text>
				{ phoneNo }
				<View style={ styles.cellContainer }>
					<Text style={ styles.labelText }>图形验证码</Text>
					<TextInput
						ref='inputcode'
						placeholder='请输入验证码'
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						value={this.state.verifyCode}
						onChangeText={ (text) => this.setState({ verifyCode: text }) }/>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ () => this.setState({ verifyCodeKey: Math.floor(Math.random(1) * 100000000) }) }>
						<Image style={ styles.imgStyle } source={{ uri: HOST + GET_IMG_CODE + '?verifyCodeKey=' + this.state.verifyCodeKey }} />
					</TouchableOpacity>
				</View>
				<View style={ styles.cellContainer }>
					<Text style={ styles.labelText }>验证码</Text>
					<TextInput
						ref='inputphoneCode'
						placeholder='请输入验证码'
						keyboardType= 'numeric'
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						value={this.state.code}
						onChangeText={ (text) => this.setState({ code: text }) }/>
					<CountDownView
						count={ 60 }
						pressAction={ this._getMsgCode }
						ref={ (e) => {this.countDownView=e} }/>
				</View>

				<View style={ styles.loginBtn }>
					<Button
						title='下一步'
						style={ styles.btn }
						textStyle={ styles.btnText }
						onPress={ this._nextStepReg } />
				</View>
				{ this.props.loading ? this._renderLoadingView() : null }
			</View>
		);
	}

}

function mapStateToProps (state) {
	const { app, travel, nav } = state;
	return {
		loading: app.get('loading'),
		user: app.get('user'),
		isNeedRefreshTravel: travel.get('isNeedRefreshTravel'),
		nav
	};
}

function mapDispatchToProps (dispatch) {
	return {
		dispatch,
		_getSmsCode: (body, ref) => {
			dispatch(fetchData({
				body,
				api: GET_SMS_CODE,
				method: 'POST',
				msg: '验证码发送成功',
				successToast: true,
				showLoading: true,
				success: () => {
					ref.startCountDown();
				}
			}));
		},
		_checkSmsCode: (body, navigation, title ,lastRouteName, forgetPassword) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				showLoading: true,
				api: CHECK_SMG_CODE,

				success: () => {
					navigation.dispatch({type: RouteType.PASSWORD_TWO_PAGE, params:{title: title, phone: body.phoneNumber, verifyCode: body.verifyCode, verifyType: body.verifyType, lastRouteName: lastRouteName, forgetPassword: forgetPassword}});
				}
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PwdStepOneContainer);
