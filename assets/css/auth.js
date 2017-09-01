import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	tabViewContainer: {
		width,
		height: 50,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	tabViewCell: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	curNumView: {
		width: 12,
		height: 12,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#17a9df'
	},
	curNumText: {
		fontSize: 10,
		color: 'white',
	},
	curTipText: {
		fontSize: 15,
		color: '#17a9df'
	},
	numView: {
		width: 12,
		height: 12,
		marginRight: 5,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#d8d8d8'		
	},
	tipText: {
		fontSize: 15,
		color: '#999999'		
	},
	line: {
		width: 110,
		height: 2,
		bottom: 0,
		position: 'absolute',
		backgroundColor: '#17a9df'
	},
	hiddenLine: {
		width: 110,
		height: 2,
		bottom: 0,
		position: 'absolute',
		backgroundColor: 'white'
	},
	contentContainer: {
		// flex: 1,
		// backgroundColor: 'gray'
	},
	desText: {
		fontSize: 14,
		// lineHeight: 50,
		color: '#333333',
		marginLeft: 15
	},
	hiddenCellContainer: {
		width,
		height: 44,
		flexDirection: 'row',
		borderBottomWidth: 1,
		backgroundColor: 'white',
		borderBottomColor: LINE_COLOR,		
	},	
	hiddenRight: {
		flex: 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	textRight: {
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	hiddenText: {
		fontSize: 15,
		color: '#666',
		marginLeft: 15,
	},	
	hiddenLeft: {
		flex: 1,
		justifyContent: 'center',
	},	
	textLeft:
	{
		flex: 2,
		justifyContent: 'center',
	},
	checkBoxContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	textInput: {
		flex: 1,
		padding: 0,
		marginRight: 15,
	},
	inputText: {
		flex: 3,
		padding: 0,
		marginRight: 15,
	}	,
	btnContainer: {
		marginTop: 20,
		flexDirection: 'row'
	},
	btnContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	btnStyle: {
		width: 130,
		height: 44,
		borderColor: '#17a9df',
		backgroundColor: '#17a9df'
	},
	btnTextStyle: {
		fontSize: 15,
		color: 'white',
	},
	loginBtn: {
		width: width - 80,
		marginTop: 15,
		marginRight: 40,
		marginLeft: 40,
		// height: 45,
		marginBottom: 20
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
	imgItem: {
		width: 200,
		height: 150,
		marginTop: 30,
		backgroundColor: 'gray'
	},
	desTextContainer: {
		width,
		height: 50,
		// flexDirection: 'row',
		justifyContent: 'center'
		// alignItems: 'flex-start',
	},
	imgContent: {
		width,
		height: 210,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	imgContents: {
		marginTop:20,
		marginBottom: 10,
		width: 200,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
	},	
	pressStyle: {
		width: 200,
		height: 150,
	},
	img: {
		width: 200,
		height: 150,
		// marginTop: 30,
		// alignSelf: 'center'
	},
	imgContainer: {
		width,
		height: 550,
		alignItems: 'center',
		backgroundColor: 'white'
	},
	checkbox: {
		width: 20,
		height: 20,
		marginRight: 5,
	},
	checkBoxText: {
		fontSize: 15,
		color: '#333',
		marginRight: 10
	},
	codetext: {
		fontSize: 15,
		color: '#17a9df',
		marginRight: 15,
	},
	skipText: {
		color: '#17a9df',
		fontSize: 15,
	},
	skipContainer: {
		marginTop: 20,
		alignItems: 'flex-end',
	},
	imgStyle: {
		width: 94,
		height: 29,
		marginRight: 15
	},
	IDLeft: {
		flex: 2,
		justifyContent: 'center',
	},	
	IDRight: {
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	IDCellContainer: {
		width,
		height: 44,
		backgroundColor: 'white',	
	},	
	IDViewStyle: {
		width,
		height: 150 + 15,
		backgroundColor: 'white',
		alignItems: 'center',
	},
	IDImgStyle: {
		width: 200,
		height: 150,
		marginBottom: 15,
	},
	rightText: {
		flex: 1,
		padding: 0,
		marginRight: 15,
		textAlign : 'right',
		fontSize: 15,
	},
	companyText: {
		flex: 3,
		padding: 0,
		marginRight: 15,
		textAlign : 'right',
		fontSize: 15,
	},
	AuthBtn: {
		width: width - 80,
		marginTop: 15,
		marginRight: 40,
		marginLeft: 40,
	},
	modal: {
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		position: 'absolute'
	},
	uploadText: {
		color: 'white',
		fontSize: 15
	},
	imageContainer:{
		backgroundColor: 'white'
	},
	imageContent: {
		width,
		backgroundColor: 'white',
	},
	imgView: {
		width: 200,
		height: 150,
		alignSelf: 'center'
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
	},
	viewStyle:{
	 width: width, 
	 height: 15, 
	 backgroundColor: 'white'
	}
});
