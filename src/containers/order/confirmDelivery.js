'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Alert
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import * as RouteType from '../../constants/routeType'
import * as API from '../../constants/api'
import {fetchData} from '../../action/app'

class ConfirmDelivery extends Component {
	constructor(props) {
	  super(props);
	  const {params} = this.props.navigation.state
	  this.state = {
	  	orderNo: params.orderNo,
	  	entrustType: params.entrustType,
	  	orderState: params.orderState,// 9 表示协调过，不再显示协调入口
	  	remark: ''
	  }
	  console.log("======= 确认交付 只需要orderNo  实际参数：",params);
	  this._deliveryAction = this._deliveryAction.bind(this)
	}
	componentDidMount() {

	}


	_deliveryAction(){
		const {orderNo,remark,entrustType} = this.state
		// if (billBackImg) {
		// 	console.warn("貌似不会执行");
		// 	this.props._deliveryRequest({
		// 		orderNo,
		// 		billBackImg,
		// 		orderRemark: remark
		// 	})
		// }else{
			Alert.alert('温馨提示','请上传您的收货回执单，以便于运输完成后资金结算',
				[{text: '取消', onPress: ()=>{}, style: 'cancel' },
				{text: '立即上传', onPress: ()=>{
					this.props.navigation.dispatch({
						type: RouteType.ROUTE_UPLOAD_IMAGES,
						params: {
							orderNo,
							uploadType: 'UPLOAD_BILL_BACK_IMAGE',
							remark,
							entrustType
						}
					})
				}}]
			);
		// }

	}


	render() {
		const {remark, orderNo,orderState,entrustType} = this.state
		return <View style={styles.container}>
			{/*<NavigatorBar router={this.props.router} title={ '货品交付确认' }/>*/}
			<View style={styles.topView}>
				<Text style={styles.confirmText}>您是否确认将您的货品交付于收货方?</Text>
			</View>
			<View style={styles.bottomView}>
				<View style={styles.remark}>
					<Text style={styles.remarkText}>备注</Text>
				</View>
				<View style={styles.inputView}>
					<TextInput
						underlineColorAndroid="transparent"
						multiline={true}
						autoFocus={false}
						maxLength={50}
						placeholder={'填写您的备注信息50字以内'}
						placeholderTextColor={COLOR.TEXT_LIGHT}
						style={{height: 80,padding: 0,marginTop: 6,fontSize: 15,lineHeight: 30}}
						onChangeText={(text) => {
							this.setState({remark:text})
						}}
						value={remark}
		      />
				</View>
			</View>
			<View style={styles.handleView}>
				<View>
					<Button activeOpacity={0.8}
						style={styles.affrimButton}
						textStyle={{fontSize: 15,color: 'white'}}
						onPress={()=>{
							console.log("------ 确认交付");
							this._deliveryAction()
						}}>
					  确认交付
					</Button>
				</View>
				{
					orderState == 9 ? null :
					<View style={styles.helpView}>
						<Text onPress={()=>{
							this.props.navigation.dispatch({
								type: RouteType.ROUTE_APPLY_COORDINATION,
								params: {
									orderNo,entrustType
								}
							})//这里肯定是自营的 entrustType === 1
						}} style={styles.helpText}>无法交付，申请协调</Text>
					</View>
				}
			</View>
		</View>
	}
}
const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {

	}
}


const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	topView: {
		height: 50,
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR,
		backgroundColor: 'white',
		justifyContent: 'center',
		paddingLeft: 10
	},
	confirmText: {
		fontSize: 15,
		color: COLOR.TEXT_NORMAL
	},
	bottomView: {
		height: 94,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	remark: {
		width: 55,
		height: 40,
		justifyContent: 'center',
		paddingLeft: 10,
		// backgroundColor: 'yellow',
	},
	inputView: {
		height: 94,
		flex: 1,
		// backgroundColor: 'orange'
	},
	remarkText: {
		fontSize: 15,
		color: COLOR.TEXT_NORMAL
	},
	handleView: {
		flex: 1,
		paddingTop: 40,
		alignItems: 'center',
	},
	affrimButton:{
		backgroundColor: COLOR.APP_THEME,
		borderWidth: 0,
		borderRadius: 2,
		width:295,
		height: 44
	},
	helpView: {
		marginTop: 35,
		borderBottomWidth: 1,
		borderBottomColor: COLOR.APP_THEME
	},
	helpText: {
		color: COLOR.APP_THEME,
		fontSize: 15
	}
})


export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDelivery);

