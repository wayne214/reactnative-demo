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
import Toast from '../../utils/toast.js'
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import * as API from '../../constants/api'
import {fetchData,entrustListShouldRefresh,appendLogToFile} from '../../action/app'
import {getEntrustOrderList,changeEntrustOrderListLoadingMore,acceptDesignateWithID,deleteUndispatchAndCancelledOrder,removeOverTimeOrderFromList} from '../../action/entrust'
import driver_limit from '../../../assets/img/app/driver_limit.png'
import BaseComponent from '../../components/common/baseComponent.js'
import EntrustOrderListItem from '../../components/entrust/entrustOrderListItem.js'
const { height,width } = Dimensions.get('window');
import Linking from '../../utils/linking'


let startTime = 0

class EntrustOrderList extends BaseComponent {
	constructor(props) {
	  super(props);
	  this._refreshList = this._refreshList.bind(this)
	  this.state = {
	  	activeTab: 0
	  }
	}
	componentDidMount() {
		super.componentDidMount()
		this._refreshList(true)
	}

	_refreshList(showLoading){
	  const {user, _getEntrustOrderList,_getEntrustOrderUndispatch} = this.props
	  const {activeTab} = this.state
	  if (activeTab == 0) {
	  	_getEntrustOrderList({
	  		companyCode: '1001',
				 num: 1,
				 resourceCode: '',
				size: 10,
	  	},showLoading)
	  }else{
	  	_getEntrustOrderUndispatch({
          ctcNum: 1,
          dpcNum: 1,
          userId: "1001"
	  	},showLoading)
	  }

	}

	componentWillReceiveProps(nextProps){
		if (nextProps.shouldEntrustOrderListRefresh && !nextProps.entrustOrderUnconfirmed.get('isLoadingMore') && !nextProps.entrustOrderUndispatch.get('isLoadingMore')) {
			this._refreshList();
			// const {activeTab} = this.state
			// if (activeTab == 0) {
			// 	this.props._getEntrustOrderList({
			// 		pageNo: 1,
			// 		companyId: nextProps.user.userId,
			// 		state: 1
			// 	})
			// }else if (activeTab == 1) {
			// 	this.props._getEntrustOrderUndispatch({
			// 		pageNo: 1,
			// 		companyId: nextProps.user.userId,
			// 	})
			// }
		}
	}
	render() {
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		const {
			user,
			entrustOrderUnconfirmed,
			entrustOrderUndispatch
		} = this.props
		if (1 == 1) {
			return (
				<View style={styles.container}>
					<NavigatorBar title='我的承运' hiddenBackIcon={ true }
												firstLevelIconFont='&#xe640;'
												secondLevelIconFont='&#xe63f;'
												secondLevelClick={ () => Linking.link(this.props.hotLine) }
												firstLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }}) }
					/>
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
                    companyCode: '1001',
                    num: 1,
                    resourceCode: '',
                    size: 10,
								},true)
							}else if (obj.i == 1) {
								this.props._getEntrustOrderUndispatch({
                    ctcNum: 1,
                    dpcNum: 1,
                    userId: "1001"
								},true)
							}
						}}
						tabBarUnderlineStyle={{backgroundColor: COLOR.APP_THEME,height: 2,width: 44,marginLeft:(width*0.5-44)*0.5 }}
						tabBarActiveTextColor={COLOR.APP_THEME}
						tabBarInactiveTextColor={COLOR.TEXT_NORMAL}
						tabBarTextStyle={{fontSize:15}}>
						<EntrustOrderListItem
							{...this.props}
							tabLabel={'接单'}
							type={'entrustOrderUnconfirmed'}
							dataSource={entrustOrderUnconfirmed}
							refreshList={this._refreshList}
							itemClick={(data)=>{
								this.props._getResourceState({goodsId: data.resourceId},(resourceState)=>{
									data.activeTab = this.state.activeTab
									data.refreshCallBack = ()=>{
										this.props._getEntrustOrderList({
                        companyCode: '1001',
                        num: 1,
                        resourceCode: '',
                        size: 10,
										})
									}
                  this.props.navigation.dispatch({
                    type: RouteType.ROUTE_ENTRUST_ORDER_DETAIL,
                    params: {...data, title: '委托详情'}
                  })
								})
							}}
							bindOrder={(data)=>{
								console.log("------ 接受派单 -- data",data);
								// 跳转到抢单页面
                  this.props.navigation.dispatch({
                      type: RouteType.ROUTE_GOOD_LIST_DETAIL,
                      params: {
                          goodID: data.resourceCode,
                          type: '1'
                      }
                  })

								// this.props._acceptDesignate({
								// 	goodsId: data.resourceId,
								// 	companyId: user.userId,
								// 	companyName: user.companyName,
								// 	companyPhone: user.phoneNumber
								// },()=>{
								// 	Toast.show('温馨提示： \n接受派单成功，等待车辆调度！')
								// 	this.props.navigation.dispatch({
								// 	  type: RouteType.ROUTE_DISPATCH_CAR,
								// 	  params: {goodsId: data.resourceId, title: '调度车辆'}
								// 	})
								// },()=>{
								// 	// refreshCallBack
								// 	this.props._getEntrustOrderList({
                 //      companyCode: '1001',
                 //      num: 0,
                 //      resourceCode: '',
                 //      size: 10,
								// 	})
								// })
							}}
							removeOverTimeOrder={(resourceId)=>{
								this.props._removeOverTimeOrder(resourceId)
							}}
							loadMoreAction={()=>{
								this.props._getEntrustOrderList({
                    companyCode: '1001',
                    num: parseInt(entrustOrderUnconfirmed.get('pageNo')) + 1,
                    resourceCode: '',
                    size: 10,
								})
							}}/>

						<EntrustOrderListItem
							{...this.props}
							tabLabel={'调度'}
							type={'entrustOrderUndispatch'}
							dataSource={entrustOrderUndispatch}
							refreshList={this._refreshList}
							itemClick={(data)=>{
								data.activeTab = this.state.activeTab
								data.title = '委托详情'
								if (data.resourceStatus == 1) {
									this.props._getResourceState({goodsId: data.resourceId},(resourceState)=>{
                    this.props.navigation.dispatch({
                      type: RouteType.ROUTE_ENTRUST_ORDER_DETAIL,
                      params: data
                    })
									})
								}else{
                  this.props.navigation.dispatch({
                    type: RouteType.ROUTE_ENTRUST_ORDER_DETAIL,
                    params: data
                  })
								}
							}}
							dispatchCar={(data)=>{
								console.log('dispatchCar', data);
                  this.props.navigation.dispatch({
                      type: RouteType.ROUTE_DISPATCH_CAR,
                      params: {data, title: '选择车辆'}
                  })
								// this.props._getResourceState({goodsId: data.resourceId},(resourceState)=>{
                 //  this.props.navigation.dispatch({
                 //    type: RouteType.ROUTE_DISPATCH_CAR,
                 //    params: {goodsId: data.resourceId, title: '调度车辆'}
                 //  })
								// })
							}}
							deleteOrderUndispatch={(goodsId)=>{
								console.log(" ======= delete cilck ");
								this.props._deleteOrderUndispatch(goodsId)
							}}
							loadMoreAction={()=>{
								this.props._getEntrustOrderUndispatch({
									pageNo: parseInt(entrustOrderUndispatch.get('pageNo')) + 1,
									ctcNum: 0,
									dpcNum: 0,
									userId: ""
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
		backgroundColor: COLOR.APP_CONTENT_BACKBG,
		marginBottom: DANGER_BOTTOM
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
		entrustOrderUndispatch: entrust.get('entrustOrderUndispatch'),
      hotLine: app.get('hotLine'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		_getEntrustOrderList: (params, showLoading)=> {
			startTime = new Date().getTime();
			dispatch(changeEntrustOrderListLoadingMore(0))
			dispatch(fetchData({
				api: API.ENTRUST_ORDER_UNCONFIRMED,
				method: 'POST',
				body: params,
				showLoading,
				success: (data)=>{
					dispatch(entrustListShouldRefresh(false))
					data.entrustOrderType = 0
					data.pageNo = params.num
					dispatch(getEntrustOrderList(data))
					dispatch(appendLogToFile('我的承运','获取我的承运-待确认列表',startTime))
				}
			}))
		},
		_getEntrustOrderUndispatch: (params,showLoading)=>{
			startTime = new Date().getTime();
			dispatch(changeEntrustOrderListLoadingMore(1))
			dispatch(fetchData({
				api: API.ENTRUST_ORDER_UNDISPATCH,
				method: 'POST',
				body: params,
				showLoading,
				success: (data)=>{
					dispatch(entrustListShouldRefresh(false))
					data.entrustOrderType = 1
					data.pageNo = params.ctcNum
					dispatch(getEntrustOrderList(data))
					dispatch(appendLogToFile('我的承运','获取我的承运-待调度列表',startTime))
				}
			}))
		},
		_acceptDesignate: (params,successCallBack,refreshCallBack)=>{
			startTime = new Date().getTime();
			console.log(" ------ 接受派单 successCallBack",successCallBack);
			dispatch(fetchData({
				api: API.ACCEPT_DISPATCH,
				method: 'POST',
				body: params,
				success: (data)=>{
					console.log("  --- 接受派单成功 --- ",data);
					if(successCallBack){successCallBack()}
					dispatch(acceptDesignateWithID(params.goodsId))
					dispatch(appendLogToFile('我的承运','接受派单成功',startTime))

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
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.DELETE_ORDER_UNDISPATCH,
				method: 'POST',
				showLoading: true,
				body: {goodsId},
				success: (data)=>{
					console.log("  --- 删除待调度且已取消的订单成功 --- ",data);
					successCallBack && successCallBack(data)
					dispatch(deleteUndispatchAndCancelledOrder(goodsId))
					dispatch(appendLogToFile('我的承运','删除待调度且已取消的订单',startTime))
				},
				fail: (data)=>{
					console.log("-------- 删除失败 ",data);
					failCallBack && failCallBack(data)
				}
			}))
		},
		_getResourceState: (params,successCallBack,failCallBack)=>{
			startTime = new Date().getTime();
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
					dispatch(appendLogToFile('我的承运','校验货源状态是否正常',startTime))

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

