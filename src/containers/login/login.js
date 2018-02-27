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
    ImageBackground
} from 'react-native';
import {fetchData, loadUser} from "../../action/app";
import BaseComponent from '../../components/common/baseComponent';
import Toast from '../../utils/toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Button from 'apsl-react-native-button';
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction
} from '../../action/user';

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

let currentTime = 0;
let lastTime = 0;
let locationData = '';
const {width, height} = Dimensions.get('window');

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
        paddingBottom: 5,
    },
    textLeft: {
        width: 80,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        paddingLeft: 15,
        marginTop: 30,

    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        paddingRight: 15,
        paddingLeft: 15,
        marginTop: 9,
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
        height: 40,
        top: height - 60,
        left: 0,
        // marginBottom: 20
    },
    screenEndViewTextLeft: {
        fontSize: 15,
        color: '#999999',
    },
    screenEndViewText: {
        fontSize: 15,
        color: '#0071FF',
    },
});

class Login extends BaseComponent {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            phoneNumber: '15112345678',
            password: '123456',
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
            deviceId: '1',
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
            this.props.setCurrentCharacterAction('driver')
            // this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'Home' , insiteNotice:'123'} })

            this.props.quaryAccountRole(result.phone,this.quaryAccountRoleCallback);

        } else {
            // 跳转到绑定设备页面
        }
    }



    quaryAccountRoleCallback(result) {
        console.log("------账号角色信息",result);
        LoginCharacter.setCharacter(this.props,result);
        // if (result) {
        //     if (result.length == 0) {
        //         return;
        //     }
        //
            {/*if (result.length == 1) {*/}
                {/*if (result[0].owner == 1) {*/}
        //             // 车主
        //             if (result[0].companyNature == '个人') {
        //                 // 确认个人车主
        //                 if (result[0].status != 10) {
        //                     result[0].certificationStatus == '1201' ?
        //                         this.props.setOwnerCharacterAction('11')
        //                         : result[0].certificationStatus == '1202' ?
        //                         this.props.setOwnerCharacterAction('12') :
        //                         this.props.setOwnerCharacterAction('13')
        //                     this.props.setCurrentCharacterAction('personalOwner');
        //                     this.props.setOwnerNameAction(result[0].name);
        //                 } else {
        //                     Toast.show('个人车主身份被禁用，请联系客服人员');
        //                     return
        //                 }
        //             } else {
                        {/*// 确认企业车主*/}
                        {/*if (result[0].status != 10) {*/}
                            {/*result[0].certificationStatus == '1201' ?*/}
                                {/*this.props.setOwnerCharacterAction('21')*/}
                                {/*: result[0].certificationStatus == '1202' ?*/}
                                {/*this.props.setOwnerCharacterAction('22') :*/}
        //                         this.props.setOwnerCharacterAction('23')
        //                     this.props.setCurrentCharacterAction('businessOwner');
        //                     this.props.setOwnerNameAction(result[0].name);
        //                 } else {
                            {/*Toast.show('企业车主身份被禁用，请联系客服人员');*/}
                            {/*return*/}
                        {/*}*/}
                    {/*}*/}
                    {/*// 保存承运商编码*/}
                    {/*this.props.setCompanyCodeAction(result[0].companyCode);*/}
                {/*}*/}

                {/*if (result[0].owner == 2) {*/}
                    {/*// 司机*/}
                    {/*if (result[0].status != 10) {*/}
                        {/*result[0].certificationStatus == '1201' ?*/}
        //                     this.props.setDriverCharacterAction('1')
        //                     : result[0].certificationStatus == '1202' ?
        //                     this.props.setDriverCharacterAction('2') :
        //                     this.props.setDriverCharacterAction('3')
        //                 this.props.setCurrentCharacterAction('driver')
        //             } else {
        //                 Toast.show('司机身份被禁用，请联系客服人员');
                        {/*return*/}
                    {/*}*/}
                {/*}*/}
            {/*}*/}

            {/*if (result.length == 2) {*/}
        //
        //         if (result[0].owner == 1) {
        //             // 保存承运商编码
                    {/*// this.props.getCompanyCodeAction(responseData.result[0].companyCode);*/}
        //             // 先是车主
        //             if (result[0].companyNature == '个人') {
                        {/*// 确认个人车主*/}
                        {/*if (result[0].status != 10) {*/}
                            {/*result[0].certificationStatus == '1201' ?*/}
                                {/*this.props.setOwnerCharacterAction('11')*/}
                                {/*: result[0].certificationStatus == '1202' ?*/}
        //                         this.props.setOwnerCharacterAction('12') :
        //                         this.props.setOwnerCharacterAction('13')
        //                 } else {
        //                     this.props.setOwnerCharacterAction('14')
        //                 }
        //             } else {
        //                 // 确认企业车主
        //                 if (result[0].status != 10) {
                            {/*result[0].certificationStatus == '1201' ?*/}
                                {/*this.props.setOwnerCharacterAction('21')*/}
                                {/*: result[0].certificationStatus == '1202' ?*/}
                                {/*this.props.setOwnerCharacterAction('22') :*/}
                                {/*this.props.setOwnerCharacterAction('23')*/}
        //                 } else {
        //                     this.props.setOwnerCharacterAction('24')
        //                 }
        //             }
        //
        //             // 后是司机
        //             if (result[1].status != 10) {
                        {/*result[1].certificationStatus == '1201' ?*/}
        //                     this.props.setDriverCharacterAction('1')
        //                     : result[1].certificationStatus == '1202' ?
        //                     this.props.setDriverCharacterAction('2') :
        //                     this.props.setDriverCharacterAction('3')
        //             } else {
                        {/*this.props.setDriverCharacterAction('4')*/}
                    {/*}*/}

        //             if (result[0].status == 10 && result[1].status == 10) {
        //                 Toast.show('司机车主身份均被禁用，请联系客服人员')
        //                 return
        //             }
        //             if (result[0].status == 10) {
        //                 this.props.setCurrentCharacterAction('driver');
        //             }
        //
        //             if (result[1].status == 10) {
        //                 if (result[0].companyNature == '个人') {
        //                     this.props.setCurrentCharacterAction('personalOwner');
                            {/*this.props.setOwnerNameAction(result[0].name);*/}
                        {/*} else {*/}
        //                     this.props.setCurrentCharacterAction('businessOwner');
        //                     this.props.setOwnerNameAction(result[0].name);
        //                 }
                    {/*} else {*/}
        //                 this.props.setCurrentCharacterAction('driver');
        //                 this.props.setOwnerNameAction(result[0].name);
        //                 this.props.setCompanyCodeAction(result[0].companyCode);
        //             }
        //         }
        //
        //         if (result[0].owner == 2) {
                    {/*// 先是司机*/}
                    {/*if (result[0].status != 10) {*/}
                        {/*result[0].certificationStatus == '1201' ?*/}
                            {/*this.props.setDriverCharacterAction('1')*/}
                            {/*: result[0].certificationStatus == '1202' ?*/}
                            {/*this.props.setDriverCharacterAction('2') :*/}
                            {/*this.props.setDriverCharacterAction('3')*/}
                    {/*} else {*/}
                        {/*this.props.setDriverCharacterAction('4')*/}
        //             }
        //
                    {/*// 后是车主*/}
        //             if (result[1].companyNature == '个人') {
        //
        //                 // 确认个人车主
        //                 if (result[1].status != 10) {
        //                     result[1].certificationStatus == '1201' ?
        //                         this.props.setOwnerCharacterAction('11')
        //                         : result[1].certificationStatus == '1202' ?
        //                         this.props.setOwnerCharacterAction('12') :
        //                         this.props.setOwnerCharacterAction('13')
                        {/*} else {*/}
        //                     this.props.setOwnerCharacterAction('14')
                        {/*}*/}
                    {/*} else {*/}

                        {/*// 确认企业车主*/}
                        {/*if (result[1].status != 10) {*/}
                            {/*result[1].certificationStatus == '1201' ?*/}
        //                         this.props.setOwnerCharacterAction('21')
        //                         : result[1].certificationStatus == '1202' ?
        //                         this.props.setOwnerCharacterAction('22') :
        //                         this.props.setOwnerCharacterAction('23')
                        {/*} else {*/}
        //                     this.props.setOwnerCharacterAction('24')
        //                 }
                    {/*}*/}


        //             if (result[0].status == 10 && result[1].status == 10) {
        //                 Toast.show('司机车主身份均被禁用，请联系客服人员')
        //                 return
        //             }
        //             if (result[1].status == 10) {
        //                 this.props.setCurrentCharacterAction('driver');
        //             }
        //
        //             if (result[0].status == 10) {
        //                 if (result[0].companyNature == '个人') {
        //                     this.props.setOwnerNameAction(result[1].name);
        //                     this.props.setCurrentCharacterAction('personalOwner');
        //                 } else {
        //                     this.props.setOwnerNameAction(result[1].name);
        //                     this.props.setCurrentCharacterAction('businessOwner');
        //                 }
        //             } else {
        //                 this.props.setCurrentCharacterAction('driver');
        //                 this.props.setOwnerNameAction(result[1].name);
        //                 this.props.setCompanyCodeAction(result[1].companyCode);
        //             }
        //
        //         }
        //     }
        //
        //     this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'route' , insiteNotice:'123'} })
        // }

    }


    render() {
        const {phoneNumber, password} = this.state;
        return (
            <View style={styles.container}>
                <ImageBackground style={{width: width, height: height}} source={LoginBackground}>
                <KeyboardAwareScrollView
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

                        <View style={{backgroundColor: '#0092FF', marginTop: 20, marginHorizontal: 10, borderRadius: 5}}>
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
                                        Toast.show('手机号码输入有误，请重新输入');
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
            </View>
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
            }))
        },
        login: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                // showLoading: true,
                api: API.API_LOGIN_WITH_PSD,
                success: data => {
                    successCallback(data);
                    dispatch(loadUser(data));
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
