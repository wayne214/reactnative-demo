import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import Car from '../models/car';
import { PAGE_SIZE } from '../constants/setting';

const initState = Immutable.fromJS({
	car: {
		carManagerList: [],
		carbindDriverList: [],
		selectCarList: [],
		selectCarForOrderWorkList: [],
		carDetail: {}
	},
	hasMore: true,
	isEndReached: false,
	isRefreshCar: false,
});

export default (state = initState, action) => {
	let newState = state;
	let tmpCarDriverList = [];
	let carListForOrder = [];
	switch(action.type) {
		case ActionTypes.ACTION_DISPATCH_CARBIND_DRIVER:
			if (action.payload.pageNo !== 1) {
				tmpCarDriverList = state.getIn(['car', 'carbindDriverList']).toArray();
			}
			action.payload.data.list.forEach(car => {
				tmpCarDriverList.push(new Car({
					carNo: car.carNo,
					carId: car.id,
					driverName: car.driverName,
					carrierId: car.carrierId,
					driverId: car.driverId
				}));
			});
			const data = action.payload.data;
			// 重置标识位
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefreshCar', false);
			newState = newState.set('hasMore', true);
			if (data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			newState = newState.setIn(['car', 'carbindDriverList'], Immutable.fromJS(tmpCarDriverList));
			return newState;
		case ActionTypes.ACTION_SELECT_CAR:
			if (action.payload.pageNo !== 1) {
				tmpCarDriverList = state.getIn(['car', 'selectCarList']).toArray();
			}
			// tmpCarDriverList = tmpCarDriverList.concat(action.payload.data.list);
			action.payload.data.list.forEach(car => {
				tmpCarDriverList.push(new Car({
					carNo: car.carNo,
					gcarNo: car.gcarNo,
					carId: car.id,
					driverName: car.driverName,
					carrierId: car.carrierId,
					driverId: car.driverId,
					driverPhone: car.driverPhone,
					carType: parseInt(car.carType),
					carCategory: parseInt(car.carCategory),
					carState: parseInt(car.carState),
					carName: car.carName,
					carImageUrl: car.carImageUrl,
					drivingLicenseUrl: car.drivingLicenseUrl,
					operateLicenseUrl: car.operateLicenseUrl,
					gdrivingLicenseUrl: car.gdrivingLicenseUrl,
					goperateLicenseUrl: car.goperateLicenseUrl,
					phoneNumber: car.phoneNumber,
					certificationStatus: parseInt(car.certificationStatus)
				}));
			});
			// for( let i = 0 ; i <= 10; i++){
			// 	tmpCarDriverList.push(new Car({
			// 		carNo: 'car.carNo',
			// 		carId: 'car.id',
			// 		driverName: 'car.driverName',
			// 		carrierId: 'car.carrierId',
			// 		driverId: 'car.driverId',
			// 		carType: parseInt('car.carType'),
			// 		carCategory: parseInt('car.carCategory'),
			// 		carState: parseInt('car.carState'),
			// 		carName: 'car.carName',
			// 		carImageUrl: 'car.carImageUrl',
			// 		phoneNumber: 'car.phoneNumber'
			// 	}));
			// }
			// 重置标识位
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefreshCar', false);
			newState = newState.set('hasMore', true);
			if (action.payload.data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			newState = newState.setIn(['car', 'selectCarList'], Immutable.fromJS(tmpCarDriverList));
			return newState;
		case ActionTypes.ACTION_REFRESH_CAR:
			newState = newState.set('isRefreshCar', true);
			return newState;
		case ActionTypes.ACTION_GET_CAR_INTO:
			let car = action.payload.data;
			let carDetail = new Car({
					carNo: car.carNo,
					gcarNo: car.gcarNo,
					carId: car.id,
					driverName: car.driverName,
					carrierId: car.carrierId,
					driverId: car.driverId,
					carType: parseInt(car.carType),
					carCategory: parseInt(car.carCategory),
					carState: parseInt(car.carState),
					carName: car.carName,
					carImageUrl: car.carImageUrl,
					drivingLicenseUrl: car.drivingLicenseUrl,
					operateLicenseUrl: car.operateLicenseUrl,
					gdrivingLicenseUrl: car.gdrivingLicenseUrl,
					goperateLicenseUrl: car.goperateLicenseUrl,
					phoneNumber: car.phoneNumber,
					transportationLicense: car.transportationLicense,
					loadSize: car.loadSize ?  car.loadSize + '' : '',
					carLength: parseInt(car.carLength),
					driverNumber: car.driverNumber,
					driverPhone: car.driverPhone,
					scrapDate: car.scrapDate,
					volumeSize: car.volumeSize ? car.volumeSize + '' : ''
			});
			newState = newState.setIn(['car','carDetail'],Immutable.fromJS(carDetail));
			return newState;
		case ActionTypes.ACTION_CARS_ORDER_WORK:
			if (action.payload.pageNo !== 1) {
				carListForOrder = state.getIn(['car', 'selectCarForOrderWorkList']).toArray();
			}
			const _data = action.payload.data;
			carListForOrder = carListForOrder.concat(_data.list);
			newState = newState.set('isEndReached', false);
			newState = newState.set('hasMore', true);
			if (_data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			newState = newState.setIn(['car', 'selectCarForOrderWorkList'], Immutable.fromJS(carListForOrder));			
			return newState;
		default:
			return state;
	}
}