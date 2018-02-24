/**
 * Created by xizhixin on 2017/9/25.
 * 验证码登录界面
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
    Keyboard,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
import {fetchData, loadUser} from "../../action/app";
import LoginHeader from '../../../assets/img/login/loginHeader.png';
import Button from 'apsl-react-native-button';
import Toast from '../../utils/toast';
// import JPushModule from 'jpush-react-native';
// import {Geolocation} from 'react-native-baidu-map-xzx';
import { NavigationActions } from 'react-navigation';
import BaseComponent from '../../components/common/baseComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import CountDownButton from '../../components/common/timerButton';
// import StaticImage from '../../constants/staticImage';
import * as StaticColor from '../../constants/colors';
import * as API from '../../constants/api';
import Regex from '../../utils/regex';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
// import Validator from '../../utils/validator';
// import ClickUtil from '../../utils/prventMultiClickUtil';
// import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction
} from '../../action/user';
// import PermissionsAndroid from '../../utils/permissionManagerAndroid';
import * as RouteType from '../../constants/routeType'

const {width, height} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentView: {
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        width: width - 30,
        top: 220 * width / 375,
        // left: 10,
        position: 'absolute',
        borderRadius: 4,
        shadowColor: 'rgba(0,0,0,0.20)',
        shadowOffset:{h: 10,w: 10},
        shadowRadius: 4,
        shadowOpacity:1,
        alignSelf: 'center',
        paddingBottom: 10,
    },
    leftText: {
        paddingLeft: 15,
        justifyContent: 'center',
        marginTop: 30,
    },
    leftTextString: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 16,
        alignItems: 'center',
    },
    cellContainer: {
        flex: 1,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom: 5,
    },
    cellContainer2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom: 5,
    },
    phoneNumView: {
        marginLeft: 10,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInputStyle: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        alignItems: 'center',
        paddingLeft: 15,
        marginTop: 9,
    },
    separateLine: {
        height: 0.5,
        width,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
    },
    smsCodeView: {
        marginLeft: 10,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    smsCodeButton: {
        width: 125,
        borderWidth: 0,
    },
    loginBackground: {
        width: width - 20,
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 0,
        height: 44,
        resizeMode: 'stretch',
        alignItems: 'center',
        justifyContent:'center'
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: width - 40,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },
    clearButton: {
        width: 15,
        height: 15,
        marginRight: 15,
        marginLeft: 10,
    },
    bottomView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        paddingHorizontal: 15,
        marginTop: 10,
    },
    bottomViewText: {
        fontSize: 15,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        alignItems: 'center',

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
        color: StaticColor.GRAY_TEXT_COLOR,
    },
    screenEndViewText: {
        fontSize: 15,
        color: StaticColor.BLUE_CONTACT_COLOR,
    },
});


class LoginSms extends BaseComponent {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            phoneNumber: params ? params.loginPhone : '',
            smsCode: '',
            loading: false,
        };
        this.clearPhoneNum = this.clearPhoneNum.bind(this);
        this.clearSmsCodeNum = this.clearSmsCodeNum.bind(this);
        this.login = this.login.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
        this.login = this.login.bind(this);
        this.loginSucCallback = this.loginSucCallback.bind(this);
        this.sendVCodeCallback = this.sendVCodeCallback.bind(this);
        this.sendFailCallback = this.sendFailCallback.bind(this);
    }

    componentWillMount () {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide(){
        this.refs.phoneNumber && this.refs.phoneNumber.blur();
        this.refs.smsCode && this.refs.smsCode.blur();
    }

    componentDidMount() {
        // if(Platform.OS === 'ios'){
        //     // this.getCurrentPosition();
        // }else {
        //     PermissionsAndroid.locationPermission().then((data) => {
        //         this.getCurrentPosition();
        //     }, (err) => {
        //         Alert.alert('提示','请到设置-应用-授权管理设置定位权限');
        //     });
        // }
    }

    // 获取当前位置
    // getCurrentPosition() {
    //     Geolocation.getCurrentPosition().then(data => {
    //         console.log('position =',JSON.stringify(data));
    //         locationData = data;
    //     }).catch(e =>{
    //         console.log(e, 'error');
    //     });
    // }
    sendVCodeCallback(shouldStartCountting) {
        shouldStartCountting(true);
    }
    sendFailCallback(shouldStartCountting) {
        shouldStartCountting(false);
    }
    /*获取登录验证码*/
    requestVCodeForLogin(sendVCodeCallback, sendFailCallback) {
        this.props._getVCodeCode({
            deviceId: '1',
            phoneNum: this.state.phoneNumber
        }, sendVCodeCallback, sendFailCallback);
    }
    clearPhoneNum() {
        this.setState({
            phoneNumber: '',
        });
    }

    clearSmsCodeNum() {
        this.setState({
            smsCode: '',
        });
    }
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

            this.props.quaryAccountRole({},this.quaryAccountRoleCallback);

        } else {
            // 跳转到绑定设备页面
        }
    }
    /*验证码登录*/
    login(loginSucCallback) {
        this.props._login({
            platform: Platform.OS === 'ios' ? 1 : 2,
            deviceId: '11111111',
            phoneNum: this.state.phoneNumber,
            identifyCode: this.state.smsCode,
            loginSite: "2",
        }, loginSucCallback);
    }

    quaryAccountRoleCallback(result) {
        console.log("------账号角色信息",result);
        if (result) {
            if (result.length == 0) {
                return;
            }

            if (result.length == 1) {
                if (result[0].owner == 1) {
                    // 车主
                    if (result[0].companyNature == '个人') {
                        // 确认个人车主
                        if (result[0].status != 10) {
                            result[0].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('11')
                                : result[0].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('12') :
                                this.props.setOwnerCharacterAction('13')
                            this.props.setCurrentCharacterAction('personalOwner');
                            this.props.setOwnerNameAction(result[0].name);
                        } else {
                            Toast.show('个人车主身份被禁用，请联系客服人员');
                            return
                        }
                    } else {
                        // 确认企业车主
                        if (result[0].status != 10) {
                            result[0].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('21')
                                : result[0].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('22') :
                                this.props.setOwnerCharacterAction('23')
                            this.props.setCurrentCharacterAction('businessOwner');
                            this.props.setOwnerNameAction(result[0].name);
                        } else {
                            Toast.show('企业车主身份被禁用，请联系客服人员');
                            return
                        }
                    }
                    // 保存承运商编码
                    this.props.setCompanyCodeAction(result[0].companyCode);
                }

                if (result[0].owner == 2) {
                    // 司机
                    if (result[0].status != 10) {
                        result[0].certificationStatus == '1201' ?
                            this.props.setDriverCharacterAction('1')
                            : result[0].certificationStatus == '1202' ?
                            this.props.setDriverCharacterAction('2') :
                            this.props.setDriverCharacterAction('3')
                        this.props.setCurrentCharacterAction('driver')
                    } else {
                        Toast.show('司机身份被禁用，请联系客服人员');
                        return
                    }
                }
            }

            if (result.length == 2) {

                if (result[0].owner == 1) {
                    // 保存承运商编码
                    // this.props.getCompanyCodeAction(responseData.result[0].companyCode);
                    // 先是车主
                    if (result[0].companyNature == '个人') {
                        // 确认个人车主
                        if (result[0].status != 10) {
                            result[0].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('11')
                                : result[0].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('12') :
                                this.props.setOwnerCharacterAction('13')
                        } else {
                            this.props.setOwnerCharacterAction('14')
                        }
                    } else {
                        // 确认企业车主
                        if (result[0].status != 10) {
                            result[0].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('21')
                                : result[0].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('22') :
                                this.props.setOwnerCharacterAction('23')
                        } else {
                            this.props.setOwnerCharacterAction('24')
                        }
                    }

                    // 后是司机
                    if (result[1].status != 10) {
                        result[1].certificationStatus == '1201' ?
                            this.props.setDriverCharacterAction('1')
                            : result[1].certificationStatus == '1202' ?
                            this.props.setDriverCharacterAction('2') :
                            this.props.setDriverCharacterAction('3')
                    } else {
                        this.props.setDriverCharacterAction('4')
                    }

                    if (result[0].status == 10 && result[1].status == 10) {
                        Toast.show('司机车主身份均被禁用，请联系客服人员')
                        return
                    }
                    if (result[0].status == 10) {
                        this.props.setCurrentCharacterAction('driver');
                    }

                    if (result[1].status == 10) {
                        if (result[0].companyNature == '个人') {
                            this.props.setCurrentCharacterAction('personalOwner');
                            this.props.setOwnerNameAction(result[0].name);
                        } else {
                            this.props.setCurrentCharacterAction('businessOwner');
                            this.props.setOwnerNameAction(result[0].name);
                        }
                    } else {
                        this.props.setCurrentCharacterAction('driver');
                        this.props.setOwnerNameAction(result[0].name);
                        this.props.setCompanyCodeAction(result[0].companyCode);
                    }
                }

                if (result[0].owner == 2) {
                    // 先是司机
                    if (result[0].status != 10) {
                        result[0].certificationStatus == '1201' ?
                            this.props.setDriverCharacterAction('1')
                            : result[0].certificationStatus == '1202' ?
                            this.props.setDriverCharacterAction('2') :
                            this.props.setDriverCharacterAction('3')
                    } else {
                        this.props.setDriverCharacterAction('4')
                    }

                    // 后是车主
                    if (result[1].companyNature == '个人') {

                        // 确认个人车主
                        if (result[1].status != 10) {
                            result[1].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('11')
                                : result[1].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('12') :
                                this.props.setOwnerCharacterAction('13')
                        } else {
                            this.props.setOwnerCharacterAction('14')
                        }
                    } else {

                        // 确认企业车主
                        if (result[1].status != 10) {
                            result[1].certificationStatus == '1201' ?
                                this.props.setOwnerCharacterAction('21')
                                : result[1].certificationStatus == '1202' ?
                                this.props.setOwnerCharacterAction('22') :
                                this.props.setOwnerCharacterAction('23')
                        } else {
                            this.props.setOwnerCharacterAction('24')
                        }
                    }


                    if (result[0].status == 10 && result[1].status == 10) {
                        Toast.show('司机车主身份均被禁用，请联系客服人员')
                        return
                    }
                    if (result[1].status == 10) {
                        this.props.setCurrentCharacterAction('driver');
                    }

                    if (result[0].status == 10) {
                        if (result[0].companyNature == '个人') {
                            this.props.setOwnerNameAction(result[1].name);
                            this.props.setCurrentCharacterAction('personalOwner');
                        } else {
                            this.props.setOwnerNameAction(result[1].name);
                            this.props.setCurrentCharacterAction('businessOwner');
                        }
                    } else {
                        this.props.setCurrentCharacterAction('driver');
                        this.props.setOwnerNameAction(result[1].name);
                        this.props.setCompanyCodeAction(result[1].companyCode);
                    }

                }
            }

            this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'route' , insiteNotice:'123'} })
        }

    }

    render() {
        const {phoneNumber, smsCode} = this.state;
        // console.log('lqq-render--smsCode--',smsCode);
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView style={{width: width, height: height}}>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            source={LoginHeader}
                            resizeMode={'stretch'}
                            style={{width: width, height: width * 272 / 375}}
                        />
                        
                    </View>
                    <View style={styles.contentView}>
                        <View style={styles.cellContainer}>
                            <View style={styles.leftText}>
                                <Text style={styles.leftTextString}>
                                    手机号
                                </Text>
                            </View>
                            <TextInput
                                ref='phoneNumber'
                                underlineColorAndroid={'transparent'}
                                style={styles.textInputStyle}
                                value={phoneNumber}
                                onChangeText={(phoneNumber) => {
                                    this.setState({phoneNumber});
                                }}
                                keyboardType="numeric"
                                placeholder="请输入手机号"
                                placeholderTextColor="#cccccc"
                                textAlign="left"/>
                            {/*{*/}
                                {/*(() => {*/}
                                    {/*if (phoneNumber.length > 0) {*/}
                                        {/*return (*/}
                                            {/*<TouchableOpacity*/}
                                                {/*onPress={() => {*/}
                                                    {/*this.clearPhoneNum();*/}
                                                {/*}}*/}
                                                {/*activeOpacity={0.8}*/}
                                            {/*>*/}
                                                {/*<Image*/}
                                                    {/*source={StaticImage.clearIcon}*/}
                                                    {/*style={styles.clearButton}*/}
                                                {/*/>*/}
                                            {/*</TouchableOpacity>*/}
                                        {/*);*/}
                                    {/*}*/}
                                {/*})()*/}
                            {/*}*/}
                        </View>
                        <View style={styles.cellContainer2}>
                            <View>
                                <View style={styles.leftText}>
                                    <Text style={styles.leftTextString}>
                                        验证码
                                    </Text>
                                </View>
                                <TextInput
                                    ref='smsCode'
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInputStyle}
                                    value={this.state.smsCode}
                                    onChangeText={(smsCode) => {
                                        this.setState({smsCode});
                                    }}
                                    placeholder="请输入验证码"
                                    keyboardType="numeric"
                                    placeholderTextColor="#cccccc"
                                    textAlign="left"
                                    returnKeyType='done'/>
                            </View>
                            {/*{*/}
                                {/*(() => {*/}
                                    {/*if (smsCode.length > 0) {*/}
                                        {/*return (*/}
                                            {/*<TouchableOpacity*/}
                                                {/*onPress={() => {*/}
                                                    {/*this.clearSmsCodeNum();*/}
                                                {/*}}*/}
                                                {/*activeOpacity={0.8}*/}
                                            {/*>*/}
                                                {/*<Image*/}
                                                    {/*source={StaticImage.clearIcon}*/}
                                                    {/*style={styles.clearButton}*/}
                                                {/*/>*/}
                                            {/*</TouchableOpacity>*/}
                                        {/*);*/}
                                    {/*}*/}
                                {/*})()*/}
                            {/*}*/}

                            <CountDownButton
                                enable={phoneNumber.length}
                                style={{width: 100, marginTop: 40}}
                                textStyle={{color: '#FFFFFF'}}
                                timerCount={60}
                                onClick={(shouldStartCountting) => {
                                    if (Regex.test('mobile', phoneNumber)) {
                                        this.requestVCodeForLogin(this.sendVCodeCallback(shouldStartCountting), this.sendFailCallback(shouldStartCountting));
                                    } else {
                                        Toast.show('手机号输入有误，请重新输入');
                                        shouldStartCountting(false);
                                    }
                                }}
                            />
                        </View>
                        <View style={{backgroundColor: '#0092FF', marginTop: 20, marginHorizontal: 10, borderRadius: 5}} >
                            <Button
                                isDisabled={!(phoneNumber && smsCode)}
                                style={styles.loginButton}
                                textStyle={{color: 'white', fontSize: 18}}
                                onPress={() => {
                                    // if (ClickUtil.onMultiClick()) {
                                    //     this.setState({
                                    //         smsCode:'',
                                    //     });
                                    //     this.login();
                                    //
                                    // }
                                    this.login(this.loginSucCallback);
                                }}
                            >
                                登录
                            </Button>
                        </View>
                        <View style={styles.bottomView}>
                            <View>
                                <Text
                                    onPress={() => {
                                        this.props.navigation.navigate('ForgetPwd', {
                                            loginPhone: this.state.phoneNumber
                                        });

                                    }}
                                    style={styles.bottomViewText}
                                >
                                    忘记密码
                                </Text>
                            </View>
                            <Text
                                onPress={() => {
                                    this.props.navigation.dispatch({
                                        type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE,
                                        params: {loginPhone: this.state.phoneNumber}
                                    })

                                }}
                                style={styles.bottomViewText}
                            >
                                账号登录
                            </Text>
                        </View>
                    </View>
                   
                      
                  </KeyboardAwareScrollView> 
                  <View style={styles.screenEndView}>
                            <Text style={styles.screenEndViewTextLeft}>您还没有账号？</Text>
                            <Text
                                style={styles.screenEndViewText}
                                onPress={() => {
                                    this.props.navigation.navigate('RegisterStepOne');
                                }}
                            >
                                去注册
                            </Text>
                    </View>        
                {/*{*/}
                    {/*this.state.loading ? <Loading /> : null*/}
                {/*}*/}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        driverStatus:state.user.get('driverStatus'),
        ownerStatus:state.user.get('ownerStatus'),
    };

}

function mapDispatchToProps(dispatch) {
    return {
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
        _getVCodeCode: (params, successCallback, failCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.GET_LOGIN_IDENETIFY_CODE,
                success: data => {
                    console.log('-------data', data);
                    successCallback();
                },
                fail: error => {
                    console.log('-------error', error);
                    failCallback();
                }
            }))
        },
        _login: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.LOGIN_WITH_VCODE,
                success: data => {
                    console.log('-------data', data);
                    successCallback(data);
                },
                fail: error => {
                    console.log('-------error', error);
                }
            }))
        },
        quaryAccountRole: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_INQUIRE_ACCOUNT_ROLE + '15112345678',
                success: data => {
                    successCallback(data);
                },
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginSms);
