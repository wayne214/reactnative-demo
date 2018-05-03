import * as ActionTypes from '../constants/actionType'

export const receiveOrderList = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_ORDER_LIST,
		payload: data
	}
}

export const receiveOrderDetail = (data) => {
	return {
		type: ActionTypes.ACTION_RECEIVE_ORDER_DETAIL,
		payload: data
	}
}

export const changeOrderLoadingMoreState = (orderState) => {
	return {
		type: ActionTypes.ACTION_CHANGE_ORDER_LOADINGMORE,
		payload: orderState
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

export const setAllUnPaySelected = (shouleSelectAll) => {
	return {
		type: ActionTypes.ACTION_SET_ALL_UNPAY_SELECTED_OR_NOT,
		payload: shouleSelectAll
	}
}

export const setAllUnPayEditing = (isEditing) =>{
	return {
		type: ActionTypes.ACTION_SET_UNPAY_ORDER_BATCH_EDITING,
		payload: isEditing
	}
}

export const changeSelectStateWithOrderNo = (orderNo) => {
	return {
		type: ActionTypes.ACTION_CHANGE_SELECT_STATE_IN_UNPAY_ORDER,
		payload: orderNo
	}
}

export const receiveClearDetail = (clearDetail)=>{
	return {
		type: ActionTypes.ACTION_RECEIVE_CLEAR_DETAIL,
		payload: clearDetail
	}
}

export const changeOrderTopTab = (tabIndex,subTabIndex) => {
	return {
		type: ActionTypes.ACTION_CHANGE_ORDER_TOP_TAB,
		payload: {
			tabIndex,
			subTabIndex
		}
	}
}
export const configBillOutImage = (orderNo,imagesString) =>{
	return {
		type: ActionTypes.ACTION_CONFIG_BILL_OUT_IMAGE_FOR_ORDER,
		payload: {
			orderNo,
			imagesString
		}
	}
}

export const shouldOrderListRefreshAction = (shouldOrNot) =>{
	return {
		type: ActionTypes.ACTION_SHOULE_ORDER_LIST_REFRESH,
		payload: shouldOrNot
	}
}

export const changeOrderListIsRefreshing = (orderState,showLoading) => {
	return {
		type: ActionTypes.ACTION_CHANGE_ORDER_LIST_REFRESHING,
		payload: {
        orderType,showLoading
		}
	}
}

export const changeOrderurgedWithOrderNo = (orderNo) => {
	return {
		type: ActionTypes.ACTION_CHANGE_ORDER_URGED_WITH_ORDER_NO,
		payload: {
			orderNo
		}
	}
}

export const getHistoryOrderList = (data) => {
    return {
        type: ActionTypes.ACTION_ORDER_HISTORY_LIST,
        payload: data
    }
}