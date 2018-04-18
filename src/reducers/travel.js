import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';

const initState = Immutable.fromJS({
	travelDetail: {},
	carPayLoad: {},
	payload: {},
	isNeedRefreshTravel: false,
	travelCarListData:{
			list:[],
			total: 0,
			hasMore: false,
			pageNum: 0,//默认值0 使用时 +1
			isLoadingMore: false,
			isRefreshing: false
	},
		freeCarListData: {
        list:[],
        total: 0,
        hasMore: false,
        pageNum: 0,//默认值0 使用时 +1
        isLoadingMore: false,
        isRefreshing: false
		},
    transportListData:'',
});

export default (state = initState, action) => {
	let newState = state;
  const payload = action.payload
    let newArray = [];
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
		case ActionTypes.ACTION_TRAVEL_DONE:
			newState = newState.set('isNeedRefreshTravel', false);
			return newState
		case ActionTypes.ACTION_GET_CAR_TRAVER_LIST:

		    console.log('payload', payload)
        let rootType = '';
        switch (payload.carType) {
            case 0:
                rootType = 'travelCarListData';
                break;
            case 1:
                rootType = 'freeCarListData';
                break;
        }
        newState = newState.setIn([rootType,'isLoadingMore'],false);
        newState = newState.setIn([rootType,'isRefreshing'],false);
        newState = newState.setIn([rootType,'hasMore'],payload.pageNum < payload.pages ? true : false);
        newState = newState.setIn([rootType,'pageNum'],payload.pageNum);
        newState = newState.setIn([rootType,'total'],payload.total);
        if(payload.pageNum === 0) {
            newState = newState.setIn([rootType,'list'], []);
            newState = newState.setIn([rootType,'list'], Immutable.fromJS(payload.list));
        } else if (payload.pageNum === 1) {
            // 第一页数据先清空原有数据
            newState = newState.setIn([rootType,'list'],[]);
            newArray = Immutable.fromJS(payload.list);
            newState = newState.setIn([rootType,'list'], newArray);
        }else {
            newArray = newState.getIn([rootType,'list']);
            newArray = newArray.concat(payload.list);
            newState = newState.setIn([rootType,'list'],Immutable.fromJS(newArray));
        }
				return newState
      case ActionTypes.ACTION_REFRESH_CAR_TRAVER_LIST:
          newState = newState.setIn(['carListData', 'isRefreshing'], true);
          return newState
      case ActionTypes.ACTION_QUERY_TRANSPORT_LIST:
          newState = newState.setIn('transportListData', payload);
          return newState
		default:
			return newState;
	}
};