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
import {fetchData,appendLogToFile} from '../../action/app.js'
import { getFreeCarList } from '../../action/entrust.js'
import BaseComponent from '../../components/common/baseComponent';
import LoadMoreFooter from '../../components/common/loadMoreFooter'
import SearchInput from '../../components/common/searchInput.js'
let startTime = 0
class DispatchCarCell extends Component {
	constructor(props) {
	  super(props);
	}
	componentDidMount() {

	}

	render() {
		const {dispatchCar,rowData} = this.props

		return(
			<View style={[styles.topTabView,{height: 50, paddingHorizontal: 15, justifyContent: 'space-between'}]}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text style={[styles.topTabItemText,{color: COLOR.TEXT_NORMAL}]}>{rowData.carNum}</Text>
					<Text style={[styles.topTabItemText,{color: COLOR.TEXT_NORMAL, marginLeft: 10}]}>{rowData.drivers ? `司机:${rowData.drivers}` : ''}</Text>
				</View>
				{/*<View style={styles.topTabItem}>*/}
					{/*<Text style={[styles.topTabItemText,{color: COLOR.TEXT_NORMAL}]}>{rowData.carTypeStr}</Text>*/}
				{/*</View>*/}
				<View style={styles.topTabItem}>
					<View style={{height: 25}}>
						<Button activeOpacity={0.8} style={{backgroundColor: 'white',borderWidth: 1,borderRadius: 12,width:75,height: 25,borderColor: COLOR.APP_THEME}}
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
	  	goodsId: params.goodsId,
				param: params.data,
	  }
	  // this._carBindDriver = this._carBindDriver.bind(this)
	  this._searchKey = ''
	}

	componentDidMount() {
		super.componentDidMount();
		const {user } = this.props
    // this.props.navigation.setParams({carBindDriver: this._carBindDriver})
    // this._loadMoreAction(1)
		this.props._getCarList({
        carStatus: "enable",
        companionPhone: global.companyPhone // 承运商手机号
		})
	}

	static navigationOptions = ({navigation}) => {
		return {
			header: (
				<NavigatorBar
					router={navigation}
				// 	optTitle='绑定司机'
				// 	optTitleStyle={{color: COLOR.TEXT_NORMAL}}
				// 	firstLevelClick={ () => {
				// 		navigation.state.params.carBindDriver()
				// 	}}
				/>
			)
	  }
	}

	_carBindDriver(){
		this.props.navigation.dispatch({
			type: RouteType.ROUTE_CAR_BIND_DRIVER,
			params: {
				title: '车辆绑定司机',
				_refreshCallBack:()=>{
					this.props._getCarList({carrierId: this.props.user.userId,pageNo: 1,carState: 0,haveDriver: 1,certificationStatus: 2})
				}
			}
		})
	}
	_renderRow(rowData,SectionId,rowID){
		const {goodsId} = this.state
		return <DispatchCarCell
			dispatchCar={(data)=>{
				console.log("-------派车 车辆信息",data);

				this.props._disPatchCar({
            carId: data.carId, // 车辆id
            carLen: data.carLen, // 车辆长度
            carNo: data.carNum, // 车辆牌号
            carType: this.state.param.carType, // 车辆类型
            carrierName: global.ownerName, //承运商名字
            carryCapacity: data.carryCapacity, // 车辆载重
            companyCode: global.companyCode, // 承运商code
            companyPhone: global.companyPhone, // 承运商手机号
            driverId: "string", // 司机id
            driverName: data.drivers, // 司机姓名
            driverPhone: "string", // 司机手机号
            orderSource: this.state.param.orderSource, // 订单来源： 1.交易中心 2.调度中心
            resourceCode: this.state.param.resourceCode // 货源id
        });
			}}
			rowData={rowData}
			rowID={ rowID }/>
	}
	_renderFooter(){
		const { freeCarList } = this.props;
		if (freeCarList.get('list').size > 1) {
			if (freeCarList.get('hasMore')) {
				return <LoadMoreFooter />
			}else{
				return <LoadMoreFooter isLoadAll={true}/>
			}
		};
	}
	_toEnd(){
		const {freeCarList, user} = this.props
		if (freeCarList.get('isLoadingMore')){
			console.log("------ 正在加载中");
			return;
		}else if(freeCarList.get('list').size >= freeCarList.get('total')) {
			console.log("------ 已加载全部 size ",freeCarList.get('list').size);
			return;
		}
		// this._loadMoreAction()
	}

	_loadMoreAction(pageNo){
		const {freeCarList, user} = this.props
		console.log(" search key is  ",this._searchKey);
		this.props._getCarList({
        carStatus: "enable",
        companionPhone: global.companyPhone // 承运商手机号
		})
	}

	render() {
		const {freeCarList,user} = this.props
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

		return <View style={styles.container}>
			{/*<SearchInput searchAction={(key)=>{*/}
				{/*this._searchKey = key*/}
				{/*this._loadMoreAction(1)*/}
			{/*}}/>*/}
			{/*<View style={{padding: 10}}>*/}
				{/*<Text style={{color: COLOR.TEXT_LIGHT,lineHeight: 18}}>温馨提示：该列表中仅显示休息中的可调度车辆，同时未绑定司机的车辆在该列表中无法显示，如有需要，请先到车辆管理页面绑定司机</Text>*/}
			{/*</View>*/}
			{/*<View style={styles.topTabView}>*/}
				{/*<View style={styles.topTabItem}>*/}
					{/*<Text style={styles.topTabItemText}>车牌号</Text>*/}
				{/*</View>*/}
				{/*<View style={styles.topTabItem}>*/}
					{/*<Text style={styles.topTabItemText}>司机姓名</Text>*/}
				{/*</View>*/}
				{/*<View style={styles.topTabItem}>*/}
					{/*<Text style={styles.topTabItemText}>车辆类型</Text>*/}
				{/*</View>*/}
				{/*<View style={styles.topTabItem}>*/}
					{/*<Text style={styles.topTabItemText}>车辆调度</Text>*/}
				{/*</View>*/}
			{/*</View>*/}
			<ListView
				style={{flex:1}}
				dataSource={ ds.cloneWithRows(freeCarList.get('list').toJS() || []) }
				renderRow={this._renderRow.bind(this)}
				onEndReachedThreshold={100}
				enableEmptySections={true}
				onEndReached={ this._toEnd.bind(this) }
				renderFooter={ this._renderFooter.bind(this) }/>
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
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.QUERY_CAR_LIST,
				method: 'POST',
				body: params,
				success: (data)=>{
					console.log("------- 获取到供应商的司机。。。",data);
					data.pageNo = 1,
					dispatch(getFreeCarList(data))
					dispatch(appendLogToFile('调度车辆','获取可调度车辆列表',startTime))
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
			startTime = new Date().getTime();
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
					dispatch(appendLogToFile('调度车辆','校验货源状态是否正常',startTime))
				},
				fail: (data)=>{
					failCallBack && failCallBack(data)
				}
			}))
		},
      _disPatchCar:(params)=>{
          startTime = new Date().getTime();
          dispatch(fetchData({
              api: API.DISPATCH_CAR,
              method: 'POST',
              body: params,
              success: (data)=>{
                  console.log("------- 获取到供应商的司机。。。",data);
                  data.pageNo = params.pageNo,
                      dispatch(getFreeCarList(data))
                  dispatch(appendLogToFile('调度车辆','获取可调度车辆列表',startTime))
              }
          }))
      },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DispatchCar);

