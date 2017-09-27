import * as ActionTypes from '../constants/actionType';
// import ActionCreator from './actionCreate';
import Storage from '../utils/storage';

export function changeTab(tab) {
	return {
		type: ActionTypes.ACTION_CHANGE_TAB,
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
		Storage.get('flag').then(str => {
			if (str) {
				dispatch(receiveStatus(str));
			}
		});
		Storage.get('alias').then(value => {
			if (value) dispatch(receiverAlias(value));
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

export function loginSuccess() {
	return {
		type: ActionTypes.ACTION_LOGIN_SUCCESS
	}
}

export function getGameUrl (url) {
	return {
		type: ActionTypes.ACTION_GET_GAME_URL,
		payload: url
	}
}

export const receiveInSiteNotice = (notice = '')=>{
	return {
		type: ActionTypes.ACTION_RECEIVE_IN_SITE_NOTICE,
		payload: notice
	}
}

export const appendLogToFile = (pageName,action,startTime)=>{
	return {
		type: ActionTypes.ACTION_APPEND_LOG,
		payload: {
			pageName,action,startTime
		}
	}
}

export const writeLogToFile = (pageName,action,phoneNumber,userId,userName, startTime)=>{
	return {
		type: ActionTypes.ACTION_WRITE_LOG,
		payload: {
			pageName,action,phoneNumber,userId,userName, startTime
		}
	}
}