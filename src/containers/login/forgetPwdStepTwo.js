/**
 * Created by 58416 on 2017/3/23.
 * 忘记密码界面 通过验证码后更改密码的界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation';
import  HTTPRequest from '../../utils/httpRequest';
import BlueButtonArc from '../../../assets/button/blueButtonArc.png';

import * as API from '../../constants/api';
import {
    GRAY_TEXT_COLOR,
    WHITE_COLOR,
} from '../../constants/colors';

import XeEncrypt from '../../utils/XeEncrypt';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import Loading from '../../utils/loading';
import {fetchData} from "../../action/app";
import * as RouteType from "../../constants/routeType";
const {width, height} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
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
        height: 19,
    },
    textInputStyle: {
        paddingLeft: 15,
        fontSize: 16,
        height: 44,
        backgroundColor: WHITE_COLOR,
    },
    iconfont: {
        fontFamily: 'iconfont',
        color: GRAY_TEXT_COLOR,
        lineHeight: 20,
        fontSize: 16,
    },
});


class ForgetPwdStepTwo extends Component {

    constructor(props) {
        super(props);

        const params = this.props.navigation.state.params;
        this.state = {
            newPWD: '',
            newPWDagain: '',
            identifyCode: params.identifyCode,
            phoneNum: params.phoneNum,
            loading: false,

        };

        this.changePsd = this.changePsd.bind(this);
        this.loginSecretCode = this.loginSecretCode.bind(this);
        this.getSecretCodeCallback = this.getSecretCodeCallback.bind(this);
        this.changePsdSucCallback = this.changePsdSucCallback.bind(this);
        this.finish = this.finish.bind(this);
    }

    componentDidMount() {
         this.getCurrentPosition();
    }
    //获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
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
            this.changePsd(secretPassWord, this.changePsdSucCallback);
        }
    }

    /*修改密码*/
    changePsd(secret,changePsdSucCallback) {
        this.props.changePsdAction({
            confirmPassword: secret,
            identifyCode: this.state.identifyCode,
            newPassword: secret,
            phoneNum: this.state.phoneNum,
        },changePsdSucCallback);
    }

    changePsdSucCallback(data){
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE,
            mode: 'reset',
        })
        Toast.showShortCenter('更改成功');
    }

    finish() {
        if (this.state.newPWD === '' && this.state.newPWDagain === '') {
            Toast.showShortCenter('密码不能为空');
        } else if (this.state.newPWD !== this.state.newPWDagain) {
            Toast.showShortCenter('两次密码输入不一致');
        } else {
            this.loginSecretCode(this.getSecretCodeCallback);
        }
    }

    render() {
        const navigator = this.props.navigation;

        return (
            <View style={styles.container}>
                {/*<NavigationBar*/}
                    {/*title={'忘记密码'}*/}
                    {/*navigator={navigator}*/}
                    {/*leftButtonHidden={false}*/}
                {/*/>*/}

                <View
                    style={{
                        flexDirection: 'row', marginTop: 10,
                    }}
                >
                    { false && <View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe60f;</Text>
                    </View>
                    }

                    <View
                        style={{flex: 1}}
                    >
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            placeholder="请输入密码"
                            value={this.state.newPWD}
                            onChangeText={(newPWD) => {
                                this.setState({newPWD});
                            }}
                        />
                    </View>

                </View>

                <View style={{backgroundColor: 'white',height: 1, width: width,alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{width:width, marginLeft:15, height: 1, backgroundColor: '#e8e8e8'}}/>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    { false && <View style={styles.iconStyle}>
                        <Text style={styles.iconfont}> &#xe60f;</Text>
                    </View>
                    }

                    <View style={{flex: 1}}>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            placeholder="请再次输入密码"
                            value={this.state.newPWDagain}
                            onChangeText={(newPWDagain) => {
                                this.setState({newPWDagain});
                            }}
                        />
                    </View>

                </View>


                <TouchableOpacity
                    onPress={() => {
                        this.finish();
                    }}
                >
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
                                color: 'white',
                                backgroundColor: '#00000000'
                            }}
                        >
                            确认
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
        changePsdAction: (params,changePsdSucCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_NEW_CHANGE_PSD_WITH_CODE,
                success: data => {
                    changePsdSucCallback(data);
                },
                fail: data => {

                }
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPwdStepTwo);
