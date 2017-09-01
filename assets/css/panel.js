import { StyleSheet } from 'react-native';
import { width } from '../../src/constants/dimen';

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	userIcon: {
		width: 80,
		height: 80,
		marginTop: 25,
		backgroundColor: 'transparent'
	},
	userInfoContainer: {
		marginTop: 10,
		flex: 1,
		alignItems: 'center',
	},
	firstLevelText: {
		// marginTop: 10,
		fontSize: 15,
		color: '#333'
	},
	firstText: {
		// marginTop: 10,
		fontSize: 15,
		color: '#333',
		textAlign: 'center',

	},
	secondLevelText: {
		fontSize: 12,
		color: '#999',
		marginTop: 5,
		lineHeight: 18,
		marginLeft: 10,
		marginRight: 30
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingTop: 9,
		paddingBottom: 9
	},
	iconFont: {
		fontFamily: 'iconfont',
		fontSize: 15,
		color: '#333',
		marginLeft: 20
	},
	titleContent: {
		marginLeft: 10,
		flexDirection: 'row'
	},
	rightContent: {
		flex: 1,
		marginLeft: 0,
	},
	codeContainer: {
		marginTop: 9,
		alignItems: 'center'
	},
	codeText: {
		fontSize: 12,
		color: '#666',
		marginTop: 5,
		marginBottom: 31
	},
	countView: {
		width: 18,
		height: 18,				
		marginLeft: 5,
		borderRadius: 9,		
		backgroundColor: 'red', 
		alignItems: 'center',
		justifyContent: 'center',
	},
	count: {
		fontSize: 8,
		color: 'white'
	},
	carManagerContainer: {
		flex: 1, 
		marginTop: 21
	},
	topContainer: {
		width: width - 100,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
	},
	gameContainer: {
		flex: 1,
		marginTop: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	gameIcon: {
		width: 137,
		height: 41
	},
	roleIconContainer: {
		position: 'absolute',
		top: 104,
		width: 41,
		height: 13,
		backgroundColor: '#ffac1b',
		borderRadius: 10,
		borderColor: 'white',
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	roleIconText: {
		color: 'white',
		fontSize: 8
	}
});
