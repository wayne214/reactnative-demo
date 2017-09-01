import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({
	travelDetail: {},
	carPayLoad: {},
	payload: {},
	isNeedRefreshTravel: false,	
});

export default (state = initState, action) => {
	let newState = state;
	switch (action.type) {
		case ActionTypes.ACTION_TRAVEL_DATA:
			// newState = newState.set('carPayLoad', {});
			newState = newState.set('isNeedRefreshTravel', false);
			newState = newState.set('travelDetail', action.payload);
			return newState;
		case ActionTypes.ACTION_ROUTE_DEFAULT_CAR:
			newState = newState.set('isNeedRefreshTravel', false);
			newState = newState.set('payload', action.payload);
			newState = newState.set('carPayLoad', action.payload);
			return newState;
		case ActionTypes.ACTION_REFRESH_TRAVEL:
			newState = newState.set('isNeedRefreshTravel', true);
			return newState;			
		case ActionTypes.ACTION_CHANGE_TAB:
			if (action.payload === 'route') newState = newState.set('isNeedRefreshTravel', true);
			return newState;
		default:
			return newState;
	}
};