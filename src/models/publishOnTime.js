import Immutable from 'immutable';

const PublishOnTimeInfoRecord = Immutable.Record({

	lineFromAddress: null,
	lineFromAreaCode: null,
	lineFromAreaName: null,
	lineFromCityCode: null,
	lineFromCityName: null,
	lineFromProvinceCode: null,
	lineFromProvinceName: null,
	lineState: null,
	lineToAddress: null,
	lineToAreaCode: null,
	lineToAreaName: null,
	lineToCityCode: null,
	lineToCityName: null,
	lineToProvinceCode: null,
	lineToProvinceName: null,
	
});

export default class PublishOnTimeInfo extends PublishOnTimeInfoRecord {
}