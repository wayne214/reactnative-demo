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
    width: 180,
    // height: 100,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  upgradeTextView: {
    width: 180,
    height: 45,
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
  btnView: {
    width: 180,
    height: 55,
    borderTopColor: '#e6eaf2',
    borderTopWidth: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  }
});

export default styles;