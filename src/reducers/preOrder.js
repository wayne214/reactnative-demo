import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import HelperUtil from '../utils/helper.js'

const initState = Immutable.fromJS({
	ordering: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1
	},
	orderSuccess: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1
	},
	orderFailed: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1
	},
	bidding: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1
	},
	biddingSuccess: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1
	},
	biddingFailed: {
		list:[],
		total: 0,
		isLoadingMore: false,
		hasMore: true,
		pageNo: 1
	},
})

export default (state = initState, action) => {
	let newState = state;
	const payload = action.payload
	switch (action.type) {
		case ActionTypes.ACTION_RECEIVE_PRE_ORDER_LIST:
			const typeArr = [['bidding','biddingSuccess','biddingFailed'],['ordering','orderSuccess','orderFailed']]
			let rootType = typeArr[parseInt(payload.type)-1][parseInt(payload.state)-1]
			console.log(" ------ rootType is ",rootType);

			newState = newState.setIn([rootType,'pageNo'],payload.pageNo);
			newState = newState.setIn([rootType,'isLoadingMore'],false);
			newState = newState.setIn([rootType,'total'],payload.total);
			if (payload.pageNo === 1) {
			  newState = newState.setIn([rootType,'list'],Immutable.fromJS([]));
			}
			if (payload.list) {
				const newArr = payload.list.map((item)=>{
					item.from = item.fromProvinceName == item.fromCityName ? `${item.fromProvinceName}${item.fromAreaName}` : `${item.fromProvinceName}${item.fromCityName}${item.fromAreaName}`
					item.to = item.toProvinceName == item.toCityName ? `${item.toProvinceName}${item.toAreaName}` : `${item.toProvinceName}${item.toCityName}${item.toAreaName}`
					item.isBetter = payload.type == 1 // 1竞价  2 抢单
					item.state = payload.state
					console.log("=------- new item",item);
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
		default:
			return newState;
	}
}
