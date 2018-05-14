import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    Image,
    TextInput
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import Button from 'apsl-react-native-button';
import phonePicture from '../../../assets/img/login/phonePicture.png'
import Toast from "@remobile/react-native-toast";
import Regex from "../../utils/regex";
import CountDownButton from '../../components/common/timerButton';
import * as StaticColor from "../../constants/colors";
import * as RouteType from "../../constants/routeType";
import {fetchData, getHomePageCountAction} from "../../action/app";
import DeviceInfo from "react-native-device-info";
import * as API from '../../constants/api';
import {
    refreshDriverOrderList
} from '../../action/driverOrder';
import JPushModule from 'jpush-react-native';
import {
    clearUser,
} from '../../action/user';
import Validator from '../../utils/validator';


const {width, height} = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loginButton: {
        backgroundColor: '#0092FF',
        width: width - 40,
        marginLeft: 20,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#0092FF',
        marginTop: 55,
        borderRadius: 0,
    },
    inputViewStyle: {
        width,
        height: 44,
        alignItems:'center',
        flexDirection: 'row',
        backgroundColor:'#FFFFFF',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
        paddingLeft:10,

    },

});

class changePhoneNoStepTwo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            smsCode: '',
        };
        this.getIdentfiCode = this.getIdentfiCode.bind(this);
        this.sendVCodeCallback = this.sendVCodeCallback.bind(this);
        this.sendFailCallback = this.sendFailCallback.bind(this);

        this.fixPhone = this.fixPhone.bind(this);
        this.loginOut = this.loginOut.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            tabBarLabel: '更换手机号码',
            header: <NavigatorBar title='更换手机号码' hiddenBackIcon={false} router={navigation}/>,
        }
    };

    componentDidMount() {


    }

    componentWillUnmount() {

    }
    sendVCodeCallback(shouldStartCountting) {
        shouldStartCountting(true);
    }
    sendFailCallback(shouldStartCountting) {
        shouldStartCountting(false);
    }
    /*获取登录验证码*/
    getIdentfiCode(sendVCodeCallback, sendFailCallback) {
        this.props.getIdentfiCode({
            deviceId: DeviceInfo.getDeviceId(),
            phoneNum: this.state.phoneNumber
        }, sendVCodeCallback, sendFailCallback);
    }
    // 修改成功后退出登录
    loginOut() {
        this.props.getHomoPageCountAction({});
        console.log('homePageState=',this.props.homePageState);
        this.props.loginOut({});
        this.props._refreshOrderList(0);
        this.props._refreshOrderList(1);
        this.props._refreshOrderList(2);
        this.props._refreshOrderList(3);
        this.props.removeUserInfoAction();
        // ImageCache.get().clear();

        // 清空存储数据
        // Storage.clear();
        JPushModule.setAlias('', ()=>{}, ()=>{});
        this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE, mode: 'reset', params: { title: '' } })

    }

    fixPhone() {
        if (!Validator.isInteger(this.state.phoneNumber)) {
            return Toast.showShortCenter('请输入正确手机号');
        }
        if (!Validator.isInteger(this.state.smsCode)) {
            return Toast.showShortCenter('请输入正确验证码');
        }
        this.props.updateNewPhone({
            deviceId: DeviceInfo.getDeviceId(),
            loginName: global.userName,
            mobilePhone: global.phone,
            updateMobilePhone: this.state.phoneNumber,
            verificationCode: this.state.smsCode
        }, (result)=> {
            if(result) {
                Toast.showShortCenter('修改成功');
                this.loginOut();
            }
        }, ()=> {
            this.setState({
                smsCode: ''
            })
        })
    }
    render() {
        const {phoneNumber, smsCode} = this.state;
        return (
            <View style={styles.container}>

                <View style={{
                    height: 44,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor:'#FFFFFF',
                    paddingLeft:10,
                    marginTop:10,
                }}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#666666',
                            width:90,
                        }}>手机号码</Text>
                    <TextInput
                        style={{
                            fontSize:14,
                            width:width-120,
                            color:'#333333'
                        }}
                        placeholderTextColor="#cccccc"
                        underlineColorAndroid={'transparent'}
                        placeholder="请输入新的手机号码"
                        onChangeText={(phoneNumber) => {
                            const newText = phoneNumber.replace(/[^\d]+/, '');
                            this.setState({phoneNumber: newText});
                        }}
                        keyboardType="numeric"
                        value={phoneNumber}
                        maxLength={11}
                    />
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: '#E8E8E8',
                    marginLeft:10,
                    marginRight:10,
                }}/>
                <View style={styles.inputViewStyle}>
                    <Text style={{
                        color:'#666666',
                        fontSize:14,
                        width:90,
                    }}>
                        短信验证码
                    </Text>

                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={{width:width-200,
                        fontSize:14,
                            color:'#333333'
                        }}
                        value={this.state.smsCode}
                        onChangeText={(smsCode) => {
                            const newText = smsCode.replace(/[^\d]+/, '');
                            this.setState({smsCode: newText});
                        }}
                        placeholder="请输入验证码"
                        keyboardType="numeric"
                        placeholderTextColor="#cccccc"
                        textAlign="left"
                        returnKeyType='done'
                        maxLength={4}/>

                    <CountDownButton
                        enable={phoneNumber.length}
                        style={{width: 90,}}
                        textStyle={{color: '#FFFFFF'}}
                        timerCount={60}
                        onClick={(shouldStartCountting) => {
                            if (Regex.test('mobile', phoneNumber)) {
                                this.props.checkNewPhoneIsRegister({
                                    phone: this.state.phoneNumber
                                }, (result)=> {
                                    if (result) {
                                        shouldStartCountting(false);
                                        Toast.showShortCenter('该手机号已经注册了');
                                    } else {
                                        this.getIdentfiCode(this.sendVCodeCallback(shouldStartCountting), this.sendFailCallback(shouldStartCountting));
                                    }
                                })
                            } else {
                                Toast.show('手机号输入有误，请重新输入');
                                shouldStartCountting(false);
                            }
                        }}
                    />
                </View>
                <Button
                    isDisabled={!((phoneNumber && phoneNumber.length > 10)  && (smsCode && smsCode.length > 3))}
                    style={styles.loginButton}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {
                        this.fixPhone();
                    }}
                >
                    确定
                </Button>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        checkNewPhoneIsRegister: (params, callback) => {
            dispatch(fetchData({
                api: API.API_CHECK_PHONE_REGISTER + params.phone,
                body: params,
                method: 'POST',
                success: (data) => {
                    callback(data)
                },
                fail: (error) => {
                    // console.log(error);
                }
            }))
        },
        getIdentfiCode: (params, succCallback, failCallback) => {
            dispatch(fetchData({
                api: API.API_FIX_PHONE_SEND_VERIFICATION,
                body: params,
                method: 'POST',
                success: (data) => {
                    succCallback(data)
                },
                fail: (error) => {
                    failCallback();
                    // console.log(error);
                }
            }))
        },
        updateNewPhone: (params, callback, failCallback) => {
            dispatch(fetchData({
                api: API.API_MODIFY_USER_MOBILE_PHONE,
                body: params,
                method: 'POST',
                success: (data) => {
                    callback(data)
                },
                fail: (error) => {
                    failCallback()
                    Toast.showShortCenter(error.message);
                }
            }))
        },
        loginOut: (params) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_USER_LOGOUT + global.phone,
                success: data => {
                },
                fail: error => {
                }
            }))
        },
        getHomoPageCountAction: (response) => {
            dispatch(getHomePageCountAction(response));
        },
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        },
        removeUserInfoAction:()=>{
            dispatch(clearUser());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(changePhoneNoStepTwo);
