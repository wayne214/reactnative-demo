import * as ActionTypes from '../constants/actionType';

export function checkedOneOfDatas(index) {
	return {
		type: ActionTypes.MSG_SELECT_ONE_OF_DATAS,
		payload: index
	}
}

export function passMsgDetail(data) {
	return {
		type: ActionTypes.ACTION_SYSTEM_MSG_DETAIL,
		payload: data
	}
}

export function isCheckedAll(flag) {
	return {
		type: ActionTypes.MESSAGE_CHECKED_ALL,
		payload: flag
	}
}

export function updateMsgList() {
	return {
		type: ActionTypes.UPDATE_MSG_LIST,
	}
}

export function passSysMessage(params) {
	return {
		type: ActionTypes.ACTION_SYSTEM_MESSAGE,
		payload: params
	}
}

export function passWebMessage(params) {
	return {
		type: ActionTypes.ACTION_WEB_MSG_LIST,
		payload: params
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

export function refreshList(params) {
    return{
        type: ActionTypes.ACTION_CLEAR_ALL_MESSAGE,
        payload: params
    }
}