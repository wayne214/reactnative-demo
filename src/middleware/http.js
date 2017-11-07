import * as ActionTypes from '../constants/actionType';
import { PAGE_SIZE, TOKEN, HOST, CACHE_DATA_TIME, PRESENT_PATH, DEBUG } from '../constants/setting';
import { Platform, NativeModules, InteractionManager, NetInfo } from 'react-native';
import Toast from '../utils/toast';
import AddressHandler from '../utils/address';
import Storage from '../utils/storage';
import UUID from '../utils/uuid';
import md5 from 'md5';
import { redictLogin } from '../action/app';
import NetInfoTool from '../utils/netInfoTools';

/**
 * [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export default store => next => action => {

	if (action.type !== ActionTypes.ACTION_FETCH_DATA) {
		return next(action);
	}

	const {
		api,
		body = {},
		files = [],
		fail,
		success,
		cache = false,
		showLoading = false,
		method,
		cacheType,
		failToast = true,
		successToast = false,
		msg = '提示信息不能为空',
		headers = {
			Accept: 'application/json',
			// 'Content-Type': 'application/json',
			// 'Content-Type': 'application/json',
			// 'Content-Type': 'application/json',
			// 'Content-Type': "application/x-www-form-urlencoded"
		}
	} = action.payload;

	if (!api) throw new Error(' throw api should not be empty exception by sherry!');

	if (!method) throw new Error(' throw method should not be empty exception by sherry!');

	let flag = false
	Object.keys(body).forEach(item => {
		if (item === 'userId') {
			if (body[item] === '' || body[item] === 'undefined' ||
				body[item] === null || body[item] === 'null' || body[item] === undefined) {
				flag = true
			}
		}
	});

	if (flag) return;

	const { app } = store.getState();
	const user = app.get('user');

	const _tbody = { ...body, pageSize: PAGE_SIZE };
	const tBody = getSortMap(_tbody);

	const _body = { ...tBody };

	const uuid = UUID();

	const fullPath = api.indexOf('http') === -1 ? (HOST + api) : api;
	if (DEBUG) console.log('%c the request url is ', 'color:red', fullPath);

 	const role = user ? user.currentUserRole : '';

 	let _userId;
 	if (!user.userId) {
		_userId = '';
 	} else {
 		_userId = user.userId;
 	}

	const sign = md5(TOKEN + uuid + NativeModules.NativeModule.VERSION +
		_userId +  (Platform.OS === 'ios' ? 2 : 1) + (role === 1 ? 2 : 1) + 2 + getValues(_body), 'utf8').toLowerCase();

	const paramsDic = { ..._body };

	headers.uuid = uuid;
	headers.login_type = role === 1 ? 2 : 1;
	headers.user_id = _userId;
	headers.version = NativeModules.NativeModule.VERSION;
	headers.client_type = Platform.OS === 'ios' ? 2 : 1;
	headers.source = 1;

	let options;
	if (method === 'POST') {
		if (files.size !== 0) {
			files.forEach(item => {
				paramsDic[item.key] = { uri: item.path, name: item.fileName, type: 'multipart/form-data' };
			});
		}

		let formData = new FormData();
		Object.keys(paramsDic).forEach(key => {
			const _value = paramsDic[key];
			if (Array.isArray(_value)) {
				_value.forEach(value => formData.append(key, value));
			} else {
				formData.append(key, _value);
			}
		});

		options = {
			method,
			headers,
			body: formData,
		}
	} else {
		options = {
			method,
			headers,
			body: json2Form(paramsDic)
		}
	}
	// if (!api.includes('exclude') && !_userId) return;
	if (!api.includes('exclude')) {
		headers.sign = sign;
	}

	if (DEBUG) console.log('%c params is ', 'color:red', paramsDic);

	const id = md5(JSON.stringify({api, paramsDic}));

	Storage.get(id).then(cacheData => {
		const currentTime = new Date().getTime();
		if (DEBUG) console.log('currentTime ', currentTime, ' cacheTime ', CACHE_DATA_TIME);

		if (cacheType === 'city' && cacheData) AddressHandler.set(cacheData.response);
		if (cacheData && currentTime - cacheData.storageTime < CACHE_DATA_TIME) {
			// get cache data
			return success ? success(cacheData) : '';
		}

		if (showLoading && !cacheData) next({ type: ActionTypes.SHOW_LOADING });

		fetchData(fullPath, options, next, app).then(response => {
			if (successToast) Toast.show(msg);
			if (success) success(response);
			if (cache) {
				if (DEBUG) console.log('--response--',response);
				AddressHandler.set(response);
				Storage.save(id, {response, storageTime: new Date().getTime()});
			}
		}, failed => {
			// 账户被冻结
			if (failed.code === '0005') {
				store.dispatch(redictLogin());
			} else {
				if (fail) fail(failed);
				if (failToast && failed.msg && failed.code !== '0099') Toast.show(failed.msg);
			}
		}).catch(error => Toast.show(error))
		.finally(() => {
			if (showLoading && !cacheData) {
				InteractionManager.runAfterInteractions(() => next({ type: ActionTypes.HIDDEN_LOADING }));
			}
		});
	});
};

function fetchData (fullPath, { body, method, headers }, next, app) {

	if (method === 'GET') {
		fullPath += `?${ body }`;
	}

	return new Promise((resolve, reject) => {
		fetch(fullPath, {
			method,
			headers,
			body: method === 'GET' ? null : body
		}).then(response => {
			return response.json();
		}).then(responseData => {
			if (DEBUG) console.log('%c server response is ', 'color:red', responseData);
			if (responseData.code === '0000' || responseData.status === '200') {
				if (responseData.code === '0000') resolve(responseData.data);
				if (responseData.code === '200') resolve(responseData)
				if (app.get('upgradeForce')) next({ type: ActionTypes.UPGRADE_FORCE_HIDDEN })
			} else if (responseData.code === '0099') {
				// 强制升级
				next({ type: ActionTypes.UPGRADE_FORCE, payload: responseData.data })
				reject(responseData);
			} else if (responseData.code === '0098') {
				reject(responseData)
				if (responseData.msg) Toast.show(responseData.msg)
			} else {
				reject(responseData);
				if (app.get('upgradeForce')) next({ type: ActionTypes.UPGRADE_FORCE_HIDDEN })
			}
		}).catch(error => reject(error));
	});
}

function getValues(obj) {
  let result = '';
  Object.keys(obj).forEach((key, index) => {
    result += obj[key];
  });
  return result;
}

function json2Form(obj) {
  let result = '';
  Object.keys(obj).forEach((key, index) => {
    result += `${ index === 0 ? '' : '&' }${ key }=${ encodeURIComponent(obj[key]) }`;
  });
  return result;
}

function getSortMap(obj) {
	const keys = Object.keys(obj).sort();
	const map = {};
	Object.keys(obj).forEach((key, index) => {
		map[keys[index]] = obj[keys[index]];
	});
	return map;
}
