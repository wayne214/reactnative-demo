import Immutable from 'immutable';

const RouteRecord = Immutable.Record({
	carrierId: null,
	carrierType: null,
	companyName: null,
	fromProvinceName: null,
	fromProvinceCode: null,
	fromCityName: null,
	fromCityCode: null,
	fromAreaName: null,
	fromAreaCode: null,
	toProvinceName: null,
	toProvinceCode: null,
	toCityName: null,
	toCityCode: null,
	toAreaName: null,
	toAreaCode: null,
	phoneNumber: null,
	username: null,
	corporation: null,
});

export default class route extends RouteRecord {
}