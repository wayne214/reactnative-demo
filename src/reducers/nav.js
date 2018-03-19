import { combineReducers } from 'redux'
import { NavigationActions } from 'react-navigation'
import { AppNavigator } from '../navigators/navigators'

const firstAction = AppNavigator.router.getActionForPathAndParams('Splash');

const initialNavState = AppNavigator.router.getStateForAction(
  firstAction
);

let flag = true

export default function nav(state = initialNavState, action) {
  let nextState;
  console.log('action=',action);
  if (action.mode && (action.mode !== 'reset' && action.mode !== 'popTo')) throw new Error(`modes not include ${action.mode}`)
  if (action.type === 'pop') {
    if (!action.key) {
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(), state)
    } else {
      // this.props.navigation.dispatch({ type: 'pop', key: 'Second' })
      let currentKeyIndex
        console.log('routes=',state.routes);
      state.routes.forEach((item, index) => {
        console.log('item=',item);
        if (item.routeName === action.key) {
          currentKeyIndex = index
        }
      })
        console.log('****************',state.routes[currentKeyIndex + 1])
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back({
          key: state.routes[currentKeyIndex + 1].key
        }), state)
    }
  } else
  if (action.mode && action.mode === 'reset') {
    nextState = AppNavigator.router.getStateForAction(NavigationActions.reset({
     index: 0,
     actions: [
       NavigationActions.navigate({ routeName: action.type, params: action.params })
     ]
    }), state)
  } else if (action.mode && action.mode === 'popTo') {

  } else if (action.type === 'Navigation/BACK') {
    nextState = AppNavigator.router.getStateForAction(action, state);
  } else if (action.type === 'Navigation/SET_PARAMS') {
    nextState = AppNavigator.router.getStateForAction(action, state);
  } else {
    if (action.type) {
      const actionType = action.type + ''
      if (actionType.includes('ROUTE')) {
        if (flag) {
          flag = false
          nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({
            routeName: action.type,
            params: action.params,
            action: NavigationActions.navigate({ routeName: action.type })
          }), state);
          setTimeout(() => {
            flag = true
          }, 500)
        }
      }
    }

  }

  // switch (action.type) {
  //   case 'Login':
  //     nextState = AppNavigator.router.getStateForAction(
  //       NavigationActions.navigate({ routeName: 'Main' }), state);
  //     break;
  //   case 'Logout':
  //     nextState = AppNavigator.router.getStateForAction(
  //       NavigationActions.back(), state);
  //     break;
  //   case 'Welcome':
  //     nextState = AppNavigator.router.getStateForAction(
  //       NavigationActions.navigate({ routeName: 'Welcome' }), state);
  //     break;
  //   case 'Main':
  //   	nextState = AppNavigator.router.getStateForAction(NavigationActions.reset({
		// 	  index: 0,
		// 	  actions: [
		// 	    NavigationActions.navigate({ routeName: 'Main'})
		// 	  ]
		// 	}), state)
  //     break;
  //   default:
  //     nextState = AppNavigator.router.getStateForAction(action, state);
  //     break;
  // }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}
