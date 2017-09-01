import { StyleSheet } from 'react-native';
import { width } from '../../src/constants/dimen';
import { LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f0f2f5'
	},
	filterContainer: {
		position: 'absolute',
		right: 50,
		top: 65,
		overflow: 'hidden',
	},
	topContainer: {
		width,
    alignItems:'flex-end',
		backgroundColor: 'transparent'
	},
	rightContent: {
		marginTop: 15,
		marginRight: 29,		
		alignItems: 'center',
	},
	carStateText: {
		fontSize: 19,
		color: '#17a9df',
		fontWeight: 'bold',
	},
	textContent: {
		marginTop: 10,
		alignItems: 'flex-end',
	},
	destinationContent: {
		height: 128,
	},
	phone: {
		fontSize: 14,
		color: '#ffffff',
		backgroundColor: 'transparent'
	},
	phoneContent: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	carStatusText: {
		fontSize: 19,
		color: '#17a9df',
		fontWeight: 'bold'
	},
	carNoBgStyle: {
		marginTop: 9,
		alignItems: 'center',
	},
	carNo: {
		fontSize: 15,
		color: '#fff',
		marginTop: 5,		
		fontWeight: 'bold',
	},
	destinationStyle: {
		marginTop: 10,
		// height: 168,
		borderTopWidth: 0.5,
		borderBottomWidth: 0.5,
		borderTopColor: '#e6eaf2',
		borderBottomColor: '#e6eaf2',
		backgroundColor: 'white'
	},
	carBanStyle: {
		marginRight: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	carBanText: {
		fontSize: 15,
		color: '#fff',
		fontWeight: 'bold',	
		backgroundColor: 'transparent'	
	},
	carBanContainer: {
		alignItems: 'flex-end',
		backgroundColor: 'white'
	},
	cellContainer: {
		width,
		// marginTop: 7,
		flexDirection: 'row',
	},
	titleText: {
		fontSize: 14,
		color: '#999',
		marginLeft: 10,
		lineHeight: 17,
	},
	contentText: {
		fontSize: 14,
		color: '#ffa200',
		lineHeight: 17,		
	},
	destinationBg: {
		backgroundColor: '#ffa200'
	},
	addressText: {
		fontSize: 14,
		color: '#333',
		lineHeight: 17,		
	},
	line: {
		height: 1,
		marginTop: 15,
		marginLeft: 10,
		width: width - 20,		
		backgroundColor: LINE_COLOR
	},
	optContainer: {
		flex: 1,
		height: 44,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	arrow: {
		color: '#d3d3d3',
		fontFamily: 'iconfont',
		marginRight: 12
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	animatedContainer: {
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: 'white'
	},
	processContainer: {
		height: 60,	
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	processLeftContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'transparent'
	},
	arrowContainer: {
		flex: 1,
		alignItems: 'flex-end',
	},	
	payOrderSelect: {
		backgroundColor: 'white',
		overflow: 'hidden',
	},	
	payOrderText: {
		fontSize: 14,
		color: '#999999',
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 10,
		lineHeight: 24,
	},
	payOrderTime: {
		fontSize: 14,
		color: '#ffa200'
	},
	numBg: {
		width: 21,
		height: 21,
		borderRadius: 10,
		marginLeft: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#e9ecec'
	},
	textAlready: {
		fontSize: 16,
		color: '#333',
		fontWeight: 'bold'
	},
	rightContainer: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	btnOpt: {
		width: 83,
		height: 25,
		marginRight: 10,
		borderColor: '#999',
		borderRadius: 2
	},
	btnOptDis: {
		width: 73,
		height: 25,
		marginRight: 10,
		borderRadius: 2,
		borderColor: '#e9ecec',
		backgroundColor: '#e9ecec'
	},
	btnText: {
		fontSize: 14,
		color: '#333'
	},
	btnTextDis: {
		fontSize: 14,
		color: '#ccc'
	},	
	tipText: {
		fontSize: 14,
		color: '#999999',
		lineHeight: 24,
		marginLeft: 80,
		marginRight: 80,
		marginTop: 20,
		textAlign: 'center'
	},
	btn: {
		width: 154,
		height: 44,
		marginTop: 20,
		borderRadius: 2,
		borderColor: '#17a9df',
		backgroundColor: '#17a9df'
	},
	btnsText: {
		fontSize: 15,
		color: '#ffffff'
	},
	bottomView: {
		marginBottom: 10
	},
	routeLoadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}	
});
