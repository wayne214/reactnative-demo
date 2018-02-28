import * as ActionTypes from '../constants/actionType';

/*用户登录成功，或者处于登录状态*/
export const registeredIdentityCodeAction = (data) => {
    return {
        type: ActionTypes.ACTION_REGISTERED_IDENTITY_CODE,
        payload: data,
    };
};

