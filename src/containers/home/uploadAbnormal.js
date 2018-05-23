/**
 * 道路异常界面
 * Created by xizhixin on 2017/12/13.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from '../../components/common/navigatorbar';
import * as StaticColor from '../../constants/colors';
import DialogSelected from '../../components/common/alertSelected';
import DispatchDialog from '../../components/home/dispatchDialog';
import Loading from '../../utils/loading';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';
import Toast from '@remobile/react-native-toast';
import {fetchData} from '../../action/app';
import {
    updateImages
} from '../../action/driverOrder';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import {upLoadImageManager} from '../../utils/upLoadImageToVerified';
const {width, height} = Dimensions.get('window');
let selectedArr = ["拍照"];
let title = '请选择照片';
const ImageWH = (width - 70) / 4;
import * as API from '../../constants/api';
import * as RouteType from '../../constants/routeType';
import rightArrow from '../../../assets/home/rightarrow.png';
let currentTime = 0;
let lastTime = 0;
let locationData = '';
let enclosureList = [];

let url = '';

class uploadAbnormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            location: '',
            result: [],
            content: '',
            chooseItem: null,
        };
        this.submit = this.submit.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.dispatchItemSelected = this.dispatchItemSelected.bind(this);
        this.callbackSelected = this.callbackSelected.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.showDispatchDialog = this.showDispatchDialog.bind(this);
        this.clickImage = this.clickImage.bind(this);
        this.createAddItem = this.createAddItem.bind(this);
        this.getItemContent = this.getItemContent.bind(this);
        this.getCurrentPosition = this.getCurrentPosition.bind(this);

    }
    componentDidMount() {
        this.getCurrentPosition();
        this.getItemContent();
    }

    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            this.setState({
                location: data.address,
            });
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    // 获取调度单数据
    getItemContent() {
        currentTime = new Date().getTime();
        this.props._getItemContentInfo({
            plateNum: global.plateNumber,
            driverPhoneNum: global.phone,
        }, (result) => {
            if(result && result.length > 0){
                this.setState({
                    result: result,
                });
            }else {
                Alert.alert('提示', '当前无调度单信息，无法提交道路异常',[{
                    text: '确定',
                    onPress: () => {
                        this.props.navigation.goBack();
                    }
                }]);
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
                    this.uploadAbnormalException(adArray);

                }else {
                    Toast.showShortCenter('上传失败，请重新上传');
                }
            },
            (error)=>{
                console.log('uploadError===',error);
                this.setState({
                    loading: false,
                });
                // Toast.showShortCenter('上传失败，请重新上传');
            });
    }

    // 上传道路异常
    uploadAbnormalException(enclosureList) {
        this.props._uploadAbnormalExceptionAction({
            address: this.state.location,
            content: this.state.content,
            driverPhoneNum: global.phone,
            enclosureList: enclosureList,
            mediaType: 1,
            plateNum: global.plateNumber,
            scheduleCode: this.state.chooseItem.scheduleCode,
            userId: global.userId,
            userName: global.userName
        }, () => {
            Toast.showShortCenter('道路异常提交成功!');
            this.props.dispatch(updateImages());
            this.props.navigation.dispatch({type: 'pop'});
        })
    }
    // 提交道路异常
    submit() {
        if(!this.state.chooseItem) {
            Toast.showShortCenter('请先选择调度单');
            return;
        }
        let formData = new FormData();
        if(this.props.imageList.size > 0) {
            this.props.imageList.map(i => {
                if (Platform.OS === 'ios'){
                    if(i.uri.indexOf('file://') === -1){
                        i.uri = 'file://' + i.uri;
                    }
                }
                let file = {uri: i.uri, type: 'multipart/form-data', name: i.id + '.jpg'};
                console.log('filePath===',file.uri);
                formData.append('photo', file);
            });
            url = API.API_UPLOAD_FILE;
        }
        formData.append('userId', global.userId);
        formData.append('userName', global.userName);

        if(this.props.imageList.size > 0){
            this.uploadImage(url, formData);
        }else {
            Toast.showShortCenter('请添加照片');
        }
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

    showAlertSelected(){
        this.dialog.show(title, selectedArr, '#333333', this.callbackSelected);
    }
    showDispatchDialog(){
        this.dispatchDialog.show(this.state.result, this.dispatchItemSelected);
    }

    dispatchItemSelected(item) {
        this.setState({
            chooseItem: item,
        })
    }

    callbackSelected(i){
        switch (i){
            case 0: // 拍照
                if (Platform.OS === 'ios') {
                    PermissionsManager.cameraPermission().then(data => {
                        this.takePhoto();
                    }).catch(err=>{
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
        }
    }

    // 打开相机
    takePhoto() {
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_TAKE_PHOTO_PAGE
        });
    }

    clickImage(index) {
        console.log('---==index==---',index);
        const {imageList} = this.props;
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_PHOTO_SHOW_PAGE,
            params: {
                image: imageList.toArray(),
                num: index,
            },
        })
    }

    render() {
        const {imageList} = this.props;
        // if (imageList.size === 0) {
        //     selectedArr = ['拍照', '视频'];
        //     title = '请选择照片或视频';
        // }else if (imageList.size > 0) {
        //     selectedArr = ['拍照'];
        //     title = '请选择照片';
        // }
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
        const imageLayout = <View style={styles.imageLayout}>
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
        </View>;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'道路异常'}
                    router={navigator}
                    backTitle={'取消'}
                    backTitleStyle={{
                        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                        fontSize: 16,
                    }}
                    backViewClick={() => {
                        Alert.alert('','退出此次编辑？',[
                            {
                                text: '取消',
                                onPress: () => {}
                            },
                            {
                                text: '退出',
                                onPress: () => {
                                    this.setState({
                                        chooseItem: null,
                                    });
                                    this.props.dispatch(updateImages());
                                    this.props.navigation.dispatch({type: 'pop'})
                                }
                            },
                        ], {cancelable: true});
                    }}
                    optTitle={'提交'}
                    optTitleStyle={{
                        color: StaticColor.BLUE_BACKGROUND_COLOR,
                        fontSize: 16,
                    }}
                    firstLevelClick={() => {
                        this.submit();
                    }}
                />
                <View>
                    <View style={styles.topView}>
                        <TextInput
                            style={styles.input}
                            placeholder={'请输入备注信息...'}
                            placeholderTextColor={'#999'}
                            multiline={true}
                            maxLength={50}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => {
                                this.setState({
                                    content: text,
                                });
                            }}
                        />
                        {imageLayout}
                        <View style={styles.divideLine}/>
                        <View style={styles.locationStyle}>
                            <Text style={styles.locationIcon}>&#xe688;</Text>
                            <Text
                                style={styles.locationText}>{this.state.location ? this.state.location : '定位失败'}</Text>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 0,
                                }}
                                onPress={() => {
                                    this.getCurrentPosition(0);
                                }}
                            >
                                <Text style={styles.icon}>&#xe695;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottomView}>
                        <Text style={styles.tipText}>调度单</Text>
                        {
                            this.state.chooseItem ?
                                <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.showDispatchDialog();
                                        }}
                                    >
                                        <View style={styles.chooseStyle}>
                                            <View>
                                                <Text
                                                    style={styles.lineStyle}
                                                    numberOfLines={1}
                                                >{this.state.chooseItem.scheduleRoutes}</Text>
                                                <Text style={styles.codeStyle}>调度单号：{this.state.chooseItem.scheduleCode}</Text>
                                            </View>
                                            <Image style={styles.rightIcon} source={rightArrow}/>
                                        </View>
                                    </TouchableOpacity>
                                </View> :
                                <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.showDispatchDialog();
                                        }}
                                    >
                                        <View style={styles.chooseStyle}>
                                            <Text style={styles.contentText}>请选择调度单</Text>
                                            <Image style={styles.rightIcon} source={rightArrow}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        }
                    </View>
                </View>
                <DispatchDialog ref={(dialog)=>{
                    this.dispatchDialog = dialog;
                }}
                />
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
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND
    },
    topView: {
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    input: {
        width: width,
        height: 75,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 15,
        marginBottom: 12,
        ...Platform.select({
            android: {
                textAlignVertical: 'top',
                marginTop: 5,
            },
            ios: {
                marginTop: 10,
            }
        }),
    },
    imageLayout: {
        marginLeft: 10,
        marginRight: 10,
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
        borderColor: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoText: {
        fontSize: 23,
        fontFamily: 'iconfont',
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        marginBottom: -5,
    },
    divideLine: {
        height: 1,
        width: width,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        marginTop: 5,
    },
    locationIcon:{
        fontFamily: 'iconfont',
        fontSize: 16,
        color: StaticColor.GRAY_TEXT_COLOR,
        padding: 5,
    },
    icon: {
        fontFamily: 'iconfont',
        fontSize: 16,
        color: StaticColor.REFRESH_COLOR,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    locationStyle: {
        padding: 10,
        flexDirection: 'row',
    },
    locationText: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 5,
        paddingTop: 5,
        paddingBottom: 5,
        marginRight: 50,
    },
    bottomView: {
        marginTop: 10
    },
    tipText: {
        fontSize: 16,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
        marginBottom: 10,
    },
    rightIcon: {
        marginRight: 10,
        alignSelf: 'center',
    },
    chooseStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    contentText: {
        fontSize: 16,
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        marginLeft: 10,
        paddingTop: 14,
        paddingBottom: 14,
    },
    lineStyle: {
        fontSize: 17,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 10,
        paddingTop: 15,
        paddingBottom: 10,
        width: width - 40,
    },
    codeStyle: {
        fontSize: 13,
        color: StaticColor.GRAY_TEXT_COLOR,
        paddingBottom: 15,
        marginLeft: 10,
    }
});

function mapStateToProps(state){
    return {
        imageList: state.driverOrder.get('imageList'),
        maxNum: state.driverOrder.get('maxNum'),
        routes: state.nav.routes,
        currentStatus: state.user.get('currentStatus'),
    };
}

function mapDispatchToProps (dispatch){
    return {
        dispatch,
        _uploadAbnormalExceptionAction: (params, callBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_NEW_UPLOAD_SAVE_EXCEPTIONINFO,
                success: data => {
                    console.log('upload abnormal exception success ', data);
                    callBack && callBack(data)
                }
            }))
        },
        _getItemContentInfo: (params, callBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_NEW_UPLOAD_DISPATCH_ORDER,
                success: data => {
                    console.log('get item info success ', data);
                    callBack && callBack(data)
                }
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(uploadAbnormal);
