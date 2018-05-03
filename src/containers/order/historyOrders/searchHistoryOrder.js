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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
class searchHistoryOrder extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {historyOrders} = this.props;
        const searchView= <View>

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
