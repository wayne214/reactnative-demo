import * as ActionTypes from '../constants/actionType';

export function dispatchGetAuthInfo(params) {
	return {
		type: ActionTypes.GET_COMPANY_AUTH_FETAIL,
		payload: params
	}
}

export function receiveUserInfo() {
	return {
		type: ActionTypes.ACTION_USER_INFO
	}
}
