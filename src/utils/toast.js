import Toast from 'react-native-root-toast';

class ToastUtils {

	show(msg = 'please input the message') {
		Toast.show(msg, { position: Toast.positions.CENTER });
	}

}

export default new ToastUtils();