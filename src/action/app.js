import * as ActionTypes from '../constants/actionType';
// import ActionCreator from './actionCreate';
import Storage from '../utils/storage';
import Http from '../middleware/api';


export function changeTab(tab) {
	return {
		type: ActionTypes.ACTION_CHANGE_TAB,
		payload: tab
	};
}

export function changeCenter(tab) {
	return {
		type: ActionTypes.ACTION_CHANGE_CENTER,
		payload: tab
	};
}

export function getInitStateFromDB() {
	return dispatch => {
		Storage.get('user').then(result => {
			if (result) {
				dispatch(receiverUser(result));
			} else {
				dispatch(receiverUser({}));
			}
		});
	}
}

export function fetchData(params) {
	return {
		type: ActionTypes.ACTION_FETCH_DATA,
		payload: params
	};
}

export function upgrade(params) {
	return {
		type: ActionTypes.APP_UPGRADE,
		payload: params
	};
}

export function loadUser(user) {
	return {
		type: ActionTypes.LOAD_USER,
		payload: user
	}
}

export function mergeUser(user) {
	return {
		type: ActionTypes.ACTION_MERGE_USER,
		payload: user
	}
}

export function updateOSSConfig(params) {
	return {
		type: ActionTypes.ACTION_UPDATE_OSS_CONFIG,
		payload: params
	};
}

function receiverUser(user) {
	return {
		type: ActionTypes.LOAD_USER,
		payload: user
	}
}

export function receiverAlias(value) {
	return {
		type: ActionTypes.ACTION_ALIAS,
		payload: value
	}
}

function receiverAlias(value) {
	return {
		type: ActionTypes.ACTION_ALIAS,
		payload: value
	}
}


function receiveStatus(str) {
	return {
		type: ActionTypes.ACTION_GET_INITED,
		payload: str
	}
}

export function getInitStatus() {
	return {
		type: ActionTypes.ACTION_GET_INITED,
	}
}

export function logout() {
	return {
		type: ActionTypes.APP_USER_LOGOUT
	}
}

export function getOOSConfig (params) {
	return {
		type: ActionTypes.OOS_CONFIG,
		payload: params
	}
}

export function openNotification(params) {
	return {
		type: ActionTypes.ACTION_NOTIFICATION,
		payload: params
	}
}

export function setAppState(params) {
	return {
		type: ActionTypes.ACTION_SET_APPSTATE,
		payload: params
	}
}

export function showFloatDialog(params) {
	return {
		type: ActionTypes.ACTION_SHOW_FLAOT_DIALOG,
		payload: params
	}
}

export const entrustListShouldRefresh = (params)=>{
	return {
		type: ActionTypes.ACTION_SHOULD_ENTRUST_ORDER_LIST_REFRESH,
		payload: params
	}
}

export function clearImageSource(){
	return{
		type: ActionTypes.ACTION_CLEAR_IMG_SOURCE,
	}
}

export function refreshTravel() {
	return {
		type: ActionTypes.ACTION_REFRESH_TRAVEL
	}
}

export function redictLogin() {
	return {
		type: ActionTypes.ACTION_REDICT_LOGIN	
	}
}

export function login({ success, fail, ...others }) {
	return dispatch => {
		dispatch({ type: ActionTypes.SHOW_LOADING });
		return Http({ ...others }).then((response) => {
			success(response);
			dispatch({ type: ActionTypes.HIDDEN_LOADING });
		}).catch((error) => {
			fail(error);
			dispatch({ type: ActionTypes.HIDDEN_LOADING });
		});
	}
}

export function register({ success, fail, ...others }) {
	return dispatch => {
		dispatch({ type: ActionTypes.SHOW_LOADING });
		return Http({ ...others }).then((response) => {
			success(response);
			dispatch({ type: ActionTypes.HIDDEN_LOADING });
		}).catch((error) => {
			fail(error);
			dispatch({ type: ActionTypes.HIDDEN_LOADING });
		});
	}
}
export function getSmsCode({ success, fail, ...others }) {
	return dispatch => {
		dispatch({ type: ActionTypes.SHOW_LOADING });
		return Http({ ...others }).then((response) => {
			success(response);
			dispatch({ type: ActionTypes.HIDDEN_LOADING });
		}).catch((error) => {
			fail(error);
			dispatch({ type: ActionTypes.HIDDEN_LOADING });
		});
	}
}

// 忘记登录密码(重置登录密码)
export const resetLoginPwd = ({ success, ...others })=>{
	return dispatch => {
		dispatch({ type: ActionTypes.SHOW_LOADING });
		return Http({ ...others }).then((response) => {
			success(response);
			dispatch({ type: ActionTypes.HIDDEN_LOADING });
		}).catch((error) => {
			dispatch({ type: ActionTypes.HIDDEN_LOADING });
		});
	}
}
export function checkPhone({ success, fail, ...others }) {
	return dispatch => {
		return Http({ ...others }).then((response) => {
			success(response);
		}).catch((error) => {
			fail(error);
		});
	}
}

export function getCacheSize(size) {
	return {
		type: ActionTypes.ACTION_CACHE_SIZE,
		payload: size
	}
}

export function getPhoneRegisterResult(params){
	return{
		type:ActionTypes.ACTION_PHONE_REGISTER_RESULT,
		payload: params
	}
}

export function getH5GameURL(url) {
	return {
		type: ActionTypes.ACTION_H5_GAME_URL,
		payload: url
	}
}
