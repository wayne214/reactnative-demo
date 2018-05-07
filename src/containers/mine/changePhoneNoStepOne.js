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
    TextInput,
    Platform
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import Button from 'apsl-react-native-button';
import phonePicture from '../../../assets/img/login/phonePicture.png'
import * as RouteType from "../../constants/routeType";
import {fetchData} from "../../action/app";
import Toast from '@remobile/react-native-toast';
import * as API from '../../constants/api';
import DeviceInfo from "react-native-device-info";


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
        marginTop: 20,
        borderRadius: 0,
    },
});

class changePhoneNoStepOne extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginPWD: ''
        };

        this.nextStep = this.nextStep.bind(this);
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

    nextStep() {
        const {loginPWD} = this.state;
        if(loginPWD === '') {
            Toast.showShortCenter('登录密码不能为空');
            return
        }
        this.props.checkLoginPwd({
            deviceId: DeviceInfo.getDeviceId(),
            password: this.state.loginPWD,
            phoneNum: global.phone,
            platform: Platform.OS === 'ios' ? 1 : 2
        }, (result)=> {
            if (result) {
                this.props.navigation.dispatch({type:RouteType.ROUTE_CHANGE_PHONE_NO_STEP_TWO});
            } else {
                Toast.showShortCenter('登录密码错误');
            }
        });

    }

    render() {
        const {loginPWD} = this.state;
        return (
            <View style={styles.container}>
                <View style={{
                    marginTop: 10,
                    paddingLeft:10,
                    marginBottom:10,
                }}>
                    <Text style={{fontSize: 13, color: '#999999'}}>
                        当前手机号码：{global.phone.substring(0, 3)}****{global.phone.substring(7, 11)}
                    </Text>
                </View>
                <View style={{
                    height: 44,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor:'#FFFFFF',
                    paddingLeft:10,
                }}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#666666',
                            width:70,
                        }}>登录密码</Text>
                    <TextInput
                        style={{
                            fontSize:14,
                            color:'#cccccc',
                            width:width-100
                        }}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor="#cccccc"
                        placeholder="请输入登录密码"
                        onChangeText={(loginPWD) => {
                            this.setState({loginPWD});
                        }}
                        value={loginPWD}
                    />
                </View>
                <Button
                    isDisabled={false}
                    style={styles.loginButton}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {
                        this.nextStep();

                    }}
                >
                    下一步
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
        checkLoginPwd: (params, callback) => {
            dispatch(fetchData({
                api: API.API_CHECK_PASSWORD,
                body: params,
                method: 'POST',
                success: (data) => {
                    callback(data)
                },
                fail: (error) => {
                    console.log(error);
                }
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(changePhoneNoStepOne);
