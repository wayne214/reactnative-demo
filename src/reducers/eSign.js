import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import ESignInfo from '../models/eSign';
import { PAGE_SIZE } from '../constants/setting';

const initState = Immutable.fromJS({
	eSign: {
		eSignInfoDetail: {}
	},
	isRefresh: false,
	isCricleTemplate: true,
	sealColor: '',
});

export default (state = initState, action) => {
	let newState = state;
	switch(action.type) {
		case ActionTypes.ACTION_GET_ESIGN_INTO:
			let eSign = action.payload.data;
			let eSignInfoDetail = new ESignInfo({
				esignId: eSign.esignId,
				accountId: eSign.accountId,// (string, optional): 账户ID ,
				carrierId: eSign.carrierId,// (string, optional): 承运商ID ,
				sealAuth: eSign.sealAuth,// (integer, optional): 是否设置印章 ,
				sealColor: eSign.sealColor,// (string, optional): 印章颜色 ,
				sealData: eSign.sealData,// (string, optional): 印章图片数据 ,
				sealHtext: eSign.sealHtext ,// (string, optional): 生成印章中的横向文本内容 ,
				sealQtext: eSign.sealQtext,// (string, optional): 生成印章中的下弦文本内容 ,
				sealTemplate: eSign.sealTemplate,// (string, optional): 印章模版 ,
				sealTime: eSign.sealTime,// (string, optional): 设置印章时间
			});
			console.log('lqq--ACTION_GET_ESIGN_INTO-eSignInfoDetail-->',eSignInfoDetail);
			newState = newState.set('isRefresh', false);
			newState = newState.set('isCricleTemplate', eSign.sealTemplate === 'STAR' ? true : false);
			newState = newState.set('sealColor',eSign.sealColor);
			newState = newState.setIn(['eSign','eSignInfoDetail'],Immutable.fromJS(eSignInfoDetail));
			return newState;
		case ActionTypes.ACTION_REFRESH_ESIGN_TEMPLATE_INFO:
			console.log('lqq--ACTION_REFRESH_ESIGN_TEMPLATE_INFO-isCricleTemplate-->',action.payload.template);
			newState = newState.set('isCricleTemplate', action.payload.template);
			return newState;
		case ActionTypes.ACTION_REFRESH_ESIGN_COLOR_INFO:
			console.log('lqq--ACTION_REFRESH_ESIGN_COLOR_INFO-sealColor-->',action.payload.sealColor);
			newState = newState.set('sealColor', action.payload.sealColor);
			return newState;
		default:
			return state;
	}
}
