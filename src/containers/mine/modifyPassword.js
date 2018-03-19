/**
 * 修改密码页面
 * */
import React from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {fetchData} from "../../action/app";
import NavigatorBar from '../../components/common/navigatorbar'
import * as StaticColor from '../../constants/colors';
import Validator from '../../utils/validator';
import Toast from '../../utils/toast';
import XeEncrypt from '../../utils/XeEncrypt';
import * as API from '../../constants/api';
import {clearUser} from "../../action/user";
import { ROUTE_LOGIN } from '../../constants/routeType'



const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    container1: {
        flex: 1,
        paddingTop: 10,
    },
    container2: {
        backgroundColor: StaticColor.WHITE_COLOR,
        paddingLeft: 10,
        paddingRight: 10,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
    },
    textInput: {
        fontSize: 16,
        width: 100,
        height: 44,
        flex: 2,
    },

    line: {
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        height: 1,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 40,
        height: 44,
        backgroundColor: StaticColor.BLUE_BUTTON_COLOR,
        alignSelf: 'center',
        borderRadius: 5
    },
    buttonText: {
        fontSize: 17,
        color: StaticColor.WHITE_COLOR,
    },
    tipText: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
    },
});

class ModifyPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmNewPwd: '',
            userId: '',
        };

        this.loginSecretCode = this.loginSecretCode.bind(this);
        this.getSecretCodeCallback = this.getSecretCodeCallback.bind(this);
        this.changePwdSuccback = this.changePwdSuccback.bind(this);
        this.changePSD = this.changePSD.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation
        return {
            tabBarLabel: '修改密码',
            header: <NavigatorBar title='修改密码' hiddenBackIcon={false} router={navigation}/>,
        }
    };
    getSecretCodeCallback(result) {
        console.log('====result',result)
        if(result) {
            const secretCode = result;
            const secretOldPWD = XeEncrypt.aesEncrypt(this.state.oldPassword, secretCode, secretCode);
            const secretNewPWD = XeEncrypt.aesEncrypt(this.state.newPassword, secretCode, secretCode);
            console.log('----result',result,secretOldPWD);
            /*修改密码*/
            this.changePSD(secretOldPWD, secretNewPWD);
        }
    }
    changePwdSuccback(result) {
        if (result) {
            Toast.show('恭喜，密码修改成功');
            this.props._clearUserInfo();
            console.log('this.props.navigation',this.props.routes);
            this.props.navigation.dispatch({type: 'push', routeName: ROUTE_LOGIN})
        }
    }
    changePSD(secretOldPWD, secretNewPWD) {
        this.props._modifyPwd({
            confirmPassword: secretNewPWD,
            newPassword: secretNewPWD,
            oldPassword: secretOldPWD,
            userId: global.userId,
        }, this.changePwdSuccback());
    }

    /*获取密码秘钥*/
    loginSecretCode() {
        const oldPwd = this.state.oldPassword;
        const newPwd = this.state.newPassword;
        const confNd = this.state.confirmNewPwd;
        if (oldPwd === '') {
            Toast.show('原密码不能为空');
            return;
        }
        if (newPwd === '') {
            Toast.show('新密码不能为空');
            return;
        }
        if (newPwd === oldPwd) {
            Toast.show('原密码和新密码不能相同');
        } else if (newPwd !== confNd) {
            Toast.show('新密码两次输入不一致，请重新输入');
        } else {
            // 获取密钥
            this.props._getSecretCode({}, this.getSecretCodeCallback);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container1}>
                    <View style={styles.container2}>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            placeholder="请输入旧密码"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            value={this.state.oldPassword}
                            onChangeText={(oldPassword) => {
                                this.setState({oldPassword});
                            }}
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.container2}>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            placeholder="请输入新密码"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            value={this.state.newPassword}
                            onChangeText={(newPassword) => {
                                this.setState({newPassword});
                            }}
                        />
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.container2}>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            placeholder="请再次输入新密码"
                            placeholderTextColor="#CCCCCC"
                            secureTextEntry={true}
                            value={this.state.confirmNewPwd}
                            onChangeText={(confirmNewPwd) => {
                                this.setState({confirmNewPwd});
                            }}
                        />
                    </View>
                    <View style={styles.tipText}>
                        <Text style={{fontSize: 15, color: StaticColor.GRAY_TEXT_COLOR}}>密码由6-14位英文字母或数字组成</Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                if (Validator.isNewPassword(this.state.newPassword)) {
                                    if (Validator.isNewPassword(this.state.confirmNewPwd)) {
                                        this.loginSecretCode();
                                    } else {
                                        Toast.show('新密码不可包含特殊字符,总长度应为6至14位,需包含英文和数字');
                                    }
                                } else {
                                    Toast.show('新密码不可包含特殊字符,总长度应为6至14位,需包含英文和数字');
                                }
                            }}
                        >
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>完成</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

}

const mapStateToProps = state => {
    const { app } = state;
    return {
        loading: app.get('loading'),
        userInfo: app.get('userInfo')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        _getSecretCode: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_GET_SEC_TOKEN,
                success: data => {
                    console.log('-------data', data);
                    successCallback(data);
                },
                fail: error => {
                    console.log('-------error', error);
                }
            }))
        },
        _modifyPwd: (params, callback) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_CHANGE_PSD_WITH_OLD_PSD,
                success: data => {
                    console.log('-------data', data);
                    callback(data);
                },
                fail: error => {
                    console.log('-------error', error);
                }
            }))
        },
        _clearUserInfo: () => {
            dispatch(clearUser());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModifyPassword)