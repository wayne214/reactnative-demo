import { StyleSheet, Dimensions } from 'react-native';
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	hiddenCellContainer: {
		width,
		height: 44,
		flexDirection: 'row',
		borderBottomWidth: 1,
		backgroundColor: 'white',
		borderBottomColor: LINE_COLOR,		
	},
	routeCellContainer: {
		width,
		height: 88,
		borderBottomWidth: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
		borderBottomColor: '#e6eaf2',
	},
	cellContainer: {
		width,
		height: 50,
		borderBottomWidth: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
		borderBottomColor: '#e6eaf2',
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	carLengthContainer: {
		width,
		flexDirection: 'row',
		borderBottomWidth: 1,
		backgroundColor: 'white',
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
	routeText: {
		fontSize: 15,
		color:'#333333',
		marginRight: 10,
	},
	rightText: {
		fontSize: 15,
		color:'#cccccc',
		marginRight: 10,
	},
	contentText: {
		flex: 1,
		fontSize: 15,
		color: '#333333',
		marginLeft: 15,
		lineHeight: 18,
		fontWeight: 'bold',
	},
	contentTexts: {
		fontSize: 14,
		color: '#333333',
		marginLeft: 15,
		lineHeight: 18,
	},
	iconFont: {
		marginLeft: 15,
		color: '#dcdcdc',
		fontFamily: 'iconfont',
	},
	optText: {
		fontSize: 12,
		color: '#666666',
		marginRight: 15
	},
	iconFontOpt: {
		fontFamily: 'iconfont',
		fontSize: 12,
		color: '#666666',
		marginRight: 5
	},
	questionContainer: {
		width,
		height: 50,
		borderBottomWidth: 1,
		alignItems: 'center',
		borderBottomColor: LINE_COLOR
	},
	questionText: {
		fontSize: 15,
		color: '#333'
	},
	statusContainer: {
		width,
		height: 50,
		borderBottomColor: LINE_COLOR,
		borderBottomWidth: 1,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	statusCell: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	statusText: {
		fontSize: 15,
		color: '#a3a3a3'
	},
	// contentText: {
	// 	fontSize: 13,
	// 	color: '#5c5c5c'
	// },
	removeBtn: {
		width: 50,
		height: 25,
		backgroundColor: 'white',
		borderColor: '#17a9df',
	},
	removeText: {
		fontSize: 15,
		color: '#17a9df'
	},
	itemContainer: {
		backgroundColor: 'white',
		borderBottomWidth: 1,
		marginBottom: 10,
		borderBottomColor: '#e6eaf2',
	},
	addressView: {
		paddingRight: 15,
		flexDirection: 'row',
		alignItems: 'center'
	},
	iconAddress: {
		marginLeft: 15,
	},
	line: {
		width,
		height: 1,
		backgroundColor: '#e6eaf2'
	},
	optContainer: {
		width,
		height: 50,
		flexDirection: 'row'
	},
	optView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	},
	lineVertical: {
		width: 1,
		height: 30,
		marginTop: 10,
		backgroundColor: '#e6eaf2'
	},
	carLengthText: {
		fontSize: 14,
		color: '#999999',
		marginLeft: 5,
	},
	item: {
		height: 44,
		backgroundColor: 'white'
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
	btnText: {
		fontSize: 14,
		color: 'white'
	},
	carLength:{
		flexDirection: 'row',
		marginLeft: 10,
		marginBottom: 20,
	},
	backView: {
		marginLeft: 8,
		backgroundColor: '#F5F5F5',
		width: 80,
		height: 34,
		justifyContent: 'center',
		alignItems: 'center',
	}, 
	selectedBackView:{
		marginLeft: 8,
		backgroundColor: '#18A9DF',
		width: 80,
		height: 34,
		justifyContent: 'center',
		alignItems: 'center',
	},
	mText:{
		fontSize: 14,
		color: '#333333'
	},
	selectedMText:{
		fontSize: 14,
		color:'#FFFFFF'
	},
	fromToImage:{
		width: 10,
		height: 41,
		marginTop: 4,
		marginBottom: 4,
		marginLeft: 15,
		marginRight: 13
	},
	textView: {
		justifyContent: 'space-between'
	},
	fromtoText: {
		fontSize:17,
		fontWeight: 'bold',
		color: '#333333'
	},
	fromAndToContainer:{
		flex: 1,
		marginTop: 19,
		marginBottom: 19,
		flexDirection: 'row',
		paddingRight: 90
	},
	perRight: {
		flexDirection: 'row',
	}
});
