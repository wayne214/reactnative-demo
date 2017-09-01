import Immutable from 'immutable';
import Storage from '../utils/storage';

const UserRecord = Immutable.Record({
	
	userId: null,
	driverName: null,

	carrierId: null,
	
	driverNumber: null,
	
	phoneNumber: null, // 承运商手机号 ,

	refCount: null,
	carrierType: null, // 承运商类型 1: 公司 2: 个人
	certificationStatus: null, // 认证状态 0:未认证(默认) 1:认证中 2：已认证 3：认证未通过 ,
	companyName: null,
	loginSign: null, // 登录验证sign
	username: null, // 用户名 ,

	currentUserRole: null, // 当前用户角色 1:承运商 2:司机
	certificationTime: null,

	carId: null,
	corporation: null,

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
