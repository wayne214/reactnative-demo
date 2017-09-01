import Immutable from 'immutable';

const FeedBack = Immutable.Record({
	//反馈
	backFlag: null, //反馈标识 1是未回复2 是已回复 ,
	createTime: null,
	createUser: null,
	del: null,
	delTime: null,
	delUser: null,
	feedback: null,// 回复的内容 
	id: null,
	pageNo: null,
	pageNum: null,
	pageSize: null,
	questionContent: null,//反馈内容 
	updateTime: null,
	updateUser: null,
	userCode:null,// 用户账户 
	userId: null,// 用户id 
	version: null,
	//问题
	problemTitle: null,//问题标题
	problemAnswer: null,//问题答案
	problemType: null,//问题类型,1常见问题2全部问题
	orderNum: null,//问题排序
	pageNum: null,//当前页
	pageSize: null,//页面大小
});

export default class FeedBackInfo extends FeedBack {
}