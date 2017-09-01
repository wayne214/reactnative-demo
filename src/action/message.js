import * as ActionTypes from '../constants/actionType';

export function passWebMessage(params) {
	return {
		type: ActionTypes.ACTION_MESSAGE_LIST,
		payload: params
	}
}

export function checkedOneOfDatas(index) {
	return {
		type: ActionTypes.MSG_SELECT_ONE_OF_DATAS,
		payload: index
	}
}

export function isCheckedAll(flag) {
	return {
		type: ActionTypes.MESSAGE_CHECKED_ALL,
		payload: flag
	}
}

export function dispatchRefreshMessageList() {
	return {
		type: ActionTypes.ACTION_REFRESH_MESSAGE_LIST
	}
}

export function dispatchRefreshCheckBox(params){
	return{
		type: ActionTypes.ACTION_CHECKBOX,
		payload: params
	}
}

export function dispatchClearAllSeclected(params) {
	return{
		type: ActionTypes.ACTION_CLEAR_ALL_SELECT,
		payload: params
	}
}

export function passMsgDetail(params) {
	return {
		type: ActionTypes.ACTION_MSG_DETAIL,
		payload: params
	}
}