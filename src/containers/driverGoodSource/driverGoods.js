import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    FlatList,
    Platform,
    RefreshControl,
    InteractionManager,
    Dimensions,
    DeviceEventEmitter,
    Image,
    Text
} from 'react-native';
import moment from 'moment';
import {fetchData} from "../../action/app";
import DropdownMenu from './component/dropdownMenu';
import open from '../../../assets/img/good/open.png';
import radioButton from '../../../assets/img/good/radiobuttonIcon.png';
import * as StaticColor from '../../constants/colors';
import * as ConstValue from '../../constants/constValue';
import * as API from '../../constants/api';
import CommonListItem from './component/commonListItem';
import * as RouteType from '../../constants/routeType';
import UniqueUtil from '../../utils/unique';
import emptyList from '../../../assets/img/emptyView/nodata.png';
import LoadMoreFooter from '../../components/common/loadMoreFooter';
import {Geolocation} from 'react-native-baidu-map-xzx';

let pageNO = 1; // 第一页
const pageSize = 10; // 每页显示的数量
let list = [];
let startRow = 1;
const screenHeight = Dimensions.get('window').height;

let currentTime = 0;
let lastTime = 0;
let locationData = '';
import {appendLogToFile} from '../../action/app';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    listView: {
        backgroundColor: '#F5F5F5',
        paddingTop: 10,
        height: screenHeight - ConstValue.NavigationBar_StatusBar_Height - ConstValue.Tabbar_Height,
    },
    dropDown: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
                marginTop: 20,
            },
            android: {
                height: 64,
            },
        }),
    },
    content: {
        fontSize: 17,
        color: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        textAlign: 'center',
        marginTop: 14,
    },
});
class driverGoods extends Component {
    constructor(props) {
        super(props);
        const initLength = Platform.OS === 'ios' ? 1 : 0;
        this.state = {
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            goodStatus: '1',
            dataSource: [],
            isLoadMore: true,
            isRefresh: false,
            goodsListLength: initLength,
        };
        this.getData = this.getData.bind(this);
        this.getDataSuccessCallBack = this.getDataSuccessCallBack.bind(this);
        this.getDataFailCallBack = this.getDataFailCallBack.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.resetParams();
        pageNO = 1;
        if (pageNO === 1) {
            this.setState({
                isRefresh: true,
            });
        }
        this.getDataAndCallBack(this.state.goodStatus, this.state.date, pageNO);
        this.listener = DeviceEventEmitter.addListener('resetGood', () => {
            this.receiveEventAndFetchData();
        });
        // this.stateListener = DeviceEventEmitter.addListener('getCarrierCode', () => {
        //     this.ownerVerifiedHome();
        // });
    }
    componentWillUnmount() {
        this.listener.remove();
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }
    // 收到监听后进行网络请求
    receiveEventAndFetchData() {
        this.resetParams();
        if (pageNO === 1) {
            this.setState({
                isRefresh: true,
            });
        }
        const resetDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.getDataAndCallBack('1', resetDate, pageNO);
        this.setState({
            goodStatus: '1',
            date: resetDate,
        });
    }
    // 重置数据
    resetParams() {
        list = [];
        pageNO = 1;
        this.setState({
            dataSource: list,
        });
    }
    // 加载更多
    loadMoreData() {
        if (!this.state.isLoadMore) {
            return;
        }
        pageNO = parseInt(startRow / pageSize, 10) + 1;
        this.getDataAndCallBack(this.state.goodStatus, this.state.date, pageNO);
    }
    // 到达底部的时候会自动触发此方法
    toEnd() {
        // ListView滚动到底部，根据是否正在加载更多 是否正在刷新 是否已加载全部来判断是否执行加载更多
        if (!this.state.isLoadMore || this.state.isRefresh || this.state.goodsListLength === 0) {
            return;
        }
        InteractionManager.runAfterInteractions(() => {
            console.log('触发加载更多 toEnd() --> ');
            this.loadMoreData();
        });
    }

    // listView的分割线
    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`{sectionID}-${rowID}`}
                style={{height: 10, backgroundColor: '#F5F5F5'}}
            />
        );
    }
    // 成功回调
    getDataSuccessCallBack(result) {
        console.log('=goodResult',result);
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('根据时间查询调度单', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '货源页面');
        startRow = result.startRow + pageSize;
        console.log('....startRow', startRow, result.list.length);
        if (result.total <= startRow || result.total === 0) {
            this.setState({
                isLoadMore: false,
                goodsListLength: result.list.length,
            });
        } else {
            this.setState({
                isLoadMore: true,
                goodsListLength: result.list.length,
            });
        }

        if (pageNO === 1) {
            list = [];
        }
        if (result.list.length === 0) {
            this.setState({
                dataSource: list,
                isRefresh: false,
                goodsListLength: 0,
            });
        } else {
            list = list.concat(result.list);
            console.log('goooododisfiodojif---list,', list);
            this.setState({
                dataSource: list,
                isRefresh: false,
            });
        }
        // this.getTotalProduct(result.total);
    }
    // 失败回调
    getDataFailCallBack() {
        this.setState({
            isRefresh: false,
            goodsListLength: 0,
        });
    }
    // 获取数据
    getData(status, endTime, pageNo) {
        currentTime = new Date().getTime();
        // const beginTimeTemp = this.getPreMonth(moment(new Date()).format('YYYY-MM-DD'));
        // const plateNumber = this.props.userPlateNumber;
        if(this.props.currentStatus == 'driver') {
            // global.plateNumber = '京LPL001';
            if (global.plateNumber) {
                this.props._getData({
                    beginTime: '2017-06-01 00:00:00',
                    endTime: endTime,
                    pageNum: pageNo,
                    pageSize,
                    driverPhone: global.phone,
                    status,
                    plateNumber: global.plateNumber,
                }, this.getDataSuccessCallBack, this.getDataFailCallBack);
            } else {
                list = [];
                this.setState({
                    isRefresh: false,
                    goodsListLength: 0,
                });
            }
        }else {
            // if (!this.props.carrierCode) {
            //     list = [];
            //     this.setState({
            //         isRefresh: false,
            //         goodsListLength: 0,
            //     });
            //     return;
            // }
        }
    }
    getDataAndCallBack(goodStatus, date, pageNo) {
        this.getData(goodStatus, date, pageNo);
    }

    // 刷新
    onRefresh() {
        if (pageNO === 1) {
            this.setState({
                isRefresh: true,
            });
        }
        this.resetParams();
        this.getDataAndCallBack(this.state.goodStatus, this.state.date, pageNO);
    }

    renderRow(data) {
        const dataRow = data.item;
        const pushTime = dataRow.pushTime ? dataRow.pushTime.replace(/-/g,'/').substring(0, dataRow.pushTime.length - 3) : '';
        const arrivalTime = dataRow.arrivalTime ? dataRow.arrivalTime.replace(/-/g,'/').substring(0, dataRow.arrivalTime.length - 3) : '';
        // 货品类型
        const orderDetaiTypeList = dataRow.ofcOrderDetailTypeDtoList;
        let goodTepesTemp = [];
        let goodTypesName = [];
        if(orderDetaiTypeList && orderDetaiTypeList.length > 0) {
            let good = '';
            for (let i = 0; i < orderDetaiTypeList.length; i++) {
                good = orderDetaiTypeList[i];
                goodTepesTemp = goodTepesTemp.concat(good.goodsTypes);
            }
            // 去重
            goodTypesName = UniqueUtil.unique(goodTepesTemp);
        } else {
            goodTypesName.push('其他');
        }
        return (
            <CommonListItem
                time={pushTime}
                transCode={dataRow.dispatchCode}
                dispatchLine={dataRow.scheduleRoutes ? dataRow.scheduleRoutes : ''} // 调度路线
                distributionPoint={dataRow.distributionPoint !== null ? `${dataRow.distributionPoint}个` : ''}
                arriveTime={arrivalTime}
                weight={dataRow.weight !== null ? dataRow.totalWeight: ''}
                vol={dataRow.vol !== null ? dataRow.totalVolume : ''}
                showRejectIcon={this.state.goodStatus !== '1'}
                allocationModel={dataRow.allocationModel}
                goodKindsNames={goodTypesName} // 货品种类
                orderCount={dataRow.transCodeNum ? dataRow.transCodeNum : ''} // 订单总数
                goodsCount={dataRow.goodsQuantity}
                temperature={dataRow.temperature && dataRow.temperature != '0-0' ? `${dataRow.temperature}℃` : ''}
                onSelect={() => {
                    this.props.navigation.dispatch({type: RouteType.ROUTE_DRIVER_GOOD_DETAIL_PAGE,
                    params: {
                        transOrderList: dataRow.transOrderList, // 运单号
                        scheduleCode: dataRow.dispatchCode,
                        scheduleStatus: this.state.goodStatus,
                        allocationModel: dataRow.allocationModel,
                        bidEndTime: dataRow.bidEndTime,
                        bidStartTime: dataRow.bidBeginTime,
                        refPrice: dataRow.refPrice,
                        getOrderSuccess: () => {
                            // 刷新
                            // InteractionManager.runAfterInteractions(() => {
                                this.onRefresh();
                            // });
                        },
                    }});
                }}
            />
        );
    }

    _renderFooter(){
        if (this.state.dataSource.length > 1) {
            if (this.state.isLoadMore) {
                return <LoadMoreFooter />
            }else{
                return <LoadMoreFooter isLoadAll={true}/>
            }
        }else{
            return null
        }
    }

    _listEmptyComponent(){
        return (
            <View style={{flex:1,justifyContent: 'center',alignItems: 'center',height: SCREEN_HEIGHT-DANGER_TOP-DANGER_BOTTOM-64-49}}>
                <Image source={emptyList}/>
                <Text style={styles.content}>暂无数据</Text>
            </View>
        )
    }
    _keyExtractor = (item, index) => {
        return index;
    }

    render() {
        const data = [['待处理', '拒绝']];
        return (
            <View style={styles.container}>
                <DropdownMenu
                    style={styles.dropDown}
                    arrowImg={open}
                    checkImage={radioButton}
                    bgColor={StaticColor.WHITE_COLOR}
                    tintColor={StaticColor.LIGHT_BLACK_TEXT_COLOR}
                    selectItemColor={'black'}
                    data={data}
                    isShow={false}
                    handler={(selection, row) => {
                        this.resetParams();
                        data[selection][row] === '待处理' ?
                            this.getDataAndCallBack('1', this.state.date, pageNO)
                            : this.getDataAndCallBack('2', this.state.date, pageNO);

                        data[selection][row] === '待处理' ?
                            this.setState({goodStatus: '1'})
                            : this.setState({goodStatus: '2'});
                    }
                    }
                    preferences={() => {
                        this.props.navigation.navigate('GoodsPreferencePage');
                    }}
                >
                    <View style={{backgroundColor: '#e6eaf2', height: 0.5}}/>
                        <FlatList
                            style={styles.listView}
                            onRefresh={()=>{
                                this.onRefresh();
                            }}
                            refreshing={this.state.isRefresh}
                            data={this.state.dataSource}
                            renderItem={this.renderRow}
                            keyExtractor={this._keyExtractor}
                            extraData={this.state}
                            onEndReachedThreshold={0.1}
                            enableEmptySections={true}
                            onEndReached={ this.toEnd.bind(this) }
                            ItemSeparatorComponent={this.renderSeparator}
                            ListFooterComponent={this._renderFooter.bind(this)}
                            ListEmptyComponent={this._listEmptyComponent()}
                        />
                </DropdownMenu>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        _getData: (params, successCallback, failCallback) => {
            let startTime = new Date().getTime();
            dispatch(fetchData({
                body: params,
                method: 'POST',
                // showLoading: true,
                api: API.API_NEW_GET_SOURCE_BY_DATE,
                success: data => {
                    console.log('-login_data', data);
                    // dispatch(appendLogToFile('根据时间查询调度单', '司机货源列表', startTime));
                    successCallback(data);
                },
                fail: () => {
                    failCallback();
                }
            }))

        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(driverGoods);

