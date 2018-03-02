import * as ActionTypes from '../constants/actionType';

export function dispatchGetESignInfo(params) {
	return {
		type: ActionTypes.ACTION_GET_ESIGN_INTO,
		payload: params
	};
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

export function dispatchRefreshHorizontalText(params){
    return{
        type: ActionTypes.ACTION_SET_HORIZONTAL_TEXT,
        payload: params
    };
}

export function dispatchRefreshLastQuarterText(params){
    return{
        type: ActionTypes.ACTION_SET_LAST_QUARTER_TEXT,
        payload: params
    };
}