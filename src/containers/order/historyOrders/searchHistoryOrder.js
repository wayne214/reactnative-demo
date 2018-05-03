import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import HistoryList from './historyList';
import {fetchData} from "../../../action/app";
import Toast from '@remobile/react-native-toast';
import {getHistoryOrderList} from '../../../action/order';
import NavigatorBar from '../../../components/common/navigatorbar';
import * as RouteType from '../../../constants/routeType';
import * as StaticColor from '../../../constants/colors';
import TimePicker from 'react-native-picker-custom';
import DateHandler from '../../../utils/dateHandler';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timeContainer: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    timeTitle: {
        fontSize: 15,
        color: '#333333'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 40,
        height: 44,
        backgroundColor: StaticColor.BLUE_BUTTON_COLOR,
        alignSelf: 'center',
        borderRadius: 2
    },
    buttonText: {
        fontSize: 17,
        color: StaticColor.WHITE_COLOR,
    },
});
class searchHistoryOrder extends Component {
    constructor(props) {
        super(props);
    }
    showDatePick() {
        TimePicker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '',
            pickerData: DateHandler.createDateData(),
            pickerFontSize: 22,
            pickerBg: [225,225,225,1],
            onPickerConfirm: data => {
                this._onPickerConfirm(data)

            },
            onPickerCancel: data => {

            },
            onPickerSelect: data => {

            }
        });
        TimePicker.show();
    }
    render() {
        const {historyOrders} = this.props;
        const searchView= <View>
            <View style={{height: 65, backgroundColor: '#FFFAF4', justifyContent: 'center', paddingHorizontal: 15}}>
                <Text style={{fontSize: 14, color: '#FF8500', lineHeight: 20}}>
                    仅限查询2018年4月1日前订单，按照订单生成时间查询
                </Text>
            </View>
            <TouchableOpacity onPress={()=>{
                // 选择时间弹框
            }}>
                <View style={styles.itemContainer}>
                    <Text style={styles.timeTitle}>起始时间</Text>
                    <Text style={{fontSize: 20, color: '#666666'}}>&#xe63d;</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                // 选择时间弹框
            }}>
                <View style={styles.itemContainer}>
                    <Text style={styles.timeTitle}>截止时间</Text>
                    <Text style={{fontSize: 20, color: '#666666'}}>&#xe63d;</Text>
                </View>
            </TouchableOpacity>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        // 搜索按钮
                    }}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>搜索</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    hiddenBackIcon={false}
                    title={ '历史订单' }
                    router={this.props.navigation}
                />
                <HistoryList
                    dataSource={historyOrders}
                    itemClick={(rowData)=>
                        this.props.navigation.dispatch({
                            type: RouteType.ROUTE_ORDER_DETAIL,
                            params: {deliveryno: rowData.deliveryno, orderSource: rowData.state == '10' ? 2 : rowData.orderSource, orderStatus: rowData.state},

                        })
                    }
                    refreshList={()=> console.log('刷新')}
                    loadMore={() => console.log('加载更多')}
                />
            </View>
        )

    }

}

const mapStateToProps = (state) => {
    const {order,app, travel } = state;
    return {
        user: app.get('user'),
        historyOrders: order.get('orderHistory'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        _getHistoryOrderList: (params, api, pageNum,tabIndex) =>{
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: api,
                success: (data) => {
                    // dispatch(shouldOrderListRefreshAction(false));
                    data.orderType = tabIndex;
                    data.pageNo = pageNum;
                    dispatch(getHistoryOrderList(data));
                    console.log('data', data);
                },
                fail: (data) => {
                    Toast.showShortCenter(data.message)
                }
            }));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(searchHistoryOrder);
