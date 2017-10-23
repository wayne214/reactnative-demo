import React, {Component} from 'react';
import {
    Text,
    View,
    Modal,
    ListView,
    Animated,
    StyleSheet,
    Dimensions,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import {HOST} from '../../constants/setting';
import {GET_IMG_CODE, GET_SMS_CODE, CHECK_SMG_CODE} from '../../constants/api';
import Toast from '../../utils/toast';

const {width, height} = Dimensions.get('window')

class CodeDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifyCodeKey: Math.floor(Math.random(1) * 100000000),
            visible: this.props.visible,
            isError: this.props.isError,
            verifyCode: '',
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

    _okPress() {
        this.props.okPress(this.state.verifyCode, this.state.verifyCodeKey);
    }

    _cancelPress() {
        this.props.cancelPress();
        // this.setState({visible: false})
    }

    render() {
        return (
            //<Modal
            //    transparent={true}
            //    animationType={'none'}
            //    visible={this.state.visible}
            //    onRequestClose={() => console.log('ignore warining')}>
            <View
                style={{
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    paddingBottom: 40,
                    height,
                    width,
                }}>
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <View style={styles.cellContainer}>
                            <Text style={styles.labelText}>图形验证码</Text>
                            <TextInput
                                ref='inputcode'
                                placeholder='请输入验证码'
                                style={styles.textInput}
                                underlineColorAndroid={'transparent'}
                                value={this.state.verifyCode}
                                onChangeText={(text) => this.setState({verifyCode: text})}/>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.setState({verifyCodeKey: Math.floor(Math.random(1) * 100000000)})}>
                                <Image style={styles.imgStyle}
                                       source={{uri: HOST + GET_IMG_CODE + '?verifyCodeKey=' + this.state.verifyCodeKey}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.bottomBtn}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.btnView}
                                onPress={this._cancelPress}>
                                <Text style={styles.cancelText}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.btnView}
                                onPress={this._okPress}>
                                <Text style={styles.cancelText}>确定</Text>
                            </TouchableOpacity>
                        </View>
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
        width: width - 30,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 6,
        paddingTop: 30,
    },

    cellContainer: {
        width,
        height: 70,
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
        flex: 1,
        padding: 0,
        fontSize: 15
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
        width: 94,
        height: 29,
        marginRight: 15
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
    line:{
        height: 1,
        width:width-30,
        backgroundColor:'#e6eaf2',
    }
});
