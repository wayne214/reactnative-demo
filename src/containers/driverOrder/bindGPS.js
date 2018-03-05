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
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import * as API from '../../constants/api';
import NavigatorBar from '../../components/common/navigatorbar';
import * as StaticColor from '../../constants/colors';
import {fetchData} from '../../action/app';

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
            if(responseData.result) {
                let data = responseData.result;
                if(data.isDisabled == 0){
                    if(data.eleValue && parseInt(data.eleValue) > 20) {
                        this.bindGPS();
                    }else {
                        Alert.alert('提示', '设备当前电量已不足20%，您确认要使用此设备？', [
                            {
                                text: '确定',
                                onPress: () => {
                                    this.bindGPS();
                                },
                            },
                            {text: '取消',
                                onPress: () => {
                                    this.gpsDeviceCode = null;
                                    this.changeState(true);
                                }
                            },
                        ], {cancelable: false});
                    }
                }else {
                    Toast.showShortCenter('该设备已禁用，不能进行绑定');
                }
            } else {
                Toast.showShortCenter('该设备不存在，不能进行绑定');
            }
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
            if(responseData.result){
                Toast.showShortCenter('绑定成功');
                // this.props.navigation.goBack();
                // DeviceEventEmitter.emit('refreshShippedDetails');
            } else {
                Toast.showShortCenter('绑定失败');
            }
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
                <View style={{flex: 1}}>
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
                                this.setState({barCode});
                            }}
                            value={barCode}
                            placeholder={'请确认您输入了正确的GPS设备编号'}
                            placeholderTextColor={StaticColor.LIGHT_GRAY_TEXT_COLOR}
                            underlineColorAndroid={'transparent'}
                        />
                    </Image>
                    <Text style={styles.tip}>请注意区分字母大小写</Text>
                </View>
                <BottomButton
                    onClick={() => {
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
        marginTop: 40,
    },
    inputView: {
        marginTop: 65,
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
        _getGPSDetailInfo: (params, callback) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_GET_GPS_DETAILS,
                success: data => {
                    console.log('get gps details success ', data);
                    callback && callback(data);
                },
                fail: error => {
                    console.log('???', error)
                }
            }));
        },
        _bindGPSDevice: (params, callback) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_BIND_OR_RELIEVE_GPS,
                success: data => {
                    console.log('bind gps success ', data);
                    callback && callback(data);
                },
                fail: error => {
                    console.log('???', error)
                }
            }));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(bindGPS);

