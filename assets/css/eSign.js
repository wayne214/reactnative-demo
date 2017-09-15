import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	mainContent:{
		flex:1,
		marginTop: 20,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 40,
	},
	mainView:{
		flex:1,
		flexDirection: 'column',
		backgroundColor: 'white',
		paddingLeft: 15,
		paddingRight: 15,
	},
	fristLineView:{
		flexDirection: 'row',
		height: 44,
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,
	},
	leftTextView:{
		flex: 1,
		justifyContent: 'center'
	},
	fristLineLeftText: {
		fontSize: 14,
		color: '#333333',
		fontWeight: 'bold'
	},
	
	rightView:{
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	fristLineRightTextView: {
		marginRight:10
	},
	fristLineRightText: {
		fontSize: 13,
		color: '#17a9df',
	},
	arrowRightView: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	arrowRight: {
		fontFamily: 'iconfont',
		fontSize: 13,
		color: '#17a9df',
	},
	centerImageView: {
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,
		paddingTop: 20,
		paddingBottom: 20
	},
	centerImage: {
		width: 160,
		height: 160,
	},
	thirdLineView:{
		flexDirection: 'column',
		padding:15
	},
	thirdLeftTextView:{
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	thirdLineLeftText: {
		fontSize: 12,
		color: '#333333',
	},
	thirdLineContentTextView:{
		justifyContent: 'flex-start',
		marginTop:10
	},
	thirdLineContentText: {
		fontSize: 12,
		color: '#999',
		lineHeight:24
	},
	mainTextContent:{
		width,
	},
	mainTextView:{
		flexDirection: 'column',
		
		marginTop: 20
	},
	landscapeLineView:{
		flexDirection: 'column',
		backgroundColor: 'white',
	},
	landscapeView: {
		width,
		flexDirection: 'row',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,
		padding: 15,
	},
	landscapeHalfView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	image:{
		width: 100,
		height: 100
	},
	CellContainer: {
		width,
		height: 44,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,	
		backgroundColor: 'white',	
	},
	cellLeft: {
		flex: 1,
		justifyContent: 'center',
	},
	cellRight: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	cellText: {
		fontSize: 15,
		color: '#666',
		marginLeft: 15,
	},
	textInput: {
		flex:1,
		fontSize: 15,
		color:'#333',
		marginRight: 10,
	},
	arrowText: {
		fontSize: 15,
		color:'#cccccc',
		marginRight: 10,
	},
	saveBtn: {
		width: width - 80,
		marginTop: 40,
		marginLeft: 40,
		marginRight: 40,
		height: 45,
		flexDirection: 'row',
		backgroundColor: '#17a9df',
		justifyContent: 'center',
		alignItems: 'center'
	},
	btn: {
		fontSize: 15,
		color: 'white',
	},
	btnText: {
		fontSize: 15,
		color: 'white',
	},
	arrowRight: {
		fontFamily: 'iconfont',
		fontSize: 15,
		color: '#ccc',
		marginRight: 10,
	},
	arrowTextRight: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	blackArrowText:{
		fontSize: 15,
		color:'#333333',
		marginRight: 10,
	}
});
