import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import { PAGE_SIZE } from '../constants/setting';

const initState = Immutable.fromJS({
	driver: {
		selectDriverList: [],
		driverManagerList: [],
				
	},
	hasMore: true,
	isEndReached: false,
	isRefreshDriver: false,
	isRefreshDriverInfo: false,
	isClearDriverInfo: false,
	selectDriverInfo : {},
	selectDriverInfoByPhone: {},
	getDriverInfoFrom:0,
	driverInfoDetail: {},
});

export default (state = initState, action) => {
	let newState = state;
	let tmpSelectDriverList = [];
	switch(action.type) {
		case ActionTypes.ACTION_SELECT_DRIVER:
			if (action.payload.pageNo !== 1) {
				tmpSelectDriverList = state.getIn(['driver', 'selectDriverList']).toArray();
			}
			tmpSelectDriverList = tmpSelectDriverList.concat(action.payload.data.list);
			// 重置标识位
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefreshDriver', false);
			newState = newState.set('isRefreshDriverInfo', false);
			newState = newState.set('isClearDriverInfo', false);
			newState = newState.set('hasMore', true);
			if (action.payload.data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			newState = newState.setIn(['driver', 'selectDriverList'], Immutable.fromJS(tmpSelectDriverList));
			return newState;
		case ActionTypes.ACTION_REFRESH_DRIVER:
			newState = newState.set('isRefreshDriver', true);
			return newState;

		case ActionTypes.ACTION_REFRESH_DRIVER_INFO:
			newState = newState.set('isRefreshDriverInfo', true);
			newState = newState.set('selectDriverInfo',action.payload.data);
			newState = newState.set('getDriverInfoFrom',1);
			return newState;

		case ActionTypes.ACTION_GET_DRIVER_INFO:
			newState = newState.set('isRefreshDriverInfo', true);
			newState = newState.set('selectDriverInfoByPhone',action.payload.data);
			newState = newState.set('getDriverInfoFrom',2);
			return newState;

		case ActionTypes.ACTION_CLEAR_DRIVER_INFO:
			newState = newState.set ('isClearDriverInfo', true);
			newState = newState.set ('selectDriverInfo', '');
			newState = newState.set('selectDriverInfoByPhone', '');
			newState = newState.set('getDriverInfoFrom',0);
			return newState;

		case ActionTypes.ACTION_DRIVER_INFO_DETAIL:
			let driverInfo = action.payload;
			newState = newState.set('driverInfoDetail',driverInfo);
			return newState;

		default:
			return state;
	}
}