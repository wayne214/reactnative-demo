import * as ActionTypes from '../constants/actionType';

export function dispatchSelectDrivers(params) {
	return {
		type: ActionTypes.ACTION_SELECT_DRIVER,
		payload: params
	};
}

export function dispatchRefreshDriver() {
	return {
		type: ActionTypes.ACTION_REFRESH_DRIVER
	};
}

export function dispatchRefreshDriverInfo(params){
	return{
		type: ActionTypes.ACTION_REFRESH_DRIVER_INFO,
		payload: params
	}
}

export function dispatchClearDriverInfo(){
	return{
		type: ActionTypes.ACTION_CLEAR_DRIVER_INFO,
	}
}

export function dispatchGetDriverInfo(params){
	return{
		type: ActionTypes.ACTION_GET_DRIVER_INFO,
		payload: params
	}
}

export function dispatchGetDriverInfoDetail(params){
	return{
		type: ActionTypes.ACTION_DRIVER_INFO_DETAIL,
		payload: params
	}
}



