import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import CarrierInfo from '../models/carrier';
import BargainInfo from '../models/bargain';
import { PAGE_SIZE } from '../constants/setting';

const initState = Immutable.fromJS({
	carrierInfo: {
		carrierInfoDetail: {},
		bargainInfoList:[],
		carrierDetail: {},
	},
	companyList: [],
	hasMore: true,
	isEndReached: false,
	isRefresh: false,
	personalInfoDetail: {},

});

export default (state = initState, action) => {
	let newState = state;
	let tmpBargainList = [];
	switch(action.type) {
		case ActionTypes.ACTION_GET_PERSONAL_AUTHINFO_DETAIL:
			let personalInfo = action.payload.data;
			newState = newState.set('personalInfoDetail',personalInfo);
			return newState;
			
		case ActionTypes.ACTION_GET_AUTHINFO_DETAIL:
			let carrier = action.payload.data;
			let carrierInfoDetail = new CarrierInfo({
					carrierType: parseInt(carrier.carrierType),
					certificationStatus: parseInt(carrier.certificationStatus),
					certificationTime: carrier.certificationTime,
					certificationUser: carrier.certificationUser,
					companyName: carrier.companyName,
					id: carrier.id,
					phoneNumber: carrier.phoneNumber,
					username: carrier.username,
					idCard: carrier.idCard,
					bankAccount: carrier.bankAccount,
					bankAccountNumber: carrier.bankAccountNumber,
					certificatesCode: carrier.certificatesCode,
					corporation: carrier.corporation,
					certificatesType: carrier.certificatesType,
					businessLicenseImgUrl: carrier.businessLicenseImgUrl,
					organizationCodeCertificateImgUrl: carrier.organizationCodeCertificateImgUrl,
					taxRegCertificateImgUrl: carrier.taxRegCertificateImgUrl,
			});
			console.log('lqq--ACTION_GET_AUTHINFO_DETAIL-carrierInfoDetail-->',carrierInfoDetail);
			newState = newState.setIn(['carrierInfo','carrierInfoDetail'],Immutable.fromJS(carrierInfoDetail));
			return newState;

		case ActionTypes.ACTION_COMPANY:
			newState = newState.set('companyList', action.payload.data.list);
			return newState;
		case ActionTypes.ACTION_BARGAIN_LIST:
		if (action.payload.pageNo !== 1) {
				tmpBargainList = state.getIn(['carrierInfo', 'bargainInfoList']).toArray();
			}
			action.payload.data.list.forEach(bargain => {
				tmpBargainList.push(new BargainInfo({
					carNo: bargain.carNo,//"豫A00009"
					companyContractNo: bargain.companyContractNo,//"MJCC170606000001"
					loadingEndDate: bargain.loadingEndDate,//"2017-06-13 16:00:00"
					loadingStartDate: bargain.loadingStartDate,//"2017-06-08 16:00:00"
					orderNo: bargain.orderNo,//"GC170606000001"
					orderState: parseInt(bargain.orderState),
				}));
			});
			console.log('lqq--ACTION_BARGAIN_LIST-tmpBargainList-->',tmpBargainList);
			const data = action.payload.data;
			// 重置标识位
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefresh', false);
			newState = newState.set('hasMore', true);
			if (data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			
			newState = newState.setIn(['carrierInfo','bargainInfoList'],Immutable.fromJS(tmpBargainList));
			return newState;

		case ActionTypes.ACTION_CARRIER_DETAIL:
			newState = newState.setIn(['carrierInfo','carrierDetail'], action.payload.data);
			return newState;

		case ActionTypes.ACTION_CLEAR_AUTH_INFO:
			newState = newState.setIn(['carrierInfo','carrierDetail'],'');
			return newState;

		default:
			return state;
	}
}