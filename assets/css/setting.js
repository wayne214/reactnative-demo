import { StyleSheet } from 'react-native';
import { width } from '../../src/constants/dimen';
import { LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f0f2f5'
	},
	containerRole: {
		flex: 1,
		backgroundColor: 'white'
	},	
	cellContainer: {
		width,
		height: 50,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,
		backgroundColor: 'white'
	},
	leftAnd: {
		flex: 1,
		justifyContent: 'center'
	},
	rightAnd: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	rightAndBtn: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},	
	leftText: {
		fontSize: 15,
		color: '#666666',
		marginLeft: 15,
	},
	loginBtn: {
		marginTop: 15,
		marginRight: 20,
		marginLeft: 20,
		height: 45,
	},
	btn: {
		width: width - 40,
		height: 44,
		borderRadius: 2,
		borderColor: 'white',
		backgroundColor: 'white', 
	},
	btnText: {
		fontSize: 15,
		color: '#666666',
	},	
	iconFont: {
		fontFamily: 'iconfont',
		fontSize: 15,
		color: '#cccccc',
		marginRight: 15,
	},
	switch: {
		marginRight: 15,
	},
	btnUpdate: {
		width: 45,
		height: 22,
		borderRadius: 2,
		marginRight: 15,
		borderColor: '#17a9df',
		backgroundColor: '#17a9df', 
	},
	updateText: {
		fontSize: 15,
		color: 'white'
	},
	serviceIconContainer: {
		marginTop: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	serviceText: {
		marginTop: 25,
		marginLeft: 70,
		marginRight: 70,
		fontSize: 15,
		color: '#333333',
		lineHeight: 24,
	},
	linkContainer: {
		marginTop: 15,
		marginRight: 40,
		marginLeft: 40,
		height: 45,
		flexDirection: 'row',
		backgroundColor: '#17a9df',
		alignItems: 'center',
		justifyContent: 'center'
	},
	phoneText: {
		fontSize: 15,
		color: 'white',
	},
	phoneIcon: {
		width: 20,
		height: 20,
		marginRight: 10,
		borderRadius: 10,
		alignItems: 'center',
		backgroundColor: 'white',
		justifyContent: 'center'
	},
	fontPhone: {
		fontFamily: 'iconfont',
		fontSize: 12,
		color: '#17a9df',
	},	
	invoiceText: {
		marginLeft: 15,
		marginTop: 15,
		fontSize: 14,
		fontWeight: 'bold',
		color: '#333333'
	},
	explanationText: {
		marginLeft: 15,
		marginRight: 15,
		fontSize: 14,
		lineHeight: 24,
		color: '#666666'
	},
	companyText: {
		fontSize: 15,
		color: '#5c5c5c',
		marginLeft: 15
	},
	statusContainer: {
		width,
		height: 50,
		borderBottomColor: LINE_COLOR,
		borderBottomWidth: 1,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	tipText: {
		fontSize: 18,
		color: '#333333',
		marginTop: 40,
		marginLeft: 15
	},	
	tip: {
		fontSize: 12,
		color: '#999',
		marginTop: 10,
		marginLeft: 15		
	},
	cellView: {
		width: width - 30,
		height: 50,
		marginLeft: 15,
		marginRight: 15,
		flexDirection: 'row',
		borderBottomColor: LINE_COLOR,
		borderBottomWidth: 1,
	},
	cell: {
		flex: 1,
		justifyContent: 'center'
	},
	roleTip: {
		fontSize: 15,
		color: '#666'
	},
	arrowIcon: {
		marginTop: 3,
		color: '#999',
		fontFamily: 'iconfont'
	},
	description: {
		position: 'absolute',
		bottom: 30,
		left: 0,
		right: 0,
	},
	desTip: {
		fontSize: 14,
		color: '#666',
		marginLeft: 15,
		marginRight: 15,
		lineHeight: 20
	},
	container1: {
		position: 'absolute',
		top: 50,
		right: 0,
		left: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent'
	},
});
