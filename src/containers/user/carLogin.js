import React from 'react';
import {connect} from 'react-redux';
import {
    View,
    Image,
    Text,
    Platform,
    TextInput,
    ScrollView,
    NativeModules,
    TouchableOpacity,
    Clipboard,
    Keyboard
} from 'react-native';
import {appendLogToFile, fetchData, loadUser, loginSuccess, writeLogToFile} from '../../action/app';
import BaseComponent from '../../components/common/baseComponent';
import NavigatorBar from '../../components/common/navigatorbar';
import Button from '../../components/common/button';
import Logo from '../../../assets/img/app/logo.png';
import styles from '../../../assets/css/login';
import * as RouteType from '../../constants/routeType';
import {CAR_LOGIN, TEST, SHIPPER_LOGIN} from '../../constants/api';
import Storage from '../../utils/storage';
import User from '../../models/user';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import JPushModule from 'jpush-react-native';
import {DEBUG} from "../../constants/setting";

let startTime = 0;
let endTime = 0;

class LoginContainer extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            currentRole: 1,
            password: '',
            username: '',
            showUpgrade: false,
            passwordWindowIsShow: true,
        };
        this._login = this._login.bind(this);
        // this.title = props.router.getCurrentRouteTitle();
        // this.lastRouteKey = props.router.getLastCurrentRouteKey();
        // console.log('***lastRouteKey**',this.lastRouteKey);
        this.driverLogin = props.navigation.state.params.driverLogin;
        this._clearCopyText = this._clearCopyText.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
    }

    _login() {
        if (!Regex.test('mobile', this.state.username)) return Toast.show('手机号格式不正确');
        // if (!Regex.test('password', this.state.password)) return Toast.show('密码格式不正确，最少六位');
        this.props.login({
            username: this.state.username.trim(),
            password: this.state.password.trim(),
        }, this.props.navigation, this.state.currentRole, this.props.insiteNotice);
    }

    _clearCopyText() {
        Clipboard.setString('');
    }

    componentWillMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: <NavigatorBar
                hiddenBackIcon={true}
                style={{borderBottomColor: 'white'}}
                router={navigation}/>
        };
    };

    componentDidMount() {
        super.componentDidMount()
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide() {
        this.refs.password && this.refs.password.blur();
        this.setState({passwordWindowIsShow: true});
    }

    render() {
        let carrierLogin;
        if (this.driverLogin === 'driverLogin') {
            carrierLogin = (
                <View style={styles.forgetView}>
                    <Text style={styles.text}
                          onPress={() => this.props.navigation.dispatch({type: 'pop'})}>承运商登录</Text>
                </View>)
        } else {
            carrierLogin = (
                <View style={styles.forgetView}>
                    <Text style={styles.text}
                          onPress={() => this.props.navigation.dispatch({
                              type: RouteType.ROUTE_LOGIN,
                              params: {title: ''}
                          })}>承运商登录</Text>
                </View>)
        }
        const {router} = this.props;
        return (
            <View style={styles.container}>


                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}>
                    <Image source={Logo} style={styles.logo}/>

                    <View style={styles.logoContainer}>
                        <View style={styles.cell}>
                            <Text style={styles.iconFont}>&#xe613;</Text>
                            <TextInput
                                style={styles.input}
                                multiline={false}
                                placeholder='请输入手机号'
                                keyboardType='numeric'
                                value={this.state.username}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => this.setState({username: text})}/>
                            <View
                                opacity={(this.state.username + '').trim().length > 0 ? 1 : 0}>
                                <TouchableOpacity
                                    opacityActive={1}
                                    onPress={() => {
                                        this.setState({username: ''})
                                    }}
                                >
                                    <Text
                                        style={styles.iconFontRight}>&#xe634;</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.cell, {marginTop: 20}]}>
                            <Text style={styles.iconFont}>&#xe615;</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    ref='password'
                                    style={styles.input}
                                    multiline={false}
                                    placeholder='请输入密码'
                                    returnKeyType='done'
                                    secureTextEntry={!this.state.showPwd}
                                    value={this.state.password}
                                    underlineColorAndroid={'transparent'}
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={(text) => this.setState({password: text})}/>
                                <TouchableOpacity
                                    visible={this.state.passwordWindowIsShow}
                                    style={styles.passwordWindow}
                                    opacityActive={1}
                                    onPress={() => {
                                        Clipboard.setString('');
                                        this.refs.password.focus()
                                        this.setState({passwordWindowIsShow: false})
                                    }}>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.bottomView}>
                        {carrierLogin}
                        <View style={styles.registerView}>
                            <Text style={styles.text}
                                  onPress={() => this.props.navigation.dispatch({
                                      type: RouteType.ROUTE_PASSWORD_PAGE,
                                      params: {title: '忘记密码', forgetPassword: 'driverForgetPassword'}
                                  })}>忘记密码</Text>
                        </View>
                    </View>

                    <View style={styles.loginBtn}>
                        <Button
                            title='登录'
                            style={styles.btn}
                            onPress={this._login}
                            textStyle={styles.btnText}/>
                    </View>
                </ScrollView>

                {this.props.loading ? this._renderLoadingView() : null}

                {this._renderUpgrade(this.props)}
            </View>
        );
    }

}

function mapStateToProps(state) {
    const {app} = state;
    return {
        user: app.get('user'),
        loading: app.get('loading'),
        upgradeForce: app.get('upgradeForce'),
        showFloatDialog: app.get('showFloatDialog'),
        upgrade: app.get('upgrade'),
        upgradeForce: app.get('upgradeForce'),
        upgradeForceUrl: app.get('upgradeForceUrl'),
        insiteNotice: app.get('insiteNotice'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        login: (body, navigation, currentRole, insiteNotice) => {
            startTime = new Date().getTime();
            dispatch(fetchData({
                body,
                method: 'GET',
                api: CAR_LOGIN,
                successToast: true,
                msg: '登录成功',
                showLoading: true,
                success: (data) => {
                    // 冻结账号
                    dispatch(loginSuccess());
                    const user = new User({
                        userId: data.id,
                        carId: data.carId,
                        carrierId: data.carrierId,
                        driverName: data.driverName,
                        driverNumber: data.driverNumber,
                        phoneNumber: data.driverPhone,
                        refCount: data.refCount,
                        carrierType: data.carrierType,
                        certificationStatus: data.certificationStatus,
                        companyName: data.companyName,
                        corporation: data.corporation,
                        username: data.username,
                        currentUserRole: 2
                    });
                    user.save();
                    dispatch(loadUser(user));
                    navigation.dispatch({
                        type: 'Main',
                        mode: 'reset',
                        params: {title: '', currentTab: 'route', insiteNotice: insiteNotice}
                    })
                    if (DEBUG) {
                        JPushModule.setAlias('B' + user.phoneNumber, () => {
                            console.log("Set alias succeed ! tag: ", user.phoneNumber);
                            dispatch(appendLogToFile('登录', '设置推送别名成功', startTime))
                        }, () => {
                            console.warn("Set alias failed");
                            dispatch(appendLogToFile('登录', '设置推送别名失败', startTime))
                        });
                    } else {
                        JPushModule.setAlias('A' + user.phoneNumber, () => {
                            console.log("Set alias succeed ! tag: ", user.phoneNumber);
                            dispatch(appendLogToFile('登录', '设置推送别名成功', startTime))
                        }, () => {
                            console.warn("Set alias failed");
                            dispatch(appendLogToFile('登录', '设置推送别名失败', startTime))
                        });
                    }
                    // JPushModule.setAlias(user.userId, () => {
                    //     console.log("Set alias succeed");
                    // }, () => {
                    //     console.warn("Set alias failed");
                    // });
                    lastTime = new Date().getTime();
                    dispatch(writeLogToFile(
                        '登录',
                        '用户登录-司机登录',
                        user.phoneNumber,//phoneNum
                        user.userId,//userId
                        user.companyName + '-' + user.driverName,//userName
                        endTime - startTime,//useTime,
                    ))
                }
            }));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
