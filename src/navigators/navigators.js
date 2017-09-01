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
  [RouteType.ROUTE_LOGIN]: { screen: LoginScreen },
  GoodsListContainer: { screen: GoodsListContainer },
  TravelContainer: { screen: TravelContainer },
  OrderContainer: { screen: OrderContainer },
  EntrustOrderContainer: { screen: EntrustOrderContainer },
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