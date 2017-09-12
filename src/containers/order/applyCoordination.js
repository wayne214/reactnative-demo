'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TextInput,
	Alert,
	Linking,
	TouchableOpacity
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import FoldView from '../../components/common/foldView'
import * as API from '../../constants/api'
import {fetchData} from '../../action/app'
import {changeOrderToStateWithOrderNo,shouldOrderListRefreshAction} from '../../action/order'
import BaseComponent from '../../components/common/baseComponent.js'

class ApplyCoordination extends BaseComponent {
	constructor(props) {
	  super(props);
	  const {params} = this.props.navigation.state //router.getCurrentRoute()
	  this._callHontLine = this._callHontLine.bind(this)
	  this.state = {
	  	orderNo: params.orderNo,
	  	entrustType: params.entrustType,
	  	reasons: [
	  		{
	  			title:'您遇到了什么具体问题？',
	  			selected: -1,
	  			selectedContent: '',
	  			content: [
			  		{id:1,content:'找不到收货地址',selected: false},
			  		{id:2,content:'收货人联系不上',selected: false},
			  		{id:3,content:'收货人不能及时卸货',selected: false},
			  		{id:4,content:'收货人拒收',selected: false}
			  	],
			  },
			  {
			  	title:'收货方提出何种要求？',
			  	selected: -1,
			  	selectedContent: '',
			  	content: [
		  			{id:5,content:'要求增加卸货点',selected: false},
		  			{id:6,content:'要求变更卸货点',selected: false},
		  			{id:7,content:'要求司机亲自卸货',selected: false}
		  		]
		  	}
	  	],
	  	otherReasonContent: '',
	  	applyerName: '',
	  	applyerPhone: ''
	  }
	}
	componentDidMount() {
		super.componentDidMount()
	}
	_callHontLine(){
		console.log("---- 拨打热线电话找客服");
		Alert.alert('拨打热线','400-663-5656',
			[
				{ text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: '拨打', onPress: () => Linking.link('tel:400-663-5656') },
			]
		)
	}

	render() {
		const { otherReasonContent,applyerName,applyerPhone,reasons } = this.state
		const reasonsComponent = reasons.map((item,index)=>{
			return (
				<FoldView key={index} title={item.title} openHeight={item.content.length * 50} renderContent={()=>{
					const items = item.content.map((reasonItem,reasonIndex)=>{
						return(
							<TouchableOpacity key={reasonIndex} activeOpacity={0.8} onPress={()=>{
								const newReasons = this.state.reasons
								const oldSelectedIndex = newReasons[index].selected
								newReasons[index].selected = oldSelectedIndex == reasonIndex ? -1 : reasonIndex
								newReasons[index].selectedContent = oldSelectedIndex == reasonIndex ? '' : reasonItem.content
								this.setState({reasons: newReasons})
							}}>
								<View style={styles.reasonView}>
									<Text style={styles.leftText}>{reasonItem.content}</Text>
									{
										item.selected == reasonIndex ?
											<Text style={{fontFamily: 'iconfont',color: COLOR.APP_THEME}}>&#xe621;</Text>
										: <Text style={{fontFamily: 'iconfont',color: COLOR.APP_THEME}}>&#xe620;</Text>
									}
								</View>
							</TouchableOpacity>
						)
					})
				return (
					<View>
						{items}
					</View>
				)
				}}/>
			)
		})
		return <View style={styles.container}>
			{/*<NavigatorBar router={this.props.router} title={ '货物交付协调申请' }/>*/}
			<ScrollView keyboardShouldPersistTaps='handled'>
				<View style={styles.topInfoView}>
					<Text style={styles.topInfoText}>如您的货品在交付过程中遇到问题，请填写如下信息提交协调申请或者直接拨打客服电话：<Text onPress={()=>{
						this._callHontLine()
					}} style={{color: COLOR.APP_THEME}}>400-663-5656</Text></Text>
				</View>
				<View style={styles.contentView}>
					{reasonsComponent}
					<View style={[styles.reasonView,{height: 93,alignItems: 'flex-start'}]}>
						<Text style={[styles.leftText,{marginTop:5}]}>其他问题</Text>
						<TextInput
							underlineColorAndroid="transparent"
							multiline={true}
							autoFocus={false}
							maxLength={50}
							placeholder={'填写您的其他问题信息50字以内'}
							placeholderTextColor={COLOR.TEXT_LIGHT}
							style={{flex:1,padding: 0,fontSize: 15,lineHeight: 18,marginTop:5,textAlign: 'right',marginLeft: 10,height: 60,textAlignVertical: 'top'}}
							onChangeText={(text) => {
								this.setState({otherReasonContent:text})
							}}
							value={otherReasonContent}
			      />
					</View>
					<View style={styles.reasonView}>
						<Text style={styles.leftText}>您的姓名</Text>
						<TextInput
							underlineColorAndroid="transparent"
							placeholder={'请输入您的姓名'}
							placeholderTextColor={COLOR.TEXT_LIGHT}
							style={{flex:1,padding: 0,fontSize: 15,textAlign: 'right',marginLeft: 10}}
							onChangeText={(text) => {
								this.setState({applyerName:text})
							}}
							value={applyerName}
							/>
					</View>
					<View style={styles.reasonView}>
						<Text style={styles.leftText}>您的联系电话</Text>
						<TextInput
							underlineColorAndroid="transparent"
							keyboardType={'numeric'}
							placeholder={'请输入您的联系电话'}
							placeholderTextColor={COLOR.TEXT_LIGHT}
							style={{flex:1,padding: 0,fontSize: 15,textAlign: 'right',marginLeft: 10}}
							onChangeText={(text) => {
								this.setState({applyerPhone:text})
							}}
							value={applyerPhone}
							/>
					</View>
					<View style={{flex: 1,alignItems: 'center',paddingTop: 20,}}>
						<View style={{width: 295,height: 44,marginBottom: 20}}>
							<Button activeOpacity={0.8}
								isDisabled={!((!(reasons[0]['selected'] == -1 && reasons[1]['selected'] == -1) || otherReasonContent.length > 0) && applyerPhone.length > 0 && applyerName.length > 0)}
								disabledStyle={{backgroundColor: 'lightgray'}}
								style={styles.applyButton}
								textStyle={{fontSize: 15,color: 'white'}}
								onPress={()=>{
									const params = {
										orderNo: this.state.orderNo,
										entrustType: this.state.entrustType,
										problemFirst: reasons[0].selectedContent,
										problemSecond: reasons[1].selectedContent,
										problemOther: otherReasonContent,
										name: applyerName,
										phone: applyerPhone,
										carId: this.props.user.carId ? this.props.user.carId : ''
									}
									console.log("------ 提交申请",params);
									this.props._submitApplication(params,()=>{
										this.props.router.replaceWithHome()
										this.props.dispatch(shouldOrderListRefreshAction(true))
									})
								}}>
							  提交申请
							</Button>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	topInfoView: {
		flexDirection: 'row',
		height: 70,
		alignItems: 'center',
		// backgroundColor: 'orange',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR
	},
	topInfoText: {
		lineHeight: 25,
		fontSize: 14,
		color: COLOR.TEXT_NORMAL
	},
	contentView: {
		flex: 1,

	},
	reasonView: {
		height: 50,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR,
		backgroundColor: 'white',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10
	},
	applyButton: {
		borderWidth: 0,
		backgroundColor: COLOR.APP_THEME,
		borderRadius: 2,
		width: 295,
		height: 44
	},
	leftText: {
		fontSize: 15,
		color: COLOR.TEXT_NORMAL
	},
	flodItem: {
		height: 44,
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
	}

})

const mapStateToProps = (state) => {
	const {app} = state
	return {
		user: app.get('user')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		_submitApplication: (params,successCallBack)=>{
			dispatch(fetchData({
				api: API.APPLY_COORDINATION,
				method: 'POST',
				body: params,
				success: (data)=>{
					console.log("===== 协调申请提交成功");
					if (successCallBack) {successCallBack()};
					// dispatch(changeOrderToStateWithOrderNo(8,params.orderNo,'orderToDelivery'))
				}
			}))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyCoordination);

