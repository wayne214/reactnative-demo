import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	cell: {
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#d9d9d9',
	},
	info: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom:10,
	},
	operation: {
		flex: 1,
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
	},
	line: {
		height: 1,		
		width: width - 30,
		marginLeft: 15,
		marginRight: 15,
		backgroundColor: '#e6e6e6'
	},
	iconFont: {
		color: '#666',
		fontSize: 15,
		marginLeft: 15,
		marginTop: 1,
		fontFamily: 'iconfont',
	},
	optText: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	firstLevelLeftText: {
		width: (width - 30)/3 - 40,
		fontSize: 15,
		color: '#333333',
	},
	firstLevelText: {
		fontSize: 15,
		color: '#333333',
	},
	optBtn: {
		flex: 1,
		marginRight: 15,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	secondLevelText: {
		fontSize: 12,
		color: '#666666',
	},
	optView: {
		flexDirection: 'row',
		alignItems: 'center',		
	},
	image: {
		width: 40,
		height: 40,
		marginLeft: 15,
		borderRadius: 20,
	},
	rightContent: {
		flex: 1,
		height: 70,
		marginLeft: 15,
	},
	centerContent: {
		flexDirection: 'row',
	},
	carStatus: {
		flex: 1,
		marginRight: 15,
		alignItems: 'flex-end',
	},
	pass: {
		fontSize: 12,
		color: '#2562b4'
	},
	working: {
		fontSize: 12,
		color: '#ff8900'
	},
	unpass: {
		fontSize: 12,
		color: '#ea574c'
	},
	filterContainer: {
		width,
		left: 0,
		right: 0,
		height: 290,
		overflow: 'hidden',
		position: 'absolute',
		backgroundColor: 'white',
		top: Platform.OS === 'ios' ? 64 : 50		
	},
	modalStyle: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	filterCell: {
		marginTop: 15,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputContainer: {
		flex: 3,
		height: 34,		
		borderRadius: 5,
		borderWidth: 0.5,
		marginLeft: 15,
		borderColor: '#d9d9d9',
		backgroundColor: 'white'
	},
	input: {
		color: '#333',
		marginLeft: 10,
	},	
	leftText: {
		flex: 1,
		fontSize: 14,
		color: '#666666'
	},
	btnPress: {
		flex: 1,
		height: 34,
		backgroundColor: 'white', 
		borderColor: '#2562b4'
	},
	btnUnPress: {
		flex: 1,
		height: 34,	
		backgroundColor: 'white', 
		borderColor: '#d9d9d9'
	},
	textPress: {
		color: '#2562b4', 
		fontSize: 14
	},
	textUnPress: {
		color: '#666', 
		fontSize: 14
	},
	btnWithIcon: {
		width: 260,
		height: 34,
		marginTop: 10,
	},
	btnText: {
		fontSize: 14,
		color: 'white'
	},
	listView: {
		flex: 1, 
		left: 0, 
		right: 0, 
		bottom: 0
	},
	cellTipContainer: {
		width,
		height: 44,
		flexDirection: 'row',
		backgroundColor: '#f4f4f4',
	},
	speLeft: {
		flex: 1,
		marginLeft: 15,
		justifyContent: 'center'
	},
	speRight: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginRight: 15
	},
	tipText: {
		fontSize: 14,
		color: '#333333'
	},
	hiddenContainer: {
		width,
		height: 132,
		overflow: 'hidden',
		backgroundColor: 'white'
	},
	hiddenCellContainer: {
		width,
		height: 44,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,		
	},
	hiddenLeft: {
		flex: 1,
		justifyContent: 'center',
	},
	hiddenRight: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	hiddenText: {
		fontSize: 15,
		color: '#666',
		marginLeft: 15,
	},
	hiddenTextCube: {
		fontSize: 15,
		color: '#666',
		marginRight: 15,
	},	
	textInput: {
		flex: 1,
		padding: 0,
		marginRight: 15,
	},
	rightText: {
		fontSize: 15,
		color:'#cccccc',
		marginRight: 10,
	},
	blockContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#e6eaf2'
	},
	loginBtn: {
		marginTop: 20,
		marginRight: 40,
		marginLeft: 40,
		height: 45
	},
	loginView: {
		marginTop: 20,
		marginRight: 40,
		marginLeft: 40,
	},	
	btn: {
		width: width - 80,
		height: 44,
		borderColor: '#17a9df',
		backgroundColor: '#17a9df', 
	},
	smallBtn: {
		width: width/2 - 80,
		height: 44,
		borderColor: '#17a9df',
		backgroundColor: '#17a9df', 
	},
	btnText: {
		fontSize: 15,
		color: 'white',
	},
	arrowRight: {
		fontFamily: 'iconfont',
		fontSize: 15,
		color: '#ccc',
		marginRight: 15
	},
	authContainer: {
		width,
		height: 44,
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	authing: {
	 fontSize: 15,
	 color: '#ffc867',
	 marginLeft: 15,
	},
	authFail: {
	 fontSize: 15,
	 color: '#f18f88',
	 marginLeft: 15,		
	},
	authBtnContainer: {
		marginTop: 20,
		marginRight: 40,
		marginLeft: 40,
		height: 45,
		marginBottom: 20
	},
	btnAuth: {
		width: width - 80,
		height: 44,
		borderColor: '#17a9df',
		backgroundColor: '#17a9df', 		
	},
	btnAuthText: {
		fontSize: 15,
		color: 'white'
	},
	imgContainer: {
		backgroundColor: 'white'
	},
	imgContent: {
		width,
		backgroundColor: 'white',
	},
	img: {
		width: 200,
		height: 150,
		marginTop: 10,
		alignSelf: 'center'
	},
	imgCellContainer: {
		width,
		height: 44 + 170,
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,		
	},
	imgLeftContainer: {
		width,
		height: 44,
		justifyContent: 'center'
	},
	imgBContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	imgBottom: {
		width: 200,
		height: 150,
		marginTop: -10,
		alignSelf: 'center'
	},	
	skipText: {
		color: '#17a9df',
		fontSize: 15,
	},
	skipContainer: {
		marginTop: 20,
		// paddingBottom: 20,
		alignItems: 'flex-end',
	}	,
	nameLeft: {
		flex: 2,
		justifyContent: 'center',
	},
	nameRight: {
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	routeText: {
		fontSize: 15,
		color:'#333333',
		marginRight: 10,
	},
	modal: {
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		width: 200,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		position: 'absolute'
	},
	modalNew: {
		top: 0,
		bottom: 0,
		width: 200,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		position: 'absolute'
	},
	uploadText: {
		color: 'white',
		fontSize: 15
	},
	IDViewStyle: {
		width,
		height: 150 + 15,
		backgroundColor: 'white',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,
	},
	IDImgStyle: {
		width: 200,
		height: 150,
		marginBottom: 15,
	},
	touchStyle:{
		marginLeft: 170,
		marginTop: 120,
		width: 30,
		height: 30,
	},
	enlargeStyle:{
		width: 30,
		height: 30,
	}
});