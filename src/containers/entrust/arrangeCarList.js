/**
 * 安排车辆列表界面
 * Created by xizhixin on 2017/12/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Alert,
} from 'react-native';

import * as StaticColor from '../../constants/colors';
import NavigatorBar from "../../components/common/navigatorbar";
import RadioList from '../../components/common/RadioList';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import * as RouteType from '../../constants/routeType';
import Toast from '../../utils/toast';
import * as API from '../../constants/api';
import {fetchData} from "../../action/app";

let selected = null;
let selectedArr = [];

class arrangeCarList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        this.getCarList = this.getCarList.bind(this);
        this.getCarListCallback = this.getCarListCallback.bind(this);
    }
    componentDidMount() {
        this.getCarList(this.getCarListCallback);
    }

    componentWillUnmount() {
        selected = null;
        selectedArr = [];
    }
    getCarListCallback(result) {
        console.log('arrangeCarList', result);
        this.setState({
            data: result,
        });
    }
    getCarList(callback) {
        // 传递参数
        this.props.getCarList({
            companionPhone: global.phone,
            // companionPhone: '15242614692',
            carStatus: 'enable',
        }, callback);
    }

    renderListEmpty() {
        return(
            <View>

            </View>
        );
    }


    render() {
        const navigation = this.props.navigation;
        return(
            <View style={styles.container}>
                <NavigatorBar
                    title={'车辆列表'}
                    router={navigation}
                    optTitle='添加车辆'
                    hiddenBackIcon={false}
                    optTitleStyle={{fontSize: 15, color: '#666666'}}
                    firstLevelClick={() => {
                        this.props.navigation.dispatch({ type: RouteType.ROUTE_ADD_CAR2 });
                    }}
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
                    /> : null
                }
                <BottomButton
                    text={'下一步'}
                    onClick={() => {
                        console.log('this.props.navigation.state.params.data', this.props.navigation.state.params.data);
                        if(selected){
                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_ARRANGE_DRIVER_LIST,
                                params: {
                                    driverOption: selected,
                                    data: this.props.navigation.state.params.data
                                }
                            })
                            // navigator.navigate('ArrangeDriverList',{
                            //     driverOption: selected,
                            //     dispatchCode: this.state.dispatchCode,
                            // });
                        }else {
                            Alert.alert('提示','请选择承运的车辆');
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
    };
}

function mapDispatchToProps (dispatch){
    return {
        getCarList: (params, callback) => {
            dispatch(fetchData({
                api: API.API_QUERY_CAR_LIST_BY_COMPANIONINFO,
                method: 'POST',
                body: params,
                success: (data)=>{
                    callback(data);
                },
                fail: (data)=>{
                    Toast.show(data.message);

                }
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(arrangeCarList);

