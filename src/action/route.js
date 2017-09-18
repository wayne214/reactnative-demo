import * as ActionTypes from '../constants/actionType';

export function dispatchRouteList(params) {
	return {
		type: ActionTypes.ACTION_ROUTE_LIST,
		payload: params
	};
}

export function dispatchRefreshAddRoute() {
	return {
		type: ActionTypes.ACTION_REFRESH_ADD_ROUTE
	};
}

export function dispatchRefreshDeleteRoute() {
	return {
		type: ActionTypes.ACTION_REFRESH_DELETE_ROUTE
	};
}

export function dispatchClearRouteInfo(){
	return{
		type: ActionTypes.ACTION_CLEAR_ROUTE_INFO
	};
}

export function getCarLength(){
	return{
		type: ActionTypes.ACTION_GET_CARLENGTH
	};
}

export function checkedOneOfDatas(index){
	return{
		type: ActionTypes.CARLENGTH_SELECT_ONE_OF_DATAS,
		payload: index
	}
}

export function selectedCarLength(params){
	return{
		type: ActionTypes.ACTION_SELECTED_CARLENGTH,
		payload: params
	}
}