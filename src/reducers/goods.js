import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import HelperUtil from '../utils/helper.js'
import moment from 'moment'

const initState = Immutable.fromJS({
	goodsSource: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	betterGoodsSource: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1,
		isRefreshing: false
	},
	goodsDetail:{}
});

export default (state = initState, action) => {
	let newState = state;
	const payload = action.payload
	switch (action.type) {
		case ActionTypes.ACTION_CHANGE_GOODS_LIST_LOADING_MORE://2 优质（竞价）货源列表  3 普通（抢单）货源列表
			newState = newState.setIn([payload == 3 ? 'goodsSource' : 'betterGoodsSource','isLoadingMore'],true);
			return newState
		case ActionTypes.ACTION_CHANGE_GOODS_LIST_IS_REFRESHING:
			newState = newState.setIn([action.payload.goodsSourceype,'isRefreshing'],true);
			return newState
		case ActionTypes.ACTION_RECEIVE_GOODS_LIST:
			let rootType = 'goodsSource'
			if (payload.goodsType == 2) {
				rootType = 'betterGoodsSource'
			}else if (payload.goodsType == 3) {
				rootType = 'goodsSource'
			}
			newState = newState.setIn([rootType,'pageNo'],payload.pageNo);
			newState = newState.setIn([rootType,'isLoadingMore'],false);
			newState = newState.setIn([rootType,'isRefreshing'],false);
			newState = newState.setIn([rootType,'total'],payload.total);
			if (payload.pageNo === 1) {
			  newState = newState.setIn([rootType,'list'],Immutable.fromJS([]));
			}
			if (payload.list) {
				const newArr = payload.list.map((item,index)=>{
					// if (index == 0) {
					// 	item.overTime = '2017-06-20 20:08:20'
					// };

					item.isOverTime = Date.now() >= Date.parse(moment(item.overTime, 'YYYY-MM-DD HH:mm:ss').format())
					item.from = item.fromProvinceName == item.fromCityName ? `${item.fromProvinceName}${item.fromAreaName}` : `${item.fromProvinceName}${item.fromCityName}${item.fromAreaName}`
					item.to = item.toProvinceName == item.toCityName ? `${item.toProvinceName}${item.toAreaName}` : `${item.toProvinceName}${item.toCityName}${item.toAreaName}`
					item.isBetter = payload.goodsType == 2
					item.goodsNameStr = HelperUtil.getGoodsName(item.cargoType)
					item.goodsSKU = (item.cargoSpecTon ? (item.cargoSpecTon + '吨') : '') + (item.cargoSpecTon && item.cargoSpecSquare ? '/' : '') + (item.cargoSpecSquare ? (item.cargoSpecSquare + '方') : '')
					item.carLength = HelperUtil.getCarLength(parseInt(item.vehicleType))
					// item.offerCount = 1
					// item.offerPrice = 10
					if (item.goodsType == 1) {
						item.goodsTypeStr = '干线'
						const startDate = item.loadingStartDate.split(' ')[0]
						// const endDate = item.loadingEndDate.split(' ')[0]
						item.installDate = `${startDate}`
					}else if(item.goodsType == 2){
						item.goodsTypeStr = '卡班'
						item.installDate = item.startDate
					}
					return item
				})
				newState = newState.setIn([rootType,'list'],newState.getIn([rootType,'list']).concat(newArr));
			};
			if (newState.getIn([rootType,'list']).size < payload.total) {
				newState = newState.setIn([rootType,'hasMore'],true)
			}else{
				newState = newState.setIn([rootType,'hasMore'],false)
			}
			return newState;
		case ActionTypes.ACTION_RECEIVE_GOODS_DETAIL:
			if (payload) {

				payload.goodsInfoData = {
					from: payload.fromProvinceName + (payload.fromCityName == payload.fromProvinceName ? '' : payload.fromCityName) + payload.fromAreaName,
					to: payload.toProvinceName + (payload.toCityName == payload.toProvinceName ? '' : payload.toCityName) + payload.toAreaName,
					goodsNameStr: HelperUtil.getGoodsName(payload.cargoType),
					goodsSKU: (payload.cargoSpecTon ? (payload.cargoSpecTon + '吨') : '') + (payload.cargoSpecTon && payload.cargoSpecSquare ? '/' : '') + (payload.cargoSpecSquare ? (payload.cargoSpecSquare + '方') : ''),
					carLength: HelperUtil.getCarLength(parseInt(payload.vehicleType)),
					remark: payload.remark,
					temperatureStr: HelperUtil.getTemperature(payload.temperature,payload.temperatureMin,payload.temperatureMax),
					goodsType: payload.goodsType
				}
				console.log("========= payload ",payload.goodsInfoData.temperatureStr);
				if (payload.goodsType == 1) {
					payload.goodsTypeStr = '干线'
					payload.goodsInfoData.installDate = payload.loadingStartDate.split(' ')[0]//`从${payload.loadingStartDate.split(' ')[0]}到${payload.loadingEndDate.split(' ')[0]}`
					payload.goodsInfoData.arrivalDate = payload.arrivalStartDate.split(' ')[0]//`从${payload.arrivalStartDate.split(' ')[0]}到${payload.arrivalEndDate.split(' ')[0]}`
				}else if(payload.goodsType == 2){
					payload.goodsTypeStr = '卡班'
					payload.goodsInfoData.installDate = payload.startDate
					payload.goodsInfoData.carBanDate = `${payload.startDate.split(' ')[0]} ${payload.startTimeHourMin}:${payload.startTimeMinuteMin}`//`${payload.startDate.split(' ')[0]} ${payload.startTimeHourMin}:${payload.startTimeMinuteMin}-${payload.startTimeHourMax}:${payload.startTimeMinuteMax}`
				}
			};

			newState = newState.set('goodsDetail',payload)
			return newState
		case ActionTypes.ACTION_GOODS_SOURCE_END_COUNT:
			const newList = newState.getIn(['betterGoodsSource','list']).map((item,index)=>{
				if (item.resourceId == payload) {
					item.isOverTime = true
				}
				return item
			})
			newState = newState.setIn(['betterGoodsSource','list'],newList)
			return newState
		default:
			return newState;
	}
};