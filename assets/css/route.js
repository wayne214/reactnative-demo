import { StyleSheet, Dimensions } from 'react-native';
import { APP_CONTENT_BACKBG, LINE_COLOR } from '../../src/constants/colors';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
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
	contentText: {
		flex: 1,
		fontSize: 14,
		color: '#333333',
		marginLeft: 15,
		lineHeight: 18,
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
	}
});
