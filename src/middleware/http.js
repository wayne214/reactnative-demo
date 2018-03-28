import axios from 'axios'
import {Platform, InteractionManager} from 'react-native'
import * as ActionTypes from '../constants/actionType'
import {DEBUG, HOST, HTTP_TIMEOUT} from '../constants/setting'
import Toast from '../utils/toast'
import DeviceInfo from "react-native-device-info";
import Storage from './../utils/storage';
import StorageKey from '../constants/storageKeys';
import JPushModule from 'jpush-react-native';
import resetToLoginEmit from '../containers/home/receiveRestToLogin'

/**
 * [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export default store => next => action => {

    if (action.type !== ActionTypes.ACTION_FETCH_DATA) return next(action)

    const {
        api,
        body = {},
        msg,
        fail,
        success,
        cacheType,
        cache = false,
        method = 'post',
        showLoading = true,
        failToast = false,
        successToast = false,
    } = action.payload

    if (!api) throw new Error(' throw api should not be empty exception by sherry!')

    if (successToast && !msg) throw new Error('msg not be empty by sherry')

    axios.defaults.baseURL = HOST
    if (global.token) {
        axios.defaults.headers.Authorization = `Bearer ${global.token}`
    }

    if (global.userId) {
        axios.defaults.headers.userId = global.userId
    }

    if (global.phone) {
        axios.defaults.headers.PhoneNum = global.phone
    }
    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios.defaults.headers.DeviceId = DeviceInfo.getDeviceId()
    axios.defaults.headers.platform = Platform.OS === 'ios' ? 1 : 2
    console.log('headers', axios.defaults.headers)
    if (showLoading) InteractionManager.runAfterInteractions(() => next({
        type: ActionTypes.ACTION_TOGGLE_LOADING,
        payload: true
    }))

    axios.interceptors.request.use(function (config) {
        return config
    }, function (error) {
        return Promise.reject(error)
    })

    axios.interceptors.response.use(function (response) {
        return response
    }, function (error) {
        return Promise.reject(error)
    })

    if (DEBUG) console.log('%c%s','color: red; font-size: 16px;', '---api: '+ HOST + api);
    if (DEBUG) console.log('params: %c','color: red; font-size: 16px;', body);

    axios({
        url: api,
        data: JSON.stringify(body),
        method: method.toLowerCase(),
        timeout: HTTP_TIMEOUT,
        responseType: 'json'
    }).then(data => {
        if (DEBUG) console.log('%c response: ', 'color: red', data.data);
        // if (data.headers.get('newtoken')) {
        //     console.log('response.header.newtoken');
        //     global.token = data.headers.get('newtoken');
        //     // Storage.save(StorageKey.TOKEN, response.headers.get('newtoken'));
        // }

        if (data.data.code == '200') {
            if (success)
                success(data.data.result);
        } else {
            if (data.data.code == '504') {
                Storage.save(StorageKey.TOKEN, '');
                // global.token = '';
                Storage.remove(StorageKey.USER_INFO);
                Storage.remove(StorageKey.CarSuccessFlag);
                Storage.remove(StorageKey.PlateNumber);
                resetToLoginEmit.restToLogin(data.data.message);
                JPushModule.setAlias('', ()=>{}, ()=>{});
                Toast.showShortCenter(data.data.message);
            } else if (data.data.code == '800'){} else {
                Toast.showShortCenter(data.data.message);
            }


            if (fail)
                fail(data.data);
        }


        // if (data.status === 200 && data.data.code * 1 === 200) {
        //   if (successToast) Toast.show(msg)
        //   success(data.data.result)
        // }
        //
        // if(data.status === 200 && data.data.code === '504') {
        //     Storage.save(StorageKey.TOKEN, '');
        //     global.token = '';
        //     Storage.remove(StorageKey.USER_INFO);
        //     Storage.remove(StorageKey.CarSuccessFlag);
        //     Storage.remove(StorageKey.PlateNumber);
        //     resetToLoginEmit.restToLogin(responseData.message);
        //     JPushModule.setAlias('', ()=>{}, ()=>{});
        //     Toast.showShortCenter(responseData.message);
        // }
        // if (data.status === 200 && data.data.code !== 200) {
        //   if (failToast) Toast.show(data.data.message)
        //   fail(data.data)
        // }
    }, error => {
        Toast.show('请求超时，请重试!')
        if (DEBUG) console.log('error:', error)
    }).finally(() => {

        if (showLoading)
            InteractionManager.runAfterInteractions(() => next({
                type: ActionTypes.ACTION_TOGGLE_LOADING,
                payload: false
            }))
    })
}
