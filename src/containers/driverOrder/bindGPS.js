/**
 * 手动输入GPS编码绑定界面
 * Created by xizhixin on 2017/12/20.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    Image,
    Alert,
    DeviceEventEmitter,
    ScrollView
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import * as API from '../../constants/api';
import NavigatorBar from '../../components/common/navigatorbar';
import * as StaticColor from '../../constants/colors';
import {fetchData} from '../../action/app';
import {refreshDriverOrderList} from '../../action/driverOrder';
import Validator from '../../utils/validator';
import gps from '../../../assets/img/scan/gps.png'
import Rectangle from '../../../assets/img/scan/Rectangle.png'
class bindGPS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barCode: '',
        };
        this.bindGPS = this.bindGPS.bind(this);
        this.getGPSDetails = this.getGPSDetails.bind(this);
    }
    componentDidMount() {

    }
    // 获取GPS设备信息
    getGPSDetails() {
        this.props._getGPSDetailInfo({
            barCode: this.state.barCode,
        },(responseData) => {
            if(responseData) {
                let data = responseData;
                if(data.deviceVersion === 'MOBILE_VERSION') { // 是移动版
                    if(data.isDisabled == 0){ // 设备开启
                        if(data.eleValue && parseInt(data.eleValue) > 20) { // 电量大于20%
                            this.bindGPS();
                        }else { // 电量不足20%
                            Alert.alert('提示', '设备当前电量已不足20%，您确认要使用此设备？', [
                                {
                                    text: '确定',
                                    onPress: () => {
                                        this.bindGPS();
                                    },
                                },
                                {text: '取消'},
                            ], {cancelable: false});
                        }
                    }else { // 设备禁用
                        Toast.showShortCenter('设备已被禁用，请选择其他设备');
                    }
                } else { // 不是移动版
                    Toast.showShortCenter('此设备不是移动版，不支持绑定');
                }
            } else {
                Toast.showShortCenter('该设备不存在，不能进行绑定');
            }
        }, (error) => {
            Toast.showShortCenter(error.message);
        });

    }
    // 绑定GPS设备
    bindGPS() {
        this.props._bindGPSDevice({
            driverPhone: global.phone,
            userId: global.userId,
            userName: global.userName,
            bindCarNum: global.plateNumber,
            barCode: this.state.barCode,
            isBind: 1, // 绑定
        }, (responseData) => {
            if(responseData){
                Toast.showShortCenter('绑定成功');
                this.props._refreshOrderList(0);
                this.props._refreshOrderList(1);
                this.props.navigation.dispatch({type: 'pop', key: 'Main'});
            } else {
                Toast.showShortCenter('绑定失败');
            }
        }, (error) => {
            Toast.showShortCenter(error.message);
        })
    }

    render() {
        const navigator = this.props.navigation;
        const {barCode} = this.state;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'绑定GPS设备'}
                    hiddenBackIcon={false}
                    router={navigator}
                />
                <ScrollView style={{flex: 1,}}>
                    <Image
                        style={styles.icon}
                        source={gps}
                    />
                    <Image
                        style={styles.inputView}
                        source={Rectangle}
                    >
                        <TextInput
                            style={{
                                backgroundColor: StaticColor.WHITE_COLOR,
                                marginLeft: 5,
                                marginRight: 5,
                                marginTop: 5,
                                marginBottom: 5,
                                height: 40,
                                textAlign: 'center',
                                color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                fontSize: 16,
                            }}
                            onChangeText={(barCode) => {
                                if(barCode && !Validator.isGpsCode(barCode)){
                                    return Toast.showShortCenter('请您输入正确的格式');
                                }
                                this.setState({barCode: barCode.toUpperCase()});
                            }}
                            value={barCode}
                            placeholder={'请确认您输入了正确的GPS设备编号'}
                            placeholderTextColor={StaticColor.LIGHT_GRAY_TEXT_COLOR}
                            underlineColorAndroid={'transparent'}
                        />
                    </Image>
                    <Text style={styles.tip}>请注意区分字母大小写</Text>
                </ScrollView>
                <BottomButton
                    style={{position: 'absolute', bottom: 0, left: 0}}
                    onClick={() => {
                        if(!this.state.barCode) {
                            Toast.showShortCenter('GPS编号不能为空');
                            return;
                        }
                        this.getGPSDetails();
                    }}
                    text="确认"
                />
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    icon: {
        alignSelf: 'center',
        marginTop: 70,
    },
    inputView: {
        marginTop: 35,
        alignSelf: 'center'
    },
    tip: {
        color: StaticColor.GRAY_TEXT_COLOR,
        fontSize: 12,
        marginTop: 15,
        textAlign: 'center'
    }

});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {
        _getGPSDetailInfo: (params, callback, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_GET_GPS_DETAILS,
                success: data => {
                    console.log('get gps details success ', data);
                    callback && callback(data);
                },
                fail: error => {
                    console.log('???', error);
                    failCallBack && failCallBack(error);
                }
            }));
        },
        _bindGPSDevice: (params, callback, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_BIND_OR_RELIEVE_GPS,
                success: data => {
                    console.log('bind gps success ', data);
                    callback && callback(data);
                },
                fail: (error) => {
                    console.log('???', error);
                    failCallBack && failCallBack(error);
                }
            }));
        },
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(bindGPS);

