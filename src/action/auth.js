import * as ActionTypes from '../constants/actionType';

export function dispatchGetAuthInfo(params) {
	return {
		type: ActionTypes.GET_COMPANY_AUTH_FETAIL,
		payload: params
	}
}
export function dispatchGetPersonAuthInfo(params) {
	return {
		type: ActionTypes.GET_PERSON_AUTH_DETAIL,
		payload: params
	}
}

export function receiveUserInfo(data) {
	return {
		type: ActionTypes.ACTION_USER_INFO,
		payload: data
	}
}

export function dispatchRefreshESignTemplateInfo(params) {
	return {
		type: ActionTypes.ACTION_REFRESH_ESIGN_TEMPLATE_INFO,
		payload: params
	};
}

export function dispatchRefreshESignColorInfo(params){
	return{
		type: ActionTypes.ACTION_REFRESH_ESIGN_COLOR_INFO,
		payload: params
	};
}
