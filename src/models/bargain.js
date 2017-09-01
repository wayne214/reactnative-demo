import Immutable from 'immutable';

const Bargain = Immutable.Record({
	
	carNo: null,//"豫A00009"
	companyContractNo: null,//"MJCC170606000001"
	loadingEndDate: null,//"2017-06-13 16:00:00"
	loadingStartDate: null,//"2017-06-08 16:00:00"
	orderNo: null,//"GC170606000001"
	orderState:null,
	
});

export default class BargainInfo extends Bargain {
}