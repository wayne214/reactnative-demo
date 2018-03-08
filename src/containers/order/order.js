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
  Alert
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

const { height,width } = Dimensions.get('window')
let startTime = 0

class OrderListItem extends Component {
  constructor(props) {
    super(props);
  }

  _renderRow(rowData,SectionId,rowID){
    return <OrderCell {...this.props} rowData={rowData.item} rowID={ rowID }/>
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
  _keyExtractor = (item, index) => item.orderNo
  _listEmptyComponent(){
    return (
      <View style={{flex:1,justifyContent: 'center',alignItems: 'center',height: SCREEN_HEIGHT-DANGER_TOP-DANGER_BOTTOM-44-40-49}}>
        <Image source={emptyList}/>
      </View>
    )
  }
  render(){
    const {dataSource,haveBatch, batchHandle,activeTab,activeSubTab} = this.props
    return (
      <View style={{flex:1}}>
        <FlatList
          style={{flex:1}}
          data={ dataSource.get('list').toJS() || [] }
          onRefresh={()=>{
            const orderState = HelperUtil.transformActiveTabToOrderState(activeTab,activeSubTab);
            this.props.dispatch(changeOrderListIsRefreshing(orderState, true))//刷新货源列表
            this.props.refreshList && this.props.refreshList()
          }}
          refreshing={dataSource.get('isRefreshing')}
          renderItem={this._renderRow.bind(this)}
          keyExtractor={this._keyExtractor}
          onEndReachedThreshold={0.1}
          enableEmptySections={true}
          onEndReached={ this._toEnd.bind(this) }
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
        tabBarUnderlineStyle={{backgroundColor: COLOR.APP_THEME,height: 2,width: 44,marginLeft:(width*0.5-44)*0.5 }}
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
              this.props.dispatch(appendLogToFile('订单列表', '筛选-'+item,0))
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
    const {shouldOrderListRefresh,orderAll,orderToInstall,orderToDelivery,orderCanceled,orderUnPay,orderPaying} = nextProps
    if (shouldOrderListRefresh && !orderAll.get('isLoadingMore') && !orderToInstall.get('isLoadingMore') && !orderToDelivery.get('isLoadingMore') && !orderCanceled.get('isLoadingMore') && !orderUnPay.get('isLoadingMore') && !orderPaying.get('isLoadingMore')) {

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
        <View style={styles.content}>
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
              tabLabel={'装车'}
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
                        Toast.show('请选择需要催款的订单')
                        return
                      };
                      // console.log("-------- p批量催款 === orderNo", allOrderNoArr);

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
                            Alert.alert('温馨提示','请您在催款的同时，确保将开具好的发票邮寄给我们，以免影响您的回款',[
                              {text: '取消', onPress:()=>{
                                // console.log("cancle...");
                              }},
                              {text: '提交并查看', onPress:()=>{
                                this.props._applyClear({
                                  orderNo: allOrderNoArr.join(','),
                                  carId: user.carId ? user.carId : '',
                                  activeTab
                                },()=>{
                                  /**
                                   * 刷新【结算】-【未结算】列表
                                   * 全选置为false
                                   */
                                  this._refreshList()
                                  console.log(" ===去发票说明");
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
    orderUnPay: order.get('orderUnPay'),
    orderPaying: order.get('orderPaying'),
    activeTab: order.get('activeTab'),
    activeSubTab: order.get('activeSubTab'),
    shouldOrderListRefresh: app.get('shouldOrderListRefresh')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    _changeOrderTab:(activeTab,activeSubTab)=>{
      dispatch(changeOrderTopTab(activeTab,activeSubTab))
    },
    _getCompanyOrderList: (params)=>{
      startTime = new Date().getTime();
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
          dispatch(appendLogToFile('订单','获取订单列表',startTime))
        }
      }))
    },
    _confirmInstall: (params)=>{
      startTime = new Date().getTime();
      dispatch(fetchData({
        api: API.CONFIRM_INSTALL,
        method: 'POST',
        showLoading: true,
        body: params,
        success: (data)=>{
          // console.log("承运商确认装货完成 发消息改状态 ",params)
          dispatch(shouldOrderListRefreshAction(true))
          dispatch(changeOrderToStateWithOrderNo(params.toState || 4,params.orderNo, params.orderTopType || 'orderToInstall'))
          Toast.show('装货确认成功！')
          // 更新我的行程
          dispatch(refreshTravel());
          // dispatch(dispatchDefaultCar({ id: payload.id, carState: payload.carState, carNo: payload.orderNo }));
          dispatch(appendLogToFile('订单','承运商确认装货完成',startTime))

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
      startTime = new Date().getTime();
      isEditing && dispatch(appendLogToFile('订单','批量催款全选',startTime))
    },
    _applyClear: (params,successCallBack)=>{
      startTime = new Date().getTime();
      dispatch(fetchData({
        api: API.APPLY_CLEAR,
        method: 'POST',
        showLoading: true,
        body: params,
        success: (data)=>{
          Toast.show('催款成功')
          dispatch(changeOrderurgedWithOrderNo(params.orderNo))
          /**
           * 2017-11-08, 09:18:20 GMT+0800
           * 以前点击【申请结算】后变成【结算中】
           * 现在点击【催款】后状态不变，只是标记为 已催款
           */
          // if (params.activeTab == 3) {
          //   dispatch(changeOrderTopTab(3,1))//这个切换有bug 暂时只在activeTab == 3 ’结算‘ 下切换
          // };
          if (successCallBack) {
            successCallBack()
          }
          dispatch(appendLogToFile('订单','催款成功',startTime))
        }
      }))
    },
    _changeSelectStateWithOrderNo: (orderNo) =>{
      dispatch(changeSelectStateWithOrderNo(orderNo))
    },
    _clearConfirm: (params) =>{
      startTime = new Date().getTime();
      dispatch(fetchData({
        api: API.CLEAR_CONFIRM,
        showLoading: true,
        method: 'POST',
        body: params,
        success: (data)=>{
          Toast.show('确认结算成功')
          console.log(" 确认结算成功 改状态为12 已完成（从 orderPaying 中移除）");
          dispatch(changeOrderToStateWithOrderNo(12,params.orderNo,'orderPaying'))
          dispatch(changeOrderToStateWithOrderNo(12,params.orderNo,'orderAll'))
          dispatch(appendLogToFile('订单','确认结算成功',startTime))

        }
      }))
    },
    _requestCoordinateResult: (params,successCallBack)=>{
      startTime = new Date().getTime();
      dispatch(fetchData({
        api: API.COORDINATE_RESULT,
        method: 'GET',
        showLoading: true,
        body: params,
        success: (data)=>{
          dispatch(appendLogToFile('订单','查看协调结果',startTime))
          if(successCallBack){successCallBack({...data,...params})}
        }
      }))
    },
    _getBankCardList: (carrierId,successCallBack,failCallBack) => {
      startTime = new Date().getTime();
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
          dispatch(appendLogToFile('订单','查询是否添加银行卡信息',startTime))
        }
      }));
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
