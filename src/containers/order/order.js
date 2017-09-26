'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ListView,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  InteractionManager
  // Alert
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
import {fetchData} from '../../action/app'
import {
  receiveOrderList,
  changeOrderLoadingMoreState,
  changeOrderToStateWithOrderNo,
  setAllUnPaySelected,
  setAllUnPayEditing,
  changeSelectStateWithOrderNo,
  changeOrderTopTab,
  shouldOrderListRefreshAction
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

const { height,width } = Dimensions.get('window')

class OrderListItem extends Component {
  constructor(props) {
    super(props);
  }

  _renderRow(rowData,SectionId,rowID){
    return <OrderCell {...this.props} rowData={rowData} rowID={ rowID }/>
  }

  _renderFooter(){
    const { dataSource } = this.props;
    if (dataSource.get('list').size > 1) {
      if (dataSource.get('hasMore')) {
        return <LoadMoreFooter />
      }else{
        return <LoadMoreFooter isLoadAll={true}/>
      }
    };
  }
  _toEnd(){
    const {loadMoreAction, dataSource} = this.props
    if (loadMoreAction) {
      if (dataSource.get('isLoadingMore')){
        console.log("------ 正在加载中");
        return;
      }else if(dataSource.get('list').size >= dataSource.get('total')) {
        console.log("------ 已加载全部");
        return;
      }
      loadMoreAction()
    };
  }
  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const {dataSource,haveBatch, batchHandle} = this.props
    if (dataSource.get('list').toJS().length > 0 || dataSource.get('isLoadingMore')) {
      return (
        <View style={{flex:1}}>
          <ListView
            style={{flex:1}}
            dataSource={ ds.cloneWithRows(dataSource.get('list').toJS() || []) }
            renderRow={this._renderRow.bind(this)}
            onEndReachedThreshold={10}
            enableEmptySections={true}
            onEndReached={ this._toEnd.bind(this) }
            renderFooter={ this._renderFooter.bind(this) }/>
          { haveBatch && batchHandle ? batchHandle() : null}
        </View>
      )
    }else{
      return <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
        <Image source={emptyList}/>
      </View>
    }
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
      orderPayed,
      setSubActiveTab,
      batchHandle,
      itemClick,
      loadMoreAction
    } = this.props
    return (
      <ScrollableTabView
        page={this.props.activeSubTab < 2 ? this.props.activeSubTab : 0}
        style={{backgroundColor: COLOR.APP_CONTENT_BACKBG}}
        renderTabBar={() =>
          <DefaultTabBar style={{height: 40,borderWidth:1,borderBottomColor: '#e6eaf2', backgroundColor: 'white'}}
            tabStyle={{paddingBottom: 2}}/>
        }
        onChangeTab={(obj)=>{
          if (obj.i == obj.from) {return}
          if (setSubActiveTab) {setSubActiveTab(obj.i)};
        }}
        tabBarUnderlineStyle={{backgroundColor: COLOR.APP_THEME,height: 2,width: 44,marginLeft:(width*0.5-44)*0.5 }}
        tabBarActiveTextColor={COLOR.APP_THEME}
        tabBarInactiveTextColor={COLOR.TEXT_NORMAL}
        tabBarTextStyle={{fontSize:15}}>
        <OrderListItem
          {...this.props}
          tabLabel={'未结算'}
          dataSource={orderUnPay}
          haveBatch={true}
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
// <OrderListItem
//  {...this.props}
//  tabLabel={'已完成'}
//  dataSource={orderPayed}
//  loadMoreAction={()=>{
//    if(loadMoreAction){loadMoreAction(2)}
//  }}/>
class OrderList extends BaseComponent {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      // if (width > 375) {
      //  this.toolBarHeigth = 93
      //  this.staBarHeight = 27
      // } else {
        this.toolBarHeigth = 64
        this.staBarHeight = 20
      // }
    } else {
      this.toolBarHeigth = 50
      this.staBarHeight = 0
    }
    this.state = {
      title: '全部货源订单',
      showMenu: false,
      currentMenuIndex: 0,
      // activeTab: 0,
      // subActiveTab: 0,
      showCoordination: false,
      coordinationResult: {},
      allSelected: false,
      batchEditing: false
    }

    this._updateListWithIndex = this._updateListWithIndex.bind(this)
    this._refreshList = this._refreshList.bind(this)
    this._creatTopMenuButtons = this._creatTopMenuButtons.bind(this)
    this._showCoordinateResult = this._showCoordinateResult.bind(this)
  }
  componentDidMount() {
    console.log(" ===== did mount action ?");
    super.componentDidMount()
    const {user} = this.props
    setTimeout(()=>{
      this.props._getCompanyOrderList({
        carId: user.carId ? user.carId : '',
        companyId: user.currentUserRole === 1 ? user.userId : user.carrierId,
        orderState: 1,
        orderType: 0,
        pageNo: 1
      })
    }, Platform.OS === 'ios' ? 0 : 800);

  }
  _updateListWithIndex(currentMenuIndex,activeTab,activeSubTab,pageNo=1){
    const {user} = this.props
    this.setState({
      batchEditing: false
    })
    this.props._setAllUnPaySelected(false)
    this.props._setAllUnPayEditing(false)

    this.props._getCompanyOrderList({
      companyId: user.currentUserRole === 1 ? user.userId : user.carrierId,
      carId: user.carId ? user.carId : '',
      orderState: HelperUtil.transformActiveTabToOrderState(activeTab,activeSubTab),
      orderType: HelperUtil.transformOrderTypeMenuIndexToType(currentMenuIndex),
      pageNo
    })
  }
  // this.props._getEntrustOrderList({
  //  pageNo: parseInt(entrustOrderUndispatch.get('pageNo')) + 1,
  //  companyId: user.userId,
  //  state: 1
  // })
  _refreshList(){
    const {currentMenuIndex} = this.state
    const {activeTab,activeSubTab} = this.props
    console.log("====== currentMenuIndex ,activeTab, activeSubTab",currentMenuIndex,activeTab,activeSubTab);
    this._updateListWithIndex(currentMenuIndex,activeTab,activeSubTab)
  }

  _selectAllUnPayItem(shouleSelectAll){
    if (shouleSelectAll) {

    };
  }
  _creatTopMenuButtons(titles){
    const { currentMenuIndex } = this.state
    const {activeSubTab, activeTab} = this.props
    const buttons = titles.map((item,index)=>{
      return(
        <Button key={index} style={[styles.menuButtonStyle,{backgroundColor: currentMenuIndex === index ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0)'}]}
          textStyle={{fontSize: 14,color: currentMenuIndex === index ? COLOR.APP_THEME : 'white'}}
          onPress={()=>{
            if (currentMenuIndex != index) {
              this.setState({
                title: item,
                showMenu: false,
                currentMenuIndex: index
              })
              this._updateListWithIndex(index,activeTab,activeSubTab)
            };
          }}>
          {item}
        </Button>
      )
    })
    return buttons
  }
  _showCoordinateResult(result){
    this.setState({
      showCoordination: true,
      coordinationResult: {//可以直接传result  没必要解开按key传值
        entrustType: result.entrustType,
        goodsType: result.goodsType,
        content: result.priceInstruction,
        consult: result.consultType == 1 ? '委托方' : '承运方',
        dealPrice: result.dealPrice,
        paymentPrice: result.paymentPrice,
      }
    })
  }

  componentWillReceiveProps(nextProps){
    const {shouldOrderListRefresh,orderAll,orderToInstall,orderToDelivery,orderCanceled,orderUnPay,orderPaying,orderPayed} = nextProps
    if (shouldOrderListRefresh && !orderAll.get('isLoadingMore') && !orderToInstall.get('isLoadingMore') && !orderToDelivery.get('isLoadingMore') && !orderCanceled.get('isLoadingMore') && !orderUnPay.get('isLoadingMore') && !orderPaying.get('isLoadingMore') && !orderPayed.get('isLoadingMore')) {

      this._refreshList()
    }
  }


  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
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
      orderPayed,
      user
    } = this.props
    return (

      <View style={styles.container}>
      {
        showMenu ?
          <NavigatorBar
            hiddenBackIcon={true}
            title={ title }
            assistIconFont='&#xe60c;'
            assistIconClick={()=>{
              this.setState({
                showMenu: true
              })
            }}/>
        :
          <NavigatorBar
            hiddenBackIcon={true}
            title={title}
            assistIconFont='&#xe60e;'
            assistIconClick={()=>{
              this.setState({
                showMenu: true
              })
            }}/>
      }
        <View style={{backgroundColor: COLOR.APP_CONTENT_BACKBG,flex:1}}>
          <ScrollableTabView
            page={activeTab}
            style={{backgroundColor: COLOR.APP_CONTENT_BACKBG}}
            renderTabBar={() =>
              <DefaultTabBar style={{height: 40,borderWidth:1,borderBottomColor: '#e6eaf2', backgroundColor: 'white'}}
                tabStyle={{paddingBottom: 2}}/>
            }
            onChangeTab={(obj)=>{
              if (obj.i == obj.from) {
                return
              };
              this.props._changeOrderTab(obj.i,activeSubTab)
              //  1所有 2待装货 3待交付 4结算 5未结算 6结算中 7已结算(已完成) 8取消
              // if (obj.i != 3) {
                InteractionManager.runAfterInteractions(() => {
                  this._updateListWithIndex(currentMenuIndex,obj.i,activeSubTab)
                });
              // };
            }}
            tabBarUnderlineStyle={{backgroundColor: COLOR.APP_THEME,height: 2,width: 44,marginLeft:(width*0.2-44)*0.5 }}
            tabBarActiveTextColor={COLOR.APP_THEME}
            tabBarInactiveTextColor={COLOR.TEXT_NORMAL}
            tabBarTextStyle={{fontSize:15}}>
            <OrderListItem
              refreshList={this._refreshList}
              {...this.props}
              tabLabel={'全部'}
              dataSource={orderAll}
              showCoordination={(result)=>{
                this._showCoordinateResult(result)
              }}
              loadMoreAction={()=>{
                this._updateListWithIndex(currentMenuIndex,activeTab,activeSubTab,parseInt(orderAll.get('pageNo')) + 1)
              }}/>

            <OrderListItem
              refreshList={this._refreshList}
              {...this.props}
              tabLabel={'装货'}
              dataSource={orderToInstall}
              loadMoreAction={()=>{
                this._updateListWithIndex(currentMenuIndex,activeTab,activeSubTab,parseInt(orderToInstall.get('pageNo')) + 1)
              }}/>

            <OrderListItem
              refreshList={this._refreshList}
              {...this.props}
              tabLabel={'交付'}
              dataSource={orderToDelivery}
              showCoordination={(result)=>{
                this._showCoordinateResult(result)
              }}
              loadMoreAction={()=>{
                this._updateListWithIndex(currentMenuIndex,activeTab,activeSubTab,parseInt(orderToDelivery.get('pageNo')) + 1)
              }}/>

            <OrderListItemClear
              {...this.props}
              refreshList={this._refreshList}
              tabLabel={'结算'}
              orderUnPay={orderUnPay}
              orderPaying={orderPaying}
              orderPayed={orderPayed}
              showCoordination={(result)=>{
                this._showCoordinateResult(result)
              }}
              setSubActiveTab={(newActiveSubTab)=>{
                this.props._changeOrderTab(activeTab,newActiveSubTab)
                this._updateListWithIndex(currentMenuIndex,activeTab,newActiveSubTab)
              }}
              loadMoreAction={(index)=>{
                if (index == 0) {
                  this._updateListWithIndex(currentMenuIndex,activeTab,activeSubTab,parseInt(orderUnPay.get('pageNo')) + 1)
                }else if (index == 1) {
                  this._updateListWithIndex(currentMenuIndex,activeTab,activeSubTab,parseInt(orderPaying.get('pageNo')) + 1)
                }else if (index == 2) {
                  this._updateListWithIndex(currentMenuIndex,activeTab,activeSubTab,parseInt(orderPayed.get('pageNo')) + 1)
                };
              }}
              batchHandle={()=>{
                // console.log("  ======= ",orderUnPay.get('allSelected'));
                if (orderUnPay && orderUnPay.get('list').size > 0) {
                  return <BatchEdit
                    batchEditing={batchEditing}
                    isAllselected={orderUnPay.get('allSelected')}
                    startEditing={(editing)=>{
                      this.setState({
                        batchEditing: editing
                      })
                      this.props._setAllUnPayEditing(editing)
                      if (editing) {
                        // 开始批量编辑
                      }else{
                        // 结束批量编辑
                        this.props._setAllUnPaySelected(false)
                      };
                    }}
                    selectAll={(allSelectedOrNot)=>{
                      // console.log(" 全选 ");
                      this.props._setAllUnPaySelected(allSelectedOrNot)
                    }}
                    batchApply={()=>{
                      // console.log(" apply clear");
                      if (user.currentUserRole != 1) {
                        Toast.show('司机帐号没有该权限')
                        return
                      }
                      const allOrderNoArr = []
                      orderUnPay.get('list').map((item,index)=>{
                        // console.log("------- ",item.selected);
                        if (item.selected) {
                          allOrderNoArr.push(item.orderNo)
                        };
                      })
                      if (allOrderNoArr.length < 1) {
                        Toast.show('请选择需要申请结算的订单')
                        return
                      };
                      // console.log("-------- p批量申请结算 === orderNo", allOrderNoArr);

                      this.props._getBankCardList(user.userId,(data)=>{
                        // console.log("判断是否添加开户行信息 ",data);
                        if (data.length < 1) {
                          Alert.alert('温馨提示','您的账户还未添加银行账户，为不影响给您打款，请前往用户中心-会员信息进行设置！',[
                            {text: '再看看', onPress:()=>{
                              // console.log("cancle...");
                            }},
                            {text: '去设置', onPress:()=>{
                              this.props.navigation.dispatch({
                                type: RouteType.ROUTE_ADD_BANK_CARD, params:{title:'新增开户行',id:-1}
                              })
                            }}
                          ])
                        }else{
                          if (this.props._applyClear) {
                            Alert.alert('温馨提示','请您在申请结算同时，将您开具好的发票邮寄至我们，以免耽误您的结算申请',[
                              {text: '取消', onPress:()=>{
                                // console.log("cancle...");
                              }},
                              {text: '查看并申请', onPress:()=>{
                                this.props._applyClear({
                                  orderNo: allOrderNoArr.join(','),
                                  carId: user.carId ? user.carId : ''
                                },()=>{
                                  this.props.navigation.dispatch({
                                    type: RouteType.ROUTE_AGREEMENT_CONTENT, params: {title:'发票说明', type: 3}
                                  })
                                })
                              }}
                            ])
                          };
                        }
                      })
                    }}/>
                }
              }}/>

            <OrderListItem
              refreshList={this._refreshList}
              {...this.props}
              tabLabel={'已完成'}
              showCoordination={(result)=>{
                this._showCoordinateResult(result)
              }}
              dataSource={orderCanceled}
              loadMoreAction={()=>{
                this._updateListWithIndex(currentMenuIndex,activeTab,activeSubTab,parseInt(orderCanceled.get('pageNo')) + 1)
              }}/>

          </ScrollableTabView>
        </View>
        <Modal animationType={ "fade" } transparent={true} visible={showMenu} onRequestClose={()=>console.log('resolve warnning')} >
          <View style={styles.modalView}>
            <TouchableOpacity activeOpacity={0.9} onPress={()=>{
              this.setState({showMenu: false})
            }}>
              <View style={{height,width,alignItems: 'center'}}>
                <Image source={topArrow} style={{marginTop: this.toolBarHeigth - 5}}/>
                <View style={{width: 120,height: 44*4,backgroundColor: 'rgba(0,0,0,0.7)',borderRadius: 2}}>
                  { this._creatTopMenuButtons(['全部货源订单','普通货源订单','优质货源订单','指派订单']) }
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal animationType={ "fade" } transparent={true} visible={showCoordination} onRequestClose={()=>console.log('resolve warnning')} >
          <Coordination data={this.state.coordinationResult} closeAction={()=>{
            this.setState({
              showCoordination: false
            })
          }}/>
        </Modal>
      </View>
    )
  }
}

const styles =StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.APP_CONTENT_BACKBG
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
    orderUnPay: order.get('orderUnPay'),
    orderPaying: order.get('orderPaying'),
    orderPayed: order.get('orderPayed'),
    activeTab: order.get('activeTab'),
    activeSubTab: order.get('activeSubTab'),
    shouldOrderListRefresh: app.get('shouldOrderListRefresh')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _changeOrderTab:(activeTab,activeSubTab)=>{
      dispatch(changeOrderTopTab(activeTab,activeSubTab))
    },
    _getCompanyOrderList: (params)=>{
      dispatch(changeOrderLoadingMoreState(params.orderState))
      dispatch(fetchData({
        api: API.GET_COMPANY_ORDER_LIST,
        method: 'GET',

        body: params,
        success: (data)=>{
          dispatch(shouldOrderListRefreshAction(false))
          data.orderState = params.orderState
          data.pageNo = params.pageNo
          dispatch(receiveOrderList(data))
        }
      }))
    },
    _confirmInstall: (params)=>{
      dispatch(fetchData({
        api: API.CONFIRM_INSTALL,
        method: 'POST',
        showLoading: true,
        body: params,
        success: (data)=>{
          // console.log("承运商确认装货完成 发消息改状态 ",params)
          dispatch(shouldOrderListRefreshAction(true))
          // dispatch(changeOrderToStateWithOrderNo(params.toState,params.orderNo,params.orderTopType))
          Toast.show('装货确认成功！')
          // 更新我的行程
          dispatch(refreshTravel());
          // dispatch(dispatchDefaultCar({ id: payload.id, carState: payload.carState, carNo: payload.orderNo }));
        }
      }))
    },
    // _confirmArrivalWithImage: (params) => {
    //  dispatch(fetchData({
    //    api: API.CONFIRM_ARRIVEL,
    //    method: 'POST',
    //    body: params,
    //    success: (data)=>{
    //      console.log("----- 确认到达 上传环境照片成功 ",data);
    //      dispatch(changeOrderToStateWithOrderNo(params.toState,params.orderNo,params.orderTopType))
    //    }
    //  }))
    // },
    _setAllUnPaySelected: (shouleSelectAll) => {
      dispatch(setAllUnPaySelected(shouleSelectAll))
    },
    _setAllUnPayEditing: (isEditing) => {
      dispatch(setAllUnPayEditing(isEditing))
    },
    _applyClear: (params,successCallBack)=>{
      dispatch(fetchData({
        api: API.APPLY_CLEAR,
        method: 'POST',
        showLoading: true,
        body: params,
        success: (data)=>{
          // console.log(" ----- 申请结算成功， 改状态为15 结算中 ");
          Toast.show('申请成功')
          dispatch(changeOrderToStateWithOrderNo(15,params.orderNo,'orderUnPay'))
          dispatch(changeOrderTopTab(3,1))
          if (successCallBack) {successCallBack()}
        }
      }))
    },
    _changeSelectStateWithOrderNo: (orderNo) =>{
      dispatch(changeSelectStateWithOrderNo(orderNo))
    },
    _clearConfirm: (params) =>{
      dispatch(fetchData({
        api: API.CLEAR_CONFIRM,
        showLoading: true,
        method: 'POST',
        body: params,
        success: (data)=>{
          // console.log(" 确认结算成功 改状态为12 已完成（从 orderPaying 中移除）");
          dispatch(changeOrderToStateWithOrderNo(12,params.orderNo,'orderPaying'))
        }
      }))
    },
    _requestCoordinateResult: (params,successCallBack)=>{
      dispatch(fetchData({
        api: API.COORDINATE_RESULT,
        method: 'GET',
        showLoading: true,
        body: params,
        success: (data)=>{
          if(successCallBack){successCallBack({...data,...params})}
        }
      }))
    },
    _getBankCardList: (carrierId,successCallBack,failCallBack) => {
      dispatch(fetchData({
        body:{
          pageNo: 1,
          carrierId,
        },
        method: 'POST',
        api: API.QUERY_BANK_CARD_LIST,
        success: (data) => {
          successCallBack && successCallBack(data)
          dispatch(dispatchBankCardList({ data, pageNo: 1}));
        }
      }));
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
