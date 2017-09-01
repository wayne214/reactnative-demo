import moment from 'moment';
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
		color = color ? color.toUpperCase(): '';
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
	getPersonESignTemplateIndex(template){
		// SQUARE
		// RECTANGLE
		// BORDERLESS
		// YYGXSF
		// FZKC
		// HYLSF
		template = template ? template.toUpperCase(): '';
		// console.log('lqq---template---',template);
		if(template === 'SQUARE'){
			return 1;
		}else if(template === 'FZKC'){
			return 2;
		}else if(template === 'HYLSF'){
			return 3;
		}else if(template === 'BORDERLESS'){
			return 4;
		}else if(template === 'RECTANGLE'){
			return 5;
		}else if(template === 'YYGXSF'){
			return 6;
		}else{
			return 1;
		}
	}

	getObject(map,key){
		key = key ? key.toUpperCase() : '';
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
	getObjectByValue(map,value){
		for(let i = 0;i< map.length;i++){
			if(map[i].value === value){
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
		// 1畜禽类'2水产类，3牛羊肉类，4速冻调理类，5速冻面点类，6农产品类，7乳制品类，8冰产品类
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

	/**
	 * 获取支付方式
	 * @param  {[type]} payWay [description]
	 * @return {[type]}        [description]
	 */
	getPayWay(payWay){
		switch(payWay){
			case 1:
				return '网银转账'
			default:
				return ''
		}
	}

	/**
	 * 获取委托类型
	 * @param  {[type]} entrustType [description]
	 * @return {[type]}            [description]
	 */
	getEntrustType(entrustType){
		switch(entrustType){
			case 1:
				return '自营'
			case 2:
				return '第三方承运'
			default:
				return ''
		}
	}
	getOrderStateStr(state){
		switch(state){
			case 1: return '待上传装货清单'
			case 2: return '待承运方上传出库单'
			case 3: return '待承运方装货确认'
			case 4: return '待确认装货'
			case 5: return '待承运方到货确认'//(拍摄环境照片)'
			case 6: return '待承运方交付确认'//(上传回执单)'
			case 7: return '待确认收货'
			case 8: return '协调中'
			case 9: return '协调完成'
			case 10: return '未结算'
			case 11: return '结算中'//(这个结算中是指主订单处于结算中'并不代表货主的结算状态'货主的结算状态和承运方的结算状态是独立的)
			case 12: return '已完成'
			case 13: return '异常取消'
			case 14: return '结算中'
			case 15: return '结算通知'
			case 16: return '已结算'
			case 17: return '未结算'
			case 18: return '回单照片审核中'
			case 19: return '回单照片审核驳回'
			case 20: return '已关闭'
			default: return ''
		}
	}
	// 第三方承运（撮合订单）
	getOrderStateStrTP(state,auditProposeType){
		switch(state){
			case 1: return ''
			case 2: return ''
			case 3: return '等待装货'
			case 4: return ''
			case 5: return ''
			case 6: return '等待收货'
			case 7: return ''
			case 8: return '协调中'
			case 9: return '协调完成'
			case 10: return ''
			case 11: return ''
			case 12: return '已完成'
			case 13: return '异常取消'
			case 14: return ''
			case 15: return ''
			case 16: return '已结算'
			case 17: return '未结算'
			case 18:
				if(auditProposeType == 1){
					return '回单审核中'
				}else{
					return '承运方回单审核中'
				}
			case 19:
				if(auditProposeType == 1){
					return '回单驳回'
				}else{
					return '承运方回单驳回'
				}
			case 20: return '已关闭'
			default: return ''
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
			if (min == 0) {min == '0'}
			if (max == 0) {max = '0'}
			if (min && max) {
				return `${min}℃ ~ ${max}℃`
			}else{
				return ''
			}
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

	getResourceState(state) {
		switch (state * 1) {
			case 1:
				return '待审核'
			case 2:
				return '竞价中'
			case 3:
				return '派单失败'
			case 4:
				return '派单中'
			case 5:
				return '抢单中'
			case 6:
				return '已成单'
			case 7:
				return '待调度'
			case 8:
				return '已驳回'
			case 9:
				return '已取消'
			case 10:
				return '已删除'
			case 12:
				return '待分配'
			default:
				return ''
		}
	}

	// 前台显示
	getResourceStates(state) {
		switch (state * 1) {
			case 1:
				return '正在审核'
			case 2:
				return '正在受理'
			case 3:
				return '正在受理'
			case 4:
				return '正在受理'
			case 5:
				return '待选择'
			// case 6:
			// 	return '已成单'
			case 7:
				return '待承运方调度车辆'
			case 8:
				return '已驳回'
			case 9:
				return '已取消'
			// case 10:
			// 	return '已删除'
			case 11:
				return '委托失败'
			case 12:
				return '正在受理'
			case 13:
				return '已关闭'
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

	//装货地点
	getLadingAddressList(list){
		if (list && list.length > 0) {
			return list.map((item,index)=>{
				return item.loadingProvinceName + (item.loadingCityName == item.loadingProvinceName ? '' : item.loadingCityName) + item.loadingAreaName + item.loadingAddress

			})
		};
	}

	/**
	 * [isBefore description]
	 * @param  {[type]}  startDate [description]
	 * @param  {[type]}  endDate   [description]
	 * @return {Boolean}           [description]
	 */
	isBefore (startDate, endDate) {
		if (!startDate || !endDate) return false;
		const sdays = startDate.split('-');
		const edays = endDate.split('-');
		if (edays[0] * 1 > sdays[0] * 1) {
			console.log(111111)
			return true;
		}	else if (edays[0] * 1 === sdays[0] * 1 && edays[1] * 1 > sdays[1] * 1) {
			console.log(222222)
			return true;
		}	else if (edays[0] * 1 === sdays[0] * 1 && edays[1] * 1 === sdays[1] * 1 && edays[2] * 1 > sdays[2] * 1) {
			console.log(333333)
			return true;
		}	else if (edays[0] * 1 === sdays[0] * 1 && edays[1] * 1 === sdays[1] * 1 && edays[2] * 1 === sdays[2] * 1) {
			console.log(444444)
			return true;
		}
			console.log(555555)
		return false;
	}

	compareTime (startTime, endTime) {
		if (!startTime || !endTime) return false;
		const stime = startTime.split(':');
		const etime = endTime.split(':');
		if (etime[0] * 1 > stime[0] * 1) {
			console.log('结束小时大于开始小时')
			return true;
		}	else if (etime[0] * 1 === stime[0] * 1 && etime[1] * 1 > stime[1] * 1) {
			console.log('结束分钟大于开始分钟')
			return true;
		} else if (etime[0] * 1 === stime[0] * 1 && etime[1] * 1 === stime[1] * 1) {
			console.log('时间相同')
			return true;
		}
			console.log(444444)
		return false;
	}

// invoceType 发票：1增值税专用发票 2增值税普通发票 3否
	getInvoicePostType(type,status){
		let statusStr = ''
		if (status == 2) {
			statusStr = '(申请发票中)'
		}else if (status == 3) {
			statusStr = '(发票已邮寄)'
		};
		if (type == 1) {
			return '增值税专用发票' + statusStr
		}else if (type == 2) {
			return '增值税普通发票' + statusStr
		}else{
			return '否'
		};
	}
	// const invoiceBtnTitle = ''
	// if (rowData.invoiceState == 1) {
	// 	invoiceBtnTitle = '申请开发票'
	// }else if (rowData.invoiceState == 2) {
	// 	invoiceBtnTitle = '申请发票中'
	// }else if (rowData.invoiceState == 3) {
	// 	invoiceBtnTitle = '发票已邮寄'
	// }

	/**
	 * [dateFormat description]
	 * @param  {[type]} String date          [description]
	 * @param  {[type]} String format        [description]
	 * @return {[type]}        [description]
	 */
	dateFormat(date, format) {

	}

}

export default new HelperUtil();