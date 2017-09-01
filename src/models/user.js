import Immutable from 'immutable';
import Storage from '../utils/storage';

const UserRecord = Immutable.Record({

	// 账户余额
	balance: null,
	// 角色认证 默认为null 1：物流公司 2：信息部 3：个体司机 (4：个体货主 5：公司货主) 6：公司库主
	// certificationRole: null,
	// 角色认证状态0:未认证(默认) 1:认证中 2：已认证 3：认证未通过
	certificationStatus: null,
	// 认证类型 0:未认证 1:个人 2:企业
	certificationType: null,
	// 用户头像
	imgurl: null,
	// 注册意向 1：物流公司 2：信息部 3：司机 4：货主 5：库主
	intention: null,
	// 是否设置支付密码  0：未设置; 1:已设置
	isPayStatus: null,
	// 平台认证状态 0:未认证(默认) 1：认证中 2：已认证 3:认证未通过 4：求认证 5：业务员派遣中
	platformStatus: null,
	// 实名认证状态 0、未认证 1、认证中 2、已认证
	subAccount: null,
	userId: null,
 	// 真实姓名
	userName: null,
	// 用户名称
	usercode: null,
	tradeAmount: null,
	infoId: null,
	infoPlatformId: null,

	//认证返回
	businessLicenseImgUrl :null,// 营业执照 ,
	certificatesType:null,// 证件类型 1:普通 2:三证合一 ,
	companyBankAccount:null,// 开户行 ,
	companyBankAccountNumber:null,// 开户行账号 ,
	companyName :null,// 公司名称 ,
	esignAccountId :null,// 印章id ,
	esignRealServiceId :null,// 用户提交企业认证成功Id ,
	esignSealAuth :null,// 是否设置印章 ,
	esignSealColor :null,// 印章颜色 ,
	esignSealData :null,// 印章图片数据 ,
	esignSealHText :null,// 生成印章中的横向文内容(可空) ,
	esignSealQText :null,// 生成印章中的下弦文内容(可空) ,
	esignSealTemplate :null,// 印章模板 ,
	esignSealTime :null,// 设置印章时间 ,
	id :null,// ID ,
	idCard :null,// 身份证号 ,
	invoiceStatus : null,// 1未开发票 2已开发票 ,
	invoiceType : null,// 1增值税专用发票 2增值税普通发票 ,
	name : null,// 姓名 ,
	organizationCode : null,// 组织机构代码证号 ,
	organizationCodeCertificateImgUrl :null,// 组织机构代码证 ,
	taxRegCertificateImgUrl : null,// 税务登记证 ,
	uniformSocia : null,// 社会统一信用代码 ,
	isInvoiceYes : false,//是否添加发票信息 添加后才能结算订单
	invoiceSize: 0,
	userInvoiceType: 0, //防止与上边invoiceType重复
}, 'User');

class User extends UserRecord {

	save() {
		Storage.save('user', this.toJS());
	}

	async merge(user) {
		const _user = await Storage.get('user');
		const newUser = Immutable.Map(_user).merge(user);
		Storage.save('user', newUser);
	}

	delete() {
		Storage.remove('user');
	}
}

export default User;
