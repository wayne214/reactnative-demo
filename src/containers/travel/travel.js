import React from 'react'
import {
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  ImageBackground
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DrawerNavigator } from 'react-navigation'
import NavigatorBar from '../../components/common/navigatorbar'
import BaseComponent from '../../components/common/baseComponent'
import styles from '../../../assets/css/home'
import Route from '../../components/travel/route'
import Linking from '../../utils/linking'
import Toast from '../../utils/toast'
import * as RouteType from '../../constants/routeType'
import TabView from '../../components/common/tabView'

class HomeContainer extends BaseComponent {

  constructor(props) {
    super(props)
    this.title = '行程';
    this.state = {};
  }

  static propTypes = {
    router: PropTypes.object,
    click: PropTypes.func,
  }

  componentDidMount() {
    super.componentDidMount()
    const { user } = this.props;
    if (!user || !user.userId) return
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  render() {
    const { user } = this.props
    return (
      <View style={ styles.container }>
        {
          user.currentUserRole === 1 ?
            <NavigatorBar
              title='我的行程'
              backIconFont='&#xe60a;'
              firstLevelIconFont='&#xe609;'
              secondLevelIconFont='&#xe60b;'
              thirdLevelIconFont='&#xe60f;'
              firstLevelIconFontStyle={{ fontSize: 24 }}
              backViewClick={ this.props.openControlPanel }
              thirdLevelClick={ () => Linking.link(this.props.hotLine) }
              secondLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }}) }
              firstLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_LIST, params: { title: '' }}) }/>
          :
            <NavigatorBar
              title='我的行程'
              backIconFont='&#xe60a;'
              firstLevelIconFont='&#xe60b;'
              secondLevelIconFont='&#xe60f;'
              backViewClick={ this.props.openControlPanel }
              secondLevelClick={ () => Linking.link(this.props.hotLine) }
              firstLevelClick={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_MESSAGE_LIST, params: {title: '我的消息', currentTab: 0 }}) }/>
        }

        <TabView
          tabs={ ['运输中车辆', '空余车辆'] }
          changeTab={ index => console.log('--index: ', index) } />

        { this.props.loading ? this._renderLoadingView() : null }
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { app, travel, nav } = state;
  return {
    nav,
    user: app.get('user'),
    loading: app.get('loading'),
    loadingPage: app.get('loadingPage'),
    travelDetail: travel.get('travelDetail'),
    carPayLoad: travel.get('carPayLoad'),
    payload: travel.get('payload'),
    hotLine: app.get('hotLine'),
    isNeedRefreshTravel: travel.get('isNeedRefreshTravel')
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
