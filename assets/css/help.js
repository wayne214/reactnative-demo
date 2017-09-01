import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	cellContainer: {
		width,
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR
	},
	textContent: {
		flex: 5,
		justifyContent: 'center',
	},
	iconContent: {
		flex: 1,
		alignItems: 'flex-end'
	},
	timeContent: {
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	timeText: {
		fontSize: 15,
		color: '#9e9e9e',
	},
	feedbackLeftContainer:{
		width,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 15
	},
	feedbackRightContainer:{
		width,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		padding: 15
	},
	feedbackRightContent: {
		width: width - 40 - 30*2,
		flexDirection: 'column',
		justifyContent: 'center',
		marginRight: 10
	},
	feedbackRightTextContainer:{
		borderRadius: 5,
		backgroundColor: '#17a9df',
		padding: 5
	},
	feedbackRightText: {
		fontSize: 15,
		color: 'white',
		lineHeight: 24
	},
	rightTimeTextContainer: {
		justifyContent:'flex-end',
		alignItems: 'flex-end',
	},
	rightTimeText: {
		fontSize: 13,
		color: '#9e9e9e',
	},
	feedbackLeftTextContainer:{
		borderRadius: 5,
		backgroundColor: '#e6eaf2',
		padding: 5
	},
	feedbackLeftContent: {
		width: width - 40 - 30*2,
		flexDirection: 'column',
		justifyContent: 'center',
		marginLeft: 10
	},
	feedbackLeftText: {
		fontSize: 15,
		color: '#9e9e9e',
		lineHeight: 24
	},
	leftTimeTextContainer: {
		justifyContent:'flex-start',
		alignItems: 'flex-start',
	},
	leftTimeText: {
		fontSize: 13,
		color: '#9e9e9e',
	},
	questText: {
		fontSize: 15,
		color: '#9e9e9e',
		marginLeft: 15,
	},
	iconFont: {
		fontFamily: 'iconfont',
		fontSize: 15,
		color: '#cccccc',
		marginRight: 15,
	},
	questTitle: {
		fontSize: 15,
		color: '#828282',
		paddingLeft: 15,		
		paddingRight: 15,
		lineHeight: 24,
		paddingTop: 10,
		paddingBottom: 10,
	},
	queContainer: {
		width,
		marginTop: 20,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderTopColor: LINE_COLOR,
		borderBottomColor: LINE_COLOR		
	},
	ansContainer: {
		width,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR		
	},
	image: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	inputContainer: {
		width: width - 40,	
		height: 150,	
		borderRadius: 5,
		borderWidth: 0.5,
		margin: 20,
		borderColor: '#d9d9d9',
		backgroundColor: 'white'
	},
	inputTxt: {
		width: width - 60,	
		height: 150,	
		color: '#333',
		margin: 10,
		fontSize: 14,
	},
	btnContainer: {
		width: width - 80,
		marginTop: 15,
		marginLeft: 40,
		marginRight: 40,
		height: 45,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#4ea7db', 
	},
	btnPress: { 
		fontSize: 14,
		color: 'white'
	},
	btnText: {
		fontSize: 14,
		color: 'white'
	},
});