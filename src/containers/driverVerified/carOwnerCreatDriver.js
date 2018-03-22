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
    Dimensions,
    DeviceEventEmitter
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
import * as StaticColor from '../../constants/colors';

import {
    setUserCarAction,
} from '../../action/user';


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
    locationStyle: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#FFFAF4'
    },
    locationText: {
        fontSize: 14,
        color: StaticColor.GRAY_TEXT_COLOR,
        paddingTop: 5,
        paddingBottom: 5,
        alignSelf:'center'
    },
    locationIcon:{
        fontFamily: 'iconfont',
        fontSize: 17,
        color: StaticColor.ORANGE_ICON_COLOR,
        padding: 5,
        alignSelf:'center'
    },
});
class carOwnerCreatDriver extends Component {

    constructor(props) {
        super(props);

        this.state = {
            carNumber:global.plateNumber,
            codeNum: '',
            codeNumNor: '',
            carOwnerName: global.owner,
            carOwnerTel: global.phone,
        };

        this.sendVCodeCallback = this.sendVCodeCallback.bind(this);
        this.sendFailCallback = this.sendFailCallback.bind(this);
        this.getNormalCode = this.getNormalCode.bind(this);
        this.jumpNextPage = this.jumpNextPage.bind(this);
    }

    getNormalCode(data){
        this.setState({
            codeNumNor: data
        })
    }

    sendVCodeCallback(shouldStartCountting) {
        shouldStartCountting(true);
    }
    sendFailCallback(shouldStartCountting) {
        shouldStartCountting(false);
    }

    jumpNextPage(){
        Storage.get(StorageKey.carOwnerAddDriverInfo).then((value) => {
            if (value) {
                this.props.navigation.dispatch({
                    type: RouteType.ROUTE_CAR_OWNER_ADD_DRIVER ,
                    params: {
                        resultInfo: value,
                    }}
                )
            } else {
                this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_OWNER_ADD_DRIVER })
            }
        });
    }

    render() {
        return (

            <View style={styles.container}>
                <NavigatorBar
                    title='开通司机账号'
                    router={this.props.navigation}
                    hiddenBackIcon={false}/>

                <View style={styles.locationStyle}>
                    <Text style={styles.locationIcon}>&#xe69c;</Text>
                    <Text style={styles.locationText}>提示：短信验证码建议向手机号码所属司机索要</Text>
                </View>

                <View style={{backgroundColor: 'white', marginTop: 10, marginBottom: 10}}>
                    <Item title='司机姓名' des='请输入车牌号' showValue={global.userName} entering={(text)=>{
                      this.setState({
                          carNumber: text
                      })
                  }}/>
                    <Item title='手机号码' des='请输入车主姓名' showValue={global.phone} entering={(text)=>{
                        this.setState({
                            carOwnerName: text
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
                                        this.props._getVCodeCode({
                                            deviceId: '1',
                                            phoneNum: this.state.carOwnerTel,
                                            type: '0', // 0新增车辆，1绑定已有车辆
                                        }, this.sendVCodeCallback(shouldStartCountting), this.sendFailCallback(shouldStartCountting),this.getNormalCode);

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
                        isDisabled={false}
                        style={styles.loginButton}
                        textStyle={{color: 'white', fontSize: 18}}
                        onPress={() => {

                            {/*if (this.state.codeNum === ''){*/}
                                {/*Toast.show('请输入验证码');*/}
                                {/*return;*/}
                            {/*}*/}

                            {/*if (this.state.codeNum !== this.state.codeNumNor){*/}
                                {/*Toast.show('输入验证码不正确');*/}
                                {/*return;*/}
                            {/*}*/}

                            this.jumpNextPage();

                        }}
                    >
                        立即开通
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
        _getVCodeCode: (params, successCallback, failCallback,getNormalCode) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_OPEN_DRIVER_ACCOUNT,
                success: data => {
                    console.log('-------data', data);
                    getNormalCode(data);
                    successCallback(data);
                },
                fail: error => {
                    Toast.show(error.message);
                    failCallback();
                }
            }))
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(carOwnerCreatDriver);
