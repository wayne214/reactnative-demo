'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  InteractionManager,
    FlatList
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view'
import Carousel from 'react-native-snap-carousel';

import NormalRoutes from '../../components/routes/normalRoutes'
import GoodListIten from '../../components/routes/goodListItem';
// import SegmentTabBar from '../../components/common/segmentTabBar'
import * as RouteType from '../../constants/routeType'
import { receiveGoodsList,receiveBetterGoodsList,changeGoodsListLoadingMore } from '../../action/goods'
import { receiveInSiteNotice } from '../../action/app.js'
import { fetchData, appendLogToFile } from '../../action/app.js'
import {betterGoodsSourceEndCount, receiveGoodsDetail} from '../../action/goods.js'
import * as API from '../../constants/api.js'
import driver_limit from '../../../assets/img/app/driver_limit.png'
import Toast from 'react-native-root-toast'
const { height,width } = Dimensions.get('window')
function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = 28;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const itemHeight = 150 * itemWidth / 335;

import bannerImage1 from '../../../assets/home/banner1.png';
import bannerImage2 from '../../../assets/home/banner2.png';

const images = [
    bannerImage1,
    bannerImage2,
];

import { resetADFlag } from '../../action/app'
import * as COLOR from '../../constants/colors'
import SearchGoodsFilterView from '../../components/routes/goodsFilterView'
// import ScrollAD from '../../components/common/scrollAD.js'
let startTime = 0

class GoodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      searchAddressInfo: null,
    }
    this._refreshList = this._refreshList.bind(this)
    this.separatorComponent = this.separatorComponent.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.getGoodListSuccess = this.getGoodListSuccess.bind(this)
  }
  componentDidMount() {
    this._refreshList(this.getGoodListSuccess)
  }

  _refreshList(getGoodListSuccess){
    this.props._getNormalGoodsList({
        companyCode: global.userId,
        num: 0,
        size: 20
    },getGoodListSuccess)
  }
  getGoodListSuccess(data){
debugger
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {backgroundColor: 'white'},
    }
  }
    renderImg(item, index) {
        console.log('------item-----', item);
        return (
            <Image
                style={{
                    width: itemWidth,
                    height: itemHeight,
                }}
                resizeMode='contain'
                source={item.item}
            />
        );
    }

    separatorComponent() {
        return (
            <View style={styles.separatorLine}/>
        );
    };
    renderItem = (item) => {
      console.log('item=====',item);
        return (
           item.index === 0 ?
               <Carousel
                   data={images}
                   renderItem={this.renderImg}
                   sliderWidth={width}
                   itemWidth={itemWidth}
                   hasParallaxImages={true}
                   firstItem={1}
                   inactiveSlideScale={0.94}
                   inactiveSlideOpacity={0.8}
                   enableMomentum={true}
                   loop={true}
                   loopClonesPerSide={2}
                   autoplay={true}
                   autoplayDelay={500}
                   autoplayInterval={3000}
                   removeClippedSubviews={false}
               />

               :
               <View>
                 <GoodListIten itemClick={()=>{
                    this.props.navigation.dispatch({
                      type: RouteType.ROUTE_GOOD_LIST_DETAIL,
                    })
                 }}/>

               </View>
        )
    };

  render() {
    const {
      goodsSource={},
      betterGoodsSource={},
      _getNormalGoodsList,
      user,
      dispatch,
      insiteNotice
    } = this.props
    const {activeTab,searchAddressInfo} = this.state
    const searchIcon = (user.certificationStatus == 2 && user.carrierType == 2 && activeTab == 1) ? '' : '&#xe610;'




     // if (user.currentUserRole == 1) {
     if (1 === 1) {
      return (
        <View style={styles.container}>
          <NavigatorBar
              title='货源'
              router={this.props.navigation}
              hiddenBackIcon={true}
          />

          <FlatList
              keyExtractor={ () => Math.random(2) }
              data={['占位符',1,2,3]}
              renderItem={this.renderItem}
              ItemSeparatorComponent={this.separatorComponent}
          />


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

/*
* {
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
 this.props.dispatch({type: RouteType.ROUTE_RULE_INSTRUCTION, params: {title: '市场规则说明'}})
 this.props.dispatch(appendLogToFile('线路货源','查看线路货源规则说明',0))
 }}
 backTitle={activeTab == 1 ? '竞价管理' : '抢单管理'}
 backTitleStyle={{fontSize: 14}}
 backViewClick={()=>{
 this.props.navigation.dispatch({
 type: RouteType.ROUTE_BIDDING_LIST,
 params: {isBetter: activeTab == 1, title: activeTab == 1 ? '我的竞价' : '我的抢单'}
 })
 }}
 firstLevelIconFont='&#xe610;'
 firstLevelIconFontStyle={{ fontSize: 20 }}
 firstLevelClick={ () => {
 this.props.dispatch({
 type: RouteType.ROUTE_SEARCH_GOODS,
 params: {
 title: '搜索',
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
 this.props.dispatch(appendLogToFile('线路货源','搜索',0))
 }}/>
 }
 {
 this.props.note && insiteNotice ?
 <View style={styles.rollContainer}>
 <View style={styles.leftButton}>
 <Text style={{fontFamily: 'iconfont',color: '#FFAC1A'}}>&#xe639;</Text>
 </View>
 <View style={styles.contentView}>
 <Text style={{ color:'#FFAC1A', fontSize:14}} numberOfLines={1}>{insiteNotice}</Text>
 </View>
 <View style={styles.closeButton}>
 <View style={ {backgroundColor: '#FFF8EE',height:36, width:39,justifyContent: 'center',alignItems: 'center', }}>
 <Text style={{fontFamily: 'iconfont',color: '#FFAC1A'}} onPress={()=>{
 this.props.dispatch(receiveInSiteNotice());
 }}>&#xe638;</Text>
 </View>
 </View>
 </View>
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
 style={{backgroundColor: COLOR.APP_CONTENT_BACKBG,marginBottom: DANGER_BOTTOM }}
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
 type='goodsSource'
 tabLabel="普通货源市场"
 dataSource={goodsSource}
 dispatch={dispatch}
 refreshList={this._refreshList}
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
 console.log(">>>>>>>>>>>>>>>>> loadMoreAction");
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
 type='betterGoodsSource'
 tabLabel="优质货源市场"
 dispatch={dispatch}
 dataSource={betterGoodsSource}
 refreshList={this._refreshList}
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
 </ScrollableTabView>*/

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
  },
  rollContainer:{
    height: 36,
    width,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leftButton:{
    width: 39,
    height: 36,
    backgroundColor: '#FFF8EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentView:{
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    width: width - 39 * 2,
    backgroundColor: '#FFF8EE',
  },
  closeButton: {
    width: 39,
    height: 36,
    justifyContent: 'center',
    alignItems:'flex-end',
  },
    separatorLine: {
        height: 10,
        backgroundColor: '#f0f2f5',
    },
})

const mapStateToProps = (state) => {
  const {goods,app} = state
  return {
    insiteNotice: app.get('insiteNotice'),
    user: app.get('user'),
    goodsSource: goods.get('goodsSource'),
    betterGoodsSource: goods.get('betterGoodsSource')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    _getNormalGoodsList: (params,getGoodListSuccess)=>{
      console.log(" --->>>>> 刷新 货源 列表");
      startTime = new Date().getTime();
        dispatch(fetchData({
        api: API.GOODS_SOURCE_LIST,
        method: 'POST',
        body: params,
        success: (data) => {

            getGoodListSuccess(data)
        }
      }))
    },
    _endCountCallBack: (id) => {
      dispatch(betterGoodsSourceEndCount(id));
    },

    _getResourceDetail: (resourceId,userId,successCallBack,failCallBack)=>{
      startTime = new Date().getTime();
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
          dispatch(appendLogToFile('线路货源','获取货源详情',startTime))
        }
      }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodsList);
