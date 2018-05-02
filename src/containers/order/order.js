'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  InteractionManager,
  Alert,
    DeviceEventEmitter
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import SegmentTabBar from '../../components/order/segmentTab'
import OrderCell from '../../components/order/orderCell'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import Coordination from '../../components/order/coordinatation'
import { dispatchDefaultCar } from '../../action/travel';
import {fetchData, appendLogToFile} from '../../action/app'
import {
  receiveOrderList,
  changeOrderLoadingMoreState,
  changeOrderToStateWithOrderNo,
  setAllUnPaySelected,
  setAllUnPayEditing,
  changeSelectStateWithOrderNo,
  changeOrderTopTab,
  shouldOrderListRefreshAction,
  changeOrderListIsRefreshing,
  changeOrderurgedWithOrderNo
} from '../../action/order'
import { dispatchBankCardList } from '../../action/bankCard';
import * as API from '../../constants/api'
import HelperUtil from '../../utils/helper'
import emptyList from '../../../assets/img/order/empty_order_list.png'
import LoadMoreFooter from '../../components/common/loadMoreFooter'
import Toast from '../../utils/toast.js';
import topArrow from '../../../assets/img/routes/top_arrow.png'
import BatchEdit from '../../components/order/batchEdit'
import { refreshTravel } from '../../action/app';
import BaseComponent from '../../components/common/baseComponent.js'
import DeviceInfo from 'react-native-device-info';
import OrderItemCell from '../../components/order/orderItemCell';
import Linking from '../../utils/linking'

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
let currentTime = 0;
let lastTime = 0;
let locationData = '';


const { height,width } = Dimensions.get('window')
let startTime = 0

let pageNum = 1; // 第一页
const pageSize = 10;// 每页显示数量

class OrderListItem extends Component {
  constructor(props) {
    super(props);
  }

  _renderRow(rowData,SectionId,rowID){
    // return <OrderCell {...this.props} rowData={rowData.item} rowID={ rowID }/>
    return <OrderItemCell {...this.props} rowData={rowData.item} rowID={ rowID }/>
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
    const {loadMoreAction, dataSource} = this.props
    if (loadMoreAction) {
      if (dataSource.get('isLoadingMore')){
        console.log("------ 正在加载中");
        return;
      }else if(dataSource.get('list').size >= dataSource.get('total') || dataSource.get('pageNo') == dataSource.get('pages')) {
        console.log("------ 已加载全部");
        return;
      }
      loadMoreAction()
    }
  }

    separatorComponent() {
        return (
            <View style={{height: 10, backgroundColor: '#f0f2f5',}}/>
        );
    };

  _keyExtractor = (item, index) => index
  _listEmptyComponent(){
    return (
      <View style={{flex:1,justifyContent: 'center',alignItems: 'center',height: SCREEN_HEIGHT-DANGER_TOP-DANGER_BOTTOM-44-40-49}}>
        <Image source={emptyList}/>
      </View>
    )
  }
  render(){
    const {dataSource,haveBatch, batchHandle,activeTab,activeSubTab} = this.props
      console.log('datasoure', dataSource);
    return (
      <View style={{flex:1, marginTop: 10}}>
        <FlatList
          style={{flex:1}}
          data={ dataSource.get('list').toJS() || [] }
          onRefresh={()=>{
            // const orderState = HelperUtil.transformActiveTabToOrderState(activeTab,activeSubTab);
            // this.props.dispatch(changeOrderListIsRefreshing(activeTab))//刷新货源列表
            this.props.refreshList && this.props.refreshList()
          }}
          refreshing={dataSource.get('isRefreshing')}
          renderItem={this._renderRow.bind(this)}
          keyExtractor={this._keyExtractor}
          onEndReachedThreshold={0.1}
          enableEmptySections={true}
          onEndReached={ this._toEnd.bind(this) }
          ItemSeparatorComponent={this.separatorComponent}
          ListFooterComponent={this._renderFooter.bind(this)}
          ListEmptyComponent={this._listEmptyComponent()}/>

        { haveBatch && batchHandle ? batchHandle() : null}
      </View>
    )
  }
}

class OrderListItemClear extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  render(){
    const {
      orderUnPay,
      orderPaying,
      setSubActiveTab,
      batchHandle,
      itemClick,
      loadMoreAction,
      activeSubTab
    } = this.props
    console.log(" ====== activeSubTab ",activeSubTab,orderUnPay.showBatchBar);
    return (
      <ScrollableTabView
        page={activeSubTab < 2 ? activeSubTab : 0}
        style={{backgroundColor: COLOR.APP_CONTENT_BACKBG}}
        renderTabBar={() =>
          <DefaultTabBar style={{height: 40,borderWidth:1,borderBottomColor: '#e6eaf2', backgroundColor: 'white'}}
            tabStyle={{paddingBottom: 2}}/>
        }
        onChangeTab={(obj)=>{
          if (obj.i == obj.from) {return}
          if (setSubActiveTab) {setSubActiveTab(obj.i)};
        }}
        tabBarUnderlineStyle={{backgroundColor: COLOR.APP_THEME,height: 3,width: 44,marginLeft:(width*0.5-44)*0.5 }}
        tabBarActiveTextColor={COLOR.APP_THEME}
        tabBarInactiveTextColor={COLOR.TEXT_NORMAL}
        tabBarTextStyle={{fontSize:15}}>
        <OrderListItem
          {...this.props}
          tabLabel={'未结算'}
          dataSource={orderUnPay}
          haveBatch={orderUnPay.get('showBatchBar')}
          loadMoreAction={()=>{
            if(loadMoreAction){loadMoreAction(0)}
          }}/>
        <OrderListItem
          {...this.props}
          tabLabel={'结算中'}
          dataSource={orderPaying}
          loadMoreAction={()=>{
            if(loadMoreAction){loadMoreAction(1)}
          }}/>
      </ScrollableTabView>
    )
  }
}

class OrderList extends BaseComponent {
  constructor(props) {
    super(props);
    if (IS_IOS) {
        this.toolBarHeigth = 44 + DANGER_TOP
        this.staBarHeight = DANGER_TOP
    } else {
      this.toolBarHeigth = 50
      this.staBarHeight = 0
    }

    this.state = {
      title: '运单',
      showMenu: false,
      currentMenuIndex: 0,
      activeTab: 0,
      // subActiveTab: 0,
      showCoordination: false,
      coordinationResult: {},
      allSelected: false,
      batchEditing: false,
        ctcNum: 0,
        tfcNum: 0,
    }

    this._updateListWithIndex = this._updateListWithIndex.bind(this)
    this._refreshList = this._refreshList.bind(this)
    // this._creatTopMenuButtons = this._creatTopMenuButtons.bind(this)
  }
  componentDidMount() {
    super.componentDidMount()
      this.getCurrentPosition();
    const {user} = this.props
      this.getlistbyIndex(0, 1);
      DeviceEventEmitter.addListener('refreshCarrierOrderList', () => {
          this.getlistbyIndex(2, 1);
      });
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

  _updateListWithIndex(activeTab = this.state.activeTab,pageNo){
    const {user} = this.props

      this.getlistbyIndex(activeTab, pageNo);
  }

    getlistbyIndex(currentPageIndex, pageNo) {
        switch (currentPageIndex) {
            case 0:
              // 全部
                this.getDataList(API.API_CARRIER_QUERY_TRANSPORTORDERALL, pageNo, currentPageIndex);
                break;
            case 1:
              // 装车
                this.getDataList(API.API_CARRIER_QUERY_TRANSPORT_ORDER_LOADING, pageNo, currentPageIndex);
                break;
            case 2:
              // 交付
                this.getDataList(API.API_CARRIER_QUERY_TRANSPORT_ORDER_PAY, pageNo, currentPageIndex);
                break;
            case 3:
              // 已完成
                this.getDataList(API.API_CARRIER_QUERY_TRANSPORT_ORDER_FINISH, pageNo, currentPageIndex);
                break;
        }
    }

  getDataList(api, pageNum, index) {
      currentTime = new Date().getTime();
      console.log('this.state.ctcnum,tfcNum',this.state.ctcNum, this.state.tfcNum);
      if (pageNum == '1') {
          this.props._getTransportOrderList({
              // carrierCode: this.props.carrierCode,
              carrierCode: global.companyCode,
              // carrierCode: '1001',
              ctcNum: 0,
              tfcNum: 0,
              // page: pageNum,
              // pageSize,
              // queryType: type,
          }, api, pageNum, index);
      } else {
          if (this.state.ctcNum !== null && this.state.tfcNum !== null) {
              this.props._getTransportOrderList({
                  // carrierCode: this.props.carrierCode,
                  carrierCode: global.companyCode,
                  // carrierCode: '1001',
                  ctcNum: this.state.ctcNum,
                  tfcNum: this.state.tfcNum,
                  // page: pageNum,
                  // pageSize,
                  // queryType: type,
              }, api, pageNum, index);
          }
      }

      lastTime = new Date().getTime();
      ReadAndWriteFileUtil.appendFile('运单列表', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
          locationData.district, lastTime - currentTime, '承运商运单');
  }

  _refreshList(){
    this._updateListWithIndex(this.state.activeTab, 1)
  }

  componentWillReceiveProps(nextProps){
    const {shouldOrderListRefresh,orderAll,orderToInstall,orderToDelivery,orderCanceled} = nextProps

      switch (this.state.activeTab) {
          case 0:
              this.setState({
                  tfcNum: orderAll.get('tfcNum'),
                  ctcNum: orderAll.get('ctcNum')
              });
              break;
          case 1:
              this.setState({
                  tfcNum: orderToInstall.get('tfcNum'),
                  ctcNum: orderToInstall.get('ctcNum')
              });
              break;
          case 2:
              this.setState({
                  tfcNum: orderToDelivery.get('tfcNum'),
                  ctcNum: orderToDelivery.get('ctcNum')
              });
              break;
          case 3:
              this.setState({
                  tfcNum: orderCanceled.get('tfcNum'),
                  ctcNum: orderCanceled.get('ctcNum')
              });
              break;
      }


    if (shouldOrderListRefresh && !orderAll.get('isLoadingMore') && !orderToInstall.get('isLoadingMore') && !orderToDelivery.get('isLoadingMore') && !orderCanceled.get('isLoadingMore')) {
        console.log('refresh');
      this._refreshList()
    }
  }


  render() {
    const {
      title,
      currentMenuIndex,
      showMenu,
      showCoordination,
      // subActiveTab,
      // activeTab,
      allSelected,
      batchEditing
    } = this.state
    const {
      activeSubTab,
      activeTab,
      orderAll,
      orderToInstall,
      orderToDelivery,
      orderFinal,
      orderCanceled,
      orderUnPay,
      orderPaying,
      user
    } = this.props
    return (

      <View style={styles.container}>
        <NavigatorBar
            hiddenBackIcon={true}
            title={ title }
            firstLevelIconFont='&#xe640;'
            secondLevelIconFont='&#xe63f;'
            secondLevelClick={ () => Linking.link(this.props.hotLine) }
            firstLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }}) }
        />
        <View style={styles.content}>
          <ScrollableTabView
            // page={activeTab}
            // initialPage={0}
              style={{flex: 1, backgroundColor: COLOR.COLOR_VIEW_BACKGROUND}}
            renderTabBar={() =>
                <DefaultTabBar style={{height: 44,borderBottomColor: '#E6EAF2', borderBottomWidth:1}}
                               tabStyle={{paddingBottom: 2}}/>
            }
            onChangeTab={(obj)=>{
              // if (obj.i == obj.from) {
              //   return
              // };
              // this.props._changeOrderTab(obj.i,activeSubTab)
              //  1所有 2待装货 3待交付 4结算 5未结算 6结算中 7已结算(已完成) 8取消
              // if (obj.i != 3) {
              //   InteractionManager.runAfterInteractions(() => {
              //     this._updateListWithIndex(currentMenuIndex,obj.i,activeSubTab)
              //   });

                if(obj.i != obj.from){
                    this.setState({
                        activeTab: obj.i,
                    });
                    this._updateListWithIndex(obj.i,1)
                }
              // };
            }}
            tabBarBackgroundColor={COLOR.WHITE_COLOR}
            tabBarUnderlineStyle={{backgroundColor: COLOR.BLUE_BACKGROUND_COLOR, height: 2, width: 20, marginLeft:(width/4-20) * 0.5}}
            tabBarActiveTextColor={COLOR.BLUE_BACKGROUND_COLOR}
            tabBarInactiveTextColor={COLOR.GRAY_TEXT_COLOR}
            tabBarTextStyle={{fontSize:15}}>
            <OrderListItem
              refreshList={this._refreshList}
              {...this.props}
              tabLabel={'全部'}
              dataSource={orderAll}
              loadMoreAction={()=>{
                this._updateListWithIndex(activeTab,parseInt(orderAll.get('pageNo')) + 1)
              }}/>

            <OrderListItem
              refreshList={this._refreshList}
              {...this.props}
              tabLabel={'装车'}
              dataSource={orderToInstall}
              loadMoreAction={()=>{
                this._updateListWithIndex(activeTab,parseInt(orderToInstall.get('pageNo')) + 1)
              }}/>

            <OrderListItem
              refreshList={this._refreshList}
              {...this.props}
              tabLabel={'交付'}
              dataSource={orderToDelivery}
              loadMoreAction={()=>{
                this._updateListWithIndex(activeTab,parseInt(orderToDelivery.get('pageNo')) + 1)
              }}/>

            <OrderListItem
              refreshList={this._refreshList}
              {...this.props}
              tabLabel={'已完成'}
              dataSource={orderCanceled}
              loadMoreAction={()=>{
                this._updateListWithIndex(activeTab,parseInt(orderCanceled.get('pageNo')) + 1)
              }}/>

          </ScrollableTabView>
        </View>
      </View>
    )
  }
}

const styles =StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.COLOR_VIEW_BACKGROUND
  },
  navBar:{
    width,
    borderBottomWidth: 1,
    borderBottomColor: '#e6eaf2',
    backgroundColor: 'white'
  },
  navButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  content:{
    backgroundColor: COLOR.APP_CONTENT_BACKBG,
    flex:1,
    marginBottom: DANGER_BOTTOM
  },
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(225,225,225,0)',
  },
  menuButtonStyle: {
    borderWidth: 0,
    borderRadius: 0,
    marginBottom:0,
    height: 44,

  }
})

const mapStateToProps = (state) => {
  const {order,app, travel } = state;
  return {
    user: app.get('user'),
    orderAll: order.get('orderAll'),
    orderToInstall: order.get('orderToInstall'),
    orderToDelivery: order.get('orderToDelivery'),
    orderCanceled: order.get('orderCanceled'),
    // orderUnPay: order.get('orderUnPay'),
    // orderPaying: order.get('orderPaying'),
    activeTab: order.get('activeTab'),
    activeSubTab: order.get('activeSubTab'),
    shouldOrderListRefresh: app.get('shouldOrderListRefresh'),
    carrierCode: state.user.get('companyCode'),
    hotLine: app.get('hotLine'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    _changeOrderTab:(activeTab,activeSubTab)=>{
      dispatch(changeOrderTopTab(activeTab,activeSubTab))
    },

    _changeSelectStateWithOrderNo: (orderNo) =>{
      dispatch(changeSelectStateWithOrderNo(orderNo))
    },



    _getTransportOrderList: (params, api, pageNum,tabIndex) =>{
        startTime = new Date().getTime();
        dispatch(fetchData({
            body: params,
            method: 'POST',
            api: api,
            success: (data) => {
                dispatch(shouldOrderListRefreshAction(false));
                data.orderType = tabIndex;
                data.pageNo = pageNum;
                dispatch(receiveOrderList(data));
                console.log('data', data);
            },
            fail: (data) => {
                Toast.show(data.message)
            }
        }));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
