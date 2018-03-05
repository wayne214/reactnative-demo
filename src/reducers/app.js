import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import ReadAndWriteFileUtil from '../logUtil/readAndWriteFileUtil.js'

const initState = Immutable.fromJS({
    showAD: true,
    currentTab: 'goods',
    loading: false,
    index: 1,
    upgrade: {
        busy: false,
        downloaded: false,
        text: '检查更新中',
        progress: '0%',
        description: '为方便广大客户不同类型的结算模式，此版本实现了在线结算的系统升级，功能更全，性能更优。'
    },
    tabs: [
        {

            title: '货源',
            key: 'goods',
            badgeCount: 0,
            withStatusBar: false,
            renderIcon: require('../../assets/img/app/icon_goods_normal.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_goods_press.png')

        },
        {
            title: '行程',
            key: 'route',
            badgeCount: 0,
            withStatusBar: true,
            renderIcon: require('../../assets/img/app/icon_route.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_route_press.png')
        },
        {
            title: '承运',
            key: 'carriage',
            badgeCount: 0,
            withStatusBar: false,
            renderIcon: require('../../assets/img/app/icon_cy_normal.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_cy_press.png')
        },
        {
            title: '订单',
            key: 'order',
            badgeCount: 0,
            withStatusBar: false,
            renderIcon: require('../../assets/img/app/icon_order_normal.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_order_press.png')
        },
        {
            title: '我的',
            key: 'mine',
            badgeCount: 0,
            withStatusBar: false,
            renderIcon: require('../../assets/img/app/icon_order_normal.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_order_press.png')
        },
    ],
    driverTabs: [
        {
            title: '首页',
            key: 'Home',
            badgeCount: 0,
            withStatusBar: true,
            renderIcon: require('../../assets/img/app/icon_route.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_route_press.png')
        },
        {
            title: '货源',
            key: 'driverGoods',
            badgeCount: 0,
            withStatusBar: false,
            renderIcon: require('../../assets/img/app/icon_goods_normal.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_goods_press.png')
        },
        {
            title: '订单',
            key: 'driverOrder',
            badgeCount: 0,
            withStatusBar: false,
            renderIcon: require('../../assets/img/app/icon_cy_normal.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_cy_press.png')
        },
        {
            title: '我的',
            key: 'mine',
            badgeCount: 0,
            withStatusBar: false,
            renderIcon: require('../../assets/img/app/icon_order_normal.png'),
            renderSelectedIcon: require('../../assets/img/app/icon_order_press.png')
        },
    ],
    user: {},
    messages: [],
    citys: [],
    ossImg: {
        combineImgName: '',
        yingyeImgName: '',
        companyImgName: '',
        shuiwImgName: '',

        addDriverLicense: '',

        addCarCarName: '',
        addCarLiencesName: '',
        addCarYunYName: '',
        addGCarLiencesName: '',
        addGCarYunYName: ''
    },
    showFloatDialog: false,
    isInited: 0,
    alias: 1,
    shouldEntrustOrderListRefresh: false,
    openNotification: false,
    appState: 'active',
    shouldOrderListRefresh: false,
    legalAccount: true,
    upgradeForce: false,
    upgradeForceUrl: '',
    gameUrl: '',
    hotLine: 'tel:4006635656',
    insiteNotice: '',//站内公告
    locationData: '定位中',
    getHomePageCount: {}, // 首页状态数量
    getCarrierHomePageCount: {}, // 首页状态数量
    versionUrl: '', // 版本地址
    mainPress: 1,
});

export default (state = initState, action) => {
    let newState = state;
    switch (action.type) {
        case ActionTypes.ACTION_CHANGE_TAB:
            if (action.payload === 'carriage') {
                newState = newState.set('shouldEntrustOrderListRefresh', true)
            }
            if (action.payload === 'order') {
                newState = newState.set('shouldOrderListRefresh', true)
            }
            ;
            newState = newState.set('currentTab', action.payload);
            return newState;
        case ActionTypes.SHOW_LOADING:
            newState = newState.set('loading', true);
            return newState;
        case ActionTypes.HIDDEN_LOADING:
            newState = newState.set('loading', false);
            return newState;
        case ActionTypes.LOAD_USER:
            newState = newState.set('user', action.payload);
            return newState;
        case ActionTypes.ACTION_MERGE_USER:
            const _user = Immutable.Map(state.get('user')).merge(action.payload).toJS();
            newState = newState.set('user', _user);
            return newState;
        case ActionTypes.APP_USER_LOGOUT:
            newState = newState.set('user', {});
            return newState;
        case ActionTypes.ACTION_UPDATE_OSS_CONFIG:
            if (action.payload.type === 'comBineImg') newState = newState.setIn(['ossImg', 'combineImgName'], action.payload.path);
            if (action.payload.type === 'yingYeImg') newState = newState.setIn(['ossImg', 'yingyeImgName'], action.payload.path);
            if (action.payload.type === 'companyImg') newState = newState.setIn(['ossImg', 'companyImgName'], action.payload.path);
            if (action.payload.type === 'shuiwImg') newState = newState.setIn(['ossImg', 'shuiwImgName'], action.payload.path);

            if (action.payload.type === 'addDriverLicense') newState = newState.setIn(['ossImg', 'addDriverLicense'], action.payload.path);

            if (action.payload.type === 'addCarCarImg') newState = newState.setIn(['ossImg', 'addCarCarName'], action.payload.path);
            if (action.payload.type === 'addCarLiencesImg') newState = newState.setIn(['ossImg', 'addCarLiencesName'], action.payload.path);
            if (action.payload.type === 'addCarYunYImg') newState = newState.setIn(['ossImg', 'addCarYunYName'], action.payload.path);
            if (action.payload.type === 'addGCarLiencesImg') newState = newState.setIn(['ossImg', 'addGCarLiencesName'], action.payload.path);
            if (action.payload.type === 'addGCarYunYImg') newState = newState.setIn(['ossImg', 'addGCarYunYName'], action.payload.path);
            return newState;
        case ActionTypes.ACTION_SHOW_FLAOT_DIALOG:
            newState = newState.set('showFloatDialog', action.payload);
            return newState;
        case ActionTypes.ACTION_GET_INITED:
            newState = newState.set('isInited', action.payload);
            return newState;
        case ActionTypes.ACTION_ALIAS:
            newState = newState.set('alias', action.payload);
            return newState;
        case ActionTypes.ACTION_SHOULD_ENTRUST_ORDER_LIST_REFRESH:
            newState = newState.set('shouldEntrustOrderListRefresh', action.payload);
            return newState;
        case ActionTypes.ACTION_SHOULE_ORDER_LIST_REFRESH:
            newState = newState.set('shouldOrderListRefresh', action.payload);
            return newState;
        case ActionTypes.ACTION_CLEAR_IMG_SOURCE:
            newState = newState.setIn(['ossImg', 'addCarCarName'], '');
            newState = newState.setIn(['ossImg', 'addCarLiencesName'], '');
            newState = newState.setIn(['ossImg', 'addCarYunYName'], '');
            newState = newState.setIn(['ossImg', 'addGCarLiencesName'], '');
            newState = newState.setIn(['ossImg', 'addGCarYunYName'], '');
            return newState;
        case ActionTypes.ACTION_NOTIFICATION:
            newState = newState.set('openNotification', action.payload);
            return newState;
        case ActionTypes.ACTION_SET_APPSTATE:
            newState = newState.set('appState', action.payload);
            return newState;
        case ActionTypes.ACTION_REDICT_LOGIN:
            newState = newState.set('legalAccount', false);
            return newState;
        case ActionTypes.ACTION_LOGIN_SUCCESS:
            newState = newState.set('legalAccount', true);
            return newState;
        case ActionTypes.UPGRADE_FORCE:
            // 强制升级
            newState = newState.set('upgradeForce', true);
            newState = newState.set('upgradeForceUrl', action.payload);
            return newState;
        case ActionTypes.UPGRADE_FORCE_HIDDEN:
            // 强制升级
            newState = newState.set('upgradeForce', false);
            return newState;
        case ActionTypes.APP_UPGRADE:
            newState = newState.mergeIn(['upgrade'], action.payload);
            return newState;
        case ActionTypes.ACTION_GET_GAME_URL:
            newState = newState.set('gameUrl', action.payload)
            return newState
        case ActionTypes.ACTION_RECEIVE_IN_SITE_NOTICE:
            newState = newState.set('insiteNotice', action.payload)
            return newState
        case ActionTypes.ACTION_APPEND_LOG:
            const appendEndTime = new Date().getTime();
            const appendStartTime = action.payload.startTime || 0
            ReadAndWriteFileUtil.appendFile(
                action.payload.pageName,
                action.payload.action,
                (appendStartTime < 1 ? 0 : (appendEndTime - appendStartTime)),
                // global.locationData.latitude,
                // global.locationData.longitude
            )
            return newState
        case ActionTypes.ACTION_RESET_AD:
            newState = newState.set('showAD', action.payload);
            return newState;

        case ActionTypes.ACTION_GET_LOCATION:
            newState = newState.set('locationData', action.payload);
            return newState;
        case ActionTypes.ACTION_GET_HOME_PAGE_COUNT:
            newState = newState.set('getHomePageCount', action.payload);
            return newState;
        case ActionTypes.ACTION_GET_CARRIER_HOME_PAGE_COUNT:
            newState = newState.set('getCarrierHomePageCount', action.payload);
            return newState;
        case ActionTypes.UPDATE_VERSION:
            newState = newState.set('versionUrl', action.payload);
            return newState;
        case ActionTypes.ACTION_MAIN_PRESS:
            newState = newState.set('mainPress', action.payload.orderTab);
            return newState;

        default:
            return newState;
    }
};
