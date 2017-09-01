import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f0f2f5'
	},
	navContainer: {
		width,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#e6eaf2',
		backgroundColor: 'white',
		alignItems: 'center'
	},
	searchBar: {
		flex: 6,
		height: width <= 375 ? 25 : 25 * 1.5,
		marginLeft: 15,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 2,
		backgroundColor: '#f0f2f5'
	},
	textContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cancelText: {
		color: '#999',
		fontSize: width <= 375 ? 12 : 12 * 1.5,
	},
	iconFont: {
		fontSize: width <= 375 ? 13 : 13 * 1.5,
		color: '#999',
		marginLeft: 10,
		fontFamily: 'iconfont',
	},
	placehold: {
		fontSize: width <= 375 ? 12 : 12 * 1.5,
		color: '#ccc',
		marginLeft: 10
	},
	titleText: {
		width,
		height: 44,
		marginTop: 10,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	titleCell: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cellText: {
		fontSize: 14,
		color: '#999999'
	},
	line: {
		width: width - 50,
		height: 1,
		marginLeft: 25,
		backgroundColor: '#e6eaf2'
	},
	modal: {
		flex: 1,
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)'
	},
	inputContent: {
		flex: 1,
		paddingLeft: 10,
		padding: 0
	},
	itemCell: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	itemCellPhone: {
		flex: 3,
		alignItems: 'center',
		justifyContent: 'center',
	}
});
