import { Linking, Alert } from 'react-native';
import Toast from './toast';

class LinkingUtil {

	link (telphone, isSafe = false) {
		let phone = telphone.split(':')[1];
		let phoneNumber = phone.substring(0, 3) + '****' + phone.substring(7);
		Linking.canOpenURL(telphone).then(supported => {
			if (supported)
				if (telphone.includes('tel')) {
					Alert.alert(
						'联系电话',
						isSafe ? phoneNumber : telphone,
						[
							{ text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
							{ text: '拨打', onPress: () => Linking.openURL(telphone) },				
						]
					);					
				} else {
					return Linking.openURL(`tel:${ telphone }`);
				}
			else
				Toast.show('can\'t handle telphone: ' + telphone);
		}).catch(error => Toast.show(error));		
	}
}

export default new LinkingUtil();