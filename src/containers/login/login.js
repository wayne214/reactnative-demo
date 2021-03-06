/**
 * 登录界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    Text,
    View,
    Image,
    StyleSheet,
    TextInput,
    Dimensions,
    Platform,
    Keyboard,
    NativeAppEventEmitter,
    InteractionManager,
    TouchableOpacity,
    ScrollView,
    Alert,
    ImageBackground,
    NativeModules,
    ToastAndroid
} from 'react-native';
import {fetchData, loadUser} from "../../action/app";
import BaseComponent from '../../components/common/baseComponent';
import Toast from '@remobile/react-native-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Button from 'apsl-react-native-button';
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction,
    saveCompanyInfoAction,
    saveUserTypeInfoAction
} from '../../action/user';

import {appendLogToFile} from '../../action/app';

// import * as StaticColor from '../../constants/staticColor';
import LoginBackground from '../../../assets/img/login/loginBg.png';
import * as API from '../../constants/api';

import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import XeEncrypt from '../../utils/XeEncrypt';
// import Validator from '../../utils/validator';
import Regex from '../../utils/regex';
// import {Geolocation} from 'react-native-baidu-map-xzx';
// import JPushModule from 'jpush-react-native';
// import PermissionsAndroid from '../../utils/permissionManagerAndroid';
import * as RouteType from '../../constants/routeType';
import LoginCharacter from '../../utils/loginCharacter';
import DeviceInfo from "react-native-device-info";

let currentTime = 0;
let lastTime = 0;
let locationData = '';
const {width, height} = Dimensions.get('window');
let startTime = 0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImageView: {
        position: 'absolute',
    },
    contentView: {
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        width: width - 30,
        paddingBottom: 10,
        marginTop: 227 * width / 375,
        borderRadius: 4,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowOffset:{h: 10,w: 10},
        shadowRadius: 4,
        shadowOpacity:1,
        alignSelf: 'center'
    },
    cellContainer: {
        flex: 1,
        // height: 44,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        ...Platform.select({
            ios:{
                paddingBottom: 5,
            },
        }),
    },
    textLeft: {
        width: 80,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        paddingLeft: 15,
        ...Platform.select({
            ios:{
                marginTop: 30,
            },
            android: {
                marginTop: 20,
            }
        }),
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        padding: 0,
        paddingRight: 15,
        paddingLeft: 15,
        ...Platform.select({
            ios: {
                marginTop: 8,
            },
            android: {
                marginTop: 3,
            }
        })
    },
    lineUnderInput: {
        height: 2,
        backgroundColor: '#e8e8e8',
        marginLeft: 10,
        marginRight: 10,
    },
    lineUnder: {
        width: 1,
        height: 14,
        backgroundColor: '#666666',
        marginLeft: 10,
        marginRight: 10,
    },
    loginBackground: {
        width: width - 20,
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 0,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0092FF'
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: width - 40,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },
    bottomView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        marginTop: 10,
        paddingHorizontal: 15,
    },
    bottomViewText: {
        fontSize: 15,
        color: '#666666',
    },
    screenEndView: {
        position: 'absolute',
        // flex: 1,
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        // alignItems: 'flex-end',
        height: 35,
        top: height - 50,
        left: 0,
        // marginBottom: 20
    },
    screenEndViewTextLeft: {
        fontSize: 15,
        color: '#999999',
    },
    screenEndViewText: {
        fontSize: 15,
        color: '#0092FF',
    },
});

class Login extends BaseComponent {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            phoneNumber: '',
            password: '',
            loading: false,
        };
        this.getSecretCodeCallback = this.getSecretCodeCallback.bind(this);
        this.loginSucCallback = this.loginSucCallback.bind(this);

        this.loginSecretCode = this.loginSecretCode.bind(this);
        this.login = this.login.bind(this);
        this.quaryAccountRoleCallback = this.quaryAccountRoleCallback.bind(this);
        // this.getCurrentPosition = this.getCurrentPosition.bind(this);

        // this.success = this.success.bind(this);
        // this.fail = this.fail.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);

    }

    componentWillMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide() {
        this.refs.phoneNumber && this.refs.phoneNumber.blur();
        this.refs.password && this.refs.password.blur();
    }

    componentDidMount() {
        console.log('height', height);
        // Toast.showLongCenter('手机厂商:'+DeviceInfo.getBrand());
        // if (Platform.OS === 'ios') {
        //     // this.getCurrentPosition();
        // } else {
        //     PermissionsAndroid.locationPermission().then((data) => {
        //         this.getCurrentPosition();
        //     }, (err) => {
        //         Alert.alert('提示', '请到设置-应用-授权管理设置定位权限');
        //     });
        // }
    }

    // 获取加密秘钥
    loginSecretCode(getSecretCodeCallback) {
        this.props.getSecretCode({}, getSecretCodeCallback);
    }
    // 获取秘钥成功
    getSecretCodeCallback(result) {
        if (result) {
            const secretCode = result;
            const secretPassWord = XeEncrypt.aesEncrypt(this.state.password, secretCode, secretCode);
            this.login(secretPassWord, this.loginSucCallback);
        }

    }

    // 账号密码登录
    login(secretPassWord, loginSucCallback) {
        this.props.login({
            platform: Platform.OS === 'ios' ? 1 : 2,
            deviceId: DeviceInfo.getDeviceId(),
            phoneNum: this.state.phoneNumber,
            password: secretPassWord
        }, loginSucCallback);
    }
    // 登录成功
    loginSucCallback(result) {
        console.log('login_result',result);
        let isBind = result.isBind;
        isBind = true;
        if(isBind){
            const loginUserId = result.userId;
            Storage.save(StorageKey.USER_ID, loginUserId);
            Storage.save(StorageKey.USER_INFO, result);
            Storage.save(StorageKey.CarSuccessFlag, '1'); // 设置车辆的Flag

            // 发送Action,全局赋值用户信息
            this.props.sendLoginSuccessAction(result);
            // this.props.setCurrentCharacterAction('driver')
            // this.props.setCurrentCharacterAction('driver1');
            // this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'Home' , insiteNotice:'123'} })


            this.props.quaryAccountRole(result.phone,this.quaryAccountRoleCallback);

        } else {
            // 跳转到绑定设备页面
            this.props.navigation.dispatch({
                type: RouteType.ROUTE_CHECK_PHONE,
                params: {
                    loginPhone: result.phone,
                    responseData: result,
                    sourcePage: -1,
                }
            })
        }
    }



    quaryAccountRoleCallback(result) {
        console.log("------账号角色信息",result);
        LoginCharacter.setCharacter(this.props,result, 'login');
        this.props.saveUserTypeInfoAction(result);
    }


    render() {
        const {phoneNumber, password} = this.state;
        return (
            <ScrollView
                ref = 'scrollViewLogin'
                style={styles.container}>
                <ImageBackground style={{width: width, height: width * 667 / 375}} source={LoginBackground}>
                <KeyboardAwareScrollView
                    scrollOffset = {50}
                    alwaysBounceVertical={height < 667}
                    automaticallyAdjustContentInsets={false}
                    style={{width: width, height: height}}>
                    <View style={styles.contentView}>
                        <View style={styles.cellContainer}>
                            <Text style={styles.textLeft}>账号</Text>
                            <TextInput
                                ref='phoneNumber'
                                underlineColorAndroid={'transparent'}
                                placeholder="请输入手机号"
                                placeholderTextColor="#cccccc"
                                textAlign="left"
                                keyboardType="numeric"
                                style={styles.textInput}
                                onFocus={()=>{
                                   this.refs.scrollViewLogin.scrollTo({x: 0, y: 100, animated: true})
                                }}
                                onChangeText={(phoneNumber) => {
                                    this.setState({phoneNumber});
                                }}
                                value={phoneNumber}/>
                        </View>

                        <View style={styles.cellContainer}>
                            <Text style={styles.textLeft}>密码</Text>
                            <TextInput
                                ref='password'
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                placeholder="密码"
                                placeholderTextColor="#cccccc"
                                textAlign="left"
                                returnKeyLabel={'done'}
                                returnKeyType={'done'}
                                style={styles.textInput}
                                onChangeText={(password) => {
                                    this.setState({password});
                                }}
                                value={password}/>
                        </View>

                        <View style={{backgroundColor: '#0092FF', marginTop: 20, marginHorizontal: 10, borderRadius: 2}}>
                            <Button
                                ref='button'
                                isDisabled={!(phoneNumber && password)}
                                style={styles.loginButton}
                                textStyle={{color: 'white', fontSize: 18}}
                                onPress={() => {
                                    // dismissKeyboard();
                                    // this.loginSecretCode(this.getSecretCodeCallback);
                                    if (Regex.test('mobile',phoneNumber)) {
                                        this.loginSecretCode(this.getSecretCodeCallback);
                                    } else {
                                        Toast.showShortCenter('手机号码输入有误，请重新输入');
                                    }
                                }}
                            >
                                登录
                            </Button>
                        </View>
                        <View style={styles.bottomView}>
                            <View>
                                <Text
                                    onPress={() => {
                                        this.props.navigation.dispatch({
                                            type: RouteType.ROUTE_FORGET_PASSWORD,
                                            params: { loginPhone: this.state.phoneNumber}})

                                    }}
                                    style={styles.bottomViewText}
                                >
                                    忘记密码
                                </Text>
                            </View>
                            <View>
                                <Text
                                    onPress={() => {
                                        this.props.navigation.dispatch({
                                            type: RouteType.ROUTE_LOGIN_WITH_SMS_PAGE,
                                            params: {loginPhone: this.state.phoneNumber}
                                        })

                                    }}
                                    style={styles.bottomViewText}
                                >
                                    短信验证码登录
                                </Text>
                            </View>
                        </View>
                    </View>


                </KeyboardAwareScrollView>
                <View style={styles.screenEndView}>
                    <Text style={styles.screenEndViewTextLeft}>您还没有账号？</Text>
                    <Text
                        style={styles.screenEndViewText}
                        onPress={() => {
                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_REDISTER_STEP_ONE,
                            })
                        }}
                    >
                        立即注册
                    </Text>
                </View>
                </ImageBackground>
                {/*{*/}
                    {/*this.state.loading ? <Loading/> : null*/}
                {/*}*/}
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        driverStatus: state.user.get('driverStatus'),
        ownerStatus: state.user.get('ownerStatus'),
    };

}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        /*登录成功发送Action，全局保存用户信息*/
        sendLoginSuccessAction: (result) => {
            dispatch(loginSuccessAction(result));
            dispatch(setUserNameAction(result.userName ? result.userName : result.phone))
        },
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
        setCurrentCharacterAction: (result) => {
            dispatch(setCurrentCharacterAction(result));
        },
        setCompanyCodeAction: (result) => {
            dispatch(setCompanyCodeAction(result));
        },
        setOwnerNameAction:(data)=>{
            dispatch(setOwnerNameAction(data));
        },
        getSecretCode: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_GET_SEC_TOKEN,
                success: data => {
                    successCallback(data);
                },
                fail: (error) => {
                    Toast.showShortCenter(error.message);
                }
            }))
        },
        login: (params, successCallback) => {
            startTime = new Date().getTime();
            dispatch(fetchData({
                body: params,
                method: 'POST',
                // showLoading: true,
                api: API.API_LOGIN_WITH_PSD,
                success: data => {
                    successCallback(data);
                    dispatch(loadUser(data));
                    // dispatch(appendLogToFile('登录', '用户登录-承运商登录', startTime))
                },
                fail: (error) => {
                    Toast.showShortCenter(error.message);
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
        },
        saveCompanyInfoAction: (result) => {
            dispatch(saveCompanyInfoAction(result));
        },

        saveUserTypeInfoAction:(result)=>{
          dispatch(saveUserTypeInfoAction(result));
        },

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
