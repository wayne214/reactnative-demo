import { StyleSheet, Platform } from 'react-native';
import { width } from '../../src/constants/dimen';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	tipText: {
		fontSize: 18,
		color: '#333333',
		marginTop: 40,
		marginLeft: 15
	},
	cellContainer: {
		width,
		height: 44,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomColor: '#e6eaf2',
		borderBottomWidth: 1,
	},
	cell: {
		flex: 1
	},
	labelText: {
		width: 100,
		fontSize: 15,
		color: '#666666',
		marginLeft: 15
	},
	labelTextPhone: {
		width: 100,
		fontSize: 15,
		color: '#666666',
	},
	labelTextPwd: {
		width: 80,
		fontSize: 15,
		color: '#666666',
		marginLeft: 15
	},	
	textInput: {
		flex: 1,
		padding: 0,
		fontSize: 15
	},
	code: {
		fontSize: 15,
		color: '#17a9df',
		marginRight: 15,
	},
	imgStyle: {
		width: 94,
		height: 29,
		marginRight: 15
	},
	bootomText:{
		marginLeft: 15,
		marginRight: 15,
		backgroundColor: '#fff8ec',
		borderStyle: 'dashed',
		borderColor: '#ffa200',
		borderWidth: 1,
		paddingTop: 10,
		paddingBottom: 10,
	},
	personRegText: {
		fontSize: 14,
		lineHeight: 24,
		color: '#ffa200',
		marginLeft: 15,
		marginRight: 15,
	},
	personRegGaryText: {
		fontSize: 14,
		lineHeight: 24,
		color: '#666666',
		marginLeft: 15,
		marginRight: 15,
	},
	phoneText: {
		fontSize: 14,
		color: '#57bfe7',
		lineHeight: 24,
	},
	loginBtn: {
		marginTop: 20,
		marginRight: 40,
		marginLeft: 40,
		height: 45
	},	
	btn: {
		width: width - 80,
		height: 44,
		borderColor: '#17a9df',
		backgroundColor: '#17a9df', 
	},
	contactView: {
		alignItems: 'center',
		marginTop: 10,
	},
	contactText: {
		fontSize: 15,
		color: '#17a9df',
		textDecorationLine: 'underline',
	},
	btnText: {
		fontSize: 15,
		color: 'white',
	},	
	textViewStyle: {
		height:45,
		backgroundColor: '#f0f2f5',
	},
	textStyle: {
		fontSize: 14, 
		color: '#747474',
	},
	modalStyle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	contentView: {
		width: 270,
		height: 165,
		borderRadius: 5,
		backgroundColor: 'white'
	},
	topView: {
		width: 270,
		height: 115,
		alignItems: 'center',
		justifyContent: 'center',		
		borderBottomColor: '#e6eaf2',
		borderBottomWidth: 1
	},
	checkbox: {
		fontSize: 40,
		color: '#17a9df',
		marginTop: 15,
		fontFamily: 'iconfont'
	},
	regTip: {
		fontSize: 15,
		color: '#333',
		// marginTop: 15
	},
	optView: {
		width: 270,
		height: 50,
		flexDirection: 'row'
	},
	skipView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderRightWidth: 1,
		borderRightColor: '#e6eaf2'
	},
	skipText: {
		fontSize: 15,
		color: '#262626'
	},
	authText: {
		fontSize: 15,
		color: '#17A9DF'		
	},
	bottomContainer: {
		width,
		flexDirection: 'row',
		alignItems: 'center',
	},
	blueTextStyle: {
		fontSize: 14, 
		color: '#17A9DF',
	},
	passwordContainer: {
		flex: 1,
		padding: 0,
	},
  passwordWindow:{
  	position: 'absolute',
  	top: 0,
  	bottom: 0,
  	left: 0,
  	right: 0,
  }
});
