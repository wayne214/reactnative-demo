import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import NavigationBar from '../../components/common/navigatorbar';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import * as StaticColor from '../../constants/colors';
import DriverOrderListItem from '../../components/driverOrder/driverOrderListItem';
import {receiveDriverOrderList} from '../../action/driverOrder';
import {fetchData} from '../../action/app';
import * as API from '../../constants/api';

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
    }

    componentDidMount() {
        this._refreshList(0);
    }

    componentWillReceiveProps(props) {
        const { allListData, shipListData, signListData, receiptListData } = this.props;
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
        switch (tabIndex) {
            case 0:
                console.log('订单全部界面', tabIndex);
                if (this.props.currentStatus == 'driver') {
                    // if (global.plateNumber) {
                        this.props._requestDriverOrderList({
                            carrierCode: '',
                            page: 1,
                            pageSize: 10,
                            // phone: this.state.currentStatus == 'driver' ? global.phone : '',
                            // plateNumber: this.state.currentStatus == 'driver' ? this.props.plateNumber : '',
                            phone: '15801461058',
                            plateNumber: '京LPL001',
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
                            // phone: this.state.currentStatus == 'driver' ? global.phone : '',
                            // plateNumber: this.state.currentStatus == 'driver' ? this.props.plateNumber : '',
                            phone: '15801461058',
                            plateNumber: '京LPL001',
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
                            // phoneNum: global.phone,
                            // plateNumber: this.props.plateNumber,
                            phoneNum: '15801461058',
                            plateNumber: '京LPL001',
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
                            // phone: this.props.currentStatus == 'driver' ? global.phone : '',
                            // plateNumber: this.props.currentStatus == 'driver' ? this.props.plateNumber : '',
                            phone: '15801461058',
                            plateNumber: '京LPL001',
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
                            // phone: this.state.currentStatus == 'driver' ? global.phone : '',
                            // plateNumber: this.state.currentStatus == 'driver' ? this.props.plateNumber : '',
                            phone: '15801461058',
                            plateNumber: '京LPL001',
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
                            // phone: this.state.currentStatus == 'driver' ? global.phone : '',
                            // plateNumber: this.state.currentStatus == 'driver' ? this.props.plateNumber : '',
                            phone: '15801461058',
                            plateNumber: '京LPL001',
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
                            // phoneNum: global.phone,
                            // plateNumber: this.props.plateNumber,
                            phoneNum: '15801461058',
                            plateNumber: '京LPL001',
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
                            // phone: this.props.currentStatus == 'driver' ? global.phone : '',
                            // plateNumber: this.props.currentStatus == 'driver' ? this.props.plateNumber : '',
                            phone: '15801461058',
                            plateNumber: '京LPL001',
                            queryType: 'DDD'
                        }, API.API_NEW_GET_RECEIVE_ORDER_LIST, tabIndex);
                    // }
                }
                break;
        }
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
                    // ref="ScrollableTabView"
                    // scrollWithoutAnimation={false}
                    initialPage={0}
                    tabBarUnderlineStyle={styles.tabBarUnderLine}
                    tabBarActiveTextColor={StaticColor.BLUE_CONTACT_COLOR}
                    tabBarInactiveTextColor={StaticColor.LIGHT_BLACK_TEXT_COLOR}
                    tabBarTextStyle={{fontSize: 14}}
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
                                tabIndex: object.i,
                            });
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
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(driverOrder);

