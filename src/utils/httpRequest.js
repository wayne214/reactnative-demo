import Storage from './storage';
import StorageKey from '../constants/storageKeys';
import JPushModule from 'jpush-react-native';
import Toast from '@remobile/react-native-toast';
import {HOST} from '../constants/setting';
import DeviceInfo from "react-native-device-info";

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
};

const imageHeaders = {
    "Content-Type": "multipart/form-data",
};

const _fetch = (fetch_promise, timeout = 30000) => {
    let abort_fn = null;
    const abort_promise = new Promise((resolve, reject) => {
        abort_fn = () => {
            const err = new Error('timeout');
            reject(err);
        }
    });
    // 接收一个数组，只要该数组中的 Promise 对象的状态发生变化（无论是 resolve 还是 reject）该方法都会返回
    const abortable_promise = Promise.race([fetch_promise, abort_promise]);
    setTimeout(() => {
        abort_fn()
    }, timeout);
    return abortable_promise;

};

/*
 * url              ：接口地址
 * params           ：接口参数对象{}
 * loadingCallBack  ：请求中回调
 * successCallBack  ：请求成功回调
 * failCallBack     ：请求失败回调
 * finishCallBack   : 请求完成回调
 * */

/* using
*  import HTTPRequest from '';
*
    HTTPRequest({
        url: ''
        params: {},
        loading: ()=>{

        },
        success: (responseData)=>{

        },
        error: (errorInfo)=>{

        },
        finish:()=>{

        }
    });
* */
const postRequest = (

    {
        url: url,
        params: params,
        loading: loadingCallBack,
        success: successCallBack,
        error: failCallBack,
        finish: finishCallBack
    }) => {

    if (loadingCallBack)
        loadingCallBack();


    if (!params) {
        params = {}
    }

    console.log('global.token===', global.token);
    if (global.token) {
        headers.Authorization = `Bearer ${global.token}`;
        headers.DeviceId = DeviceInfo.getDeviceId();
        headers.PhoneNum = global.phone;
    }
    //body.deviceId = global.UDID
    //body.platform = global.platform

    const jsonBody = JSON.stringify(params);

    console.log("%c%s",
        "color: green; font-size: 18px;",
        jsonBody,url,'的请求参数');

    const myFetch = fetch(HOST + url, {
        method: 'post',
        headers,
        body: jsonBody,
    });
        _fetch(myFetch, 30000)
            .then(response => {
                console.log('response.headers', response.headers.get('newtoken'))
                if (response.headers.get('newtoken')) {
                    console.log('response.header.newtoken');
                    global.token = response.headers.get('newtoken');
                    Storage.save(StorageKey.TOKEN, response.headers.get('newtoken'));
                }

                return response.json();
            })
            .then(responseData => {
                /* 虽然后台返回的数据正确的收到了，但是这里需要具体的判断成功还是失败，例如以code为标志 code = 200 表示成功*/
                if (responseData.code == '200') {
                    if (successCallBack)
                        successCallBack(responseData);
                } else {
                    if (responseData.code == '504') {
                        Storage.save(StorageKey.TOKEN, '');
                        global.token = '';
                        Storage.remove(StorageKey.USER_INFO);
                        Storage.remove(StorageKey.CarSuccessFlag);
                        Storage.remove(StorageKey.PlateNumber);
                        JPushModule.setAlias('', ()=>{}, ()=>{});
                        Toast.showShortCenter(responseData.message);
                    } else if (responseData.code == '800'){} else {
                        Toast.showShortCenter(responseData.message);
                    }


                    if (failCallBack)
                        failCallBack(responseData);
                }
                if (finishCallBack)
                    finishCallBack();

                console.log("%c%s",
                    "color: red; font-size: 17px;",
                    url,'的请求结果',responseData);
            })
            .catch(error => {
                console.log("----http error----%c%s",
                    "color: red; font-size: 20px;",
                    error.message, url);

                if (error.message === 'timeout') {
                    Toast.showShortCenter('网络超时');
                } else {
                    Toast.showShortCenter('网络异常');
                }
                if (finishCallBack)
                    finishCallBack();
            });
};


export default postRequest;



