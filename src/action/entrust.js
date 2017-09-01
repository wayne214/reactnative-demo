import * as ActionTypes from '../constants/actionType';

export const getEntrustOrderList = (data) => {
	return {
		type: ActionTypes.ACTION_GET_ENTRUST_ORDER_LIST,
		payload: data
	}
}

export const getFreeCarList = (data) => {
	return {
		type: ActionTypes.ACTION_GET_FREE_CAR_LIST,
		payload: data
	}
}

export const receiveEntrustOrderDetail = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_ENTRUST_ORDER_DETAIL,
		payload: data
	}
}

export const receiveTransportConfirmOrderDetail = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_ENTRUST_ORDER_DETAIL_TRANSPORTCONFIRM,
		payload: data
	}
}

export const changeEntrustOrderListLoadingMore = (entrustOrderType) => {
	// 0 待确认，  1待调度
	return {
		type: ActionTypes.ACTION_CHANGE_ENTRUST_ORDER_LIST_LOADING_MORE,
		payload: entrustOrderType
	}
}

export const acceptDesignateWithID = (goodsId) => {
	return {
		type: ActionTypes.ACTION_ACCEPT_DESIGNATE_WITH_ID,
		payload: goodsId
	}
}

export const deleteUndispatchAndCancelledOrder = (id) => {
	return {
		type: ActionTypes.ACTION_DELETE_UNDISPATCH_CANCELLED_ORDER,
		payload: id
	}
}

export const removeOverTimeOrderFromList = (resourceId) => {
	return {
		type: ActionTypes.ACTION_REMOVE_OVERTIME_ORDER_FROM_LIST,
		payload: resourceId
	}
}