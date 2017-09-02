import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Image,
	TextInput,
	ScrollView,
	NativeModules,
	TouchableOpacity,
	InteractionManager,
	Keyboard,
	Alert,
	Dimensions,
	Platform
} from 'react-native';
import Regex from '../../utils/regex';
import Toast from '../../utils/toast';
import styles from '../../../assets/css/auth';
import NavigatorBar from '../../components/common/navigatorbar';
import Button from '../../components/common/button';
// import Image from '../../components/common/image';
import ComBineIcon from '../../../assets/img/user/combime.png';
import CompanyCodeIcon from '../../../assets/img/user/compcode.png';
import ShuiWIcon from '../../../assets/img/user/shuiw.png';
import YingYeIcon from '../../../assets/img/user/yingye.png';
import Checkbox from '../../components/common/checkbox';
import MainContainer from '../app/main';
import * as RouteType from '../../constants/routeType';
import { HOST, OSS_CARRIER_AUTH } from '../../constants/setting';
import { fetchData, getInitStateFromDB, mergeUser, updateOSSConfig } from '../../action/app';
import { OOS_CONFIG, ADD_COMPANY_AUTH,GET_AUTHINFO_DETAIL } from '../../constants/api';
import CommonImagePicker from '../../components/common/commonImagePicker';
import ExampleImage from '../../../assets/img/auth/org_code.png';
import ExampleImageYY from '../../../assets/img/auth/business_licence.png';
import ExampleImageC from '../../../assets/img/auth/transport_licence.png';
import ExampleImageS from '../../../assets/img/auth/tax_enrol_certificate.png';
import User from '../../models/user';
import { dispatchGetCarrierDetail ,dispatchCombineStatus } from '../../action/carrier';
import dismissKeyboard from 'dismissKeyboard';
import BaseComponent from '../../components/common/baseComponent';
import EnlargeImage from '../../../assets/img/enlarge.png';
import ImagePreview from '../../components/common/imagePreview'

const { height,width } = Dimensions.get('window')

class CompanyAuthContainer extends BaseComponent {

	constructor(props) {
		super(props);
    this.title = props.navigation.state.params.title;
		this.state = {
			currentTab: 1,
			comBine: true,//true: 选中三证合一；false: 选中非三证合一
			combineImgPath: '',
			combineImgSource: '',
			yingyeImgPath: '',
			yingyeImgSource: '',
			companyImgPath: '',
			companyImgSource: '',
			shuiwImgPath: '',
			shuiwImgSource: '',
			showImagePicker: false,

			corporationPhoneNumber: '',
			corporation: '',
			companyName: '',
			bankAccount: '',
			bankAccountNumber: '',
			certificatesCode: '',//统一社会信用代码
			organizationCode:'',//组织机构代码

			type: '',
			exampleImg: ExampleImage,
			navigatorTitle: '重新认证',

			combineLoadingText: '',
			yingYeLoadingText: '',
			companyLoadingText: '',
			shuiwLoadingText: '',

			enlargeImage: EnlargeImage,
			showPhoto: false,
	  	activeIndex: 0,
	  	certificatesType:'',//证件类型 1:普通 2:三证合一

	  	isCanEdit: true,
	  	imagePathes:[],
		};
		this.authType = ''
		this._auth = this._auth.bind(this);
		this._keyboardDidHide = this._keyboardDidHide.bind(this);
		this._showImage = this._showImage.bind(this);
	}
	componentWillMount () {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
  	super.componentWillUnmount();
		this.keyboardDidHideListener.remove();
  }

	_keyboardDidHide() {
		// this.refs.inputcompany && this.refs.inputcompany.blur();
		// this.refs.inputname && this.refs.inputname.blur();
		// this.refs.inputcode && this.refs.inputcode.blur();
	}

	componentDidMount() {
		super.componentDidMount();
		// 如果是认证失败的，请求一下认证详情
		if(this.props.user.certificationStatus === 3 ){
			this.props.getCarrierDetail({
				carrierId: this.props.user.userId,
			});
		}
	}
	componentWillReceiveProps(props) {
		const { user, auth } = props;
		if( user.certificationStatus=== 3 && auth && this.state.isCanEdit){
			this.setState({
				companyName: auth.companyName,
				corporation: auth.corporation,
				comBine: auth.certificatesType === 1 ? false : true ,
				certificatesCode: auth.certificatesType === 1 ? '': auth.certificatesCode  ,
				organizationCode: auth.certificatesType === 1 ? auth.certificatesCode : '' ,
				isCanEdit: false
			});
		}
	}

	_selectPic (type) {
		this.type = type;
		let exampleImage;
		if (type === 'comBineImg') exampleImage = ExampleImageYY;
		if (type === 'yingYeImg') exampleImage = ExampleImageYY;
		if (type === 'companyImg') exampleImage = ExampleImage;
		if (type === 'shuiwImg') exampleImage = ExampleImageS;
		this.setState({ showImagePicker: true, type: type, exampleImg: exampleImage });
	}

	_auth () {
		if (!this.state.companyName) return Toast.show('请填写公司名称');
		if (this.state.companyName.length > 40) return Toast.show('公司名称格式不正确');
		if (!this.state.corporation) return Toast.show('请填写法人姓名');
		if (!Regex.test('carUsername', this.state.corporation)) return Toast.show('法人姓名格式不正确');
		if ( this.state.comBine ){
			if (!this.state.certificatesCode) return Toast.show('请填写统一社会信用代码');
			if (!Regex.test('certificatesCode', this.state.certificatesCode)) return Toast.show('统一社会信用代码格式不正确');
			if (!this.state.combineImgSource) return Toast.show('请上传三证合一照片');
			if (this.state.combineLoadingText !== '') return Toast.show('图片还未上传成功')
		}else{
			if (!this.state.organizationCode) return Toast.show('请填写组织机构代码');
			if (!Regex.test('certificatesCode', this.state.organizationCode)) return Toast.show('组织机构格式不正确');
			if (!this.state.yingyeImgSource) return Toast.show('请上传营业执照');
			if (!this.state.companyImgSource) return Toast.show('请上传组织机构代码证');
			if (!this.state.shuiwImgSource) return Toast.show('请上传税务登记证');
			if (this.state.yingYeLoadingText !== '' ){
				return Toast.show('营业执照图片还未上传成功')
			}else if( this.state.companyLoadingText !== '' ){
				return Toast.show('组织机构代码证图片还未上传成功')
			}else if( this.state.shuiwLoadingText !== '' ){
				return Toast.show('税务登记证图片还未上传成功')
			}
		}	
		// }

		let _businessLicenseImgUrl;
		// if (this.props.auth && this.props.auth.certificatesType === 1) {//非三证合一
		// 	_businessLicenseImgUrl = this.props.yingyeImgName;
		// } else if(this.props.auth && this.props.auth.certificatesType === 2) {//三证合一
		// 	_businessLicenseImgUrl = this.props.combineImgName;
		// } else {//未认证
		_businessLicenseImgUrl = (this.state.comBine ?  this.props.combineImgName: this.props.yingyeImgName);
		// }
		dismissKeyboard();
		Alert.alert('提示', '请确保与营业执照上的法人姓名保持一致,否则可能不通过哦', [
  		{ text: '取消', onPress: () => console.log('取消') },
  		{ text: '确定', onPress: () => {
				this.props.addCompanyAuthInfo({
					carrierType: 1,
					id: this.props.user.userId,
					corporationPhoneNumber: this.state.corporationPhoneNumber, // 法人手机号
					corporation: this.state.corporation , // 法人姓名
					companyName: this.state.companyName , // 公司名称
					// bankAccount: this.state.bankAccount, // 开户银行
					// bankAccountNumber: this.state.bankAccountNumber, // 开户账号
					certificatesType: this.state.comBine ? 2 : 1, // 证件类型 1:普通 2:三证合一
					certificatesCode: this.state.comBine ? this.state.certificatesCode : this.state.organizationCode , // 组织机构代码/社会统一信用代码
					// businessLicenseImgUrl: 'license', // 营业执照图片地址 (三证合一，用这个key)
					// taxRegCertificateImgUrl: 'certificate', // 税务登记证图片地址
					// organizationCodeCertificateImgUrl: 'organization', // 组织机构代码证图片地址
					// 营业执照图片地址 (三证合一，用这个key)
					businessLicenseImgUrl: _businessLicenseImgUrl,
					taxRegCertificateImgUrl: this.props.shuiwImgName, // 税务登记证图片地址
					organizationCodeCertificateImgUrl: this.props.companyImgName, // 组织机构代码证图片地址
				}, this.props.navigation);
  		}},
  	]);
	}
	_showImage(type){
		let source ;
		let examleImage ;
		let textLoading;
		switch(type){
			case 1:
			source = this.state.combineImgSource ;
			exampleImage = ComBineIcon;
			textLoading = this.state.combineLoadingText;
			break;
			case 2:
			source = this.state.yingyeImgSource ;
			exampleImage = YingYeIcon;
			textLoading = this.state.yingYeLoadingText;
			break;
			case 3:
			source = this.state.companyImgSource;
			exampleImage = CompanyCodeIcon;
			textLoading = this.state.companyLoadingText;
			break;
			case 4:
			source = this.state.shuiwImgSource;
			exampleImage = ShuiWIcon;
			textLoading = this.state.shuiwLoadingText;
			break;
		}
		let enlargeImg;
		if(source){
			let temp = [];
			temp.push(source.uri);
			enlargeImg=(
				<TouchableOpacity style = {styles.touchStyle}
					onPress={()=>{this.setState({showPhoto: true, activeIndex: 1, imagePathes: temp})}}>
					<Image style={styles.enlargeStyle} source={this.state.enlargeImage}/>
				</TouchableOpacity>)
		}
		let image = (
			<Image style={ styles.img } source={ source || exampleImage }>
				{
					(() => {
						if (textLoading === '正在上传') {
							return (
								<View style={ styles.modal }>
									<Text style={ styles.uploadText }>正在上传</Text>
								</View>
							);
						} else if (textLoading === '重新上传') {
							return (
								<View style={ styles.modal }>
									<Text style={ styles.uploadText }>重新上传</Text>
								</View>
							);
						} else if (textLoading === '') {
							return null;
						}
					})()
				}
				{ enlargeImg }
			</Image>);
		return image;
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};
	render () {
		const { navigation, user, auth } = this.props;
		let imgItems;
		let aptitude;
		let companyName;
		let name;
		let code;
		let checkBox;
		let navigator;
		let comBineImg = this._showImage(1);
		let yingYeImg = this._showImage(2);
		let companyImg = this._showImage(3);
		let shuiwImg = this._showImage(4);
		companyName = (
			<View style={ styles.hiddenRight }>
				<TextInput
					ref='inputcompany'
					textAlign='right'
					placeholder='请输入公司名称'
					placeholderTextColor='#ccc'
					style={ styles.inputText}
					underlineColorAndroid={ 'transparent' }
					value={this.state.companyName}
					onChangeText={ text => this.setState( { companyName : text } )}/>
			</View>)
		name = (
				<View style={ styles.textRight }>
					<TextInput
						ref='inputname'
						textAlign='right'
						placeholder='请输入法人姓名'
						placeholderTextColor='#ccc'
						style={ styles.textInput }
						defaultValue={ this.state.corporation }
						underlineColorAndroid={ 'transparent' }
						value={this.state.corporation}
						onChangeText={ text => this.setState({ corporation: text }) }/>
				</View>)
		checkBox = (
			<View style={ styles.checkBoxContainer }>
				<Text style={ [styles.hiddenText, { marginRight: 20 }] }>证件样式</Text>
				<Checkbox
					style={ styles.checkbox }
					isChecked={ this.state.comBine }
					checkedFun={ () => this.setState({ comBine: true }) }/>
				<Text style={ styles.checkBoxText }>三证合一</Text>
				<Checkbox
					style={ styles.checkbox }
					isChecked={ !this.state.comBine }
					checkedFun={ () => this.setState({ comBine: false }) }/>
				<Text style={ styles.checkBoxText }>非三证合一</Text>
			</View>)
		if(this.state.comBine){
			aptitude = (
				<View style={ styles.hiddenCellContainer }>
					<View style={ styles.textLeft }>
						<Text style={ styles.hiddenText }>统一社会信用代码</Text>
					</View>
					<View style={ styles.textRight }>
						<TextInput
							ref='inputcode'
							textAlign='right'
							placeholder='请输入信用代码'
							placeholderTextColor='#ccc'
							style={ styles.textInput }
							underlineColorAndroid={ 'transparent' }
							value={this.state.certificatesCode}
							onChangeText={ text => this.setState({ certificatesCode: text }) }/>
					</View>
				</View>)
			imgItems = (
				<View style={ styles.imgContent }>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.pressStyle }
						onPress={ this._selectPic.bind(this, 'comBineImg') }>
						{ comBineImg }
					</TouchableOpacity>
				</View>)
		}else{
			aptitude = (
				<View style={ styles.hiddenCellContainer }>
					<View style={ styles.textLeft }>
						<Text style={ styles.hiddenText }>组织机构代码</Text>
					</View>
					<View style={ styles.textRight }>
						<TextInput
							ref='inputcode'
							textAlign='right'
							placeholder='请输入组织机构代码'
							placeholderTextColor='#ccc'
							style={ styles.textInput }
							underlineColorAndroid={ 'transparent' }
							value={this.state.organizationCode}
							onChangeText={ text => this.setState({ organizationCode: text }) }/>
					</View>
				</View>)
			imgItems = (
				<View style={ styles.imgContainer }>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.imgContents }
						onPress={ this._selectPic.bind(this, 'yingYeImg') }>
						{ yingYeImg }
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.imgContents }
						onPress={ this._selectPic.bind(this, 'companyImg') }>
						{ companyImg }
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ [styles.imgContents,{marginBottom: 10}] }
						onPress={ this._selectPic.bind(this, 'shuiwImg') }>
						{ shuiwImg }
					</TouchableOpacity>
				</View>);
		}
		return (
			<View style={ styles.container }>
				{navigator}
				<ScrollView
					keyboardShouldPersistTaps='handled'
					style={ styles.contentContainer }
					showsVerticalScrollIndicator={ false }>

					<View style={ styles.desTextContainer }>
						<Text style={ styles.desText }>法人身份信息</Text>
					</View>

					<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 1, borderTopColor: '#e6eaf2' }]  }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>公司名称</Text>
						</View>
						{ companyName }
					</View>

					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.textLeft }>
							<Text style={ styles.hiddenText }>法人姓名</Text>
						</View>
						{ name }
					</View>

					<View style={ styles.desTextContainer }>
						<Text style={ styles.desText }>公司资质信息</Text>
					</View>

					<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 1, borderTopColor: '#e6eaf2' }] }>
						{ checkBox }
					</View>
					{ aptitude }
					{ imgItems }
					<View style={ [styles.loginBtn] }>
						<Button
							title='提交审核'
							style={ styles.btn }
							textStyle={ styles.btnText }
							onPress={ this._auth }/>
					</View>
				</ScrollView>
				<ImagePreview show={this.state.showPhoto} activeIndex={this.state.activeIndex} imagePathes={this.state.imagePathes} hide={()=>{
					this.setState({ showPhoto: false })}}/>

				<CommonImagePicker
					type={ this.state.type }
					show={ this.state.showImagePicker }
					configData={{}}
					cameraAction={ image => {}}
					actionBack={ image => {
						if (image[0].type === 'comBineImg') this.setState({ combineImgSource: image[0].source, combineImgPath: image[0].path, combineLoadingText: '正在上传' });
						if (image[0].type === 'yingYeImg') this.setState({ yingyeImgSource: image[0].source, yingyeImgPath: image[0].path, yingYeLoadingText: '正在上传' });
 						if (image[0].type === 'companyImg') this.setState({ companyImgSource: image[0].source, companyImgPath: image[0].path, companyLoadingText: '正在上传' });
 						if (image[0].type === 'shuiwImg') this.setState({ shuiwImgSource: image[0].source, shuiwImgPath: image[0].path, shuiwLoadingText: '正在上传' });
						this.props._getOssConfig({ type: image[0].type, path: image[0].path }, (type) => {
							if (type === 'comBineImg') this.setState({ combineLoadingText: '' })
							if (type === 'yingYeImg') this.setState({ yingYeLoadingText: '' })
							if (type === 'companyImg') this.setState({ companyLoadingText: '' })
							if (type === 'shuiwImg') this.setState({ shuiwLoadingText: '' })
						}, reject => {
							if (this.type === 'comBineImg') this.setState({ combineLoadingText: '重新上传' })
							if (this.type === 'yingYeImg') this.setState({ yingYeLoadingText: '重新上传' })
							if (this.type === 'companyImg') this.setState({ companyLoadingText: '重新上传' })
							if (this.type === 'shuiwImg') this.setState({ shuiwLoadingText: '重新上传' })
						});
					}}
					libraryAction={ image => {} }
					exampleImage={ this.state.exampleImg }
					cancleAction={ () => { this.setState({ showImagePicker: false }) }}
					exampleImageIntroduction={ '' }/>

					{ this.props.loading ? this._renderLoadingView() : null }
			</View>
		);
	}

}

function mapStateToProps(state) {
	const { app, carrier } = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		combineImgName: app.getIn(['ossImg', 'combineImgName']),
		yingyeImgName: app.getIn(['ossImg', 'yingyeImgName']),
		companyImgName: app.getIn(['ossImg', 'companyImgName']),
		shuiwImgName: app.getIn(['ossImg', 'shuiwImgName']),
		auth: carrier.getIn(['carrierInfo','carrierDetail']),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		addCompanyAuthInfo: (body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: ADD_COMPANY_AUTH,
				successToast: true,
				msg: '提交成功',
				showLoading: true,
				success: () => {
					const users = {
						companyName: body.companyName,
						certificationStatus: 1
					};
					new User().merge(users);
					dispatch(mergeUser(users));
			    navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '' } });
				}
			}));
		},
		_getOssConfig: (params, success, fail) => {
			const url = HOST + OOS_CONFIG + OSS_CARRIER_AUTH;
			fetch(url).then(response => response.json()).then(responseJson => {
				dispatch(updateOSSConfig({ type: params.type, path: responseJson.dir + '.png' }));
				NativeModules.OssModule.init(params.path, responseJson.dir + '.png', responseJson.bucket, url, params.type)
					.then((type)=> {
						// 成功
						success(type)
					}, (type) => {
						// 失败
						fail(type.code)
					}).catch(e => console.log(e));
			}).catch(e => console.log(e));;
		},
		getCarrierDetail: (body) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: GET_AUTHINFO_DETAIL,
				success: (data) =>{
					dispatch(dispatchGetCarrierDetail({data}));
				}
			}));
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAuthContainer);
