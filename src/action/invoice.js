import * as ActionTypes from '../constants/actionType';

export function dispatchGetInvoiceInfo(params){
	return {
		type: ActionTypes.ACTION_GET_INVOICE_DETAIL,
		payload: params
	};
} 

export function dispatchClearData(){
	return{
		type: ActionTypes.ACTION_CLEAR_DATA,
	}
}