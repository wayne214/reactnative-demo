import React from 'react'
import {
  Text,
  View,
  Alert,
  Dimensions,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NavigatorBar from '../../components/common/navigatorbar'
import BaseComponent from '../../components/common/baseComponent'
import styles from '../../../assets/css/home'
const { height,width } = Dimensions.get('window');
import {fetchData} from "../../action/app";
import * as API from '../../constants/api';
import { queryTrasportCarList} from '../../action/travel'
import Toast from '../../utils/toast.js';
import TrailMutilStatus from '../../components/travel/traillMutilStatus';
import OrderAndCarInfo from '../../components/travel/orderAndCarInfo';
import Linking from '../../utils/linking'
import EmptyView from '../../components/common/emptyView';
import *as ConstValue from '../../constants/constValue';

class travelDetail extends BaseComponent {

  constructor(props) {
    super(props)
    this.state = {
        carNum: this.props.navigation.state.params.carNo
    };
  }

  static propTypes = {
    router: PropTypes.object,
    click: PropTypes.func,
  }

  componentDidMount() {
    super.componentDidMount()
    this.props._queryTransportList({
        carNo: this.state.carNum
        // carNo: '冀D100RB'
    }, true)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }



  render() {
      const {navigation, transportListData} = this.props;
      console.log('transportListData', transportListData);
      const tel = transportListData.deliveryVehicleInfoDto ? transportListData.deliveryVehicleInfoDto.tel : ''
    return (
      <View style={ styles.container }>
          <NavigatorBar router={navigation} title={ '运输在途信息监控' } backViewClick={()=>{
              this.props.navigation.dispatch({type: 'pop'})
          }}/>

          {
              transportListData ? <View>
                  <View style={{backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 15, paddingTop: 15, paddingBottom: 15}}>
                      <TouchableOpacity onPress={()=> {
                          if (tel === '') {
                              Toast.show('没有随车电话')
                              return;
                          }
                          Linking.link('tel:'+ tel);
                      }}>
                          <View style={{backgroundColor: '#0092FF', flexDirection: 'row', height: 29, width: 104, alignItems: 'center', justifyContent: 'center', borderRadius: 24.5}}>
                              <Text style={{color: '#FFFFFF', fontSize: 14}}>随车电话</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
                  <TrailMutilStatus container={{height: height - (width * 324 / 710) - ConstValue.NavigationBar_StatusBar_Height - 60, backgroundColor: '#ffffff' }} addresses={transportListData.logisticInfoResDtoList}/>
                  <OrderAndCarInfo infoData={transportListData.deliveryVehicleInfoDto}/>
              </View> : <EmptyView/>
          }
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
      _queryTransportList: (params, showLoading)=> {
          // dispatch(changeEntrustOrderListLoadingMore(0));
          dispatch(fetchData({
              api: API.API_QUERY_TRANSPORT_LIST + params.carNo,
              method: 'POST',
              body: params,
              showLoading,
              success: (data)=>{
                  console.log('---data', data);
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
