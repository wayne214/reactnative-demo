import * as ActionTypes from '../constants/actionType';

export const receivePreOrderList = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_PRE_ORDER_LIST,
		payload: data
	}
}