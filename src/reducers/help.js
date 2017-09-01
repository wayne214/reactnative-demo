import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionType';
import FeedBackInfo from '../models/help';
import { PAGE_SIZE } from '../constants/setting';

const initState = Immutable.fromJS({
	help: {
		selectList: [],
		feedbackDetailsInfo:{},
		problemDetailsInfo:{}	
	},
	hasMore: true,
	isEndReached: false,
	isRefreshFeedbackList: false,
});

export default (state = initState, action) => {
	let newState = state;
	let tmpHelpList = [];
	let tmpFeedList = [];
	switch(action.type) {
		case ActionTypes.ACTION_GET_FEEDBACK_LIST:
			if (action.payload.pageNo !== 1) {
				tmpFeedList = state.getIn(['help', 'selectList']).toArray();
			}
			action.payload.data.list.forEach(help => {
				tmpFeedList.push(new FeedBackInfo({
					backFlag: parseInt(help.backFlag), //反馈标识 1是未回复2 是已回复 ,
					createTime: help.createTime,
					createUser: help.createUser,
					del: help.del,
					delTime: help.delTime,
					delUser: help.delUser,
					feedback: help.feedback,// 回复的内容 
					id: help.id,
					questionContent: help.questionContent,//反馈内容 
					updateTime: help.updateTime,
					updateUser: help.updateUser,
					userCode: help.userCode,// 用户账户 
					userId: help.userId,// 用户id 
					version: help.version
				}));
			});
			// 重置标识位
			newState = newState.set('hasMore', true);
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefreshFeedbackList', false);
			if (action.payload.data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			newState = newState.setIn(['help', 'selectList'], Immutable.fromJS(tmpFeedList));
			
			// console.log('lqq----help---reducers---'+tmpFeedList);
			return newState;
		case ActionTypes.ACTION_GET_PROBLEM_LIST:
			if (action.payload.pageNo !== 1) {
				tmpHelpList = state.getIn(['help', 'selectList']).toArray();
			}
			action.payload.data.list.forEach(help => {
				tmpHelpList.push(new FeedBackInfo({
					id: help.id,
					pageNo: help.pageNo,
	        pageNum: help.pageNum,
	        pageSize: help.pageSize,
	        problemAnswer: help.problemAnswer,
	        problemTitle: help.problemTitle,
	        problemType: parseInt(help.problemType),
	        updateTime: help.updateTime,
	       	updateUser: help.updateUser,
	        version: help.version
				}));
			});
			// 重置标识位
			newState = newState.set('hasMore', true);
			newState = newState.set('isEndReached', false);
			newState = newState.set('isRefreshFeedbackList', false);
			if (action.payload.data.pages - action.payload.pageNo === 0) newState = newState.set('hasMore', false);
			newState = newState.setIn(['help', 'selectList'], Immutable.fromJS(tmpHelpList));
			
			return newState;
		case ActionTypes.ACTION_GET_FEEDBACL_DETAILS:
			let feedback = action.payload.data;
			let feedbackDetail = new FeedBackInfo({
					id: feedback.id,
					pageNo: feedback.pageNo,
	        pageNum: feedback.pageNum,
	        pageSize: feedback.pageSize,
	        questionContent: feedback.questionContent,
	        feedback: feedback.feedback,
	        createTime: feedback.createTime,
	       	updateUser: feedback.updateUser,
	       	updateTime: feedback.updateTime,
	        version: feedback.version
			});
			console.log('lqq--ACTION_GET_FEEDBACL_DETAILS-feedbackDetail-->',feedbackDetail);
			newState = newState.setIn(['help','feedbackDetailsInfo'],Immutable.fromJS(feedbackDetail));
			return newState;
			case ActionTypes.ACTION_GET_PROBLEM_DETAILS:
			let problem = action.payload.data;
			let problemDetail = new FeedBackInfo({
					id: problem.id,
					pageNo: problem.pageNo,
	        pageNum: problem.pageNum,
	        pageSize: problem.pageSize,
	        problemAnswer: problem.problemAnswer,
	        problemTitle: problem.problemTitle,
	        problemType: parseInt(problem.problemType),
	        updateTime: problem.updateTime,
	       	updateUser: problem.updateUser,
	        version: problem.version
			});
			console.log('lqq--ACTION_GET_PROBLEM_DETAILS-problemDetail-->',problemDetail);
			newState = newState.setIn(['help','problemDetailsInfo'],Immutable.fromJS(problemDetail));
			return newState;
			case ActionTypes.ACTION_UPDATE_FEEDBACK_LIST:// 更新反馈列表刷新状态
			console.log('lqq--ACTION_UPDATE_FEEDBACK_LIST---');
			newState = newState.set('isRefreshFeedbackList', true);
			return newState;
		default:
			return state;
	}
}