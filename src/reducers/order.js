import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import HelperUtil from '../utils/helper'

const initState = Immutable.fromJS({
	activeTab: 0,
	activeSubTab: 0,
	orderAll: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	orderToInstall: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	orderToDelivery: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	orderUnPay: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false,
		isBatchEditing: false,
		allSelected: false,
		showBatchBar: false
	},
	orderPaying: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	orderPayed: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	orderCanceled: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	orderDetail: null,//vehicleType
	clearDetail: null
});

export default (state = initState, action) => {
	let newState = state;
	const {payload} = action
	// 1所有 2待装货 3待交付   5未结算 6结算中 7已结算(已完成) 8取消
	const statusArr = ['','orderAll','orderToInstall','orderToDelivery','','orderUnPay','orderPaying','orderPayed','orderCanceled']
	switch (action.type) {
		case ActionTypes.ACTION_CHANGE_ORDER_LOADINGMORE:
			const rootTypeLoading = statusArr[payload]
			console.log("------- change order loadingMore ",rootTypeLoading);
			newState = newState.setIn([rootTypeLoading,'isLoadingMore'],true);
			return newState
		case ActionTypes.ACTION_CHANGE_ORDER_LIST_REFRESHING:
			newState = newState.setIn([statusArr[payload.orderState],'isRefreshing'],false);
		case ActionTypes.ACTION_RECEIVE_ORDER_LIST:
			const rootTypeList = statusArr[payload.orderState]
			newState = newState.setIn([rootTypeList,'pageNo'],payload.pageNo);
			newState = newState.setIn([rootTypeList,'isLoadingMore'],false);
			newState = newState.setIn([rootTypeList,'total'],payload.total);
			newState = newState.setIn([rootTypeList,'isRefreshing'],false);
			if (payload.pageNo === 1) {
			  newState = newState.setIn([rootTypeList,'list'],Immutable.fromJS([]));
			}
			if (payload.list) {
				const newArr = payload.list.map((item)=>{
					if (rootTypeList === 'orderUnPay') {
						/**
						 * 2017-11-09, 17:08:46 GMT+0800
						 * 在【未结算】 (orderUnPay) 列表中需要记录有没有未催款的订单， 至少有一个这种订单时 显示【批量催款】按钮
						 */
						if ((item.orderState == 10 || (item.orderState == 14 && item.entrustType == 1)) && item.promptState == 1) {
							// 未结算 且 未催款
							newState = newState.setIn(['orderUnPay','showBatchBar'],true);
						};
					};
					item.from = item.fromProvinceName == item.fromCityName ? `${item.fromProvinceName}${item.fromAreaName}` : `${item.fromProvinceName}${item.fromCityName}${item.fromAreaName}`
					item.to = item.toProvinceName == item.toCityName ? `${item.toProvinceName}${item.toAreaName}` : `${item.toProvinceName}${item.toCityName}${item.toAreaName}`

					item.orderStateStr = HelperUtil.getOrderStateStr(item.orderState, item.entrustType)

					// item.isBetter = payload.goodsType == 2
					item.orderType = 'ORDER'
					item.goodsNameStr = HelperUtil.getGoodsName(item.goodsName)
					item.goodsSKU = (item.cargoSpecTon ? (item.cargoSpecTon + '吨') : '') + (item.cargoSpecTon && item.cargoSpecSquare ? '/' : '') + (item.cargoSpecSquare ? (item.cargoSpecSquare + '方') : '')
					item.carLength = HelperUtil.getCarLength(parseInt(item.vehicleType))
					// item.offerCount = 1
					// item.offerPrice = 10
					if (item.goodsType == 1) {
						item.goodsTypeStr = '干线'
						const startDate = item.loadingStartDate.split(' ')[0]
						// const endDate = item.loadingEndDate.split(' ')[0]
						item.installDate = startDate//`从${startDate}到${endDate}`
					}else if(item.goodsType == 2){
						item.goodsTypeStr = '卡班'
						// item.installDate = item.startDate
						item.carBanDate = `${item.startDate.split(' ')[0]} ${item.startTimeHourMin}:${item.startTimeMinuteMin}`//-${item.startTimeHourMax}:${item.startTimeMinuteMax}`

					}
					item.freight = item.carrierDealPrice
					return item
				})
				newState = newState.setIn([rootTypeList,'list'],newState.getIn([rootTypeList,'list']).concat(newArr));
			};
			if (newState.getIn([rootTypeList,'list']).size < payload.total) {
				newState = newState.setIn([rootTypeList,'hasMore'],true)
			}else{
				newState = newState.setIn([rootTypeList,'hasMore'],false)
			}
			return newState;
		case ActionTypes.ACTION_RECEIVE_ORDER_DETAIL:
			if (payload) {
				payload.goodsInfoData = {
					from: payload.fromProvinceName + (payload.fromCityName == payload.fromProvinceName ? '' : payload.fromCityName) + payload.fromAreaName + payload.fromAddress,
					to: payload.toProvinceName + (payload.toCityName == payload.toProvinceName ? '' : payload.toCityName) + payload.toAreaName + payload.toAddress,
					goodsNameStr: HelperUtil.getGoodsName(payload.goodsName),
					goodsSKU: (payload.cargoSpecTon ? (payload.cargoSpecTon + '吨') : '') + (payload.cargoSpecTon && payload.cargoSpecSquare ? '/' : '') + (payload.cargoSpecSquare ? (payload.cargoSpecSquare + '方') : ''),
					carLength: HelperUtil.getCarLength(parseInt(payload.vehicleType)),
					remark: payload.remark,
					temperatureStr: HelperUtil.getTemperature(payload.temperature,payload.temperatureMin,payload.temperatureMax),
					entrustCode: payload.resourceId,//委托单号
					transportCode: payload.transportNo,//运单号
					goodsType: payload.goodsType,
				}

				if (payload.loadingList && payload.loadingList.length > 0) {
					const loadingListStrArr = payload.loadingList.map((item,index)=>{
						return (item.loadingProvinceName == item.loadingCityName ? '' : item.loadingProvinceName) + item.loadingCityName + item.loadingAreaName + item.loadingAddress
					})
					payload.goodsInfoData.loadingListStrArr = loadingListStrArr
				};

				if (payload.goodsType == 1) {
					payload.goodsTypeStr = '干线'
					payload.goodsInfoData.installDate = payload.loadingStartDate.split(' ')[0]//`从${payload.loadingStartDate.split(' ')[0]}到${payload.loadingEndDate.split(' ')[0]}`
					payload.goodsInfoData.arrivalDate = payload.arrivalStartDate.split(' ')[0]//`从${payload.arrivalStartDate.split(' ')[0]}到${payload.arrivalEndDate.split(' ')[0]}`
				}else if(payload.goodsType == 2){
					payload.goodsTypeStr = '卡班'
					payload.goodsInfoData.installDate = payload.startDate
					payload.goodsInfoData.carBanDate = `${payload.startDate.split(' ')[0]} ${payload.startTimeHourMin}:${payload.startTimeMinuteMin}`//-${payload.startTimeHourMax}:${payload.startTimeMinuteMax}`

				}
				payload.orderStateStr = HelperUtil.getOrderStateStr(payload.orderState, payload.entrustType)
			};
			newState = newState.set('orderDetail',payload)
			return newState

		case ActionTypes.ACTION_RECEIVE_CLEAR_DETAIL:
			const clearDetail = payload
			if (clearDetail) {
				clearDetail.orderStateStr = HelperUtil.getOrderStateStr(clearDetail.orderState,clearDetail.entrustType)
				clearDetail.paymentTypeStr = HelperUtil.getPayMentTypeStr(payload.paymentType)
			}
			newState = newState.set('clearDetail',clearDetail)
			return newState

		case ActionTypes.ACTION_ORDER_TO_STATE_WITH_ORDERNO:
			const {targetOrderNo,toState,orderTopType} = payload
			console.log(" -----根据订单号改状态 ==  ",payload)
			if (!(targetOrderNo && toState && orderTopType)) {
				console.warn("缺少参数",targetOrderNo && toState && orderTopType);
				return newState
			};
			if ((orderTopType == 'orderUnPay' && toState == 15) || (orderTopType == 'orderPaying' && toState == 12)) {
				/**
				 * 2017-11-10, 16:34:47 GMT+0800
				 * 未结算下的订单改状态为15  和 结算中 的订单改状态为12时 移除这个订单
				 */
				let newOrderList = newState.getIn([orderTopType,'list'])
				let targetIndex = -1
				newOrderList.map((item,index)=>{
					if (item.orderNo == targetOrderNo) {
						targetIndex = index
					}
				})
				if (targetIndex != -1) {
					console.log("未结算下的订单改状态为15  和 结算中 的订单改状态为12时 移除这个订单");
					newOrderList = newOrderList.delete(targetIndex)
				}
				newState = newState.setIn([orderTopType,'list'],newOrderList)
				return newState
			}
			const typeArr = [orderTopType]
			if (typeArr.indexOf('orderAll') == -1) {
				typeArr.push('orderAll')
			}
			typeArr.map((item)=>{
				console.log("---- one of orderTopType",item);
				let newOrderList = newState.getIn([item,'list'])
				newOrderList = newOrderList.map((item,index)=>{
					if (item.orderNo == targetOrderNo) {
						item.orderState = toState
						item.orderStateStr = HelperUtil.getOrderStateStr(item.orderState,item.entrustType)
						// item.orderStateStr = HelperUtil.getOrderStateStr(toState)
						console.log("找到相应订单 修改状态为",toState);
					}
					return item
				})
				newState = newState.setIn([item,'list'],newOrderList)
			})
			return newState


		case ActionTypes.ACTION_SET_ALL_UNPAY_SELECTED_OR_NOT:
			/**
			 * 2017-11-08, 09:39:33 GMT+0800
			 * 把所有【未结算】且 标记为未催款的订单 选中状态设置为 true 或 false    orderUnPay
			 *
			 */
			const allSelectOrderUnPayList = newState.getIn(['orderUnPay','list']).map((item,index)=>{
				const isUnpayUnprompt = (item.orderState === 10 || (item.orderState === 14 && item.entrustType === 1)) && item.promptState === 1
				if (isUnpayUnprompt) {
					item.selected = payload
				}
				return item
			})
			newState = newState.setIn(['orderUnPay','allSelected'],payload)
			newState = newState.setIn(['orderUnPay','list'],allSelectOrderUnPayList)
			return newState
		case ActionTypes.ACTION_SET_UNPAY_ORDER_BATCH_EDITING:
	    /**
	     * 2017-11-08, 09:22:41 GMT+0800
	     * 所有【未结算】且 标记为未催款的订单
	     * 标记为正在编辑or not
	     */
			const editingOrderUnPayList = newState.getIn(['orderUnPay','list']).map((item,index)=>{
				const isUnpayUnprompt = (item.orderState === 10 || (item.orderState === 14 && item.entrustType === 1)) && item.promptState === 1
				if (isUnpayUnprompt) {
					item.isBatchEditing = payload
				};
				return item
			})
			newState = newState.setIn(['orderUnPay','list'],editingOrderUnPayList)
			return newState
		// case ActionTypes.ACTION_SET_UNPAY_ORDER_SELECTED_WITH_ORDERNO:
		// 	// 根据orderNo 把某个未结算订单的状态置为 选中或未选中
		// 	//
		// 	//     orderUnPay
		// 	const unPayOrderList = newState.getIn(['orderUnPay','list']).map((item,index)=>{
		// 		if (item.orderNo == payload) {
		// 			item.selected = !item.selected
		// 		};
		// 		return item
		// 	})
		// 	newState = newState.setIn(['orderUnPay','list'],unPayOrderList)
		// 	return newState
		case ActionTypes.ACTION_CHANGE_SELECT_STATE_IN_UNPAY_ORDER:
		// 根据orderNo 把某个未结算订单的状态置为 选中或未选中
			let defaultSelectAll = true
			const unPayOrderList = newState.getIn(['orderUnPay','list']).map((item,index)=>{
				if (item.orderNo == payload) {
					item.selected = !item.selected
				};
				console.log("==== ?? ",item.selected);
				/**
				 * 没有选中 且 状态是【未结算】标记为 未催款
				 * 则说明没有全选
				 */
				const isUnpayUnprompt = (item.orderState === 10 || (item.orderState === 14 && item.entrustType === 1)) && item.promptState === 1
				if (!item.selected && isUnpayUnprompt) {
					defaultSelectAll = false
				};
				return item
			})
			newState = newState.setIn(['orderUnPay','list'],unPayOrderList)
			newState = newState.setIn(['orderUnPay','allSelected'],defaultSelectAll)
			return newState
		case ActionTypes.ACTION_CHANGE_ORDER_TOP_TAB:
			newState = newState.set('activeTab',payload.tabIndex || 0)
			newState = newState.set('activeSubTab',payload.subTabIndex || 0)
			return newState
		case ActionTypes.ACTION_CONFIG_BILL_OUT_IMAGE_FOR_ORDER:
			['orderAll','orderToInstall'].map((item)=>{
				let newOrderList = newState.getIn([item,'list'])
				newOrderList = newOrderList.map((item,index)=>{
					if (item.orderNo == payload.orderNo) {
						item.billOutImg = payload.imagesString
					}
					return item
				})
				newState = newState.setIn([item,'list'],newOrderList)
			})
			return newState
		case ActionTypes.ACTION_CHANGE_ORDER_URGED_WITH_ORDER_NO:
			['orderAll','orderUnPay'].map((item)=>{
				let newOrderList = newState.getIn([item,'list'])
				if (newOrderList) {
					newOrderList = newOrderList.map((item,index)=>{
						if (item.orderNo == payload.orderNo) {
							item.promptState = 2
						}
						return item
					})
				};
				newState = newState.setIn([item,'list'],newOrderList)
			})
			return newState
		default:
			return newState;
	}
};