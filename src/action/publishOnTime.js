import * as ActionTypes from '../constants/actionType';

export function dispatchRouteList(params){
	return {
		type: ActionTypes.ACTION_GET_PUBLISH_ONTIME_ROUTE,
		payload: params
	};
} 

export function dispatchDayList(params){
	return{
		type: ActionTypes.ACTION_GET_PUBLISH_ONTIME_DETAIL,
		payload: params
	}
}

export function dispatchTimeList(params){
	return{
		type: ActionTypes.ACTION_GET_START_TIME,
		payload:params
	}
}

export function dispatchGetFrightMoney(params){
	return{
		type: ActionTypes.ACTION_GET_FRIGHT_MONEY,
		payload: params
	}
}

export function dispatchClearFrightMoney(params){
	return{
		type: ActionTypes.ACTION_CLEAR_MONEY,
		payload: params
	}
}

export function dispatchGetCaBanId(params){
	return{
		type: ActionTypes.ACTION_ISCABANID,
		payload: params
	}
}

export function dispatchGetCaBanStartDate(params){
	return{
		type: ActionTypes.ACTION_ISSTARTDATE,
		payload: params
	}
}

export function dispatchGetMsg(params){
	return{
		type: ActionTypes.ACTION_GET_MSG,
		payload: params
	}
}
