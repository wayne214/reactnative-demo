import * as ActionTypes from '../constants/actionType';

export function dispatchGetAuthInfo(params){
	return {
		type: ActionTypes.ACTION_GET_AUTHINFO_DETAIL,
		payload: params
	};
} 

export function dispatchGetPersonalAuthInfo(params){
	return{
		type: ActionTypes.ACTION_GET_PERSONAL_AUTHINFO_DETAIL,
		payload :params
	}
}

export function dispatchCompanyList(params){
	return{
		type: ActionTypes.ACTION_COMPANY,
		payload: params
	};
}

export function dispatchBargainList(params){
	return{
		type: ActionTypes.ACTION_BARGAIN_LIST ,
		payload:params
	};
}   

export function dispatchGetCarrierDetail(params){
	return{
		type: ActionTypes.ACTION_CARRIER_DETAIL,
		payload: params
	}
}

export function dispatchCombineStatus(params){
	return{
		type: ActionTypes.ACTION_COMBINE_STATUS,
		payload: params
	}
}

export function dispatchClearAuthInfo(params){
	return{
		type: ActionTypes.ACTION_CLEAR_AUTH_INFO,
		payload: params
	}
}