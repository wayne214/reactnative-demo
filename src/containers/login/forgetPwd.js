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
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import {Geolocation} from 'react-native-baidu-map-xzx';
import NavigatorBar from '../../components/common/navigatorbar';
import CountDownButton from '../../components/home/timerButton';
import Loading from '../../utils/loading';
import {
    LIGHT_GRAY_TEXT_COLOR,
    WHITE_COLOR,
    COLOR_VIEW_BACKGROUND,
} from '../../constants/colors';
import * as API from '../../constants/api';

import Validator from '../../utils/validator';
const {width, height} = Dimensions.get('window');
import PermissionsAndroid from '../../utils/permissionManagerAndroid';
import Forgetdel from '../../../assets/login/forgetdel.png';
import BlueButtonArc from '../../../assets/button/blueButtonArc.png';
import {registeredIdentityCodeAction} from "../../action/register";
import {fetchData} from "../../action/app";
import * as RouteType from "../../constants/routeType";
import DeviceInfo from "react-native-device-info";

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container:{
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

class forgetPWD extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.state = {
            phoneNo: params.loginPhone,
            pwdCode: '',
            buttonForget: '获取验证码',
            loading: false,

        };
        this.getForgetVCode = this.getForgetVCode.bind(this);
        this.canclePhoneNO = this.canclePhoneNO.bind(this);
        this.canclePhonePWD = this.canclePhonePWD.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.checkCode = this.checkCode.bind(this);
        this.checkCodeSucCallBack = this.checkCodeSucCallBack.bind(this);
    }

    componentDidMount() {
        if(Platform.OS === 'ios'){
            // this.getCurrentPosition();
        }else {
            PermissionsAndroid.locationPermission().then((data) => {
                this.getCurrentPosition();
            }, (err) => {
                Alert.alert('提示','请到设置-应用-授权管理设置定位权限');
            });
        }
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

    /*获取验证码*/
    getForgetVCode(shouldStartCountting) {
        //todo uuid
        this.props.getForgetVCodeAction({
            deviceId: DeviceInfo.getDeviceId(),
            phoneNum: this.state.phoneNo,
        },shouldStartCountting)
    }

    canclePhoneNO() {
        this.setState({
            phoneNo: '',
        });
    }

    canclePhonePWD() {
        this.setState({
            pwdCode: '',
        });
    }

    /*检验验证码是否正确*/
    checkCode(checkCodeSucCallBack){
        this.props.checkCodeAction({
            identifyCode: this.state.pwdCode,
            phoneNum: this.state.phoneNo,
        },checkCodeSucCallBack)
    }

    checkCodeSucCallBack(data){
        if (data) {
            this.props.navigation.dispatch({
                type: RouteType.ROUTE_FORGET_PASSWORD_TWO,
                params: { identifyCode: this.state.pwdCode, phoneNum: this.state.phoneNo,}
            })
            // this.props.navigation.navigate('ChangeCodePwd', {
            //     identifyCode: this.state.pwdCode,
            //     phoneNum: this.state.phoneNo,
            // });
        } else {
            Toast.showShortCenter('输入的验证码不正确');
        }
    }

    // 下一步按钮
    nextStep() {
        if (this.state.phoneNo !== '' && this.state.pwdCode !== '') {
            this.checkCode(this.checkCodeSucCallBack);
        } else {
            Toast.showShortCenter('账号或密码不能为空');
        }
    }

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation
        return {
            tabBarLabel: '忘记密码',
            header: <NavigatorBar
                title='忘记密码'
                hiddenBackIcon={false}
                router={navigation}/>,
        }
    };

    render() {
        const navigator = this.props.navigation;
        const {phoneNo} = this.state;
        return (
            <View style={styles.container}>
                {/*<NavigationBar*/}
                    {/*title={'忘记密码'}*/}
                    {/*navigator={navigator}*/}
                    {/*hiddenBackIcon={false}*/}
                {/*/>*/}

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 10,
                    }}
                >
                    { false &&<View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe62a;</Text>
                    </View>
                    }

                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            placeholder="请输入手机号码"
                            value={this.state.phoneNo}
                            onChangeText={(phoneNo) => {
                                this.setState({phoneNo});
                            }}
                        />
                    </View>
                    {
                        (() => {
                            if (this.state.phoneNo.length > 0) {
                                return (
                                    <TouchableOpacity onPress={() => this.canclePhoneNO()}>

                                        <View style={styles.iconStyle}>
                                            <Image source={Forgetdel} />
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                </View>
                <View style={{backgroundColor: 'white',height: 1, width: width,alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{width: width-30,height: 1, backgroundColor: '#e8e8e8'}}/>
                </View>
                <View
                    style={{
                        flexDirection: 'row',

                    }}
                >
                    { false && <View style={styles.iconStyle}>
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
                                    <TouchableOpacity onPress={() => this.canclePhonePWD()}>
                                        <View style={styles.iconStyle}>
                                            <Image source={Forgetdel} />
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                    { false && <View style={{width: 1, backgroundColor: COLOR_VIEW_BACKGROUND}}/>}
                    <CountDownButton
                        enable={phoneNo.length}
                        style={{width: 100, backgroundColor: WHITE_COLOR, paddingRight: 15}}
                        textStyle={{color: '#0078ff'}}
                        timerCount={60}
                        onClick={(shouldStartCountting) => {
                            if (Validator.isPhoneNumber(phoneNo)) {
                                this.getForgetVCode(shouldStartCountting);
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
                            justifyContent:'center'
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
                            下一步
                        </Text>

                    </Image>
                </TouchableOpacity>

                {
                    this.state.loading ? <Loading /> : null
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
        getForgetVCodeAction: (params,shouldStartCountting) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_GET_FORGET_PSD_CODE,
                success: data => {
                    shouldStartCountting(true);
                    Toast.showShortCenter('验证码已发送');
                },
                fail: data => {
                    shouldStartCountting(false);
                }
            }))
        },
        checkCodeAction: (params,checkCodeSucCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_CHECK_IDENTIFY_CODE,
                success: data => {
                    checkCodeSucCallBack(data);
                },
                fail: data => {

                }
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(forgetPWD);
