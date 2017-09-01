import * as ActionTypes from '../constants/actionType'

export const receiveOrderList = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_ORDER_LIST,
		payload: data
	}
}
export const changeOrderTopTab = (tabIndex) => {
	return {
		type: ActionTypes.ACTION_CHANGE_ORDER_TOP_TAB,
		payload: {
			tabIndex
		}
	}
}

export const receiveOrderDetail = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_ORDER_DETAIL,
		payload: data
	}
}

export const changeOrderToStateWithOrderNo = (toState,orderNo,orderTopType)=>{
	return {
		type: ActionTypes.ACTION_ORDER_TO_STATE_WITH_ORDERNO,
		payload: {
			toState,
			targetOrderNo: orderNo,
			orderTopType
		}
	}
}

export const shouldOrderListRefreshAction = (shouldOrNot) =>{
	return {
		type: ActionTypes.ACTION_SHOULE_ORDER_LIST_REFRESH,
		payload: shouldOrNot
	}
}

export const receiveConfirmClearDetail = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_CONFIRM_CLEAR_DETAIL,
		payload: {data}
	}
}