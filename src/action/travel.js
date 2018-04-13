import * as ActionTypes from '../constants/actionType';

export function dispatchDravelList(data) {
	return {
		type: ActionTypes.ACTION_TRAVEL_DATA,
		payload: data
	};
}

export function dispatchDefaultCar(params) {
	return {
		type: ActionTypes.ACTION_ROUTE_DEFAULT_CAR,
		payload: params
	}
}

export function travelInfoDone() {
	return {
		type: ActionTypes.ACTION_TRAVEL_DONE
	}
}

export function getTravelCarList(data) {
    return {
        type: ActionTypes.ACTION_GET_CAR_TRAVER_LIST,
        payload: data
    };
}

export function refreshTravelCarList(data) {
    return {
        type: ActionTypes.ACTION_REFRESH_CAR_TRAVER_LIST,
        payload: data
    };
}

export function queryTrasportCarList(data) {
    return {
        type: ActionTypes.ACTION_QUERY_TRANSPORT_LIST,
        payload: data
    };
}