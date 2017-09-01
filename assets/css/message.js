import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	cellContainer: {
		// height: 75,
		backgroundColor: 'white',
		borderColor: '#e6eaf2',
		borderWidth: 0.5
	},
	messageCellContainer: {
		// height: 75,
		backgroundColor: 'white',
		borderColor: '#e6eaf2',
		borderWidth: 1
	},
	contentContainer: {
		height: 74,
		flexDirection: 'row',
	},
	checkContainer: {
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	iconContainer: {
		width: 65,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconBg: {
		width: 34,
		height: 34,
		borderRadius: 17,
		alignItems: 'center',
		backgroundColor: '#eee',
		justifyContent: 'center',		
	},
	rightContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	text: {
		color: '#333',
		fontSize: 14,
		lineHeight: 20,
		marginRight: 15,
	},
	timeText: {
		fontSize: 12,
		color: '#999999',
		textAlign: 'right',
		marginRight: 15,
		marginTop: 5,
	},
	unreading: {
		color: 'red', 
		fontSize: 6,
		top: 5,
		right: 5,
		position: 'absolute'
	},
	bottomContainer: {
		bottom: 0,
		left: 0,
		right: 0,
		width,
		// top: height - 60,
		height: 60,
		overflow: 'hidden',
		alignItems: 'center',
		borderTopWidth: 1,
		flexDirection: 'row',
		position: 'absolute',
		backgroundColor: '#eee',
		borderTopColor: '#d9d9d9'
	},
	bottomView:  {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomText: {
		fontSize: 16,
		color: '#2562b4'
	},
	bottomLeftView: {
		marginLeft: 15,
		flexDirection: 'row',
		alignItems: 'center',	
	},
	iconFont: {
		fontFamily: 'iconfont',
	},
	msgDetail: {
		width,
		padding: 15,
		backgroundColor: 'white'
	},
	loginBtn: {
		width: width - 80,
		marginTop: 15,
		marginLeft: 40,
		height: 45
	},	
	btn: {
		width: width - 80,
		height: 44,
		borderColor: '#17a9df',
		backgroundColor: '#17a9df', 
	},
	btnText: {
		fontSize: 15,
		color: 'white',
	},
	footerStyle:{
		width: width,
		height: 40,
	}
});
