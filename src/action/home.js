import * as ActionTypes from '../constants/actionType';

// 保存天气信息
export function saveWeather(params) {
    return {
        type: ActionTypes.ACTION_SAVE_WEATHER,
        payload: params
    }
}

export const locationAction = (data) => {
    return {
        type: ActionTypes.ACTION_GET_LOCATION,
        payload: data,
    };
};