import { IMG_HOST } from '../constants/setting';

class HelperUtil {

	getCarStatus(status){
		switch(status){
			case 0:
				return '空闲';
			case 1:
				return '使用中';
			default :
				return '';
		}
	}
	getCarCertificationStatus(status){
		switch(status){
			case 0:
				return '未认证';
			case 1:
				return '认证中';
			case 2:
				return '已认证';
			case 3:
				return '认证未通过';
			default :
				return '';
		}
	}
	getColor(color){
		if(color === 'RED'){
			return '红';
		}else if(color === 'BLUE'){
			return '蓝';
		}else if(color === 'BLACK'){
			return '黑';
		}else{
			return '';
		}
	}

	getObject(map,key){
		for(let i = 0;i< map.length;i++){
			if(map[i].key === key){
				return map[i];
			}
		}
		return '';
	}
	getObjectByInt(map,key){
		for(let i = 0;i< map.length;i++){
			if(map[i].key === key){
				return map[i];
			}
		}
		return '';
	}
	getCarType(type) {
		switch(type){
			case 1:
				return '厢式货车';
			case 2:
				return '集装箱挂车';
			case 3:
				return '集装箱车';
			case 4:
				return '箱式挂车';
			default:
				return '';
		}
	}

	getCarCategory(category){
		switch(category){
			case 1:
				return '冷藏车';
			default:
				return '';
		}
	}

	getCarLength(length){
		switch(length){
			case 1:
				return '4.2米';
			case 2:
				return '5.5米';
			case 3:
				return '6.2米';
			case 4:
				return '6.8米';
			case 5:
				return '7.4米';
			case 6:
				return '7.6米';
			case 7:
				return '8.6米';
			case 8:
				return '9.6米';
			case 9:
				return '12.5米';
			case 10:
				return '13.7米';
			case 11:
				return '15米';
			case 12:
				return '16.5米';
			default:
				return '';
		}
	}

	getGoodsName(goodsName){
		// 1畜禽类，2水产类，3牛羊肉类，4速冻调理类，5速冻面点类，6农产品类，7乳制品类，8冰产品类
		switch(goodsName){
			case 1:
				return '畜禽类'
			case 2:
				return '水产类'
			case 3:
				return '牛羊肉类'
			case 4:
				return '速冻调理类'
			case 5:
				return '速冻面点类'
			case 6:
				return '农产品类'
			case 7:
				return '乳制品类'
			case 8:
				return '冰产品类'
			case 9:
				return '其他'
			case 10:
				return '医药类'
			default:
				return ''
		}
	}
	// 1待货主上传装货清单，
	// 2待承运商上传出库单，
	// 3待承运商装车确认，
	// 4待货主装货确认，
	//  5待承运商确认到达(拍摄环境照片)，
	//  6待承运商确认交付(上传回执单)，
	//  7待货主确认收货，
	//  8协调中，
	//  9协调完成，
	//  10未结算，
	//  11结算中，
	//  12已完成，
	//  13已取消
	//  14承运方未结算
	//  15承运方结算中
	//  (15,"承运方结算中(未结清)"),
	//  (16,"待承运方确认结算(已结清)"),
	getOrderStateStr(state,entrustType){
		// !entrustType && console.warn("Helper 订单状态 缺少参数 entrustType");
		switch(state){
			case 1: return '待委托方上传装货清单'
			case 2: return '待上传出库单'
			case 3: return '待装货确认'
			case 4: return '待委托方确认装货'
			case 5: return '待到货确认'
			case 6: return '待交付确认'
			case 7: return '待委托方确认收货'
			case 8: return '协调中'
			case 9: return '协调完成'
			case 10: return '未结算'
			case 11: return '结算中'// 列表中不会出现 参照15  16
			case 12: return '已完成'
			case 13: return '已取消'
			case 14: return entrustType == 1 ? '未结算' : '回单审核中'//'承运商未结算'
			case 15: return entrustType == 1 ? '运费未结清' : '回单审核驳回' //'承运商结算中'
			case 16: return '已结算待确认'
			case 17: return '已完成'
			case 18: return '已关闭'
			case 19: return '运费核对中'
			default: return ''
		}
	}

	transformActiveTabToOrderState(activeTab,subActiveTab){
		// 0 -1   1-2  2-3  3-   4-8   1所有 2待装货 3待交付 4结算 5未结算 6结算中 7已结算(已完成) 8取消
		switch(activeTab){
			case 0: return 1
			case 1: return 2
			case 2: return 3
			case 3:
				if (subActiveTab == 0) {return 5}
				if (subActiveTab == 1) {return 6}
				if (subActiveTab == 2) {return 7}
			case 4: return 8
			default: return 1

		}
	}

	transformSubActiveTabToOrderState(subActiveTab){
		// 5未结算 6结算中 7已结算
		switch(subActiveTab){
			case 0: return 5
			case 1: return 6
			case 2: return 7
			default: return 5
		}
	}

	transformOrderTypeMenuIndexToType(menuIndex){//订单头部筛选条件 type: 0所有 1派单 2竞价 3抢单
		switch(menuIndex){
			case 0: return 0
			case 1: return 3
			case 2: return 2
			case 3: return 1
			default: return 0
		}
	}

	travelOrderStatus(status = -1) {
		switch(status) {
			case -1:
				return '';
			case 1:
				return '待货主上传装货清单';
			case 2:
				return '待上传出库单';
			case 3:
				return '待装货确认';
			case 4:
				return '待货主装货确认';
			case 5:
				return '待确认到达';
			case 6:
				return '待上传回执单';
			case 7:
				return '待货主确认收货';
			case 8:
				return '协调中';
			case 9:
				return '协调完成';
			case 10:
				return '未结算';
			case 11:
				return '结算中';
			case 12:
				return '已完成';
			case 13:
				return '已取消';
			default:
				return '';
		}
	}

	getTemperature(type,min,max){
		if (type == 1) {
			return '常温'
		}else{
			if (min == 0) {
				min == '0'
			}
			if (max == 0) {
				max = '0'
			}
			// if (min && max) {
				return `${min.toString()}℃ ~ ${max.toString()}℃`
			// }else{
			// 	return ''
			// }
		}
	}

	getPayMentTypeStr(type){
		switch(type){
			case 1:
				return '线下结算'
			default:
				return ''
		}
	}

	/**
	 * [getFullImgPath description] 获取图片的全路径
	 * @param  {[type]} url    [description] 服务器返回路径
	 * @param  {[type]} width  [description] 图片宽度
	 * @param  {[type]} height [description] 图片高度
	 * @return {[type]}        [description]
	 */
	getFullImgPath(url, width = 480, height = 720) {
		return IMG_HOST + url + `?x-oss-process=image/resize,m_lfit,h_${ height },w_${ width }` + '&a=' + Math.random(1) * 100000;
	}

	getFormatDate(date){
		if (!date) return false;
		let days;
		// console.log('lqq--date->',date);
		if((date+'').indexOf(' ') !== -1){
			let left = (date+'').split(' ');
			// console.log('lqq--left->',left[0]);
			days = (left[0]+'').split('-');
			// console.log('lqq--days1->',days);
		}else{
			days = date.split('-');
			// console.log('lqq--days2->',days);
		}

		let str = days[0];
		if(days[1] * 1 < 10 && days[1].length === 1){
			str += '-0'+days[1];
		}else{
			str += '-'+days[1];
		}
		if(days[2] * 1 < 10 && days[2].length === 1){
			str += '-0'+days[2];
		}else{
			str += '-'+days[2];
		}
		// console.log('lqq--getFormatDate->',str);
		return str;
	}

	fileSizeFormat(bytes){
		if (bytes > 1024 * 1024) {
			// M
			return Math.round((bytes / (1024 * 1024)) * 100) * 0.01 + 'M'
		}else{
			return Math.round((bytes / 1024) * 100) * 0.01 + 'K'
		}
	}
	formatPhone(phoneNumber){
		const numberStr = phoneNumber + ''
		let result = ''
		if (numberStr.length == 11) {
			result += numberStr.substring(0,3)
			result += '****'
			result += numberStr.substring(7,11)
		}else{
			result = '****'
		}
		return result
	}
}

export default new HelperUtil();
