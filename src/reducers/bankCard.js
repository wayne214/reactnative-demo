import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import { PAGE_SIZE } from '../constants/setting';

const initState = Immutable.fromJS({
	bankCard: {
		bankCardManagerList: [],
		bankCardDetail: {}
	},
	hasMore: true,
	isEndReached: false,
	isRefresh: false,
});

export default (state = initState, action) => {
	let newState = state;
	let tempBankCardList = [];
	let carListForOrder = [];
	switch(action.type) {
		case ActionTypes.ACTION_SELECT_BANK_CARD_LIST:
			if (action.payload.pageNo !== 1) {
				tempBankCardList = state.getIn(['bankCard', 'bankCardManagerList']);
			}			
			console.log('lqq---action.payload.data-',action.payload.data);

			tempBankCardList = tempBankCardList.concat(action.payload.data);
			// action.payload.data.list.forEach(car => {
			// 	tempBankCardList.push(new Car({
					
			// 		carrierId: car.carrierId,
			// 		phoneNumber: car.phoneNumber,
			// 		certificationStatus: parseInt(car.certificationStatus)
			// 	}));
			// });
			// 重置标识位
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefresh', false);
			newState = newState.set('hasMore', true);
			console.log('lqq---tempBankCardList-',tempBankCardList);
			if (action.payload.data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			newState = newState.setIn(['bankCard', 'bankCardManagerList'],tempBankCardList);
			return newState;
		case ActionTypes.ACTION_REFRESH_BANK_CARD:
			newState = newState.set('isRefresh', true);
			return newState;
		case ActionTypes.ACTION_SELECT_BANK_CARD_BY_ID:
			console.log('lqq--re-action.payload.data-',action.payload.data);
			let bankCard = action.payload.data;
			console.log('lqq--re-bankCard-',bankCard);

			newState = newState.setIn(['bankCard','bankCardDetail'],bankCard);
			return newState;
		default:
			return state;
	}
}