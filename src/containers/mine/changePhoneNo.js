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
    NativeModules
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import Button from 'apsl-react-native-button';
import phonePicture from '../../../assets/img/login/phonePicture.png'
import * as RouteType from "../../constants/routeType";
import * as API from '../../constants/api';
import {fetchData} from "../../action/app";
import Toast from '@remobile/react-native-toast';

const {width, height} = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingLeft: 10,
        paddingRight: 10,
    },
    loginButton: {
        backgroundColor: '#0092FF',
        width: width - 40,
        marginLeft:10,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#0092FF',
        marginTop: 55,
        borderRadius:0,
    },
});

class changePhoneNo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false

        };

        this.checkIsFixPhone = this.checkIsFixPhone.bind(this);

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

    checkIsFixPhone() {
        this.props.checkModifyMonth({}, (result)=> {
            if (result) {
                this.setState({
                    modalVisible: !this.state.modalVisible
                })
            } else {
                Toast.showShortCenter('本月修改手机号码次数已达到1次，如须修改请等到下一个月')
            }
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image
                        style={{
                            marginTop: 45,
                            width: 415 / 2,
                            height: 300 / 2
                        }}
                        source={phonePicture}/>
                </View>
                <View style={{
                    marginTop: 20,
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 17}}>
                        当前手机号码：{global.phone.substring(0,3)}****{global.phone.substring(7,11)}
                    </Text>
                </View>
                <Button
                    isDisabled={false}
                    style={styles.loginButton}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {
                        // 校验一个月中是否已经修改过了
                        this.checkIsFixPhone();
                    }}
                >
                    变更手机号码
                </Button>
                <Text
                    style={{
                        width:width-40,
                        marginTop:6,
                        fontSize: 14,
                        lineHeight: 20,
                        color: '#999999',
                        marginLeft:10,
                    }}>
                    注：更换手机号码对订单，货源，收入等信息不会发生
                    变化，修改后须使用新手机号码登录，原手机号码则不
                    可以再登录。仅支持修改到未注册手机号码，如果手机
                    号码已注册，则不可变更。
                </Text>
                <Modal
                    style={{
                        height,
                        width,
                    }}
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                    }}>
                        <View style={{
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: '#FFFFFF',
                            backgroundColor: '#FFFFFF',
                            marginTop: height / 20,
                            width: 270,
                            height: 157,
                        }}>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 112,
                                marginLeft: 15,
                                marginRight: 15,
                            }}>
                                <Text style={{
                                    color: '#333333',
                                    lineHeight: 22,
                                    fontSize: 15,
                                }}>
                                    修改后须使用新手机号码登录；
                                </Text>
                                <Text style={{
                                    color: '#333333',
                                    lineHeight: 22,
                                    fontSize: 15,
                                }}>
                                    只支持修改到未注册的手机号码；
                                </Text>
                                <Text style={{
                                    color: '#333333',
                                    lineHeight: 22,
                                    fontSize: 15,
                                }}>
                                    一个自然月最多修改一次。
                                </Text>
                            </View>
                            <View style={{
                                height: 1,
                                backgroundColor: '#E8E8E8',
                            }}/>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    modalVisible: !this.state.modalVisible
                                });
                                this.props.navigation.dispatch({ type: RouteType.ROUTE_CHANGE_PHONE_NO_STEP_ONE })
                            }}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 44
                                }}>
                                    <Text style={{
                                        color: '#0092FF',
                                        fontSize: 17
                                    }}>
                                        我知道了
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        checkModifyMonth: (params, callback) => {
            dispatch(fetchData({
                api: API.API_CHECK_IS_FIX_PHONE + global.phone,
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

export default connect(mapStateToProps, mapDispatchToProps)(changePhoneNo);
