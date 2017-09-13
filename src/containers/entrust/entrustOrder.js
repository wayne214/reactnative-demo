'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	ListView,
	Image,
	Dimensions
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import OrderCell from '../../components/order/orderCell'
import Toast from '../../utils/toast.js'
import emptyList from '../../../assets/img/order/empty_order_list.png'
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import * as API from '../../constants/api'
import {fetchData,entrustListShouldRefresh} from '../../action/app'
import {getEntrustOrderList,changeEntrustOrderListLoadingMore,acceptDesignateWithID,deleteUndispatchAndCancelledOrder,removeOverTimeOrderFromList} from '../../action/entrust'
import LoadMoreFooter from '../../components/common/loadMoreFooter'
import driver_limit from '../../../assets/img/app/driver_limit.png'
import BaseComponent from '../../components/common/baseComponent.js'

const { height,width } = Dimensions.get('window')

class EntrustOrderListItem extends Component {
	constructor(props) {
	  super(props);
	}
	_renderRow(rowData,SectionId,rowID){
		// 我的承运中 有2种操作按钮（待确认：“接受派单”  待调度：“调度车辆”）
		const {itemClick,dispatchCar,acceptDesignate} = this.props

		return <OrderCell
			{...this.props}
			itemClick={(data)=>{
				if(itemClick){itemClick(data)}
			}}
			dispatchCar={(data)=>{
				if(dispatchCar){dispatchCar(data)}
			}}
			acceptDesignate={(data)=>{
				if(acceptDesignate){acceptDesignate(data)}
			}}
			rowData={rowData}
			rowID={ rowID }/>
	}
	_renderFooter(){
		const { dataSource } = this.props;
		if (dataSource.get('list').size > 1) {
			if (dataSource.get('hasMore')) {
				return <LoadMoreFooter />
			}else{
				return <LoadMoreFooter isLoadAll={true}/>
			}
		};
	}
	_toEnd(){
		const {loadMoreAction, dataSource} = this.props
		if (loadMoreAction) {
			if (dataSource.get('isLoadingMore')){
				console.log("------ 正在加载中");
				return;
			}else if(dataSource.get('list').size >= dataSource.get('total')) {
				console.log("------ 已加载全部");
				return;
			}
			loadMoreAction()
		};
	}
	render(){
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		const {dataSource} = this.props
		if (dataSource.get('list').toJS().length > 0 || dataSource.get('isLoadingMore')) {
			return (
				<ListView
					style={{flex:1}}
					dataSource={ ds.cloneWithRows(dataSource.get('list').toJS() || []) }
					renderRow={this._renderRow.bind(this)}
					onEndReachedThreshold={10}
					enableEmptySections={true}
					onEndReached={ this._toEnd.bind(this) }
					renderFooter={ this._renderFooter.bind(this) }/>
			)
		}else{
			return <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
				<Image source={emptyList}/>
			</View>
		}

	}
}


class EntrustOrderList extends BaseComponent {
	constructor(props) {
	  super(props);
	  this.state = {
	  	activeTab: 0
	  }
	}
	componentDidMount() {
		super.componentDidMount()
		const {user,_getEntrustOrderList} = this.props
		_getEntrustOrderList({
			pageNo: 1,
			companyId: user.userId,
			state: 1
		},true)
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.shouldEntrustOrderListRefresh && !nextProps.entrustOrderUnconfirmed.get('isLoadingMore') && !nextProps.entrustOrderUndispatch.get('isLoadingMore')) {
			const {activeTab} = this.state
			if (activeTab == 0) {
				this.props._getEntrustOrderList({
					pageNo: 1,
					companyId: nextProps.user.userId,
					state: 1
				})
			}else if (activeTab == 1) {
				this.props._getEntrustOrderUndispatch({
					pageNo: 1,
					companyId: nextProps.user.userId,
				})
			}
		}
	}
	render() {
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		const {
			user,
			entrustOrderUnconfirmed,
			entrustOrderUndispatch
		} = this.props
		if (user.currentUserRole == 1) {
			return (
				<View style={styles.container}>
					<NavigatorBar title='我的承运' hiddenBackIcon={ true }/>
					<ScrollableTabView
						style={{backgroundColor: COLOR.APP_CONTENT_BACKBG}}
						renderTabBar={() =>
							<DefaultTabBar style={{height: 40,borderWidth:1,borderBottomColor: '#e6eaf2', backgroundColor: 'white'}}
								tabStyle={{paddingBottom: 2}}/>
						}
						onChangeTab={(obj)=>{
							if (obj.i == obj.from) {
								return
							};
							this.setState({activeTab: obj.i})
							if (obj.i == 0) {
								this.props._getEntrustOrderList({
									pageNo: 1,
									companyId: user.userId,
									state: 1
								},true)
							}else if (obj.i == 1) {
								this.props._getEntrustOrderUndispatch({
									pageNo: 1,
									companyId: user.userId,
								},true)
							}
						}}
						tabBarUnderlineStyle={{backgroundColor: COLOR.APP_THEME,height: 2,width: 44,marginLeft:(width*0.5-44)*0.5 }}
						tabBarActiveTextColor={COLOR.APP_THEME}
						tabBarInactiveTextColor={COLOR.TEXT_NORMAL}
						tabBarTextStyle={{fontSize:15}}>
						<EntrustOrderListItem
							tabLabel={'待确认'}
							dataSource={entrustOrderUnconfirmed}
							itemClick={(data)=>{
								this.props._getResourceState({goodsId: data.resourceId},(resourceState)=>{
									data.activeTab = this.state.activeTab
									data.refreshCallBack = ()=>{
										this.props._getEntrustOrderList({
											pageNo: 1,
											companyId: user.userId,
											state: 1
										})
									}
                  this.props.navigation.dispatch({
                    type: RouteType.ROUTE_ENTRUST_ORDER_DETAIL,
                    params: {...data, title: '委托详情'}
                  })
								})
							}}
							acceptDesignate={(data)=>{
								console.log("------ 接受派单 -- data",data);
								this.props._acceptDesignate({
									goodsId: data.resourceId,
									companyId: user.userId,
									companyName: user.companyName,
									companyPhone: user.phoneNumber
								},()=>{
									Toast.show('温馨提示： \n接受派单成功，等待车辆调度！')
									this.props.router.push(RouteType.ROUTE_DISPATCH_CAR,{goodsId: data.resourceId})
								},()=>{
									// refreshCallBack
									this.props._getEntrustOrderList({
										pageNo: 1,
										companyId: user.userId,
										state: 1
									})
								})
							}}
							removeOverTimeOrder={(resourceId)=>{
								this.props._removeOverTimeOrder(resourceId)
							}}
							loadMoreAction={()=>{
								this.props._getEntrustOrderList({
									pageNo: parseInt(entrustOrderUnconfirmed.get('pageNo')) + 1,
									companyId: user.userId,
									state: 1
								})
							}}/>

						<EntrustOrderListItem
							tabLabel={'待调度'}
							dataSource={entrustOrderUndispatch}
							itemClick={(data)=>{
								data.activeTab = this.state.activeTab
								data.title = '委托详情'
								if (data.resourceStatus == 1) {
									this.props._getResourceState({goodsId: data.resourceId},(resourceState)=>{
										// this.props.router.push(RouteType.ROUTE_ENTRUST_ORDER_DETAIL,data)
                    this.props.navigation.dispatch({
                      type: RouteType.ROUTE_ENTRUST_ORDER_DETAIL,
                      params: data
                    })
									})
								}else{
									// this.props.router.push(RouteType.ROUTE_ENTRUST_ORDER_DETAIL,data)
                  this.props.navigation.dispatch({
                    type: RouteType.ROUTE_ENTRUST_ORDER_DETAIL,
                    params: data
                  })
								}
							}}
							dispatchCar={(data)=>{
								this.props._getResourceState({goodsId: data.resourceId},(resourceState)=>{
                  this.props.navigation.dispatch({
                    type: RouteType.ROUTE_DISPATCH_CAR,
                    params: {goodsId: data.resourceId, title: '调度车辆'}
                  })
									// this.props.router.push(RouteType.ROUTE_DISPATCH_CAR,)
								})
							}}
							deleteOrderUndispatch={(goodsId)=>{
								console.log(" ======= delete cilck ");
								this.props._deleteOrderUndispatch(goodsId)
							}}
							loadMoreAction={()=>{
								this.props._getEntrustOrderUndispatch({
									pageNo: parseInt(entrustOrderUndispatch.get('pageNo')) + 1,
									companyId: user.userId,
								})
							}}/>

					</ScrollableTabView>
				</View>
			)
		}else{
			return (
				<View style={styles.container}>
					<NavigatorBar
						hiddenBackIcon={true}
						title={ '我的承运' }/>
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
	const {entrust,app} = state;
	return {
		shouldEntrustOrderListRefresh: app.get('shouldEntrustOrderListRefresh'),
		user: app.get('user'),
		entrustOrderUnconfirmed: entrust.get('entrustOrderUnconfirmed'),
		entrustOrderUndispatch: entrust.get('entrustOrderUndispatch')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		_getEntrustOrderList: (params, showLoading)=> {
			dispatch(changeEntrustOrderListLoadingMore(0))
			dispatch(fetchData({
				api: API.ENTRUST_ORDER_UNCONFIRMED,
				method: 'GET',
				body: params,
				showLoading,
				success: (data)=>{
					dispatch(entrustListShouldRefresh(false))
					data.entrustOrderType = 0
					data.pageNo = params.pageNo
					dispatch(getEntrustOrderList(data))
				}
			}))
		},
		_getEntrustOrderUndispatch: (params,showLoading)=>{
			dispatch(changeEntrustOrderListLoadingMore(1))
			dispatch(fetchData({
				api: API.ENTRUST_ORDER_UNDISPATCH,
				method: 'GET',
				body: params,
				showLoading,
				success: (data)=>{
					dispatch(entrustListShouldRefresh(false))
					data.entrustOrderType = 1
					data.pageNo = params.pageNo
					dispatch(getEntrustOrderList(data))
				}
			}))
		},
		_acceptDesignate: (params,successCallBack,refreshCallBack)=>{
			console.log(" ------ 接受派单 successCallBack",successCallBack);
			dispatch(fetchData({
				api: API.ACCEPT_DISPATCH,
				method: 'POST',
				body: params,
				success: (data)=>{
					console.log("  --- 接受派单成功 --- ",data);
					if(successCallBack){successCallBack()}
					dispatch(acceptDesignateWithID(params.goodsId))
				},
				fail: (data)=>{
					console.log("-------- fail",data);
					if (data.code == '0002') {//可能是已被其他承运商接单
						if (refreshCallBack) {refreshCallBack()};
					};
					// if (data.data && (data.data.state == 3 || data.data.state == 3)) {
					// 	if (refreshCallBack) {refreshCallBack()};
					// }
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
					console.log("  --- 删除待调度且已取消的订单成功 --- ",data);
					successCallBack && successCallBack(data)
					dispatch(deleteUndispatchAndCancelledOrder(goodsId))
				},
				fail: (data)=>{
					console.log("-------- 删除失败 ",data);
					failCallBack && failCallBack(data)
				}
			}))
		},
		_getResourceState: (params,successCallBack,failCallBack)=>{
			console.log("校验委托是否正常（1正常 2货源以关闭  3货源以取消  4货源以删除）");
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
				},
				fail: (data)=>{
					failCallBack && failCallBack(data)
				}
			}))
		},
		_removeOverTimeOrder: (resourceId) => {
			dispatch(removeOverTimeOrderFromList(resourceId))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EntrustOrderList);

