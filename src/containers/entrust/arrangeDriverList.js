/**
 * 安排司机列表界面
 * Created by xizhixin on 2017/12/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import * as StaticColor from '../../constants/colors';
import NavigatorBar from "../../components/common/navigatorbar";
import RadioList from '../../components/common/DriverRadioList';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import * as API from '../../constants/api';
import Toast from '@remobile/react-native-toast';
import {fetchData} from "../../action/app";
import * as RouteType from '../../constants/routeType';

let selected = null;
let selectedArr = [];

class arrangeDriverList extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            data: [],
            driverOption: params.driverOption,
            para: params.data
        };
        this.getDriverList = this.getDriverList.bind(this);
        this.arrangeCar = this.arrangeCar.bind(this);
        this.getDriverListCallback = this.getDriverListCallback.bind(this);
        this.arrangeCarCallback = this.arrangeCarCallback.bind(this);
    }

    componentDidMount() {
        this.getDriverList(this.getDriverListCallback);
    }

    componentWillUnmount() {
        selected = null;
        selectedArr = [];
    }

    getDriverListCallback(result) {
        console.log('arrangeDriverList', result);
        if (!result || result.length === 0) {
            Toast.showShortCenter('司机列表为空');
            this.setState({
                data: [],
            });
            result;
        }


        this.setState({
            data: result,
        });
    }
    // 获取司机列表信息
    getDriverList(callback) {
        // 传递参数
        const {driverOption }= this.state;
        this.props.getDriverList({
            companionId: global.companyId,
            carId: driverOption.carId
        }, callback);
    }
    arrangeCarCallback(result) {
        if(result) {
            DeviceEventEmitter.emit('reloadDispatchList');
            Toast.showShortCenter('安排车辆成功！');
            this.props.navigation.dispatch({ type: 'pop', key: 'Main' })
        }else {
            Toast.showShortCenter('安排车辆失败！');
        }
    }

    // 安排车辆
    arrangeCar(driver, callback) {
        const {driverOption , para }= this.state;
        console.log('----para', para);
        if (!driver || !driver.driverName) {
            Toast.showShortCenter('暂无可用司机');
            return;
        }


        const api = para.orderState == '60' ? API.RE_DISPATCH_CAR : API.DISPATCH_CAR;

        Alert.alert('',
            '您是否选择：'+'\n' + `${driverOption.carNum}` + `驾驶司机${driver.driverName}，`  + '作为本次运输的车辆和司机',
            [
                {
                    text: '取消', onPress: () => {console.log('取消')},
                },
                {
                    text: '确定', onPress: () => {
                        this.props._disPatchCar({
                            carId: driverOption.carId, // 车辆id
                            carLen: driverOption.carLen, // 车辆长度
                            carNo: driverOption.carNum, // 车辆牌号
                            carType: para.carType, // 车辆类型
                            carrierName: global.ownerName, //承运商名字
                            carryCapacity: driverOption.carryCapacity, // 车辆载重
                            companyCode: global.companyCode, // 承运商code
                            companyPhone: global.phone, // 承运商手机号
                            driverId: driver.id, // 司机id
                            driverName: driver.driverName, // 司机姓名
                            driverPhone: driver.driverPhone, // 司机手机号
                            orderSource: 1, // 订单来源： 1.交易中心 2.调度中心
                            resourceCode: para.resourceCode, // 货源id
                            }, callback, api);
                    }
                }
            ]
            );
    }

    renderListEmpty() {
        return(
            <View>

            </View>
        );
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'司机列表'}
                    router={navigator}
                    // optTitle='添加司机'
                    // hiddenBackIcon={false}
                    // optTitleStyle={{fontSize: 15, color: '#666666'}}
                    // firstLevelClick={() => {
                    //     this.props.navigation.dispatch({ type: RouteType.ROUTE_ADD_DRIVER2 });
                    // }}
                />
                {
                    this.state.data.length > 0 ? <RadioList
                        options={this.state.data}
                        renderEmpty={this.renderListEmpty}
                        maxSelectedOptions={1}
                        selectedOptions={selectedArr}
                        onSelection={(option) => {
                            selected = option;
                            if(selectedArr.length < 1) {
                                selectedArr.push(selected);
                            }
                        }}
                    /> : <View style={{flex: 1}}/>
                }
                <BottomButton
                    text={'提交'}
                    onClick={() => {
                        if(selected){
                            this.arrangeCar(selected, this.arrangeCarCallback);
                        }else {
                            Alert.alert('提示','请选择承运的司机');
                        }
                    }}
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
});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
        carrierCode: state.user.get('companyCode'),
    };
}

function mapDispatchToProps (dispatch){
    return {
        getDriverList: (params, callback) => {
            dispatch(fetchData({
                api: API.API_QUERY_DRIVER_BID_CAR_LIST,
                method: 'POST',
                body: params,
                success: (data)=>{
                    callback(data);
                },
                fail: (error)=>{
                    Toast.showShortCenter(error.message);
                }
            }))
        },
        _disPatchCar:(params, callback, api)=>{
            dispatch(fetchData({
                api: api,
                method: 'POST',
                body: params,
                success: (data)=>{
                    callback(data);
                    // console.log("------- 获取到供应商的司机。。。",data);
                    // data.pageNo = params.pageNo;
                        // dispatch(getFreeCarList(data))
                    // dispatch(appendLogToFile('调度车辆','获取可调度车辆列表',startTime))
                },
                fail: (error) => {
                    Toast.showShortCenter(error.message);
                }
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(arrangeDriverList);

