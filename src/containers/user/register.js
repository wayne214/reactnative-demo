import React from 'react';
import {
	View,
	Text,
	Image,
	ScrollView,
	TextInput,
	TouchableOpacity
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
import { fetchData,appendLogToFile } from '../../action/app';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
let startTime = 0
class RegisterContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			code: '',
			phone: '',
			verifyCode: '',
			verifyCodeKey: Math.floor(Math.random(1) * 100000000),
			inviteCode: '',
		};
	  // this.title = props.router.getCurrentRouteTitle();
	  this._getMsgCode = this._getMsgCode.bind(this);
	  this._nextStepReg = this._nextStepReg.bind(this);
    this._forceUpgrade = this._forceUpgrade.bind(this);
    this._installApk = this._installApk.bind(this);
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar
	    router={ navigation }/>
	  };
	};

  componentDidMount(){
		super.componentDidMount();
	}

  componentWillUnmount () {
  	super.componentWillUnmount();
  }

	_getMsgCode() {
		const ref = this.countDownView;
		if (!Regex.test('mobile', (this.state.phone+'').trim() )) return Toast.show('手机号格式不正确');
		if (!(this.state.verifyCode+'').trim() ) return Toast.show('请先填写图形验证码');
		this.props._getSmsCode({
			phoneNumber: (this.state.phone+'').trim(),
			verifyCode: (this.state.verifyCode+'').trim(),
			verifyCodeKey: (this.state.verifyCodeKey+'').trim(),
			verifyType: 1, // 1：承运商注册 2：司机注册
			loginType: 2,//用户类型 1:司机 2:承运商
		}, ref);
	}

	_nextStepReg () {
		if (!Regex.test('mobile', (this.state.phone+'').trim() )) return Toast.show('手机号格式不正确');
		if (!(this.state.code+'').trim()) return Toast.show('请先获取验证码');
		if (!(this.state.verifyCode+'').trim()) return Toast.show('请先获取图形验证码');
		this.props._checkSmsCode({
			phoneNumber: (this.state.phone+'').trim(),
			verifyCode: (this.state.code+'').trim(),
			verifyType: 1, // 短信验证码类型 1：注册 2：修改密码 3：忘记密码 4:新增司机
			loginType: 2,//1、司机 2、承运商
			inviteCode: (this.state.inviteCode+'').trim(),
		}, this.props.navigation);
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

	render () {
		return (
			<View style={ styles.container }>
				<ScrollView keyboardShouldPersistTaps='handled' style={ {paddingBottom: 20} }>
					<View>
						<Text style={ styles.tipText }>请输入您的手机号</Text>
						<View style={ [styles.cellContainer, { marginTop: 20 }] }>
							<Text style={ styles.labelText }>手机号</Text>
							<TextInput
								ref='inputphone'
								placeholder='请输入手机号码'
								keyboardType= 'numeric'
								style={ styles.textInput }
								underlineColorAndroid={ 'transparent' }
								value = { this.state.phone }
								onChangeText={ (text) => this.setState({ phone: text }) }/>
								<View
                  opacity={(this.state.phone+'').trim().length>0? 1: 0} >
                  <TouchableOpacity
                    opacityActive={ 1 }
                    onPress={ () => {
                      this.setState({ phone: ''})
                    } }
                    >
                    <Text
                      style={ styles.iconFontRight }>&#xe634;</Text>
                  </TouchableOpacity>
                </View>
						</View>
						<View style={ styles.cellContainer }>
							<Text style={ styles.labelText }>图形验证码</Text>
							<TextInput
								ref='inputcode'
								placeholder='请输入验证码'
								style={ styles.textInput }
								underlineColorAndroid={ 'transparent' }
								value = { this.state.verifyCode }
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
								ref='inputsyscode'
								placeholder='请输入验证码'
								keyboardType= 'numeric'
								style={ styles.textInput }
								underlineColorAndroid={ 'transparent' }
								value = { this.state.code }
								onChangeText={ (text) => this.setState({ code: text }) }/>
							<CountDownView
								count={ 60 }
								pressAction={ this._getMsgCode }
								ref={ (e) => {this.countDownView=e} }/>
						</View>
						<View style={ styles.cellContainer }>
							<Text style={ styles.labelText }>邀请码</Text>
							<TextInput
								ref='inputsyscode'
								placeholder='请输入邀请码(非必填)'
								keyboardType= 'numeric'
								style={ styles.textInput }
								underlineColorAndroid={ 'transparent' }
								value = { this.state.inviteCode }
								onChangeText={ (text) => this.setState({ inviteCode: text }) }/>
						</View>
						<View style={ [styles.loginBtn,{ marginTop: 50 }] }>
							<Button
								title='下一步'
								style={ styles.btn }
								textStyle={ styles.btnText }
								onPress={ this._nextStepReg } />
						</View>
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

function mapStateToProps (state) {
	const { app } = state;
	return {
		loading: app.get('loading'),
		upgradeForce: app.get('upgradeForce'),
		showFloatDialog: app.get('showFloatDialog'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	};
}

function mapDispatchToProps (dispatch) {
	return {
		dispatch,
		_getSmsCode: (body, ref) => {
			startTime = new Date().getTime()
			dispatch(fetchData({
				body,
				api: GET_SMS_CODE,
				method: 'POST',
				msg: '验证码发送成功',
				successToast: true,
				showLoading: true,
				success: () => {
					ref.startCountDown();
					// dispatch(appendLogToFile('注册','获取验证码',startTime))
				}
			}));
		},
		_checkSmsCode: (body, navigation) => {
			startTime = new Date().getTime()
			dispatch(fetchData({
				body,
				method: 'GET',
				showLoading: true,
				api: CHECK_SMG_CODE,
				success: () => {
					navigation.dispatch({type:RouteType.ROUTE_REGISTER_PWD,params:{title:'注册',phone: body.phoneNumber, code: body.verifyCode ,inviteCode: body.inviteCode}});
					// dispatch(appendLogToFile('注册','校验短信验证码',startTime))
				}
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
