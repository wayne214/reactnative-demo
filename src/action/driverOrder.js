/**
 * Created by xizhixin on 2018/2/26.
 */
import * as ActionTypes from '../constants/actionType'

export const receiveDriverOrderList = payload => {
    return {
        type: ActionTypes.ACTION_GET_DRIVER_ORDER_LIST,
        payload
    }
}
export const refreshDriverOrderList = payload => {
    return {
        type: ActionTypes.ACTION_REFRESH_DRIVER_ORDER_LIST,
        payload
    }
}