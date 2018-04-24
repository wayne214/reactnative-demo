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
import Linking from '../../utils/linking'
import * as RouteType from '../../constants/routeType';
import * as COLOR from '../../constants/colors'
import TravelCarList from '../../components/travel/travelCarList';
const { height,width } = Dimensions.get('window');
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import {fetchData} from "../../action/app";
import * as API from '../../constants/api';
import {getTravelCarList, refreshTravelCarList} from '../../action/travel';
import Toast from '@remobile/react-native-toast';

class travel extends BaseComponent {

  constructor(props) {
    super(props)
    this.title = '行程';
  }

  static propTypes = {
    router: PropTypes.object,
    click: PropTypes.func,
  }

  componentDidMount() {
    super.componentDidMount()
    this.getCarList(1, 0);
  }

    getCarList(type, tabIndx) {
      this.props._getTravelCarList({
          carrierPhone: global.companyPhone,
          carNum: '',
          // carrierPhone: '15801351018',
          transferStatus: type, // 0=空闲，1=运输中，null=全查
          pageNum: 1,
          pageSize: 50,
          }, true, tabIndx)
    }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  render() {
      const {
          user,
          travelCarList,
          freeCarListData
      } = this.props
    return (
      <View style={ styles.container }>
        <NavigatorBar title='行程' hiddenBackIcon={ true }
                      firstLevelIconFont='&#xe640;'
                      secondLevelIconFont='&#xe63f;'
                      secondLevelClick={ () => Linking.link(this.props.hotLine) }
                      firstLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }}) }
        />
        <ScrollableTabView
            style={{flex: 1, backgroundColor: COLOR.COLOR_VIEW_BACKGROUND}}
            renderTabBar={() =>
                <DefaultTabBar style={{height: 44, borderBottomColor: '#E6EAF2', borderBottomWidth: 0.5}}
                               tabStyle={{paddingBottom: 2}}/>
            }
            onChangeTab={(obj)=>{
                // if (obj.i == obj.from) {
                //     return
                // };
                // this.setState({activeTab: obj.i})
                console.log('选择索引', obj.i);
                if (obj.i == 0) {
                    this.getCarList(1, 0);
                }else if (obj.i == 1) {
                    this.getCarList(0, 1);
                }
            }}
            tabBarBackgroundColor={COLOR.WHITE_COLOR}
            tabBarUnderlineStyle={{backgroundColor: COLOR.BLUE_BACKGROUND_COLOR, height: 3, width: 25, marginLeft:(width*0.5-25)*0.5 }}
            tabBarActiveTextColor={COLOR.BLUE_BACKGROUND_COLOR}
            tabBarInactiveTextColor={COLOR.GRAY_TEXT_COLOR}
            tabBarTextStyle={{fontSize: 15}}>
            <TravelCarList
                tabLabel={'运输中车辆行程'}
                carType={1}
                dataSource={travelCarList}
                refreshList={()=> {
                    // 刷新
                    this.getCarList(1, 0);
                }}
                loadMoreAction={()=> {

                }}
                onItemClick={(carNumber) => {
                    console.log('carNumber', carNumber)
                    this.props.navigation.dispatch({
                        type: RouteType.ROUTE_CAR_TRANSPORT_INFO, params: {
                            carNo: carNumber
                        }
                    })
                }}
            />

            <TravelCarList
                tabLabel={'空闲车辆'}
                carType={0}
                dataSource={freeCarListData}
                refreshList={()=> {
                    // 刷新
                    this.getCarList(0, 1);
                }}
                loadMoreAction={()=> {

                }}
                onItemClick={() => {

                }}
            />
        </ScrollableTabView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { app, travel, nav } = state;
  return {
    nav,
    user: app.get('user'),
    loading: app.get('loading'),
    loadingPage: app.get('loadingPage'),
    travelDetail: travel.get('travelDetail'),
    carPayLoad: travel.get('carPayLoad'),
    payload: travel.get('payload'),
    hotLine: app.get('hotLine'),
    isNeedRefreshTravel: travel.get('isNeedRefreshTravel'),
    travelCarList: travel.get('travelCarListData'),
      freeCarListData: travel.get('freeCarListData'),
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
      _getTravelCarList: (params, showLoading, carType)=> {
          // dispatch(changeEntrustOrderListLoadingMore(0));
          dispatch(fetchData({
              api: API.API_CARRIERS_TRIP_LIST,
              method: 'POST',
              body: params,
              showLoading,
              success: (data)=>{
                  // dispatch(entrustListShouldRefresh(false))
                  data.carType = carType
                  data.pageNo = params.pageNum


                  dispatch(getTravelCarList(data))
                  // dispatch(appendLogToFile('我的承运','获取我的承运-待确认列表',startTime))
              },
              fail: (data)=>{
                  data.carType = carType
                  dispatch(getTravelCarList(data))
                  // Toast.showShortCenter(data.message);
              }
          }))
      },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(travel);
