import * as ActionTypes from '../constants/actionType';

export const receivePreOrderList = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_PRE_ORDER_LIST,
		payload: data
	}
}

export const changePreOrderListIsRefreshing = (type, state, refreshing) => {
	return {
		type: ActionTypes.ACTION_CHANGE_PRE_ORDER_LIST_REFRESHING,
		payload: {
			type,
			state,
			refreshing
		}
	}
}