import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ScrollView,
	Platform
} from 'react-native';
import styles from '../../../assets/css/message';
import { fetchData, changeTab, appendLogToFile } from '../../action/app';
import NavigatorBar from '../../components/common/navigatorbar';
import { SYSTEM_MSG_DETAIL, STACK_MSG_DETAIL, UPDATE_WEB_MSG ,SYSTEM_READ_ORNOT} from '../../constants/api';
import { passMsgDetail , dispatchRefreshMessageList} from '../../action/message';
import Button from '../../components/common/button';
import * as RouteType from '../../constants/routeType';
import { passWebMessage } from '../../action/message';
import { changeOrderTopTab } from '../../action/order';
import BaseComponent from '../../components/common/baseComponent';
let startTime = 0
class MessageDetail extends BaseComponent {
	constructor(props) {
	  super(props);
	  this.noteId = props.navigation.state.params.id;
	  this.type = props.navigation.state.params.type;
    this.title = props.navigation.state.params.title;
	  this.isRead = props.navigation.state.params.isRead;
	  this.messageId = props.navigation.state.params.id;
	}

	componentDidMount() {
		super.componentDidMount();
		let options;
		if (this.type === 0) {
			options = {
				messageId: this.noteId
			};
		} else {
			options = {
				noteId: this.noteId,
			};
		}

		this.props.getMsgDetail( options, this.type, this.props );
		if (!this.isRead){
			this.props.readSystemMessage({
				noteId: this.noteId,
				userId: this.props.user.userId,
			});
		// 	this.props.readMessage({
		// 		messageId: this.messageId,
		// 		readOrDel: 'read',
		// 	});
		}
	}

	componentWillUnmount() {
		super.componentWillUnmount()
	}
	_againAuth(){
		this.props.navigation.dispatch({type: RouteType.ROUTE_AUTH_INFO, params: {title:'公司认证'}});
	}
	_waitShipper(){
		this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'center',insiteNotice: this.props.insiteNotice } })
		this.props.dispatch(changeTab('carriage'));
		let linkId;
		if(this.props.msg && this.props.msg.linkId){
			linkId = this.props.msg.linkId.split(":")[0];
		}
		if(linkId === '3'){
			this.props.dispatch(changeOrderTopTab(0));
		}else{
			this.props.dispatch(changeOrderTopTab(1));
		}
	}

	_priceManage(){
		let linkId;
		if(this.props.msg && this.props.msg.linkId){
			linkId = this.props.msg.linkId.split(":")[0];
		}
		if(linkId === '4'){
			this.props.navigation.dispatch({ type: RouteType.ROUTE_BIDDING_LIST,params: {title:'我的竞价', isBetter:true, tabIndex: 1}});
		}else{
			this.props.navigation.dispatch({ type: RouteType.ROUTE_BIDDING_LIST,params: {title:'我的竞价', isBetter:true, tabIndex: 2}});
		}
	}
	_routeGoods(){
		this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'goods', insiteNotice: this.props.insiteNotice } })
		this.props.dispatch(changeTab('goods'));
	}
	_orderList(){
		this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'order', insiteNotice: this.props.insiteNotice } })
		this.props.dispatch(changeTab('order'));
		let linkId;
		if(this.props.msg && this.props.msg.linkId){
			linkId = this.props.msg.linkId.split(":")[0];
		}
		if(linkId === '8'){
			this.props.dispatch(changeOrderTopTab(2));
		}else{
			this.props.dispatch(changeOrderTopTab(4));
		}
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};

	render() {
		const {navigation, user, msg} = this.props;
		let linkId;
		let number;
		let btn;
		let content;
		let time;
		let messageDetail;
		if(msg && msg.linkId){
			linkId = msg.linkId.split(":")[0];
		  number = msg.linkId.split(":")[1];
		  // if(linkId === '1'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title='立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { () => navigation.dispatch({type: RouteType.ROUTE_USER_INFO, params: {title: '会员信息'}}) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '2' && user.certificationStatus === 3 ){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title='查看认证详情'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { this._againAuth.bind(this) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '3'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title= '立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { this._waitShipper.bind(this) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '4'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title= '立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { this._waitShipper.bind(this) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '5'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title='立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { this._priceManage.bind(this) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '6'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title='立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { this._waitShipper.bind(this) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '7'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title= '立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { this._routeGoods.bind(this) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '8'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title= '立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { this._orderList.bind(this) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '9'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title='立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { this._orderList.bind(this) }/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '10'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title='立即查看'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { ()=> {navigation.dispatch({type: RouteType.ROUTE_MY_CAR, params:{title:'车辆管理'}})}}/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '11'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title='查看订单'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { ()=> {navigation.dispatch({type: RouteType.ROUTE_ORDER_DETAIL, params: {title:'订单详情', orderNo : number}})}}/>
				// 	</View>
		  // 	)
		  // }else if(linkId === '12'){
		  // 	btn = (
		  // 		<View style={ styles.loginBtn }>
				// 		<Button
				// 			title='重新上传'
				// 			style={ styles.btn }
				// 			textStyle={ styles.btnText }
				// 			onPress = { ()=> {navigation.dispatch({type: RouteType.ROUTE_ORDER_DETAIL, params: {title:'订单详情', orderNo : number}})}}/>
				// 	</View>
		  // 	)
		  // }
		  if(linkId === '11'){
		  	btn = (
		  		<View style={ styles.loginBtn }>
						<Button
							title='查看订单'
							style={ styles.btn }
							textStyle={ styles.btnText }
							onPress = { ()=> {navigation.dispatch({type: RouteType.ROUTE_ORDER_DETAIL, params: {title: '订单详情', orderNo : number}})}}/>
					</View>)
			}
		}
		if(msg){
			content = (this.type === 0 ? msg.content : msg.noteContent);
			time = (this.type === 0 ? msg.createTime : msg.publishTime);
		}
		if (this.type === 0){
			messageDetail = (
				<View style={ styles.msgDetail }>
					<Text style={ styles.text }>{ content }</Text>
					<Text style={ styles.timeText }>{ time }</Text>
				</View>)
		}else{
			messageDetail=(
				<View style={ styles.msgDetail }>
					<Text style={{fontSize: 17, fontWeight: 'bold',color: '#333333'}}>{msg && msg.noteTitle}</Text>
					<Text style={ [styles.timeText,{textAlign: 'left',marginTop:10}] }>{ time }</Text>
					<Text style={ [styles.text,{marginTop: 20}] }>{ content }</Text>
				</View>
			)
		}
		return (
			<View style={ styles.container }>
				<ScrollView
					showsVerticalScrollIndicator={ false }>
					{ messageDetail }
					{ btn }
				</ScrollView>

				{ this._renderUpgrade(this.props) }
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	const { app, message, user } = state;
	return {
		user: user.get('userInfo'),
		msg: message.get('msgDetail'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
    insiteNotice: app.get('insiteNotice'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		getMsgDetail: ( body, type, props ) => {
			startTime = new Date().getTime()
			dispatch(fetchData({
				body,
				method: 'POST',
				api: type === 1 ? SYSTEM_MSG_DETAIL + "?noteId="+ body.noteId: STACK_MSG_DETAIL,
				success: (data) => {
					dispatch(passMsgDetail(data));
					dispatch(appendLogToFile('消息详情','消息详情',startTime))
				}
			}));
		},
		readSystemMessage:(body) =>{
			dispatch(fetchData({
				body,
				method: 'POST',
				api: SYSTEM_READ_ORNOT +'?userId=' + body.userId + '&noteId=' + body.noteId ,
				success:() => {
					dispatch(dispatchRefreshMessageList());
				}
			}));
		},
		readMessage:(body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: UPDATE_WEB_MSG,
				success: (data) => {
					dispatch(dispatchRefreshMessageList());
				}
			}));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetail);

