import React from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  ImageBackground
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DrawerNavigator } from 'react-navigation'
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import styles from '../../../assets/css/home';
import Route from '../../components/travel/route';
import Linking from '../../utils/linking';
import Toast from '../../utils/toast';
import * as RouteType from '../../constants/routeType';
import RouteEmpty from '../../../assets/img/car/route_empty.png';
import CarStatusBg from '../../../assets/img/app/car_status.png';
import CarNoBg from '../../../assets/img/car/car_no_bg.png';
import RouteNoCar from '../../../assets/img/car/route_no_car.png';
import RouteLoading from '../../../assets/gif/route_loading.gif';
import Button from '../../components/common/button';
import { TRAVEL_ONOFCAR, QUERY_CAR_LIST, CONFIRM_INSTALL } from '../../constants/api';
import { fetchData, refreshTravel, appendLogToFile } from '../../action/app';
import { dispatchDravelList, dispatchDefaultCar, travelInfoDone } from '../../action/travel';
import Helper from '../../utils/helper';
import { changeTab } from '../../action/app';

let startTime = 0
class HomeContainer extends BaseComponent {

  constructor(props) {
    super(props);
    this.title = '行程';
    this.state = {};
    this._addCar = this._addCar.bind(this);
    this.confirmShipments = this.confirmShipments.bind(this);
  }

  static propTypes = {
    router: PropTypes.object,
    click: PropTypes.func,
  }

  componentDidMount() {
    super.componentDidMount()
    const { user } = this.props;
    if (!user || !user.userId) return
    this.timer = setTimeout(() => {
      if (user.currentUserRole === 1) {
        this.props.getCarList({
          pageNo: 1,
          haveDriver: 1,
          carrierId: user.userId
        });
      } else {
        this.props.getTravel({
          companyId: user.carrierId,
          carId: user.carId ? user.carId : '',
        });
      }
    }, 100);
  }

  componentWillReceiveProps(props) {
    if (props && props.isNeedRefreshTravel) {
      // 点击我的行程刷新
      let _carId;
      if (props.user.currentUserRole === 1) {
        _carId = props.carPayLoad.id;
      } else {
        _carId = props.user.carId ? props.user.carId : '';
      }
      if (_carId) {
        this.props.getTravel({
          carId: _carId,
          companyId: props.user.currentUserRole === 1 ? props.user.userId : props.user.carrierId
        });
      }
      else {
        if (props.user.currentUserRole === 1) {
          this.props.getCarList({
            pageNo: 1,
            haveDriver: 1,
            carrierId: props.user.userId
          });
        } else {
          this.props.getTravel({
            carId: _carId,
            companyId: props.user.carrierId
          });
        }
      }
    }
  }

  confirmShipments(id, state) {
    const { payload, user } = this.props;
    this.props._confirmShipment({
      carId: user.carId ? user.carId : '',
      orderNo: this.props.travelDetail.orderNo,
      entrustType: this.props.travelDetail.entrustType
    }, { id: payload.id, carState: payload.carState });
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.timer && clearTimeout(this.timer)
  }

  _addCar() {
    this.props.navigation.dispatch({ type: RouteType.ROUTE_ADD_CAR, params: { title:  '添加车辆' } })
  }

  render() {
    const { user, travelDetail, carPayLoad, navigation } = this.props;
    return (
      <View style={ styles.container }>

        {
          user.currentUserRole === 1 ?
            <NavigatorBar
              title='我的行程'
              backIconFont='&#xe60a;'
              firstLevelIconFont='&#xe609;'
              secondLevelIconFont='&#xe60b;'
              thirdLevelIconFont='&#xe60f;'
              firstLevelIconFontStyle={{ fontSize: 24 }}
              backViewClick={ this.props.openControlPanel }
              thirdLevelClick={ () => Linking.link(this.props.hotLine) }
              secondLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }}) }
              firstLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_LIST, params: { title: '' }}) }/>
          :
            <NavigatorBar
              title='我的行程'
              backIconFont='&#xe60a;'
              firstLevelIconFont='&#xe60b;'
              secondLevelIconFont='&#xe60f;'
              backViewClick={ this.props.openControlPanel }
              secondLevelClick={ () => Linking.link(this.props.hotLine) }
              firstLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }}) }/>
        }
        {
          (() => {
            if (user.currentUserRole === 1) {
              if (carPayLoad.carState === -1) {
                return (
                  <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
                    <Image source={ RouteNoCar } />
                    <Text style={ [styles.tipText, { marginTop: 0 }] }>您的车库中暂未添加任何营运车辆</Text>
                    <Button
                      opacity={ 0.8 }
                      title='立即添加车辆'
                      style={ styles.btn }
                      textStyle={ styles.btnsText }
                      onPress={ this._addCar }/>
                  </View>
                );
              }
              // 是否绑定司机 0没有绑定 1以绑定
              if (travelDetail.isBinDing * 1 === 0) {
                return (
                  <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
                    <Image source={ RouteNoCar } />
                    <Text style={ [styles.tipText, { marginTop: 0 }] }>用户未添加车辆或者车辆还未绑定司机</Text>
                  </View>
                );
              } else if (travelDetail.isBinDing * 1 === 1) {
                // 承运商 是否休息  0休息 1运输中
                if (travelDetail.isRest * 1 === 0) {
                  return (
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <ImageBackground style={ styles.topContainer } source={ CarStatusBg }>
                        <View style={ styles.rightContent }>
                          <Text style={ styles.carStatusText }>{ '休息中' }</Text>
                          <ImageBackground style={ [styles.carNoBgStyle, { paddingLeft: 30, paddingRight: 30, paddingBottom: 10 }] } source={ CarNoBg }>
                            <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                          </ImageBackground>
                        </View>
                      </ImageBackground>
                      <Image source={ RouteEmpty } style={{ marginTop: -50 }}/>
                      <Text style={ styles.tipText }>您的当前车辆运输状态为休息中未接受任何订单</Text>
                      <Button
                        title='快去抢单吧'
                        opacity={ 0.8 }
                        style={ styles.btn }
                        textStyle={ styles.btnsText }
                        onPress={ () => this.props.dispatch(changeTab('goods')) }/>
                    </View>
                  );
                } else if (travelDetail.isRest * 1 === 1) {
                  if (travelDetail.orderState) {
                    return (
                      <ScrollView showsVerticalScrollIndicator={ false }>
                        <ImageBackground style={ styles.topContainer } source={ CarStatusBg }>
                          <View style={ styles.rightContent }>
                            <Text style={ styles.carStatusText }>{ Helper.getOrderStateStr(travelDetail.orderState, travelDetail.entrustType) }</Text>
                            <ImageBackground style={ [styles.carNoBgStyle, { paddingLeft: 30, paddingRight: 30, paddingBottom: 10 }] } source={ CarNoBg }>
                              <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                            </ImageBackground>
                          </View>
                        </ImageBackground>
                        <Route confirmShipment={ this.confirmShipments } { ...this.props } />
                      </ScrollView>
                    );
                  } else {
                    // 该车辆在AB两家同时被添加，但在A公司状态为运输中，B公司应该显示为在其他承运商公司运输中
                    return (
                      <View style={{ flex: 1 }}>
                        <ImageBackground style={ styles.topContainer } source={ CarStatusBg }>
                          <View style={ styles.rightContent }>
                            <Text style={ styles.carStatusText }>运输中</Text>
                            <ImageBackground style={ [styles.carNoBgStyle, { paddingLeft: 30, paddingRight: 30, paddingBottom: 10 }] } source={ CarNoBg }>
                              <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                            </ImageBackground>
                          </View>
                        </ImageBackground>
                        <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
                          <Text style={ [styles.tipText, { marginTop: 0 }] }>无法显示信息，因在其他公司承运中</Text>
                        </View>
                      </View>
                    );
                  }
                }
              }
            } else if (user.currentUserRole === 2) {
              // 司机
              if (!user.carId) {
                return (
                  <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
                    <Image source={ RouteNoCar } />
                    <Text style={ styles.tipText }>暂无承运订单</Text>
                  </View>
                );
              }
              // 是否休息  0休息 1运输中
              if (travelDetail.isRest * 1 === 0) {
                return (
                  <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
                    <Image source={ RouteNoCar } />
                    <Text style={ styles.tipText }>暂无承运订单</Text>
                  </View>
                );
              } else if (travelDetail.isRest * 1 === 1) {
                if (travelDetail.orderState) {
                  return (
                    <ScrollView showsVerticalScrollIndicator={ false }>
                      <ImageBackground style={ styles.topContainer } source={ CarStatusBg }>
                        <View style={ styles.rightContent }>
                          <Text style={ styles.carStatusText }>{ Helper.getOrderStateStr(travelDetail.orderState) }</Text>
                          <ImageBackground style={ [styles.carNoBgStyle, { paddingLeft: 30, paddingRight: 30, paddingBottom: 10 }] } source={ CarNoBg }>
                            <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                          </ImageBackground>
                        </View>
                      </ImageBackground>
                      <Route confirmShipment={ this.confirmShipments } { ...this.props } />
                    </ScrollView>
                  );
                } else {
                  return (
                    <View style={{ flex: 1 }}>
                      <ImageBackground style={ styles.topContainer } source={ CarStatusBg }>
                        <View style={ styles.rightContent }>
                          <Text style={ styles.carStatusText }>运输中</Text>
                          <ImageBackground style={ [styles.carNoBgStyle, { paddingLeft: 30, paddingRight: 30, paddingBottom: 10 }] } source={ CarNoBg }>
                            <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                          </ImageBackground>
                        </View>
                      </ImageBackground>
                      <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
                        <Text style={ [styles.tipText, { marginTop: 0 }] }>无法显示信息，因在其他公司承运中</Text>
                      </View>
                    </View>
                  );
                }
              }
            }
            return (<View style={ styles.routeLoadingContainer }><Image style={{ width: 150, height: 70 }} source={ RouteLoading }/></View>);
          })()
        }
        { this.props.loading ? this._renderLoadingView() : null }
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
    isNeedRefreshTravel: travel.get('isNeedRefreshTravel')
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    getCarList: (body) => {
      startTime = new Date().getTime()
      dispatch(fetchData({
        body,
        method: 'POST',
        api: QUERY_CAR_LIST,
        success: (data) => {
          if (data.list.length === 0) {
            dispatch(dispatchDefaultCar({ carState: -1 }));
          } else {
            dispatch(fetchData({
              body: {
                carId: data.list[0].id,
                companyId: body.carrierId
              },
              method: 'GET',
              failToast: false,
              api: TRAVEL_ONOFCAR,
              success: (response) => {
                dispatch(dispatchDravelList(response));
              }
            }));
            dispatch(dispatchDefaultCar({ id: data.list[0].id, carState: data.list[0].carState, carNo: data.list[0].carNo }));
          }
          dispatch(appendLogToFile('我的行程','获取车辆列表',startTime))
        }
      }));
    },
    getTravel: (body) => {
      startTime = new Date().getTime()
      dispatch(fetchData({
        body,
        method: 'GET',
        failToast: false,
        api: TRAVEL_ONOFCAR,
        success: (data) => {
          dispatch(dispatchDravelList(data));
          dispatch(appendLogToFile('我的行程','获取行程',startTime))
        },
        fail: () => {
          dispatch(travelInfoDone())
        }
      }));
    },
    _confirmShipment: (body, params) => {
      startTime = new Date().getTime()
      dispatch(fetchData({
        body,
        method: 'POST',
        successToast: true,
        msg: '装货成功',
        showLoading: true,
        api: CONFIRM_INSTALL,
        success: (data) => {
          dispatch(refreshTravel());
          dispatch(appendLogToFile('我的行程','装货成功',startTime))
        }
      }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
