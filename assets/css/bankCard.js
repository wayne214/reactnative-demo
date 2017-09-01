import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f4f4f4'
	},
	image: {
		width,
		height: 180,
	},
	topContent: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0)'
	},
	titleText: {
		fontSize: 14,
		color: '#b8d6ff',
		marginTop: 46,
	},
	accView: {
		marginTop: 20,		
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	accText: {
		fontSize: 50,
		color: 'white',
	},
	unitText: {
		fontSize: 15,
		color: 'white',		
		marginBottom: 10,
	},
	menuView: {
		width,
		height: 82,
		flexDirection: 'row',
		borderBottomColor: '#e6e6e6',
		borderBottomWidth: 1,
		backgroundColor: 'white'
	},
	cellView: {
		flex: 1,
		alignItems: 'center',
	},
	line: {
		width: 0.5,
		height: 82,
		backgroundColor: '#e6e6e6',
	},
	iconFont: {
		fontSize: 20,
		color: '#666666',
		marginTop: 18,
		fontFamily: 'iconfont',
	},
	text: {
		fontSize: 15,
		color: '#333',
		marginTop: 12,
	},
	tipView: {
		height: 100, // 15395170409
		flexDirection: 'row'
	},
	accountView: {
		height: 50,
		borderColor: '#e6e6e6',
	},
	accountLeftView: {
		flex: 3, 		
		flexDirection: 'row', 
		alignItems: 'center',
	},	
	accountText: {
		fontSize: 15,
		color: '#333',
		marginLeft: 15,
	},
	account: {
		fontSize: 17,
		color: '#ff8100'
	},
	accountRightView: {
		flex: 1,
		marginRight: 15,
		flexDirection: 'row',
		alignItems: 'center',
	},	
	walletText: {
		color: '#999',
		fontSize: 13,
	},
	arrowRight: {
		color: '#ccc',
		fontSize: 13,
		fontFamily: 'iconfont',
	},	
	lineModule: {
		width,
		height: 0.5,
		backgroundColor: '#e6e6e6',
	},
	items: {
		flex: 1,
		height: 50,
		backgroundColor: 'white',
		alignItems: 'center',
		flexDirection: 'row',
	},
	specator: {
		height: 0.5,
		marginLeft: 15,
		marginRight: 15,
		backgroundColor: '#e6e6e6',		
	},
	leftText: {
		flex: 1,
		marginLeft: 15,
		fontSize: 15,
		color: '#666666',
	},
	centerText: {
		flex: 1,
		fontSize: 15,
		color: '#333333',
		textAlign: 'center'
	},
	rightText: {
		flex: 1,
		fontSize: 12,
		marginRight: 15,		
		color: '#999999',	
		textAlign: 'right',
	},
	noResultView: {
		flex: 1,
		alignItems: 'center',
	},
	noBill: {
		width: 165,
		height: 165,
		marginTop: 30,
	}
});