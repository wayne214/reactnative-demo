import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import { PAGE_SIZE } from '../constants/setting';
import Message from '../models/message';

const initState = Immutable.fromJS({
	currentTab: 0,
	msg: {
		ids: [],
		msgs: [],
		msgDetail: {}
	},
	hasMore: true,
	isEndReached: false,
	isRefreshMsg: false,
	isCheckedAll: false,
	isRefreshView: true,
});

export default (state = initState, action) => {
	let newState = state;
	let tmpMsgList = [];
	switch(action.type) {
		case ActionTypes.ACTION_SYSTEM_MESSAGE:
			if (action.payload.pageNo !== 1) {
				tmpMsgList = state.getIn(['msg', 'msgs']).toArray();
				if (tmpMsgList.length > 0) newState = newState.set('isCheckedAll', false); 
			}

			action.payload.data.list.map(item => {
				const operateFlag = item.operateFlag;
				tmpMsgList.push(new Message({
					id: item.noteId,
					content: item.noteContent,
					title: item.noteTitle,
					publishTime: item.publishTime,
					isRead: operateFlag === 1 ? true : false, // null=未读 1=已读
					isChecked: false,
				}));
			});
			// 重置标识位
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefreshMsg', false);
			
			if (tmpMsgList.length < PAGE_SIZE) newState = newState.set('hasMore', false);
			newState = newState.setIn(['msg', 'msgs'], Immutable.fromJS(tmpMsgList));
			return newState;
		case ActionTypes.MSG_SELECT_ONE_OF_DATAS:
 			const newMsg = [];
 			let _All = [];
 			let _ids = [];
 			state.getIn(['msg', 'msgs']).map((value, key) => {
 				if (parseInt(action.payload) === key) {
 					_All.push(!value.isChecked);
 					if (!value.isChecked) {
 						_ids.push(value.id);
 					}
 				} else {
 					if (value.isChecked) {
 						_ids.push(value.id);
 					}
 					_All.push(value.isChecked);
 				}
				newMsg.push(new Message({
					id: value.id,
					title: value.title,
					content: value.content,
					isRead: value.isRead,
					publishTime: value.publishTime,
					isChecked: parseInt(action.payload) === key ? !value.isChecked : value.isChecked,
				}));
 			});
 			newState = newState.setIn(['msg', 'ids'], Immutable.fromJS(_ids));
 			newState = newState.set('isCheckedAll', !_All.includes(false));
 			newState = newState.setIn(['msg', 'msgs'], Immutable.fromJS(newMsg));	 						
			return newState;
		case ActionTypes.MESSAGE_CHECKED_ALL:
 			let ids = [];
 			// 全选 、反选
 			const msgs = state.getIn(['msg', 'msgs']);
 			const _msgs = [];
 			msgs.map((value, key) => {
				_msgs.push(new Message({
					id: value.id,
					content: value.content,
					title: value.title,
					isRead: value.isRead,
					publishTime: value.publishTime,
					isChecked: action.payload,				
				}));
				ids.push(value.id);
 			});
 			newState = newState.setIn(['msg', 'ids'], action.payload ? Immutable.fromJS(ids) : Immutable.List());
 			newState = newState.set('isCheckedAll', action.payload);
 			newState = newState.setIn(['msg', 'msgs'], Immutable.fromJS(_msgs));		
			return newState;

		case ActionTypes.ACTION_SYSTEM_MSG_DETAIL:
			newState = newState.set('msgDetail', action.payload);
			return newState;

		case ActionTypes.UPDATE_MSG_LIST:// 更新消息状态（只读未读）
			newState = newState.set('isRefreshMsg', true);
			return newState;

		case ActionTypes.ACTION_WEB_MSG_LIST:
			if (action.payload.pageNo !== 1) {
				tmpMsgList = state.getIn(['msg', 'msgs']).toArray();
				if (tmpMsgList.length > 0) newState = newState.set('isCheckedAll', false); 
			}
			action.payload.data.list.map(item => {
				tmpMsgList.push(new Message({
					id: item.id,
					content: item.content,
					publishTime: item.createTime,
					isRead: item.isRead === 1 ? false : true, // 1：未读，2：已读
					isChecked: false,
				}));
			});
			// 重置标识位
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefreshMsg', false);
			newState = newState.set('hasMore', true);
			if (action.payload.data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			newState = newState.setIn(['msg', 'msgs'], Immutable.fromJS(tmpMsgList));		
			return newState;

		case ActionTypes.ACTION_REFRESH_MESSAGE_LIST:
			newState = newState.set('isRefreshMsg', true);
			return newState;

		case ActionTypes.ACTION_CONTACT_MESSAGE:
			newState = newState.set('isRefreshView', false);
			return newState;

		case ActionTypes.ACTION_CHECKBOX:
			let status = action.payload.checkStatus;
			newState = newState.setIn(['msg', 'ids'], Immutable.fromJS([]));
			newState = newState.set('isCheckedAll',status);
			return newState;

		case ActionTypes.ACTION_CLEAR_ALL_SELECT:
			const selectMsg = [];
 			state.getIn(['msg', 'msgs']).map((value, key) => {
				selectMsg.push(new Message({
					id: value.id,
					title: value.title,
					content: value.content,
					isRead: value.isRead,
					publishTime: value.publishTime,
					isChecked: false,
				}));
 			});
 			newState = newState.setIn(['msg', 'ids'], Immutable.fromJS([]));
 			newState = newState.set('isCheckedAll', false);
 			newState = newState.setIn(['msg', 'msgs'], Immutable.fromJS(selectMsg));							
			return newState;

		case ActionTypes.ACTION_CHANGE_TAB:
			newState = newState.set('currentTab',action.payload || 0);
			return newState;

		default:
			return state;
	}
}