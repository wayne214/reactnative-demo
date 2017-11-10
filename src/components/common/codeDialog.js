import React, {Component} from 'react';
import {
    Text,
    View,
    Modal,
    ListView,
    Platform,
    StyleSheet,
    Dimensions,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {HOST} from '../../constants/setting';
import {GET_IMG_CODE, GET_SMS_CODE, CHECK_SMG_CODE} from '../../constants/api';
import Toast from '../../utils/toast';
import ImageCode from '../../../assets/img/app/imageCode.png';
import PasswordBord from '../../components/common/passwordBord';
import vcode from '../../../assets/img/app/vcode.png';

const {width, height} = Dimensions.get('window')

class CodeDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifyCodeKey: Math.floor(Math.random(1) * 100000000),
            visible: this.props.visible,
            isError: this.props.isError,
            verifyCode: '',
            errorShow: false,
        };
        this._okPress = this._okPress.bind(this);
        this._cancelPress = this._cancelPress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps) return;
        if (nextProps.visible !== this.state.visible) {
            this.setState({visible: nextProps.visible});
        }
    }

    _okPress(verifyCode) {
        this.props.okPress(verifyCode, this.state.verifyCodeKey);
    }

    _cancelPress() {
        this.props.cancelPress();
    }

    codeErro() {
        this.setState({
            errorShow: true,
        })
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    paddingBottom: 45,
                    height,
                    width,
                }}>
                <View style={styles.mainContainer}>
                    <View style={styles.container}>

                        <Image style={{width: 271, height: 117}} source={ImageCode}/>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                height: 16,
                                width: 16,
                                top: 10,
                                right: 10,
                            }}
                            onPress={() => {
                                this._cancelPress();
                            }}>
                            <Image source={vcode}/>
                        </TouchableOpacity>
                        <View style={styles.cellContainer}>
                            <PasswordBord
                                maxLength={4}
                                onChange={(value) => {
                                    console.log('输入的密码：', value, '---', value.length)
                                    this.setState({verifyCode: value});
                                    if (value.length == 4) {
                                        this._okPress(value);
                                    }
                                }}
                            />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.setState({verifyCodeKey: Math.floor(Math.random(1) * 100000000)})}>
                                <Image style={styles.imgStyle}
                                       source={{uri: HOST + GET_IMG_CODE + '?verifyCodeKey=' + this.state.verifyCodeKey}}/>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.errorShow ?
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingBottom: 50,
                                    height: 80,
                                    marginRight: 56,
                                }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontFamily: 'iconfont',
                                            color: '#F6001E',
                                            marginBottom: 2,
                                        }}> &#xe63c; </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#F6001E',
                                        }}>验证码错误，请重新输入验证码</Text>
                                </View>
                                :
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingBottom: 50,
                                    height: 80,
                                    marginRight: 56,
                                }}/>
                        }

                    </View>

                </View>


            </View>
        );
    }
}

CodeDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export default CodeDialog

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    container: {
        width: 271,
        height: 240,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        // borderRadius: 6,
        paddingTop: 30,
        marginBottom: height/30*11,
    },

    cellContainer: {
        width: 271,
        height: 70,
        marginLeft: 20,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#e6eaf2',
        padding: 5,

    },
    labelText: {
        width: 90,
        fontSize: 15,
        color: '#666666',
        marginLeft: 20
    },
    textInput: {
        height: 39,
        width: 168,
        fontSize: 15,
        borderWidth: 0.5,
        borderColor: '#B6B6B6',
        marginLeft: 13,
    },
    bottomBtn: {
        width,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 30,
    },
    options: {
        width: width - 30,
        height: 200,
        borderRadius: 6,
        backgroundColor: 'white',
    },
    imgStyle: {
        width: 69,
        height: 41,
        // marginRight: 15,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: '#B6B6B6'
    },
    textView: {
        height: 48,
        alignItems: 'center',
        borderBottomWidth: 1,
        justifyContent: 'center',
        borderBottomColor: '#e6e6e6',
    },
    text: {
        fontSize: 16,
        color: '#333333',
    },
    btnView: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontSize: 18,
        color: '#666666'
    },
    line: {
        height: 1,
        width: width - 30,
        backgroundColor: '#e6eaf2',
    }
});