import Immutable from 'immutable';

const MessageRecord = Immutable.Record({
	
	id: null,
	title: null,
	content: null,
	noteTitle: null,
	publishTime: null,
	isChecked: false,
	isCheckedAll: false,
	isRead: null, // (custome: true 已读，false 未读) ( server: 操作状态 null=未读 1=已读 |||| isRead 1：未读，2：已读)
});

export default class Message extends MessageRecord {
}