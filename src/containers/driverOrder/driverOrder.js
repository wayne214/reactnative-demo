import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter,
    Alert,
    Dimensions
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import Toast from '@remobile/react-native-toast';
import NavigationBar from '../../components/common/navigatorbar';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import * as StaticColor from '../../constants/colors';
import DriverOrderListItem from '../../components/driverOrder/driverOrderListItem';
import {
    receiveDriverOrderList,
    changeOrderTabAction,
    refreshDriverOrderList
} from '../../action/driverOrder';
import {fetchData} from '../../action/app';
import * as API from '../../constants/api';
import * as RouteType from '../../constants/routeType';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    subContainer: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    tabBarUnderLine: {
        backgroundColor: StaticColor.BLUE_CONTACT_COLOR,
        height: 2,
    },
    tab: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 0,
    },
});

let userID = '';
let transCodeList = [];

let currentTime = 0;
let lastTime = 0;
let locationData = '';

class driverOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
        }
        this.transportsList = this.transportsList.bind(this);
        this.orderCodeList = this.orderCodeList.bind(this);
    }

    componentDidMount() {
        this._refreshList(0);
    }

    componentWillReceiveProps(props) {
        const {allListData, shipListData, signListData, receiptListData} = this.props;
        if(props){
            switch(this.state.tabIndex){
                case 0:
                    if (allListData.toJS().isRefreshing){
                        this._refreshList(0);
                    }
                    break;
                case 1:
                    if (shipListData.toJS().isRefreshing){
                        this._refreshList(1);
                    }
                    break;
                case 2:
                    if (signListData.toJS().isRefreshing){
                        this._refreshList(2);
                    }
                    break;
                case 3:
                    if (receiptListData.toJS().isRefreshing){
                        this._refreshList(3);
                    }
                    break;
            }
        }

    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch(e => {
            console.log(e, 'error');
        });
    }

    _refreshList(tabIndex = this.state.tabIndex) {
        console.log('do something to refresh list ', tabIndex);
        if (!global.phone) {
            return
        }
        switch (tabIndex) {
            case 0:
                console.log('订单全部界面', tabIndex);
                if (this.props.currentStatus == 'driver') {
                    // if (global.plateNumber) {
                        this.props._requestDriverOrderList({
                            carrierCode: '',
                            page: 1,
                            pageSize: 10,
                            phone: global.phone,
                            plateNumber: this.props.plateNumber,
                            queryType: 'AAA'
                        }, API.API_NEW_DISPATCH_DOC_WITH_PAGE, tabIndex);
                    // }
                }
                break;
            case 1:
                console.log('订单待发运界面', tabIndex);
                if (this.props.currentStatus == 'driver') {
                    // if(global.plateNumber) {
                        this.props._requestDriverOrderList({
                            carrierCode: '',
                            page: 1,
                            pageSize: 10,
                            phone: global.phone,
                            plateNumber: this.props.plateNumber,
                            queryType: 'BBB'
                        }, API.API_NEW_DISPATCH_DOC_WITH_PAGE, tabIndex);
                    // }
                }
                break;
            case 2:
                console.log('订单待签收界面', tabIndex);
                if(this.props.currentStatus == 'driver') {
                    // if(global.plateNumber){
                        this.props._requestDriverOrderList({
                            carrierCode: '',
                            pageNum: 1,
                            pageSize: 10,
                            phoneNum: global.phone,
                            plateNumber: this.props.plateNumber,
                            queryType: ''
                        }, API.API_NEW_GET_ORDER_LIST_TRANSPORT, tabIndex);
                    // }
                }
                break;
            case 3:
                console.log('订单待回单界面', tabIndex);
                if(this.props.currentStatus == 'driver') {
                    // if (global.plateNumber) {
                        this.props._requestDriverOrderList({
                            carrierCode: '',
                            page: 1,
                            pageSize: 10,
                            phone: global.phone,
                            plateNumber: this.props.plateNumber,
                            queryType: 'DDD'
                        }, API.API_NEW_GET_RECEIVE_ORDER_LIST, tabIndex);
                    // }
                }
                break;
        }

    }

    _loadMore(tabIndex = this.state.tabIndex) {
        const { allListData, shipListData, signListData, receiptListData } = this.props;
        const target = [allListData, shipListData, signListData, receiptListData][parseInt(tabIndex)];
        switch (tabIndex) {
            case 0:
                console.log('订单全部界面', tabIndex);
                if (this.props.currentStatus == 'driver') {
                    // if (global.plateNumber) {
                        this.props._requestDriverOrderList({
                            carrierCode: '',
                            page: target.get('pageNum') + 1,
                            pageSize: 10,
                            phone: global.phone,
                            plateNumber: this.props.plateNumber,
                            queryType: 'AAA'
                        }, API.API_NEW_DISPATCH_DOC_WITH_PAGE, tabIndex);
                    // }
                }
                break;
            case 1:
                console.log('订单待发运界面', tabIndex);
                if (this.props.currentStatus == 'driver') {
                    // if(global.plateNumber) {
                        this.props._requestDriverOrderList({
                            carrierCode: '',
                            page: target.get('pageNum') + 1,
                            pageSize: 10,
                            phone: global.phone,
                            plateNumber: this.props.plateNumber,
                            queryType: 'BBB'
                        }, API.API_NEW_DISPATCH_DOC_WITH_PAGE, tabIndex);
                    // }
                }
                break;
            case 2:
                console.log('订单待签收界面', tabIndex);
                if(this.props.currentStatus == 'driver') {
                    // if(global.plateNumber){
                        this.props._requestDriverOrderList({
                            pageNum: target.get('pageNum') + 1,
                            pageSize: 10,
                            phoneNum: global.phone,
                            plateNumber: this.props.plateNumber,
                        }, API.API_NEW_GET_ORDER_LIST_TRANSPORT, tabIndex);
                    // }
                }
                break;
            case 3:
                console.log('订单待回单界面', tabIndex);
                if(this.props.currentStatus == 'driver') {
                    // if (global.plateNumber) {
                        this.props._requestDriverOrderList({
                            carrierCode: '',
                            page: target.get('pageNum') + 1,
                            pageSize: 10,
                            phone: global.phone,
                            plateNumber: this.props.plateNumber,
                            queryType: 'DDD'
                        }, API.API_NEW_GET_RECEIVE_ORDER_LIST, tabIndex);
                    // }
                }
                break;
        }
    }

    transportBatchSign(dataRow) {
        currentTime = new Date().getTime();
        this.props._batchSign({
            lastOperator: global.userName,
            lastOperatorId: global.userId,
            phoneNum: global.phone,
            plateNumber: this.props.plateNumber,
            transCodeList: this.transportsList(dataRow),
            orderCodeList: this.orderCodeList(dataRow),
            lan: locationData.latitude ? locationData.latitude : '',
            lon: locationData.longitude ? locationData.longitude : '',
            realTimeAddress: locationData.address ? locationData.address : ''
        },(result) => {
            lastTime = new Date().getTime();
            ReadAndWriteFileUtil.appendFile('批量签收', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                locationData.district, lastTime - currentTime, '订单页面');
            if(dataRow.isZp === 'Y'){
                Alert.alert('提示', '是否立即批量上传回单？',
                    [
                        {
                            text: '取消',
                            onPress: () => {
                                this._refreshList(2);
                            },
                        },
                        {
                            text: '确认',
                            onPress: () => {
                                this.props.navigation.dispatch({
                                    type: RouteType.ROUTE_BATCH_UPLOAD_RECEIPT_PAGE,
                                    params: {
                                       transCode: this.transportsList(dataRow),
                                        flag: 'sign'
                                    }
                                })
                            },
                        },
                    ], {cancelable: false});
            }else {
                Toast.showShortCenter('批量签收成功');
                this._refreshList(2);
            }
        },(errorInfo) => {
            console.log('errorInfo=', errorInfo);
            if(errorInfo.code === 800){
                Alert.alert('批量签收前请先完成收款');
            }else {
                Toast.showShortCenter(errorInfo.result);
            }
        });
    }

    // 订单号集合
    orderCodeList(dataRow) {
        let list = [];
        for (let i = 0; i < dataRow.transports.length; i++) {
            list.push(dataRow.transports[i].orderCode);
        }
        return list;
    }

    // 运单号集合
    transportsList(dataRow) {
        let list = [];
        for (let i = 0; i < dataRow.transports.length; i++) {
            list.push(dataRow.transports[i].transCode);
        }
        return list;
    }

    render() {
        const navigation = this.props.navigation;
        const {
            allListData,
            shipListData,
            signListData,
            receiptListData,
        } = this.props;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'订单'}
                    router={navigation}
                    hiddenBackIcon={true}
                />
                <ScrollableTabView
                    style={{flex: 1, backgroundColor: '#e8e8e8'}}
                    ref="ScrollableTabView"
                    // scrollWithoutAnimation={false}
                    page={this.props.tabIndex}
                    tabBarUnderlineStyle={styles.tabBarUnderLine}
                    tabBarActiveTextColor={StaticColor.BLUE_CONTACT_COLOR}
                    tabBarInactiveTextColor={StaticColor.LIGHT_BLACK_TEXT_COLOR}
                    tabBarTextStyle={{fontSize: 15}}
                    tabBarBackgroundColor={StaticColor.WHITE_COLOR}
                    // locked={true}
                    renderTabBar={() =>
                        <ScrollableTabBar
                            tabStyle={styles.tab}
                        />
                    }
                    onChangeTab={(object) => {
                        console.log('object:' + object.i);
                        if(object.i != object.from){
                            this.setState({
                                tabIndex: object.i
                            });
                            this.props._changeOrderTab(object.i);
                            this._refreshList(object.i);
                        }
                    }}
                >
                    <DriverOrderListItem
                        {...this.props}
                        type={0}
                        tabLabel={'全部'}
                        dataSource={allListData}
                        refreshList={this._refreshList.bind(this)}
                        loadMoreAction={this._loadMore.bind(this)}
                    />
                    <DriverOrderListItem
                        {...this.props}
                        type={1}
                        tabLabel={'待发运'}
                        dataSource={shipListData}
                        refreshList={this._refreshList.bind(this)}
                        loadMoreAction={this._loadMore.bind(this)}
                    />
                    <DriverOrderListItem
                        {...this.props}
                        type={2}
                        tabLabel={'待签收'}
                        dataSource={signListData}
                        refreshList={this._refreshList.bind(this)}
                        loadMoreAction={this._loadMore.bind(this)}
                        batchSign={(data)=>{
                            this.transportBatchSign(data);
                        }}
                    />
                    <DriverOrderListItem
                        {...this.props}
                        type={3}
                        tabLabel={'待回单'}
                        dataSource={receiptListData}
                        refreshList={this._refreshList.bind(this)}
                        loadMoreAction={this._loadMore.bind(this)}
                    />
                </ScrollableTabView>
            </View>
        );
    }
}



function mapStateToProps(state) {
    return {
        allListData: state.driverOrder.get('allListData'),
        shipListData: state.driverOrder.get('shipListData'),
        signListData: state.driverOrder.get('signListData'),
        receiptListData: state.driverOrder.get('receiptListData'),
        currentStatus: state.user.get('currentStatus'),
        plateNumber: state.user.get('plateNumber'),
        tabIndex: state.driverOrder.get('tabIndex'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        _requestDriverOrderList: (params, api, tabIndex) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: api,
                success: data => {
                    console.log('get order list success ',data);
                    data.orderType = tabIndex;
                    dispatch(receiveDriverOrderList(data))
                },
                fail: error => {
                    console.log('???', error)
                }
            }))
        },
        _batchSign: (params, callBack, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_TRANSPORT_BATCH_SIGN,
                success: data => {
                    console.log('batch sign success ',data);
                    callBack && callBack(data);
                },
                fail: error => {
                    console.log('???', error);
                    failCallBack && failCallBack(error);
                }
            }))
        },
        _changeOrderTab: (orderTab) => {
            dispatch(changeOrderTabAction(orderTab));
        },
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(driverOrder);

