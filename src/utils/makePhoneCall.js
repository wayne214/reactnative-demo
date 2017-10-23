/*
* @author:  yinyongqian
* @createTime:  2017-08-11, 09:59:55 GMT+0800
* @description:  description
*/
import React from 'react'
import {
	Linking,
	Alert
} from 'react-native'

class MakePhoneCall {
	call(phoneNumber,failCallBack,alertTitle='') {
		const url = phoneNumber.indexOf('tel:') == -1 ? `tel:${phoneNumber}` : phoneNumber
		const number = this.formatPhone(phoneNumber.indexOf('tel:') == -1 ? phoneNumber : phoneNumber.split(':')[1])
		Linking.canOpenURL(url).then(supported => {
		  if (supported) {
		  	Alert.alert(alertTitle,number,[
		  		{
		  			text: '取消',
		  			onPress: () => {}
		  		},
		  		{
		  			text: '呼叫',
		  			onPress: () =>{
		  				Linking.openURL(url)
		  			}
		  		}
		  	]);
		  } else {
		  	if (failCallBack) {failCallBack()};
		  }
		}).catch(err => console.error('An error occurred', err));

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
export default new MakePhoneCall();
