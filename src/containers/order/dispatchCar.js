'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ListView,
	StyleSheet
} from 'react-native'
import NavigatorBar from '../../components/common/navigatorbar'
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import * as API from '../../constants/api.js'
import {fetchData} from '../../action/app.js'
import { getFreeCarList } from '../../action/entrust.js'
import BaseComponent from '../../components/common/baseComponent';

class DispatchCarCell extends Component {
	constructor(props) {
	  super(props);
	}
	componentDidMount() {

	}

	render() {
		const {dispatchCar,rowData} = this.props

		return(
			<View style={[styles.topTabView,{height: 50}]}>
				<View style={styles.topTabItem}>
					<Text style={[styles.topTabItemText,{color: COLOR.TEXT_NORMAL}]}>{rowData.carNo}</Text>
				</View>
				<View style={styles.topTabItem}>
					<Text style={[styles.topTabItemText,{color: COLOR.TEXT_NORMAL}]}>{rowData.driverName}</Text>
				</View>
				<View style={styles.topTabItem}>
					<Text style={[styles.topTabItemText,{color: COLOR.TEXT_NORMAL}]}>{rowData.carTypeStr}</Text>
				</View>
				<View style={styles.topTabItem}>
					<View style={{height: 25}}>
						<Button activeOpacity={0.8} style={{backgroundColor: 'white',borderWidth: 1,borderRadius: 2,width:75,height: 25,borderColor: COLOR.APP_THEME}}
							textStyle={{fontSize: 12,color: COLOR.APP_THEME}}
							onPress={()=>{
								if (dispatchCar) {
									dispatchCar(rowData)
								};
							}}>
						  确认选择
						</Button>
					</View>
				</View>
			</View>
		)
	}
}


class DispatchCar extends BaseComponent {
	constructor(props) {
	  super(props);
	  const {params} = this.props.navigation.state
		console.log("------- 派车 车辆列表页面收到的参数",params);
		if (!params.goodsId) {
			console.warn('派车列表需要非空的goodsId')
		};
	  this.state = {
	  	goodsId: params.goodsId
	  }
	  this._carBindDriver = this._carBindDriver.bind(this)

	}

	componentDidMount() {
		super.componentDidMount();
		const {user } = this.props
    this.props.navigation.setParams({carBindDriver: this._carBindDriver})

		this.props._getCarList({
			carrierId: user.userId,
			pageNo: 1,
			carState: 0,//休息中
			haveDriver: 1,//是否绑定司机 1 绑定  0 全部
			certificationStatus: 2 //认证状态 0:未认证(默认) 1:认证中 2：已认证 3：认证未通过
		})
	}

	static navigationOptions = ({navigation}) => {
		return {
			headerRight: (
				<Button
	        style={{borderWidth: 0,height: 34,bottom: 0,marginRight: 20,marginTop: 10}}
	        textStyle={{color: COLOR.TEXT_NORMAL,fontSize: 14}}
	        onPress={()=>{
	          navigation.state.params.carBindDriver()
	        }}>
		      绑定司机
		    </Button>
	    )
	  }
	}

	_carBindDriver(){
		this.props.navigation.dispatch({
			type: RouteType.ROUTE_CAR_BIND_DRIVER,
			params: {
				_refreshCallBack:()=>{
					this.props._getCarList({carrierId: user.userId,pageNo: 1,carState: 0,haveDriver: 1,certificationStatus: 2})
				}
			}
		})
	}
	_renderRow(rowData,SectionId,rowID){
		const {goodsId} = this.state
		return <DispatchCarCell
			dispatchCar={(data)=>{
				console.log("-------派车 车辆信息",data);
				this.props._getResourceState({goodsId},(resourceState)=>{
					this.props.navigation.dispatch({
						type: RouteType.ROUTE_TRANSPORT_CONFIRM,
						params: {goodsId,carId: data.id}
					})
				})
			}}
			rowData={rowData}
			rowID={ rowID }/>
	}

	render() {
		const {freeCarList,user} = this.props
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

		return <View style={styles.container}>
			{/*<NavigatorBar
							router={this.props.router}
							title={ '调度车辆' }
							optTitle='绑定司机'
							optTitleStyle={{color: COLOR.TEXT_NORMAL}}
							firstLevelClick={ () => {

							}}/>*/}
			<View style={{padding: 10}}>
				<Text style={{color: COLOR.TEXT_LIGHT,lineHeight: 18}}>温馨提示：该列表中仅显示休息中的可调度车辆，同时未绑定司机的车辆在该列表中无法显示，如有需要，请先到车辆管理页面绑定司机</Text>
			</View>
			<View style={styles.topTabView}>
				<View style={styles.topTabItem}>
					<Text style={styles.topTabItemText}>车牌号</Text>
				</View>
				<View style={styles.topTabItem}>
					<Text style={styles.topTabItemText}>司机姓名</Text>
				</View>
				<View style={styles.topTabItem}>
					<Text style={styles.topTabItemText}>车辆类型</Text>
				</View>
				<View style={styles.topTabItem}>
					<Text style={styles.topTabItemText}>车辆调度</Text>
				</View>
			</View>
			<ListView
				style={{flex:1}}
				dataSource={ ds.cloneWithRows(freeCarList.get('list').toJS() || []) }
				renderRow={this._renderRow.bind(this)}
				onEndReachedThreshold={10}
				enableEmptySections={true}/>
			{ this.props.loading ? this._renderLoadingView() : null }
		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	topTabView: {
		height: 44,
		flexDirection: 'row',
		backgroundColor: 'white',
		borderBottomWidth:1,
		borderBottomColor: COLOR.LINE_COLOR
	},
	topTabItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	topTabItemText: {
		color: COLOR.TEXT_LIGHT,
		fontSize: 15
	},
	cellContainer: {

	}
})

const mapStateToProps = (state) => {
	const {entrust,app} = state
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		freeCarList: entrust.get('freeCarList')
		// carsCanBeDispatched: order.get('carsCanBeDispatched').toJS()
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		_getCarList:(params)=>{
			dispatch(fetchData({
				api: API.QUERY_CAR_LIST,
				method: 'POST',
				body: params,
				success: (data)=>{
					console.log("------- 获取到供应商的司机。。。",data);
					data.pageNo = params.pageNo,
					dispatch(getFreeCarList(data))
				}
			}))
		},
		// _dispatchCar: (params,successCallBack)=>{
		// 	dispatch(fetchData({
		// 		api: API.DISPATCH_CAR,
		// 		method: 'POST',
		// 		body: params,
		// 		success: (data)=>{
		// 			if(successCallBack){successCallBack()}
		// 			console.log("------- 派车成功 ",data);
		// 		}
		// 	}))
		// }
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

export default connect(mapStateToProps, mapDispatchToProps)(DispatchCar);

