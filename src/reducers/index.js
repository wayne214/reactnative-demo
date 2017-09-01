import { combineReducers } from 'redux'

import app from './app'
import nav from './nav'

const initialAuthState = { isLoggedIn: false };

const AppReducer = combineReducers({
  nav,
  app,

});

export default AppReducer
