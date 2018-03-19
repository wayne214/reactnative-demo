/**
 * OUTSIDEDRIVER  外部司机
 * Personalowner  个人车主
 * Enterpriseowner  企业车主
 * driverStatus ： 1 司机认证中     2 司机认证通过     3 司机认证驳回  4 司机被禁用
 * ownerStatus ： 11 个人车主认证中 12 个人车主认证通过 13 个人车主认证驳回  14 个人车主被禁用
 *                21 企业车主认证中 22 企业车主认证通过 23 企业车主认证驳回  24 企业车主被禁用
 * currentStatus ： driver 司机  personalOwner 个人车主 businessOwner 企业车主
 * companyCode ：号
 */
import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import Storage from '../utils/storage';
import StorageKey from '../constants/storageKeys';

const initState = Immutable.fromJS({
    userInfo: {}, // 登录返回的用户信息
    userName: '', // 用户名
    plateNumber: '', // 用户绑定的车辆
    plateNumberObj: {}, // 用户绑定的车辆信息
    userCarList: [], // 用户车辆列表
    driverStatus: '0',
    ownerStatus: '0',
    currentStatus: 'driver',
    companyCode: '', // 承运商编码
    ownerName: '',
    companyInfo: '',
    userTypeInfo:{}
});

export default (state = initState, action) => {
    // console.log('initState:',state.get('userInfo'));
    let newState = state;
    switch (action.type) {
        case ActionTypes.ACTION_LOGIN_SUCCESS:
            global.token = action.payload.token;
            global.userId = action.payload.userId;
            global.userName = action.payload.userName;
            global.photoRefNo = action.payload.photoRefNo;
            global.phone = action.payload.phone;
            global.userInfo = action.payload;

            Storage.save(StorageKey.USER_INFO, action.payload);
            Storage.save(StorageKey.TOKEN, action.payload.token);
            Storage.save(StorageKey.PHOTO_REF_NO, action.payload.photoRefNo);
            Storage.save(StorageKey.USER_ID, action.payload.userId);

            newState = newState.set('userInfo', action.payload);
            newState = newState.set('userName', action.payload.userName);

            return newState;

        case ActionTypes.ACTION_USER_NAME:
            global.userName = action.payload;

            newState = newState.set('userName', action.payload);
            return newState;

        case ActionTypes.ACTION_OWNER_NAME:
            global.ownerName = action.payload;
            Storage.save(StorageKey.OWNER_NAME, action.payload);
            newState = newState.set('ownerName', action.payload);
            return newState;

        case ActionTypes.ACTION_USER_CAR:
            global.plateNumber = action.payload.carNum;
            global.plateNumberObj = action.payload;

            Storage.save(StorageKey.PlateNumber, action.payload.carNum);
            Storage.save(StorageKey.PlateNumberObj, action.payload);

            newState = newState.set('plateNumber', action.payload.carNum);
            newState = newState.set('plateNumberObj', action.payload);

            return newState;

        case ActionTypes.ACTION_USER_CLEAR:

            global.token = '';
            global.userId = '';
            global.userName = '';
            global.photoRefNo = '';
            global.phone = '';
            global.userInfo = {};
            global.plateNumber = '';
            global.companyCode = '';
            global.userInfo = {carNum: '', carStatus: 0};

            Storage.remove(StorageKey.USER_INFO);
            Storage.remove(StorageKey.TOKEN);
            Storage.remove(StorageKey.PHOTO_REF_NO);
            Storage.remove(StorageKey.USER_ID);

            Storage.remove(StorageKey.USER_DRIVER_STATE);
            Storage.remove(StorageKey.USER_CAROWN_STATE);
            Storage.remove(StorageKey.USER_CURRENT_STATE);
            Storage.remove(StorageKey.CARRIER_CODE);
            Storage.remove(StorageKey.CarSuccessFlag);
            Storage.remove(StorageKey.PlateNumber);
            Storage.remove(StorageKey.userCarList);
            Storage.remove(StorageKey.personInfoResult);
            Storage.remove(StorageKey.carInfoResult);
            Storage.remove(StorageKey.changePersonInfoResult);
            Storage.remove(StorageKey.changeCarInfoResult);
            Storage.remove(StorageKey.acceptMessage);
            Storage.remove(StorageKey.PlateNumberObj);
            Storage.remove(StorageKey.enterpriseownerInfoResult);
            Storage.remove(StorageKey.personownerInfoResult);
            Storage.remove(StorageKey.newMessageFlag);
            Storage.remove(StorageKey.payPassword);
            Storage.remove(StorageKey.carOwnerAddDriverInfo);
            Storage.remove(StorageKey.carOwnerAddCarInfo);
            Storage.remove(StorageKey.USER_TYPE_INFO);



            newState = newState.set('userInfo', {});
            newState = newState.set('userName', '');
            newState = newState.set('plateNumber', '');
            newState = newState.set('plateNumberObj', {carNum: '', carStatus: 0});
            newState = newState.set('userCarList', []);
            newState = newState.set('companyCode', '');

            newState = newState.set('driverStatus', '0');
            newState = newState.set('ownerStatus', '0');
            newState = newState.set('currentStatus', '');


            return newState;

        case ActionTypes.ACTION_QUERY_ENTER_PRISE_NATURE:
            newState = newState.set('queryEnterPrise', action.payload);
            return newState;

        case ActionTypes.ACTION_SAVE_USER_CAR_LIST:
            console.log('userCarList', action.payload);
            Storage.save('userCarList', action.payload);
            newState = newState.set('userCarList', action.payload);
            return newState;

        case ActionTypes.ACTION_SET_DRIVER_CHARACTER:
            newState = newState.set('driverStatus', action.payload);
            global.driverStatus = action.payload;
            action.payload ? Storage.save(StorageKey.USER_DRIVER_STATE, action.payload) : null;
            return newState;

        case ActionTypes.ACTION_SET_OWNER_CHARACTER:
            newState = newState.set('ownerStatus', action.payload);
            global.ownerStatus = action.payload;
            action.payload ? Storage.save(StorageKey.USER_CAROWN_STATE, action.payload) : null;
            return newState;

        case ActionTypes.ACTION_SET_CURRENT_CHARACTER:
            newState = newState.set('currentStatus', action.payload);
            global.currentStatus = action.payload;
            action.payload ? Storage.save(StorageKey.USER_CURRENT_STATE, action.payload) : null;
            return newState;

        case ActionTypes.ACTION_SET_COMPANY_CODE:
            newState = newState.set('companyCode', action.payload);
            global.companyCode = action.payload;
            console.log('--global.companyCode',global.companyCode);

            action.payload ? Storage.save(StorageKey.CARRIER_CODE, action.payload) : '';
            return newState;

        case ActionTypes.ACTION_SAVE_COMPANY_INFO:
            newState = newState.set('companyInfo', action.payload);
            global.companyPhone = action.payload.busTel;
            global.companyId = action.payload.id;
            console.log('--global.companyPhone, global.companyId',global.companyPhone, global.companyId);
            action.payload ? Storage.save(StorageKey.COMPANY_INFO, action.payload) : '';
            return newState;

        case ActionTypes.ACTION_SAVE_USER_TYPE_INFO:
            newState = newState.set('userTypeInfo', action.payload);
            Storage.save(StorageKey.USER_TYPE_INFO, action.payload);
            return newState;
        default:
            return state;
    }
};
