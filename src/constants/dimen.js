import { Dimensions, Platform } from 'react-native';
const { width, height, scale } = Dimensions.get('window');

let adjustStaBarHeight;
let adjustToolBarHeigth;
if (Platform.OS === 'ios') {
	// if (width > 375) {
	// 	adjustToolBarHeigth = { height: 93 };
	// 	adjustStaBarHeight = { marginTop: 27 };
	// } else {
		adjustToolBarHeigth = { height: 64 };
		adjustStaBarHeight = { marginTop: 20 };
	// }
} else {
	adjustToolBarHeigth = { height: 50 };
	adjustStaBarHeight = { marginTop: 0 };
}

export {
	width,
	height,
	scale,
	adjustStaBarHeight,
	adjustToolBarHeigth
};