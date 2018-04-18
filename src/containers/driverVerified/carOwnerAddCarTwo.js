/**
 * Created by wangl on 2017/6/30.
 */
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
    Alert
} from 'react-native';

import * as API from '../../constants/api';
import { NavigationActions } from 'react-navigation';

import ImagePicker from 'react-native-image-picker';
import TimePicker from 'react-native-picker-custom';

import NavigatorBar from '../../components/common/navigatorbar';
import VerifiedSpaceItem from './verifiedIDItem/verifiedSpaceItem';
import VerifiedIDTitleItem from './verifiedIDItem/verifiedIDTitleItem'
import VerifiedIDItemView from './verifiedIDItem/verifiedIDItem';
import VerifiedLineItem from './verifiedIDItem/verifiedLineItem';
import VerifiedGrayTitleItem from './verifiedIDItem/verifiedGrayTitleItem';
import VerifiedTravelInfoItem from './verifiedIDItem/verifiedTravelInfoItem';
import VierifiedBottomItem from './verifiedIDItem/verifiedBottomItem';
import AlertSheetItem from '../../components/common/alertSelected';
import VerifiedIDDateItem from './verifiedIDItem/verifiedIDInfoDateItem';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
import VerifiedTravelPaperItem from './verifiedIDItem/verifiedTravelPaperItem';
import VerifiedDateSources from './verifiedIDItem/verifiedDateSource';
import HTTPRequest from '../../utils/httpRequest';
import {setUserCarAction} from '../../action/user';
import StorageKey from '../../constants/storageKeys';
import LoadingView from '../../utils/loading';
import Toast from '@remobile/react-native-toast';
import Validator from '../../utils/validator';
import * as RouteType from '../../constants/routeType';
import Storage from '../../utils/storage';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';

const travelLeftImage = require('./images/travelCardHome.png');
const travelRightImage = require('./images/travelCardHome_right.png');
const travelTrunLeftImage = require('./images/guacheleft.png');
const travelTrunRightImage = require('./images/guacheright.png');


const selectedArr = ["拍照", "从手机相册选择"];

let carWeightDataSource = {};
let userID = '';
let userName = '';
let userPhone = '';


/*
 * 0=行驶证主页
 * 1=行驶证副页
 * 2=交强险
 * 3=车头照
 * */
let selectType = 0;
let selectDatePickerType = 0; // 0  行驶证有效期  1  交强险有效期   2  车辆类型   3   车长

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

class certification extends Component {

    constructor(props) {
        super(props);


            this.state = {
                travelRightImage,
                travelTrunRightImage,

                isChooseTravelRightImage: false,
                isChooseTravelTrunRightImage: false,

                carNumber: '', // 车牌号
                carVolume: '', // 车辆体积
                carType: '冷藏车', // 车辆类型
                carTypeTwo: '厢式挂车', // 车辆类别
                carLength: '', // 车长
                carWeight: '', // 载重
                carAllowNumber: '', // 运输许可证号

                appLoading: false,


                vehicleLicenseHomepageNormalPhotoAddress: '', // 行驶证主页原图
                vehicleLicenseHomepageThumbnailAddress: '', // 行驶证主页缩略图

                vehicleLicenseVicePageNormalPhotoAddress: '', // 挂车营运证原图
                vehicleLicenseVicePageThumbnailAddress: '', // 挂车营运证缩略图

            };

        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.selectCamera = this.selectCamera.bind(this);
        this.upLoadImage = this.upLoadImage.bind(this);
        this.showDatePick = this.showDatePick.bind(this);
        this.checkUploadParams = this.checkUploadParams.bind(this);
        this.implementationVerified = this.implementationVerified.bind(this);
        this.getCarLengthWeight = this.getCarLengthWeight.bind(this);
        this.popToTop = this.popToTop.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.getCarLengthWeight();


        console.log('this.props.currentStatus: ',this.props.currentStatus);

        userID = global.userId;
        userName = global.userName;
        userPhone = global.phone;


        this.listener = DeviceEventEmitter.addListener('endSureCameraPhotoEndStepTwo', (imagePath) => {

            imagePath = 'file://' + imagePath;

            let source = {uri: imagePath};

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {uri: imagePath, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,

            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('phoneNum', userPhone);
            formData.append('isShot', 'Y');

            switch (selectType) {
                case 0:
                    this.setState({
                        travelRightImage: source,
                        carOwner: '',
                        isChooseTravelRightImage: true,
                        isFirst: false
                    });
                    this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData);

                    break;
                case 1:
                    this.setState({
                        travelTrunRightImage: source,
                        isChooseTravelTrunRightImage: true,
                        isFirst: false
                    });
                    this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData);


                    break;

                default:
                    break
            }
            this.setState({
                appLoading: true,
            });

        });


    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
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

    /*获取车长载重数据*/
    getCarLengthWeight() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_LENGTH_AND_WEIGHT_COMMIT,
            params: {},
            loading: () => {

            },
            success: (responseData) => {

                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取车长载重', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '司机增加车辆页面');
                for (let i = 0; i < responseData.result.length; i++) {

                    let key = responseData.result[i].carLen;
                    let valu = responseData.result[i].carryCapacity;

                    carWeightDataSource[key] = valu;
                }
            },
            error: (errorInfo) => {

            },
            finish: () => {
            }
        });
    }


    /*点击弹出菜单*/
    showAlertSelected() {

        this.dialog.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
    }

    /*选择 拍照  相册*/
    callbackSelected(i) {
        switch (i) {
            case 0:
                // 拍照
                if (Platform.OS === 'ios') {
                    PermissionsManager.cameraPermission().then(data => {
                        this.selectCamera();

                    }).catch(err => {
                        Alert.alert(null, err.message);

                    });
                } else {
                    PermissionsManagerAndroid.cameraPermission().then((data) => {
                        this.selectCamera();
                    }, (err) => {
                        Alert.alert('提示', '请到设置-应用-授权管理设置相机权限');
                    });
                }

                break;
            case 1:
                if (Platform.OS === 'ios') {
                    // 图库
                    PermissionsManager.photoPermission().then(data => {
                        this.selectPhoto();

                    }).catch(err => {
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null, err.message)

                    });
                } else
                    this.selectPhoto();
                break;
        }
    }

    /*选择相机*/
    selectCamera() {
        Storage.save('stepTwo', 'YES');


        if (selectType < 1) {

            this.props.navigation.dispatch({ type: RouteType.ROUTE_TAKE_CAMEAR,
                params: {
                    cameraType: selectType + 5,
                    verifiedType: 2,
                }
            })
        } else {

            this.props.navigation.dispatch({ type: RouteType.ROUTE_TAKE_CEMARA_VERTICAL,
                params: {
                    cameraType: selectType,
                }
            })
        }
    }

    /*选择照片*/
    selectPhoto() {

        //  相册选项
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.g(options, (response) => {
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
                            travelRightImage: source,
                            isChooseTravelRightImage: false,
                            isFirst: false
                        });
                        this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData);
                        break;
                    case 1:
                        this.setState({
                            travelTrunRightImage: source,
                            isChooseTravelTrunRightImage: false,
                            isFirst: false
                        });
                        this.upLoadImage(API.API_GET_TRAVEL_TRUN_INFO, formData);


                        break;

                    default:
                        break
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

                            this.setState({
                                // carNumber: respones.result.plateNumber === 'FailInRecognition' ? '' : respones.result.plateNumber,
                                // carOwner: respones.result.owner === 'FailInRecognition' ? '' : respones.result.owner,
                                // carEngineNumber: respones.result.engineNumber === 'FailInRecognition' ? '' : respones.result.engineNumber,
                                //
                                // analysisCarNum: respones.result.plateNumber, // 解析车牌号
                                // analysisHaverName:respones.result.owner, // 解析所有人
                                // analysisEngineNum:respones.result.engineNumber, //  解析发动机号

                                vehicleLicenseHomepageNormalPhotoAddress: respones.result.vehicleLicenseVicePageNormalPhotoAddress,
                                vehicleLicenseHomepageThumbnailAddress: respones.result.vehicleLicenseVicePageThumbnailAddress,
                            });

                            this.setState({
                                isFirst: true
                            });

                            break;
                        case 1:
                            this.setState({
                                vehicleLicenseVicePageNormalPhotoAddress: respones.result.vehicleLicenseVicePageNormalPhotoAddress,
                                vehicleLicenseVicePageThumbnailAddress: respones.result.vehicleLicenseVicePageThumbnailAddress,
                            });
                            this.setState({
                                isFirst: true
                            });
                            break;

                        default:
                            break
                    }
                } else
                    Toast.showShortCenter('解析失败，请重新上传');


                this.setState({
                    appLoading: false,
                });
            },
            (error) => {
                Toast.showShortCenter('解析失败，请重新上传');

                this.setState({
                    appLoading: false,
                });
            });
    }

    // 返回到根界面
    popToTop() {
        const routes = this.props.routes;
        let key = routes[1].key;
        this.props.navigation.goBack(key);
    }


    /*显示日期选取器*/
    showDatePick(showLongTime, data, type) {
        let date = new Date();

        let selectValue = [];
        let title = '有效期至';
        if (type === 'carType') {
            selectValue = [data[0]];
            title = '车辆类型';
        }
        if (type === 'carTwoType') {
            selectValue = [data[0]];
            title = '车辆类别';
        }
        if (type === 'carLength') {
            selectValue = [data[0]];
            title = '车长';
        }

        TimePicker.init({
            selectedValue: selectValue,
            isShowLongTime: showLongTime,
            pickerLongTimeText: '长期',
            pickerData: data,
            pickerToolBarFontSize: 16,
            pickerLongTimeFontSize: 16,
            pickerFontSize: 17,
            pickerFontColor: [0, 0, 0, 1],
            pickerBg: [255, 255, 255, 1],
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: title,
            pickerConfirmBtnColor: [0, 121, 251, 1],
            pickerCancelBtnColor: [137, 137, 137, 1],
            pickerTitleColor: [20, 20, 20, 1],
            pickerLongTimeFontColor: [51, 51, 51, 1],
            pickerToolBarBg: [238, 238, 239, 1],
            pickerLongTimeBg: [255, 255, 255, 1],

            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('onPickerConfirmdate', pickedValue, pickedIndex);


                if (selectDatePickerType === 2) {
                    this.setState({
                        carType: pickedValue[0],
                    });
                }
                if (selectDatePickerType === 4) {
                    this.setState({
                        carTypeTwo: pickedValue[0],
                    });
                }
                if (selectDatePickerType === 3) {
                    this.setState({
                        carLength: pickedValue[0],
                        carWeight: carWeightDataSource[pickedValue[0]],
                    });
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

    // 下一步
    checkUploadParams() {





        if (this.state.carVolume === '') {
            Toast.showShortCenter('请输入车辆体积');
            return;
        }
        if (this.state.carType === '') {
            Toast.showShortCenter('请选择车辆类型');
            return;
        }
        if (this.state.carTypeTwo === '') {
            Toast.showShortCenter('请选择车辆类别');
            return;
        }
        if (this.state.carLength === '') {
            Toast.showShortCenter('请选择车辆长度');
            return;
        }
        if (this.state.carWeight === '') {
            Toast.showShortCenter('请选择车辆长度');
            return;
        }


        // if (this.state.carAllowNumber === '') {
        //     Toast.showShortCenter('请输入运输许可证号');
        //     return;
        // }

        /*
        if (this.state.carNumber === '') {
            Toast.showShortCenter('请输入挂车牌号');
            return;
        }
        if (this.state.vehicleLicenseHomepageNormalPhotoAddress === '' && this.state.vehicleLicenseHomepageThumbnailAddress === '') {
            Toast.showShortCenter('请上传行驶证主页照片');
            return;
        }
        if (this.state.vehicleLicenseVicePageNormalPhotoAddress === '' && this.state.vehicleLicenseVicePageThumbnailAddress === '') {
            Toast.showShortCenter('请上传行驶证副页照片');
            return;
        }
        */



        let result = this.props.navigation.state.params.result;


        result.vehicleLength= this.state.carLength;//车长
        result.load=this.state.carWeight;//车辆载重
        result.vehicleType = this.state.carType;//车辆类型
        result.carCategory= this.state.carTypeTwo;//车辆类别
        result.volumeSize= this.state.carVolume;//实载体积
        result.transportationLicense= this.state.carAllowNumber;//运输许可证号
        result.gcarNo= this.state.carNumber;//挂车牌号


        // result.goperateLicenseUrlAddress = this.state.vehicleLicenseHomepageNormalPhotoAddress;//挂车营运证原图路径
        // result.goperateLicenseUrlThumbnailAddress = this.state.vehicleLicenseHomepageThumbnailAddress;//挂车营运证缩略图路径
        //
        //
        // result.gdrivingLicenseUrlAddress = this.state.vehicleLicenseVicePageNormalPhotoAddress;//挂车行驶证原图路径
        // result.gdrivingLicenseUrlThumbnailAddress = this.state.vehicleLicenseVicePageThumbnailAddress;//挂车行驶证缩略图路径


        result.goperateLicenseUrlAddress = this.state.vehicleLicenseVicePageNormalPhotoAddress;//挂车营运证原图路径
        result.goperateLicenseUrlThumbnailAddress = this.state.vehicleLicenseVicePageThumbnailAddress;//挂车营运证缩略图路径


        result.gdrivingLicenseUrlAddress = this.state.vehicleLicenseHomepageNormalPhotoAddress;//挂车行驶证原图路径
        result.gdrivingLicenseUrlThumbnailAddress = this.state.vehicleLicenseHomepageThumbnailAddress;//挂车行驶证缩略图路径



        // this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_OWNER_ADD_CAR_THREE, params:{
        //     result: result,
        //     image1: this.state.travelRightImage.uri,
        //     image2: this.state.travelTrunRightImage.uri
        // }});

        this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_OWNER_VERIFIED_MSG_CODE,
            params:{
                result : result
            }})


    }


    /*增加车辆*/
    implementationVerified(carDate, insuranceData) {
        currentTime = new Date().getTime();

        // OUTSIDEDRIVER 司机  Personalowner 个人    Enterpriseowner 企业

        let shenfen = '';
        if (this.props.currentStatus === 'driver'){
            shenfen = 'OUTSIDEDRIVER';
        }
        if (this.props.currentStatus === 'personalOwner'){
            shenfen = 'Personalowner';
        }
        if (this.props.currentStatus === 'businessOwner'){
            shenfen = 'Enterpriseowner';
        }


    }

    render() {
        const navigator = this.props.navigation;

        return (
            <View style={styles.container}>
                <NavigatorBar
                    title='新增车辆'
                    router={this.props.navigation}
                    hiddenBackIcon={false}
                />
                <ScrollView keyboardDismissMode='on-drag' ref="scrollView">
                    <VerifiedSpaceItem />


                    <View>
                        <VerifiedGrayTitleItem title="车辆信息"/>
                        <VerifiedTravelInfoItem carType={this.state.carType}
                                                carTypeTwo={this.state.carTypeTwo}
                                                carWeight={this.state.carWeight}
                                                carLength={this.state.carLength}
                                                carVolume= {this.state.carVolume}
                                                carAllowNumber={this.state.carAllowNumber}
                                                carNumber={this.state.carNumber}
                                                carNumberChange={(text)=>{
                                                    this.setState({
                                                        carNumber: text
                                                    })
                                                }}
                                                volumeValueChange={(text)=>{
                                                    this.setState({
                                                        carVolume: text
                                                    })
                                                }}
                                                allowNumberValueChange={(text)=>{
                                                    this.setState({
                                                        carAllowNumber: text
                                                    })
                                                }}
                                                carTypeClick={()=>{

                                                     //selectDatePickerType = 2;
                                                     //this.showDatePick(false, VerifiedDateSources.createCarTypeDate(), 'carType');
                                                }}
                                                carTypeTwoClick={()=>{

                                                     //selectDatePickerType = 4;
                                                     //this.showDatePick(false, VerifiedDateSources.createCarTypeTwoDate(), 'carTwoType');
                                                }}
                                                carLengthClick={()=>{

                                                     selectDatePickerType = 3;

                                                     this.showDatePick(false, VerifiedDateSources.createCarLengthDate(carWeightDataSource), 'carLength');
                                                }}
                                                textOnFocus={(value)=>{
                                                    if (Platform.OS === 'ios'){
                                                        this.refs.scrollView.scrollTo({x: 0, y: 200, animated: true});
                                                     }
                                                }}


                        />
                    </View>




                    <VerifiedIDTitleItem title="挂车行驶证"/>
                    <View style={{height: 15, backgroundColor: 'white'}}>
                        <Text
                            style={{ height: 1, marginTop: 14, marginLeft: 10, marginRight: 0, backgroundColor: '#f5f5f5',}}/>
                    </View>

                    <VerifiedLineItem />

                    <VerifiedIDItemView showTitle="证件要清晰，拍摄完整"
                                        leftImage={travelLeftImage}
                                        rightImage={this.state.travelRightImage}
                                        isChooseRight={this.state.isChooseTravelRightImage}
                                        click={()=> {
                                            selectType=0;
                                            this.showAlertSelected();
                                        }}
                    />
                    <VerifiedLineItem />


                    <VerifiedIDTitleItem title="挂车营运证"/>
                    <VerifiedIDItemView showTitle="证件要清晰，拍摄完整"
                                        leftImage={travelTrunLeftImage}
                                        rightImage={this.state.travelTrunRightImage}
                                        isChooseRight={this.state.isChooseTravelTrunRightImage}

                                        click={()=> {

                                            selectType=1;
                                            this.showAlertSelected();
                                        }}
                    />


                    <VerifiedSpaceItem />



                    <VierifiedBottomItem btnTitle="下一步" clickAction={()=>{


                        this.checkUploadParams();
                    }}/>

                </ScrollView>
                <AlertSheetItem ref={(dialog)=>{
                    this.dialog = dialog;
                }}/>


                {
                    this.state.appLoading ? <LoadingView /> : null
                }

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
        currentStatus: state.user.get('currentStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveUserSetCarSuccess: (plateNumber) => {
            dispatch(setUserCarAction(plateNumber));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(certification);
