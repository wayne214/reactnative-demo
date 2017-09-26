import React from 'react';
import {
	View,
	Text,
	Image,
	Platform,
	TextInput,
	Clipboard,
	InteractionManager,
	TouchableOpacity,
	Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import styles from '../../../assets/css/register';
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import RegIcon from '../../../assets/img/user/reg_icon.png';
import Button from '../../components/common/button';
import Link from '../../utils/linking';
import MainContainer from '../app/main';
import Toast from '../../utils/toast';
import Modal from 'react-native-root-modal';
import CheckBox from '../../components/common/checkbox';
import { USER_REGISTER, CITY_COUNTRY } from '../../constants/api';
import * as RouteType from '../../constants/routeType';
import { fetchData, getInitStateFromDB } from '../../action/app';
import User from '../../models/user';
import Regex from '../../utils/regex';
import JPushModule from 'jpush-react-native';

class RegisterContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			// username: '',
			password: '',
			passwdAgain: '',
			visible: false,
			isChecked: true,
			passwordWindowIsShow: true,
			rePasswordWindowIsShow: true,

		};
		this._toAuth = this._toAuth.bind(this);
		this._toMain = this._toMain.bind(this);
		this.phone = props.navigation.state.params.phone;
		this.code = props.navigation.state.params.code;
		this.inviteCode = props.navigation.state.params.inviteCode;
		this._register = this._register.bind(this);
	  // this.title = props.router.getCurrentRouteTitle();
	  this._clearCopyText = this._clearCopyText.bind(this);
	  this._keyboardDidHide = this._keyboardDidHide.bind(this);
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar
	    router={ navigation }/>
	  };
	};

	_toAuth () {
		this.setState({ visible: false });
		this.props.navigation.dispatch({type:RouteType.ROUTE_AUTH_ROLE,params:{title:'认证角色'}});
	}

	_toMain () {
		this.setState({ visible: false });
		this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'route' } })
	}

	_register () {
		// if (!(this.state.username+'').trim() ) return Toast.show('请输入用户名');
		if (!Regex.test('password', (this.state.password+'').trim())) return Toast.show('密码格式不正确，密码应为（6-24位）数字+英文字母组合');
		if (!(this.state.passwdAgain+'').trim()) return Toast.show('请再次输入密码');
		if ((this.state.password+'').trim() !== (this.state.passwdAgain+'').trim()) return Toast.show('两次密码不一致');
		if(!this.state.isChecked)return Toast.show('请阅读并同意《冷链马甲服务协议》');
		this.props.register({
			phoneNumber: (this.phone+'').trim(),
			source: Platform.OS === 'android' ? 3 : 2, // 注册来源 1=PC,2=iOS,3=Android
			// username: (this.state.username+'').trim(),
			password: (this.state.password+'').trim(),
			verifyCode: (this.code+'').trim(),
			inviteCode: (this.inviteCode+'').trim(),
		}, this.props.router, () => {
			this.setState({ visible: true });
		});
	}

	_checkedInDatas(){
		if(this.state.isChecked){
			this.setState({
				isChecked: false
			});
		}else{
			this.setState({
				isChecked: true
			});
		}

	}

	_clearCopyText(){
		Clipboard.setString('');
	}

	_jumpAgreement(){
		this.props.navigation.dispatch({type:RouteType.ROUTE_AGREEMENT_CONTENT,params:{title: '《冷链马甲服务协议》', type: 1}});
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
		this.refs.rePassword && this.refs.rePassword.blur();
		this.setState({ passwordWindowIsShow: true});
		this.setState({ rePasswordWindowIsShow: true});

	}

	render () {
		const { router } = this.props;
		return (
			<View style={ styles.container }>
				<Text style={ styles.tipText }>设置登录密码</Text>
				<View style={ [styles.cellContainer, { marginTop: 20 }]  }>
					<Text style={ styles.labelTextPwd }>设置密码</Text>
					<View style={ styles.passwordContainer }>
						<TextInput
							ref='password'
							placeholder='请输入密码'
							returnKeyType='done'
							secureTextEntry={ true }
							style={ styles.textInput }
							underlineColorAndroid={ 'transparent' }
							value = { this.state.password }
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
				<View style={ styles.cellContainer }>
					<Text style={ styles.labelTextPwd }>确认密码</Text>
					<View style={ styles.passwordContainer }>
						<TextInput
							ref='rePassword'
							placeholder='请输入密码'
							returnKeyType='done'
							secureTextEntry={ true }
							style={ styles.textInput }
							underlineColorAndroid={ 'transparent' }
							value = { this.state.passwdAgain }
							onSubmitEditing={Keyboard.dismiss}
							onChangeText={ (text) => this.setState({ passwdAgain: text }) }/>
						<TouchableOpacity
							visible={this.state.rePasswordWindowIsShow}
							style={ styles.passwordWindow }
							opacityActive={ 1 }
							onPress={ () => {
								Clipboard.setString('');
								this.refs.rePassword.focus()
								this.setState({ rePasswordWindowIsShow: false})
							} }>
						</TouchableOpacity>
					</View>
				</View>
				<View style={ [styles.bottomContainer,{paddingLeft: 40, marginTop: 20}] }>
					<CheckBox
						contentStyle={{ width: 20 }}
						isChecked={ this.state.isChecked }
						checkedFun={ this._checkedInDatas.bind(this, this.state.isChecked) }/>
					<Text>已阅读并同意</Text>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ this._jumpAgreement.bind(this) }>
					<Text style={[styles.blueTextStyle,{marginLeft:10}]}>《冷链马甲服务协议》</Text>
					</TouchableOpacity>
				</View>
				<View style={ [styles.loginBtn, { marginTop: 40 }] }>
					<Button
						title='完成注册'
						style={ styles.btn }
						textStyle={ styles.btnText }
						onPress={ this._register }/>
				</View>
				{ this.props.loading ? this._renderLoadingView() : null }
				<Modal
					transparent={ true }
					backdropOpacity={ 0 }
					backdropColor='rgba(0, 0, 0, 0.8)'
					onRequestClose={ () => console.log('') }
					supportedOrientations={['landscape', 'portrait']}
					visible={ this.state.visible }>
					<View style={ styles.modalStyle }>
						<View style={ styles.contentView }>
							<View style={ styles.topView }>
								<Text style={ styles.checkbox }>&#xe635;</Text>
								<Text style={ styles.regTip }>恭喜你注册成功</Text>
							</View>
							<View style={ styles.optView }>
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.skipView }
									onPress={ this._toMain }>
									<Text style={ styles.skipText }>再看看</Text>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ [styles.skipView, { borderRightWidth: 0 }] }
									onPress={ this._toAuth }>
									<Text style={ styles.authText }>去认证</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				{ this._renderUpgrade(this.props) }	
			</View>
		);
	}
}

function mapStateToProps (state) {
	const { app } = state;
	return {
		loading: app.get('loading'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	};
}

function mapDispatchToProps (dispatch) {
	return {
		register: (body, router, cb) => {
			dispatch(fetchData({
				body,
				api: USER_REGISTER,
				method: 'POST',
				msg: '注册成功',
				showLoading: true,
				successToast: true,
				success: (data) => {
					cb();
					const user = new User({
						userId: data,
						phoneNumber: body.phoneNumber,
						currentUserRole: 1
					});
					user.save();
					JPushModule.setAlias(user.userId, () => {
						console.log("Set alias succeed");
					}, () => {
						console.warn("Set alias failed");
					});
					dispatch(getInitStateFromDB());
				}
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
