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