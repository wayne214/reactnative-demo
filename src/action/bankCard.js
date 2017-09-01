import * as ActionTypes from '../constants/actionType';

export function dispatchBankCardList(params) {
	return {
		type: ActionTypes.ACTION_SELECT_BANK_CARD_LIST,
		payload: params
	};
}
export function dispatchBankCardById(params) {
	return {
		type: ActionTypes.ACTION_SELECT_BANK_CARD_BY_ID,
		payload: params
	};
}

export function dispatchRefreshBankCard() {
	return {
		type: ActionTypes.ACTION_REFRESH_BANK_CARD
	};
}