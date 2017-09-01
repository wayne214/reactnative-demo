import React from 'react';
import {
  View,
  Alert,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
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
import { fetchData, refreshTravel } from '../../action/app';
import { dispatchDravelList, dispatchDefaultCar } from '../../action/travel';
import Helper from '../../utils/helper';
import { changeTab } from '../../action/app';

class HomeContainer extends BaseComponent {

  constructor(props) {
    super(props);
    this.title = '行程';
    this.state = {};
    this._addCar = this._addCar.bind(this);
    this.confirmShipments = this.confirmShipments.bind(this);
  }

  static propTypes = {
    router: React.PropTypes.object,
    click: React.PropTypes.func,
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
    this.props.router.push(RouteType.ROUTE_ADD_CAR)
  }

  render() {
    const { user, travelDetail, carPayLoad } = this.props;

    return (
      <View style={ styles.container }>
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
                      <Image style={ styles.topContainer } source={ CarStatusBg }>
                        <View style={ styles.rightContent }>
                          <Text style={ styles.carStatusText }>{ '休息中' }</Text>
                          <Image style={ styles.carNoBgStyle } source={ CarNoBg }>
                            <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                          </Image>
                        </View>
                      </Image>
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
                        <Image style={ styles.topContainer } source={ CarStatusBg }>
                          <View style={ styles.rightContent }>
                            <Text style={ styles.carStatusText }>{ Helper.getOrderStateStr(travelDetail.orderState, travelDetail.entrustType) }</Text>
                            <Image style={ styles.carNoBgStyle } source={ CarNoBg }>
                              <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                            </Image>
                          </View>
                        </Image>
                        <Route confirmShipment={ this.confirmShipments } { ...this.props } />
                      </ScrollView>
                    );
                  } else {
                    // 该车辆在AB两家同时被添加，但在A公司状态为运输中，B公司应该显示为在其他承运商公司运输中
                    return (
                      <View style={{ flex: 1 }}>
                        <Image style={ styles.topContainer } source={ CarStatusBg }>
                          <View style={ styles.rightContent }>
                            <Text style={ styles.carStatusText }>运输中</Text>
                            <Image style={ styles.carNoBgStyle } source={ CarNoBg }>
                              <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                            </Image>
                          </View>
                        </Image>
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
                      <Image style={ styles.topContainer } source={ CarStatusBg }>
                        <View style={ styles.rightContent }>
                          <Text style={ styles.carStatusText }>{ Helper.getOrderStateStr(travelDetail.orderState) }</Text>
                          <Image style={ styles.carNoBgStyle } source={ CarNoBg }>
                            <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                          </Image>
                        </View>
                      </Image>
                      <Route confirmShipment={ this.confirmShipments } { ...this.props } />
                    </ScrollView>
                  );
                } else {
                  return (
                    <View style={{ flex: 1 }}>
                      <Image style={ styles.topContainer } source={ CarStatusBg }>
                        <View style={ styles.rightContent }>
                          <Text style={ styles.carStatusText }>运输中</Text>
                          <Image style={ styles.carNoBgStyle } source={ CarNoBg }>
                            <Text style={ styles.carNo }>{ travelDetail.carNo }</Text>
                          </Image>
                        </View>
                      </Image>
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
  const { app, travel } = state;
  return {
    user: app.get('user'),
    loading: app.get('loading'),
    loadingPage: app.get('loadingPage'),
    travelDetail: travel.get('travelDetail'),
    carPayLoad: travel.get('carPayLoad'),
    payload: travel.get('payload'),
    isNeedRefreshTravel: travel.get('isNeedRefreshTravel')
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    getCarList: (body) => {
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
        }
      }));
    },
    getTravel: (body) => {
      dispatch(fetchData({
        body,
        method: 'GET',
        failToast: false,
        api: TRAVEL_ONOFCAR,
        success: (data) => {
          dispatch(dispatchDravelList(data));
        }
      }));
    },
    _confirmShipment: (body, params) => {
      dispatch(fetchData({
        body,
        method: 'POST',
        successToast: true,
        msg: '装货成功',
        showLoading: true,
        api: CONFIRM_INSTALL,
        success: (data) => {
          dispatch(refreshTravel());
        }
      }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
