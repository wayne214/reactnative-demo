import { StyleSheet } from 'react-native';
import { width } from '../../src/constants/dimen';
import { LINE_COLOR, APP_CONTENT_BACKBG } from '../../src/constants/colors';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: APP_CONTENT_BACKBG
	},
	userIcon: {
		width: 80,
		height: 80,
		backgroundColor: 'transparent'
	},
	userInfoContainer: {
		marginTop: 10,
		alignItems: 'center',
	},
	firstLevelText: {
		fontSize: 15,
		color: '#333'
	},
	topContainer: {
		marginTop: 30,
		alignItems: 'center',
		paddingBottom: 30,
	},
	cellContainer: {
		width,
		height: 50,
		flexDirection: 'row',

	},
	cell: {
		flex: 1,
		justifyContent: 'center'
	},
	rightCell: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',		
	},
	leftText: {
		fontSize: 15,
		color: '#666666',
		marginLeft: 15,
	},
	iconFont: {
		fontFamily: 'iconfont',
		fontSize: 15,
		color: '#cccccc',
		marginRight: 15,
	},
	rightText: {
		fontSize: 15,
		color: '#333333',
		marginRight: 15,
	},
	authText: {
		fontSize: 15,
		color: '#17a9df',
		marginRight: 15,
	}	
});
