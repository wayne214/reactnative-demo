'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	InteractionManager
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view'
import BiddingListComponent from '../../components/routes/biddingList'
import * as RouteType from '../../constants/routeType'
import * as API from '../../constants/api'
import {fetchData, appendLogToFile} from '../../action/app'
import {receivePreOrderList} from '../../action/preOrder'
import BaseComponent from '../../components/common/baseComponent.js'
import Toast from '../../utils/toast.js'

const { height,width } = Dimensions.get('window')
let startTime = 0

class BiddingList extends BaseComponent {
	constructor(props) {
	  super(props);
	  // const params = this.props.router.getCurrentRoute().params
	  // this.state = {
	  // 	isBetter: params.isBetter,
	  // 	activeTab: 0
	  // }
	  const {params} = this.props.navigation.state
	  this.state = {
	  	isBetter: params.isBetter,
	  	activeTab: params.tabIndex || 0
	  }
	}
	static navigationOptions = ({navigation, screenProps}) => {
		return {
			header: <NavigatorBar router={navigation}/>
		}
	}
		// headerTitle: navigation.state.isBetter ? '我的竞价' : '我的抢单',
	componentDidMount() {
		super.componentDidMount()
		const {user} = this.props
		const {isBetter} = this.state
		this.props._getBiddingList({
			companyId: user.userId,
			state: 1,
			type: isBetter ? 1 : 2,
			pageNo: 1
		})
	}
	render() {
		const {params} = this.props.navigation.state
		// console.log(" ------- params",params);
		const {user, ordering, orderSuccess, orderFailed, bidding, biddingSuccess, biddingFailed} = this.props
		const {isBetter,activeTab} = this.state
		return <View style={styles.container}>
			{/**/}
			<ScrollableTabView
				style={{backgroundColor: COLOR.APP_CONTENT_BACKBG}}
				renderTabBar={() => <DefaultTabBar style={{height: 50,borderWidth:1,borderBottomColor: '#e6eaf2', backgroundColor: 'white'}} tabStyle={{paddingBottom: 2}}/>}
				tabBarUnderlineStyle={{backgroundColor: COLOR.APP_THEME,height: 2,width: 55,marginLeft:(width*0.33-55)*0.5 }}
				tabBarActiveTextColor={COLOR.APP_THEME}
				tabBarInactiveTextColor={COLOR.TEXT_NORMAL}
				tabBarTextStyle={{fontSize:15}}
				page={this.state.activeTab}
				onChangeTab={(obj)=>{
					// console.log("------ obj",obj);
					if (obj.from == obj.i) {return}
					this.setState({
						activeTab: parseInt(obj.i)
					})
					// console.log("====== Date.now(1)",Date.now());
					InteractionManager.runAfterInteractions(()=>{
						// console.log("====== Date.now(2)",Date.now());
						this.props._getBiddingList({
							companyId: user.userId,
							state: parseInt(obj.i) + 1,
							type: isBetter ? 1 : 2,
							pageNo: 1
						})
					})
				}}>

				<BiddingListComponent
					isBetter={isBetter}
					tabLabel={ isBetter ? "竞价中" : "抢单中" }
					dataSource={isBetter ? bidding : ordering}
					loadMoreAction={()=>{
						this.props._getBiddingList({
							companyId: user.userId,
							state: activeTab + 1,
							type: isBetter ? 1 : 2,
							pageNo: parseInt(isBetter ? bidding.get('pageNo') : ordering.get('pageNo')) + 1,
						})
					}}/>
        <BiddingListComponent
	        isBetter={isBetter}
        	tabLabel={ isBetter ? "竞价成功" : "抢单成功" }
        	dispatchCar={(data)=>{
        		if (!data.resourceId) {
        			console.warn('需要非空的 goodsId');
        		};
        		this.props._getResourceState({goodsId: data.resourceId},(resourceState)=>{
        			this.props.navigation.dispatch({
        				type: RouteType.ROUTE_DISPATCH_CAR,
        				params: {goodsId: data.resourceId}
        			})
        		})
        	}}
        	dataSource={isBetter ? biddingSuccess : orderSuccess}
        	loadMoreAction={()=>{
        		this.props._getBiddingList({
        			companyId: user.userId,
        			state: activeTab + 1,
        			type: isBetter ? 1 : 2,
        			pageNo: parseInt(isBetter ? biddingSuccess.get('pageNo') : orderSuccess.get('pageNo')) + 1,
        		})
        	}}/>
				<BiddingListComponent
					isBetter={isBetter}
					tabLabel={ isBetter ? "竞价失败" : "抢单失败" }
					dataSource={isBetter ? biddingFailed : orderFailed}
					loadMoreAction={()=>{
						this.props._getBiddingList({
							companyId: user.userId,
							state: activeTab + 1,
							type: isBetter ? 1 : 2,
							pageNo: parseInt(isBetter ? biddingFailed.get('pageNo') : orderFailed.get('pageNo')) + 1,
						})
					}}/>
			</ScrollableTabView>
			{this.props.loading ? this._renderLoadingView() : null}
		</View>
	}
}

// topComponent={()=>{
// 	if (isBetter) {
// 		return (
// 			<View style={styles.topInfoView}>
// 				<Text style={{fontSize: 14,color: COLOR.TEXT_NORMAL,lineHeight: 17}}>
// 					竞价成功后请在
// 					<Text style={{color: COLOR.TEXT_MONEY}}>24小时</Text>
// 					内确认运输，
// 					<Text style={{color: COLOR.TEXT_MONEY}}>逾期</Text>
// 					将视为放弃运输订单，这样会
// 					<Text style={{color: COLOR.TEXT_MONEY}}>影响您在平台的信用</Text>
// 					评分，同时7日内不可再次参与竞价
// 				</Text>
// 			</View>
// 		)
// 	}else{
// 		return (
// 			<View style={styles.topInfoView}>
// 				<Text style={{fontSize: 14,color: COLOR.TEXT_NORMAL,lineHeight: 17}}>抢单成功后请尽快调度车辆确认运输，
// 					<Text style={{color: COLOR.TEXT_MONEY}}>逾期</Text>
// 					将视为放弃运输订单，这样会
// 					<Text style={{color: COLOR.TEXT_MONEY}}>影响您在平台的信用</Text>
// 					评分，同时2日内不可再次参与抢单
// 				</Text>
// 			</View>
// 		)
// 	}

// }}


const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	topInfoView: {
		height: 77,
		paddingTop: 12,
		paddingLeft: 10,
		paddingRight: 10,
		// backgroundColor: 'orange'
	}
})

const mapStateToProps = (state) => {
	const {app,preOrder} = state
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		ordering: preOrder.get('ordering'),
		orderSuccess: preOrder.get('orderSuccess'),
		orderFailed: preOrder.get('orderFailed'),
		bidding: preOrder.get('bidding'),
		biddingSuccess: preOrder.get('biddingSuccess'),
		biddingFailed: preOrder.get('biddingFailed')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		_getBiddingList: (params)=>{
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.BIDDING_LIST,
				method: 'GET',
				body: params,
				success: (data)=>{
					data.type = params.type
					data.state = params.state
					data.pageNo = params.pageNo
					if (params.type == 1) {
						// console.log(" ----- 获取我的竞价 列表",data.list);
						dispatch(appendLogToFile('竞价列表','获取我的竞价列表',startTime))
					}else{
						// console.log(" ----- 获取我的抢单 列表",data.list);
						dispatch(appendLogToFile('抢单列表','获取我的抢单列表',startTime))
					}
					dispatch(receivePreOrderList(data))

				}
			}))
		},
		_getResourceState: (params,successCallBack,failCallBack)=>{
			// console.log("校验委托是否正常（1正常 2货源以关闭  3货源以取消  4货源以删除）");
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.ORDER_RESOURCE_STATE,
				method: 'GET',
				showLoading: true,
				body: params,
				success: (data)=>{
						// 1正常 2货源以关闭  3货源以取消  4货源以删除
						console.log("----- data",data);
					if (data == 1) {
						successCallBack && successCallBack(data)
					}else if (data == 2) {
						Toast.show('货源已关闭')
					}else if (data == 3) {
						Toast.show('货源已取消')
					}else if (data == 4) {
						Toast.show('货源已删除')
					}
					dispatch(appendLogToFile('竞价列表','校验货源状态是否正常',startTime))
				},
				fail: (data)=>{
					failCallBack && failCallBack(data)
				}
			}))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BiddingList);

