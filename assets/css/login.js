import { Platform, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingBottom: 20
	},
	logo: {
		width: 205,
		height: 64,
		marginTop: 60,
		alignSelf: 'center',
		justifyContent: 'center'
	},
	cell: {
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 40,
		marginRight: 40,
		borderColor: '#f7f8fb',
		borderWidth: 1,
		borderRadius: 2,
	},
	iconFont: {
		fontSize: 16,		
		color: '#2562b4',
		fontFamily: 'iconfont',
		alignItems: 'center',
		marginLeft: 16
	},
	iconFontRight: {
		fontSize: 16,		
		color: '#cccccc',
		fontFamily: 'iconfont',
		alignItems: 'center',
		marginLeft: 16
	},
	logoContainer: {
		marginTop: 30,
	},
	input: {
		flex: 1,
		color: '#333',
		marginLeft: 10,
		padding: 0,
	},
	line: {
		width: 70,
		height: 1,
		marginTop: 10,
		marginLeft: 40,
		marginRight: 40,
		backgroundColor: '#17a9df',
	},
	bottomView: {
		width: width - 80,
		height: 40,
		marginTop: 10,
		marginLeft: 40,
		flexDirection: 'row',
		alignItems: 'center',
	},
	forgetView: {
		flex: 1,
	},
	registerView: {
		flex: 1,
		height: 40,
		justifyContent: 'center',
		alignItems: 'flex-end',		
	},
	text: {
		fontSize: 14,
		color: '#2562b4',		
	},
	clear: {
		fontSize: 18,
		color: '#bdbdbd',
		fontFamily: 'iconfont',		
	},
	showPwd: {
		fontSize: 18,
		marginLeft: 10,			
		color: '#bdbdbd',
		fontFamily: 'iconfont',
	},
	loginBtn: {
		width: width - 80,
		marginTop: 15,
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
		fontSize: 15,
		color: 'white',
	},
	btnRegText: {
		fontSize: 15,
		color: '#666666',
	},	
	btnRegister: {
		width: width - 80,
		height: 44,
		borderColor: '#e6eaf2',
		backgroundColor: '#e6eaf2', 
	},
	roleContiner: {
		marginTop: 40,
		flexDirection: 'row',
	},
	roleView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	roleText: {
		fontSize: 15,
		color: '#333'
	},
  upgradeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  upgradeView: {
    width: 180,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  upgradeText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15
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
