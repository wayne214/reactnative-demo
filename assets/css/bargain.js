import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	cellContainer: {
		width,
		height: 143,
		marginTop: 10,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,
		borderTopWidth: 1,
		borderTopColor: LINE_COLOR
	},
	bargainNoContainer: {
		width,
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,		
	},
	bargainNoCell: {
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center'
	},
	arrowCell: {
		flex: 1,
		flexDirection: 'row',		
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	bargainText: {
		fontSize: 15,
		color: '#999999',
		marginLeft: 15
	},
	bargainTextNo: {
		fontSize: 15,
		color: '#333333',
	},
	bargainRight: {
		fontSize: 12,
		color: '#999999',	
		marginRight: 10,	
	},
	iconFont: {
		fontFamily: 'iconfont',
		fontSize: 15,
		color: '#cccccc',
		marginRight: 15,
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	leftTitle: {
		fontSize: 15,
		color: '#999999',
		marginLeft: 15.
	},
	leftContainer: {
		flex: 4,
	},
	rightContainer: {
		flex: 1,
		alignItems: 'flex-end',
	},
	statusView: {
		width: 50,
		height: 21,
		marginTop: 16,
		marginRight: 15,
		borderRadius: 2,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#def6ff'
	},
	statusText: {
		fontSize: 12,
		color: '#17A9DF',
	},
	orderNoText: {
		fontSize: 15,
		color: '#999999',
		marginLeft: 15,
		lineHeight: 24,
	},
	listView: {
		flex: 1, 
		position: 'absolute', 
		top: Platform.OS === 'ios' ? 64 : 50, 
		left: 0, 
		right: 0, 
		bottom: 0
	},
});
