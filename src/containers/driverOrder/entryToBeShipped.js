import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    ImageBackground,
} from 'react-native';

import NavigatorBar from '../../components/common/navigatorbar';
import EntryTest from './orderToBeShippedDetails';
import EntryUploadODO from './orderToBeUploadODODetail';
import * as API from '../../constants/api';
import Storage from '../../utils/storage';
import prventDoubleClickUtil from '../../utils/prventMultiClickUtil'
import Toast from '@remobile/react-native-toast';
// import {isReSetCity} from '../../../../action/order';
import StorageKey from '../../constants/storageKeys';
import * as StaticColor from '../../constants/colors';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import {fetchData} from '../../action/app';
import {
    refreshDriverOrderList,
    changeOrderTabAction,
} from '../../action/driverOrder';
import * as RouteType from '../../constants/routeType';
import EmptyView from '../../components/common/emptyView';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        paddingBottom: 14,
        paddingTop: 14,

    },
    carrierView: {
        flexDirection: 'row',
        backgroundColor: StaticColor.WHITE_COLOR,
        alignItems: 'center'
    },
    rightButton: {
        fontSize: 16,
        color: StaticColor.BLUE_BACKGROUND_COLOR,
    }

});
let transOrderInfo = [];
let userID = '';
let userName = '';
let plateNumber = '';
let currentTime = 0;
let lastTime = 0;
let locationData = '';

class entryToBeShipped extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            datas: [],
            current: 1,
            transOrderList: params.transOrderList,
            scheduleCode: params.scheduleCode,
            isShowEmptyView: true,
            carrierName: params.carrierName,
            carrierPlateNum: params.carrierPlateNum,
            isCompany: params.isCompany,
            isUploadOdoFlag: true,
            orderSource: params.orderSource
        };

        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.uploadODO = this.uploadODO.bind(this);

        this.getOrderDetailInfo = this.getOrderDetailInfo.bind(this);
        this.getOrderDetailInfoFailCallBack = this.getOrderDetailInfoFailCallBack.bind(this);
        this.getOrderDetailInfoSuccessCallBack = this.getOrderDetailInfoSuccessCallBack.bind(this);

        this.sendOrder = this.sendOrder.bind(this);
        this.sendOderFailCallBack = this.sendOderFailCallBack.bind(this);
        this.sendOderSuccessCallBack = this.sendOderSuccessCallBack.bind(this);

        this.cancelOderSuccessCallBack = this.cancelOderSuccessCallBack.bind(this);
        this.cancelOderFailCallBack = this.cancelOderFailCallBack.bind(this);

        this.jumpAddressPage = this.jumpAddressPage.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);

        this.isShowEmptyView = this.isShowEmptyView.bind(this);
        this.emptyView = this.emptyView.bind(this);
        this.contentView = this.contentView.bind(this);

    }

    componentDidMount() {
        this.getCurrentPosition();
        this.getOrderDetailInfo();
        Storage.get(StorageKey.USER_INFO).then((userInfo) => {
            if(userInfo) {
                console.log('Storage userId=', userInfo.userId);
                console.log('Storage userName=', userInfo.userName);
                userID = userInfo.userId;
                userName = userInfo.userName;
            }
        });
        Storage.get(StorageKey.PlateNumber).then((plate) => {
            if(plate) {
                plateNumber = plate;
            }
        });
        this.listener = DeviceEventEmitter.addListener('refreshShippedDetails',() => {
            this.getOrderDetailInfo();
        });
    }
    // 获取当前位置
    getCurrentPosition(){
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }
    componentWillUnmount() {
        transOrderInfo = Array();
    }

    onScrollEnd(event) {
        // 得出滚动的位置
        const index = event.nativeEvent.contentOffset.x / screenWidth + 1;
        if (index < 1 || index > this.state.datas.length) {
            return;
        }
        this.setState({
            current: parseInt(index),
        });
    }

    /*
     * 获取列表详情调用接口
     *
     */
    getOrderDetailInfo() {
        currentTime = new Date().getTime();
        if(this.state.orderSource == 2){ // 运输中心订单
            this.props._getOrderDetail({
                transCodeList: this.state.transOrderList,
                plateNumber: this.props.plateNumber
            },
            API.API_NEW_GET_GOODS_SOURCE,
            (responseData) => {
                this.getOrderDetailInfoSuccessCallBack(responseData);
            }, () => {
                this.getOrderDetailInfoFailCallBack();
            })
        }else { // 撮合订单
            this.props._getOrderDetail({
                transCodeList: this.state.transOrderList,
                plateNumber: this.props.plateNumber,
                orderSource: this.state.orderSource
            },
            API.API_GET_GOODS_SOURCE_INFO,
            (responseData) => {
                this.setState({
                    datas: responseData,
                    isShowEmptyView: false,
                });
            }, () => {
                Toast.showShortCenter('获取订单详情失败!');
                this.setState({
                    isShowEmptyView: true,
                });
            })
        }
    }

    // 获取数据成功回调
    getOrderDetailInfoSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取订单详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '待发运订单详情页面');
        const array = [];
        transOrderInfo = Array();
        for (let i = 0; i < result.length; i++) {
            let obj = result[i];
            let goodsInfo = [];
            for (let i = 0; i < obj.goodsInfo.length; i++) {
                let object = obj.goodsInfo[i];
                let oo = {
                    arNums: object.arNums,
                    goodsId: object.goodsId,
                    goodsName: object.goodsName,
                    goodsSpce: object.goodsSpce,
                    goodsUnit: object.goodsUnit,
                    refuseNum: object.refuseNum,
                    refuseReason: object.refuseReason,
                    shipmentNum: object.shipmentNum,
                    signNum: object.signNum,
                    weight: object.weight,
                    paasLineNo: object.paasLineNo
                };
                if (oo.shipmentNum === '0' || !oo.shipmentNum || oo.shipmentNum === 0) {
                    oo.shipmentNum = oo.arNums;
                }
                if (!oo.arNums || oo.arNums === '0' || oo.arNums === '') {
                    oo.shipmentNum = oo.weight;
                }
                goodsInfo.push(oo);
            }
            obj.goodsInfo = goodsInfo;
            array.push(obj);
            // 默认发运数据
            const goodsInfoList = [];
            for (let j = 0; j < obj.goodsInfo.length; j++) {
                const goods = obj.goodsInfo[j];
                goodsInfoList.push({
                    goodsId: goods.goodsId,
                    shipmentNums: goods.arNums === '' || goods.arNums === '0' ? goods.weight : goods.arNums,
                    refuseDetail: [
                        {
                            detailNum: goods.refuseNum,
                            refuseType: '',
                        },
                    ],
                    refuseNum: goods.refuseNum,
                    signNum: goods.signNum,
                    paasLineNo: goods.paasLineNo,
                });
            }
            transOrderInfo.push({
                transCode: obj.transCode,
                goodsInfo: goodsInfoList,
            });
        }
        console.log(JSON.stringify(transOrderInfo));
        this.setState({
            datas: array,
            isShowEmptyView: false,
        });
        for(let i = 0; i < array.length; i++){
            if( array[i].orderFrom === '10' && array[i].isUploadOdo === 'N' && array[i].transOrderType !== '602') {
                this.setState({
                    isUploadOdoFlag: false
                });
                break;
            }
            this.setState({
                isUploadOdoFlag: true
            });
        }
    }

    // 获取数据失败回调
    getOrderDetailInfoFailCallBack() {
        Toast.showShortCenter('获取订单详情失败!');
        this.setState({
            isShowEmptyView: true,
        });
    }

    // 点击发运调用接口
    sendOrder() {
        currentTime = new Date().getTime();
        if (this.state.orderSource === 2) { // 运输中心订单
            for(let k = 0; k < this.state.datas.length; k++) {
                let orderFrom = this.state.datas[k].orderFrom;
                if(orderFrom === '20') {
                    for(let j = 0; j < transOrderInfo.length; j++) {
                        let goodInfo = transOrderInfo[j].goodsInfo;
                        if(goodInfo.length > 0) {
                            for (let i = 0; i < goodInfo.length; i++){
                                let obj = goodInfo[i];
                                if (!obj.shipmentNums || obj.shipmentNums === '') {
                                    Toast.showShortCenter('发运数量不能为空');
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            // 传递参数
            this.props._sendOrderAction({
                userId: userID,
                userName,
                scheduleCode: this.state.scheduleCode,
                transOrderInfo,
                plateNum: global.plateNumber,
            },
            API.API_NEW_DESPATCH,
            (result) => {
                if(result == 1){
                    this.sendOderSuccessCallBack(result);
                }else {
                    Toast.showShortCenter('发运失败!');
                }
            }, (error) => {
                this.sendOderFailCallBack(error);
            })
        } else { // 撮合订单
            // 传递参数
            this.props._sendOrderAction({
                resourceCode: this.state.scheduleCode,
                driverName: userName,
                driverId: userID,
                carNo: global.plateNumber,
                },
            API.API_MATCH_DESPATCH,
            (result) => {
                if(result){
                    this.sendOderSuccessCallBack(result);
                } else {
                    Toast.showShortCenter('发运失败!');
                }
            }, (error) => {
                this.sendOderFailCallBack(error);
            })
        }
    }

    // 获取数据成功回调
    sendOderSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('发运',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '待发运订单详情页面');
        Toast.showShortCenter('发运成功!');
        this.props._refreshOrderList(0);
        this.props._refreshOrderList(1);
        this.props._changeOrderTab(2);
        this.props.navigation.dispatch({type: 'pop'});
    }

    // 获取数据失败回调
    sendOderFailCallBack(error) {
        Toast.showShortCenter(error.message);
    }

    // 获取数据成功回调
    cancelOderSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('取消接单',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '待发运订单详情页面');
        Toast.showShortCenter('取消成功!');
        this.props._refreshOrderList(0);
        this.props._refreshOrderList(1);
        // 取消接单后，刷新货源列表
        DeviceEventEmitter.emit('resetGood');
        this.props.navigation.dispatch({type: 'pop'});
    }

    // 获取数据失败回调
    cancelOderFailCallBack() {
        Toast.showShortCenter('取消失败!');
    }

    jumpAddressPage(index, type, item) {
        let typeString = '';
        if (type === 'departure') {
            // 发货方
            typeString = 'send';
        } else {
            // 收货方
            typeString = 'receiver';
        }
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_BAIDU_MAP_PAGE,
            params: {
                sendAddr: item.deliveryInfo.departureAddress,
                receiveAddr: item.deliveryInfo.receiveAddress,
                clickFlag: typeString,
            },
        });
    }

    cancelOrder() {
        if (this.state.isShowEmptyView) {
            return;
        }
        Alert.alert(
            null,
            '您确认取消本次运输吗？',
            [
                {
                    text: '取消',
                },
                {
                    text: '确认',
                    onPress: () => {
                        if (prventDoubleClickUtil.onMultiClick()) {
                            currentTime = new Date().getTime();
                            this.props._cancelOrderAction({
                                userId: userID,
                                userName,
                                plateNumber,
                                dispatchCode: this.state.scheduleCode,
                            }, (result) => {
                                this.cancelOderSuccessCallBack(result);
                            }, () => {
                                this.cancelOderFailCallBack();
                            });
                        }
                    },
                },
            ],
            {cancelable: false},
        );
    }

    // 上传出库单界面
    uploadODO(data) {
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_UPLOAD_ODO_PAGE,
            params: {
                departureContactName: data.deliveryInfo.departureContactName,
                departurePhoneNum: data.deliveryInfo.departurePhoneNum,
                receiveContact: data.deliveryInfo.receiveContact,
                orderCode: data.orderCode,
                customCode: data.customerOrderCode,
                scheduleCode: this.state.scheduleCode,
            }
        });
    }


    isShowEmptyView(navigator) {
        return (
            this.state.isShowEmptyView ? this.emptyView(navigator) : this.contentView(navigator)
        );
    }

    emptyView(navigator) {
        return (
            <View>
                <NavigatorBar
                    title={'订单详情'}
                    router={navigator}
                    hiddenBackIcon={false}
                />
                <EmptyView content="获取订单详情失败"/>
            </View>
        );
    }


    contentView(navigator) {
        const dispatchView = this.state.datas.map((item, index) => {
            return (
                <EntryTest
                    key={index + item.transCode}
                    style={{ overflow: 'hidden' }}
                    deliveryInfo={item.deliveryInfo}
                    goodsInfoList={item.goodsInfo}
                    taskInfo={item.taskInfo}
                    time={item.time}
                    dispatchTime={item.dispatchTime}
                    transCode={item.transCode}
                    customerOrderCode={item.customerOrderCode}
                    transOrderStatus={item.transOrderStatsu}
                    transOrderType={item.transOrderType}
                    scheduleTime={item.scheduleTime}
                    scheduleTimeAgain={item.twoScheduleTime}
                    vol={item.vol}
                    weight={item.weight}
                    num={item.qty}
                    index={index}
                    orderSource={this.state.orderSource}
                    currentStatus={this.props.currentStatus}
                    addressMapSelect={(indexRow, type) => {
                        this.jumpAddressPage(indexRow, type, item);
                    }}
                    chooseResult={(indexRow, obj) => {
                        transOrderInfo[indexRow] = obj;
                    }}
                />
            );
        });
        const uploadODOView = this.state.datas.map((item, index) => {
            return (
                <EntryUploadODO
                    key={index}
                    style={{ overflow: 'hidden' }}
                    deliveryInfo={item.deliveryInfo}
                    goodsInfoList={item.goodsInfo}
                    taskInfo={item.taskInfo}
                    time={item.time}
                    dispatchTime={item.dispatchTime}
                    transCode={item.transCode}
                    customerOrderCode={item.customerOrderCode}
                    transOrderStatus={item.transOrderStatsu}
                    transOrderType={item.transOrderType}
                    scheduleTime={item.scheduleTime}
                    scheduleTimeAgain={item.twoScheduleTime}
                    vol={item.vol}
                    weight={item.weight}
                    num={item.qty}
                    index={index}
                    currentStatus={this.props.currentStatus}
                    orderFrom={item.orderFrom}
                    isUploadOdo={item.isUploadOdo}
                    addressMapSelect={(indexRow, type) => {
                        this.jumpAddressPage(indexRow, type, item);
                    }}
                    uploadODO={() => {
                        this.uploadODO(item);
                    }}
                    chooseResult={(indexRow, obj) => {
                        transOrderInfo[indexRow] = obj;
                    }}
                />
            );
        });
        const bottomView = <BottomButton
            onClick={() => {
            if (prventDoubleClickUtil.onMultiClick()) {
                this.sendOrder();
            }
        }}
            text="发运"
        />;

        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'订单详情'}
                    router={navigator}
                    hiddenBackIcon={false}
                    optTitle={this.state.isCompany && this.state.isCompany == '1' || this.state.orderSource === 1 ? null : '取消接单'}
                    optTitleStyle={styles.rightButton}
                    firstLevelClick={this.state.isCompany && this.state.isCompany == '1' || this.state.orderSource === 1 ? {} :
                        () => {
                        this.cancelOrder();
                    }}
                />
                <Text style={{textAlign: 'center', marginTop: 10, height: 20, fontSize: 16, color: StaticColor.COLOR_LIGHT_GRAY_TEXT}}>
                    {this.state.current}/{this.state.datas.length}
                </Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    style={styles.container}
                    horizontal={true}
                    pagingEnabled={true}
                    onMomentumScrollEnd={this.onScrollEnd}
                    onScrollEndDrag={this.onScrollEnd}
                >
                    { this.state.isUploadOdoFlag ? dispatchView : uploadODOView }
                </ScrollView>
                { this.state.isUploadOdoFlag ? bottomView : null }
            </View>
        );
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                {
                    this.state.isShowEmptyView ? this.emptyView(navigator) : this.contentView(navigator)
                }

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
        plateNumber: state.user.get('plateNumber'),
        currentStatus: state.user.get('currentStatus'),
        carrierCode: state.user.get('companyCode'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // 获取订单详情
        _getOrderDetail: (params, api, callBack, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: api,
                success: data => {
                    console.log('get order details success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error);
                    failCallBack && failCallBack()
                }
            }))
        },
        _cancelOrderAction: (params, callBack, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_NEW_DRIVER_CANCEL_ORDER,
                success: data => {
                    console.log('cancel order success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error);
                    failCallBack && failCallBack()
                }
            }))
        },
        _sendOrderAction: (params, api, callBack, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: api,
                success: data => {
                    console.log('send order success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error);
                    failCallBack && failCallBack(error)
                }
            }))
        },
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        },
        _changeOrderTab: (orderTab) => {
            dispatch(changeOrderTabAction(orderTab));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(entryToBeShipped);
