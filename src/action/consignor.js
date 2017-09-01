import * as ActionTypes from '../constants/actionType';


export function consignorData(data) {
	return {
		type: ActionTypes.ACTION_RECIEVE_CONSIGNO,
		payload: data
	}
}

export function refreshConsignor() {
	return {
		type: ActionTypes.ACTION_REFRESH_CONSIGNOR,
	}
}

export function refreshShipper() {
	return {
		type: ActionTypes.ACTION_SHIPPER_REFRESH,
	}
}

export function refreshConsignorDetail() {
	return {
		type: ActionTypes.ACTION_CONSIGNOR_DETAIL_REFRESH,
	}
}

export function goodsResourceDetail(data) {
	return {
		type: ActionTypes.ACTION_GOODS_RESOURCE_DETAIL,
		payload: data
	}
}

export function cleanResourceDetail() {
	return {
		type: ActionTypes.ACTION_CLEAN_RESOURCE_DETAIL
	}
}

export function shipperList(data) {
	return {
		type: ActionTypes.ACTION_SHIPPER_LIST,
		payload: data
	}
}

export function consignorReset() {
	return {
		type: ActionTypes.RESET_HAS_MORE_CONSIGNRO
	}
}