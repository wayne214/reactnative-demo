import React from 'react'
import {
	Linking,
	Alert
} from 'react-native'

class MakePhoneCall {
	call(phoneNumber,failCallBack,alertTitle='') {
		const url = phoneNumber.indexOf('tel:') == -1 ? `tel:${phoneNumber}` : phoneNumber
		const number = phoneNumber.indexOf('tel:') == -1 ? phoneNumber : phoneNumber.split(':')[1]
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
}
export default new MakePhoneCall();