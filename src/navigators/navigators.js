import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator'
import * as RouteType from '../constants/routeType'


import SplashScreen from '../containers/app/splash'
import WelcomeScreen from '../containers/app/welcome'
import LoginScreen from '../containers/user/shipperLogin'

import MainScreen from '../containers/app/main'
import GoodsListContainer from '../containers/routes/goodsList';
import TravelContainer from '../containers/travel/travel';
import OrderContainer from '../containers/order/order';
import EntrustOrderContainer from '../containers/entrust/entrustOrder';
import SettingScreen from '../containers/user/setting';
import AgreementScreen from '../containers/user/agreement';

import HelpScreen from '../containers/user/help';
import HelpDetailScreen from '../containers/user/helpDetail';
import HelpDetailForFeedbackScreen from '../containers/user/helpDetailForFeedback';
import AddFeedbackScreen from '../containers/user/addFeedback';
import CompanyListScreen from '../containers/user/companyList';
import DriverManagerScreen from '../containers/user/driverManager';
import DriverInfoDetailScreen from '../containers/user/driverInfoDetail';
import AddDriverScreen from '../containers/user/addDriver';

export const AppNavigator = StackNavigator({
  Splash: {
    screen: SplashScreen,
    navigationOptions: {
      header: null
    }
  },
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      header: null
    }
  },
  Main: {
		screen: MainScreen,
		navigationOptions: {
      // header: null,
			// title: '主页',
      headerBackTitle: null
		}
  },
  [RouteType.ROUTE_HELP]: {
    screen: HelpScreen,
    navigationOptions: {
      // header: null,
      // title: '帮助',
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_ADD_FEEDBACK]: {
    screen: AddFeedbackScreen,
    navigationOptions: {
      // header: null,
      // title: '反馈问题',
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_HELP_DETAIL]: {
    screen: HelpDetailScreen,
    navigationOptions: {
      // header: null,
      // title: '反馈问题',
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_HELP_DETAIL_FOR_FEEDBACK]: {
    screen: HelpDetailForFeedbackScreen,
    navigationOptions: {
      // header: null,
      // title: '反馈问题',
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_LOGIN]: { screen: LoginScreen },
  GoodsListContainer: { screen: GoodsListContainer },
  TravelContainer: { screen: TravelContainer },
  OrderContainer: { screen: OrderContainer },
  EntrustOrderContainer: { screen: EntrustOrderContainer },
  [RouteType.ROUTE_SETTING]: { 
    screen: SettingScreen,
    navigationOptions: {
      // header: null,
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_AGREEMENT_CONTENT]: { 
    screen: AgreementScreen,
    navigationOptions: {
      // header: null,
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_COMPANY_LIST]: { 
    screen: CompanyListScreen,
    navigationOptions: {
      // header: null,
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_DRIVER_MANAGER]: { 
    screen: DriverManagerScreen,
    navigationOptions: {
      // header: null,
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_DRIVER_INFO_DETAIL]: { 
    screen: DriverInfoDetailScreen,
    navigationOptions: {
      // header: null,
      gesturesEnabled: false
    }
  },
  [RouteType.ROUTE_ADD_DRIVER]: { 
    screen: AddDriverScreen,
    navigationOptions: {
      // header: null,
      gesturesEnabled: false
    }
  },
  
}, {
  // mode: 'modal',
  initialRouteName: 'Splash',
  transitionConfig: TransitionConfiguration
});

const TransitionConfiguration = () => ({
  screenInterpolator: (sceneProps) => {
    const { scene } = sceneProps;
    const { route } = scene;
    const params = route.params || {};
    const transition = params.transition || 'forHorizontal';
    return CardStackStyleInterpolator[transition](sceneProps);
  },
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);