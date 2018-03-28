/**
 * 手机号码验证第一步
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Toast from '@remobile/react-native-toast';
import {Geolocation} from 'react-native-baidu-map-xzx';
import JPushModule from 'jpush-react-native';
import Loading from '../../utils/loading';
import HTTPRequest from '../../utils/httpRequest';
import BlueButtonArc from '../../../assets/button/blueButtonArc.png';
import CheckPhoneLogo from '../../../assets/login/checkPhone.png';

import {
    WHITE_COLOR,
    COLOR_VIEW_BACKGROUND,
} from '../../constants/colors';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';

const {width, height} = Dimensions.get('window');
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction,
} from '../../action/user';
import {fetchData} from "../../action/app";
import * as RouteType from "../../constants/routeType";
import LoginCharacter from "../../utils/loginCharacter";
import DeviceInfo from "react-native-device-info";

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },

});

class CheckPhone extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.state = {
            loading: false,

        };
        this.phoneNo = this.props.navigation.state.params.loginPhone;
        this.sourcePage = this.props.navigation.state.params.sourcePage;
        this.loginData = params.responseData;
        this.nextStep = this.nextStep.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
        this.bindDevice = this.bindDevice.bind(this);
        this.requestVCodeForLoginSucCallBack = this.requestVCodeForLoginSucCallBack.bind(this);
        this.bindDeviceSucCallBack = this.bindDeviceSucCallBack.bind(this);

    }

    componentDidMount() {

        this.getCurrentPosition();
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch(e => {
            console.log(e, 'error');
        });
    }


    // 下一步按钮
    nextStep() {
        if (this.phoneNo) {
            console.log('lqq--sourcePage---', this.sourcePage);
            if (this.sourcePage === 1) {//手机号、验证码登录界面
                //绑定设备
                this.bindDevice(this.bindDeviceSucCallBack);
            } else if (this.sourcePage === -1) {//账号密码登录界面
                //验证手机号
                this.requestVCodeForLogin(this.requestVCodeForLoginSucCallBack);
            }
        } else {
            Toast.showShortCenter('手机号不能为空');
        }
    }

    //todo uuid platform
    /*绑定设备*/
    bindDevice(bindDeviceSucCallBack) {
        this.props.bindDeviceAction({
            identifyCode: this.state.pwdCode,
            phoneNum: this.phoneNo,
            deviceId: DeviceInfo.getDeviceId(),
            platform: '1',
            loginSite: 1
        }, bindDeviceSucCallBack)
    }

    bindDeviceSucCallBack(result) {

        if (result) {
            const loginUserId = this.loginResponseData.result.userId;
            Storage.save(StorageKey.USER_ID, loginUserId);
            Storage.save(StorageKey.USER_INFO, this.loginResponseData.result);
            Storage.save(StorageKey.CarSuccessFlag, '1'); // 设置车辆的Flag

            // 发送Action,全局赋值用户信息
            this.props.sendLoginSuccessAction(this.loginResponseData.result);


            this.props.quaryAccountRole(result.phone,this.quaryAccountRoleCallback);


            if (this.loginResponseData.result.phone) {
                // JPushModule.setAlias(this.loginResponseData.result.phone, () => {
                // }, () => {
                // })
            } else {
                Toast.showShortCenter('输入的验证码不正确');
            }
        }
    }


    /*获取登录验证码*/
    //todo uuid
    requestVCodeForLogin(requestVCodeForLoginSucCallBack) {
        this.props.requestVCodeForLoginAction({
            deviceId: DeviceInfo.getDeviceId(),
            phoneNum: this.phoneNo,
        },requestVCodeForLoginSucCallBack)
    }

    requestVCodeForLoginSucCallBack(){
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_CHECK_PHONE_STEP_TWO,
            params: {
                loginPhone: this.phoneNo,
                responseData: this.loginData
            }
        })
    }

    quaryAccountRoleCallback(result) {
        console.log("------账号角色信息one",result);
        LoginCharacter.setCharacter(this.props,result,'login');
    }

    render() {
        const navigator = this.props.navigation;
        let text = null;
        if (this.sourcePage === 1) {//手机号、验证码登录界面
            text = (<Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: WHITE_COLOR,
                    backgroundColor: '#00000000'
                }}
            >
                立即绑定
            </Text> );
        } else if (this.sourcePage === -1) {//账号密码登录界面
            text = (<Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: WHITE_COLOR,
                    backgroundColor: '#00000000'
                }}
            >
                立即验证
            </Text> );
        }
        return (
            <View style={styles.container}>
                {/*<NavigationBar*/}
                    {/*title={'手机号码验证'}*/}
                    {/*navigator={navigator}*/}
                    {/*hiddenBackIcon={false}*/}
                {/*/>*/}

                <View
                    style={{
                        marginTop: 10,
                    }}
                >
                    <View style={{marginTop: 80, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={CheckPhoneLogo}/>
                    </View>
                    <View style={{
                        marginTop: 15,
                        marginLeft: 30,
                        marginRight: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 18,
                            color: '#666666',
                            textAlign: 'center'
                        }}>由于您在新设备上登录，需要验证您的手机号({Validator.newPhone(this.phoneNo)})</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.nextStep()}>
                    <Image
                        style={{
                            marginTop: 70,
                            width: width - 20,
                            marginLeft: 10,
                            marginRight: 10,
                            marginBottom: 0,
                            height: 44,
                            resizeMode: 'stretch',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        source={BlueButtonArc}
                    >
                        {text}

                    </Image>
                </TouchableOpacity>

                {
                    this.state.loading ? <Loading/> : null
                }
            </View>


        );
    }
}

function mapStateToProps(state) {
    return {};

}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        bindDeviceAction: (params, bindDeviceSucCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_BIND_DEVICE,
                success: data => {
                    bindDeviceSucCallBack(data);
                },
            }))
        },
        requestVCodeForLoginAction: (params,requestVCodeForLoginSucCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_GET_LOGIN_WITH_CODE,
                success: data => {
                    requestVCodeForLoginSucCallBack(data);
                },
            }))
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
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckPhone);

