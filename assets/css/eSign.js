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
	},
	landscapeLineView:{
		flexDirection: 'column',
		backgroundColor: 'white',
	},
	landscapeView: {
		width,
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: LINE_COLOR,
		padding: 15,
	},
	landscapeHalfView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20
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
		width: width - 40,
		marginTop: 40,
		marginLeft: 20,
		marginRight: 30,
		height: 45,
		flexDirection: 'row',
		backgroundColor: '#0092FF',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4
	},
	btn: {
		fontSize: 17,
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
	},
	titleContainer: {
      height: 44,
			backgroundColor: '#FFFAF4',
			alignItems: 'center',
			paddingHorizontal: 20,
			flexDirection: 'row'
	},
	colorContainer: {
      height: 44,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: 20
	},
	colorText: {
      color: '#666666',
			fontSize: 14
	},
    separateLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
    },
});
