/**
 * 注册第一步
 * 注册界面
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TextInput,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import Button from 'apsl-react-native-button';
import Toast from '../../utils/toast';
import {Geolocation} from 'react-native-baidu-map-xzx';
import Loading from '../../utils/loading';
import NavigatorBar from '../../components/common/navigatorbar';
import CountDownButton from '../../components/home/timerButton';
import PermissionsAndroid from '../../utils/permissionManagerAndroid';
import CheckBox from '../../utils/checkBox/checkbox';

import BlueButtonArc from '../../../assets/button/blueButtonArc.png';
import {
    COLOR_VIEW_BACKGROUND,
    WHITE_COLOR,
    BLACK_COLOR,
    DEVIDE_LINE_COLOR,
    GRAY_TEXT_COLOR,
    BLUE_CONTACT_COLOR,
} from '../../constants/colors';
import * as API from '../../constants/api';
import Validator from '../../utils/validator';
import {
    loginSuccessAction, setCompanyCodeAction, setCurrentCharacterAction, setDriverCharacterAction,
    setOwnerCharacterAction,
    setOwnerNameAction,
    setUserNameAction
} from "../../action/user";
import {fetchData, loadUser} from "../../action/app";
import {registeredIdentityCodeAction} from "../../action/register";
import {connect} from "react-redux";
import * as RouteType from "../../constants/routeType";

let currentTime = 0;
let lastTime = 0;
let locationData = '';


const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },
    registeredTitle: {
        fontSize: 20,
        color: WHITE_COLOR,
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        marginTop: 18
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    codeInput: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    verticalLine: {
        height: 45,
        width: 1,
        backgroundColor: DEVIDE_LINE_COLOR
    },
    registered: {
        width: 85,
        fontSize: 15,
        color: '#666666',
        alignItems: 'center',
        marginLeft: 10,
    },
    registeredTextInput: {
        fontSize: 15,
        color: BLACK_COLOR,
        alignItems: 'center',
        marginLeft: 10,
        width:width-100
    },
    registeredCodeTextInput: {
        flex: 1,
        height: 45,
        fontSize: 15,
        color: BLACK_COLOR,
        alignItems: 'center',
        marginLeft: 10,
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
        justifyContent: 'center'
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: width - 20,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },
    loginButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: COLOR_VIEW_BACKGROUND,
    },
    screenEndView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: width,
        marginTop: 20,

    },
    screenEndViewTextLeft: {
        fontSize: 15,
        color: GRAY_TEXT_COLOR,
    },
    screenEndViewText: {
        fontSize: 15,
        color: BLUE_CONTACT_COLOR,
    },
    separateLine: {
        height: 1,
        width,
        marginLeft: 15,
        backgroundColor: DEVIDE_LINE_COLOR,
    },
});

class RegisterStepOne extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phoneNum: '',
            againPWD: '',
            messageCode: '',
            loading: false,
            checkBox: false,
        };

        this.registerAccount = this.registerAccount.bind(this);
        this.registeredIdentityCode = this.registeredIdentityCode.bind(this);
        this.registerAccountSucCallBack = this.registerAccountSucCallBack.bind(this);
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            // this.getCurrentPosition();
        } else {
            PermissionsAndroid.locationPermission().then((data) => {
                this.getCurrentPosition();
            }, (err) => {
                Alert.alert('提示', '请到设置-应用-授权管理设置定位权限');
            });
        }
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

    /*获取注册验证码*/
    registeredIdentityCode(shouldStartCountting) {
        //todo uuid
        this.props.registeredIdentityCodeAction({
            deviceId: '2333-1',
            phoneNum: this.state.phoneNum,
        }, shouldStartCountting);
    }

    /*注册*/
    registerAccount(phoneNum,messageCode,againPWD) {
        if (!this.state.checkBox) {
            Toast.show("请阅读并同意《冷链马甲服务协议》");
            return;
        }

        this.props.registeredAction({
            confirmPassword: againPWD,
            identifyCode: messageCode,
            password: againPWD,
            phoneNum: phoneNum
        },this.registerAccountSucCallBack)

    }

    registerAccountSucCallBack(){
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE,
            mode: 'reset',
        })
    }

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation
        return {
            header: <NavigatorBar
                title='注册'
                hiddenBackIcon={false}
                router={navigation}/>,
        }
    };

    render() {
        const navigator = this.props.navigation;
        const {phoneNum, messageCode, againPWD} = this.state;
        return (
            <View style={{flex: 1,
                backgroundColor: '#FFFFFF',}}>

                <View style={{width: width, height: height}}>

                    <Text
                        style={{
                            marginLeft: 10,
                            marginTop: 42,
                            fontSize: 21,
                            color: '#333333',
                        }}>手机注册</Text>
                    <View style={{backgroundColor: WHITE_COLOR, marginTop: 40}}>
                        <View style={{
                            width,
                            height: 45,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={styles.registered}>手机号码</Text>
                            <TextInput
                                underlineColorAndroid={'transparent'}
                                placeholder="请输入手机号"
                                placeholderTextColor="#cccccc"
                                keyboardType="numeric"
                                style={styles.registeredTextInput}
                                value={phoneNum}
                                onChangeText={(phoneNum) => {
                                    this.setState({phoneNum});
                                }}
                            />
                        </View>

                        <View style={styles.separateLine}/>

                        <View style={{
                            width,
                            height: 45,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={styles.registered}>短信验证码</Text>
                            <TextInput
                                underlineColorAndroid={'transparent'}
                                placeholder="请输入短信验证码"
                                placeholderTextColor="#cccccc"
                                keyboardType="numeric"
                                style={styles.registeredCodeTextInput}
                                value={messageCode}
                                onChangeText={(messageCode) => {
                                    this.setState({messageCode});
                                }}
                            />
                            <CountDownButton
                                enable={phoneNum.length}
                                style={{width: 92, height: 34, marginRight: 10, backgroundColor: '#0092FF'}}
                                textStyle={{color: '#ffffff'}}
                                timerCount={60}
                                onClick={(shouldStartCountting) => {
                                    if (Validator.isPhoneNumber(phoneNum)) {
                                        this.registeredIdentityCode(shouldStartCountting)
                                    } else {
                                        Toast.showShortCenter('手机号输入有误，请重新输入');
                                        shouldStartCountting(false);
                                    }
                                }}
                            />
                        </View>

                        <View style={styles.separateLine}/>

                        <View style={{
                            width,
                            height: 45,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={styles.registered}>确认密码</Text>
                            <TextInput
                                underlineColorAndroid={'transparent'}
                                placeholder="请输入新密码(最少6位，数字+字母)"
                                placeholderTextColor="#cccccc"
                                returnKeyLabel={'done'}
                                returnKeyType={'done'}
                                secureTextEntry={true}
                                style={styles.registeredTextInput}
                                value={againPWD}
                                onChangeText={(againPWD) => {
                                    this.setState({againPWD});
                                }}
                            />
                        </View>

                    </View>
                    <Image style={styles.loginBackground} source={BlueButtonArc}>
                        <Button
                            isDisabled={!(phoneNum && messageCode)}
                            style={styles.loginButton}
                            textStyle={styles.loginButtonText}
                            onPress={() => {
                                this.registerAccount(phoneNum,messageCode,againPWD);
                            }}
                        >
                            立即注册
                        </Button>
                    </Image>
                    <View style={styles.screenEndView}>
                        <CheckBox isChecked={this.state.checkBox} checkedFun={()=>{
                            this.setState({
                                checkBox:!this.state.checkBox
                            })
                        }}/>
                        <View style={{height: 20, justifyContent: 'center', alignItems: 'center', marginLeft:5}}>
                            <Text style={styles.screenEndViewTextLeft}>已阅读并同意</Text>
                        </View>
                        <View style={{height: 21, justifyContent: 'center', alignItems: 'center'}}>
                            <Text
                                style={styles.screenEndViewText}
                                onPress={() => {
                                    this.props.navigation.dispatch({
                                        type:RouteType.ROUTE_AGREEMENT_CONTENT,
                                        params:{title: '《冷链马甲服务协议》', type: 1}
                                    });
                                }}
                            >
                                《用户服务协议》
                            </Text>
                        </View>
                    </View>
                </View>
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
        registeredIdentityCodeAction: (params, shouldStartCountting) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_UAM_REGISTER_IDENTIFY_CODE,
                success: data => {
                    shouldStartCountting(true);
                    Toast.showShortCenter('验证码已发送');
                    dispatch(registeredIdentityCodeAction(data));
                },
                fail: data => {
                    shouldStartCountting(false);
                    Toast.showShortCenter(data.message);
                }
            }))
        },
        registeredAction: (params,registerAccountSucCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_UAM_REGISTER,
                success: data => {
                    registerAccountSucCallBack()
                    Toast.showShortCenter('注册成功');
                },
                fail: data => {
                    Toast.showShortCenter(data.message);
                }
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterStepOne);
