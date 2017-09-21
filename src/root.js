import React from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore';
import AppReducer from './reducers/index'
import AppWithNavigationState from './navigators/navigators'
const store = configureStore();

class Root extends React.Component {

  constructor(props) {
    super(props);
  	this.store = store
  }

  render() {
    return (
      <Provider store={ this.store }>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('carrier', () => Root)
