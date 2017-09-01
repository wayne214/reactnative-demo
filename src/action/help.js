import * as ActionTypes from '../constants/actionType';

export function dispatchGetFeedBackList(params) {
	return {
		type: ActionTypes.ACTION_GET_FEEDBACK_LIST,
		payload: params
	};
}

export function dispatchGetProblemList(params) {
	return {
		type: ActionTypes.ACTION_GET_PROBLEM_LIST,
		payload: params
	};
}

export function dispatchGetProblemDetails(params){
	return {
		type: ActionTypes.ACTION_GET_PROBLEM_DETAILS,
		payload: params
	};
}

export function dispatchGetFeedbackDetails(params){
	return {
		type: ActionTypes.ACTION_GET_FEEDBACL_DETAILS,
		payload: params
	};
}
export function dispatchUpdateFeedbackList(){
	return {
		type: ActionTypes.ACTION_UPDATE_FEEDBACK_LIST,
	};
}
