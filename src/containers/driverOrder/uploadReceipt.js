/**
 * Created by xizhixin on 2017/6/30.
 * 上传回单界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    DeviceEventEmitter,
    Platform,
    Alert,
    ImageBackground,
} from 'react-native';
import DeviceInfo from "react-native-device-info";

import NavigationBar from '../../components/common/navigatorbar';
import CommonCell from "../../containers/mine/cell/commonCell";
import DialogSelected from '../../components/common/alertSelected';
import SyanImagePicker from 'react-native-syan-image-picker';
import Button from 'apsl-react-native-button';
import ClickUtil from '../../utils/prventMultiClickUtil';
import Toast from '@remobile/react-native-toast';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
import StorageKey from '../../constants/storageKeys';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import Validator from '../../utils/validator';
import * as RouteType from '../../constants/routeType';

import {
    addImage,
    updateImages,
    refreshDriverOrderList,
} from '../../action/driverOrder';
import * as API from '../../constants/api';
import Loading from '../../utils/loading';
import Storage from '../../utils/storage';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
import * as StaticColor from '../../constants/colors';

const {width, height} = Dimensions.get('window');
const selectedArr = ["拍照", "从手机相册选择"];
const ImageWH = (width - 70) / 4;

let userID = '';
let userName = '';
let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles =StyleSheet.create({
    iconStyle: {
        width: 100,
        height: 100,
    },
    imageItem: {
        width: ImageWH,
        height: ImageWH,
    },
    imageView: {
        flexDirection: 'row',
        backgroundColor: StaticColor.WHITE_COLOR,
        paddingBottom: 10,
    },
    imageTitle: {
        marginTop: 10,
    },
    imageBorder: {
        marginTop: 10,
        marginLeft: 10,
        width: ImageWH,
        height: ImageWH,
        borderWidth: 1,
        borderColor: StaticColor.DEVIDE_LINE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoText: {
        fontSize: 23,
        fontFamily: 'iconfont',
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        marginBottom: -5,
    },
    imageLayout: {
        marginLeft: 10,
        marginRight: 10,
    },
    uploadButton: {
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0,
        backgroundColor: 'transparent',
        borderRadius: 5,
    },
    container: {
        flex: 1,
        backgroundColor:StaticColor.COLOR_VIEW_BACKGROUND,
    },
    buttonBackground: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        height: 44,
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR
    },
});

class UploadReceipt extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            data:[],
            transCode: params.transCode,
            receiptWay: params.receiptWay,
            loading: false,
            flag: params.flag,
            orderSource: params.orderSource,
        };
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.createAddItem = this.createAddItem.bind(this);
        this.pickMultiple = this.pickMultiple.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.clickImage = this.clickImage.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

    }
    componentDidMount() {
        this.getCurrentPosition();
        Storage.get(StorageKey.USER_INFO).then((userInfo) => {
            if(userInfo) {
                userID = userInfo.userId;
                userName = userInfo.userName;
            }
        });
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(updateImages());
        // DeviceEventEmitter.emit('changeStateReceipt');
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

    callbackSelected(i){
        switch (i){
            case 0: // 拍照
                if (Platform.OS === 'ios') {
                    PermissionsManager.cameraPermission().then(data => {
                        this.takePhoto();
                    }).catch(err=>{
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null,err.message)
                    });
                }else{
                    PermissionsManagerAndroid.cameraPermission().then((data) => {
                        this.takePhoto();
                    }, (err) => {
                        Alert.alert('提示','请到设置-应用-授权管理设置相机及存储权限');
                    });
                }
                break;
            case 1: // 图库
                if (Platform.OS === 'ios') {
                    // 图库
                    PermissionsManager.photoPermission().then(data=>{
                        this.pickMultiple();
                    }).catch(err=>{
                        // Toast.showShortCenter(err.message);
                        Alert.alert(null,err.message)
                    });
                }else{
                    if(DeviceInfo.getBrand() === 'Xiaomi'){
                        PermissionsManagerAndroid.externalPermission().then((data) => {
                            this.pickMultiple();
                        }, (err) => {
                            Alert.alert('提示', '请到设置-应用-授权管理设置存储权限');
                        });
                    }else {
                        PermissionsManagerAndroid.photoPermission().then((data) => {
                            this.pickMultiple();
                        }, (err) => {
                            Alert.alert('提示', '请到设置-应用-授权管理设置存储权限');
                        });
                    }
                }
                break;
        }
    }
    // 选择照片
    pickMultiple() {
        SyanImagePicker.showImagePicker({
            imageCount: this.props.maxNum,
            isCamera: false,
            quality: 100,
        }, (err, images) => {
            if (err) {
                // 取消选择
                return;
            }
            // 选择成功，渲染图片
            let totalLen = this.props.imageList.size + images.length;
            let arr = images;
            if (totalLen > 9) {
                arr.splice(images.length - 1 - totalLen - 9, totalLen - 9);
                Toast.showShortCenter('最多可上传9张照片');
            }
            this.setState({
                data: arr.map(i => {
                    console.log('received image', i);
                    let arr = i.uri.split('/');
                    let id = arr[arr.length - 1];
                    return {uri: i.uri, width: i.width, height: i.height, size: i.size, id: id};
                }),
            });
            console.log('-----------',this.state.data.length);
            this.props.dispatch(addImage(this.state.data));
            // maxNum = this.props.maxNum;
            console.log('maxNum', this.props.maxNum);
        });
    }

    // 打开相机
    takePhoto(){
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_TAKE_PHOTO_PAGE
        });
    }

    showAlertSelected(){
        this.dialog.show("请选择照片", selectedArr, '#333333', this.callbackSelected);
    }

    createAddItem(type) {
        const {imageList} = this.props;
        let addItem;
        if ((type === 1 && imageList.size < 4) || (type === 2 && imageList.size >= 4 && imageList.size < 8) || (type ===3 && imageList.size === 8)) {
            addItem = (
                <TouchableOpacity onPress={() => {this.showAlertSelected();}}>
                    <View style={styles.imageBorder}>
                        <Text style={styles.photoText}>&#xe632;</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return addItem;
    }

    clickImage(index) {
        const {imageList} = this.props;
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_PHOTO_SHOW_PAGE,
            params: {
                image: imageList.toArray(),
                num: index,
            }
        });
    }

    uploadImage(url, data){
        upLoadImageManager(url,
            data,
            ()=>{
                this.setState({
                    loading: true,
                });
            },
            (response)=>{
                console.log('uploadCode===',response.code);
                console.log('uploadResult===',response.result);
                this.setState({
                    loading: false,
                });
                if (response.code === 200){
                    lastTime = new Date().getTime();
                    // ReadAndWriteFileUtil.appendFile('上传回单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    //     locationData.district, lastTime - currentTime, '上传回单页面');
                    Toast.showShortCenter('上传回单成功');
                    if(this.state.flag != '1') {
                        this.props._refreshOrderList(0);
                        this.props._refreshOrderList(2);
                        this.props._refreshOrderList(3);
                    }
                    DeviceEventEmitter.emit('refreshCarrierOrderList');
                    this.props.navigation.dispatch({type: 'pop', key: 'Main'});
                }else {
                    console.log('uploadError===',response.message);
                    Toast.showShortCenter(response.message);
                }
            },
            (error)=>{
                console.log('uploadError===',error);
                this.setState({
                    loading: false,
                });
                // Toast.showShortCenter('上传回单失败');
            });
    }

    render() {
        const {imageList} = this.props;
        const navigator = this.props.navigation;
        const imagesView = imageList.map((picture, index) => {
            console.log('---imageList--',picture);
            if (index > 3) {
                return null;
            }
            return (
                <View key={index}>
                    <TouchableOpacity onPress={() => {this.clickImage(index)}} style={styles.imageBorder}>
                        <Image style={styles.imageItem} source={{uri:picture.uri}} />
                    </TouchableOpacity>
                </View>
            );
        });
        const imagesViewSecond = imageList.map((picture, index) => {
            if (index < 4 || index > 7) {
                return null;
            }
            return (
                <View key={index}>
                    <TouchableOpacity onPress={() => {this.clickImage(index)}} style={styles.imageBorder}>
                        <Image style={styles.imageItem} source={{uri:picture.uri}} />
                    </TouchableOpacity>
                </View>
            );
        });
        const imagesViewThird = imageList.map((picture, index) => {
            if (index < 8) {
                return null;
            }
            return (
                <View key={index}>
                    <TouchableOpacity onPress={() => {this.clickImage(index)}} style={styles.imageBorder}>
                        <Image style={styles.imageItem} source={{uri:picture.uri}} />
                    </TouchableOpacity>
                </View>
            );
        });
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'回单'}
                    router={navigator}
                    hiddenBackIcon={false}
                    backViewClick={() => {
                        const routes = this.props.routes;
                        if(routes[routes.length - 2].routeName === RouteType.ROUTE_SIGN_SUCCESS_PAGE) {
                            this.props._refreshOrderList(2);
                            navigator.dispatch({type: 'pop', key: 'Main'});
                        }else {
                            navigator.dispatch({type: 'pop'});
                        }
                    }}
                />
                {
                    this.state.flag == 1 ? null : <View style={{marginTop: 10, marginBottom: 10}}>
                        <CommonCell itemName={`签单返回：${this.state.receiptWay}`} titleColorStyle={{color:StaticColor.LIGHT_BLACK_TEXT_COLOR}} hideBottomLine={true}/>
                    </View>
                }

                <View style={{backgroundColor: StaticColor.WHITE_COLOR}}>
                    <CommonCell itemName="上传回单" titleColorStyle={{color:StaticColor.LIGHT_BLACK_TEXT_COLOR}}/>
                    <View style={styles.imageLayout}>
                        <View style={[styles.imageView, { paddingBottom: 0, }]}>
                            {imagesView}
                            {this.createAddItem(1)}
                        </View>
                        <View style={[styles.imageView, { paddingBottom: 0 }]}>
                            {imagesViewSecond}
                            {this.createAddItem(2)}
                        </View>
                        <View style={styles.imageView}>
                            {imagesViewThird}
                            {this.createAddItem(3)}
                        </View>
                    </View>
                </View>
                <View style={styles.buttonBackground}>
                    <Button
                        isDisabled={imageList.size <= 0}
                        style={styles.uploadButton}
                        textStyle={{color: StaticColor.WHITE_COLOR, fontSize: 17}}
                        onPress={() => {
                            if (ClickUtil.onMultiClick()) {
                                let formData = new FormData();
                                this.props.imageList.map(i => {
                                    if (Platform.OS === 'ios'){
                                        if(i.uri.indexOf('file://') === -1){
                                            i.uri = 'file://' + i.uri;
                                        }
                                    }
                                    if(Validator.isHasChinese(i.id)){
                                        let reg = /[\u4e00-\u9fa5]/g;
                                        i.id = i.id.replace(reg, 'receiptPhoto')
                                    }
                                    console.log('i.id===',i.id);
                                    let file = {uri: i.uri, type: 'multipart/form-data', name: i.id};
                                    console.log('filePath===',file.uri);
                                    formData.append('photo', file);
                                });


                                let url = '';
                                if(this.state.orderSource === 1){
                                    formData.append('driverId', userID);
                                    formData.append('driverName', userName);
                                    formData.append('resourceCode', this.state.transCode);
                                    url = API.API_MATCH_UPLOAD_RECEIPT;
                                }else {
                                    if (this.state.flag == 1) {
                                        formData.append('resourceCode', this.state.transCode);
                                        formData.append('carrierUserName', global.ownerName);
                                        formData.append('carrierUserId', global.companyId);
                                        url = API.API_NEW_UPLOAD_CTC_ORDER_MATCH;
                                    } else {
                                        formData.append('userId', userID);
                                        formData.append('userName', userName);
                                        formData.append('transCode', this.state.transCode);
                                        formData.append('receiptType', this.state.receiptWay);
                                        url = API.API_NEW_UPLOAD_RECEIPT;
                                    }
                                }
                                this.uploadImage(url, formData);
                            }
                        }}
                    >
                        提交
                    </Button>
                </View>
                <DialogSelected ref={(dialog)=>{
                    this.dialog = dialog;
                }} />
                {this.state.loading ? <Loading /> : null}
            </View>
        );
    }
}
function mapStateToProps(state){
    return {
        imageList: state.driverOrder.get('imageList'),
        maxNum: state.driverOrder.get('maxNum'),
        userInfo: state.user.get('userInfo'),
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {
        dispatch,
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadReceipt);



