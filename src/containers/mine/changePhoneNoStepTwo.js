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
import Toast from "../../utils/toast";
import Regex from "../../utils/regex";
import CountDownButton from '../../components/common/timerButton';
import * as StaticColor from "../../constants/colors";
import * as RouteType from "../../constants/routeType";


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
            smsCode: ''
        };

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


    render() {
        const {phoneNumber} = this.state;
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
                            color:'#cccccc',
                            width:width-120
                        }}
                        placeholderTextColor="#cccccc"
                        underlineColorAndroid={'transparent'}
                        placeholder="请输入新的手机号码"
                        onChangeText={(phoneNumber) => {
                            this.setState({phoneNumber});
                        }}
                        value={phoneNumber}
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
                            color:'#cccccc'
                        }}
                        value={this.state.smsCode}
                        onChangeText={(smsCode) => {
                            this.setState({smsCode});
                        }}
                        placeholder="请输入验证码"
                        keyboardType="numeric"
                        placeholderTextColor="#cccccc"
                        textAlign="left"
                        returnKeyType='done'/>

                    <CountDownButton
                        enable={phoneNumber.length}
                        style={{width: 90,}}
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
                <Button
                    isDisabled={false}
                    style={styles.loginButton}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {

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
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(changePhoneNoStepTwo);
