import Immutable from 'immutable';

const Carrier = Immutable.Record({
	
	carrierType: null,
	certificationStatus: null,
	certificationTime: null,
	certificationUser: null,
	companyName: null,
	del: null,
	id: null,
	phoneNumber: null,
	username: null,
	version: null,
	scrapDate: null,
	idCard: null,
	bankAccount: null,
	bankAccountNumber: null,
	certificatesCode: null,
	corporation: null,
	certificatesType: null,
	businessLicenseImgUrl: null,
	organizationCodeCertificateImgUrl: null,
	taxRegCertificateImgUrl: null,
});

export default class CarrierInfo extends Carrier {
}