import React from 'react'
import {
  Text,
  View,
  Alert,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NavigatorBar from '../../components/common/navigatorbar'
import BaseComponent from '../../components/common/baseComponent'
import styles from '../../../assets/css/home'
import * as RouteType from '../../constants/routeType';
import TransPortList from '../../components/travel/transportList';
const { height,width } = Dimensions.get('window');
import {fetchData} from "../../action/app";
import * as API from '../../constants/api';
import {getTravelCarList, refreshTravelCarList, queryTrasportCarList} from '../../action/travel'
import Toast from '../../utils/toast.js';
import TrailMutilStatus from '../../components/travel/traillMutilStatus';
import OrderAndCarInfo from '../../components/travel/orderAndCarInfo';

class travelDetail extends BaseComponent {

  constructor(props) {
    super(props)
    this.title = '行程';
    this.state = {
      dataSource: ['京A12345', '京A12355', '京A22345']
    };
  }

  static propTypes = {
    router: PropTypes.object,
    click: PropTypes.func,
  }

  componentDidMount() {
    super.componentDidMount()
    this.getCarList(1, 0);
    this.props._queryTransportList({})
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  render() {
      const {navigation} = this.props
    return (
      <View style={ styles.container }>
          <NavigatorBar router={navigation} title={ '运输在途信息监控' } backViewClick={()=>{
              this.props.navigation.dispatch({type: 'pop'})
          }}/>
            <TrailMutilStatus />
            <OrderAndCarInfo/>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { app, travel, nav } = state;
  return {
    nav,
    transportListData: travel.get('transportListData'),
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
      _queryTransportList: (params, showLoading, carType)=> {
          // dispatch(changeEntrustOrderListLoadingMore(0));
          dispatch(fetchData({
              api: API.API_QUERY_TRANSPORT_LIST,
              method: 'POST',
              body: params,
              showLoading,
              success: (data)=>{
                  // dispatch(entrustListShouldRefresh(false))
                  dispatch(queryTrasportCarList(data))
                  // dispatch(appendLogToFile('我的承运','获取我的承运-待确认列表',startTime))
              },
              fail: (data)=>{
                  Toast.show(data.message);
              }
          }))
      },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(travelDetail);
