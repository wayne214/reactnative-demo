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
import {
    setUserCarAction,
} from '../../action/user';
import DeviceInfo from "react-native-device-info";


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
        const result = this.props.navigation.state.params.result;

        this.state = {
            carNumber:result.plateNumber,
            codeNum: '',
            codeNumNor: '',
            carOwnerName: result.owner,
            carOwnerTel: result.phoneNum,
        };

        this.sendVCodeCallback = this.sendVCodeCallback.bind(this);
        this.sendFailCallback = this.sendFailCallback.bind(this);
        this.abc = this.abc.bind(this);

        this.upload = this.upload.bind(this);
        this.carSuccess = this.carSuccess.bind(this);
        this.carFail = this.carFail.bind(this);
    }

    abc(data){
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



    // 增加车辆
    upload(){

        if (this.state.carOwnerTel === '') {

            Toast.show('请输入车主电话');
            return;
        }
        if (this.state.carOwnerName === '') {
            Toast.show('请输入车主姓名');
            return;
        }
        const result = this.props.navigation.state.params.result;

        result.fileNum =  '';//档案编号
        result.phoneNumber = this.state.carOwnerTel;//车主电话
        result.userName= this.state.carOwnerName;// 车主姓名
        result.plateNumber = this.state.carNumber; // 车牌号

        let carCategoryInt = 0;
        switch (result.carCategory){
            case '厢式货车':
                carCategoryInt = 1;
                break;
            case '集装箱挂车':
                carCategoryInt = 2;
                break;
            case '集装箱车':
                carCategoryInt = 3;
                break;
            case '箱式挂车':
                carCategoryInt = 4;
                break;
        }

        result.carCategory = carCategoryInt;
        result.volumeSize = parseInt(result.volumeSize);

        this.props.carVerifiedAction({
            ...result
        },this.carSuccess,this.carFail);



    }

    carSuccess(data){
        DeviceEventEmitter.emit('certificationSuccess');
        this.props.saveUserSetCarSuccess({carNum: this.state.carNumber, carStatus: 0});

        this.props.navigation.dispatch({type: 'pop', key: 'Main'})

    }
    carFail(data){

        Toast.show(data.message);

    }

    render() {
        return (

            <View style={styles.container}>
                <NavigatorBar
                    title='车主增加车辆'
                    router={this.props.navigation}
                    hiddenBackIcon={false}/>

                <View style={{backgroundColor: 'white', marginTop: 10, marginBottom: 10}}>
                    <Item title='车辆信息' des='请输入车牌号' showValue={this.state.carNumber} entering={(text)=>{
                      this.setState({
                          carNumber: text
                      })
                  }}/>
                    <Item title='车主姓名' des='请输入车主姓名' showValue={this.state.carOwnerName} entering={(text)=>{
                        this.setState({
                            carOwnerName: text
                        })
                  }}/>
                    <Item title='车主电话' des='请输入车主电话' keyboardType='numeric' showValue={this.state.carOwnerTel} entering={(text)=>{
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
                                        this.props._getVCodeCode({
                                            deviceId: DeviceInfo.getDeviceId(),
                                            phoneNum: this.state.carOwnerTel,
                                            type: '0', // 0新增车辆，1绑定已有车辆
                                        }, this.sendVCodeCallback(shouldStartCountting), this.sendFailCallback(shouldStartCountting),this.abc);

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
                            if (this.state.carNumber === ''){
                                Toast.show('请输入车辆信息');
                                return;
                            }
                            if (this.state.carOwnerName === ''){
                                Toast.show('请输入车主姓名');
                                return;
                            }
                            if (this.state.carOwnerTel === ''){
                                Toast.show('请输入车主电话');
                                return;
                            }
                            if (this.state.codeNum === ''){
                                Toast.show('请输入验证码');
                                return;
                            }

                            if (this.state.codeNum !== this.state.codeNumNor){
                                Toast.show('输入验证码不正确');
                                return;
                            }

                            this.upload();

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
        _getVCodeCode: (params, successCallback, failCallback,abc) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_CAR_OWNER_ADD_CAR_CODE,
                success: data => {
                    console.log('-------data', data);
                    abc(data);
                    successCallback(data);
                },
                fail: error => {
                    console.log('-------error', error);
                    failCallback();
                }
            }))
        },
        carVerifiedAction:(params,ownerVerifiedHomeSucCallBack,ownerVerifiedHomeFailCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_AUTH_QUALIFICATIONS_COMMIT,
                success: (data) => {
                    ownerVerifiedHomeSucCallBack(data);
                },
                fail:(data) => {
                    ownerVerifiedHomeFailCallBack(data);
                }
            }))
        },
        saveUserSetCarSuccess: (plateNumber) => {
            dispatch(setUserCarAction(plateNumber));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(carOwnerVerifiedMsgCode);
