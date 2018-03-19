import React from 'react';
import {
	View,
	Text,
	Image,
	ImageBackground,
	Animated,
	TextInput,
	ScrollView,
	NativeModules,
	TouchableOpacity,
	Keyboard,
} from 'react-native'
import moment from 'moment';
import Regex from '../../utils/regex';
import Toast from '../../utils/toast';
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/car';
import Button from '../../components/common/button';
import SimplePicker from '../../components/common/picker';
import { CAR_TYPE, CAR_CATEGORY, CAR_VEHICLE } from '../../constants/json';
import Picker from 'react-native-picker-custom';
import DateHandler from '../../utils/dateHandler';
import { SAVE_CAR_INFO ,CERTIFICATION_CAR_INFO } from '../../constants/api';
import { fetchData, updateOSSConfig,clearImageSource,appendLogToFile } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import BaseComponent from '../../components/common/baseComponent';
import { dispatchRefreshCar } from '../../action/car';
import { HOST, OSS_ADD_CAR } from '../../constants/setting';
import { OOS_CONFIG, ADD_COMPANY_AUTH } from '../../constants/api';
import CommonImagePicker from '../../components/common/commonImagePicker';
import ExampleImage from '../../../assets/img/auth/car_example.png';
import ExampleImageLicense from '../../../assets/img/auth/driving_license.png';
import ExampleImageTransport from '../../../assets/img/auth/yingyun_licence.png';
import ExampleImageCar from '../../../assets/img/car/default_car_img.png';
import ExampleImageCarLincences from '../../../assets/img/car/default_xingshizheng_img.png';
import ExampleImageCarTransport from '../../../assets/img/car/default_yunyingzheng_img.png';
import HelperUtil from '../../utils/helper';
import EnlargeImage from '../../../assets/img/enlarge.png';
import ImagePreview from '../../components/common/singleImagePreview.js';
let startTime = 0
class AddCarContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			carTypeMap: '',
			carCategoryMap: HelperUtil.getObjectByInt(CAR_CATEGORY,1),
			carVehicelMap: '',
			data: CAR_TYPE,
			visible: false,
			carActive: false,
			authActive: false,
			gauthActive: false,
			basicActive: true,
			carValue: new Animated.Value(0),
			authValue: new Animated.Value(0),
			gauthValue: new Animated.Value(0),
			basicValue: new Animated.Value(1),

			userName: '',
			phone: '',
			opertLicence: '',
			carNo: '',
			gcarNo: '',
			heavy: '',
			cube: '',
			rejectTime: '',
			carImgPath: '',
			opertImgPath: '',
			drivingImgPath: '',

			type: '',

			addCarCarImgSource: '',
			addCarLiencesImgSource: '',
			addCarYunYImgSource: '',
			addGCarLiencesImgSource: '',
			addGCarYunYImgSource: '',

			showImagePicker: false,

			showExampleImage: ExampleImage,
			driverLoadingTextAddCarCarImg: '',
			driverLoadingTextAddCarLiencesImg: '',
			driverLoadingTextAddCarYunYImg: '',
			driverLoadingTextAddGCarLiencesImg: '',
			driverLoadingTextAddGCarYunYImg: '',

			shouldShow: false,
			imagePathes: [],

		};
		// this.title = props.router.getCurrentRouteTitle();
		// this.key = props.router.getLastCurrentRouteKey();
		this._onPickerSelect = this._onPickerSelect.bind(this);
		this._initTimePicker = this._initTimePicker.bind(this);
		this._addCar = this._addCar.bind(this);
		this._showImage = this._showImage.bind(this);
		this._certificationCar = this._certificationCar.bind(this);
		this._keyboardDidHide = this._keyboardDidHide.bind(this);
		// this.hiddingBack = (this.key === 'ADD_ROUTE_PAGE' ? true : false);
	}

	componentWillMount () {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentDidMount(){
		super.componentDidMount();
		this.props.navigation.setParams({ navigatePress: this._addCar })
	}


  _keyboardDidHide() {
		// this.refs.inputname && this.refs.inputname.blur();
		// this.refs.inputphone && this.refs.inputphone.blur();
		// this.refs.inputyunying && this.refs.inputyunying.blur();
		// this.refs.inputcar && this.refs.inputcar.blur();
		// this.refs.inputcarId && this.refs.inputcarId.blur();
		// this.refs.inputweight && this.refs.inputweight.blur();
		// this.refs.inputcube && this.refs.inputcube.blur();
	}

	_startAnimated (type) {
		if (type === 'basic') {
			Animated.timing(this.state.basicValue, {
				duration: 300,
				toValue: this.state.basicActive ? 0 : 1,
			}).start();
			this.setState({ basicActive: !this.state.basicActive });
		} else if (type === 'car') {
			Animated.timing(this.state.carValue, {
				duration: 300,
				toValue: this.state.carActive ? 0 : 1,
			}).start();
			this.setState({ carActive: !this.state.carActive });
		} else if (type === 'auth') {
			Animated.timing(this.state.authValue, {
				duration: 300,
				toValue: this.state.authActive ? 0 : 1,
			}).start();
			this.setState({ authActive: !this.state.authActive });
		}else if (type === 'gauth') {
			Animated.timing(this.state.gauthValue, {
				duration: 300,
				toValue: this.state.gauthActive ? 0 : 1,
			}).start();
			this.setState({ gauthActive: !this.state.gauthActive });
		}
	}

	_onPickerSelect(data) {
		if (data.type === 'car_type') {
			this.setState({ carTypeMap: data });
		} else if (data.type === 'car_category') {
			this.setState({ carCategoryMap: data });
		} else if (data.type === 'car_vehicel') {
			this.setState({ carVehicelMap: data });
		}
		this.setState({ visible: false })
	}

	_initTimePicker() {
    Picker.init({
        pickerData: DateHandler.createDateData(),
        pickerConfirmBtnText: '确定',
        pickerCancelBtnText: '取消',
        pickerTitleText: '报废日期',
				pickerBg: [230, 234, 242, 1],
				pickerToolBarBg: [255, 255, 255, 1],
        onPickerConfirm: data => {
            // console.log(data);
            let time = data.join('').replace('年', '-').replace('月', '-').replace('日', '');
            this.setState({ rejectTime: time });
        },
        onPickerCancel: data => {
            // console.log(data);
        },
        onPickerSelect: data => {
            // console.log(data);
        }
    });
    Picker.show();
	}

	_addCar() {
		// TODO 校验操作
		if(!this.state.userName
			&& !this.state.phone
			&& !this.state.opertLicence
			&& !this.state.carNo
			&& !this.state.gcarNo
			// && !this.state.carCategoryMap.key
			&& !this.state.carTypeMap.key
			&& !this.state.heavy
			&& !this.state.cube
			&& !this.state.carVehicelMap.key
			// && !this.state.rejectTime
			){
			return Toast.show('请至少填写一项信息');
		}

		if (this.state.phone && !Regex.test('mobile', this.state.phone)) return Toast.show('手机号格式不正确');
		if (this.state.opertLicence && !Regex.test('transportOperation', this.state.opertLicence)) return Toast.show('运营许可证号格式不正确');
		if (this.state.carNo && !Regex.test('carNo', this.state.carNo)) return Toast.show('车牌号格式不正确');

		if (this.state.heavy && (this.state.heavy > 999 || this.state.heavy <= 0)) return Toast.show('载重输入值应为0~999之间的数');
		if (this.state.heavy && !Regex.test('twoDecimal', this.state.heavy)) return Toast.show('载重数值小数点后不超过两位');
		if (this.state.cube && !Regex.test('twoDecimal', this.state.cube)) return Toast.show('体积数值小数点后不超过两位');
		if (this.state.cube && (this.state.cube > 999 || this.state.cube <= 0)) return Toast.show('体积输入值应为0~999之间的数');
		let gCarNo = (!this.state.gcarNo)?'': this.state.gcarNo;
		let gCarLiencesName = this.props.addGCarLiencesName? this.props.addGCarLiencesName: '';
		let gCarYunYName = this.props.addGCarYunYName? this.props.addGCarYunYName:'';
		if(this.state.carTypeMap && (this.state.carTypeMap.key === 1 || this.state.carTypeMap.key === 3)){
			gCarNo = '';
			gCarLiencesName = '';
			gCarYunYName = '';
		}
		if (gCarNo && !Regex.test('carNo', gCarNo)) return Toast.show('挂车车牌号格式不正确');
		if (gCarNo) {
			if (this.state.driverLoadingTextAddGCarLiencesImg !== '') {
				return Toast.show('挂车行驶证图片还未上传成功')
			}
			if (this.state.driverLoadingTextAddGCarYunYImg !== '') {
				return Toast.show('挂车营运证图片还未上传成功')
			}
		}
		if (this.state.driverLoadingTextAddCarCarImg !== '') {
			return Toast.show('车辆图片还未上传成功')
		}
		if (this.state.driverLoadingTextAddCarLiencesImg !== '') {
			return Toast.show('行驶证图片还未上传成功')
		}
		if (this.state.driverLoadingTextAddCarYunYImg !== '') {
			return Toast.show('营运证图片还未上传成功')
		}

		this.props.saveCarInfo({
			carrierId: this.props.user.userId,
			carName: (!this.state.userName)?'': this.state.userName,
			phoneNumber: (!this.state.phone)?'': this.state.phone,
			transportationLicense: (!this.state.opertLicence)?'': this.state.opertLicence,
			carNo: (!this.state.carNo)?'': this.state.carNo,
			gcarNo: gCarNo,
			carType: (!this.state.carTypeMap.key)?'': this.state.carTypeMap.key,
			carCategory: (!this.state.carCategoryMap.key)?'': this.state.carCategoryMap.key,
			carLength: (!this.state.carVehicelMap.key)?'': this.state.carVehicelMap.key,
			loadSize: (!this.state.heavy)?'': this.state.heavy,
			volumeSize: (!this.state.cube)?'': this.state.cube,
			// scrapDate: (!this.state.rejectTime)?'': HelperUtil.getFormatDate(this.state.rejectTime),
			carImageUrl: this.props.addCarCarName,
			drivingLicenseUrl: this.props.addCarLiencesName,
			operateLicenseUrl: this.props.addCarYunYName,
			gdrivingLicenseUrl: gCarLiencesName,
			goperateLicenseUrl: gCarYunYName
		}, this.props.navigation);
	}


	_certificationCar() {

		// TODO 校验操作
		if (!this.state.userName) return Toast.show('请输入车主姓名');
		if (!this.state.phone) return Toast.show('请输入车主手机号');
		if (!Regex.test('mobile', this.state.phone)) return Toast.show('手机号格式不正确');
		if (!this.state.opertLicence) return Toast.show('请输入运营许可证号');
		if (!Regex.test('transportOperation', this.state.opertLicence)) return Toast.show('运营许可证号格式不正确');
		if (!this.state.carNo) return Toast.show('请输入车牌号');
		if (!Regex.test('carNo', this.state.carNo)) return Toast.show('车牌号格式不正确');
		if (!this.state.carCategoryMap.key) return Toast.show('请选择车辆类别');
		if (!this.state.carTypeMap.key) return Toast.show('请选择车辆类型');

		if (!this.state.heavy) return Toast.show('请输入最大载重');
		if (this.state.heavy > 999 || this.state.heavy <= 0) return Toast.show('载重输入值应为0~999之间的数');
		if (!Regex.test('twoDecimal', this.state.heavy)) return Toast.show('载重数值小数点后不超过两位');
		if (!this.state.cube) return Toast.show('请输入最大体积');
		if (!Regex.test('twoDecimal', this.state.cube)) return Toast.show('体积数值小数点后不超过两位');
		if (this.state.cube > 999 || this.state.cube <= 0) return Toast.show('体积输入值应为0~999之间的数');
		if (!this.state.carVehicelMap.key) return Toast.show('请选择车辆长度');
		// if (!this.state.rejectTime) return Toast.show('请选择报废日期');
		if (!this.state.addCarCarImgSource  ) return Toast.show('请上传车辆图片');
		if (!this.state.addCarLiencesImgSource ) return Toast.show('请上传行驶证图片');
		if (!this.state.addCarYunYImgSource ) return Toast.show('请上传营运证图片');
		let gCarNo = this.state.gcarNo;
		let gCarLiencesName = this.props.addGCarLiencesName? this.props.addGCarLiencesName: '';
		let gCarYunYName = this.props.addGCarYunYName? this.props.addGCarYunYName:'';
		if(this.state.carTypeMap.key === 2 || this.state.carTypeMap.key === 4){
			if (!this.state.gcarNo) return Toast.show('请输入挂车车牌号');
			if (!Regex.test('carNo', this.state.gcarNo)) return Toast.show('挂车车牌号格式不正确');
			if (!this.state.addGCarLiencesImgSource ) return Toast.show('请上传挂车行驶证图片');
			if (!this.state.addGCarYunYImgSource ) return Toast.show('请上传挂车营运证图片');
			if (this.state.driverLoadingTextAddGCarLiencesImg !== '') {
				return Toast.show('挂车行驶证图片还未上传成功')
			}
			if (this.state.driverLoadingTextAddGCarYunYImg !== '') {
				return Toast.show('挂车营运证图片还未上传成功')
			}
		}else{
			gCarNo = '';
			gCarLiencesName = '';
			gCarYunYName = '';
		}
		if (this.state.driverLoadingTextAddCarCarImg !== '') {
			return Toast.show('车辆图片还未上传成功')
		}
		if (this.state.driverLoadingTextAddCarLiencesImg !== '') {
			return Toast.show('行驶证图片还未上传成功')
		}
		if (this.state.driverLoadingTextAddCarYunYImg !== '') {
			return Toast.show('营运证图片还未上传成功')
		}


		this.props.certificationCarInfo({
			carrierId: this.props.user.userId,
			carName: this.state.userName,
			phoneNumber: this.state.phone,
			transportationLicense: this.state.opertLicence,
			carNo: this.state.carNo,
			gcarNo: gCarNo,
			carType: this.state.carTypeMap.key,
			carCategory: this.state.carCategoryMap.key,
			carLength: this.state.carVehicelMap.key,
			loadSize: this.state.heavy,
			volumeSize: this.state.cube,
			// scrapDate: HelperUtil.getFormatDate(this.state.rejectTime),
			carImageUrl: this.props.addCarCarName,
			drivingLicenseUrl: this.props.addCarLiencesName,
			operateLicenseUrl: this.props.addCarYunYName,
			gdrivingLicenseUrl: gCarLiencesName,
			goperateLicenseUrl: gCarYunYName
		}, this.props.navigation);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.keyboardDidHideListener.remove();
		if (Picker) Picker.hide();
		this.props.dispatch(clearImageSource());
	}

	_showImage(type){
		let source ;
		let examleImage ;
		let txtLoading;
		switch(type){
			case 1:
			source = this.state.addCarCarImgSource ;
			exampleImage = ExampleImageCar;
			txtLoading = this.state.driverLoadingTextAddCarCarImg;
			break;
			case 2:
			source = this.state.addCarLiencesImgSource ;
			exampleImage = ExampleImageCarLincences;
			txtLoading = this.state.driverLoadingTextAddCarLiencesImg;
			break;
			case 3:
			source = this.state.addCarYunYImgSource;
			exampleImage = ExampleImageCarTransport;
			txtLoading = this.state.driverLoadingTextAddCarYunYImg;
			break;
			case 4:
			source = this.state.addGCarLiencesImgSource;
			exampleImage = ExampleImageCarLincences;
			txtLoading = this.state.driverLoadingTextAddGCarLiencesImg;
			break;
			case 5:
			source = this.state.addGCarYunYImgSource;
			exampleImage = ExampleImageCarTransport;
			txtLoading = this.state.driverLoadingTextAddGCarYunYImg;
			break;
		}
		let enlargeImg;
		if(source){
			let temp = [];
			temp.push(source.uri);
			// console.log('lqq---source.uri--',source.uri);
			enlargeImg=(
				<TouchableOpacity style = {styles.touchStyle}
					onPress={()=>{this.setState({shouldShow: true,imagePathes: temp})}}>
					<Image style={styles.enlargeStyle} source={EnlargeImage}/>
				</TouchableOpacity>)
		}
		let image = (
				<View style={ [styles.IDViewStyle, { marginTop: 5}] }>
						<ImageBackground source={ source || exampleImage } style={ styles.IDImgStyle }>
						{
							(() => {
								if (txtLoading === '正在上传') {
									return (
										<View style={ styles.modalNew }>
											<Text style={ styles.uploadText }>正在上传</Text>
										</View>
									);
								} else if (txtLoading === '重新上传') {
									return (
										<View style={ styles.modalNew }>
											<Text style={ styles.uploadText }>重新上传</Text>
										</View>
									);
								} else if (txtLoading === '') {
									return null;
								}
							})()
						}
						{enlargeImg}
						</ImageBackground>
				</View>);
		return image;
	}

	static navigationOptions = ({ navigation }) => {
		const {state, setParams} = navigation;
	  return {
	    header: <NavigatorBar
	    picker={ Picker }
	    firstLevelClick={ () => { navigation.state.params.navigatePress() } }
	    optTitle='保存'
	    router={ navigation }/>
	  };
	};


	render () {
		// console.log('=== addCarCarName image path ',this.props.addCarCarName)
		let addCarCarImg = this._showImage(1);
		let addCarLiencesImg = this._showImage(2);
		let addCarYunYImg = this._showImage(3);
		let addGCarLiencesImg = this._showImage(4);
		let addGCarYunYImg = this._showImage(5);
		return (
			<View style={ styles.container }>
				<ScrollView
					keyboardShouldPersistTaps='handled'
					showsVerticalScrollIndicator={ false }>
					<View style={ styles.blockContainer }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ this._startAnimated.bind(this, 'basic') }
							style={ styles.cellTipContainer }>
							<View style={ styles.speLeft }>
								<Text style={ styles.tipText }>基本信息</Text>
							</View>
							<View style={ styles.speRight }>
								<Animated.Text
									style={ [styles.iconFont, {
										transform: [
											{ rotate: this.state.basicValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe616;</Animated.Text>
							</View>
						</TouchableOpacity>
						<Animated.View
							style={ [styles.hiddenContainer, {
								height: this.state.basicValue.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 132]
								})
							}] }>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.nameLeft }>
									<Text style={ styles.hiddenText }>车主姓名/公司名称</Text>
								</View>
								<View style={ styles.nameRight }>
									<TextInput
										ref='inputname'
										textAlign='right'
										returnKeyType='done'
										placeholder='请输入车主姓名(公司名称)'
										placeholderTextColor='#ccc'
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.userName }
										onChangeText={ text => this.setState({ userName: text }) }/>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车主手机号</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										ref='inputphone'
										textAlign='right'
										keyboardType='numeric'
										placeholder='请输入车主手机号'
										placeholderTextColor='#ccc'
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value= { this.state.phone }
										onChangeText={ text => this.setState({ phone: text }) }/>
								</View>
							</View>
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>运营许可证号</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										ref='inputyunying'
										textAlign='right'
										returnKeyType='done'
										placeholder='请输入运营许可证号'
										placeholderTextColor='#ccc'
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.opertLicence }
										onChangeText={ text => this.setState({ opertLicence: text }) }/>
								</View>
							</View>
						</Animated.View>
					</View>

					<View style={ styles.blockContainer }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ this._startAnimated.bind(this, 'car') }
							style={ styles.cellTipContainer }>
							<View style={ styles.speLeft }>
								<Text style={ styles.tipText }>车辆信息</Text>
							</View>
							<View style={ styles.speRight }>
								<Animated.Text
									style={ [styles.iconFont, {
										transform: [
											{ rotate: this.state.carValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe616;</Animated.Text>
							</View>
						</TouchableOpacity>
						<Animated.View
							style={ [styles.hiddenContainer, {
								height: this.state.carValue.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 264]
								})
							}] }>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车牌号</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										ref='inputcar'
										textAlign='right'
										returnKeyType='done'
										placeholder='请输入车牌号'
										placeholderTextColor='#ccc'
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state. carNo }
										onChangeText={ text => this.setState({ carNo: text }) }/>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车辆类别</Text>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.hiddenRight }
									onPress={ () => this.setState({ visible: true, data: CAR_CATEGORY }) }>
									<Text style={ this.state.carCategoryMap.value ? styles.blackRightText : styles.rightText }>{ this.state.carCategoryMap.value || '请选择车辆类别' }</Text>
									<Text style={ styles.arrowRight }>&#xe60d;</Text>
								</TouchableOpacity>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车辆类型</Text>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.hiddenRight }
									onPress={ () => this.setState({ visible: true, data: CAR_TYPE }) }>
									<Text style={ this.state.carTypeMap.value ? styles.blackRightText : styles.rightText }>{ this.state.carTypeMap.value || '请选择车辆类型' }</Text>
									<Text style={ styles.arrowRight }>&#xe60d;</Text>
								</TouchableOpacity>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>最大载重</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										ref='inputweight'
										textAlign='right'
										keyboardType= 'numeric'
										placeholder='请填写'
										placeholderTextColor='#ccc'
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.heavy }
										onChangeText={ text => this.setState({ heavy: text }) }/>
									<Text style={ styles.hiddenTextCube }>吨</Text>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>最大体积</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										ref='inputcube'
										textAlign='right'
										keyboardType= 'numeric'
										placeholder='请填写'
										placeholderTextColor='#ccc'
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.cube }
										onChangeText={ text => this.setState({ cube: text }) }/>
									<Text style={ styles.hiddenTextCube }>方</Text>
								</View>
							</View>
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车辆长度</Text>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.hiddenRight }
									onPress={ () => this.setState({ visible: true, data: CAR_VEHICLE }) }>
									<Text style={ this.state.carVehicelMap.value ? styles.blackRightText : styles.rightText }>{ this.state.carVehicelMap.value || '请选择车辆长度' }</Text>
									<Text style={ styles.arrowRight }>&#xe60d;</Text>
								</TouchableOpacity>
							</View>
							{ false &&
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>强制报废期止</Text>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.hiddenRight }
									onPress={ this._initTimePicker }>
									<Text style={ styles.rightText }>{ this.state.rejectTime || '请选择车辆报废日期' }</Text>
									<Text style={ styles.arrowRight }>&#xe60d;</Text>
								</TouchableOpacity>
							</View>
						}
						</Animated.View>
					</View>

					<View style={ styles.blockContainer }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ this._startAnimated.bind(this, 'auth') }
							style={ styles.cellTipContainer }>
							<View style={ styles.speLeft }>
								<Text style={ styles.tipText }>认证资料</Text>
							</View>
							<View style={ styles.speRight }>
								<Animated.Text
									style={ [styles.iconFont, {
										transform: [
											{ rotate: this.state.authValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe616;</Animated.Text>
							</View>
						</TouchableOpacity>
						<Animated.View
							style={ [styles.hiddenContainer, {
								height: this.state.authValue.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 642]
								})
							}] }>

								<View style={ [styles.hiddenCellContainer,{borderBottomWidth:0}] }>
									<View style={ styles.hiddenLeft }>
										<Text style={ styles.hiddenText }>车辆图片</Text>
									</View>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => this.setState({ showImagePicker: true, type: 'addCarCarImg',showExampleImage: ExampleImage }) }
									>
									{addCarCarImg}
								</TouchableOpacity>

								<View style={ [styles.hiddenCellContainer,{borderBottomWidth:0}]  }>
									<View style={ styles.hiddenLeft }>
										<Text style={ styles.hiddenText }>行驶证图片</Text>
									</View>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => this.setState({ showImagePicker: true, type: 'addCarLiencesImg',showExampleImage: ExampleImageLicense }) }
									>
									{addCarLiencesImg}
								</TouchableOpacity>

								<View  style={ [styles.hiddenCellContainer,{borderBottomWidth:0}]  }>
									<View style={ styles.hiddenLeft }>
										<Text style={ styles.hiddenText }>营运证图片</Text>
									</View>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => this.setState({ showImagePicker: true, type: 'addCarYunYImg',showExampleImage: ExampleImageTransport }) }>
									{addCarYunYImg}
								</TouchableOpacity>
						</Animated.View>
					</View>
					{
						(this.state.carTypeMap.key === 2 || this.state.carTypeMap.key === 4) &&
						<View style={ styles.blockContainer }>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ this._startAnimated.bind(this, 'gauth') }
								style={ styles.cellTipContainer }>
								<View style={ styles.speLeft }>
									<Text style={ styles.tipText }>挂车信息</Text>
								</View>
								<View style={ styles.speRight }>
									<Animated.Text
										style={ [styles.iconFont, {
											transform: [
												{ rotate: this.state.gauthValue.interpolate({
													inputRange: [0, 1],
													outputRange: ['0deg', '-180deg']
												}) }
											]
										}] }>&#xe616;</Animated.Text>
								</View>
							</TouchableOpacity>
							<Animated.View
								style={ [styles.hiddenContainer, {
									height: this.state.gauthValue.interpolate({
										inputRange: [0, 1],
										outputRange: [0, 472]
									})
								}] }>
								<View style={ styles.hiddenCellContainer }>
										<View style={ styles.hiddenLeft }>
											<Text style={ styles.hiddenText }>挂车牌号</Text>
										</View>
										<View style={ styles.hiddenRight }>
											<TextInput
												ref='inputcarId'
												textAlign='right'
												returnKeyType='done'
												placeholder='请输入挂车牌号'
												placeholderTextColor='#ccc'
												style={ styles.textInput }
												underlineColorAndroid={ 'transparent' }
												value = { this.state.gCarNo }
												onChangeText={ text => this.setState({ gcarNo: text }) }/>
										</View>
									</View>

								<View style={ [styles.hiddenCellContainer,{borderBottomWidth:0}]  }>
									<View style={ styles.hiddenLeft }>
										<Text style={ styles.hiddenText }>行驶证图片</Text>
									</View>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => this.setState({ showImagePicker: true, type: 'addGCarLiencesImg',showExampleImage: ExampleImageLicense }) }
									>
									{addGCarLiencesImg}
								</TouchableOpacity>

								<View  style={ [styles.hiddenCellContainer,{borderBottomWidth:0}]  }>
									<View style={ styles.hiddenLeft }>
										<Text style={ styles.hiddenText }>营运证图片</Text>
									</View>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => this.setState({ showImagePicker: true, type: 'addGCarYunYImg',showExampleImage: ExampleImageTransport }) }>
									{addGCarYunYImg}
								</TouchableOpacity>
								</Animated.View>
						</View>
					}
					<View style={ [styles.loginView, { marginBottom: 20 }] }>
						<Button
							title='申请认证'
							style={ styles.btn }
							textStyle={ styles.btnText }
							onPress={ () => this._certificationCar() }/>
					</View>
				</ScrollView>

				<CommonImagePicker
					type={ this.state.type }
					show={ this.state.showImagePicker }
					configData={{}}
					cameraAction={ image => {}}
					actionBack={ image => {
						if (image[0].type === 'addCarCarImg') this.setState({ addCarCarImgSource: image[0].source , driverLoadingTextAddCarCarImg: '正在上传' });
						if (image[0].type === 'addCarLiencesImg') this.setState({ addCarLiencesImgSource: image[0].source , driverLoadingTextAddCarLiencesImg: '正在上传' });
						if (image[0].type === 'addCarYunYImg') this.setState({ addCarYunYImgSource: image[0].source, driverLoadingTextAddCarYunYImg: '正在上传'  });
						if (image[0].type === 'addGCarLiencesImg') this.setState({ addGCarLiencesImgSource: image[0].source , driverLoadingTextAddGCarLiencesImg: '正在上传' });
						if (image[0].type === 'addGCarYunYImg') this.setState({ addGCarYunYImgSource: image[0].source, driverLoadingTextAddGCarYunYImg: '正在上传'  });
						// this.props._getOssConfig({ type: image[0].type, path: image[0].path });
						this.props._getOssConfig({ type: image[0].type, path: image[0].path }, (type) => {
							if (type === 'addCarCarImg') this.setState({ driverLoadingTextAddCarCarImg: '' })
							if (type === 'addCarLiencesImg') this.setState({ driverLoadingTextAddCarLiencesImg: '' })
							if (type === 'addCarYunYImg') this.setState({ driverLoadingTextAddCarYunYImg: '' })
							if (type === 'addGCarLiencesImg') this.setState({ driverLoadingTextAddGCarLiencesImg: '' })
							if (type === 'addGCarYunYImg') this.setState({ driverLoadingTextAddGCarYunYImg: '' })
						}, (type) => {
							if (type === 'addCarCarImg') this.setState({ driverLoadingTextAddCarCarImg: '重新上传' })
							if (type === 'addCarLiencesImg') this.setState({ driverLoadingTextAddCarLiencesImg: '重新上传' })
							if (type === 'addCarYunYImg') this.setState({ driverLoadingTextAddCarYunYImg: '重新上传' })
							if (type === 'addGCarLiencesImg') this.setState({ driverLoadingTextAddGCarLiencesImg: '重新上传' })
							if (type === 'addGCarYunYImg') this.setState({ driverLoadingTextAddGCarYunYImg: '重新上传' })
						});
					}}
					libraryAction={ image => {} }
					exampleImage={ this.state.showExampleImage }
					cancleAction={ () => { this.setState({ showImagePicker: false }) }}
					exampleImageIntroduction={ '' }/>

				<SimplePicker
					data={ this.state.data }
					visible={ this.state.visible }
					modalPress={ () => this.setState({ visible: false }) }
					onPickerSelect={ data => this._onPickerSelect(data) } />
				<ImagePreview
					activeIndex={0}
					imagePathes={this.state.imagePathes}
					show={this.state.shouldShow}
					hide={()=>{
						this.setState({
							shouldShow: false
						})
					}}/>
				{ this.props.loading ? this._renderLoadingView() : null }
				{ this._renderUpgrade(this.props) }
			</View>
		);
	}

}

const mapStateToProps = state => {
	const { app } = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		addCarCarName: app.getIn(['ossImg', 'addCarCarName']),
		addCarLiencesName: app.getIn(['ossImg', 'addCarLiencesName']),
		addCarYunYName: app.getIn(['ossImg', 'addCarYunYName']),
		addGCarLiencesName: app.getIn(['ossImg', 'addGCarLiencesName']),
		addGCarYunYName: app.getIn(['ossImg', 'addGCarYunYName']),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		saveCarInfo: (body, navigation) => {
			startTime = new Date().getTime()
			dispatch(fetchData({
				body,
				method: 'POST',
				api: SAVE_CAR_INFO,
				msg: '添加成功',
				successToast: true,
				showLoading: true,
				success: () => {
					// if (hiddingBack) {
					// 	navigation.dispatch({type:RouteType.ROUTE_ADD_DRIVER,params:{title:'新增司机'}});
					// } else {
						// 发起车辆管理列表刷新动作 --liqingqing
						dispatch(dispatchRefreshCar());
						navigation.dispatch({type:'pop'});
					// }
					dispatch(appendLogToFile('添加车辆','添加车辆成功',startTime))
				},
			}));
		},
		certificationCarInfo: (body, navigation) => {
			startTime = new Date().getTime()
			dispatch(fetchData({
				body,
				method: 'POST',
				api: CERTIFICATION_CAR_INFO,
				msg: '申请成功',
				successToast: true,
				showLoading: true,
				success: () => {
					dispatch(dispatchRefreshCar());
					navigation.dispatch({type:'pop'});
					dispatch(appendLogToFile('添加车辆','申请车辆认证成功',startTime))
					// if (hiddingBack) {
					// 	router.push(RouteType.ROUTE_ADD_DRIVER);
					// } else {
					// 	router.pop();
					// 	dispatch(dispatchRefreshCar());
					// 	// 发起车辆管理列表刷新动作 --liqingqing
					// }
				},
			}));
		},
		_getOssConfig: (params, success, fail) => {
			const url = HOST + OOS_CONFIG + OSS_ADD_CAR;
			fetch(url).then(response => response.json()).then(responseJson => {
				dispatch(updateOSSConfig({ type: params.type, path: responseJson.dir + '.png' }));
				NativeModules.OssModule.init(params.path, responseJson.dir + '.png', responseJson.bucket, url, params.type)
					.then( (type)=> {
						// 成功
						success(type)
					}, (type) => {
						// 失败
						fail(type.code)
					}).catch(e => console.log(e));
			}).catch(e => console.log(e));
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCarContainer);
