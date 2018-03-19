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
    weather: {}, // 天气
    location: '', // 默认位置
});

export default (state = initState, action) => {
    // console.log('initState:',state.get('userInfo'));
    let newState = state;
    switch (action.type) {

        case ActionTypes.ACTION_SAVE_WEATHER:
            newState = newState.set('weather', action.payload)
            return newState
        case ActionTypes.ACTION_GET_LOCATION:
            newState = newState.set('location', action.payload);
            return newState;
        default:
            return state;
    }
};
