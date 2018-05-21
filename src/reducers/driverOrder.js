/**
 * Created by xizhixin on 2018/2/26.
 */
import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
const initState = Immutable.fromJS({
    allListData:{
        list:[],
        total: 0,
        hasMore: false,
        pageNum: 0,//默认值0 使用时 +1
        ctcNum: 0,
        tfcNum: 0,
        isLoadingMore: false,
        isRefreshing: false
    },
    shipListData: {
        list:[],
        total: 0,
        hasMore: false,
        pageNum: 0,
        ctcNum: 0,
        tfcNum: 0,
        isLoadingMore: false,
        isRefreshing: false
    },
    signListData: {
        list:[],
        total: 0,
        hasMore: false,
        pageNum: 0,
        ctcNum: 0,
        tfcNum: 0,
        isLoadingMore: false,
        isRefreshing: false
    },
    receiptListData: {
        list:[],
        total: 0,
        hasMore: false,
        pageNum: 0,
        ctcNum: 0,
        tfcNum: 0,
        isLoadingMore: false,
        isRefreshing: false
    },
    imageList: Immutable.List(),
    maxNum: 9,
    tabIndex: 0,
    isUploadOdoFlag: true,
});

export default (state = initState, action) => {
    let newState = state;
    const payload = action.payload
    let newArray = [];
    let imageList;
    let maxNum;
    switch (action.type) {
        case ActionTypes.ACTION_GET_DRIVER_ORDER_LIST:
            /* 这里获取司机订单列表数据，根据订单类状态，放入对应的数组中   先对数据组装、格式化 */
            /* 订单状态：orderType: 0 全部, 1 待发运, 2 待签收, 3 待回单 */
            let rootType = '';
            switch (payload.orderType) {
                case 0:
                    rootType = 'allListData';
                    break;
                case 1:
                    rootType = 'shipListData';
                    break;
                case 2:
                    rootType = 'signListData';
                    break;
                case 3:
                    rootType = 'receiptListData';
                    break;
            }
            console.log('payload.hasNextPage=',payload.hasNextPage);

            newState = newState.setIn([rootType,'isLoadingMore'],false);
            newState = newState.setIn([rootType,'isRefreshing'],false);
            newState = newState.setIn([rootType,'hasMore'],payload.hasNextPage);
            newState = newState.setIn([rootType,'ctcNum'],payload.ctcNum);
            newState = newState.setIn([rootType,'tfcNum'],payload.tfcNum);
            newState = newState.setIn([rootType,'pageNum'],payload.pageNum);
            console.log('payload.pageNum=',payload.pageNum);
            if(payload.list === null || payload.list === []) {
                newState = newState.setIn([rootType, 'list'], []);
                newState = newState.setIn([rootType, 'list'], Immutable.fromJS(payload.list));
            }
            if (payload.pageNum === 1) {
                // 第一页数据先清空原有数据
                newState = newState.setIn([rootType,'list'],[]);
                newArray = Immutable.fromJS(payload.list);
                newState = newState.setIn([rootType,'list'], newArray);
            }else {
                newArray = newState.getIn([rootType,'list']);
                newArray = newArray.concat(payload.list);
                newState = newState.setIn([rootType,'list'],Immutable.fromJS(newArray));
            }
            console.log('newArray=',newArray);
            return newState;
        case ActionTypes.ACTION_REFRESH_DRIVER_ORDER_LIST://刷新列表
            switch(payload){
                case 0:
                    newState = newState.setIn(['allListData', 'isRefreshing'], true);
                    break;
                case 1:
                    newState = newState.setIn(['shipListData', 'isRefreshing'], true);
                    break;
                case 2:
                    newState = newState.setIn(['signListData', 'isRefreshing'], true);
                    break;
                case 3:
                    newState = newState.setIn(['receiptListData', 'isRefreshing'], true);
                    break;
            }
            return newState;
        case ActionTypes.ADD_IMAGE:
            imageList = newState.get('imageList');
            maxNum = newState.get('maxNum');
            action.payload.map(i =>{
                imageList = imageList.push(i);
                maxNum -= 1;
            });
            newState = newState.set('imageList', imageList);
            newState = newState.set('maxNum', maxNum);
            return newState;

        case ActionTypes.DELETE_IMAGE:
            imageList = newState.get('imageList');
            maxNum = newState.get('maxNum');
            imageList = imageList.delete(action.payload);
            maxNum += 1;
            newState = newState.set('imageList', imageList);
            newState = newState.set('maxNum', maxNum);
            return newState;

        case ActionTypes.UPDATE_IMAGES:
            imageList = newState.get('imageList');
            maxNum = newState.get('maxNum');
            imageList = imageList.clear();
            maxNum = 9;
            newState = newState.set('imageList', imageList);
            newState = newState.set('maxNum', maxNum);
            return newState;

        case ActionTypes.ACTION_MAIN_PRESS:
            newState = newState.set('tabIndex', action.payload);
            return newState;
        default:
            return newState
    }
}