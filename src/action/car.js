import * as ActionTypes from '../constants/actionType';

export function dispatchCarBindDriverDatas(params) {
	return {
		type: ActionTypes.ACTION_DISPATCH_CARBIND_DRIVER,
		payload: params
	};
}

export function dispatchRefreshCar() {
	return {
		type: ActionTypes.ACTION_REFRESH_CAR
	};
}

export function dispatchSelectCars(params) {
	return {
		type: ActionTypes.ACTION_SELECT_CAR,
		payload: params
	};
}

export function dispatchGetCarInfo(params){
	return {
		type: ActionTypes.ACTION_GET_CAR_INTO,
		payload: params
	};
}

export function dispatchCarsForOrderWork(data) {
	return {
		type: ActionTypes.ACTION_CARS_ORDER_WORK,
		payload: data
	}
}
