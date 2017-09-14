'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  InteractionManager
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view'
import NormalRoutes from '../../components/routes/normalRoutes'
// import SegmentTabBar from '../../components/common/segmentTabBar'
import * as RouteType from '../../constants/routeType'
import { receiveGoodsList,receiveBetterGoodsList,changeGoodsListLoadingMore } from '../../action/goods'
import { fetchData } from '../../action/app.js'
import {betterGoodsSourceEndCount, receiveGoodsDetail} from '../../action/goods.js'
import * as API from '../../constants/api.js'
import driver_limit from '../../../assets/img/app/driver_limit.png'
import Toast from 'react-native-root-toast'
const { height,width } = Dimensions.get('window')

import * as COLOR from '../../constants/colors'
import SearchGoodsFilterView from '../../components/routes/goodsFilterView'
import ScrollAD from '../../components/common/scrollAD.js'

class GoodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      searchAddressInfo: null,
      ADContent: '你看到的是一条广告，没错这就是广告，垃圾广告，又没什么卵用，非要加不可'
    }
  }
  componentDidMount() {
    const {user} = this.props
    this.props._getNormalGoodsList({
      type: 0,
      companyId: user.userId,
      pageNo: 1
    },user)
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {backgroundColor: 'white'},
    }
  }

  render() {
    const {
      goodsSource={},
      betterGoodsSource={},
      _getNormalGoodsList,
      user
    } = this.props
    const {activeTab,searchAddressInfo} = this.state
    const searchIcon = (user.certificationStatus == 2 && user.carrierType == 2 && activeTab == 1) ? '' : '&#xe610;'

    if (user.currentUserRole == 1) {
      return (
        <View style={styles.container}>
        {
          user.certificationStatus == 2 && user.carrierType == 2 && activeTab == 1 ?
            <NavigatorBar
              hiddenBackIcon={true}
              title={ '线路货源' }
              assistIconFont='&#xe619;'
              assistIconFontStyle={{fontSize: 14,marginLeft: 5}}
              assistIconClick={()=>{
                this.props.dispatch({type: RouteType.ROUTE_RULE_INSTRUCTION})
              }}/>
          :
            <NavigatorBar
              hiddenBackIcon={true}
              title={ '线路货源' }
              assistIconFont='&#xe619;'
              assistIconFontStyle={{fontSize: 14,marginLeft: 5}}
              assistIconClick={()=>{
                this.props.dispatch({type: RouteType.ROUTE_RULE_INSTRUCTION})
              }}
              backTitle={activeTab == 1 ? '竞价管理' : '抢单管理'}
              backTitleStyle={{fontSize: 14}}
              backViewClick={()=>{
                this.props.navigation.dispatch({
                  type: RouteType.ROUTE_BIDDING_LIST,
                  params: {isBetter: activeTab == 1}
                })
              }}
              firstLevelIconFont='&#xe610;'
              firstLevelIconFontStyle={{ fontSize: 20 }}
              firstLevelClick={ () => {
                this.props.dispatch({
                  type: RouteType.ROUTE_SEARCH_GOODS,
                  params: {
                    searchEditCallBack: (data)=>{
                      this.setState({
                        searchAddressInfo: data
                      })
                      data = data || {}
                      data.type = activeTab
                      data.pageNo = 1
                      data.companyId = user.userId
                      _getNormalGoodsList({...data},user)
                    }
                  }
                })
              }}/>
        }
        {
          this.state.ADContent ?
            <ScrollAD
              content={this.state.ADContent}
              closeAction={()=>{
                console.log(" close ad action ");
                this.setState({
                  ADContent: ''
                })
              }}/>
          : null
        }
          {
            searchAddressInfo ?
              <SearchGoodsFilterView searchAddressInfo={searchAddressInfo} closeAction={()=>{
                this.setState({
                  searchAddressInfo: null
                })
                _getNormalGoodsList({
                  type: activeTab,
                  pageNo: 1,
                  companyId: user.userId
                },user)
              }}/>
            : null
          }
          <ScrollableTabView
            style={{backgroundColor: COLOR.APP_CONTENT_BACKBG}}
            renderTabBar={() =>
              <DefaultTabBar style={{height: 40,borderWidth:1,borderBottomColor: '#e6eaf2', backgroundColor: 'white'}}
                tabStyle={{paddingBottom: 2}}/>
            }
            onChangeTab={(obj)=>{
              if (obj.i == obj.from) {return}
              this.setState({
                activeTab: obj.i
              })
              const param = searchAddressInfo || {}
              param.type = obj.i
              param.companyId = user.userId
              param.pageNo = 1
              if (user.certificationStatus == 2 && user.carrierType == 2 && obj.i == 1) {
                return
              };
              InteractionManager.runAfterInteractions(()=>{
                _getNormalGoodsList(param,user)
              })


            }}
            tabBarUnderlineStyle={{backgroundColor: COLOR.APP_THEME,height: 2,width: 90,marginLeft:(width*0.5-90)*0.5 }}
            tabBarActiveTextColor={COLOR.APP_THEME}
            tabBarInactiveTextColor={COLOR.TEXT_NORMAL}
            tabBarTextStyle={{fontSize:15}}>
            <NormalRoutes
              tabLabel="普通货源市场"
              dataSource={goodsSource}
              itemClick={(itemData)=>{

              }}
              grabOrderAction={(itemData)=>{
                if (user.certificationStatus != 2) {
                  Toast.show('您的账号未认证不能进行抢单操作！')
                  return
                }
                if (user.carrierType == 2 && user.certificationStatus == 2 && itemData.entrustType == 1) {
                  // 已认证的个体用户 且 当前选择的货源是自营货源
                  Toast.show('个体用户不能参与自营货源的抢单操作')
                  return
                };
                itemData.refreshCallBack = ()=>{
                  this.props._getNormalGoodsList({
                    type: 0,
                    companyId: user.userId,
                    pageNo: 1
                  },user)
                }
                this.props._getResourceDetail(itemData.resourceId,user.userId,(resourceState)=>{
                  if (resourceState == 5) {
                    this.props.navigation.dispatch({
                      type: RouteType.ROUTE_PRE_ORDER,
                      params: itemData
                    })
                    // this.props.router.push(RouteType.ROUTE_PRE_ORDER,itemData)
                  }else{
                    Toast.show('委托已取消或关闭，不能再抢单')
                  }
                })
              }}
              loadMoreAction={()=>{
                const param = searchAddressInfo || {}
                param.type = 0
                param.companyId = user.userId
                param.pageNo = parseInt(goodsSource.get('pageNo')) + 1,
                _getNormalGoodsList(param,user)
              }}/>
            {
              user.certificationStatus == 2 && user.carrierType == 2 ?
                <View tabLabel="优质货源市场" style={{flex: 1}}>
                  <View style={{justifyContent: 'center'}}>
                    <View style={styles.limitView}>
                      <Image source={driver_limit}/>
                      <Text style={styles.limitText}>由于您登录的为个体账号，无权限访问该页面</Text>
                      <Text style={styles.limitText}>请使用公司账号进行访问操作</Text>
                      <Text style={styles.limitText}>给您带来不便请谅解</Text>
                    </View>
                  </View>
                </View>
              :
                <NormalRoutes
                  type='better'
                  tabLabel="优质货源市场"
                  dataSource={betterGoodsSource}
                  itemClick={(itemData)=>{

                  }}
                  endCounttingCallBack={(id)=>{
                    console.log(" ===== itemData.resourceId",id);
                    this.props._endCountCallBack(id)
                  }}
                  biddingAction={(itemData)=>{
                    if (user.certificationStatus != 2) {
                      Toast.show('您的账号未认证不能进行报价操作！')
                      return
                    }
                    itemData.refreshCallBack = ()=>{
                      this.props._getNormalGoodsList({
                        type: 1,
                        companyId: user.userId,
                        pageNo: 1
                      },user)
                    }
                    this.props._getResourceDetail(itemData.resourceId,user.userId,(resourceState)=>{
                      if (resourceState == 2) {
                        this.props.navigation.dispatch({
                          type: RouteType.ROUTE_PRE_ORDER,
                          params: itemData
                        })
                        // this.props.router.push(RouteType.ROUTE_PRE_ORDER,itemData)
                      }else{
                        Toast.show('委托已取消或关闭，不能再报价')
                      }
                    })
                  }}
                  loadMoreAction={()=>{
                    const param = searchAddressInfo || {}
                    param.type = 1
                    param.companyId = user.userId
                    param.pageNo = parseInt(betterGoodsSource.get('pageNo')) + 1,
                    _getNormalGoodsList(param,user)
                  }}/>
            }
          </ScrollableTabView>
        </View>
      )
    }else{
      return(
        <View style={styles.container}>
          <NavigatorBar
            hiddenBackIcon={true}
            title={ '线路货源' }
            firstLevelIconFontStyle={{ fontSize: 20 }}/>
          <View style={{flex: 1,justifyContent: 'center'}}>
            <View style={styles.limitView}>
              <Image source={driver_limit}/>
              <Text style={styles.limitText}>由于您登录的为司机账号，无权限访问该页面</Text>
              <Text style={styles.limitText}>请使用公司账号进行访问操作</Text>
              <Text style={styles.limitText}>给您带来不便请谅解</Text>
            </View>
          </View>
        </View>
      )
    }
  }
}

const styles =StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.APP_CONTENT_BACKBG
  },
  limitView: {
    alignItems: 'center',
  },
  limitText:{
    marginTop: 10,
    fontSize: 14,
    color: COLOR.TEXT_LIGHT
  }
})

const mapStateToProps = (state) => {
  const {goods,app} = state
  return {
    user: app.get('user'),
    goodsSource: goods.get('goodsSource'),
    betterGoodsSource: goods.get('betterGoodsSource')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _getNormalGoodsList: (params,user)=>{

      //3 抢单（普通货源）  2 报价（优质货源）
      if (params.type == 0) {
        params.modeState = 3
        if (user.certificationStatus == 2 && user.carrierType == 2) {
          params.userRole = 1
        };
      }else if(params.type == 1){
        params.modeState = 2
      }
      dispatch(changeGoodsListLoadingMore(params.type))
      dispatch(fetchData({
        api: API.GOODS_SOURCE_LIST,
        method: 'POST',
        body: params,
        success: (data) => {
          if (params.modeState == 2) {
            console.log("- ---- 优质货源列表",data);
          }else if (params.modeState == 3){
            console.log("- ---- 普通源列表",data);
          }
          data.pageNo = params.pageNo
          data.goodsType = params.modeState
          dispatch(receiveGoodsList(data))

        }
      }))
    },
    _endCountCallBack: (id) => {
      dispatch(betterGoodsSourceEndCount(id));
    },

    _getResourceDetail: (resourceId,userId,successCallBack,failCallBack)=>{
      dispatch(fetchData({
        api: API.RESOURCE_DETAIL,
        method: 'POST',
        showLoading: true,
        body:{
          resourceId,
          companyId: userId
        },
        success:(data)=>{
          console.log("------ get resource detail success ",data);
          dispatch(receiveGoodsDetail(data))
          successCallBack && successCallBack(data.resourceState)
        }
      }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodsList);

