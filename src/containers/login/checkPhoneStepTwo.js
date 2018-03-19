/**
 * Created by 58416 on 2017/3/21.
 * 忘记密码 通过手机号登录的界面
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

import CountDownButton from '../../components/home/timerButton';
import Loading from '../../utils/loading';
import HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import {
    LIGHT_GRAY_TEXT_COLOR,
    WHITE_COLOR,
    COLOR_VIEW_BACKGROUND,
} from '../../constants/colors';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import clearIcon from '../../../assets/login/forgetdel.png';
import BlueButtonArc from '../../../assets/button/blueButtonArc.png';

const {width, height} = Dimensions.get('window');
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setOwnerNameAction,
    setCompanyCodeAction,
} from '../../action/user';
import {fetchData} from "../../action/app";
import * as RouteType from "../../constants/routeType";
import LoginCharacter from "../../utils/loginCharacter";

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },
    iconStyle: {
        height: 44,
        paddingLeft: 10,
        paddingRight: 15,
        backgroundColor: WHITE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSize: {
        width: 16,
        height: 16,
    },
    textStyle: {
        paddingLeft: 15,
        height: 44,
        fontSize: 16,
        color: '#666666',
    },
    textInputStyle: {
        paddingLeft: 15,
        height: 44,
        fontSize: 16,
        backgroundColor: WHITE_COLOR,
    },
    iconfont: {
        fontFamily: 'iconfont',
        color: LIGHT_GRAY_TEXT_COLOR,
        lineHeight: 20,
        fontSize: 16,
    },
});

class CheckPhoneStepTwo extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.state = {
            pwdCode: '',
            buttonForget: '获取验证码',
            loading: false,

        };
        this.nextStep = this.nextStep.bind(this);
        this.bindDevice = this.bindDevice.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
        this.phoneNo = params.loginPhone;
        this.loginResponseData = params.responseData;
        this.clearPhoneCode = this.clearPhoneCode.bind(this);
        this.bindDeviceSucCallBack = this.bindDeviceSucCallBack.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        console.log('lqq-countDownButton--', this.refs.countDownButton);
        this.refs.countDownButton && this.refs.countDownButton.shouldStartCountting(true);
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

    //todo uuid platform
    /*绑定设备*/
    bindDevice(bindDeviceSucCallBack) {
        this.props.bindDeviceAction({
            identifyCode: this.state.pwdCode,
            phoneNum: this.phoneNo,
            deviceId: '2333-1',
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

    quaryAccountRoleCallback(result) {
        console.log("------账号角色信息two",result);
        LoginCharacter.setCharacter(this.props,result,'login');
    }


    // 下一步按钮
    nextStep() {
        if (this.phoneNo && this.state.pwdCode) {
            this.bindDevice(this.bindDeviceSucCallBack);
        } else {
            Toast.showShortCenter('账号或验证码不能为空');
        }
    }

    // todo uuid
    requestVCodeForLogin(shouldStartCountting) {
        this.props.requestVCodeForLoginAction({
            deviceId: '2333' + '-1',
            phoneNum: this.phoneNo,
        }, shouldStartCountting)
    }


    clearPhoneCode() {
        if (this.state.pwdCode.length > 0) {
            this.setState({
                pwdCode: '',
            });
        }
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                {/*<NavigationBar*/}
                {/*title={'手机号码验证'}*/}
                {/*navigator={navigator}*/}
                {/*hiddenBackIcon={false}*/}
                {/*/>*/}

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 10,
                    }}
                >


                    <View style={{flex: 1}}>
                        <Text
                            style={styles.textStyle}
                        >短信验证码已发送至({Validator.newPhone(this.phoneNo)})，请填写验证码</Text>
                    </View>

                </View>
                <View
                    style={{
                        flexDirection: 'row',

                    }}
                >
                    {false && <View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe634;</Text>

                    </View>
                    }

                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            placeholder="请输入验证码"
                            value={this.state.pwdCode}
                            onChangeText={(pwdCode) => {
                                this.setState({pwdCode});
                            }}
                            returnKeyType='done'

                        />
                    </View>
                    {
                        (() => {
                            if (this.state.pwdCode.length > 0) {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        this.clearPhoneCode()
                                    }}>
                                        <View style={styles.iconStyle}>
                                            <Image source={clearIcon}/>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                    {false && <View style={{width: 1, backgroundColor: COLOR_VIEW_BACKGROUND}}/>}
                    <CountDownButton
                        ref='countDownButton'
                        enable={this.phoneNo.length}
                        style={{width: 100, backgroundColor: WHITE_COLOR, paddingRight: 15}}
                        textStyle={{color: '#0078ff'}}
                        timerCount={60}
                        onClick={(shouldStartCountting) => {
                            if (Validator.isPhoneNumber(this.phoneNo)) {
                                this.requestVCodeForLogin(shouldStartCountting);
                            } else {
                                Toast.showShortCenter('手机号码输入有误，请重新输入');
                                shouldStartCountting(false);
                            }
                        }}
                    />
                </View>

                <TouchableOpacity onPress={() => this.nextStep()}>
                    <Image
                        style={{
                            width: width - 20,
                            marginTop: 15,
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

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: WHITE_COLOR,
                                backgroundColor: '#00000000'
                            }}
                        >
                            提交
                        </Text>

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
        requestVCodeForLoginAction: (params, shouldStartCountting) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_GET_LOGIN_WITH_CODE,
                success: data => {
                    shouldStartCountting(true);
                    Toast.showShortCenter('验证码已发送');
                },
                fail: data => {
                    shouldStartCountting(true);

                }
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckPhoneStepTwo);
