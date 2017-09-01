import { NativeModules, Platform } from 'react-native';
import md5 from 'md5';
import UUID from '../utils/uuid';
import Storage from '../utils/storage';

import {
	HOST_OLD,
	DEBUG,
	PAGE_SIZE,
	HTTP_TIMEOUT,
} from '../constants/setting';

import Toast from '../utils/toast';

export default async function post({ failToast = true, successToast = false, ...payload }) {
	const _user = await Storage.get('user');
	const {
		api,
		msg = '提示信息不能为空',
		body = {},
		files = [],
	} = payload;
	const TOKEN = 'da971f8e9e024f579800cf20c146e6df';
	const	_body = { ...body, userId: _user ? _user.userId : '', pageSize: body.pageSize ? body.pageSize : PAGE_SIZE }

	const fullPath = (api.indexOf('http') === -1) ? (HOST_OLD + api) : api;
	if (DEBUG) console.log(`the request url is ${ fullPath }`);
	const uuid = UUID();
	const sign = md5(uuid + TOKEN + JSON.stringify(_body) + (Platform.OS === 'ios' ? '2' : '3'), 'utf8').toLowerCase();

	const paramsDic = {
	  version: NativeModules.NativeModule.VERSION,
	  uuid,
	  client_type: Platform.OS === 'ios' ? '2' : '3',
	  sign: sign,
	  data: _body ? JSON.stringify(_body) : '',
	  userId: _user ? _user.userId : ''
	};
	
	if (files.size !== 0) {
		files.forEach((item) => {
			paramsDic[item.key] = { uri: item.path, type: 'multipart/form-data', name: item.fileName }
		});
	}

	if (DEBUG) console.log('params: ', paramsDic);

	let formData = new FormData();
	Object.keys(paramsDic).forEach(key => {
		const _value = paramsDic[key];
		if (Array.isArray(_value)) {
			_value.forEach(value => formData.append(key, value));
		} else {
			formData.append(key, _value);
		}
	});

	return new Promise((resolve, reject) => {
	  let isOk;
	  fetch(fullPath, {
	    method: 'POST',
	    // headers: {
	    //   'Accept': 'application/json',
	    //   'Content-Type': 'application/x-www-form-urlencoded',
	    // },
	    headers:{
        'Content-Type':'multipart/form-data',
	    },
	    // timeout: HTTP_TIMEOUT,
	    // body: toQueryString(paramsDic),
	    body: formData,
	  }).then((response) => {
	      if (response.ok) {
	        isOk = true;
	      } else {
	        isOk = false;
	      }
	      return response.json();
	    })
	    .then((responseData) => {
	      if (DEBUG) console.log('responseData is ', responseData, ' api is ', api);
	      if (api === '/orderPay/pay.shtml') {
	      	if (isOk && responseData.code === '0000') {
	      		if (responseData.data === 0) {
	      			resolve(responseData);
	      			if (successToast) Toast.show(msg);
	      		} else if (responseData.data === 10) {
	      			Toast.show('余额不足');
	      			reject(responseData);
	      		} else if (responseData.data === 11) {
	      			Toast.show('数据已经被修改（支付失败，请稍后再试）');
	      			reject(responseData);
	      		} else if (responseData.data === 11) {
	      			Toast.show('数据状态异常,');
	      			reject(responseData);
	      		}
	      	} else {
		        reject(responseData);
		        if (failToast) Toast.show(responseData.msg);
	      	}
	      } else {
		      if (isOk && responseData.code === '0000') {
		        resolve(responseData);
		        if (successToast) Toast.show(msg);
		      } else {
		        if (failToast) {
		        	Toast.show(responseData.msg);
		        }
		        reject(responseData);
		      }
	      }
	    })
	    .catch((error) => {
	      reject(error);
	    });
	});
}

function toQueryString(obj) {
  return obj ? Object.keys(obj).sort().map(function (key) {
      var val = obj[key];
      if (Array.isArray(val)) {
        return val.sort().map(function (val2) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
        }).join('&');
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
  }).join('&') : '';
}
