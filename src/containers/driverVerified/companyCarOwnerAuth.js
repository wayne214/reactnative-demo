import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    Platform,
    InteractionManager,
    Alert,
} from 'react-native';

import VerifiedSpaceItem from './verifiedIDItem/verifiedSpaceItem';
import NavigatorBar from '../../components/common/navigatorbar';
import VerifiedIDTitleItem from './verifiedIDItem/verifiedIDTitleItem'
import VerifiedIDItemView from './verifiedIDItem/verifiedIDItem';
import VerifiedGrayTitleItem from './verifiedIDItem/verifiedGrayTitleItem';
import VerifiedIDInfoItem from './verifiedIDItem/verifiedIDInfoItem';
import VerifiedIDDateItem from './verifiedIDItem/verifiedIDInfoDateItem';
import LoadingView from '../../utils/loading';
import VerifiedDataSource from './verifiedIDItem/verifiedDateSource';
import AlertSheetItem from '../../components/common/alertSelected';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
import ImagePicker from 'react-native-image-picker';
import TimePicker from 'react-native-picker-custom';
import * as API from '../../constants/api';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
import Toast from '@remobile/react-native-toast';
import VerifiedLineItem from './verifiedIDItem/verifiedLineItem';
import VerifiedDateSources from './verifiedIDItem/verifiedDateSource';
import VerfiedCompanyItem from './verifiedIDItem/verifiedCompanyItem';
import Validator from '../../utils/validator';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import VierifiedBottomItem from './verifiedIDItem/verifiedBottomItem';
import HTTPRequest from '../../utils/httpRequest';
import LoginCharacter from '../../utils/loginCharacter';
import {fetchData} from "../../action/app";

import {
    setOwnerCharacterAction,
    setOwnerNameAction,
    setCurrentCharacterAction,
    saveUserTypeInfoAction,
    saveCompanyInfoAction,
    setCompanyCodeAction,
    setDriverCharacterAction
} from '../../action/user';
import {Geolocation} from 'react-native-baidu-map-xzx';
import * as RouteType from '../../constants/routeType';


const businessTrunRightImage = require('./images/business_right_add.png');
const businessTrunLeftImage = require('./images/business_right.png');
const idCardLeftImage = require('./images/IdCardModel.png');
const idCardRightImage = require('./images/IdCardAdd.png');
const idCardTrunLeftImage = require('./images/IdCardTurnModel.png');
const idCardTrunRightImage = require('./images/IdCardTurnAdd.png');

const selectedArr = ["拍照", "从手机相册选择"];


/*
 * 0=身份证正面
 * 1=身份证反面
 * 2=营业执照
 * */
let selectType = 0;

/*
 * 0  身份证有效期
 * 1  营业执照有效期
 * */
let selectDatePickerType = 0;


let userID = '';
let userName = '';
let userPhone = '';

let lastTime = 0;
let locationData = '';
let currentTime = 0;

class companyCarOwnerAuth extends Component {
    constructor(props) {
        super(props);
        if (this.props.navigation.state.params && this.props.navigation.state.params.resultInfo) {
            const result = this.props.navigation.state.params.resultInfo;

            this.state = {
                appLoading: false,

                IDName: result.IDName,
                IDCard: result.IDCard,
                IDDate: result.IDDate,

                idCardImage:  {uri: result.idCardImage},
                idCardTrunImage:  {uri: result.idCardTrunImage},

                legalPersonPositiveCard: result.legalPersonPositiveCard, // 身份证正面原图
                legalPersonPositiveCardThumbnail: result.legalPersonPositiveCardThumbnail, // 身份证正面缩略图

                legalPersonOppositeCard: result.legalPersonOppositeCard, // 身份证反面原图
                legalPersonOppositeCardThumbnail: result.legalPersonOppositeCardThumbnail, // 身份证反面缩略图


                companyName: result.companyName,
                companyOwnerName: result.companyOwnerName,
                companyAddress: result.companyAddress,
                companyCode: result.companyCode,
                businessTrunRightImage: {uri: result.businessTrunRightImage} ,
                businessLicence: result.businessLicence, // 营业执照原图
                businessCardPhotoThumb: result.businessCardPhotoThumb, // 营业执照缩略图
                businessValidity: result.businessValidity, // 营业执照有效期

                isChooseCompanyImage: result.isChooseCompanyImage,
                isChooseBusinessLicenseValidImage: result.isChooseBusinessLicenseValidImage,
                isChooseBusinessLicenseValidTrunImage: result.isChooseBusinessLicenseValidTrunImage,

                // 默认
                leadPersonName: result.leadPersonName, // 经办人姓名
                leadPersonCardCode: result.leadPersonCardCode, // 经办人身份证号
                leadPersonCardCodeTime: result.leadPersonCardCodeTime, //法 人身份证有效期至
                comName: result.comName, // 解析的公司名称
                person: result.person, // 解析的经办人名称
                comAddress: result.comAddress, // 解析的公司地址
                unifiedSocialCreditCode: result.unifiedSocialCreditCode, // 解析的统一社会信用代码
                manualBusinessValidity: result.manualBusinessValidity, // 营业执照有效期

                isShowCardInfo:result.IDCard ? true : false,
                isShowCompanyInfo: result.companyCode ? true : false
            };
        }else {
            this.state = {
                appLoading: false,

                IDName: '',
                IDCard: '',
                IDDate: '',

                idCardImage: idCardRightImage,
                idCardTrunImage: idCardTrunRightImage,

                legalPersonPositiveCard: '', // 身份证正面原图
                legalPersonPositiveCardThumbnail: '', // 身份证正面缩略图

                legalPersonOppositeCard: '', // 身份证反面原图
                legalPersonOppositeCardThumbnail: '', // 身份证反面缩略图


                companyName: '',
                companyOwnerName: '',
                companyAddress: '',
                companyCode: '',

                businessTrunRightImage,
                businessLicence: '', // 营业执照原图
                businessCardPhotoThumb: '', // 营业执照缩略图
                businessValidity: '', // 营业执照有效期

                isChooseCompanyImage: false,
                isChooseBusinessLicenseValidImage: false,
                isChooseBusinessLicenseValidTrunImage: false,


                // 默认
                leadPersonName: '', // 经办人姓名
                leadPersonCardCode: '', // 经办人身份证号
                leadPersonCardCodeTime: '', //法 人身份证有效期至
                comName: '', // 解析的公司名称
                person: '', // 解析的经办人名称
                comAddress: '', // 解析的公司地址
                unifiedSocialCreditCode: '', // 解析的统一社会信用代码
                manualBusinessValidity: '', // 营业执照有效期
                isShowCardInfo:false,
                isShowCompanyInfo: false,

            }
        }

        this.showDatePick = this.showDatePick.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.selectCamera = this.selectCamera.bind(this);
        this.upLoadImage = this.upLoadImage.bind(this);
        this.uploadData = this.uploadData.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);
        this.quaryAccountRoleCallback = this.quaryAccountRoleCallback.bind(this);
        this.formatterTime = this.formatterTime.bind(this);
        this.isRightData = this.isRightData.bind(this);
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }
    componentDidMount() {
        this.getCurrentPosition();

        userID = global.userId;
        userName = global.userName;
        userPhone = global.phone;

        /*相机拍照*/
        this.listener = DeviceEventEmitter.addListener('endSureCameraPhotoEnd', (imagePath) => {

            console.log('DeviceEventEmitter:', imagePath);

            if (Platform.OS === 'ios') {
                imagePath = 'file://' + imagePath;
            }

            let source = {uri: imagePath};

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {uri: imagePath, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,

            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('phoneNum', userPhone);
            formData.append('isShot', 'Y');
            switch (selectType) {
                case 0:
                    this.setState({
                        idCardImage: source,
                        isChooseBusinessLicenseValidImage: true,
                        isShowCardInfo: false,
                    });

                    this.upLoadImage(API.API_GET_IDCARD_INFO, formData);

                    break;
                case 1:
                    this.setState({
                        idCardTrunImage: source,
                        isChooseBusinessLicenseValidTrunImage: true,
                        isShowCardInfo: false,
                    });

                    this.upLoadImage(API.API_GET_IDCARD_TRUN_INFO, formData);

                    break;

                case 2:
                    this.setState({
                        businessTrunRightImage: source,
                        isChooseCompanyImage: true,
                        isShowCompanyInfo: false,
                    });

                    this.upLoadImage(API.API_GET_BUSINESS_LICENSE, formData);
                    break;
            }

            this.setState({
                appLoading: true,
            });
        });
    }
// 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }

    /*显示日期选取器*/
    showDatePick(showLongTime, type) {

        let date = new Date();
        let selectValue = [];

        let year;
        let month;
        let day;
        if (type === 'cardID') {

            if (this.state.IDDate) {
                year = this.state.IDDate.substr(0, 4);
                month = this.state.IDDate.substr(5, 2);
                day = this.state.IDDate.substr(8, 2);
            } else {
                year = date.getUTCFullYear();
                month = date.getUTCMonth() + 1;
                day = date.getUTCDate();
            }

            selectValue = [year + '年', month + '月', day + '日'];

        }

        TimePicker.init({
            selectedValue: selectValue,
            isShowLongTime: showLongTime,
            pickerLongTimeText: '长期',
            pickerData: VerifiedDataSource.createDateData(),
            pickerToolBarFontSize: 16,
            pickerLongTimeFontSize: 16,
            pickerFontSize: 17,
            pickerFontColor: [0, 0, 0, 1],
            pickerBg: [255, 255, 255, 1],
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '有效期至',
            pickerConfirmBtnColor: [0, 121, 251, 1],
            pickerCancelBtnColor: [137, 137, 137, 1],
            pickerTitleColor: [20, 20, 20, 1],
            pickerLongTimeFontColor: [51, 51, 51, 1],
            pickerToolBarBg: [238, 238, 239, 1],
            pickerLongTimeBg: [255, 255, 255, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('onPickerConfirm', pickedValue, pickedIndex);
                if (pickedValue === '' || pickedValue.length === 0) {
                    console.log('长期');
                    if (selectDatePickerType === 0) {
                        this.setState({
                            IDDate: '长期',
                        });
                    } else {
                        this.setState({
                            businessValidity: '长期',
                        });
                    }
                } else {

                    let year = pickedValue[0].substring(0, pickedValue[0].length - 1);
                    let month = pickedValue[1].substring(0, pickedValue[1].length - 1);
                    let day = pickedValue[2].substring(0, pickedValue[2].length - 1);

                    if (selectDatePickerType === 0) {
                        this.setState({
                            IDDate: Validator.timeTrunToDateString(year + month + day),
                        });
                    } else {
                        this.setState({
                            businessValidity: Validator.timeTrunToDateString(year + month + day),
                        });
                    }

                }

            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('onPickerCanceldate', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('onPickerSelectdate', pickedValue, pickedIndex);
            }
        });

        TimePicker.show();
    }


    /*点击弹出菜单*/
    showAlertSelected() {
        this.dialog.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
    }

    /*选择 拍照  相册*/
    callbackSelected(i) {
        if(selectType===2){
            this.setState({
                isShowCompanyInfo: false,
            });
        }
        if(selectType===0){
            this.setState({
                isShowCardInfo: false,
            });
        }


        switch (i) {
            case 0:
                // 拍照

                if (Platform.OS === 'ios') {
                    PermissionsManager.cameraPermission().then(data=>{
                        this.selectCamera();

                    }).catch(err=>{
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null,err.message)
                    });
                }else{
                    PermissionsManagerAndroid.cameraPermission().then((data) => {
                        this.selectCamera();
                    }, (err) => {
                        Alert.alert('提示','请到设置-应用-授权管理设置相机权限');
                    });
                }
                break;
            case 1:
                if (Platform.OS === 'ios') {
                    // 图库
                    PermissionsManager.photoPermission().then(data=>{
                        this.selectPhoto();

                    }).catch(err=>{
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null,err.message)

                    });
                }else
                    this.selectPhoto();


                break;
        }
    }

    /*选择相机*/
    selectCamera() {
        if (selectType < 2) {
            this.props.navigation.dispatch({ type: RouteType.ROUTE_TAKE_CAMEAR,
                params: {
                    cameraType: selectType,
                    verifiedType: 2,}
            })
        } else {

            this.props.navigation.dispatch({ type: RouteType.ROUTE_TAKE_CEMARA_VERTICAL,
                params: {
                    cameraType: 4,
                }
            })
        }
    }

    /*选择照片*/
    selectPhoto() {

        //  相册选项
        const options = {
            quality: 1.0,
            maxWidth: 1280,
            maxHeight: 1280,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};

                let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
                let file = {uri: response.uri, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,

                formData.append("photo", file);   //这里的files就是后台需要的key
                formData.append('phoneNum', userPhone);
                formData.append('isShot', 'N');

                switch (selectType) {
                    case 0:
                        this.setState({
                            idCardImage: source,
                            isChooseBusinessLicenseValidImage: false,
                            isShowCardInfo: false,
                        });

                        this.upLoadImage(API.API_GET_IDCARD_INFO, formData);

                        break;
                    case 1:
                        this.setState({
                            idCardTrunImage: source,
                            isChooseBusinessLicenseValidTrunImage: false,
                            isShowCardInfo: false,
                        });
                        this.upLoadImage(API.API_GET_IDCARD_TRUN_INFO, formData);
                        break;

                    case 2:
                        this.setState({
                            businessTrunRightImage: source,
                            isChooseCompanyImage: false,
                            isShowCompanyInfo: false,
                        });
                        this.upLoadImage(API.API_GET_BUSINESS_LICENSE, formData);
                        break;
                }

                this.setState({
                    appLoading: true,
                });
            }
        });
    }
    /*上传图片*/
    upLoadImage(url, data) {



        upLoadImageManager(url,
            data,
            () => {
                console.log('开始请求数据');
            },
            (respones) => {
                console.log(respones);
                if (respones.code === 200) {
                    switch (selectType) {
                        case 0:
                            if (respones.result.idName && respones.result.idNum){
                                this.setState({
                                    IDName: respones.result.idName === 'FailInRecognition' ? '' : respones.result.idName,
                                    IDCard: respones.result.idNum === 'FailInRecognition' ? '' : respones.result.idNum,
                                    // 默认
                                    leadPersonName: respones.result.idName, // 经办人姓名
                                    leadPersonCardCode: respones.result.idNum, // 经办人身份证号

                                    legalPersonPositiveCard: respones.result.idFaceSideNormalPhotoAddress,
                                    legalPersonPositiveCardThumbnail: respones.result.idFaceSideThumbnailAddress,
                                });

                            }else {
                                Toast.showShortCenter('图片解析失败，请手动填写信息');

                            }

                            this.setState({
                                isShowCardInfo: true,
                            });



                            break;
                        case 1:
                            if (respones.result.idValidUntil){
                                this.setState({
                                    IDDate: Validator.timeTrunToDateString(respones.result.idValidUntil),

                                    leadPersonCardCodeTime: Validator.timeTrunToDateString(respones.result.idValidUntil), //经办人身份证有效期至

                                    legalPersonOppositeCard: respones.result.idBackSideNormalPhotoAddress,
                                    legalPersonOppositeCardThumbnail: respones.result.idBackSideThumbnailAddress,
                                });
                            }else
                                Toast.showShortCenter('图片解析失败，请手动填写信息');

                            this.setState({

                                isShowCardInfo: true,
                            });
                            break;
                        case 2:
                            if (respones.result.regNum){
                                this.setState({
                                    businessLicence: respones.result.businessLicensePhotoAddress, // 营业执照原图
                                    businessCardPhotoThumb:  respones.result.businessLicenseThumbnailAddress,// 营业执照缩略图
                                    companyName: respones.result.name === 'FailInRecognition' ? '' : respones.result.name ,
                                    companyOwnerName: respones.result.person === 'FailInRecognition' ? '' : respones.result.person,
                                    companyAddress: respones.result.address === 'FailInRecognition' ? '' : respones.result.address,
                                    companyCode: respones.result.regNum === 'FailInRecognition' ? '' : respones.result.regNum,

                                    comName: respones.result.name, // 解析的公司名称
                                    person: respones.result.person, // 解析的经办人名称
                                    comAddress: respones.result.address, // 解析的公司地址
                                    unifiedSocialCreditCode: respones.result.regNum, // 解析的统一社会信用代码
                                    businessValidity: Validator.timeTrunToDateString(respones.result.validNeriod), // 营业执照有效期
                                    manualBusinessValidity: Validator.timeTrunToDateString(respones.result.validNeriod)
                                });
                            }else {
                                Toast.showShortCenter('图片解析失败，请手动填写信息');
                            }
                            this.setState({
                                isShowCompanyInfo: true,
                            });

                            break;
                    }
                }else
                    Toast.showShortCenter('解析失败，请重新上传');


                this.setState({
                    appLoading: false,
                });

            },
            (error) => {
                console.log('error:', error);
                Toast.showShortCenter('解析失败，请重新上传');

                this.setState({
                    appLoading: false,
                });
            });
    }
    formatterTime(date){
        date = date.replace('年', '-');
        date = date.replace('月', '-');
        date = date.replace('日', '');
        date = date.replace('', ' ');

        return date;
    }
    isRightData (date){
        date = this.formatterTime(date);

        const todayTimestamp = new Date().getTime();
        const selectTimestamp = new Date(date).getTime().toString();

        if (parseFloat(selectTimestamp) <= parseFloat(todayTimestamp)) {
            return false;
        }

        return true;

    }
    uploadData(){

        currentTime = new Date().getTime();

        console.log('经办人身份证名字',this.state.IDName);
        console.log('经办人身份证号',this.state.IDCard);
        console.log('经办人身份证有效期',this.state.IDDate);
        console.log('经办人身份证正面图片',this.state.legalPersonPositiveCard);
        console.log('经办人身份证正面图缩略图片',this.state.legalPersonPositiveCardThumbnail);
        console.log('公司名称',this.state.companyName);
        console.log('公司所有人',this.state.companyOwnerName);
        console.log('公司地址',this.state.companyAddress);
        console.log('社会编码',this.state.companyCode);
        console.log('营业执照有效期',this.state.businessValidity);
        console.log('营业执照原图',this.state.businessLicence);
        console.log('营业执照缩略图',this.state.businessLicenceThumbnail);

        console.log('默认经办人姓名',this.state.leadPersonName);
        console.log('默认经办人身份证号',this.state.leadPersonCardCode);
        console.log('默认经办人身份证有效期至',this.state.leadPersonCardCodeTime);
        console.log('默认解析的公司名称',this.state.comName);
        console.log('默认解析的经办人名称',this.state.person);
        console.log('默认解析的公司地址',this.state.comAddress);
        console.log('默认解析的统一社会信用代码',this.state.unifiedSocialCreditCode);
        console.log('默认营业执照有效期',this.state.manualBusinessValidity);


        if (!this.state.businessLicence){
            Toast.showShortCenter('请上传营业执照');
            return;
        }
        if (!this.state.companyName){
            Toast.showShortCenter('请输入公司名称');
            return;
        }
        if (!this.state.companyOwnerName){
            Toast.showShortCenter('请输入公司所有人');
            return;
        }
        if (!this.state.companyAddress){
            Toast.showShortCenter('请输入公司地址');
            return;
        }
        if (!this.state.companyCode){
            Toast.showShortCenter('请输入统一社会信用代码');
            return;
        }
        if (!this.state.businessValidity){
            Toast.showShortCenter('请选择营业执照有效期');
            return;
        }
        if (!this.isRightData(this.state.businessValidity)){
            Toast.showShortCenter('所选择的营业执照有效期应大于今天，请重新选择');

            return;
        }
        if (!this.state.legalPersonPositiveCard){
            Toast.showShortCenter('请上传经办人身份证正面');
            return;
        }
        if (!this.state.legalPersonOppositeCard){
            Toast.showShortCenter('请上传经办人身份证反面');
            return;
        }
        if (!this.state.IDName){
            Toast.showShortCenter('请输入经办人身份证名字');
            return;
        }
        if (!this.state.IDCard){
            Toast.showShortCenter('请输入经办人身份证号');
            return;
        }
        if (!this.state.IDDate){
            Toast.showShortCenter('请选择经办人身份证有效期');
            return;
        }
        if (!this.isRightData(this.state.IDDate)){
            Toast.showShortCenter('所选择的经办人身份证有效期应大于今天，请重新选择');

            return;
        }


        //     个人            企业
        let upLoadInfo = {
            userId: userID,//userID,
            userName: userName,//userName,
            busTel: userPhone,//userPhone,
            companyNature: '企业', // 伙伴性质

            businessLicence: this.state.businessLicence, // 营业执照图片原图地址
            businessLicenceThumbnail: this.state.businessCardPhotoThumb, // 营业执照图片缩略图地址

            agentPositiveCard: this.state.legalPersonPositiveCard, // 经办人身份证正面原图地址
            agentPositiveCardThumbnail: this.state.legalPersonPositiveCardThumbnail, // 经办人身份证正面缩略图地址

            agentOppositeCard: this.state.legalPersonOppositeCard, // 经办人身份证反面原图地址
            agentOppositeCardThumbnail: this.state.legalPersonOppositeCardThumbnail, // 经办人身份证反面缩略图地址

            // 图片解析信息
            rmcAnalysisAndContrastQo: {

                // 手动修改
                manualAgentIdCardName: this.state.IDName, // 经办人姓名
                manualAgentIdCard: this.state.IDCard, // 经办人身份证号
                manualAgentIdCardValidity: this.state.IDDate, //经办人身份证有效期至
                manualComName: this.state.companyName, // 解析的公司名称
                manualPerson: this.state.companyOwnerName, // 解析的经办人名称
                manualComAddress: this.state.companyAddress, // 解析的公司地址
                manualUnifiedSocialCreditCode: this.state.companyCode, // 解析的统一社会信用代码
                manualBusinessValidity: this.state.businessValidity, // 营业执照有效期


                // 解析
                agentIdCardName: this.state.leadPersonName, // 编辑的姓名
                agentIdCard: this.state.leadPersonCardCode, // 编辑的姓名经办人身份证号
                agentIdCardValidity: this.state.leadPersonCardCodeTime, // 修改经办人身份证有效期
                comName: this.state.comName, // 修改的公司名称
                person: this.state.person, // 修改的经办人名称
                comAddress: this.state.comAddress, // 修改的公司地址
                unifiedSocialCreditCode: this.state.unifiedSocialCreditCode, // 修改的统一社会信用代码
                businessValidity: this.state.manualBusinessValidity, // 修改的营业执照有效期
            }
        };


        HTTPRequest({
            url: API.API_COMPANY_CERTIFICATION,
            params:upLoadInfo,
            loading: () => {
                this.setState({
                    appLoading: true,
                });
            },
            success: (responseData) => {
                lastTime = new Date().getTime();

                Storage.remove(StorageKey.enterpriseownerInfoResult);
                Toast.showShortCenter('企业车主认证提交成功');

                this.props.setOwnerCharacterAction('21');

                this.props.setOwnerNameAction(this.state.companyName);
                this.props.setCurrentCharacterAction('businessOwner');
                DeviceEventEmitter.emit('verifiedSuccess');



                setTimeout(()=>{
                    if (this.props.navigation.state.params && this.props.navigation.state.params.type){
                        this.props.quaryAccountRole(global.phone,this.quaryAccountRoleCallback);
                    }else
                        this.props.navigation.dispatch({type: 'pop',key: 'Main'});
                },500)


            },
            error: (errorInfo) => {
            },
            finish: () => {
                this.setState({
                    appLoading: false,
                });
            }
        });
    }
    quaryAccountRoleCallback(result) {
        console.log("------账号角色信息",result);
        LoginCharacter.setCharacter(this.props, result, 'login');
        this.props.saveUserTypeInfoAction(result);
    }
    render() {
        const navigator = this.props.navigation;

        const personCardInfo = this.state.isShowCardInfo ?
            <View>
                <VerifiedGrayTitleItem title="确认身份证基本信息"/>
                <VerifiedIDInfoItem IDName={this.state.IDName}
                                    IDCard={this.state.IDCard}
                                    nameChange={(text)=>{
                                        this.setState({
                                            IDName: text,
                                        });
                                    }}
                                    cardChange={(text)=>{
                                        this.setState({
                                            IDCard: text,
                                        });
                                    }}
                                    textOnFocus={()=>{
                                        if (Platform.OS === 'ios'){
                                            this.refs.scrollView.scrollTo({x: 0, y: 840, animated: true});
                                        }

                                    }}
                />
            </View> : null;

        const personCardDate = this.state.isShowCardInfo ?
            <View>
                <VerifiedIDDateItem IDDate={this.state.IDDate}
                                    clickDataPick={()=>{
                                        if (Platform.OS === 'ios'){
                                            this.refs.scrollView.scrollTo({x: 0, y: 1000, animated: true});
                                        }
                                        selectDatePickerType = 0;
                                        this.showDatePick(true ,'cardID');
                                    }}/>
            </View> : null;


        const companyInfo = this.state.isShowCompanyInfo ?
            <View>
                <VerifiedGrayTitleItem title="确认营业执照基本信息"/>

                <VerfiedCompanyItem companyName={this.state.companyName}
                                    companyOwnerName={this.state.companyOwnerName}
                                    companyAddress={this.state.companyAddress}
                                    companyCode={this.state.companyCode}
                                    companyNameChange={(text)=>{
                                        this.setState({
                                            companyName: text,
                                        });
                                    }}
                                    companyOwnerNameChange={(text)=>{
                                        this.setState({
                                            companyOwnerName: text,
                                        });
                                    }}
                                    companyAddressValueChange={(text)=>{
                                        this.setState({
                                            companyAddress: text,
                                        });
                                    }}
                                    companyCodeValueChange={(text)=>{
                                        this.setState({
                                            companyCode: text,
                                        });
                                    }}
                                    textOnFocus={(y)=>{
                                        if (Platform.OS === 'ios'){
                                            this.refs.scrollView.scrollTo({x: 0, y: y+100, animated: true});
                                        }
                                    }}
                                    />
            </View> : null;

        const plat = Platform.OS === 'ios' ? 'on-drag' : 'none';

        return (
            <View style={styles.container}>
                <NavigatorBar
                    title='企业车主认证'
                    router={this.props.navigation}
                    hiddenBackIcon={false}
                    backViewClick={()=>{
                        let info = {
                            appLoading: false,

                            IDName: this.state.IDName,
                            IDCard: this.state.IDCard,
                            IDDate: this.state.IDDate,

                            idCardImage: this.state.idCardImage.uri || '../navigationBar/IdCardAdd.png',
                            idCardTrunImage: this.state.idCardTrunImage.uri || '../navigationBar/IdCardTurnAdd.png',

                            legalPersonPositiveCard: this.state.legalPersonPositiveCard, // 身份证正面原图
                            legalPersonPositiveCardThumbnail: this.state.legalPersonPositiveCardThumbnail, // 身份证正面缩略图

                            legalPersonOppositeCard: this.state.legalPersonOppositeCard, // 身份证反面原图
                            legalPersonOppositeCardThumbnail: this.state.legalPersonOppositeCardThumbnail, // 身份证反面缩略图

                            companyName: this.state.companyName,
                            companyOwnerName: this.state.companyOwnerName,
                            companyAddress: this.state.companyAddress,
                            companyCode: this.state.companyCode,
                            businessTrunRightImage: this.state.businessTrunRightImage.uri || '../navigationBar/business_add',
                            businessLicence: this.state.businessLicence, // 营业执照原图
                            businessCardPhotoThumb: this.state.businessCardPhotoThumb, // 营业执照缩略图
                            businessValidity: this.state.businessValidity, // 营业执照有效期

                            isChooseCompanyImage: this.state.isChooseCompanyImage,
                            isChooseBusinessLicenseValidImage: this.state.isChooseBusinessLicenseValidImage,
                            isChooseBusinessLicenseValidTrunImage: this.state.isChooseBusinessLicenseValidTrunImage,

                            // 默认
                            leadPersonName: this.state.leadPersonName, // 经办人姓名
                            leadPersonCardCode: this.state.leadPersonCardCode, // 经办人身份证号
                            leadPersonCardCodeTime: this.state.leadPersonCardCodeTime, //法 人身份证有效期至
                            comName: this.state.comName, // 解析的公司名称
                            person: this.state.person, // 解析的经办人名称
                            comAddress: this.state.comAddress, // 解析的公司地址
                            unifiedSocialCreditCode: this.state.unifiedSocialCreditCode, // 解析的统一社会信用代码
                            manualBusinessValidity: this.state.manualBusinessValidity, // 营业执照有效期


                        };
                        Storage.save(StorageKey.enterpriseownerInfoResult, info);
                        this.props.navigation.dispatch({type: 'pop'});
                    }}
                />
                <ScrollView keyboardDismissMode={plat} ref="scrollView">
                    <View style={{backgroundColor: '#f5f5f5'}}>
                        <Text style={{
                            marginVertical: 10,
                            marginHorizontal: 10,
                            color: '#999',
                            lineHeight: 20,
                            fontSize: 13
                        }}>
                            您所提供的信息仅用于核实您的身份，不会向任何第三方泄露，请放心上传；完善真实有效的信息才可以认证通过。
                        </Text>
                    </View>
                    <VerifiedIDTitleItem title="营业执照"/>

                    <View style={{height: 15, backgroundColor: 'white'}}>
                        <Text
                            style={{ height: 1, marginTop: 14, marginLeft: 10, marginRight: 0, backgroundColor: '#f5f5f5',}}/>
                    </View>
                    <VerifiedIDDateItem IDDate={this.state.businessValidity}
                                        type="companyOwn"
                                        clickDataPick={()=>{
                                             selectDatePickerType = 1;
                                             this.showDatePick(true);
                                        }}
                    />

                    <VerifiedLineItem />

                    <VerifiedIDItemView showTitle="营业执照要清晰"
                                        leftImage={businessTrunLeftImage}
                                        rightImage={this.state.businessTrunRightImage}
                                        isChooseRight={this.state.isChooseCompanyImage}
                                        click={()=> {
                                            selectType=2;
                                            this.showAlertSelected();

                                        }}
                    />

                    {companyInfo}
                    <VerifiedSpaceItem/>


                    <VerifiedIDTitleItem title="经办人身份证正面"/>
                    <VerifiedIDItemView showTitle="身份证号要清晰"
                                        leftImage={idCardLeftImage}
                                        rightImage={this.state.idCardImage}
                                        isChooseRight={this.state.isChooseBusinessLicenseValidImage}
                                        click={()=> {
                                            selectType=0;
                                            this.showAlertSelected();



                                        }}
                    />
                    <VerifiedLineItem />


                    <VerifiedIDTitleItem title="经办人身份证反面"/>
                    <VerifiedIDItemView showTitle="身份信息要清晰"
                                        leftImage={idCardTrunLeftImage}
                                        rightImage={this.state.idCardTrunImage}
                                        isChooseRight={this.state.isChooseBusinessLicenseValidTrunImage}
                                        click={()=> {
                                            selectType=1;
                                            this.showAlertSelected();
                                        }}
                    />

                    {personCardInfo}
                    {personCardDate}

                    <VerifiedSpaceItem/>
                    <VierifiedBottomItem btnTitle="提交" clickAction={()=>{
                        this.uploadData();
                    }}/>
                </ScrollView>
                <AlertSheetItem ref={(dialog)=>{
                    this.dialog = dialog;
                }}/>

                {
                    this.state.appLoading ? <LoadingView /> : null
                }
            </View>
        )
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
        setOwnerNameAction:(data)=>{
            dispatch(setOwnerNameAction(data));
        },
        setCurrentCharacterAction: (data) => {
            dispatch(setCurrentCharacterAction(data));
        },
        quaryAccountRole: (params, successCallback) => {
            dispatch(fetchData({
                body: '',
                method: 'POST',
                api: API.API_INQUIRE_ACCOUNT_ROLE + params,
                success: data => {
                    successCallback(data);
                },
            }))
        },
        saveUserTypeInfoAction:(result)=>{
            dispatch(saveUserTypeInfoAction(result));
        },
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
        setCompanyCodeAction: (result) => {
            dispatch(setCompanyCodeAction(result));
        },
        saveCompanyInfoAction: (result) => {
            dispatch(saveCompanyInfoAction(result));
        },

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(companyCarOwnerAuth);

