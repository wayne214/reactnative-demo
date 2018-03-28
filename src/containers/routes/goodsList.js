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
    TouchableOpacity,
    Platform,
    DeviceEventEmitter
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
import { fetchData, appendLogToFile, changeTab } from '../../action/app.js'
import {betterGoodsSourceEndCount, receiveGoodsDetail} from '../../action/goods.js'
import * as API from '../../constants/api.js'
import driver_limit from '../../../assets/img/app/driver_limit.png'
import Toast from '../../utils/toast';
import LoadingView from '../../utils/loading';


const { height,width } = Dimensions.get('window')
function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = 28;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const itemHeight = 154 * itemWidth / 325;

import bannerImage1 from '../../../assets/img/routes/chengyunfangTopimage.png';
import bannerImage2 from '../../../assets/img/routes/chengyunfangTopimage1.png';

import CharacterChooseCell from '../../../src/components/login/characterChooseCell';
import StorageKey from '../../constants/storageKeys';
import Storage from '../../utils/storage';

import {
    WHITE_COLOR,
    BLUE_CONTACT_COLOR,
    DEVIDE_LINE_COLOR,
    COLOR_SEPARATE_LINE,
    LIGHT_GRAY_TEXT_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
    COLOR_LIGHT_GRAY_TEXT,
    REFRESH_COLOR,
} from '../../constants/colors';

import {
    setCurrentCharacterAction,
    setOwnerCharacterAction,
    setCompanyCodeAction,
    setDriverCharacterAction,
    setOwnerNameAction,
    saveCompanyInfoAction
} from '../../action/user';

import Linking from '../../utils/linking'


import DriverUp from '../../../assets/img/character/driverUp.png';
import DriverDown from '../../../assets/img/character/driverDown.png';
import OwnerUp from '../../../assets/img/character/ownerUp.png';
import OwnerDown from '../../../assets/img/character/ownerDown.png';

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
let goodArray = [];

class GoodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      searchAddressInfo: null,
        refreshing: false,
        goodList: goodArray,
        showText: '点击加载更多',
        bubbleSwitch: false,
        show: false,
        appLoading: false,
        pages : 1,
    }
    this._refreshList = this._refreshList.bind(this)
    this.separatorComponent = this.separatorComponent.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.getGoodListSuccess = this.getGoodListSuccess.bind(this)
    this.getGoodListFail = this.getGoodListFail.bind(this)
    this.refresh = this.refresh.bind(this)
    this.listFooterComponent = this.listFooterComponent.bind(this)
    this.ListHeaderComponent = this.ListHeaderComponent.bind(this)


      this.searchDriverState = this.searchDriverState.bind(this);
      this.searchDriverStateSucCallBack = this.searchDriverStateSucCallBack.bind(this);
      this.ownerVerifiedHome = this.ownerVerifiedHome.bind(this);
      this.ownerVerifiedHomeSucCallBack = this.ownerVerifiedHomeSucCallBack.bind(this);
      this.ownerVerifiedHomeFailCallBack = this.ownerVerifiedHomeFailCallBack.bind(this);
  }
  componentDidMount() {
      this.setState({
          refreshing: true
      });



      setTimeout(()=>{
          this.refresh();
      },500);

      this.resetCarrierGoodslistener = DeviceEventEmitter.addListener('resetCarrierGoods', () => {
          this.refresh();
      });
  }

    componentWillUnmount() {
        goodArray = null;
        this.resetCarrierGoodslistener.remove();
    }
  _refreshList(getGoodListSuccess,getGoodListFail){
      //if (this.props.ownerStatus == '12' || this.props.ownerStatus == '22'){
          this.setState({
              appLoading: true,
          })


          this.props._getNormalGoodsList({
              companyCode: global.companyCode,
              num: page,
              size: 20
          },getGoodListSuccess,getGoodListFail)
      //}

  }
  getGoodListSuccess(data){
    if (page === 0){
        goodArray = [];
    }

     goodArray = goodArray.concat(data.list);

      this.setState({
          showText: '点击加载更多',
      })



    this.setState({
          goodList: goodArray,
          refreshing: false,
        appLoading: false,
        pages: data.pages,
      });


  }

    getGoodListFail(){
      page--;
        this.setState({
            refreshing: false,
            appLoading: false,
        });
    }
  // 下拉刷新
    refresh(){

        goodArray = [];
        page = 0;
        this._refreshList(this.getGoodListSuccess,this.getGoodListFail)
    }


    listFooterComponent(){
      return(
          <TouchableOpacity style={{padding: 20,marginTop: 10, backgroundColor: 'white'}} onPress={()=>{
              page++;


                if (this.state.pages <=  page){
                  this.setState({
                      showText: '没有更多',
                  })
                    return;
                }

              this._refreshList(this.getGoodListSuccess,this.getGoodListFail)



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
    ListHeaderComponent(){
        return (
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
        )
    }



    renderItem = (item) => {

        return (
            <GoodListIten item={item.item} itemClick={()=>{
                                // 报价状态（报价状态0.暂未出价1.带接收2.已接收3.已拒绝）
                                if (!item.item.biddingState) {
                                    this.props.navigation.dispatch({
                                        type: RouteType.ROUTE_GOOD_LIST_DETAIL,
                                        params: {
                                            goodID: item.item.resourceCode,
                                            type: '2'
                                        }
                                    })
                                }else {
                                    Toast.show('已经报价成功，请勿重复报价');
                                }
                     }}/>
        )
    };

    /*
    * */

    searchDriverState(searchDriverStateSucCallBack) {
        this.props.searchDriverStateAction({}, searchDriverStateSucCallBack)
    }

    searchDriverStateSucCallBack(result) {


        if (result) {
            if (result.status == '10') {
                this.props.setDriverCharacterAction('4');
                this.setState({
                    bubbleSwitch: false,
                    show: false,
                })
                Toast.show('司机身份已经被禁用，如需帮助请联系客服');
                return
            } else {
                if (result.certificationStatus == '1201') {
                    this.props.setDriverCharacterAction('1');
                }
                if (result.certificationStatus == '1202') {
                    this.props.setDriverCharacterAction('2');
                }
                if (result.certificationStatus == '1203') {
                    this.props.setDriverCharacterAction('3');
                }
                if (result.certificationStatus == '1203') {

                    Storage.get(StorageKey.changePersonInfoResult).then((value) => {

                        if (value) {

                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_DRIVER_VERIFIED_DETAIL,
                                params: {
                                    phone: global.phone,//global.phone
                                    commitSuccess: () => {
                                        this.setState({
                                            bubbleSwitch: false,
                                            show: false,
                                        })
                                    }
                                }
                            })


                        } else {

                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_DRIVER_VERIFIED_DETAIL,
                                params: {
                                    phone: global.phone,//global.phone
                                    commitSuccess: () => {

                                        this.setState({
                                            bubbleSwitch: false,
                                            show: false,
                                        })
                                    }
                                }
                            })


                        }
                    });

                    this.setState({
                        show: false,
                    })

                } else {

                    this.props.setCurrentCharacterAction('driver');
                    this.props.dispatch(changeTab('Home'));
                    this.setState({
                        bubbleSwitch: false,
                        show: false,
                    })
                }
            }
        } else {

            this.props.navigation.dispatch({
                type: RouteType.ROUTE_DRIVER_VERIFIED,
                params: {
                    phone: global.phone,//global.phone
                    type: 'login',
                    commitSuccess: () => {
                        this.setState({
                            bubbleSwitch: false,
                            show: false,
                        })
                    }
                }
            })
        }
    }

    ownerVerifiedHome(ownerVerifiedHomeSucCallBack, ownerVerifiedHomeFailCallBack) {

        if (this.props.userInfo) {
            if (this.props.userInfo.phone) {
                this.props.ownerVerifiedHomeAction({
                    busTel: global.phone,
                }, ownerVerifiedHomeSucCallBack, ownerVerifiedHomeFailCallBack)
            }
        }
    }

    ownerVerifiedHomeSucCallBack(result) {
        console.log('ownerVerifiedState==', result);
        // let result = result;
        this.setState({
            verifiedState: result && result.certificationStatus,
        });
        // 首页状态
        if (result.companyNature == '个人') {
            if (result.status == '10') {
                Toast.show('个人车主身份被禁用');
                return
            } else {
                // 确认个人车主
                if (result.certificationStatus == '1201') {
                    this.props.setOwnerCharacterAction('11');
                    this.props.setCurrentCharacterAction('personalOwner');
                    this.setState({
                        bubbleSwitch: false,
                        show: false,
                    })
                } else {
                    if (result.certificationStatus == '1202') {
                        this.props.setCompanyCodeAction(result.companyCode);
                        this.props.saveCompanyInfoAction(result);
                        this.props.setOwnerCharacterAction('12');
                        this.props.setCurrentCharacterAction('personalOwner');
                        this.setState({
                            bubbleSwitch: false,
                            show: false,
                        })
                    } else {
                        this.props.setOwnerCharacterAction('13');
                        this.props.navigation.navigate('PersonownerVerifiedStatePage');
                        this.setState({
                            show: false,
                        })
                    }
                }
            }

        } else {
            if (result.companyNature == '企业') {
                if (result.status == '10') {
                    Toast.show('企业车主身份被禁用');
                    return
                } else {
                    // 确认企业车主
                    if (result.certificationStatus == '1201') {
                        this.props.setOwnerCharacterAction('21');
                        this.props.setCurrentCharacterAction('businessOwner');
                        this.setState({
                            bubbleSwitch: false,
                            show: false,
                        })
                    } else {
                        if (result.certificationStatus == '1202') {
                            this.props.setCompanyCodeAction(result.companyCode);
                            this.props.saveCompanyInfoAction(result);
                            this.props.setOwnerCharacterAction('22');
                            this.props.setCurrentCharacterAction('businessOwner');
                            this.setState({
                                bubbleSwitch: false,
                                show: false,
                            })
                        } else {
                            this.props.setOwnerCharacterAction('23');
                            this.props.navigation.navigate('EnterpriseownerVerifiedStatePage');
                            this.setState({
                                show: false,
                            })
                        }
                    }
                }
            } else {


                this.props.navigation.dispatch({
                    type: RouteType.ROUTE_CHARACTER_OWNER,
                })
                this.setState({
                    show: false,
                })
            }
        }
    }

    ownerVerifiedHomeFailCallBack(result) {


        if (result.message == '没有车主角色') {
            this.props.navigation.dispatch({
                type: RouteType.ROUTE_CHARACTER_OWNER,
            })
            this.setState({
                show: false,
            })
        }
    }



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
              <View style={{
                  height: 64,
                  ...Platform.select({
                      ios: {
                          paddingTop: 15,
                      },
                      android: {
                          paddingTop: 0,
                      },
                  }),
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#ffffff'
              }}>
                  <View style={{
                      flex: 1,
                      justifyContent: 'center',
                  }}>
                      <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                              this.setState({
                                  bubbleSwitch: !this.state.bubbleSwitch,
                                  show: !this.state.show,
                              })
                          }}
                      >
                          <View>
                              <Image
                                  style={{
                                      marginLeft: 15,
                                      marginTop: 10,
                                  }}
                                  source={
                                      this.props.currentStatus == 'driver' ?
                                          this.state.bubbleSwitch ? DriverUp : DriverDown
                                          : this.state.bubbleSwitch ? OwnerUp : OwnerDown
                                  }
                              />
                          </View>
                      </TouchableOpacity>
                  </View>
                  <View style={{
                      flex: 2,
                      justifyContent: 'center'
                  }}>
                      <Text style={{
                          textAlign: 'center',
                          color: LIGHT_BLACK_TEXT_COLOR,
                          fontSize: 18,
                          marginTop: 10,
                          fontWeight: 'bold'
                      }}>货源</Text>
                  </View>
                  <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: 15,
                  }}>
                      <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                              // TODO
                              Linking.link(this.props.hotLine)
                          }}
                      >
                          <View>
                              <Text style={{fontFamily: 'iconfont', fontSize: 20, color: '#5C5C68',paddingTop: 5}}>&#xe63f;</Text>
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                              // TODO
                              this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }})
                          }}
                      >
                          <View style={{marginLeft: 15}}>
                              <Text style={{fontFamily: 'iconfont', fontSize: 20, color: '#5C5C68',paddingTop: 6}}>&#xe640;</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>


              <FlatList
                  style={{paddingTop: 10}}
                  extraData={this.state}
                  keyExtractor={ () => Math.random(2) }
                  data={this.state.goodList}
                  renderItem={this.renderItem}
                  ItemSeparatorComponent={this.separatorComponent}
                  refreshing={this.state.refreshing} // 是否刷新 ，自带刷新控件
                  onRefresh={this.refresh} // 刷新方法,写了此方法，下拉才会出现  刷新控件，使用此方法必须写 refreshing
                  ListFooterComponent={this.listFooterComponent}
                  ListHeaderComponent={this.ListHeaderComponent}
              />

              {
                  this.state.show ?
                      <CharacterChooseCell
                          carClick={() => {
                          this.ownerVerifiedHome(this.ownerVerifiedHomeSucCallBack, this.ownerVerifiedHomeFailCallBack);
                      }}
                          driverClick={() => {
                          this.searchDriverState(this.searchDriverStateSucCallBack);
                      }}
                      /> : null
              }

              {
                  this.state.appLoading ? <LoadingView /> : null
              }


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
    betterGoodsSource: goods.get('betterGoodsSource'),
    hotLine: app.get('hotLine'),
      ownerStatus: state.user.get('ownerStatus'),
      currentStatus: state.user.get('currentStatus'),
      companyCode:state.user.get('companyCode'),

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    _getNormalGoodsList: (params,getGoodListSuccess,getGoodListFail)=>{
      startTime = new Date().getTime();
        dispatch(fetchData({
        api: API.GOODS_SOURCE_LIST,
        method: 'POST',
        body: params,
        success: (data) => {

            getGoodListSuccess(data)
        },
        fail: () => {
            getGoodListFail();
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
    },

      searchDriverStateAction: (params, searchDriverStateSucCallBack) => {
          dispatch(fetchData({
              body: params,
              method: 'POST',
              api: API.API_DRIVER_QUERY_DRIVER_INFO + global.phone,
              success: (data) => {
                  searchDriverStateSucCallBack(data);
              },
          }))
      },
      setDriverCharacterAction: (result) => {
          dispatch(setDriverCharacterAction(result));
      },
      setOwnerCharacterAction: (result) => {
          dispatch(setOwnerCharacterAction(result));
      },
      setCurrentCharacterAction: (result) => {
          dispatch(setCurrentCharacterAction(result));
      },
      setCompanyCodeAction: (result) => {
          dispatch(setCompanyCodeAction(result));
      },
      setOwnerNameAction:(data)=>{
          dispatch(setOwnerNameAction(data));
      },
      ownerVerifiedHomeAction: (params, ownerVerifiedHomeSucCallBack, ownerVerifiedHomeFailCallBack) => {
          dispatch(fetchData({
              body: params,
              method: 'POST',
              api: API.API_QUERY_COMPANY_INFO,
              success: (data) => {
                  ownerVerifiedHomeSucCallBack(data);
              },
              fail: (data) => {
                  ownerVerifiedHomeFailCallBack(data);
              }
          }))
      },
      saveCompanyInfoAction: (result) => {
          dispatch(saveCompanyInfoAction(result));
      },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodsList);
