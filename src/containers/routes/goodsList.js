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
    FlatList,
    TouchableOpacity
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
let startTime = 0;
let page = 0;
let goodArray = ['占位符'];

class GoodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      searchAddressInfo: null,
        refreshing: false,
        goodList: [],
        showText: '点击加载更多',
        loadMore: true
    }
    this._refreshList = this._refreshList.bind(this)
    this.separatorComponent = this.separatorComponent.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.getGoodListSuccess = this.getGoodListSuccess.bind(this)
    this.refresh = this.refresh.bind(this)
    this.listFooterComponent = this.listFooterComponent.bind(this)
  }
  componentDidMount() {
      this.setState({
          refreshing: true
      });
    this.refresh();
  }

    componentWillUnmount() {
        goodArray = null;
    }
  _refreshList(getGoodListSuccess){

    this.props._getNormalGoodsList({
        companyCode: global.companyCode,
        num: page,
        size: 20
    },getGoodListSuccess)
  }
  getGoodListSuccess(data){
    if (page === 0){
        goodArray = ['占位符'];
    }

    if (data.list.length === 0){
      this.setState({
          showText: '没有更多',
          loadMore: false
      })
    }
     goodArray = goodArray.concat(data.list);

    this.setState({
          goodList: goodArray,
          refreshing: false
      });

  }

  // 下拉刷新
    refresh(){

        goodArray = ['占位符'];
        page = 0;
        this._refreshList(this.getGoodListSuccess)
    }


    listFooterComponent(){
      return(
          <TouchableOpacity style={{padding: 20,marginTop: 10, backgroundColor: 'white'}} onPress={()=>{

            if (this.state.loadMore){
              page++;
              this._refreshList(this.getGoodListSuccess)
            }


          }}>
            <Text style={{textAlign: 'center'}}>{this.state.showText}</Text>
          </TouchableOpacity>
      )
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
                 <GoodListIten item={item.item} itemClick={()=>{
                    this.props.navigation.dispatch({
                      type: RouteType.ROUTE_GOOD_LIST_DETAIL,
                      params: {
                          goodID: item.item.resourceCode,
                          type: '2'
                      }
                    })
                 }}/>

               </View>
        )
    };

  render() {
      const {
          goodsSource = {},
          betterGoodsSource = {},
          _getNormalGoodsList,
          user,
          dispatch,
          insiteNotice
      } = this.props;
      const {activeTab, searchAddressInfo} = this.state
      const searchIcon = (user.certificationStatus == 2 && user.carrierType == 2 && activeTab == 1) ? '' : '&#xe610;'
      return (
          <View style={styles.container}>
            <NavigatorBar
                title='货源'
                router={this.props.navigation}
                hiddenBackIcon={true}
            />

            <FlatList
                extraData={this.state}
                keyExtractor={ () => Math.random(2) }
                data={this.state.goodList}
                renderItem={this.renderItem}
                ItemSeparatorComponent={this.separatorComponent}
                refreshing={this.state.refreshing} // 是否刷新 ，自带刷新控件
                onRefresh={this.refresh} // 刷新方法,写了此方法，下拉才会出现  刷新控件，使用此方法必须写 refreshing
                ListFooterComponent={this.listFooterComponent}
            />


          </View>
      )
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
