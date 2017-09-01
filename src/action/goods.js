import * as ActionTypes from '../constants/actionType';

export const receiveGoodsList = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_GOODS_LIST,
		payload: data
	}
}

export const receiveBetterGoodsList = (data) =>{
	return {
		type: ActionTypes.ACTION_RECEIVE_BETTER_GOODS_LIST,
		payload: data
	}
}

export const receiveGoodsDetail = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_GOODS_DETAIL,
		payload: data
	}
}

export const changeGoodsListLoadingMore = (type) => {
	return {
		type: ActionTypes.ACTION_CHANGE_GOODS_LIST_LOADING_MORE,
		payload: type
	}
}

export const betterGoodsSourceEndCount = (id) => {
	return {
		type: ActionTypes.ACTION_GOODS_SOURCE_END_COUNT,
		payload: id
	}
}