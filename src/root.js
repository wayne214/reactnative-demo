import React from 'react'
import { AppRegistry, PixelRatio } from 'react-native'
import { Provider } from 'react-redux'
import './utils/global.js'
import configureStore from './store/configureStore';
import AppReducer from './reducers/index'
import AppWithNavigationState from './navigators/navigators'
const store = configureStore();
import {DEBUG} from './constants/setting';

class Root extends React.Component {

  constructor(props) {
    super(props);
  	this.store = store;
      // 生产环境日志打印重定向，提高性能
      if (!DEBUG) {
          console.log = () => {
          };
          console.error = () => {
          };
          console.warn = () => {
          };
          global.ErrorUtils.setGlobalHandler(() => {
          });
      }
      // 开发模式下关闭黄屏警告
      // console.disableYellowBox = true;
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
