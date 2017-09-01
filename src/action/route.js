import * as ActionTypes from '../constants/actionType';

export function dispatchRouteList(params){
	return {
		type: ActionTypes.ACTION_GET_CARRIER_ROUTE,
		payload: params
	};
} 