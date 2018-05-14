/**
 * 订单列表组件
 * Created by xizhixin on 2018/2/26.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Platform,
    Alert,
} from 'react-native';
import LoadMoreFooter from '../common/loadMoreFooter'
import UniqueUtil from '../../utils/unique';
import emptyList from '../../../assets/img/emptyView/nodata.png';
import OrdersItemCell from '../../components/driverOrder/ordersItemCell';
import OrderTransportCell from '../../components/driverOrder/orderTransportCell';
import OrderReceiptCell from '../../components/driverOrder/orderReceiptCell';
import * as StaticColor from '../../constants/colors';
import Toast from '@remobile/react-native-toast';
import * as RouteType from '../../constants/routeType';
import PermissionsManager from '../../utils/permissionManager';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

class driverOrderListItem extends Component {
    constructor (props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.renderRowItem = this.renderRowItem.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.transportsList = this.transportsList.bind(this);

    }
    componentDidMount() {

    }
    // 待发运及全部item
    renderRow(data){
        const dataRow = data.item;
        const pushTime = dataRow.time ? dataRow.time.replace(/-/g,'/').substring(0, dataRow.time.length - 3) : '';
        let arrivalTime = '';
        if(dataRow.orderSource === 1){
            arrivalTime = dataRow.arrivalTime ? dataRow.arrivalTime.replace(/-/g,'/').substring(0, 10) : '';
        }else {
            arrivalTime = dataRow.arrivalTime ? dataRow.arrivalTime.replace(/-/g,'/').substring(0, 16) : '';
        }
        // 货品类型
        const orderDetailTypeList = dataRow.ofcOrderDetailTypeDtoList;
        let goodTepesTemp = [];
        let goodTypesName = [];
        if(orderDetailTypeList && orderDetailTypeList.length > 0) {
            let good = '';
            for (let i = 0; i < orderDetailTypeList.length; i++) {
                good = orderDetailTypeList[i];
                goodTepesTemp = goodTepesTemp.concat(good.goodsTypes);
            }
            // 去重
            goodTypesName = UniqueUtil.unique(goodTepesTemp);
        } else {
            goodTypesName.push('其他');
        }
        return (
            <OrdersItemCell
                time={pushTime}
                scheduleCode={dataRow.scheduleCode}
                scheduleRoutes={dataRow.scheduleRoutes}
                distributionPoint={dataRow.distributionPoint}
                arrivalTime={arrivalTime}
                weight={dataRow.weight}
                vol={dataRow.vol}
                stateName={dataRow.stateName === '已接单' ? '待发运' : dataRow.stateName}
                dispatchStatus={dataRow.dispatchStatus}
                orderStatus={this.props.type}
                goodKindsNames={goodTypesName} // 货品种类
                waitBeSureOrderNum={dataRow.waitBeSureOrderNum}
                beSureOrderNum={dataRow.beSureOrderNum}
                transCodeNum={dataRow.transCodeNum}
                goodsCount={dataRow.num}
                temperature={dataRow.temperature && dataRow.temperature != '0-0'? `${dataRow.temperature}℃` : ''}
                currentStatus={this.props.currentStatus}
                carrierName={dataRow.carrierName}
                carrierPlateNum={dataRow.carrierPlateNum}
                isBindGps={dataRow.isBindGps}
                gpsType={dataRow.gpsType}
                orderType={dataRow.orderSource}
                bindGPS={() => {
                    if(Platform.OS === 'ios'){
                        PermissionsManager.cameraPermission().then(data => {
                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_SCAN_GPS_PAGE,
                            })
                        }).catch(err=>{
                            Alert.alert(null,err.message)
                        });
                    }else {
                        PermissionsManagerAndroid.cameraPermission().then(data => {
                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_SCAN_GPS_PAGE,
                            })
                        }).catch(err=>{
                            Alert.alert('提示','请到设置-应用-授权管理设置相机权限')
                        });
                    }
                }}
                checkGPS={() =>{
                    this.props.navigation.dispatch({
                        type: RouteType.ROUTE_GPS_DETAIL_PAGE,
                    })
                }}
                onSelect={() => {
                    if (dataRow.distributionPoint === 0) {
                        Toast.showShortCenter('暂无详情');
                        return;
                    }
                    if (this.props.type === 0) {
                        if (dataRow.stateName === '待发运' || dataRow.stateName === '已接单') {
                            // 待发运
                            this.props.navigation.dispatch({
                                type:RouteType.ROUTE_ORDER_SHIPPED_PAGE,
                                params: {
                                    transOrderList: dataRow.transOrderList,
                                    scheduleCode: dataRow.scheduleCode,
                                    carrierName: dataRow.carrierName,
                                    carrierPlateNum: dataRow.carrierPlateNum,
                                    isCompany: dataRow.isCompany,
                                    orderSource: dataRow.orderSource
                                }
                            });
                        } else {
                            // 待签收、待回单、已完成
                            this.props.navigation.dispatch({
                                type:RouteType.ROUTE_ORDER_SIGN_IN_PAGE,
                                params: {
                                    transOrderList: dataRow.transOrderList,
                                    carrierName: dataRow.carrierName,
                                    carrierPlateNum: dataRow.carrierPlateNum,
                                    orderSource: dataRow.orderSource
                                }
                            });
                        }

                    } else if (this.props.type === 1) {
                        // 待发运，跳转到 待发运
                        this.props.navigation.dispatch({
                            type:RouteType.ROUTE_ORDER_SHIPPED_PAGE,
                            params: {
                                transOrderList: dataRow.transOrderList,
                                scheduleCode: dataRow.scheduleCode,
                                carrierName: dataRow.carrierName,
                                carrierPlateNum: dataRow.carrierPlateNum,
                                isCompany: dataRow.isCompany,
                                orderSource: dataRow.orderSource
                            }
                        });
                    } else {
                        // 其他的都跳转到  ORDER_ENTRY_TO_BE_SIGNIN
                        this.props.navigation.dispatch({
                            type:RouteType.ROUTE_ORDER_SIGN_IN_PAGE,
                            params: {
                                transOrderList: dataRow.transOrderList,
                                carrierName: dataRow.carrierName,
                                carrierPlateNum: dataRow.carrierPlateNum,
                                orderSource: dataRow.orderSource
                            }
                        });
                    }
                }}
            />
        );
    }
    // 待回单item
    renderItem(data) {
        const dataRow = data.item;
        if ( dataRow.transports.length !== 0) {
            return (
                <OrderReceiptCell
                    receiveContact={dataRow.receiveContact ? dataRow.receiveContact : ''}
                    transCodeList={dataRow.transports}
                    receiptTotalNumber={dataRow.receiptTotalNumber}
                    receiveAddress={dataRow.receiveAddress}
                    receiveContactName={dataRow.receiveContactName ? dataRow.receiveContactName : ''}
                    phoneNum={dataRow.phoneNum}
                    isBatchReceipt={dataRow.transports.length > 1}
                    notReceiptNumber={dataRow.notReceiptNumber}
                    isZp={dataRow.isZp}
                    status={dataRow.status}
                    onSelected={() => {
                        this.props.navigation.dispatch({
                            type: RouteType.ROUTE_ORDER_SIGN_IN_PAGE,
                            params: {
                                transOrderList: this.transportsList(dataRow),
                                orderSource: dataRow.orderSource
                            }
                        });
                    }}
                    onButton={() => {
                        this.props.navigation.dispatch({
                            type: RouteType.ROUTE_BATCH_UPLOAD_RECEIPT_PAGE,
                            params: {
                                transCode: this.transportsList(dataRow),
                                flag: 'receipt'
                            }
                        })
                    }}
                />
            );
        }else {
            return null;
        }
    }
    // 待签收item
    renderRowItem(data) {
        const dataRow = data.item;
        if ( dataRow.transports.length !== 0) {
            return (
                <OrderTransportCell
                    receiveContact={dataRow.receiveContact ? dataRow.receiveContact : ''}
                    transCodeList={dataRow.transports}
                    ordersNum={dataRow.transCodeNum}
                    receiveAddress={dataRow.receiveAddress}
                    receiveContactName={dataRow.receiveContactName ? dataRow.receiveContactName : ''}
                    phoneNum={dataRow.phoneNum}
                    isBatchSign={dataRow.transports.length > 1}
                    orderSignNum={dataRow.orderSignNum}
                    onSelect={() => {
                        this.props.navigation.dispatch({
                            type:RouteType.ROUTE_ORDER_SIGN_IN_PAGE,
                            params: {
                                transOrderList: this.transportsList(dataRow),
                                orderSource: dataRow.orderSource
                            }
                        });
                    }}
                    onButton={() => {
                        this.props.batchSign(dataRow);
                    }}
                />
            );
        }else {
            return null;
        }
    }

    // 运单号集合
    transportsList(dataRow) {
        let list = [];
        for (let i = 0; i < dataRow.transports.length; i++) {
            list.push(dataRow.transports[i].transCode);
        }
        return list;
    }

    _renderFooter(){
        const { dataSource } = this.props;
        if (dataSource.get('list').size > 1) {
            if (dataSource.get('hasMore')) {
                return <LoadMoreFooter />
            }else{
                return <LoadMoreFooter isLoadAll={true}/>
            }
        }else{
            return null
        }
    }

    _toEnd(){
        const {loadMoreAction, dataSource, type} = this.props;
        if (dataSource.get('isLoadingMore')){
            console.log("------ 正在加载中");
            return;
        }else if(!dataSource.get('hasMore')) {
            console.log("------ 已加载全部");
            return;
        }
        loadMoreAction(type)
    }
    _renderSeparator() {
        return (
            <View style={styles.divideLine} />
        );
    }

    _listEmptyComponent(){
        return (
            <View style={{flex:1,justifyContent: 'center',alignItems: 'center',height: SCREEN_HEIGHT-DANGER_TOP-DANGER_BOTTOM-44-80-49}}>
                <Image source={emptyList}/>
                <Text style={styles.content}>暂无数据</Text>
            </View>
        )
    }
    _keyExtractor = (item, index) => {
        return index;
    }
    render() {
        const {dataSource, type, currentStatus} = this.props;
        return (
            <View style={{flex: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,}}>
                <FlatList
                    style={{flex:1}}
                    onRefresh={()=>{
                        /* 结合isLoadingMore和isRefreshing来判断 */
                        this.props.refreshList && this.props.refreshList(type)
                    }}
                    refreshing={dataSource.get('isRefreshing')}
                    data={dataSource.get('list').toJS() || []}
                    renderItem={type === 2 ? this.renderRowItem : type === 3 ? this.renderItem : this.renderRow}
                    keyExtractor={this._keyExtractor}
                    extraData={this.state}
                    onEndReachedThreshold={0.1}
                    enableEmptySections={true}
                    onEndReached={ this._toEnd.bind(this) }
                    ItemSeparatorComponent={this._renderSeparator}
                    ListFooterComponent={this._renderFooter.bind(this)}
                    ListEmptyComponent={this._listEmptyComponent()}/>
            </View>
        )
    }

    componentWillUnmount() {

    }
}

const styles = StyleSheet.create({
    content: {
        fontSize: 17,
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        textAlign: 'center',
        marginTop: 14,
    },
    divideLine: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
})

driverOrderListItem.propTypes = {

}
export default driverOrderListItem