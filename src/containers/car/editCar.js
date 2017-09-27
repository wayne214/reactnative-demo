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
	Platform,
	Alert,
} from 'react-native'
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/car';
import Button from '../../components/common/button';
import SimplePicker from '../../components/common/picker';
import { CAR_TYPE, CAR_CATEGORY, CAR_VEHICLE } from '../../constants/json';
import Picker from 'react-native-picker';
import DateHandler from '../../utils/dateHandler';
import { GET_CAR_INFO ,EDIT_CAR_INFO,CERTIFICATION_CAR_INFO,UPDATE_GCAR } from '../../constants/api';
import { fetchData,updateOSSConfig,clearImageSource } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import { dispatchGetCarInfo,dispatchRefreshCar } from '../../action/car';
import HelperUtil from '../../utils/helper';
import Regex from '../../utils/regex';
import Toast from '../../utils/toast';
import CommonImagePicker from '../../components/common/commonImagePicker';
import ExampleImage from '../../../assets/img/auth/car_example.png';
import ExampleImageLicense from '../../../assets/img/auth/driving_license.png';
import ExampleImageTransport from '../../../assets/img/auth/yingyun_licence.png';
import ExampleImageCar from '../../../assets/img/car/default_car_img.png';
import ExampleImageCarLincences from '../../../assets/img/car/default_xingshizheng_img.png';
import ExampleImageCarTransport from '../../../assets/img/car/default_yunyingzheng_img.png';
import { HOST, OSS_ADD_CAR } from '../../constants/setting';
import { OOS_CONFIG, ADD_COMPANY_AUTH } from '../../constants/api';
import DateFormat from 'moment';
import EnlargeImage from '../../../assets/img/enlarge.png';
import ImagePreview from '../../components/common/imagePreview.js';
import BaseComponent from '../../components/common/baseComponent';

class EditCarContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			carTypeMap: '',
			carCategoryMap: '',
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
			driverNumber: '',
			driverPhone: '',

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

			canEdit: true,
			isLoad: true,
			gCarOldNo: '',
		};
		// this.title = props.router.getCurrentRouteTitle();
		// this.key = props.router.getLastCurrentRouteKey();
		this._onPickerSelect = this._onPickerSelect.bind(this);
		this._initTimePicker = this._initTimePicker.bind(this);
		this._getCarInfo = this._getCarInfo.bind(this);
		this._certificationCar = this._certificationCar.bind(this);
		this._editCar = this._editCar.bind(this);
		// this.hiddingBack = (this.key === 'EDIT_ROUTER_PAGE' ? true : false);
		this._showImage = this._showImage.bind(this);
		this.carId = props.navigation.state.params.carId;
		this.isGCar = props.navigation.state.params.isGCar;

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
		} else if (type === 'gauth') {
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
		this.setState({
			visible: false,
		});
	}

	_initTimePicker() {
		if(!this.state.canEdit)
			return null;
    Picker.init({
        pickerData: DateHandler.createDateData(),
        pickerConfirmBtnText: '确定',
        pickerCancelBtnText: '取消',
        pickerTitleText: '报废日期',
				pickerBg: [230, 234, 242, 1],
				pickerToolBarBg: [255, 255, 255, 1],
        onPickerConfirm: data => {
            // console.log(data);
            this.setState({ rejectTime: data.join('').replace('年', '-').replace('月', '-').replace('日', '') });
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

	_editCar(){
		// TODO 校验操作
		if(!this.state.userName
			&& !this.state.phone
			&& !this.state.opertLicence
			&& !this.state.carNo
			&& !this.state.gcarNo
			&& !this.state.carCategoryMap.key
			&& !this.state.carTypeMap.key
			&& !this.state.heavy
			&& !this.state.cube
			&& !this.state.carVehicelMap.key
			// && !this.state.rejectTime
			){
			return Toast.show('请至少填写一项信息');
		}
		// TODO 校验操作
		// if(!this.state.userName) return Toast.show('请输入车主姓名');
		// if (!this.state.phone) return Toast.show('请输入联系手机');
		// if (!Regex.test('mobile', this.state.phone)) return Toast.show('手机号格式不正确');
		// if (!this.state.opertLicence) return Toast.show('请输入运营许可证');
		// if (!Regex.test('transportOperation', this.state.opertLicence)) return Toast.show('运营许可证号格式不正确');
		// if (!this.state.carNo) return Toast.show('请输入车牌号');
		// if (!Regex.test('carNo', this.state.carNo)) return Toast.show('车牌号格式不正确');
		// if (!this.state.carCategoryMap.key) return Toast.show('请选择车辆类别');
		// if (!this.state.carTypeMap.key) return Toast.show('请选择车辆类型');
		// if (!this.state.heavy) return Toast.show('请输入最大载重');
		// if (this.state.heavy > 999 || this.state.heavy <= 0) return Toast.show('输入值应为0~999之间的数');
		// if (!Regex.test('twoDecimal', this.state.heavy)) return Toast.show('小数点后不超过两位');
		// if (!this.state.cube) return Toast.show('请输入最大体积');
		// if (!Regex.test('twoDecimal', this.state.cube)) return Toast.show('小数点后不超过两位');
		// if (this.state.cube > 999 || this.state.cube <= 0) return Toast.show('输入值应为0~999之间的数');
		// if (!this.state.carVehicelMap.key) return Toast.show('请选择车辆长度');
		// if (!this.state.rejectTime) return Toast.show('请选择报废日期');

		if (this.state.phone && !Regex.test('mobile', this.state.phone)) return Toast.show('手机号格式不正确');
		if (this.state.opertLicence && !Regex.test('transportOperation', this.state.opertLicence)) return Toast.show('运营许可证号格式不正确');
		if (this.state.carNo && !Regex.test('carNo', this.state.carNo)) return Toast.show('车牌号格式不正确');

		let gCarNo = (!this.state.gcarNo)?'': this.state.gcarNo;
		let gCarLiencesName = this.props.addGCarLiencesName ? this.props.addGCarLiencesName : (this.props.car.get('gdrivingLicenseUrl')?this.props.car.get('gdrivingLicenseUrl'):'');
		let gCarYunYName = this.props.addGCarYunYName ? this.props.addGCarYunYName : (this.props.car.get('goperateLicenseUrl')?this.props.car.get('goperateLicenseUrl'):'');
		
		if (this.state.heavy && (this.state.heavy > 999 || this.state.heavy <= 0)) return Toast.show('载重输入值应为0~999之间的数');
		if (this.state.heavy && !Regex.test('twoDecimal', this.state.heavy)) return Toast.show('载重数值小数点后不超过两位');
		if (this.state.cube && !Regex.test('twoDecimal', this.state.cube)) return Toast.show('体积数值小数点后不超过两位');
		if (this.state.cube && (this.state.cube > 999 || this.state.cube <= 0)) return Toast.show('体积输入值应为0~999之间的数');
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
		// console.log('lqq-driverLoadingTextAddCarLiencesImg->',this.state.driverLoadingTextAddCarLiencesImg);
		if (this.state.driverLoadingTextAddCarCarImg !== '') {
			return Toast.show('车辆图片还未上传成功')
		}
		if (this.state.driverLoadingTextAddCarLiencesImg !== '') {
			return Toast.show('行驶证图片还未上传成功')
		}
		if (this.state.driverLoadingTextAddCarYunYImg !== '') {
			return Toast.show('营运证图片还未上传成功')
		}	

		this.props.editCarInfo({
			id: this.carId,//	车辆ID
			carNo: this.state.carNo ? this.state.carNo: '', //	车牌号
			gcarNo: gCarNo,//挂车车牌号
			carName: this.state.userName ? this.state.userName: '',//	车主姓名
			phoneNumber: this.state.phone ? this.state.phone:'' ,//	车主手机号
			transportationLicense: this.state.opertLicence ? this.state.opertLicence:'' , //	运输许可证号
			carCategory: this.state.carCategoryMap.key ? this.state.carCategoryMap.key:'' ,//	车辆类别
			carType: this.state.carTypeMap.key ? this.state.carTypeMap.key:'',//	车辆类型 1=厢式货车 2=集装箱挂车 3=集装箱车 4=箱式挂车
			loadSize: this.state.heavy?this.state.heavy:'' ,//	可载重货
			volumeSize: this.state.cube?this.state.cube:'' ,//	可载体积
			carLength: this.state.carVehicelMap.key? this.state.carVehicelMap.key:'' ,//	车辆长度 1:4.2, 2:5.5, 3:6.2, 4:6.8, 5:7.4, 6:7.6, 7:8.6, 8:9.6, 9:12.5, 10:13.7, 11:15, 12:16.5
			// scrapDate: this.state.rejectTime ? HelperUtil.getFormatDate(this.state.rejectTime):'' , //	强制报废期
			carImageUrl: this.props.addCarCarName ? this.props.addCarCarName : this.props.car.get('carImageUrl'),
			drivingLicenseUrl: this.props.addCarLiencesName ? this.props.addCarLiencesName : this.props.car.get('drivingLicenseUrl'),
			operateLicenseUrl: this.props.addCarYunYName ? this.props.addCarYunYName : this.props.car.get('operateLicenseUrl'),
			gdrivingLicenseUrl: gCarLiencesName,
			goperateLicenseUrl: gCarYunYName
			// carImageUrl: 'carImageUrl' || this.props.car.get('carImageUrl'),//	车辆图片
			// drivingLicenseUrl: 'drivingLicenseUrl' || this.props.car.get('drivingLicenseUrl'),//	行驶证图片
			// operateLicenseUrl: 'operateLicenseUrl' || this.props.car.get('operateLicenseUrl'),//	运营证图片
		},this.props.navigation);
	}

	_certificationCar() {
		if(this.state.canEdit){//编辑
			// TODO 校验操作
			if (!this.state.userName) return Toast.show('请输入车主姓名');
			if (!this.state.phone) return Toast.show('请输入联系手机');
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
			if (!this.props.car.get('carImageUrl') && !this.state.addCarCarImgSource  ) return Toast.show('请上传车辆图片');
			if (!this.props.car.get('drivingLicenseUrl') && !this.state.addCarLiencesImgSource ) return Toast.show('请上传行驶证图片');
			if (!this.props.car.get('operateLicenseUrl') && !this.state.addCarYunYImgSource ) return Toast.show('请上传营运证图片');
			let gCarNo = this.state.gcarNo;
			let gCarLiencesName = this.props.addGCarLiencesName ? this.props.addGCarLiencesName : (this.props.car.get('gdrivingLicenseUrl')?this.props.car.get('gdrivingLicenseUrl'):'');
			let gCarYunYName = this.props.addGCarYunYName ? this.props.addGCarYunYName : (this.props.car.get('goperateLicenseUrl')?this.props.car.get('goperateLicenseUrl'):'');
			if(this.state.carTypeMap.key === 2 || this.state.carTypeMap.key === 4){
				if (!this.state.gcarNo) return Toast.show('请输入挂车车牌号');
				if (!Regex.test('carNo', this.state.gcarNo)) return Toast.show('挂车车牌号格式不正确');
				if (!this.props.car.get('gdrivingLicenseUrl') && !this.state.addGCarLiencesImgSource ) return Toast.show('请上传挂车行驶证图片');
				if (!this.props.car.get('goperateLicenseUrl') && !this.state.addGCarYunYImgSource ) return Toast.show('请上传挂车营运证图片');
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
				id: this.carId,//	车辆ID
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
				carImageUrl: this.props.addCarCarName ? this.props.addCarCarName : this.props.car.get('carImageUrl'),
				drivingLicenseUrl: this.props.addCarLiencesName ? this.props.addCarLiencesName : this.props.car.get('drivingLicenseUrl'),
				operateLicenseUrl: this.props.addCarYunYName ? this.props.addCarYunYName : this.props.car.get('operateLicenseUrl'),
				gdrivingLicenseUrl: gCarLiencesName,
				goperateLicenseUrl: gCarYunYName
			}, this.props.navigation);
		}else{//挂车编辑
			let gCarNo = this.state.gcarNo;
			let gCarLiencesName = this.props.addGCarLiencesName ? this.props.addGCarLiencesName : (this.props.car.get('gdrivingLicenseUrl')?this.props.car.get('gdrivingLicenseUrl'):'');
			let gCarYunYName = this.props.addGCarYunYName ? this.props.addGCarYunYName : (this.props.car.get('goperateLicenseUrl')?this.props.car.get('goperateLicenseUrl'):'');
			if(this.state.carTypeMap.key === 2 || this.state.carTypeMap.key === 4){
				if (!this.state.gcarNo) return Toast.show('请输入挂车车牌号');
				if (!Regex.test('carNo', this.state.gcarNo)) return Toast.show('挂车车牌号格式不正确');
				if (!this.props.car.get('gdrivingLicenseUrl') && !this.state.addGCarLiencesImgSource ) return Toast.show('请上传挂车行驶证图片');
				if (!this.props.car.get('goperateLicenseUrl') && !this.state.addGCarYunYImgSource ) return Toast.show('请上传挂车营运证图片');
				if (this.state.driverLoadingTextAddGCarLiencesImg !== '') {
					return Toast.show('挂车行驶证图片还未上传成功')
				}
				if (this.state.driverLoadingTextAddGCarYunYImg !== '') {
					return Toast.show('挂车营运证图片还未上传成功')
				}
				if(this.state.gCarOldNo && this.state.gcarNo!== this.state.gCarOldNo){
					if (!this.state.addGCarLiencesImgSource ) return Toast.show('请更新挂车行驶证图片');
					if (!this.state.addGCarYunYImgSource ) return Toast.show('请更新挂车营运证图片');
				}
			}else{
				gCarNo = '';
				gCarLiencesName = '';
				gCarYunYName = '';
			}

			Alert.alert('', '确认更改挂车信息？',
				[
					{ text: '取消', onPress: () => {
					}},
					{ text: '确定', onPress: () => {
						this.props.updateGCarInfo({
										carId: this.carId,//	车辆ID
										gcarNo: gCarNo,
										gdrivingLicenseUrl: gCarLiencesName,
										goperateLicenseUrl: gCarYunYName
									}, this.props.navigation);
					}},
				]
			);
			
		}

	}


	componentDidMount(){
		super.componentDidMount();
		// FIXME 根据车辆 ID 获取车辆详情病展示
		// console.log('lqq--carId',this.carId);
		// console.log('--lqq--isGCar--',this.isGCar);
		if(this.isGCar){
			this.setState({
				canEdit: false
			});
		}
		this.props.navigation.setParams({ navigatePress: this._editCar,optTitle:this.isGCar?'':'保存' })  
		this._getCarInfo();
	}

	componentWillReceiveProps(props) {
    const { car } = props;
    if (car && this.state.isLoad) {
    	// console.log('lqq--car--->',car);
      this.setState({
      	isLoad: false,
      	userName: car.get('carName'),
				carNo: car.get('carNo'),
				gcarNo: car.get('gcarNo'),
				phone: car.get('phoneNumber'),
				opertLicence: car.get('transportationLicense'),
				heavy: car.get('loadSize'),
				cube: car.get('volumeSize'),
				rejectTime: HelperUtil.getFormatDate(car.get('scrapDate')),
				// addCarCarImgSource: this.props.addCarCarName? this.props.addCarCarName : car.get('carImageUrl'),
				// addCarLiencesImgSource: this.props.addCarLiencesName ? this.props.addCarLiencesName : car.get('operateLicenseUrl'),
				// addCarYunYImgSource: this.props.addCarYunYName ? this.props.addCarYunYName : car.get('drivingLicenseUrl'),
				// addGCarLiencesImgSource: this.props.addGCarLiencesName ? this.props.addGCarLiencesName : car.get('goperateLicenseUrl'),
				// addGCarYunYImgSource: this.props.addGCarYunYName ? this.props.addGCarYunYName : car.get('gdrivingLicenseUrl'),
				carCategoryMap: HelperUtil.getObject(CAR_CATEGORY,car.get('carCategory')),
				carTypeMap: HelperUtil.getObject(CAR_TYPE,car.get('carType')),
				carVehicelMap: HelperUtil.getObject(CAR_VEHICLE,car.get('carLength')),
				gCarOldNo: (HelperUtil.getObject(CAR_TYPE,car.get('carType')).key === 2 || HelperUtil.getObject(CAR_TYPE,car.get('carType')).key === 4)? car.get('gcarNo'):'',
      });
    }
  }

	_getCarInfo(){
		this.props.getCarInfo({
			carId: this.carId
		},this.props.router);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		if (Picker) Picker.hide();
		this.props.dispatch(clearImageSource());
	}
	
	_showImage(type){
		let source ;
		// let examleImage ;
		let txtLoading;
		let showExampleImage = false;
		switch(type){
			case 1:
			// source = this.state.addCarCarImgSource || this.props.car.get('carImageUrl') ;
			// exampleImage = ExampleImageCar;
			txtLoading = this.state.driverLoadingTextAddCarCarImg;
			if(this.state.addCarCarImgSource ){
				source = this.state.addCarCarImgSource ;
			}else if(this.props.car.get('carImageUrl')){
				source = {uri:  HelperUtil.getFullImgPath(this.props.car.get('carImageUrl'))};
			}else{
				source = ExampleImageCar;
				showExampleImage = true;
			}
			break;
			case 2:
			// source = this.state.addCarLiencesImgSource || this.props.car.get('operateLicenseUrl');
			// exampleImage = ExampleImageCarLincences;
			txtLoading = this.state.driverLoadingTextAddCarLiencesImg;
			if(this.state.addCarLiencesImgSource ){
				source = this.state.addCarLiencesImgSource ;
			}else if(this.props.car.get('drivingLicenseUrl')){
				source = {uri:  HelperUtil.getFullImgPath(this.props.car.get('drivingLicenseUrl'))};
			}else{
				source = ExampleImageCarLincences;
				showExampleImage = true;
			}
			break;
			case 3:
			// source = this.state.addCarYunYImgSource || this.props.car.get('drivingLicenseUrl');
			// exampleImage = ExampleImageCarTransport;
			txtLoading = this.state.driverLoadingTextAddCarYunYImg;
			if(this.state.addCarYunYImgSource ){
				source = this.state.addCarYunYImgSource ;
			}else if(this.props.car.get('operateLicenseUrl')){
				source = {uri:  HelperUtil.getFullImgPath(this.props.car.get('operateLicenseUrl'))};
			}else{
				source = ExampleImageCarTransport;
				showExampleImage = true;
			}
			break;
			case 4:
			// source = this.state.addGCarLiencesImgSource || this.props.car.get('goperateLicenseUrl');
			// exampleImage = ExampleImageCarLincences;
			txtLoading = this.state.driverLoadingTextAddGCarLiencesImg;
			if(this.state.addGCarLiencesImgSource ){
				source = this.state.addGCarLiencesImgSource ;
			}else if(this.props.car.get('gdrivingLicenseUrl')){
				source = {uri:  HelperUtil.getFullImgPath(this.props.car.get('gdrivingLicenseUrl'))};
			}else{
				source = ExampleImageCarLincences;
				showExampleImage = true;
			}
			break;
			case 5:
			// source = this.state.addGCarYunYImgSource || this.props.car.get('gdrivingLicenseUrl');
			// exampleImage = ExampleImageCarTransport;
			txtLoading = this.state.driverLoadingTextAddGCarYunYImg;
			if(this.state.addGCarYunYImgSource ){
				source = this.state.addGCarYunYImgSource ;
			}else if(this.props.car.get('goperateLicenseUrl')){
				source = {uri:  HelperUtil.getFullImgPath(this.props.car.get('goperateLicenseUrl'))};
			}else{
				source = ExampleImageCarTransport;
				showExampleImage = true;
			}
			break;
		}
		// console.log('lqq---source-->',source);
		let enlargeImg;
		if(source && !showExampleImage){
			let temp = [];
			temp.push(source.uri);
			console.log('lqq---source.uri--',source.uri);
			enlargeImg=(
				<TouchableOpacity style = {styles.touchStyle}
					onPress={()=>{this.setState({shouldShow: true,imagePathes: temp})}}>
					<Image style={styles.enlargeStyle} source={EnlargeImage}/>
				</TouchableOpacity>)
		}
		let image = (
				<View style={ [styles.IDViewStyle, { marginTop: 5}] }>
						<ImageBackground source={ source } style={ styles.IDImgStyle }>
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
	    optTitle={navigation.state.params.optTitle}
	    router={ navigation }/>
	  };
	};

	render () {
		const { car } = this.props;
		const cube = this.props.car.get('volumeSize');
		// let hiddenHeight = 308;
		// if(this.state.carTypeMap && (this.state.carTypeMap.key === 2 || this.state.carTypeMap.key === 4) ){
		// 	hiddenHeight = 352;
		// }
		// let hiddenPicHeight = 132;
		// let borderBottomWidth = 0;
		// if(this.state.carTypeMap && (this.state.carTypeMap.key === 2 || this.state.carTypeMap.key === 4) ){
		// 	hiddenPicHeight = 220;
		// 	borderBottomWidth = 1;
		// }
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
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车主姓名</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										textAlign='right'
										returnKeyType='done'
										placeholder='请输入车主姓名'
										placeholderTextColor='#ccc'
										defaultValue={ this.props.car && this.props.car.get('carName') }
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.userName }
										editable = { this.state.canEdit }
										onChangeText={ text => this.setState({ userName: text }) }/>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>联系手机</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										textAlign='right'
										placeholder='请输入联系手机'
										placeholderTextColor='#ccc'
										defaultValue={ this.props.car && this.props.car.get('phoneNumber') }
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.phone }
										editable = { this.state.canEdit }
										onChangeText={ text => this.setState({ phone: text }) }/>
								</View>
							</View>
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>运营许可证号</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										textAlign='right'
										returnKeyType='done'
										placeholder='请输入运营许可证号'
										placeholderTextColor='#ccc'
										defaultValue={ this.props.car && this.props.car.get('transportationLicense') }
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.opertLicence }
										editable = { this.state.canEdit }
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
										textAlign='right'
										returnKeyType='done'
										placeholder='请输入车牌号'
										placeholderTextColor='#ccc'
										defaultValue={ this.props.car && this.props.car.get('carNo') }
										style={ styles.textInput}
										underlineColorAndroid={ 'transparent' }
										value = { this.state.carNo }
										editable = { this.state.canEdit }
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
									onPress={ () => this.state.canEdit ? this.setState({ visible: true, data: CAR_CATEGORY }) : null }>
									<Text style={ this.state.canEdit ? (this.state.carCategoryMap.value ? styles.blackRightText : styles.rightText) : styles.rightText }>{ this.state.carCategoryMap.value || HelperUtil.getCarCategory(this.props.car.get('carCategory')) }</Text>
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
									onPress={ () => this.state.canEdit ? this.setState({ visible: true, data: CAR_TYPE }) : null }>
									<Text style={ this.state.canEdit ? (this.state.carTypeMap.value ? styles.blackRightText : styles.rightText) : styles.rightText }>{ this.state.carTypeMap.value || HelperUtil.getCarType(this.props.car.get('carType')) }</Text>
									<Text style={ styles.arrowRight }>&#xe60d;</Text>
								</TouchableOpacity>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>最大载重</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<TextInput
										textAlign='right'
										placeholder='请填写'
										placeholderTextColor='#ccc'
										style={ styles.textInput }
										defaultValue={ this.props.car && this.props.car.get('loadSize') }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.heavy }
										editable = { this.state.canEdit }
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
										textAlign='right'
										placeholder='请填写'
										placeholderTextColor='#ccc'
										style={ styles.textInput }
										defaultValue={ this.props.car && this.props.car.get('volumeSize') }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.cube }
										editable = { this.state.canEdit }
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
									onPress={ () => this.state.canEdit ? this.setState({ visible: true, data: CAR_VEHICLE }) : null }>
									<Text style={ this.state.canEdit ? (this.state.carVehicelMap.value ? styles.blackRightText : styles.rightText) : styles.rightText }>{ this.state.carVehicelMap.value || HelperUtil.getCarLength(this.props.car.get('carLength')) }</Text>
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
									<Text style={ styles.rightText }>{this.state.rejectTime || HelperUtil.getFormatDate(this.props.car.get('scrapDate'))  }</Text>
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
							<View style={ [styles.hiddenCellContainer,{borderBottomWidth:0}]  }>
									<View style={ styles.hiddenLeft }>
										<Text style={ styles.hiddenText }>车辆图片</Text>
									</View>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => this.state.canEdit ? this.setState({ showImagePicker: true, type: 'addCarCarImg',showExampleImage: ExampleImage }) : null }
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
									onPress={ () => this.state.canEdit ? this.setState({ showImagePicker: true, type: 'addCarLiencesImg',showExampleImage: ExampleImageLicense }) : null }
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
									onPress={ () => this.state.canEdit ? this.setState({ showImagePicker: true, type: 'addCarYunYImg',showExampleImage: ExampleImageTransport }) : null }>
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
												returnKeyType='done'
												textAlign='right'
												placeholder='请输入挂车牌号'
												placeholderTextColor='#ccc'
												defaultValue={ this.props.car && this.props.car.get('gcarNo')}
												style={ styles.textInput }
												underlineColorAndroid={ 'transparent' }
												value = { this.state.gcarNo }
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
					<View style={ [styles.loginBtn, { marginBottom: 20 }] }>
						<Button
							title= {this.state.canEdit ? '申请认证':'确认修改'}
							style={ styles.btn }
							textStyle={ styles.btnText }
							onPress={ () => this._certificationCar() }/>
							{
								this.hiddingBack &&
									<View style={ [styles.skipContainer, { marginBottom: 20 }] }>
										<Text onPress={ () => this.props.router._toMain() } style={ styles.skipText }>跳过认证，先看看>></Text>
									</View>
							}
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
						}, type => {
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
					{ this._renderUpgrade(this.props) }
			</View>
		);
	}

}

const mapStateToProps = state => {
	const { app, car } = state;
	return {
		user: app.get('user'),
		car: car.getIn(['car','carDetail']),
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
		editCarInfo: (body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: EDIT_CAR_INFO,
				msg: '保存成功',
				successToast: true,
				showLoading: true,
				success: () => {
					// console.log('lqq---保存成功');
					dispatch(dispatchRefreshCar());
					navigation.dispatch({type:'pop'});
				},
				fail: () => {
					// console.log('lqq---保存失败');
				}
			}));
		},
		certificationCarInfo: (body, navigation, hiddingBack) => {
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
						// 发起车辆管理列表刷新动作 --liqingqing
				},
			}));
		},
		updateGCarInfo: (body, navigation, hiddingBack) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: UPDATE_GCAR,
				msg: '修改成功',
				successToast: true,
				showLoading: true,
				success: () => {
						dispatch(dispatchRefreshCar());
						navigation.dispatch({type:'pop'});
						// 发起车辆管理列表刷新动作 --liqingqing
				},
			}));
		},
		getCarInfo:(body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: GET_CAR_INFO,
				success: (data) => {
					// console.log('lqq---carInfo--',data);
					dispatch(dispatchGetCarInfo({data}));
				}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCarContainer);
