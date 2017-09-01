import Immutable from 'immutable';

const CarRecord = Immutable.Record({
	
	carCategory: null,
	carImageUrl: null, 
	
	carLength: null,
	carId: null,
	carName: null, 
	
	carNo: null,
	gcarNo: null,

	carState: null,
	
	carType: null, 
	carrierId: null, 
	certificationApplyTime: null,
	certificationStatus: null, 
	createTime: null, 

	driverId: null, 
	driverName: null,
	driverNumber: null,
	driverPhone: null,
	id: null,
	phoneNumber: null,

	loadSize: null,
	volumeSize: null,
	transportationLicense: null,
	scrapDate: null,

	operateLicenseUrl: null,
	drivingLicenseUrl: null,
	gdrivingLicenseUrl: null,
	goperateLicenseUrl: null,

});

export default class Car extends CarRecord {
}