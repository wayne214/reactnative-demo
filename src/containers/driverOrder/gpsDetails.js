/**
 * 查看GPS设备详情
 * Created by xizhixin on 2017/12/20.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import CommonCell from '../mine/cell/commonCell';
import * as StaticColor from '../../constants/colors';
import * as API from '../../constants/api';
import Toast from '@remobile/react-native-toast';
import {fetchData} from '../../action/app';

class gpsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
        this.unbindGPS = this.unbindGPS.bind(this);
        this.getGPSDetails = this.getGPSDetails.bind(this);
    }
    componentDidMount() {
        this.getGPSDetails();
    }
    // 获取GPS设备信息
    getGPSDetails() {
        this.props._getGPSDetailInfo({
            bindCarNum: global.plateNumber,
        }, (responseData) => {
            if(responseData.result){
                this.setState({
                    data: responseData.result,
                });
            }
        });
    }
    // 解除绑定
    unbindGPS() {
        this.props._unbindGPSDevice({
            driverPhone: global.phone,
            userId: global.userId,
            userName: global.userName,
            bindCarNum: global.plateNumber,
            barCode: this.state.data.barCode,
            isBind: 0, // 解除绑定
        }, (responseData) => {
            if(responseData.result){
                Toast.showShortCenter('解除绑定成功');
                this.props.navigation.dispatch({ type: 'pop' })
                // DeviceEventEmitter.emit('refreshShippedDetails');
            }else {
                Toast.showShortCenter('解除绑定失败');
            }
        });
    }
    render() {
        const navigator = this.props.navigation;
        const {data} = this.state;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    hiddenBackIcon={false}
                    title={'详情'}
                    router={navigator}
                />
                <View style={{flex: 1,}}>
                    <CommonCell itemName="供应商设备:" content={data.deviceSupplier ?data.deviceSupplier : ''} hideBottomLine={true}/>
                    <CommonCell itemName="供应商设备型号:" content={data.terminalVersion ? data.terminalVersion : ''} hideBottomLine={true}/>
                    <CommonCell itemName="供应商设备编号:" content={data.deviceNo ? data.deviceNo : ''} hideBottomLine={true} />
                    <CommonCell itemName="开启/关闭:" content={data.onOff == 0 ? '开启': '关闭'} hideBottomLine={true}/>
                    <CommonCell itemName="当前电量:" content={data.eleValue ? `${data.eleValue}%` : '0%'} hideBottomLine={true}/>
                </View>
                <BottomButton
                    onClick={() => {
                        this.unbindGPS();
                    }}
                    text="解除绑定"
                />
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
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
        _unbindGPSDevice: (params, callback) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_BIND_OR_RELIEVE_GPS,
                success: data => {
                    console.log('unbind gps success ', data);
                    callback && callback(data);
                },
                fail: error => {
                    console.log('???', error)
                }
            }));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(gpsDetails);

