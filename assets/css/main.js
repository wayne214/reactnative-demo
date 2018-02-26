import { StyleSheet, Platform } from 'react-native';
import { width } from '../../src/constants/dimen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  titleStyle: {
    marginBottom: 4,
    fontWeight: 'bold'
  },
  selectedTitleStyle: {
    color: '#17a9df',
    fontWeight: 'bold'
  },
  badgeBg: {
    width: 14,
    height: 14,
    marginTop: 6
  },
  badgeText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: Platform.OS === 'android' ? null : 'transparent'
  },
  tabIcon: {
    height: 20,
    width: 20,
    resizeMode: 'cover'
  },
  driverTabIcon:{
      fontFamily: 'iconfont',
      fontSize: 16,
      color: '#B4B4B4',
  },
  driverSelectedTabIcon:{
      fontFamily: 'iconfont',
      fontSize: 16,
      color: '#0092FF',
  },
  routeIcon: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center'
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
    width: 280,
    height: 350,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  upgradeTextView: {
    width: 180,
    height: 45,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  upgradeTip: {
    fontSize: 20,
    color: '#333',
    marginTop: 30
  },
  upgradeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    lineHeight: 21
  },
  btnView: {
    width: 180,
    height: 55,
    borderTopColor: '#e6eaf2',
    borderTopWidth: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  optContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: 280,
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5'
  },
  optCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F1F1F1'
  }
});

export default styles;
