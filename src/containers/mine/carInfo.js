import React, {Component} from 'react';

import {connect} from 'react-redux';

import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    InteractionManager,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import {CachedImage} from 'react-native-img-cache';
import Toast from '@remobile/react-native-toast';
import CommonCell from '../../containers/mine/cell/commonCell';
import NavigationBar from '../../components/common/navigatorbar';
import * as API from '../../constants/api';
// import HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
import * as StaticColor from '../../constants/colors';
import Button from 'apsl-react-native-button';
import NoImage from '../../../assets/img/mine/person/noiamgeShow.png';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import Loading from '../../utils/loading';
import StorageKeys from '../../constants/storageKeys';
import CarImage from '../../../assets/img/mine/car/carInfo.png';
import {fetchData} from "../../action/app";

const headerImageFail = require('../driverVerified/images/carInfoFail.png');
const headerImageSuccess = require('../driverVerified/images/carInfoHeader.png');
const headerImageLoading = require('../driverVerified/images/carInfoIng.png');

let imgListTemp = [];
let imgList = [];
const {width} = Dimensions.get('window');


let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        // marginTop: 10,
        backgroundColor: 'white',
    },
    imgArea: {
        paddingTop: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 15,
    },
    textStyle: {
        marginLeft: 20,
        marginBottom: 15,
        fontSize: 16,
        color: '#333333',
        alignSelf: 'flex-start',
    },
    imgAreaSubContainer: {
        borderColor: '#cccccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 150,
        padding: 5,
    },
    imgStyle: {
        width: 190,
        height: 140,
        borderWidth: 1,
        borderColor: '#f5f5f5',
    },
    loadingImage: {
        width: 25,
        height: 25,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    separatorLine: {
        height: 10,
        backgroundColor: '#f5f5f5',
    },
    driveNumImageStyle: {
        width: (width - 60) / 3 - 10,
        height: (width - 60) / 4 - 10,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        borderRadius: 3,
    },
    subContainer: {
        borderColor: '#cccccc',
        borderWidth: 1,
        width: (width - 60) / 3,
        height: (width - 60) / 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemSeparatorLine: {
        backgroundColor: '#e8e8e8',
        height: 1,
        marginBottom: 10,
        width: width,
        marginLeft: 20,
    },
    subTextStyle: {
        color: '#666666',
        fontSize: 14,
        marginTop: 15,
    },
    Button: {
        backgroundColor: 'transparent',
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0,
        height: 40,
        borderRadius: 5,
        marginBottom: 0,
    },
    ButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    allContainer: {
        flex: 1,
        backgroundColor:StaticColor.COLOR_VIEW_BACKGROUND,
    },
    buttonGround: {
        width: width - 20,
        marginTop: 55,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 0,
        height: 44,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#0092FF'
    },
    headStyle:{
        //backgroundColor: '#1b82d1',
        height: 190,
        alignItems: 'center',
    },
    textStyle1: {
        fontSize: 20,
        color: 'white',
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'transparent'
    },
});

class CarInfo extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            aCar: '',
            showLoadingView: true,
            modalVisible: false,
            imageUrl: '',
            loading: false,
            certificationState: params.certificationState,
        };
        this.fetchData = this.fetchData.bind(this);
        this.onClickImage = this.onClickImage.bind(this);
        this.getCarInfoSuccessCallBack = this.getCarInfoSuccessCallBack.bind(this);
        this.getCarInfoFailCallBack = this.getCarInfoFailCallBack.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation
        return {
            tabBarLabel: '个人信息',
            header: <NavigationBar title='个人信息' hiddenBackIcon={false} router={navigation}/>,
        }
    };

    componentDidMount() {

        this.getCurrentPosition();
        imgListTemp = [];
        imgList = [];
        const {certificationState} = this.props;
        /*
        Storage.get('carInfoResult').then((value) => {
            if (value) {
                if (value.drivingLicensePic && value.drivingLicensePic !== '') {
                    imgListTemp.push(value.drivingLicensePic);
                }
                if (value.drivingLicenseSecondaryPic && value.drivingLicenseSecondaryPic !== '') {
                    imgListTemp.push(value.drivingLicenseSecondaryPic);
                }
                if (value.carHeadPic && value.carHeadPic !== '') {
                    imgListTemp.push(value.carHeadPic);
                }
                if (value.insurancePic && value.insurancePic !== '') {
                    imgListTemp.push(value.insurancePic);
                }
                this.setState({
                    aCar: value,
                });
            } else {
                if (certificationState === '1200') {
                    this.setState({
                        aCar: '',
                    });
                } else {
                    this.setState({
                        aCar: {},
                    });
                    this.fetchData();
                }
            }
        });
        */
        this.fetchData();

    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }
    fetchData() {
         
        /*
        Storage.get(StorageKeys.USER_INFO).then((userInfo) => {
            if (userInfo) {
                this.getCarInfo(userInfo, this.getCarInfoSuccessCallBack, this.getCarInfoFailCallBack);
            }
        });
        */
        this.getCarInfo(userInfo, this.getCarInfoSuccessCallBack, this.getCarInfoFailCallBack);

    }
    getCarInfoFailCallBack() {
        const {certificationState} = this.props;
        if (certificationState === '1200') {
            this.setState({
                aCar: '',
            });
        } else {
            this.setState({
                aCar: {},
            });
        }
    }
    getCarInfoSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('资质认证详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '车辆信息页面');
        if (result) {
            if (result.drivingLicensePic && result.drivingLicensePic !== '') {
                imgListTemp.push(result.drivingLicensePic);
            }
            if (result.drivingLicenseSecondaryPic && result.drivingLicenseSecondaryPic !== '') {
                imgListTemp.push(result.drivingLicenseSecondaryPic);
            }
            if (result.carHeadPic && result.carHeadPic !== '') {
                imgListTemp.push(result.carHeadPic);
            }
            if (result.insurancePic && result.insurancePic !== '') {
                imgListTemp.push(result.insurancePic);
            }
            this.setState({
                aCar: result,
                certificationState: result.certificationStatus,
            });
            Storage.save('carInfoResult', result);
        }
    }
    getCarInfo(userInfo, getCarInfoSuccessCallBack, getCarInfoFailCallBack) {

        currentTime = new Date().getTime();
        const plateNumber = this.props.userPlateNumber;
        if (plateNumber) {
            this.props.getCarInfo({
                phoneNum: userInfo.phone,
                plateNumber: plateNumber,
            }, getCarInfoSuccessCallBack, getCarInfoFailCallBack);
        } else {
            this.setState({
                aCar: '',
            });
        }
    }
    onClickImage(imgIndex) {
        if (imgListTemp.length > 0) {
            if (imgIndex > imgListTemp.length) {
                imgIndex = imgListTemp.length - 1;
            }
            imgList = imgListTemp.map((i, index) => {
                return {url: i ? i : ''};
            });
            this.props.navigation.navigate('ImageShow',
                {
                    image: imgList,
                    num: imgIndex,
                });
        }
    }

    render() {
        const navigator = this.props.navigation;
        const aCar = this.state.aCar !== null && this.state.aCar !== '' ? this.state.aCar : '';
        const showDrivingLicensePic = aCar.drivingLicenseThumbnail !== null && aCar.drivingLicenseThumbnail !== '' ||
            aCar.drivingLicensePic && aCar.drivingLicensePic !== '';
        const showDrivingLicenseSecondaryPic = aCar.drivingLicenseSecondaryThumbnail !== null && aCar.drivingLicenseSecondaryThumbnail !== '' ||
            aCar.drivingLicenseSecondaryPic && aCar.drivingLicenseSecondaryPic !== '';
        const showCarHeadPic = aCar.carHeadThumbnail !== null && aCar.carHeadThumbnail !== '' ||
            aCar.carHeadPic && aCar.carHeadPic !== '';
        const showInsurancePic = aCar.insuranceThumbnail !== null && aCar.insuranceThumbnail !== '' ||
            aCar.insurancePic && aCar.insurancePic !== '';


        let headView = this.state.certificationState == '1201' ?
            <View style={styles.headStyle}>

                <Image source={headerImageLoading}/>

                <Text style={styles.textStyle1}>认证中</Text>
            </View>
            : this.state.certificationState == '1202' ?
                <View style={styles.headStyle}>

                    <Image source={headerImageSuccess}/>

                    <Text style={styles.textStyle1}>认证通过</Text>
                </View>
                :
                <View style={styles.headStyle}>

                    <Image source={headerImageFail}/>

                    <Text style={styles.textStyle1}>认证驳回</Text>
                </View>;

        return (
            <View style={styles.allContainer}>
                {/*<NavigationBar*/}
                    {/*title={'车辆详情'}*/}
                    {/*router={navigator}*/}
                    {/*hiddenBackIcon={false}*/}
                    {/*rightButtonConfig={{*/}
                        {/*type: 'string',*/}
                        {/*title: '添加车辆',*/}
                        {/*disable:'false',*/}
                        {/*rightTitleStyle: {*/}
                        {/*},*/}
                        {/*onClick: () => {*/}
                            {/*this.props.navigation.navigate('AddCarDriver');*/}
                        {/*},*/}
                    {/*}}*/}
                {/*/>*/}
                {
                    aCar === '' ?
                        <View style={{
                            width,
                            alignItems: 'center',
                        }}>
                            <Image
                                style={{
                                    marginTop: 130,
                                }}
                                source={CarImage}/>
                            <Text
                                style={{
                                    marginTop: 30,
                                    fontSize: 16,
                                    color: '#333333',
                                }}
                            >
                                您的车辆信息为空，请先去资质认证吧~
                            </Text>
                            <View style={styles.buttonGround}>
                                <Button
                                    style={styles.Button}
                                    textStyle={styles.ButtonText}
                                    onPress={() => {
                                        // this.props.navigation.navigate('CertificationPage')
                                        this.props.navigation.navigate('AddCarDriver');
                                    }}
                                >
                                    添加车辆
                                </Button>
                            </View>
                        </View> :
                        <ScrollView>
                            <View style={styles.container}>
                                {
                                    headView
                                }
                                <CommonCell itemName="车辆牌照" content={aCar.carNum !== null ? aCar.carNum : ''}/>
                                <CommonCell itemName="手机号码" content={aCar.phoneNum !== null ? aCar.phoneNum : ''}/>
                                <CommonCell itemName="车辆类型" content={aCar.carType !== null ? aCar.carType : ''}/>
                                <CommonCell itemName="车长" content={aCar.carLen !== null ? aCar.carLen : ''}/>
                                <CommonCell itemName="载重"
                                            content={typeof (aCar.carryCapacity) !== 'undefined' && aCar.carryCapacity !== null ? `${aCar.carryCapacity}吨` : ''}
                                            hideBottomLine={true}/>
                                <View style={styles.separatorLine}/>
                                <View style={{paddingTop: 10, backgroundColor: 'white'}}>
                                    <Text style={styles.textStyle}>行驶证</Text>
                                    <View style={styles.itemSeparatorLine}/>
                                    <View style={{
                                        flexDirection: 'row',
                                        paddingBottom: 10,
                                        paddingLeft: 20,
                                        paddingRight: 20
                                    }}>
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                                showDrivingLicensePic ? this.onClickImage(0) : Toast.showShortCenter('暂无图片');
                                            }}
                                                style={styles.subContainer}
                                            >
                                                {
                                                    showDrivingLicensePic ?
                                                        <CachedImage style={styles.driveNumImageStyle}
                                                                     source={{uri: aCar.drivingLicenseThumbnail ? aCar.drivingLicenseThumbnail : aCar.drivingLicensePic}}/> :
                                                        <Image style={styles.driveNumImageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.subTextStyle}>行驶证主页</Text>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                                showDrivingLicenseSecondaryPic ? this.onClickImage(1) : Toast.showShortCenter('暂无图片');;
                                            }}
                                                style={styles.subContainer}
                                            >
                                                {
                                                    showDrivingLicenseSecondaryPic ?
                                                        <CachedImage style={styles.driveNumImageStyle}
                                                                     source={{uri: aCar.drivingLicenseSecondaryThumbnail ? aCar.drivingLicenseSecondaryThumbnail : aCar.drivingLicenseSecondaryPic}}/> :
                                                        <Image style={styles.driveNumImageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.subTextStyle}>行驶证副页</Text>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                                showCarHeadPic ? this.onClickImage(2) : Toast.showShortCenter('暂无图片');;
                                            }}
                                                style={styles.subContainer}
                                            >
                                                {
                                                    showCarHeadPic ?
                                                        <CachedImage style={styles.driveNumImageStyle}
                                                                     source={{uri: aCar.carHeadThumbnail ? aCar.carHeadThumbnail : aCar.carHeadPic}}/> :
                                                        <Image style={styles.driveNumImageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.subTextStyle}>车头照</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.separatorLine}/>
                                <View style={styles.imgArea}>
                                    <Text style={styles.textStyle}>保险照片</Text>
                                    <View style={[styles.itemSeparatorLine, {marginLeft: 40}]}/>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                        showInsurancePic ? this.onClickImage(3) : Toast.showShortCenter('暂无图片');
                                    }}
                                        style={styles.imgAreaSubContainer}
                                    >
                                        {
                                            showInsurancePic ?
                                                <CachedImage
                                                    style={styles.imgStyle}
                                                    resizeMode="cover"
                                                    source={{uri: aCar.insuranceThumbnail ? aCar.insuranceThumbnail : aCar.insurancePic}}
                                                /> :
                                                <Image style={styles.imgStyle} source={NoImage}/>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                }
                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userPlateNumber: state.user.get('plateNumber'),
        userInfo: state.user.get('userInfo'),
        certificationState: state.jpush.get('certificationState'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCarInfo: (params, successCallback, failCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_AUTH_QUALIFICATIONS_DETAIL,
                success: data => {
                    successCallback(data);
                },
                fail: ()=> {
                    failCallback();
                }
            }))
        }

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CarInfo);
