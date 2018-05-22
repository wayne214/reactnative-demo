/**
 * 上传出库单界面
 * Created by xizhixin on 2018/2/28.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    DeviceEventEmitter
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as StaticColor from '../../constants/colors';
import * as RouteType from '../../constants/routeType';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
import DialogSelected from '../../components/common/alertSelected';
import SyanImagePicker from 'react-native-syan-image-picker';
import Toast from '@remobile/react-native-toast';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
import {fetchData} from '../../action/app';
import * as API from '../../constants/api';
import Loading from '../../utils/loading';

import {
    addImage,
    updateImages,
} from '../../action/driverOrder';

const {width, height} = Dimensions.get('window');
const selectedArr = ["拍照", "从手机相册选择"];
const ImageWH = (width - 70) / 4;


class uploadODO extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            departureContactName: params.departureContactName,
            departurePhoneNum: params.departurePhoneNum,
            receiveContact: params.receiveContact,
            orderCode: params.orderCode,
            customCode: params.customCode,
            dispatchno: params.scheduleCode,
            loading: false,
        };
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.createAddItem = this.createAddItem.bind(this);
        this.pickMultiple = this.pickMultiple.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.clickImage = this.clickImage.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.submit = this.submit.bind(this);
        this.uploadODO = this.uploadODO.bind(this);

    }
    componentDidMount() {

    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(updateImages());
    }

    uploadImage(data) {
        upLoadImageManager(API.API_UPLOAD_FILE,
            data,
            ()=>{
                this.setState({
                    loading: true,
                });
            },
            (response)=>{
                console.log('response',response);
                console.log('uploadCode===',response.code);
                console.log('uploadResult===',response.result);
                this.setState({
                    loading: false,
                });
                if (response.code === 200){
                    const list = response.result;
                    let adArray = [];
                    if (list && list.indexOf(',') > -1) {
                        adArray=list.split(',');
                    } else {
                        adArray.push(list);
                    }
                    console.log('adArray', adArray);
                    this.uploadODO(adArray);
                }else {
                    Toast.showShortCenter('上传失败，请重新上传');
                }
            },
            (error)=>{
                console.log('uploadError===',error);
                this.setState({
                    loading: false,
                });
            });
    }

    uploadODO(enclosureList){
        this.props._uploadODO({
            dispatchno: this.state.dispatchno,
            enclosureList: enclosureList,
            orderCode: this.state.orderCode,
            userId: global.userId,
            userName: global.userName,
        }, (result) => {
            Toast.showShortCenter('出库单上传成功!');
            this.props.dispatch(updateImages());
            DeviceEventEmitter.emit('refreshShippedDetails');
            this.props.navigation.dispatch({type: 'pop'});
        }, (error) => {
            Toast.showShortCenter(error.message);
        })
    }

    submit() {
        let formData = new FormData();
        if(this.props.imageList.size > 0) {
            this.props.imageList.map(i => {
                if (Platform.OS === 'ios'){
                    if(i.uri.indexOf('file://') === -1){
                        i.uri = 'file://' + i.uri;
                    }
                }
                let file = {uri: i.uri, type: 'multipart/form-data', name: i.id};
                console.log('filePath===',file.uri);
                formData.append('photo', file);
            });
        }
        formData.append('userId', global.userId);
        formData.append('userName', global.userName);

        if(this.props.imageList.size > 0){
            this.uploadImage(formData);
        }else {
            Toast.showShortCenter('请添加照片');
        }
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
                        Alert.alert('提示','请到设置-应用-授权管理设置相机权限');
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
                    this.pickMultiple();
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
                <NavigatorBar
                    title={'出库单'}
                    router={navigator}
                    hiddenBackIcon={false}
                    optTitle={'提交'}
                    optTitleStyle={styles.rightButton}
                    firstLevelClick={() => {
                        this.submit();
                    }}
                />
                <View>
                    <View style={{backgroundColor: StaticColor.WHITE_COLOR}}>
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
                        <View style={styles.divideLine}/>
                        <View style={styles.locationStyle}>
                            <Text style={styles.locationIcon}>&#xe69c;</Text>
                            <Text style={styles.locationText}>上传的出库单照片请显示发货方的签字</Text>
                        </View>
                    </View>
                    <View style={styles.bottomView}>
                        <View style={styles.titleView}>
                            <View style={styles.flexDirection}>
                                <Text style={styles.titleIcon}>&#xe68b;</Text>
                                <Text style={styles.titleText}>{this.state.receiveContact}</Text>
                            </View>
                        </View>
                        <View style={[styles.divideLine, {marginLeft: 15}]} />
                        <View style={styles.titleView}>
                            <Text style={styles.titleText}>发货人：{this.state.departureContactName}</Text>
                        </View>
                        <View style={[styles.divideLine, {marginLeft: 15}]} />
                        <View style={styles.titleView}>
                            <Text style={styles.titleText}>联系电话：{this.state.departurePhoneNum}</Text>
                        </View>
                        <View style={[styles.divideLine, {marginLeft: 15}]} />
                        <View style={styles.orderView}>
                            <Text style={styles.transportTime}>订单号：{this.state.orderCode}</Text>
                            {this.state.customCode ? <Text style={styles.transportTime}>客户单号：{this.state.customCode}</Text> : null}
                        </View>
                    </View>
                </View>
                <DialogSelected ref={(dialog)=>{
                    this.dialog = dialog;
                }} />
                {this.state.loading ? <Loading /> : null}
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    rightButton: {
        fontSize: 16,
        color: StaticColor.BLUE_BACKGROUND_COLOR,
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
        marginTop: 5,
    },
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
        paddingBottom: 15,
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
    locationStyle: {
        padding: 10,
        flexDirection: 'row',
    },
    locationText: {
        fontSize: 14,
        color: StaticColor.GRAY_TEXT_COLOR,
        paddingTop: 5,
        paddingBottom: 5,
        alignSelf:'center'
    },
    locationIcon:{
        fontFamily: 'iconfont',
        fontSize: 17,
        color: StaticColor.ORANGE_ICON_COLOR,
        padding: 5,
        alignSelf:'center'
    },
    divideLine: {
        height: 0.5,
        width: width,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
    },
    bottomView: {
        backgroundColor: StaticColor.WHITE_COLOR,
        marginTop: 10,
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 15,
        paddingTop: 14,
        paddingBottom: 14,
    },
    orderView: {
        marginLeft: 15,
        paddingTop: 10,
        paddingBottom: 5,
    },
    titleIcon:{
        fontFamily: 'iconfont',
        color: StaticColor.COLOR_CONTACT_ICON_COLOR,
        fontSize: 18,
        alignSelf: 'center',
        marginRight: 10,
    },
    titleText: {
        fontSize: 18,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    transportTime: {
        fontSize: 13,
        color: StaticColor.GRAY_TEXT_COLOR,
        paddingBottom: 5,
    },
    flexDirection: {
        flexDirection: 'row',
    },
});

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
        _uploadODO: (params, callBack, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_UPLOAD_OUT_BOUND_ORDER,
                success: data => {
                    console.log('upload ODO success ',data);
                    callBack && callBack(data);
                },
                fail: error => {
                    console.log('???', error);
                    failCallBack && failCallBack(error);
                }
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(uploadODO);

