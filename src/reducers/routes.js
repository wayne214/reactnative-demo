import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import { PAGE_SIZE } from '../constants/setting';
import { CAR_VEHICLE } from '../constants/json';
import CarLength from '../models/carLength';

const initState = Immutable.fromJS({
	carLength: {
		carLengthIds:[],
		carLengths:[],
	},
	routeList:[],
	isRefreshAddRoute: false,
	isRefreshDeleteRoute: false,
});

export default (state = initState, action) => {
	let newState = state;
	switch (action.type) {
		case ActionTypes.ACTION_CHANGE_TAB:
		return newState;

		case ActionTypes.ACTION_ROUTE_LIST:
			newState = newState.set('routeList', action.payload.data.list);
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
		 	newState = newState.setIn(['carLength', 'carLengthIds'], Immutable.fromJS([]));
			return newState;

		case ActionTypes.ACTION_GET_CARLENGTH:
			let carLengthArr = [];
			CAR_VEHICLE.map(item => {
				carLengthArr.push(new CarLength({
					key: item.key,
					value: item.value,
					type: item.type,
					isChecked: false,
				}));
			});
			newState = newState.setIn(['carLength', 'carLengths'],Immutable.fromJS(carLengthArr));
			return newState;

		case ActionTypes.CARLENGTH_SELECT_ONE_OF_DATAS:
			const newLengthArr = [];
			let _ids = [];
 			state.getIn(['carLength', 'carLengths']).map((item, index) => {
 				if (parseInt(action.payload) === index) {
 					if (!item.isChecked) {
 						_ids.push(item.key);
 						newLengthArr.push(new CarLength({
							key: item.key,
							value: item.value,
							type: item.type,
							isChecked: true,
						}));
 					}else if (item.isChecked) {
 						newLengthArr.push(new CarLength({
							key: item.key,
							value: item.value,
							type: item.type,
							isChecked: false,
						}));
 					}
 				} else {
 					newLengthArr.push(new CarLength({
							key: item.key,
							value: item.value,
							type: item.type,
							isChecked: item.isChecked ,
						}));
 					if(item.isChecked){
 						_ids.push(item.key);
 					}
 				}
 				
 			});
 			newState = newState.setIn(['carLength', 'carLengthIds'], Immutable.fromJS(_ids));
 			newState = newState.setIn(['carLength', 'carLengths'],Immutable.fromJS(newLengthArr));
			return newState;

		case ActionTypes.ACTION_SELECTED_CARLENGTH:
			let selectedCarLengthArr = [];
			let _carIds = [];
			let carLength = action.payload.split(",");
			function contains(carLength, index){
				let i = carLength.length;
				while (i--) { 
					if(carLength[i]+'米' === index){
						return true;
					}
				}
				return false;
			}
			CAR_VEHICLE.map(item => {
				let flag = contains(carLength,item.value);
				if(flag){
					_carIds.push(item.key);
				}
				selectedCarLengthArr.push(new CarLength({
					key: item.key,
					value: item.value,
					type: item.type,
					isChecked: flag 
				}));
			});
			newState = newState.setIn(['carLength', 'carLengthIds'],Immutable.fromJS(_carIds));
			newState = newState.setIn(['carLength', 'carLengths'],Immutable.fromJS(selectedCarLengthArr));
			return newState;

		default:
			return newState;
	}
};

