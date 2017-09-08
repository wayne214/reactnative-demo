'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Image,
	Dimensions,
	StyleSheet,
	Alert,
	ScrollView
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import DetailTop from '../../components/common/detailTop.js'
import GoodsInfo from '../../components/common/goodsInfo'
import * as ENUM from '../../constants/enum.js'
import * as RouteType from '../../constants/routeType'
import * as API from '../../constants/api'
import {fetchData} from '../../action/app'
import {receiveEntrustOrderDetail,deleteUndispatchAndCancelledOrder} from '../../action/entrust'

import HelperUtil from '../../utils/helper'
import Toast from '../../utils/toast.js';
import CountDown from '../../components/common/countDown.js'
import moment from 'moment'

const { height,width } = Dimensions.get('window')

class EntrustOrderDetail extends Component {
	constructor(props) {
	  super(props);
	  this._detailRefresh = this._detailRefresh.bind(this)
	  const {params} = props.navigation.state
	  this.state = {
	  	params,
	  	enable: true,
	  	disableButton: false
	  }
	  console.log("------ 委托详情 Data",params);
	}
	componentDidMount() {
		this._detailRefresh()
	}
	componentWillUnmount(){
		const {params} = this.state
		if (params.refreshCallBack) {
			params.refreshCallBack()
		};
	}
	_detailRefresh(){
		const {user} = this.props
		const {params} = this.state
		this.props._getEntrustOrderDetail({
			detailType: params.activeTab,//  详情类型  1派单，  2竞价，3抢单
			companyId: user.userId,
			goodsId: params.resourceId
		})
	}
	componentWillUnmount() {
		this.props._clearEntrustOrderDetail()
	}
	render() {
		const {params,enable,disableButton} = this.state
		const {user,entrustOrderDetail} = this.props
		const expireTime = (entrustOrderDetail && entrustOrderDetail.expireTime) ? entrustOrderDetail.expireTime : '2017-08-25 00:00:00'
		return <View style={styles.container}>
			{/*<NavigatorBar router={this.props.router} title={ '委托详情' } backViewClick={()=>{
							if (params.refreshCallBack) {
								params.refreshCallBack()
							};
							this.props.router.pop()
						}}/>*/}
			{
				entrustOrderDetail ?
					<ScrollView style={styles.scrollView}>

						<DetailTop configData={{
							type:ENUM.DETAIL_TYPE.ENTRUST,
							priceValue: entrustOrderDetail.freight,
							orderId: entrustOrderDetail.resourceId,
							goodsTypeStr: entrustOrderDetail.goodsTypeStr,
							orderStatus: enable ? params.orderStateStr : ''
						}}/>
						{
							params.entrustOrderStatus == 1 ?
								<View style={{height: 30,flexDirection: 'row',backgroundColor: 'white',alignItems: 'center',justifyContent:'flex-end',paddingRight: 10}}>
									<Text>剩余时间：</Text>
									<CountDown overTime={expireTime} timeItemStyle={{backgroundColor: COLOR.TEXT_BLACK}} endCounttingCallBack={()=>{
										this.setState({disableButton: true})
									}}/>
								</View>
							: null
						}

						<GoodsInfo configData={entrustOrderDetail.goodsInfoData} shipperPhone={entrustOrderDetail.entrustType === 2 ? entrustOrderDetail.shipperPhone : ''}/>

						{
							params.entrustOrderStatus == 1 ?
								enable ?
									<View style={[styles.bottomButtonView,{flexDirection: 'column',height: 50}]}>
										<View>
											<Button
												isDisabled={disableButton || moment().isAfter(expireTime)}
												disabledStyle={{backgroundColor: COLOR.BUTTN_DISABLE}}
												activeOpacity={0.8} style={styles.button}
												textStyle={{fontSize: 14,color: 'white'}}
												onPress={()=>{
													console.log("------委托详情中 接受派单,",entrustOrderDetail);
													this.props._acceptDesignate({
														goodsId: entrustOrderDetail.resourceId,
														companyId: user.userId,
														companyName: user.companyName,
														companyPhone: user.phoneNumber
													},()=>{
														Toast.show('温馨提示： \n接受派单成功，等待车辆调度！')
														this.setState({enable: false})
														this.props.navigation.dispatch({
															type: RouteType.ROUTE_DISPATCH_CAR,
															params: {goodsId: entrustOrderDetail.resourceId}
														})
													},()=>{
														if (params.refreshCallBack) {params.refreshCallBack()};
														this.setState({enable: false})//已被别的承运商接单 或者 已过期
													})
												}}>
											  接受派单
											</Button>
										</View>
									</View>
								: null
							:
								<View style={styles.bottomButtonView}>
									<Button activeOpacity={0.8} style={styles.button}
										textStyle={{fontSize: 14,color: 'white'}}
										onPress={()=>{
											console.log("------ 调度车辆");
											if (entrustOrderDetail.resourceStatus == 1) {
												this.props._getResourceState({goodsId: entrustOrderDetail.resourceId},(resourceState)=>{
													this.props.navigation.dispatch({
														type: RouteType.ROUTE_DISPATCH_CAR,
														params: {goodsId: entrustOrderDetail.resourceId}
													})
												})
											}else{
												Alert.alert('提示','确定要删除么',
													[{text: '删除', onPress: ()=>{
														this.props._deleteOrderUndispatch(entrustOrderDetail.resourceId,()=>{
															this.props.navigation.dispatch({type: 'pop'})
														})
													}},
													{text: '取消', onPress: ()=>{}, style: 'cancel' }]
												)
											}
										}}>
									  {entrustOrderDetail.resourceStatus == 1 ? '调度车辆' : '删除'}
									</Button>
								</View>
						}
					</ScrollView>
				: null
			}

		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	bottomButtonView:{
		flexDirection: 'row',
		height: 50,
		marginTop: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	scrollView:{
		backgroundColor: COLOR.APP_CONTENT_BACKBG,
	},
	button:{
		backgroundColor: COLOR.APP_THEME,
		borderWidth: 0,
		borderRadius: 2,
		width:width-80,
		height: 44
	}
})

const mapStateToProps = (state) => {
	const {app,entrust} = state
	return {
		user: app.get('user'),
		entrustOrderDetail: entrust.get('entrustOrderDetail')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		_getEntrustOrderDetail: (params)=>{
			dispatch(fetchData({
				api: params.detailType == 0 ? API.ENTRUST_ORDER_DETAIL : API.CONFIRM_TRANSPORT_DETAIL,
				method: 'GET',
				showLoading: true,
				body: params,
				success: (data)=>{
					console.log("---------- 获取到委托单详情",data);
					dispatch(receiveEntrustOrderDetail(data))
				}
			}))
		},
		_clearEntrustOrderDetail: ()=>{
			dispatch(receiveEntrustOrderDetail())
		},
		_acceptDesignate: (params,successCallBack,setButtonDisable)=>{
			console.log(" ------ 接受派单 successCallBack",successCallBack);
			dispatch(fetchData({
				api: API.ACCEPT_DISPATCH,
				method: 'POST',
				body: params,
				showLoading: true,
				success: (data)=>{
					console.log("  --- 接受派单成功 --- ",data);
					if(successCallBack){successCallBack()}
				},
				fail: (data)=>{
					console.log(" ===== 接受派单 失败",data);
					// if (data.data && (data.data.state == 3 || data.data.state == 3)) {
					// 	if (setButtonDisable) {setButtonDisable()};
					// }
					if (data.code == '0002') {
						if (setButtonDisable) {setButtonDisable()};
					};
				}
			}))
		},
		_deleteOrderUndispatch: (goodsId,successCallBack,failCallBack)=>{
			dispatch(fetchData({
				api: API.DELETE_ORDER_UNDISPATCH,
				method: 'POST',
				showLoading: true,
				body: {goodsId},
				success: (data)=>{
					// console.log("  --- 删除待调度且已取消的订单成功 --- ",data);
					successCallBack && successCallBack(data)
					dispatch(deleteUndispatchAndCancelledOrder(goodsId))
				},
				fail: (data)=>{
					// console.log("-------- 删除失败 ",data);
					failCallBack && failCallBack(data)
				}
			}))
		},
		_getResourceState: (params,successCallBack,failCallBack)=>{
			// console.log("校验委托是否正常（1正常 2货源以关闭  3货源以取消  4货源以删除）");
			dispatch(fetchData({
				api: API.ORDER_RESOURCE_STATE,
				method: 'GET',
				showLoading: true,
				body: params,
				success: (data)=>{
						// 1正常 2货源以关闭  3货源以取消  4货源以删除
						// console.log("----- data",data);
					if (data == 1) {
						successCallBack && successCallBack(data)
					}else if (data == 2) {
						Toast.show('货源已关闭')
					}else if (data == 3) {
						Toast.show('货源已取消')
					}else if (data == 4) {
						Toast.show('货源已删除')
					}
				},
				fail: (data)=>{
					failCallBack && failCallBack(data)
				}
			}))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EntrustOrderDetail);

// <Button activeOpacity={0.8} style={{backgroundColor: COLOR.APP_THEME,borderWidth: 0,borderRadius: 2,width:130,height: 44,marginRight: 30}}
// 	textStyle={{fontSize: 14,color: 'white'}}
// 	onPress={()=>{
// 		console.log("------ 拒绝派单",data);
// 		this.props.router.push(RouteType.ROUTE_REFUSE_DESIGNATE)
// 	}}>
//   拒绝派单
// </Button>
