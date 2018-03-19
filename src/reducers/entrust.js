import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import HelperUtil from '../utils/helper.js'

const initState = Immutable.fromJS({
	// entrustOrderAll:{
	// 	list:[],
	// 	total: 0,
	// 	isLoadingMore: false,
	// 	hasMore: true,
	// 	pageNum: 1
	// },
	entrustOrderUnconfirmed: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	entrustOrderUndispatch: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	freeCarList: {
		list: [],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1
	},
	entrustOrderDetail: {},
	transpostConfirmDetail: {}
});

export default (state = initState, action) => {
	let newState = state;
	const payload = action.payload
	switch (action.type) {
		case ActionTypes.ACTION_CHANGE_ENTRUST_ORDER_LIST_LOADING_MORE:
			newState = newState.setIn([payload == 0 ? 'entrustOrderUnconfirmed' : 'entrustOrderUndispatch','isLoadingMore'],true);
			return newState
		case ActionTypes.ACTION_CHANGE_ENTRUST_ORDER_LIST_REFRESHING:
			newState = newState.setIn([payload.type,'isRefreshing'],payload.isRefreshing);
			return newState
		case ActionTypes.ACTION_GET_ENTRUST_ORDER_LIST:

			let rootType = 'entrustOrderUnconfirmed'
			if (payload.entrustOrderType == 0) {//0 派单中  1 待调度
				rootType = 'entrustOrderUnconfirmed'
			}else if (payload.entrustOrderType == 1) {
				rootType = 'entrustOrderUndispatch'
			}
			newState = newState.setIn([rootType,'isRefreshing'],false);
			newState = newState.setIn([rootType,'pageNo'],payload.pageNo);
			newState = newState.setIn([rootType,'isLoadingMore'],false);
			newState = newState.setIn([rootType,'total'],payload.total);
			if (payload.pageNo === 1) {
			  newState = newState.setIn([rootType,'list'],Immutable.fromJS([]));
			}
			if (payload.list) {
				const newArr = payload.list.map((item)=>{
					const from = item.fromProvinceName == item.fromCityName ? `${item.fromProvinceName}${item.fromAreaName}` : `${item.fromProvinceName}${item.fromCityName}${item.fromAreaName}`
					const to = item.toProvinceName == item.toCityName ? `${item.toProvinceName}${item.toAreaName}` : `${item.toProvinceName}${item.toCityName}${item.toAreaName}`
					item.from = from
					item.to = to
					item.orderType = 'ENTRUST'
					if (item.goodsType == 1) {
						const startDate = item.loadingStartDate.split(' ')[0]
						// const endDate = item.loadingEndDate.split(' ')[0]
						item.installDate = startDate//`从${startDate}到${endDate}`
					}else if (item.goodsType == 2) {
						item.installDate = item.startDate
					}
					if (item.goodsType == 1) {
						item.goodsTypeStr = '干线'
					}else if(item.goodsType == 2){
						item.goodsTypeStr = '卡班'
						item.carBanDate = `${item.startDate.split(' ')[0]} ${item.startTimeHourMin}:${item.startTimeMinuteMin}`//-${item.startTimeHourMax}:${item.startTimeMinuteMax}`
					}
					item.carLength = HelperUtil.getCarLength(parseInt(item.carType))
					item.goodsNameStr = HelperUtil.getGoodsName(item.goodsName)
					item.goodsSKU = (item.cargoSpecTon ? (item.cargoSpecTon + '吨') : '') + (item.cargoSpecTon && item.cargoSpecSquare ? '/' : '') + (item.cargoSpecSquare ? (item.cargoSpecSquare + '方') : '')

					if (payload.entrustOrderType == 0) {
						item.orderStateStr = '待确认'
						item.entrustOrderStatus = 1//标记为待确认
					}else if (payload.entrustOrderType == 1) {
						let str = '待调度'
						switch(item.resourceStatus){
							case 2: str = '已关闭';break;
							case 3: str = '已取消';break;
							case 4: str = '已删除';break;
						}
						item.orderStateStr = str
						item.entrustOrderStatus = 2//标记为待调度
					}
					return item
				})
				newState = newState.setIn([rootType,'list'],newState.getIn([rootType,'list']).concat(newArr));
			};
			newState = newState.setIn([rootType,'hasMore'],newState.getIn([rootType,'list']).size < payload.total)
			return newState;

		case ActionTypes.ACTION_GET_FREE_CAR_LIST:
			newState = newState.setIn(['freeCarList','pageNo'],payload.pageNo);
			newState = newState.setIn(['freeCarList','isLoadingMore'],false);
			newState = newState.setIn(['freeCarList','total'],payload.total);

			if (payload.pageNo === 1) {
			  newState = newState.setIn(['freeCarList','list'],Immutable.fromJS([]));
			}
			if (payload) {
				// const newArr = payload.map((item)=>{
				// 	item.carTypeStr = HelperUtil.getCarType(item.carType)
				// 	return item
				// })
				newState = newState.setIn(['freeCarList','list'],newState.getIn(['freeCarList','list']).concat(payload));
			};
			newState = newState.setIn(['freeCarList','hasMore'],newState.getIn(['freeCarList','list']).size < payload.total)
			return newState
		case ActionTypes.ACTION_RECEIVE_ENTRUST_ORDER_DETAIL:
			if (payload) {
				payload.goodsInfoData = {
					from: payload.fromProvinceName + (payload.fromCityName == payload.fromProvinceName ? '' : payload.fromCityName) + payload.fromAreaName + payload.fromAddress,
					to: payload.toProvinceName + (payload.toCityName == payload.toProvinceName ? '' : payload.toCityName) + payload.toAreaName + payload.toAddress,
					goodsNameStr: HelperUtil.getGoodsName(payload.goodsName),
					goodsSKU: (payload.cargoSpecTon ? (payload.cargoSpecTon + '吨') : '') + (payload.cargoSpecTon && payload.cargoSpecSquare ? '/' : '') + (payload.cargoSpecSquare ? (payload.cargoSpecSquare + '方') : ''),
					carLength: payload.goodsType == 1 ? HelperUtil.getCarLength(parseInt(payload.carType)) : '',
					remark: payload.remark,
					temperatureStr: HelperUtil.getTemperature(payload.temperature,payload.temperatureMin,payload.temperatureMax),
					goodsType: payload.goodsType
				}
				if (payload.goodsType == 1) {
					payload.goodsTypeStr = '干线'
					payload.goodsInfoData.installDate = payload.loadingStartDate.split(' ')[0]//`从${payload.loadingStartDate.split(' ')[0]}到${payload.loadingEndDate.split(' ')[0]}`
					payload.goodsInfoData.arrivalDate = payload.arrivalStartDate.split(' ')[0]//`从${payload.arrivalStartDate.split(' ')[0]}到${payload.arrivalEndDate.split(' ')[0]}`
				}else if(payload.goodsType == 2){
					payload.goodsTypeStr = '卡班'
					payload.goodsInfoData.installDate = payload.startDate
					payload.goodsInfoData.carBanDate = `${payload.startDate.split(' ')[0]} ${payload.startTimeHourMin}:${payload.startTimeMinuteMin}`//-${payload.startTimeHourMax}:${payload.startTimeMinuteMax}`
				}
			};
			newState = newState.set('entrustOrderDetail',payload)
			return newState
		case ActionTypes.ACTION_RECEIVE_ENTRUST_ORDER_DETAIL_TRANSPORTCONFIRM:
			if (payload) {
				payload.goodsInfoData = {
					from: payload.fromProvinceName + (payload.fromCityName == payload.fromProvinceName ? '' : payload.fromCityName) + payload.fromAreaName + payload.fromAddress,
					to: payload.toProvinceName + (payload.toCityName == payload.toProvinceName ? '' : payload.toCityName) + payload.toAreaName + payload.toAddress,
					goodsNameStr: HelperUtil.getGoodsName(payload.goodsName),
					goodsSKU: (payload.cargoSpecTon ? (payload.cargoSpecTon + '吨') : '') + (payload.cargoSpecTon && payload.cargoSpecSquare ? '/' : '') + (payload.cargoSpecSquare ? (payload.cargoSpecSquare + '方') : ''),
					carLength: payload.goodsType == 1 ? HelperUtil.getCarLength(parseInt(payload.carType)) : '',
					remark: payload.remark,
					temperatureStr: HelperUtil.getTemperature(payload.temperature,payload.temperatureMin,payload.temperatureMax),
					goodsType: payload.goodsType
				}

				if (payload.goodsType == 1) {
					payload.goodsTypeStr = '干线'
					payload.goodsInfoData.installDate = payload.loadingStartDate.split(' ')[0]//`从${payload.loadingStartDate.split(' ')[0]}到${payload.loadingEndDate.split(' ')[0]}`
					payload.goodsInfoData.arrivalDate = payload.arrivalStartDate.split(' ')[0]//`从${payload.arrivalStartDate.split(' ')[0]}到${payload.arrivalEndDate.split(' ')[0]}`
				}else if(payload.goodsType == 2){
					payload.goodsTypeStr = '卡班'
					payload.goodsInfoData.installDate = payload.startDate
					payload.goodsInfoData.carBanDate = `${payload.startDate.split(' ')[0]} ${payload.startTimeHourMin}:${payload.startTimeMinuteMin}`//-${payload.startTimeHourMax}:${payload.startTimeMinuteMax}`
				}
			};
			newState = newState.set('transpostConfirmDetail',payload)
			return newState
		case ActionTypes.ACTION_ACCEPT_DESIGNATE_WITH_ID:
			const newList = newState.getIn(['entrustOrderUnconfirmed','list'])
			newList.map((item,index)=>{
				if (item.resourceId == payload) {
					newState = newState.setIn(['entrustOrderUnconfirmed','list'],newState.getIn(['entrustOrderUnconfirmed','list']).delete(index))
				}
			})
			return newState
		case ActionTypes.ACTION_DELETE_UNDISPATCH_CANCELLED_ORDER:
			const undispatchList = newState.getIn(['entrustOrderUndispatch','list'])
			undispatchList.map((item,index)=>{
				if (item.resourceId == payload) {
					newState = newState.setIn(['entrustOrderUndispatch','list'],newState.getIn(['entrustOrderUndispatch','list']).delete(index))
				}
			})
			return newState
		case ActionTypes.ACTION_REMOVE_OVERTIME_ORDER_FROM_LIST:
			const unConfirmList = newState.getIn(['entrustOrderUnconfirmed','list'])
			const total = parseInt(newState.getIn(['entrustOrderUnconfirmed','total']))
			unConfirmList.map((item,index)=>{
				if (item.resourceId == payload) {
					newState = newState.setIn(['entrustOrderUnconfirmed','hasMore'], unConfirmList.size != total)
					newState = newState.setIn(['entrustOrderUnconfirmed','list'],newState.getIn(['entrustOrderUnconfirmed','list']).delete(index))
					newState = newState.setIn(['entrustOrderUnconfirmed','total'],total -1)
				}
			})
			return newState
		default:
			return newState;
	}
};