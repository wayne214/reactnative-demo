/**
 * Created by xizhixin on 2018/2/26.
 */
import * as ActionTypes from '../constants/actionType'

export const receiveDriverOrderList = payload => {
    return {
        type: ActionTypes.ACTION_GET_DRIVER_ORDER_LIST,
        payload
    }
};
export const refreshDriverOrderList = payload => {
    return {
        type: ActionTypes.ACTION_REFRESH_DRIVER_ORDER_LIST,
        payload
    }
};

export const changeOrderTabAction = (payload) => {
    return {
        type: ActionTypes.ACTION_MAIN_PRESS,
        payload
    };

};

// 上传回单-添加照片
export const addImage = (params) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.ADD_IMAGE,
            payload: params,
        });
    };
};
// 上传回单-清空照片
export function updateImages(params) {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.UPDATE_IMAGES,
            payload: params,
        });
    };
}
// 上传回单-删除照片
export function deleteImage(params) {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.DELETE_IMAGE,
            payload: params,
        });
    };
}