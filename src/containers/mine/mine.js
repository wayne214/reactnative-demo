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
    ImageBackground
} from 'react-native';

import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';

import SettingCell from './cell/settingCell';
import ClickUtil from '../../utils/prventMultiClickUtil';
import * as StaticColor from '../../constants/colors';
import LoginAvatar from '../../../assets/img/mine/login_avatar.png';
import * as ConstValue from '../../constants/constValue';
import Validator from '../../utils/validator';
import * as RouteType from '../../constants/routeType';
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
    }

    componentDidMount() {

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

    }

    componentWillUnmount() {
        this.mineListener.remove();
        // this.imgPhotoListener.remove();
        this.cerlistener.remove();
        this.verlistener.remove();
        // this.imglistener.remove();
        // this.choosePhotoListener.remove();
        // this.hideModuleListener.remove();
        // this.imageCameralistener.remove();
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
                    phoneNum: '15112345678',
                },callback);
            }
        }
    }

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

    ownerVerifiedState(callback) {
        currentTime = new Date().getTime();
        if (this.props.userInfo) {
            if (this.props.userInfo.phone) {
                this.props.ownerVerifiedState({
                    busTel: global.phone,
                    // companyNature: '个人'
                }, callback);




                HTTPRequest({
                    url: API.API_QUERY_COMPANY_INFO,
                    params: {
                        busTel: global.phone,
                        // companyNature: '个人'
                    },
                    loading: () => {

                    },
                    success: (responseData) => {
                        console.log('ownerVerifiedState==', responseData.result);
                        let result = responseData.result;
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
                    },
                    error: (errorInfo) => {

                    },
                    finish: () => {
                    }
                });
            }
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={mineHeaderBg} resizeMode={'stretch'} style={{width: width, height: 210}} >
                <View style={styles.titleContainer}>
                    {
                        this.props.currentStatus == 'driver' ? <View style={styles.subTitleContainer}>
                            <TouchableOpacity onPress={()=> {
                                this.props.navigation.dispatch({ type: RouteType.ROUTE_CHOOSE_CAR, params: {
                                    carList: [],
                                    flag: false
                                } })
                            }}>
                                <Text style={{fontSize: 16, color: StaticColor.LIGHT_BLACK_TEXT_COLOR}}>关联车辆</Text>
                            </TouchableOpacity>
                            <Text style={{fontFamily: 'iconfont', fontSize: 16, color: StaticColor.LIGHT_BLACK_TEXT_COLOR}}>&#xe640;</Text>
                        </View> : null
                    }
                </View>
                <View style={styles.headerView}>
                    <View>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                modalVisible: true,
                            }, () => {
                                DeviceEventEmitter.emit('choosePhoto');
                            });
                        }}>
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
                                >{'李雷雷'}</Text>
                                <Text
                                    style={{
                                        marginTop: 5,
                                        marginBottom: 10,
                                        backgroundColor: 'transparent',
                                        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
                                        fontSize: 13
                                    }}>
                                    {'京A23456'}
                                </Text>
                            </View> : <Text style={{
                                marginTop: 10,
                                marginBottom: 20,
                                backgroundColor: 'transparent',
                                color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                fontSize: 17
                            }}>{Validator.newPhone('13321218414')}</Text>
                    }

                </View>
                </ImageBackground>
                <View style={styles.separateView}/>
                <ScrollView>
                {
                    //this.props.currentStatus == 'driver1' ?
                    'driver1' == 'driver' ?
                        <View>
                            <SettingCell
                                style={{height: 36}}
                                leftIconImage={PersonInfoIcon}
                                content={'个人信息'}
                                showBottomLine={true}
                                clickAction={() => {
                                    ClickUtil.resetLastTime();
                                    if (ClickUtil.onMultiClick()) {
                                        if (this.state.verifiedState == '1200') {
                                            navigator.navigate('PersonInfo', {
                                                phone: global.phone,
                                            });
                                        }
                                        if (this.state.verifiedState == '1202') {
                                            this.props.navigation.dispatch({ type: RouteType.ROUTE_DRIVER_VERIFIED_DETAIL, params: {
                                                phone: '15801461058',
                                            } })
                                        }
                                        if (this.state.verifiedState == '1201') {
                                            Alert.alert('提示', '实名认证中');
                                        }
                                        if (this.state.verifiedState == '1203') {
                                            Alert.alert('提示', '实名认证被驳回');
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
                                            // this.props.navigation.dispatch({
                                            //     type: RouteType.ROUTE_CAR_INFO,
                                            //     params: {
                                            //         certificationState: this.state.certificationState,
                                            //     }
                                            // });
                                            // navigator.navigate('CerifiedStatePage', {
                                            //     qualifications: this.state.certificationState,
                                            //     phone: global.phone,
                                            //     plateNumber:global.plateNumber
                                            // })
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
                                        showCertificatesOverdue={true}
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
                                                        phone: 12356234,//global.phone
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
                                        this.props.navigation.dispatch({ type: RouteType.ROUTE_ABOUT_US })
                                    }
                                }}
                            />
                            <SettingCell
                                leftIconImage={aboutUsIcon}
                                content={'司机认证'}
                                clickAction={() => {
                                    if( 1 === 1 ){ // 没有认证 状态
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
                                    }else {
                                        // 认证中、认证通过、认证驳回 状态
                                         this.props.navigation.dispatch({
                                             type: RouteType.ROUTE_DRIVER_VERIFIED_DETAIL,
                                             params:{
                                                 qualifications: this.state.verifiedState,
                                                 phone: 12356234,//global.phone
                                                 }
                                         });

                                    }
                                }}
                            />
                            <SettingCell
                                leftIconImage={aboutUsIcon}
                                content={'个人车主认证'}
                                clickAction={() => {
                                    if (2 === 1){
                                        Storage.get(StorageKey.personownerInfoResult).then((value) => {
                                            if (value) {
                                                this.props.navigation.dispatch({
                                                    type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH ,
                                                    params: {
                                                        resultInfo: value,
                                                    }}
                                                )
                                            } else {
                                                this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH })
                                            }
                                        });
                                    }else {
                                        // 认证详情
                                        this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_OWNER_VERIFIED })

                                    }
                                }}
                            />
                            <SettingCell
                                leftIconImage={aboutUsIcon}
                                content={'企业车主认证'}
                                clickAction={() => {
                                    if (2 === 1){
                                        Storage.get(StorageKey.enterpriseownerInfoResult).then((value) => {
                                            if (value) {
                                                this.props.navigation.dispatch({
                                                    type: RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH ,
                                                    params: {
                                                        resultInfo: value,
                                                    }}
                                                )
                                            } else {
                                                this.props.navigation.dispatch({ type: RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH })
                                            }
                                        });
                                    }else {
                                        // 认证详情
                                        this.props.navigation.dispatch({ type: RouteType.ROUTE_ENTERPRISE_OWNER_VERIFIED_DETAIL })
                                    }
                                }}
                            />
                            <SettingCell
                                leftIconImage={aboutUsIcon}
                                content={'车主增加司机'}
                                clickAction={() => {
                                        Storage.get(StorageKey.carOwnerAddDriverInfo).then((value) => {
                                            if (value) {
                                                this.props.navigation.dispatch({
                                                    type: RouteType.ROUTE_CAR_OWNER_ADD_DRIVER ,
                                                    params: {
                                                        resultInfo: value,
                                                    }}
                                                )
                                            } else {
                                                this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_OWNER_ADD_DRIVER })
                                            }
                                        });

                                }}
                            />
                            <SettingCell
                                leftIconImage={aboutUsIcon}
                                content={'车主增加车辆'}
                                clickAction={() => {
                                    Storage.get(StorageKey.carOwnerAddCarInfo).then((value) => {
                                            if (value) {
                                                this.props.navigation.dispatch({
                                                    type: RouteType.ROUTE_CAR_OWNER_ADD_CAR ,
                                                    params: {
                                                        resultInfo: value,
                                                    }}
                                                )
                                            } else {
                                                this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_OWNER_ADD_CAR })
                                            }
                                        });

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
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(mine);

