import Immutable from 'immutable';

const ESign = Immutable.Record({
	esignId: null,
	accountId: null,// (string, optional): 账户ID ,
	carrierId: null,// (string, optional): 承运商ID ,
	sealAuth: null,// (integer, optional): 是否设置印章 ,
	sealColor: null,// (string, optional): 印章颜色 ,
	sealData: null,// (string, optional): 印章图片数据 ,
	sealHtext: null ,// (string, optional): 生成印章中的横向文本内容 ,
	sealQtext:null,// (string, optional): 生成印章中的下弦文本内容 ,
	sealTemplate:null,// (string, optional): 印章模版 ,
	sealTime:null,// (string, optional): 设置印章时间
});

export default class ESignInfo extends ESign {
}
