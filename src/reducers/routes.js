import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import { PAGE_SIZE } from '../constants/setting';

const initState = Immutable.fromJS({

	isRefreshAddRoute: false,
	isRefreshDeleteRoute: false,
});

export default (state = initState, action) => {
	let newState = state;
	switch (action.type) {
		case ActionTypes.ACTION_CHANGE_TAB:
		return newState;

		case ActionTypes.ACTION_ROUTE_LIST:
			newState = newState.set('routeList', action.payload.data);
			newState = newState.set('isRefreshAddRoute', false);
			newState = newState.set('isRefreshDeleteRoute', false);
			return newState;

		case ActionTypes.ACTION_REFRESH_ADD_ROUTE:
			newState = newState.set('isRefreshAddRoute', true);
			return newState;

		case ActionTypes.ACTION_REFRESH_DELETE_ROUTE:
			newState = newState.set('isRefreshDeleteRoute', true);
			return newState;

		case ActionTypes.ACTION_CLEAR_ROUTE_INFO:
			return newState;

		default:
			return newState;
	}
};

