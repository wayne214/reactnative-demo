import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
    Dimensions,
    ImageBackground,
    Modal,
    Platform
} from 'react-native';

import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
import ImageCropPicker from 'react-native-image-crop-picker';
import AlertSheetItem from '../../components/common/alertSelected';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
import {PHOTOREFNO} from '../../constants/setting';
import SettingCell from './cell/settingCell';
import ClickUtil from '../../utils/prventMultiClickUtil';
import * as StaticColor from '../../constants/colors';
import LoginAvatar from '../../../assets/img/mine/login_avatar.png';
import * as ConstValue from '../../constants/constValue';
import Validator from '../../utils/validator';
import * as RouteType from '../../constants/routeType';
import Toast from '../../utils/toast';
// 图标
import PersonInfoIcon from '../../../assets/img/mine/personInfo.png';
import CarInfoIcon from '../../../assets/img/mine/carInfo.png';
import VertifyInfoIcon from '../../../assets/img/mine/vertifyInfo.png';
import ModifyPwdIcon from '../../../assets/img/mine/modifyPwd.png';
import SettingIcon from '../../../assets/img/mine/setting.png';
import aboutUsIcon from '../../../assets/img/mine/aboutUsIcon.png';
// 承运方
import driverManagerIcon from '../../../assets/img/mine/driverManagerIcon.png';
import carManagerIcon from '../../../assets/img/mine/carManagerIcon.png';
import commonLineIcon from '../../../assets/img/mine/commonLineIcon.png';
import carrierSettingIcon from '../../../assets/img/mine/carrierSettingIcon.png';

import mineHeaderBg from '../../../assets/img/mine/mineHeaderBg.png';
import MessageNewMine from '../../../assets/img/oldMine/newMessage.png';
import MessageMine from '../../../assets/img/oldMine/message.png';


import {fetchData} from "../../action/app";
import * as API from '../../constants/api';

let currentTime = 0;
let lastTime = 0;
let locationData = '';
const selectedArr = ["拍照", "从手机相册选择"];
const options = {
    title: '选择照片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
};
const {height, width} = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    separateView: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    headerView: {
        alignItems: 'center',
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    iconOutView: {
        marginBottom: 10,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
        backgroundColor: StaticColor.BLUE_CONTACT_COLOR,
    },
    driverIcon: {
        width: 90,
        height: 90,
        resizeMode: 'stretch',
        borderRadius: 45,
    },
    titleContainer: {
        height: 32 + ConstValue.StatusBar_Height,
        paddingTop: ConstValue.StatusBar_Height,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    subTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        height: 32
    },
    editContainer: {
        width: 32, height: 32,
        backgroundColor: '#0092FF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 0,
    }
});



class mine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // rightImageName: StaticImage.Message,
            avatarSource: '',
            loading: false,
            certificationState: '1200', // 资质认证
            verifiedState: '1200', // 实名认证
            modalVisible: false,
        };
        this.getVerfiedStateSucCallback = this.getVerfiedStateSucCallback.bind(this);
        this.certificationCallback = this.certificationCallback.bind(this);
        this.getOwnerVerifiedCallback = this.getOwnerVerifiedCallback.bind(this);
        this.queryUserAvatarCallback = this.queryUserAvatarCallback.bind(this);

        this.queryUserAvatar = this.queryUserAvatar.bind(this);
        this.certificationState = this.certificationState.bind(this);
        this.verifiedState = this.verifiedState.bind(this);

        this.selectCamera = this.selectCamera.bind(this);
        this.selectPhoto = this.selectPhoto.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
    }

    componentDidMount() {
        this.choosePhotoListener = DeviceEventEmitter.addListener('choosePhoto', () => {
            this.showAlertSelected();
        });
        if (this.props.currentStatus == 'driver') {
            /*实名认证状态请求*/
            this.verifiedState(this.getVerfiedStateSucCallback);
            /*资质认证状态请求*/
            this.certificationState(this.certificationCallback);
        }

        /*实名认证提交成功，刷新状态*/
        this.verlistener = DeviceEventEmitter.addListener('verifiedSuccess', () => {
            if (this.props.currentStatus == 'driver') {
                this.verifiedState(this.getVerfiedStateSucCallback);
            } else {
                this.ownerVerifiedState(this.getOwnerVerifiedCallback);
            }
        });

        /*资质认证提交成功，刷新状态*/
        this.cerlistener = DeviceEventEmitter.addListener('certificationSuccess', () => {

            this.certificationState();
        });

        /*点击我，刷新认证状态*/
        this.mineListener = DeviceEventEmitter.addListener('refreshMine', () => {
            if (this.props.currentStatus == 'driver') {
                this.verifiedState(this.getVerfiedStateSucCallback);
            } else {
                this.ownerVerifiedState(this.getOwnerVerifiedCallback);
            }
        });

        /*获取头像具体的地址，*/
        Storage.get(StorageKey.PHOTO_REF_NO).then((value) => {
            if (value) {
                this.queryUserAvatar(value, this.queryUserAvatarCallback)
            }
        });

        this.imgPhotoListener = DeviceEventEmitter.addListener('imagePhotoCallBack', (image) => {
            if (Platform.OS === 'ios') {
                this.imageCropProcess(image);
            } else {
                this.imageADCropProcess(image);
            }
        });
        this.imageCameralistener = DeviceEventEmitter.addListener('imageCameraCallBack', (image) => {
            if (Platform.OS === 'ios') {
                this.imageCropCameraProcess(image);
            } else {
                this.imageADCropCameraProcess(image);
            }

        });
        this.hideModuleListener = DeviceEventEmitter.addListener('hideModule', (response) => {
            this.setState({
                modalVisible: false,
            })
        });
    }

    componentWillUnmount() {
        this.mineListener.remove();
        this.imgPhotoListener.remove();
        this.cerlistener.remove();
        this.verlistener.remove();
        this.choosePhotoListener.remove();
        this.hideModuleListener.remove();
        this.imageCameralistener.remove();
    }

    /*点击弹出菜单*/
    showAlertSelected() {
        if (this.refs.choose){
            this.refs.choose.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
        }
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
                        this.setState({
                            modalVisible: false,
                        });
                    });
                } else {
                    PermissionsManagerAndroid.cameraPermission().then((data) => {
                        this.selectCamera();
                    },(err) => {
                        Alert.alert('提示', '请到设置-应用-授权管理设置相机权限');
                        this.setState({
                            modalVisible: false,
                        });
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
                        Alert.alert(null, err.message);
                        this.setState({
                            modalVisible: false,
                        });
                    });
                } else
                    this.selectPhoto();
                break;
        }
    }

    selectCamera() {
        ImageCropPicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log('照相机image',image);
            this.setState({
                modalVisible: false,
            });
            DeviceEventEmitter.emit('imageCameraCallBack', image);
        }).catch(e => {
            this.setState({
                modalVisible: false,
            });
            console.log(e)});
    }

    selectPhoto() {
        ImageCropPicker.openPicker({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log('图片image', image);
            this.setState({
                modalVisible: false,
            });
            DeviceEventEmitter.emit('imagePhotoCallBack', image);
        }).catch(e => {
            this.setState({
                modalVisible: false,
            });
            console.log(e)});
    }

    certificationCallback(result) {
        console.log('certification', result);
        this.setState({
            certificationState: result,
        });
        if (result === '1202') {
            /*资质认证成功，绑定当前车牌号*/
            DeviceEventEmitter.emit('bindUserCar', this.props.plateNumber);
        }
        global.certificationState = result;
    }
    /*资质认证状态请求*/
    certificationState(callback) {

        if (this.props.userInfo.phone) {

            let obj = {};
            if (this.props.plateNumber) {
                obj = {
                    phoneNum: this.props.userInfo.phone,
                    plateNumber: this.props.plateNumber,
                }
            } else {
                obj = {phoneNum: this.props.userInfo.phone};
            }

            this.props.getCertificationState(obj, callback);
        }
    }
    getVerfiedStateSucCallback(result) {
        console.log('verfiedcall', result);

        lastTime = new Date().getTime();
        // ReadAndWriteFileUtil.appendFile('实名认证状态查询', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
        //     locationData.district, lastTime - currentTime, '我的页面');
        this.setState({
            verifiedState: result,
        });
        // global.verifiedState = responseData.result;
        // 首页状态

        if (result == '1201') {
            this.props.setDriverCharacterAction('1');
        } else if (result == '1202') {
            this.props.setDriverCharacterAction('2');
        } else if (result == '1203') {
            this.props.setDriverCharacterAction('3');
        }
    }
    /*实名认证状态请求*/
    verifiedState(callback) {
        currentTime = new Date().getTime();

        if (this.props.userInfo) {
            if (this.props.userInfo.phone) {
                this.props.verifiedState({
                    phoneNum: this.props.userInfo.phone,
                },callback);
            }
        }
    }
    // 承运方--车主认证结果
    getOwnerVerifiedCallback(result) {
        this.setState({
            verifiedState: result && result.certificationStatus,
        });
        // 首页状态
        if (result.companyNature == '个人') {
            // 确认个人车主
            result.certificationStatus == '1201' ?
                this.props.setOwnerCharacterAction('11')
                : result.certificationStatus == '1202' ?
                this.props.setOwnerCharacterAction('12') :
                this.props.setOwnerCharacterAction('13')
        } else {
            // 确认企业车主
            result.certificationStatus == '1201' ?
                this.props.setOwnerCharacterAction('21')
                : result.certificationStatus == '1202' ?
                this.props.setOwnerCharacterAction('22') :
                this.props.setOwnerCharacterAction('23')
        }
    }
    // 承运方--车主认证状态
    ownerVerifiedState(callback) {
        currentTime = new Date().getTime();
        if (this.props.userInfo) {
            if (this.props.userInfo.phone) {
                this.props.ownerVerifiedState({
                    busTel: global.phone,
                    // companyNature: '个人'
                }, callback);
            }
        }
    }

    queryUserAvatarCallback(result) {
        console.log("成功的路径", result);
        if (result == null) {

        } else {
            this.setState({
                avatarSource: {uri: result},
            });
        }
    }
    /*查询头像地址*/
    queryUserAvatar(photoRefNo, callback) {
        this.props.queryUserAvatar({
            photoRefNo: photoRefNo,
            userId: global.userId,
            userName: global.userName ? global.userName : this.state.phoneNum,
        }, callback);
    }

    /*IOS获取头像照片数据*/
    imageCropProcess(image) {
        console.log('iamgeee',image)
        if (image.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (image.error) {
            console.log('ImagePicker Error: ', image.error);

        }
        else if (image.customButton) {
            console.log('User tapped custom button: ', image.customButton);

        }
        else {

            let source = {uri: image.path};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: image.path,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', image.filename, 'file', file)
            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', image.filename);
            formData.append('mimeType', image.mime);
            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);
        }
    }
    /*ANDROID获取头像照片数据*/
    imageADCropProcess(image) {
        if (image.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (image.error) {
            console.log('ImagePicker Error: ', image.error);

        }
        else if (image.customButton) {
            console.log('User tapped custom button: ', image.customButton);

        }
        else {

            let source = {uri: image.path};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: image.path,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', 'abc.jpg', 'file', file)
            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', 'abc.jpg');
            formData.append('mimeType', image.mime);
            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);
        }
    }

    /*获取头像拍摄数据*/
    imageCropCameraProcess(image) {


        if (image.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (image.error) {
            console.log('ImagePicker Error: ', image.error);

        }
        else if (image.customButton) {
            console.log('User tapped custom button: ', image.customButton);

        }
        else {

            let source = {uri: image.path};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: image.path,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', image.filename, 'file', file)
            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', 'abc.jpg');
            formData.append('mimeType', image.mime);
            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);
        }
    }
    /*获取头像拍摄数据*/
    imageADCropCameraProcess(image) {

        if (image.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (image.error) {
            console.log('ImagePicker Error: ', image.error);

        }
        else if (image.customButton) {
            console.log('User tapped custom button: ', image.customButton);

        }
        else {

            let source = {uri: image.path};

            this.setState({
                avatarSource: source
            })

            let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
            let file = {
                uri: image.path,
                type: 'multipart/form-data',
                name: 'image.png'
            };   //这里的key(uri和type和name)不能改变,
            console.log('response.fileName', image.filename, 'file', file)
            formData.append("photo", file);   //这里的files就是后台需要的key
            formData.append('userId', global.userId);
            formData.append('userName', global.userName ? global.userName : this.state.phoneNum);
            formData.append('fileName', 'abc.jpg');
            formData.append('mimeType', image.mime);
            this.upLoadImage(API.API_CHANGE_USER_AVATAR, formData);
        }
    }


    /*上传头像*/
    upLoadImage(url, data) {
        console.log('upLoadImage1',url);
        console.log('upLoadImage2',data);
        upLoadImageManager(url,
            data,
            () => {
                console.log('开始请求数据');
            },
            (respones) => {
                console.log('upLoadImage',respones);
                if (respones.code === 200) {
                    Storage.save(PHOTOREFNO, respones.result);
                    global.photoRefNo = respones.result;
                    Storage.save('NewPhotoRefNo', respones.result);
                } else {
                    Toast.show('图片上传失败，请重新选择上传');
                }
            },
            (error) => {
                Toast.show('图片上传失败，请重新选择上传');
            });
    }
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={mineHeaderBg} resizeMode={'stretch'} style={{width: width, height: 210}} >
                <View style={styles.titleContainer}>
                    {
                        this.props.currentStatus == 'driver' && this.state.verifiedState == '1202' ? <View style={styles.subTitleContainer}>
                            <TouchableOpacity onPress={()=> {
                                this.props.navigation.dispatch({
                                    type: RouteType.ROUTE_CHOOSE_CAR,
                                    params: {
                                    carList: this.props.userCarList,
                                    flag: false
                                } })
                            }}>
                                <Text style={{fontSize: 16, color: StaticColor.LIGHT_BLACK_TEXT_COLOR}}>关联车辆</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST_PAGE})
                            }}>
                                <View>
                                    <Image
                                        style={{
                                            marginRight: 10,
                                            marginTop: 10,
                                        }}
                                        source={
                                            this.props.jpushIcon === true ? MessageNewMine : MessageMine
                                        }
                                    />
                                </View>
                            </TouchableOpacity>
                        </View> : <View style={styles.subTitleContainer}>
                            <Text>{''}</Text>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.dispatch({type: RouteType.ROUTE_USER_INFO, params: {title: '会员信息'}})
                            }}>
                                <Text style={{fontSize: 20, color: '#333333'}}>会员信息</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                    <TouchableOpacity onPress={()=> console.log('外部区域')}
                                      activeOpacity={1}>
                        <View style={styles.headerView}>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        modalVisible: true,
                                    }, () => {
                                        DeviceEventEmitter.emit('choosePhoto');
                                    });
                                }} activeOpacity={0.75}>
                                    <View style={styles.iconOutView}>
                                        {
                                            this.state.avatarSource != '' ?
                                                <Image
                                                    resizeMode='stretch'
                                                    style={styles.driverIcon}
                                                    source={this.state.avatarSource}
                                                />
                                                :
                                                <Image
                                                    resizeMode='stretch'
                                                    style={styles.driverIcon}
                                                    source={LoginAvatar}
                                                />
                                        }
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.editContainer}>
                                    <Text style={{fontFamily: 'iconfont', color: '#FFFFFF', fontSize: 15}}>&#xe641;</Text>
                                </View>
                            </View>
                            {
                                this.props.currentStatus == 'driver' ?
                                    <View style={{alignItems: 'center'}}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                                fontSize: 18,
                                                backgroundColor: 'transparent',
                                            }}
                                        >{this.state.verifiedState == 1202 ? this.props.userName : this.props.userInfo.phone}</Text>
                                        <Text
                                            style={{
                                                marginTop: 5,
                                                marginBottom: 10,
                                                backgroundColor: 'transparent',
                                                color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
                                                fontSize: 13
                                            }}>
                                            {this.props.plateNumber}
                                        </Text>
                                    </View> : <Text style={{
                                        marginTop: 10,
                                        marginBottom: 20,
                                        backgroundColor: 'transparent',
                                        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                        fontSize: 17
                                    }}>{Validator.newPhone(global.phone)}</Text>
                            }

                        </View>
                    </TouchableOpacity>
                </ImageBackground>
                <View style={styles.separateView}/>
                <ScrollView>
                {
                    this.props.currentStatus == 'driver' ?
                        <View>
                            <SettingCell
                                style={{height: 36}}
                                leftIconImage={PersonInfoIcon}
                                content={'个人信息'}
                                authenticationStatus={this.state.verifiedState}
                                showBottomLine={true}
                                clickAction={() => {
                                    ClickUtil.resetLastTime();
                                    if (ClickUtil.onMultiClick()) {
                                        if (this.state.verifiedState == '1200') {
                                            this.props.navigation.dispatch({
                                                        type: RouteType.ROUTE_PERSON_INFO,
                                                        params: {
                                                            phone: global.phone,
                                                        }
                                                    });
                                        }else {
                                             this.props.navigation.dispatch({ type: RouteType.ROUTE_DRIVER_VERIFIED_DETAIL, params: {
                                                phone: global.phone,
                                            } })
                                        }

                                    }
                                }}
                            />
                            <SettingCell
                                leftIconImage={CarInfoIcon}
                                leftIconImageStyle={{width: 18.5, height: 17.5}}
                                content={'车辆信息'}
                                showBottomLine={true}
                                clickAction={() => {
                                    ClickUtil.resetLastTime();
                                    if (ClickUtil.onMultiClick()) {

                                        if (this.state.certificationState == '1202' || this.state.certificationState == '1200') {
                                            if (this.props.plateNumberObj) {
                                                if (this.props.plateNumberObj.size === 0 || this.props.plateNumberObj.carStatus && this.props.plateNumberObj.carStatus === 20 || this.props.plateNumberObj.carStatus === 0) {
                                                    this.props.navigation.dispatch({
                                                        type: RouteType.ROUTE_CAR_INFO,
                                                        params: {
                                                            certificationState: this.state.certificationState,
                                                        }
                                                    });
                                                } else {
                                                    this.props.navigation.dispatch({
                                                        type: RouteType.ROUTE_CAR_DISABLE_PAGE,
                                                        params: {
                                                            certificationState: this.state.certificationState,
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                        if (this.state.certificationState === '1201' || this.state.certificationState === '1203') {
                                            this.props.navigation.dispatch({
                                                type: RouteType.ROUTE_CAR_OWNER_ADD_CAR_DETAIL
                                            })
                                        }

                                    }
                                }}
                            />
                            {
                                this.state.verifiedState != '1202' ?
                                    <SettingCell
                                        leftIconImage={VertifyInfoIcon}
                                        leftIconImageStyle={{width: 16, height: 19}}
                                        content={'认证信息'}
                                        showCertificatesOverdue={false}
                                        showBottomLine={false}
                                        clickAction={() => {
                                            if (this.state.verifiedState == '1200') {
                                                // 未认证
                                                Storage.get(StorageKey.changePersonInfoResult).then((value) => {
                                                    if (value) {
                                                        this.props.navigation.dispatch({
                                                            type: RouteType.ROUTE_DRIVER_VERIFIED,
                                                            params: {
                                                                resultInfo: value,
                                                            }
                                                        });
                                                    } else {
                                                        this.props.navigation.dispatch({ type: RouteType.ROUTE_DRIVER_VERIFIED })
                                                    }
                                                })
                                            } else {
                                                // 认证中，认证驳回，认证通过
                                                this.props.navigation.dispatch({
                                                    type: RouteType.ROUTE_DRIVER_VERIFIED_DETAIL,
                                                    params:{
                                                        qualifications: this.state.verifiedState,
                                                        phone: global.phone,//global.phone
                                                    }
                                                });
                                            }
                                        }}
                                    /> : null
                            }
                            <View style={styles.separateView}/>
                            <SettingCell
                                leftIconImage={ModifyPwdIcon}
                                leftIconImageStyle={{width: 15.5, height: 17.5}}
                                content={'修改密码'}
                                showBottomLine={false}
                                clickAction={() => {
                                    ClickUtil.resetLastTime();
                                    if (ClickUtil.onMultiClick()) {
                                        this.props.navigation.dispatch({ type: RouteType.ROUTE_MODIFY_PWD })
                                    }
                                }}
                            />
                            <View style={styles.separateView}/>
                            <SettingCell
                                leftIconImage={SettingIcon}
                                content={'设置'}
                                showBottomLine={true}
                                clickAction={() => {
                                ClickUtil.resetLastTime();
                                if (ClickUtil.onMultiClick()) {
                                    this.props.navigation.dispatch({ type: RouteType.ROUTE_DRIVER_SETTING })
                                }
                            }}
                            />
                            <SettingCell
                                leftIconImage={aboutUsIcon}
                                content={'关于我们'}
                                clickAction={() => {
                                    ClickUtil.resetLastTime();
                                    if (ClickUtil.onMultiClick()) {
                                        // this.props.navigation.dispatch({ type: RouteType.ROUTE_ABOUT_US })
                                        this.props.navigation.dispatch({type:RouteType.ROUTE_AGREEMENT_CONTENT, params: {title: '关于我们', type: 2}})
                                    }
                                }}
                            />

                        </View> : <View>
                            <SettingCell
                                leftIconImage={driverManagerIcon}
                                content={'司机管理'}
                                showBottomLine={true}
                                clickAction={() => {
                                    this.props.navigation.dispatch({type: RouteType.ROUTE_DRIVER_MANAGEMENT})
                                    // if (this.props.ownerStatus == '12' || this.props.ownerStatus == '22') {
                                    //     navigator.navigate('DriverManagement');
                                    // }
                                    // if (this.props.ownerStatus == '11' || this.props.ownerStatus == '21') {
                                    //     Alert.alert('提示', '车主实名认证中');
                                    // }
                                    // if (this.props.ownerStatus == '13' || this.props.ownerStatus == '23') {
                                    //     Alert.alert('提示', '车主实名认证被驳回');
                                    // }
                                }}
                            />
                            <SettingCell
                                leftIconImage={carManagerIcon}
                                content={'车辆管理'}
                                showBottomLine={true}
                                clickAction={() => {
                                    this.props.navigation.dispatch({type: RouteType.ROUTE_CAR_MANAGEMENT})

                                    // if (this.props.ownerStatus == '12' || this.props.ownerStatus == '22') {
                                    //     navigator.navigate('CarManagement');
                                    // }
                                    // if (this.props.ownerStatus == '11' || this.props.ownerStatus == '21') {
                                    //     Alert.alert('提示', '车主实名认证中');
                                    // }
                                    // if (this.props.ownerStatus == '13' || this.props.ownerStatus == '23') {
                                    //     Alert.alert('提示', '车主实名认证被驳回');
                                    // }
                                }}
                            />
                            <SettingCell
                                leftIconImage={commonLineIcon}
                                content={'常用线路设置'}
                                showBottomLine={true}
                                clickAction={() => {
                                    this.props.navigation.dispatch({type:RouteType.ROUTE_MY_ROUTE, params: {title: '我的路线'}})
                                }}
                            />
                            <View style={styles.separateView}/>
                            <SettingCell
                                leftIconImage={carrierSettingIcon}
                                content={'服务与设置'}
                                showBottomLine={false}
                                clickAction={() => {
                                    this.props.navigation.dispatch({type:RouteType.ROUTE_SETTING, params:{title: '设置'}})
                                }}
                            />
                        </View>
                }
                </ScrollView>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <AlertSheetItem ref="choose"/>
                </Modal>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
        userName: state.user.get('userName'),
        ownerName: state.user.get('ownerName'),
        plateNumber: state.user.get('plateNumber'),
        userCarList: state.user.get('userCarList'),
        plateNumberObj: state.user.get('plateNumberObj'),
        driverStatus: state.user.get('driverStatus'),
        currentStatus: state.user.get('currentStatus'),
        ownerStatus: state.user.get('ownerStatus'),
        jpushIcon: state.jpush.get('jpushIcon'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        verifiedState: (params, successCallback) => {
            dispatch(fetchData({
                body: '',
                method: 'POST',
                api: API.API_AUTH_REALNAME_STATUS + params.phoneNum,
                success: data => {
                    successCallback(data);
                },
            }))
        },
        getCertificationState: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_AUTH_QUALIFICATIONS_STATUS,
                success: data => {
                    successCallback(data);
                },
            }))
        },
        ownerVerifiedState: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_QUERY_COMPANY_INFO,
                success: data => {
                    successCallback(data);
                },
            }))
        },
        queryUserAvatar: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_QUERY_USER_AVATAR,
                success: data => {
                    successCallback(data);
                },
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(mine);

