'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
  Platform,
		TouchableOpacity
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import FoldView from '../../components/common/foldView'
import GoodsInfo from '../../components/common/goodsInfo.js'
import DetailTop from '../../components/common/detailTop.js'
import * as ENUM from '../../constants/enum.js'
const { height,width } = Dimensions.get('window')
import * as API from '../../constants/api'
import {fetchData, appendLogToFile} from '../../action/app'
import {receiveOrderDetail,changeOrderToStateWithOrderNo} from '../../action/order'
import { dispatchBankCardList } from '../../action/bankCard';
import Button from 'apsl-react-native-button'
import Toast from '../../utils/toast.js';
import Coordination from '../../components/order/coordinatation'
import BaseComponent from '../../components/common/baseComponent'

import AddressItem from '../../components/routes/goodlistAddressItem';
let startTime = 0
import * as ConstValue from '../../constants/constValue';
import * as StaticColor from '../../constants/colors';
const topSpace = 10;
const topHeight = 40;
const bottomViewHeight = 58;
const screenHeight = Dimensions.get('window').height;

class orderDetailEntry extends BaseComponent {
	constructor(props) {
	  super(props);

	}
	componentDidMount() {
	}


	render() {
		const {orderDetailData} = this.props;
		console.log('---orderDetail', orderDetailData);

			const fromProvince = orderDetailData.fromProvince ? orderDetailData.fromProvince : '';
			const fromCity = orderDetailData.fromCity ? orderDetailData.fromCity : '';
      const fromDistrict = orderDetailData.fromDistrict ? orderDetailData.fromDistrict : '';
			const fromCustomerAddress = orderDetailData.fromCustomerAddress ? orderDetailData.fromCustomerAddress : '';


      const fromAddress = fromProvince + fromCity + fromDistrict + fromCustomerAddress;

      const toProvince = orderDetailData.toProvince ? orderDetailData.toProvince : '';
      const toCity = orderDetailData.toCity ? orderDetailData.toCity : '';
      const toDistrict = orderDetailData.toDistrict ? orderDetailData.toDistrict : '';
      const toCustomerAddress = orderDetailData.toCustomerAddress ? orderDetailData.toCustomerAddress : '';

      const endAddress = toProvince + toCity + toDistrict + toCustomerAddress;

      const goodInfo = orderDetailData.transportDetailDtoList && orderDetailData.transportDetailDtoList.map((item, index)=> {
      	console.log('--goodInfo', item);
      	return (<GoodsInfo configData={item}/>)

			});

      const loaddingTime = orderDetailData.loadingTime ? orderDetailData.loadingTime : '';

      const temperatureMin = orderDetailData.temperatureMin ? orderDetailData.temperatureMin : '';
      const temperatureMax = orderDetailData.temperatureMax ? orderDetailData.temperatureMax : '';

      let temperature;
      if (temperatureMax !== '' && temperatureMin != '') {
          temperature = temperatureMin + "℃-" + temperatureMax + '℃'
			} else {
          temperature = ''
			}

			let pointList = [];
			if (orderDetailData.loadingPoint) {
      	pointList = orderDetailData.loadingPoint.split(',');
			}

		return <View style={styles.container}>
					<ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false}>
						<View style={{backgroundColor: '#ffffff', height: 44, flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{fontSize: 14, color: '#999999', marginLeft: 15}}>{`订单编号：${orderDetailData.orderCode}`}</Text>
						</View>
						<View style={{width: 200, height: 1, backgroundColor: '#E6EAF2'}}/>
						<View style={{paddingHorizontal: 15, backgroundColor: '#ffffff'}}>
							<AddressItem startAddress={fromAddress} endAddress={endAddress}/>
						</View>

						<View style={{backgroundColor: '#ffffff', paddingTop: 15}}>
							<View style={styles.goodsDetailItem}>
								<Text style={styles.goodsDetailMark}>{'装  货  点：'}</Text>
								{/*<Text style={styles.goodsDetailContent}>{fromAddress}</Text>*/}
							</View>
								{
                    pointList.length > 0 ? pointList.map((item, index) => {
												return (
													<View style={styles.goodsDetailItem} key={index}>
														<Text style={styles.goodsDetailContent}>{item}</Text>
												</View>)
										}) : null
								}

							<View style={{backgroundColor: '#f0f2f5', height: 44, justifyContent: 'center', paddingLeft: 10}}>
								<Text>货品信息</Text>
							</View>
							{
                  goodInfo
							}

							<View style={styles.goodsDetailItem}>
								<Text style={styles.goodsDetailMark}>{'装货时间：'}</Text>
								<Text style={styles.goodsDetailContent}>{loaddingTime}</Text>
							</View>

								{
										orderDetailData.deliveryTime ?
											<View style={styles.goodsDetailItem}>
												<Text style={styles.goodsDetailMark}>送达时间：</Text>
												<Text style={styles.goodsDetailContent}>{orderDetailData.deliveryTime}</Text>
											</View>
												: null
								}
							<View style={styles.goodsDetailItem}>
								<Text style={styles.goodsDetailMark}>温度要求：</Text>
								<Text style={styles.goodsDetailContent}>{temperature}</Text>
							</View>
						</View>

						<FoldView title={'发货方信息'} openHeight={2 * 44} renderContent={()=>{
                return (
									<View>
										<View style={styles.flodItem}>
											<Text>发货方:</Text>
                        {
                            orderDetailData.orderSource == 1 ?//自营订单 发货方：冷链马甲
															<Text>冷链马甲</Text>
                                : <Text>{orderDetailData.fromCustomerName}</Text>
                        }
										</View>
										<View style={styles.flodItem}>
											<Text>联系电话:</Text>
											<Text>{orderDetailData.fromCustomerTle}</Text>
										</View>
									</View>
                )
            }}/>
						<FoldView title={'收货方信息'} openHeight={2 * 44} renderContent={()=>{
							return (
								<View>
									<View style={styles.flodItem}>
										<Text>收货方:</Text>
										<Text>{orderDetailData.toCustomerName}</Text>
									</View>
									<View style={styles.flodItem}>
										<Text>联系电话:</Text>
										<Text>{orderDetailData.toCustomerTle}</Text>
									</View>
								</View>
							)
						}}/>
						<View style={{backgroundColor: '#ffffff'}}>
							<View style={{backgroundColor: '#f0f2f5', height: 44, justifyContent: 'center',paddingHorizontal: 10}}>
								<Text>运输协议</Text>
							</View>

							<TouchableOpacity onPress={()=>
							{

								if (!orderDetailData.templateUrl || orderDetailData.templateUrl === '') {
									Toast.show('暂无协议模板')
										return;
								}
                  this.props.navigation.dispatch({
                      type: RouteType.ROUTE_CONTRACT_DETAIL,
                      params: {
                          templateUrl: orderDetailData.templateUrl,
                          title: '运输协议'
                      }
                  })
							}
							}>
								<View style={{flexDirection: 'row', height: 44, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
									<Text style={{color: '#0092FF', fontSize: 14}}>冷链马甲平台运输协议</Text>
									<Text style={{fontSize: 14, fontFamily: 'iconfont', color: '#000000'}}>&#xe63d;</Text>
								</View>
							</TouchableOpacity>
						</View>
							{
                  orderDetailData.businessType && orderDetailData.businessType == '501' ? null :  <FoldView title={'司机信息'} openHeight={3 * 44} renderContent={()=>{
                      return (
												<View>
													<View style={styles.flodItem}>
														<Text>司机:</Text>
														<Text>{orderDetailData.driver}</Text>
													</View>
													<View style={styles.flodItem}>
														<Text>司机电话:</Text>
														<Text>{orderDetailData.phone}</Text>
													</View>
													<View style={[styles.flodItem,{borderBottomWidth:0}]}>
														<Text>车牌号码:</Text>
														<Text>{orderDetailData.vehical}</Text>
													</View>
												</View>
                      )
                  }}/>
							}
					</ScrollView>
				{
            orderDetailData.businessType && orderDetailData.businessType == '501' ? null : <View>
							<TouchableOpacity
								onPress={() => {
                    if(!orderDetailData.orderCode) {
                        Toast.show('订单号为空');
                        return;
                    }
                    this.props.navigation.dispatch({
                        type: RouteType.ROUTE_LADING_BILL,
                        params: {
                            title: '出库单',
                            orderNoBase: orderDetailData.orderCode,
                            images: []
                        }
                    })
                }}
							>
								<View style={styles.button}>
									<Text style={styles.buttonText}>查看出库单</Text>
								</View>
							</TouchableOpacity>
						</View>
				}
		</View>
	}
}


class ButtonView extends Component {
	constructor(props){
		super(props)

	}
	render(){
		const {dataSource} = this.props
		const Buttons = dataSource.map((item,index)=>{
			return (
				<Button key={index} activeOpacity={0.8} style={{backgroundColor: COLOR.APP_THEME,borderWidth: 0,borderRadius: 2,height: 44,width: (width-20-(dataSource.length-1)*15)/dataSource.length}}
					isDisabled={item.isDisabled}
					disabledStyle={{backgroundColor: COLOR.BUTTN_DISABLE}}
					textStyle={{fontSize: 14,color: 'white'}}
					onPress={()=>{
						if(item.callBack){item.callBack()}
					}}>
				  {item.title}
				</Button>
			)
		})
		return (
			<View style={{flex: 1,flexDirection: 'row',paddingLeft: 10,paddingRight: 10,paddingTop: 20,justifyContent: 'space-between'}}>
				{ Buttons }
			</View>
		)
	}
}

const styles =StyleSheet.create({
	container: {
		backgroundColor: COLOR.APP_CONTENT_BACKBG,
		width: width,
    overflow: 'hidden',
		alignItems: 'center',
      ...Platform.select({
          ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height - bottomViewHeight},
          android:{height: screenHeight - topHeight - 73 - bottomViewHeight}
      }),
	},
	scrollView:{
		backgroundColor: COLOR.APP_CONTENT_BACKBG,
		width: width - 30,
		borderColor: 'rgba(0,0,0,0.08)',
		borderRadius: 5,
		borderWidth: 1,
	},
	headerView: {
		flex: 1,
	},
	headerViewBottom:{
		flex:1,
		flexDirection: 'row',
		height: 44,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: COLOR.LINE_COLOR
	},
	routeType:{
		flex: 1,
		backgroundColor: '#fff3dd',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		borderBottomLeftRadius: 2,
		borderBottomRightRadius: 2,
		right: 10,
		width: 48,
		height: 21,
	},
	routeTypeText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: COLOR.TEXT_MONEY,
	},
	tips: {
		padding: 10,
		borderStyle: 'dashed',
		borderWidth: 1,
		borderColor: '#FFA200',
		backgroundColor: '#fff8ec'
	},
	tipsContent: {
		color: '#FFA200',
		fontSize: 13,
		lineHeight: 16
	},
	flodItem: {
		height: 44,
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
	},
	buttonView: {
		flex: 1,
		flexDirection: 'row',
		height: 49,
		justifyContent: 'space-around',
		alignItems: 'center',
		// marginRight: 10

	},
    goodsDetailItem: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center',
        marginBottom: 5,
				backgroundColor: '#ffffff',
				paddingHorizontal: 15,
    },
    goodsDetailMark: {
        marginRight: 5,
        fontSize: 14,
        color: COLOR.TEXT_LIGHT
    },
    goodsDetailContent: {
        flex:1,
        color: COLOR.TEXT_BLACK,
        fontSize: 14
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: 44,
        backgroundColor: StaticColor.BLUE_BUTTON_COLOR,
        alignSelf: 'center',
        borderRadius: 5
    },
    buttonText: {
        fontSize: 17,
        color: StaticColor.WHITE_COLOR,
    },
})

const mapStateToProps = (state) => {
	const {order, app, nav} = state
	return {
		nav,
		user: app.get('user'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
		orderDetail: order.get('orderDetail'),
    plateNumber: state.user.get('plateNumber'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(orderDetailEntry);
