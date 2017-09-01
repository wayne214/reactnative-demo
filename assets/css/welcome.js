import { StyleSheet } from 'react-native';
import { height, width } from '../../src/constants/dimen';

export default StyleSheet.create({
	wrapper: {
		backgroundColor: 'white'
	},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width,
		height,
		// alignItems: 'center',
		resizeMode: 'contain',
		justifyContent: 'center'
	},
	stepContainer: {
		height: 50,
		bottom: 70,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute'
	},
	btn: {
		width: 120,
		height: 40,
		borderRadius: 5,		
		borderColor: 'white',
		backgroundColor: 'transparent'
	},
	btnText: {
		fontSize: 15,
		color: 'white'
	},
	carStyle: {
		width: 164,
		height: 110,
		bottom: 230,
		position: 'absolute'
	},
	guyStyle: {
		width: 59,
		height: 134,
		bottom: 170,
		left: 206,
		position: 'absolute'
	},
	textContainer: {
		width,
		height: 150,
		top: 100,
		position: 'absolute',
		alignItems: 'center',
		backgroundColor: 'transparent'
	},
	topText: {
		fontSize: 14,
		color: 'white',
		fontWeight: 'bold'
	},
	tipText: {
		fontSize: 14,
		color: 'white',
		marginTop: 10,
	}
});
