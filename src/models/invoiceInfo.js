import Immutable from 'immutable';

const InvoiceInfoRecord = Immutable.Record({
	
	companyBankAccount: null,//开户行
	companyBankAccountNumber: null,//银行账号
	consignee: null,//收件人
	consigneeAddress: null,//收件人地址
	consigneePhone: null,//收件人电话
	invoiceTitle: null,//发票抬头
	invoiceType: null,//发票类型
	regAddress: null, //注册地址
	regPhone: null,//注册电话
	taxpayerIdentificationNumber: null,//纳税人识别号
	id: null,//发票id
});

export default class InvoiceInfo extends InvoiceInfoRecord {
}