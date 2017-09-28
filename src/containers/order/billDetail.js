'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'
import * as RouteType from '../../constants/routeType'
// /orderApp/balanceDetail
import * as API from '../../constants/api'
import {fetchData} from '../../action/app'
import {receiveClearDetail} from '../../action/order'
import BaseComponent from '../../components/common/baseComponent.js'

class BillDetail extends BaseComponent {
	constructor(props) {
	  super(props);
	  const {orderNo} = this.props.navigation.state.params
	  this.state = {
	  	orderNo
	  }
	}
	componentDidMount() {
		super.componentDidMount()
		this.props._getClearDetail({orderNo: this.state.orderNo})
	}
	componentWillUnmount() {
		this.props._clearlearDetail()
	}
	static navigationOptions = ({navigation}) => {
		return {
			header: <NavigatorBar router={navigation} title={ '结算清单详情' }/>
		}
	}
	render() {
		const { clearDetail } = this.props
		return (
			<View style={styles.container}>
			{
				/**
				 * <TouchableOpacity activeOpacity={0.8} onPress={()=>{

									if (this.props.router.getLastCurrentRouteKey() == 'ORDER_DETAIL_PAGE') {
										this.props.router.pop()
									}else{
										this.props.router.push(RouteType.ROUTE_ORDER_DETAIL,{ orderNo: clearDetail.orderNo })
									}
								}}>
									<View style={{flexDirection: 'row'}}>
										<Text style={{color: COLOR.TEXT_BLACK}}>{clearDetail.orderNo}</Text>
										<Text style={{fontFamily: 'iconfont',color: COLOR.TEXT_LIGHT}}>&#xe60d;</Text>
									</View>
								</TouchableOpacity>
				 */
			}
				{
					clearDetail ?
						<ScrollView>
							<View style={styles.itemView}>
								<Text style={styles.itemName}>订单编号</Text>
								<Text style={{color: COLOR.TEXT_BLACK}}>{clearDetail.orderNo}</Text>
							</View>
							<View style={styles.itemView}>
								<Text style={styles.itemName}>运单编号</Text>
								<Text>{clearDetail.transportNo}</Text>
							</View>
							<View style={styles.itemView}>
								<Text style={styles.itemName}>订单状态</Text>
								<Text>{clearDetail.orderStateStr}</Text>
							</View>
							<View style={styles.itemView}>
								<Text style={styles.itemName}>应收金额</Text>
								<Text>{`¥${clearDetail.carrierDealPrice}`}</Text>
							</View>
							<View style={styles.itemView}>
								<Text style={styles.itemName}>实收金额</Text>
								<Text>{`¥${clearDetail.payablePrice}`}</Text>
							</View>
							<View style={styles.itemView}>
								<Text style={styles.itemName}>结算金额</Text>
								<Text>{`¥${clearDetail.companyActualPrice}`}</Text>
							</View>
							{
								clearDetail.priceInstruction ?
									<View style={styles.itemView}>
										<Text style={styles.itemName}>差额说明</Text>
										<Text>{clearDetail.priceInstruction}</Text>
									</View>
								: null
							}
							{
								clearDetail.companyApplyTime ?
									<View style={styles.itemView}>
										<Text style={styles.itemName}>申请时间</Text>
										<Text>{clearDetail.companyApplyTime}</Text>
									</View>
								: null
							}
							<View style={styles.itemView}>
								<Text style={styles.itemName}>结算时间</Text>
								<Text>{clearDetail.companyPaymentTime}</Text>
							</View>
							<View style={styles.itemView}>
								<Text style={styles.itemName}>结算方式</Text>
								<Text>{clearDetail.paymentTypeStr}</Text>
							</View>
						</ScrollView>
					: null
				}

				{ this._renderUpgrade(this.props) }

			</View>
		)
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	itemView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 44,
		borderBottomWidth:1,
		borderBottomColor: COLOR.LINE_COLOR,
		backgroundColor: 'white',
		alignItems: 'center',
		padding: 10
	},
	itemName:{
		color: COLOR.TEXT_BLACK
	}
})

const mapStateToProps = (state) => {
	const {order, app } = state
	return {
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
		clearDetail: order.get('clearDetail')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		_getClearDetail: (params)=>{
			console.log("==== yougui");
			dispatch(fetchData({
				api: API.CLEAR_DETAIL,
				method: 'GET',
				body: params,
				success: (data)=>{
					console.log("====== 结算清单详情",data);
					dispatch(receiveClearDetail(data))
				}
			}))
		},
		_clearlearDetail: ()=>{
			dispatch(receiveClearDetail(null))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BillDetail);
