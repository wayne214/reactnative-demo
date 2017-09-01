import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	tipText: {
		fontSize: 14,
		color: '#666666',
		marginTop: 15,
		marginLeft: 15,
	},
	infoText: {
		fontSize: 12,
		color: '#999999',
		lineHeight: 25,
		marginLeft: 15,
		marginRight: 15,
	},
	cellContainer: {
		width,
		height: 50,
		flexDirection: 'row',
		backgroundColor: 'white',
		borderBottomColor: LINE_COLOR,
		borderBottomWidth: 1,
	},
	cell: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	carNoText: {
		fontSize: 15,
		color: '#333333',
	},
	dirverName: {
		fontSize: 12,
		color: '#333'
	},
	btnStyle: {
		width: 85,
		height: 25,
		backgroundColor: 'white',
		borderColor: '#17a9df',
		borderRadius: 2,
	},
	btnTextStyle: {
		fontSize: 12,
		color: '#17a9df'
	},
	driverContainer: {
		width,
		height: 50,
		justifyContent: 'center',
		backgroundColor: 'white',
		borderBottomColor: LINE_COLOR,
		borderBottomWidth: 1,
	},	
	driverContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15
	},
	driverTextLeftView: {
		flex: 1,
		justifyContent: 'flex-start',
	},
	driverTextRightView: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems:'flex-end'
	},
	driverText: {
		fontSize: 15,
		color: '#333333',
	},	
});