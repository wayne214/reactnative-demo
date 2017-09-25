import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Image,
	TextInput,
	NativeModules,
	TouchableOpacity,
	ScrollView,
	Keyboard,
	Dimensions,
	ImageBackground
} from 'react-native';
import styles from '../../../assets/css/auth';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'
import BaseComponent from '../../components/common/baseComponent';
import Button from '../../components/common/button';
import { SAVE_DRIVER_INFO, GET_IMG_CODE, GET_SMS_CODE } from '../../constants/api';
import CountDownView from '../../components/common/countDownView';
import * as RouteType from '../../constants/routeType';
import { dispatchRefreshDriver, dispatchRefreshDriverInfo, dispatchGetDriverInfo } from '../../action/driver';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import { OOS_CONFIG, ADD_COMPANY_AUTH ,SELECT_DRIVER_INFO, SELECT_DRIVER_INFO_BY_PHONE} from '../../constants/api';
import { fetchData, updateOSSConfig } from '../../action/app';
import { HOST, OSS_ADD_DRIVER } from '../../constants/setting';
import CardIDImg from '../../../assets/img/user/driveID.png';
import CommonImagePicker from '../../components/common/commonImagePicker';
import ExampleImage from '../../../assets/img/auth/driver_license.png';
import HelperUtil from '../../utils/helper';
import EnlargeImage from '../../../assets/img/enlarge.png';
import ImagePreview from '../../components/common/imagePreview'

const { height,width } = Dimensions.get('window')

class AddDriverContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
			driverName: '',
			driverLicence: '',
			phone: '',
			code: '',
			verifyCode: '',
			verifyCodeKey: Math.floor(Math.random(1) * 100000000),
			showImagePicker: false,
			addDriverLicenseSource: '',
			addDriverLicensePath: '',

			driverLoadingText: '',
			enlargeImage: EnlargeImage,
			showPhoto: false,
	  	activeIndex: 0
		};
    this.title = props.navigation.state.params.title;
		this._saveDriverInfo = this._saveDriverInfo.bind(this);
		this._getMsgCode = this._getMsgCode.bind(this);
		this._imageAction = this._imageAction.bind(this);
		this._keyboardDidHide = this._keyboardDidHide.bind(this);
	}

	componentWillReceiveProps(props){
		const { isRefreshDriverInfo  } = props;
	}

	componentWillMount () {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
  	super.componentWillUnmount();
		this.keyboardDidHideListener.remove();
  }
  _keyboardDidHide() {
		// this.refs.inputname && this.refs.inputname.blur();
		// this.refs.inputdriverId && this.refs.inputdriverId.blur();
		// this.refs.inputphone && this.refs.inputphone.blur();
		// this.refs.inputcode && this.refs.inputcode.blur();
		// this.refs.inputphoneCode && this.refs.inputphoneCode.blur();
	}


	static propTypes = {
		router: React.PropTypes.object
	}

	_getMsgCode () {
		const ref = this.countDownView;
		if (!this.state.phone) return Toast.show('请输入手机号码');
		if (!Regex.test('mobile', this.state.phone)) return Toast.show('手机号格式不正确');
		if (!this.state.verifyCode) return Toast.show('请先填写图形验证码');

		this.props._getSmsCode({
			phoneNumber: this.state.phone,
			verifyCode: this.state.verifyCode,
			verifyCodeKey: this.state.verifyCodeKey,
			verifyType: 4 ,// 短信验证码类型 1：注册 2：修改密码 3：忘记密码 4:新增司机
			loginType: 2,
		}, ref);
	}

	_saveDriverInfo() {

		if (!this.state.driverName) return Toast.show('请输入司机姓名');
		if (!Regex.test('carUsername', this.state.driverName)) return Toast.show('姓名格式不正确');
		if (!this.state.driverLicence) return Toast.show('请输入驾驶证号');
		if (!Regex.test('driverLicence', this.state.driverLicence)) return Toast.show('驾驶证号格式不正确');
		if (!this.state.phone) return Toast.show('请输入手机号码');
		if (!Regex.test('mobile', this.state.phone)) return Toast.show('手机号码格式不正确');
		if (!this.state.verifyCode) return Toast.show('请输入图形验证码');
		if (!this.state.code) return Toast.show('请输入手机验证码');
		if (!this.state.addDriverLicenseSource) return Toast.show('请上传驾驶证照片');
		if (this.state.driverLoadingText !== '') return Toast.show('驾驶证照片还未上传成功');
	
		this.props.saveDriverInfo({
			carrierId: this.props.user.userId,
			driverName: this.state.driverName,
			driverNumber: this.state.driverLicence,
			driverPhone: this.state.phone,
			checkNumber: this.state.code,
			driverLicenseUrl: this.props.driverLicenseImgName,
		}, this.props.navigation);
	}

	_imageAction(){
		this.setState({ showImagePicker: true, type: 'addDriverLicense' });
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};

	render () {
		const { router } = this.props;
		let driverIdCardImage;
		let driverName;
		let driverLicence;
		let driverTelephone;
		let enlargeImg;
		let imagePathes=[];
		imagePathes.push(this.state.addDriverLicenseSource.uri);
		if (this.state.addDriverLicenseSource) {			
			enlargeImg =(						
				<TouchableOpacity style = {styles.touchStyle}
					onPress={()=>{this.setState({showPhoto: true, activeIndex: 1})}}>
					<ImageBackground style={styles.enlargeStyle} source={this.state.enlargeImage}/>
				</TouchableOpacity>)					
		} 
		driverIdCardImage = (
			<View style={ styles.IDViewStyle }>
				<TouchableOpacity
					onPress={ this._imageAction }>
					<ImageBackground source={ this.state.addDriverLicenseSource || CardIDImg } style={ styles.IDImgStyle }>
					{
						(() => {
							if (this.state.driverLoadingText === '正在上传') {
								return (
									<View style={ styles.modal }>
										<Text style={ styles.uploadText }>正在上传</Text>
									</View>
								);
							} else if (this.state.driverLoadingText === '重新上传') {
								return (
									<View style={ styles.modal }>
										<Text style={ styles.uploadText }>重新上传</Text>
									</View>
								);
							} else if (this.state.driverLoadingText === '') {
								return null;
							}
						})()
					}
					{ enlargeImg }
					</ImageBackground>
				</TouchableOpacity>
			</View>)
		driverName = (
			<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 1, borderTopColor: '#e6eaf2' }] }>
				<View style={ styles.hiddenLeft }>
					<Text style={ styles.hiddenText }>司机姓名</Text>
				</View>
				<View style={ styles.hiddenRight }>
					<TextInput
						ref='inputname'
						textAlign='right'
						placeholder='请输入司机姓名'
						placeholderTextColor='#ccc'
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						value={this.state.driverName}
						onChangeText={ text => this.setState({ driverName: text }) }/>
				</View>
			</View>)
		driverLicence = (
			<View style={ styles.hiddenCellContainer }>
				<View style={ styles.IDLeft }>
					<Text style={ styles.hiddenText }>驾驶证号/身份证号</Text>
				</View>
				<View style={ styles.IDRight }>
					<TextInput
						ref='inputdriverId'
						textAlign='right'
						placeholder='请输入驾驶证号(身份证号)'
						placeholderTextColor='#ccc'
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						value={this.state.driverLicence}
						onChangeText={ text => this.setState({ driverLicence: text }) }/>
				</View>
			</View>)
		driverTelephone = (
			<View style={ styles.hiddenCellContainer }>
				<View style={ styles.hiddenLeft }>
					<Text style={ styles.hiddenText }>联系手机号</Text>
				</View>
				<View style={ styles.hiddenRight }>
					<TextInput
						ref='inputphone'
						textAlign='right'
						placeholder='请输入联系手机号'
						placeholderTextColor='#ccc'
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						value={this.state.phone}
						onChangeText={ text => this.setState({ phone: text }) }/>
				</View>
			</View>)
		return (
			<View style={ styles.container }>

				<ScrollView keyboardShouldPersistTaps='handled' style={ styles.container }>
					<View style={ styles.desTextContainer }><Text style={ styles.desText }>司机信息</Text></View>
					{ driverName }
					{ driverLicence }
					{ driverTelephone }
					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>图形验证码</Text>
						</View>
						<View style={ styles.hiddenRight }>
							<TextInput
								ref='inputcode'
								textAlign='right'
								placeholder='请输入验证码'
								placeholderTextColor='#ccc'
								style={ styles.textInput }
								underlineColorAndroid={ 'transparent' }
								value={this.state.verifyCode}
								onChangeText={ text => this.setState({ verifyCode: text }) }/>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => this.setState({ verifyCodeKey: Math.floor(Math.random(1) * 100000000) }) }>
								<Image style={ styles.imgStyle } source={{ uri: HOST + GET_IMG_CODE + '?verifyCodeKey=' + this.state.verifyCodeKey }} />
							</TouchableOpacity>
						</View>
					</View>
					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>手机验证码</Text>
						</View>
						<View style={ styles.hiddenRight }>
							<TextInput
							  ref='inputphoneCode'
								textAlign='right'
								placeholder='请输入手机验证码'
								placeholderTextColor='#ccc'
								style={ styles.textInput }
								underlineColorAndroid={ 'transparent' }
								value={this.state.code}
								onChangeText={ text => this.setState({ code: text }) }/>

						<CountDownView
							count={ 60 }
							pressAction={ this._getMsgCode }
							ref={ (e) => {this.countDownView = e} }/>
						</View>
					</View>

					<View style={ styles.IDCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>驾驶证照片</Text>
						</View>
					</View>
					{ driverIdCardImage }

					<View style={ styles.loginBtn }>
						<Button
							title='保存'
							style={ styles.btn }
							textStyle={ styles.btnText }
							onPress={ this._saveDriverInfo }/>
					</View>
				</ScrollView>

				<ImagePreview show={this.state.showPhoto} activeIndex={this.state.activeIndex} imagePathes={imagePathes} hide={()=>{
					this.setState({ showPhoto: false })}}/>

				<CommonImagePicker
					type={ this.state.type }
					show={ this.state.showImagePicker }
					configData={{}}
					cameraAction={ image => {}}
					actionBack={ image => {
						if (image[0].type === 'addDriverLicense') this.setState({ addDriverLicenseSource: image[0].source, addDriverLicensePath: image[0].path, driverLoadingText: '正在上传' });
						this.props._getOssConfig({ type: image[0].type, path: image[0].path }, (type) => {
							this.setState({ driverLoadingText: '' })
						}, () => {
							this.setState({ driverLoadingText: '重新上传' })
						});
					}}
					libraryAction={ image => {} }
					exampleImage={ ExampleImage }
					cancleAction={ () => { this.setState({ showImagePicker: false }) }}
					exampleImageIntroduction={ '' }/>

					{ this.props.loading ? this._renderLoadingView() : null }

					{ this._renderUpgrade(this.props) }
			</View>
		);
	}
}

const mapStateToProps = state => {
	const { app, driver} = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		driverLicenseImgName: app.getIn(['ossImg', 'addDriverLicense']),
		isRefreshDriverInfo: driver.get('isRefreshDriverInfo'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
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
		saveDriverInfo: (body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: SAVE_DRIVER_INFO,
				msg: '添加成功',
				successToast: true,
				showLoading: true,
				success: () => {
					navigation.dispatch({ type: 'pop' });
					dispatch(dispatchRefreshDriver());
				}
			}));
		},
		_getOssConfig: (params, success, fail) => {
			const url = HOST + OOS_CONFIG + OSS_ADD_DRIVER;
			fetch(url).then(response => response.json()).then(responseJson => {
				dispatch(updateOSSConfig({ type: params.type, path: responseJson.dir + '.png' }));
				NativeModules.OssModule.init(params.path, responseJson.dir + '.png', responseJson.bucket, url, params.type)
					.then((type) => {
						success(type)
					}, (reject) => {
						fail(reject.code)
					}).catch(e => console.log(e));
			}).catch(e => console.log(e));
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDriverContainer);
