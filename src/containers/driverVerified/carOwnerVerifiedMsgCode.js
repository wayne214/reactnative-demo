/**
 * Created by chj on 2018/3/2.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
    Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import Line from './verifiedIDItem/verifiedLineItem';
import NavigatorBar from '../../components/common/navigatorbar';
import Item from './verifiedIDItem/title_enterDesItem';
import CountDownButton from '../../components/common/timerButton';
import Regex from '../../utils/regex';
import {fetchData} from "../../action/app";
import * as API from '../../constants/api';
import Button from 'apsl-react-native-button';
import Toast from '../../utils/toast';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import * as RouteType from '../../constants/routeType';

const {Swidth, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    titleStyle: {
        marginTop: 15,
        fontSize: 15,
        textAlign: 'center'
    },
    textInputStyle: {
        ...Platform.select({
            ios: {
                marginTop: 15,
                marginBottom: 15,
            }
        }),
        fontSize: 15,
        color: '#333333',
        marginLeft: 20,
        width: 200
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: Swidth - 40,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },
});
class carOwnerVerifiedMsgCode extends Component {

    constructor(props) {
        super(props);

        this.state = {
            carNumber: '',
            codeNum: '',
            carOwnerName: '',
            carOwnerTel: '',
        }

        this.sendVCodeCallback = this.sendVCodeCallback.bind(this);
        this.sendFailCallback = this.sendFailCallback.bind(this);
        this.requestVCodeForLogin = this.requestVCodeForLogin.bind(this);
    }

    sendVCodeCallback(shouldStartCountting) {

        shouldStartCountting(true);
    }

    sendFailCallback(shouldStartCountting) {

        shouldStartCountting(false);
    }

    /*获取登录验证码*/
    requestVCodeForLogin(sendVCodeCallback, sendFailCallback) {

        this.props._getVCodeCode({
            deviceId: '1',
            phoneNum: this.state.carOwnerTel
        }, sendVCodeCallback, sendFailCallback);
    }

    render() {
        return (

            <View style={styles.container}>
                <NavigatorBar
                    title='车主认证'
                    router={this.props.navigation}
                    hiddenBackIcon={false}/>

                <View style={{backgroundColor: 'white', marginTop: 10, marginBottom: 10}}>
                    <Item title='车辆信息' des='请输入车牌号' entering={(text)=>{
                      this.setState({
                          carNumber: text
                      })
                  }}/>
                    <Item title='车主姓名' des='请输入车主姓名' entering={(text)=>{
                        this.setState({
                            carOwnerName: text
                        })
                  }}/>
                    <Item title='车主电话' des='请输入车主电话' keyboardType='numeric' entering={(text)=>{
                        this.setState({
                            carOwnerTel: text
                        })
                  }}/>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'white'}}>
                    <TextInput style={styles.textInputStyle}
                               maxLength={15}
                               underlineColorAndroid={'transparent'}
                               onChangeText={(text) => {
                                       this.setState({
                                           codeNum: text,
                                       });
                               }}
                               value={this.state.codeNum}
                               placeholder='请输入短信验证码'
                               keyboardType='numeric'

                    />
                    <CountDownButton
                        enable={true}
                        textStyle={{color: '#FFFFFF'}}
                        timerCount={60}
                        style={{marginVertical: 10,width: 100, marginRight: 20}}
                        onClick={(shouldStartCountting) => {
                                
                                    if (Regex.test('mobile', this.state.carOwnerTel)) {
                                        this.requestVCodeForLogin(this.sendVCodeCallback(shouldStartCountting), this.sendFailCallback(shouldStartCountting));
                                    } else {
                                        Toast.show('手机号输入有误，请重新输入');
                                        shouldStartCountting(false);
                                    }
                                }}
                    />
                </View>

                <View style={{backgroundColor: '#0092FF', marginTop: 20, marginHorizontal: 10, }}>
                    <Button
                        ref='button'
                        //isDisabled={!(this.state.carNumber && this.state.carOwnerName && this.state.carOwnerTel && this.state.codeNum)}
                        isDisabled={false}
                        style={styles.loginButton}
                        textStyle={{color: 'white', fontSize: 18}}
                        onPress={() => {
                             //if (Regex.test('mobile',this.state.carOwnerTel)) {
                                 let a = 4;
                                        // 个人车主认证
                                        if (a === 1){
                                            Storage.get(StorageKey.personownerInfoResult).then((value) => {
                                                if (value) {
                                                    this.props.navigation.dispatch({
                                                        type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH ,
                                                        params: {
                                                            resultInfo: value,
                                                        }}
                                                    )
                                                } else {
                                                    this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH })
                                                }
                                            });
                                        }
                                        if ( a=== 2) {
                                            // 个人车主认证详情
                                            this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_OWNER_VERIFIED })
                                        }

                                        if (a === 3){
                                            // 企业车主认证
                                            Storage.get(StorageKey.enterpriseownerInfoResult).then((value) => {
                                                if (value) {
                                                    this.props.navigation.dispatch({
                                                        type: RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH ,
                                                        params: {
                                                            resultInfo: value,
                                                        }}
                                                    )
                                                } else {
                                                    this.props.navigation.dispatch({ type: RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH })
                                                }
                                            });
                                        }
                                        if (a === 4){
                                            // 企业车主详情
                                            this.props.navigation.dispatch({ type: RouteType.ROUTE_ENTERPRISE_OWNER_VERIFIED_DETAIL })
                                        }
                             {/*} else {*/}
                                 {/*Toast.show('手机号码输入有误，请重新输入');*/}
                             {/*}*/}
                        }}
                    >
                        确认提交
                    </Button>
                </View>

            </View>


        )
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        _getVCodeCode: (params, successCallback, failCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_GET_LOGIN_WITH_CODE,
                success: data => {
                    console.log('-------data', data);
                    successCallback();
                },
                fail: error => {
                    console.log('-------error', error);
                    failCallback();
                }
            }))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(carOwnerVerifiedMsgCode);
