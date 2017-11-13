'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	Dimensions,
	Alert,
	Modal,
	InteractionManager,
	TouchableOpacity
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import preOrderTop from '../../../assets/img/routes/grab_order_top.png'
import FoldView from '../../components/common/foldView'
import GoodsInfo from '../../components/common/goodsInfo.js'
import DetailTop from '../../components/common/detailTop.js'
import * as ENUM from '../../constants/enum.js'
const { height,width } = Dimensions.get('window')
import * as API from '../../constants/api'
import {fetchData, appendLogToFile} from '../../action/app'
import {receiveOrderDetail,changeOrderToStateWithOrderNo} from '../../action/order'
import { dispatchBankCardList } from '../../action/bankCard';
import Button from 'apsl-react-native-button'
import Toast from '../../utils/toast.js';
import Coordination from '../../components/order/coordinatation'
import BaseComponent from '../../components/common/baseComponent'
let startTime = 0

class OrderDetail extends BaseComponent {
	constructor(props) {
	  super(props);
	  this._showCoordinateResult = this._showCoordinateResult.bind(this)
	  const {orderNo} = props.navigation.state.params
	  this.state = {
	  	orderNo,
	  	showCoordination: false
	  }
	  console.log("----- 订单详情  参数 orderNo: ",orderNo);
	}
	componentDidMount() {
		// InteractionManager.runAfterInteractions(()=>{
		//	//延迟执行
		// })
		setTimeout(()=>{
			this.props._getOrderDetail({orderNo: this.state.orderNo})
		}, 500);

	}
	componentWillUnmount() {
		this.props._clearOrderDetail()
	}
	static navigationOptions = ({navigation}) => {
		const {params} = navigation.state;
		return {
			header:(
				<NavigatorBar router={navigation} title={ '订单详情' } backViewClick={()=>{
					navigation.dispatch({type: 'pop'})
					if (params.refreshOrderList && params.shouldOrderListRefresh) {
						params.refreshOrderList()
					};
				}}/>
			)
		}
	}

	_showCoordinateResult(result){
		this.setState({
			showCoordination: true,
			coordinationResult: {//可以直接传result  没必要解开按key传值
				entrustType: result.entrustType,
				goodsType: result.goodsType,
				content: result.priceInstruction,
				consult: result.consultType == 1 ? '委托方' : '承运方',
				dealPrice: result.dealPrice,
				paymentPrice: result.paymentPrice,
			}
		})
	}

	_rendeFloderItem(itemTitle,clickAction,isLast){
		return (
			<View style={[styles.flodItem]}>
				<Text>{itemTitle}</Text>
				<TouchableOpacity activeOpacity={0.8} style={{flex:1}} onPress={()=>{if (clickAction) {clickAction()}}}>
					<View style={{flex:1,justifyContent: 'center'}}>
						<Text style={{color: COLOR.APP_THEME,textAlign:'right'}}>查看</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
	render() {
		const {orderDetail} = this.props
		const {showCoordination} = this.state
		console.log("====== i am order detail",orderDetail);
		let floderItemCount = 4
		if (orderDetail){
			if (orderDetail.orderNo && orderDetail.entrustType == 1) {floderItemCount+=1}
			if (orderDetail.billGoodsImg) {floderItemCount+=1}
			if (orderDetail.environmentImg) {floderItemCount+=1}
			if (orderDetail.billOutImg) {floderItemCount+=1}
			if ((orderDetail.entrustType == 1 && orderDetail.billBackImg) || (orderDetail.entrustType == 2 && orderDetail.orderState == 12 && orderDetail.billBackImg)) {
				floderItemCount+=1
			}
			if (orderDetail.companyPaymentImg) {floderItemCount+=1}
		}

		return <View style={styles.container}>
			{
				orderDetail ?
					<ScrollView style={styles.scrollView}>
						<DetailTop configData={{
							type: ENUM.DETAIL_TYPE.ORDER,
							orderId: orderDetail.orderNo,
							orderStatus: orderDetail.orderStateStr,
							goodsTypeStr: orderDetail.goodsTypeStr
						}}/>
						<View style={{backgroundColor: 'white',paddingLeft: 10,flexDirection: 'row',height: 18}}>
							<Text>成单运费：<Text style={{color: COLOR.TEXT_MONEY}}>{orderDetail.carrierDealPrice}</Text>元</Text>
						</View>
						{
							orderDetail.entrustType == 1 && orderDetail.goodsType == 1 && orderDetail.companyExaminePrice ?
								<View style={{backgroundColor: 'white',paddingLeft: 10,flexDirection: 'row',height: 40,alignItems: 'center'}}>
									<Text>审核运费：<Text style={{color: COLOR.TEXT_MONEY}}>{orderDetail.companyExaminePrice}</Text>元</Text>
								</View>
							: null
						}
						{
							orderDetail.consultState == 3  && !(orderDetail.entrustType == 1 && orderDetail.goodsType == 1) ?// 协调完成 且 不是自营 干线
								<View style={{backgroundColor: 'white',paddingLeft: 10,flexDirection: 'row',height: 40,alignItems: 'center'}}>
									<Text>协调运费：<Text style={{color: COLOR.TEXT_MONEY}}>{orderDetail.carrierPaymentPrice}</Text>元</Text>
								</View>
							: null
						}
						{
							(orderDetail.orderState == 10 || (orderDetail.orderState == 14 &&orderDetailentrustType == 1)) && orderDetail.promptState == 2 ?
								<View style={{backgroundColor: 'white',paddingLeft: 10,flexDirection: 'row',height: 40,alignItems: 'center'}}>
									<Text style={{color: '#F6001E',fontSize: 13}}>催款状态：已催款</Text>
								</View>
							: null
						}
						{
							orderDetail.orderState === 15 ?
								<View style={{backgroundColor: 'white',paddingLeft: 10,flexDirection: 'row',height: 40,alignItems: 'center'}}>
									<Text style={{color: '#F6001E',fontSize: 13}}>已结金额： {orderDetail.knotPrice || 0}元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;待结金额：{orderDetail.unknotPrice || 0}元</Text>
								</View>
							: null
						}
						{
							orderDetail.entrustType == 2 && orderDetail.orderState == 15 && orderDetail.auditProposeType == 2 ?
								<View style={{backgroundColor: 'white',padding: 10}}>
									<View style={styles.tips}>
										<Text style={styles.tipsContent}>驳回原因：{orderDetail.orderRejectReason}</Text>
									</View>
								</View>
							: null
						}
						<View style={{height: 5,backgroundColor: 'white'}}/>
						<GoodsInfo configData={orderDetail.goodsInfoData}/>
						<FoldView title={'收发货人信息'} openHeight={floderItemCount * 44} renderContent={()=>{
							return (
								<View>
									<View style={styles.flodItem}>
										<Text>发货人:</Text>
										{
											orderDetail.entrustType == 1 ?//自营订单 发货方：冷链马甲
												<Text>冷链马甲</Text>
											: <Text>{orderDetail.shipper}</Text>
										}
									</View>
									<View style={styles.flodItem}>
										<Text>发货人电话:</Text>
										<Text>{orderDetail.shipperPhone}</Text>
									</View>
									<View style={styles.flodItem}>
										<Text>收货人:</Text>
										<Text>{orderDetail.receiver}</Text>
									</View>
									<View style={styles.flodItem}>
										<Text>收货人电话:</Text>
										<Text>{orderDetail.receiverPhone}</Text>
									</View>
									{
										orderDetail.orderNo && orderDetail.entrustType == 1 ?
											this._rendeFloderItem('我的合同:',()=>{
												console.log("==== 查看合同");
												this.props.navigation.dispatch({
													type: RouteType.ROUTE_CONTRACT_DETAIL,
													params: {
														orderNo: orderDetail.orderNo,
														contractNo: orderDetail.companyContractNo,
														title: '合同详情'
													}
												})
												// this.props.router.push(RouteType.ROUTE_CONTRACT_DETAIL,{
												//
												//
												// })
											})
										: null
									}
									{
										orderDetail.billGoodsImg ?
											this._rendeFloderItem('装货清单:',()=>{
												this.props.navigation.dispatch({
													type: RouteType.ROUTE_LADING_BILL,
													params: {
														title: '装货清单',
														images: orderDetail.billGoodsImg.split(',')
													}
												})
											})
										: null
									}
									{
										orderDetail.environmentImg ?
											this._rendeFloderItem('环境照片:',()=>{
												this.props.navigation.dispatch({
													type: RouteType.ROUTE_LADING_BILL,
													params: {
														title: '环境照片',
														images: orderDetail.environmentImg.split(',')
													}
												})
											})
										: null
									}
									{
										orderDetail.billOutImg ?
											this._rendeFloderItem('出库单:',()=>{
												this.props.navigation.dispatch({
													type: RouteType.ROUTE_LADING_BILL,
													params: {
														title: '出库单',
														images: orderDetail.billOutImg.split(',')
													}
												})
											})
										: null
									}
									{
										(orderDetail.entrustType == 1 && orderDetail.billBackImg) || (orderDetail.entrustType == 2 && orderDetail.orderState == 12 && orderDetail.billBackImg) ?
											this._rendeFloderItem('回执单:',()=>{
												this.props.navigation.dispatch({
													type: RouteType.ROUTE_LADING_BILL,
													params: {
														title: '回执单',
														images: orderDetail.billBackImg.split(',')
													}
												})
											})
										: null
									}
									{
										orderDetail.companyPaymentImg ?
											this._rendeFloderItem('结算单:',()=>{
												this.props.navigation.dispatch({
													type: RouteType.ROUTE_LADING_BILL,
													params: {
														title: '结算单',
														images: orderDetail.companyPaymentImg.split(',')
													}
												})
											})
										: null
									}
								</View>
							)
						}}/>
						<FoldView title={'司机信息'} openHeight={3 * 44} renderContent={()=>{
							return (
								<View>
									<View style={styles.flodItem}>
										<Text>司机:</Text>
										<Text>{orderDetail.carOwnerName}</Text>
									</View>
									<View style={styles.flodItem}>
										<Text>司机电话:</Text>
										<Text>{orderDetail.carOwnerPhone}</Text>
									</View>
									<View style={[styles.flodItem,{borderBottomWidth:0}]}>
										<Text>车牌号码:</Text>
										<Text>{orderDetail.carNo}</Text>
									</View>
								</View>
							)
						}}/>
						<View style={{height: 80,flex:1}}>
						{
							(()=>{
								if (orderDetail.entrustType == 1) {
									// 自营
									if (orderDetail.orderState == 1 || orderDetail.orderState == 2) {
										const dataSource = []
										if (orderDetail.billGoodsImg && orderDetail.billGoodsImg.length > 0) {
											dataSource.push({
												title: '查看装货清单',
												orderState: orderDetail.orderState,
												callBack: ()=>{
													this.props.navigation.dispatch({
														type: RouteType.ROUTE_LADING_BILL,
														params: {
															title: '装货清单',
															images: orderDetail.billGoodsImg.split(',')
														}
													})
												}
											})
										}
										dataSource.push({
											title: '上传出库单',
											orderState: orderDetail.orderState,
											callBack: ()=>{
												this.props.navigation.dispatch({
													type: RouteType.ROUTE_UPLOAD_IMAGES,
													params: {
														title: '上传出库单',
														orderNo: orderDetail.orderNo,
														entrustType: orderDetail.entrustType,
														uploadType: 'UPLOAD_BILL_OUT_IMAGE'
													}
												})
											}
										})
										return <ButtonView dataSource={dataSource}/>
									}else if (orderDetail.orderState == 3) {
										const dataSource = []
										if (orderDetail.billGoodsImg && orderDetail.billGoodsImg.length > 0) {
											dataSource.push({
												title: '查看装货清单',
												orderState: orderDetail.orderState,
												callBack: ()=>{
													this.props.navigation.dispatch({
														type: RouteType.ROUTE_LADING_BILL,
														params: {
															title: '装货清单',
															images: orderDetail.billGoodsImg.split(',')
														}
													})
												}
											})
										};
										dataSource.push(
											{
												title: '查看出库单',
												orderState: orderDetail.orderState,
												callBack: ()=>{
													this.props.navigation.dispatch({
														type: RouteType.ROUTE_LADING_BILL,
														params: {
															title: '出库单',
															images: orderDetail.billOutImg.split(',')
														}
													})
												}
											},
											{
												title: '装货确认',
												orderState: orderDetail.orderState,
												callBack: ()=>{
													Alert.alert('温馨提示','请认真确认是否已装货完毕',
														[{text: '取消', onPress: ()=>{}, style: 'cancel' },
														{text: '确认', onPress: ()=>{
															this.props._confirmInstall({
																entrustType: orderDetail.entrustType,
																orderNo: orderDetail.orderNo,
																toState: 4,
																orderTopType: 'orderToInstall',
																carId: this.props.user.carId ? this.props.user.carId : '',
															},()=>{
																Toast.show('装货确认成功！');
																this.props._getOrderDetail({orderNo: this.state.orderNo})
																this.props.navigation.setParams({
																	shouldOrderListRefresh: true
																})
															})
														}}]
													)
												}
											})
										return <ButtonView dataSource={dataSource} />
									}else if (orderDetail.orderState == 5) {
										return <ButtonView dataSource={[
											{
												title: '确认到达',
												callBack: ()=>{
													console.log("===== title: '确认到达',");
													Alert.alert('温馨提示','拍摄您周围的环境照片，或能确认您到达目的地的重点建筑物环境照片以确认到达',
														[{text: '取消', onPress: ()=>{}, style: 'cancel' },
														{text: '立即拍照', onPress: ()=>{
															this.props.navigation.setParams({
																shouldOrderListRefresh: true
															})
															this.props.navigation.dispatch({
																type: RouteType.ROUTE_UPLOAD_IMAGES,
																params: {
																	title: '上传环境照片',
																	orderNo: orderDetail.orderNo,
																	entrustType: orderDetail.entrustType,
																	uploadType: 'UPLOAD_ENVIRONMENT_IMAGES'
																}
															})
														}}]
													)
												}
											}
										]}/>
									}else if (orderDetail.orderState == 6 ) {
										const dataSource = []
										if (orderDetail.consultState == 1) {
											dataSource.push({
												title: '申请协调',
												callBack: ()=>{
													this.props.navigation.dispatch({
														type: RouteType.ROUTE_APPLY_COORDINATION,
														params: {
															title: '申请协调',
															orderNo: orderDetail.orderNo,
															entrustType: orderDetail.entrustType
														}
													})
												}
											})
										}
										dataSource.push({
											title: '确认交付',
											callBack: ()=>{
												Alert.alert('温馨提示','请上传您的收货回执单，以便于运输完成后资金结算',
													[{text: '取消', onPress: ()=>{}, style: 'cancel' },
													{text: '立即上传', onPress: ()=>{
														this.props.navigation.dispatch({
															type: RouteType.ROUTE_UPLOAD_IMAGES,
															params: {
																title: '上传回执单',
																orderNo: orderDetail.orderNo,
																uploadType: 'UPLOAD_BILL_BACK_IMAGE',
																entrustType: orderDetail.entrustType
															}
														})
													}}]
												);
											}
										})
										return <ButtonView dataSource={dataSource}/>
									}else if (orderDetail.orderState == 9){
										return <ButtonView dataSource={[
											{
												title: '协调结果',
												callBack: ()=>{
													this.props._requestCoordinateResult(
														{
															orderNo: orderDetail.orderNo,
															entrustType: orderDetail.entrustType,
															goodsType: orderDetail.goodsType,
															carId: this.props.user.carId ? this.props.user.carId : ''
														},
														(data)=>{this._showCoordinateResult(data)}
													)
												}
											},
											{
												title: '确认交付',
												callBack: ()=>{
													Alert.alert('温馨提示','请上传您的收货回执单，以便于运输完成后资金结算',
														[{text: '取消', onPress: ()=>{}, style: 'cancel' },
														{text: '立即上传', onPress: ()=>{
															this.props.navigation.dispatch({
																type: RouteType.ROUTE_UPLOAD_IMAGES,
																params: {
																	title: '上传回执单',
																	orderNo: orderDetail.orderNo,
																	uploadType: 'UPLOAD_BILL_BACK_IMAGE',
																	entrustType: orderDetail.entrustType
																}
															})
														}}]
													);
												}
											}
										]}/>

									}else if ( [10,14].includes(orderDetail.orderState) && orderDetail.promptState == 1) {
										return <ButtonView dataSource={[
											{
												title: '催款',
												callBack: ()=>{
													if (this.props.user.currentUserRole != 1) {
														Toast.show('司机帐号没有该权限')
														return
													}
													this.props._getBankCardList(this.props.user.userId,(data)=>{
														if (data.length < 1) {
															Alert.alert('温馨提示','您的账户还未添加银行账户，为不影响给您打款，请前往用户中心-会员信息进行设置！',[
																{text: '再看看', onPress:()=>{
																	console.log("cancle...");
																}},
																{text: '去设置', onPress:()=>{
																	this.props.navigation.dispatch({type: RouteType.ROUTE_ADD_BANK_CARD, params:{title:'新增开户行',id:-1}})
																}}
															])
														}else{
															if (this.props._applyClear) {
																Alert.alert('温馨提示','请您在催款的同时，确保将开具好的发票邮寄给我们，以免影响您的回款',[
																	{text: '取消', onPress:()=>{
																		console.log("cancle...");
																	}},
																	{text: '提交并查看', onPress:()=>{
																		this.props._applyClear({orderNo: orderDetail.orderNo, carId: this.props.user.carId ? this.props.user.carId : '' },()=>{
																				this.props.navigation.setParams({
																					shouldOrderListRefresh: true
																				})
																				this.props._getOrderDetail({orderNo: this.state.orderNo})
																				this.props.navigation.dispatch({type: RouteType.ROUTE_AGREEMENT_CONTENT, params: {title:'发票说明', type: 3}})
																			}
																		)
																	}}
																])
															}
														}
													})
												}
											}
										]}/>
									}else if (orderDetail.orderState == 16) {
										return <ButtonView dataSource={[
											{
												title: '确认结算',
												callBack: ()=>{
													console.log(" ===== title: '确认结算', ");
													this.props._clearConfirm({orderNo: orderDetail.orderNo, carId: this.props.user.carId ? this.props.user.carId : '' },()=>{
														this.props._getOrderDetail({orderNo: this.state.orderNo})
														this.props.navigation.setParams({
															shouldOrderListRefresh: true
														})
													})
												}
											}
										]}/>
									}else if ([12,17].includes(orderDetail.orderState)) {
										return <ButtonView dataSource={[
											{
												title: '查看结算单',
												callBack: ()=>{
													console.log(" ===== title: '查看结算单', ");
													if(this.props.nav.routes[this.props.nav.index - 1].routeName == RouteType.ROUTE_BILL_DETAIL){
													// if (this.props.router.getLastCurrentRouteKey() == 'BILL_DETAIL_PAGE') {
														this.props.navigation.dispatch({type: 'pop'})
													}else{
														this.props.navigation.dispatch({
															type: RouteType.ROUTE_BILL_DETAIL,
															params: {
																orderNo: orderDetail.orderNo
															}
														})
													}

												}
											}
										]}/>
									}else{
										// 除了以上所有orderState   所有consultState == 3 的都显示协调结果
										if(orderDetail.consultState == 3){
											return (
												<ButtonView dataSource={[
													{
														title: '协调结果',
														callBack: ()=>{
															this.props._requestCoordinateResult(
																{
																	orderNo: orderDetail.orderNo,
																	entrustType: orderDetail.entrustType,
																	goodsType: orderDetail.goodsType,
																	carId: this.props.user.carId ? this.props.user.carId : ''
																},(data)=>{this._showCoordinateResult(data)}
															)
														}
													}
												]}/>
											)
										}else{
											return null
										}
									}
								}else{
									// 第三方承运
									if (orderDetail.orderState == 3) {
										return <ButtonView dataSource={[
											{
												title: '装货确认',
												callBack: ()=>{
													Alert.alert('温馨提示','请认真确认是否已装货完毕',
														[{text: '取消', onPress: ()=>{}, style: 'cancel' },
														{text: '确认', onPress: ()=>{
															this.props._confirmInstall({
																entrustType: orderDetail.entrustType,
																orderNo: orderDetail.orderNo,
																toState: 4,
																orderTopType: 'orderToInstall',
																carId: this.props.user.carId ? this.props.user.carId : '',
															},()=>{
																Toast.show('装货确认成功！');
																// this.props.router.pop()
																this.props._getOrderDetail({orderNo: this.state.orderNo})
																this.props.navigation.setParams({
																	shouldOrderListRefresh: true
																})
															})
														}}]
													)
												}
											}
										]}/>
									}else if (orderDetail.orderState == 6 || orderDetail.orderState == 15) {
										const dataSource = []
										if (orderDetail.consultState == 1) {
											dataSource.push({
												title: '申请协调',
												callBack: ()=>{
													this.props.navigation.dispatch({
														type: RouteType.ROUTE_APPLY_COORDINATION,
														params: {
															title: '申请协调',
															orderNo: orderDetail.orderNo,
															entrustType: orderDetail.entrustType
														}
													})
												}
											})
										}
										dataSource.push({
											title: '确认交付',
											callBack: ()=>{
												Alert.alert('温馨提示','请上传您的收货回执单，以便于运输完成后资金结算',
													[{text: '取消', onPress: ()=>{}, style: 'cancel' },
													{text: '立即上传', onPress: ()=>{
														this.props.navigation.dispatch({
															type: RouteType.ROUTE_UPLOAD_IMAGES,
															params: {
																title: '上传回执单',
																orderNo: orderDetail.orderNo,
																uploadType: 'UPLOAD_BILL_BACK_IMAGE',
																entrustType: orderDetail.entrustType,
																remark: ''
															}
														})
													}}]
												)
											}
										})
										return <ButtonView dataSource={dataSource}/>
									}else if (orderDetail.orderState == 9) {
										return <ButtonView dataSource={[
											{
												title: '协调结果',
												callBack: ()=>{
													this.props._requestCoordinateResult(
														{
															orderNo: orderDetail.orderNo,
															entrustType: orderDetail.entrustType,
															goodsType: orderDetail.goodsType,
															carId: this.props.user.carId ? this.props.user.carId : ''
														},(data)=>{this._showCoordinateResult(data)}
													)
												}
											},
											{
												title: '确认交付',
												callBack: ()=>{
													Alert.alert('温馨提示','请上传您的收货回执单，以便于运输完成后资金结算',
														[{text: '取消', onPress: ()=>{}, style: 'cancel' },
														{text: '立即上传', onPress: ()=>{
															this.props.navigation.dispatch({
																type: RouteType.ROUTE_UPLOAD_IMAGES,
																params: {
																	title: '上传回执单',
																	orderNo: orderDetail.orderNo,
																	uploadType: 'UPLOAD_BILL_BACK_IMAGE',
																	entrustType: orderDetail.entrustType,
																	remark: ''
																}
															})
														}}]
													)
												}
											}
										]}/>
									}else{
										// 除了以上所有orderState   所有consultState == 3 的都显示协调结果
										if(orderDetail.orderState != 12 && orderDetail.consultState == 3){
											return (
												<ButtonView dataSource={[
													{
														title: '协调结果',
														callBack: ()=>{
															this.props._requestCoordinateResult(
																{
																	orderNo: orderDetail.orderNo,
																	entrustType: orderDetail.entrustType,
																	goodsType: orderDetail.goodsType,
																	carId: this.props.user.carId ? this.props.user.carId : ''
																},(data)=>{this._showCoordinateResult(data)}
															)
														}
													}
												]}/>
											)
										}else{
											return null
										}
									}
								}
							})()
						}
						</View>
					</ScrollView>
				: null
			}
			<Modal animationType={ "fade" } transparent={true} visible={showCoordination} onRequestClose={()=>console.log('resolve warnning')} >
				<Coordination data={this.state.coordinationResult} closeAction={()=>{
					this.setState({
						showCoordination: false
					})
				}}/>
			</Modal>

			{ this._renderUpgrade(this.props) }

		</View>
	}
}


class ButtonView extends Component {
	constructor(props){
		super(props)

	}
	render(){
		const {dataSource} = this.props
		const Buttons = dataSource.map((item,index)=>{
			return (
				<Button key={index} activeOpacity={0.8} style={{backgroundColor: COLOR.APP_THEME,borderWidth: 0,borderRadius: 2,height: 44,width: (width-20-(dataSource.length-1)*15)/dataSource.length}}
					isDisabled={item.isDisabled}
					disabledStyle={{backgroundColor: COLOR.BUTTN_DISABLE}}
					textStyle={{fontSize: 14,color: 'white'}}
					onPress={()=>{
						if(item.callBack){item.callBack()}
					}}>
				  {item.title}
				</Button>
			)
		})
		return (
			<View style={{flex: 1,flexDirection: 'row',paddingLeft: 10,paddingRight: 10,paddingTop: 20,justifyContent: 'space-between'}}>
				{ Buttons }
			</View>
		)
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	scrollView:{
		backgroundColor: COLOR.APP_CONTENT_BACKBG,
	},
	headerView: {
		flex: 1,
	},
	headerViewBottom:{
		flex:1,
		flexDirection: 'row',
		height: 44,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: COLOR.LINE_COLOR
	},
	routeType:{
		flex: 1,
		backgroundColor: '#fff3dd',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		borderBottomLeftRadius: 2,
		borderBottomRightRadius: 2,
		right: 10,
		width: 48,
		height: 21,
	},
	routeTypeText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: COLOR.TEXT_MONEY,
	},
	tips: {
		padding: 10,
		borderStyle: 'dashed',
		borderWidth: 1,
		borderColor: '#FFA200',
		backgroundColor: '#fff8ec'
	},
	tipsContent: {
		color: '#FFA200',
		fontSize: 13,
		lineHeight: 16
	},
	flodItem: {
		height: 44,
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
	},
	buttonView: {
		flex: 1,
		flexDirection: 'row',
		height: 49,
		justifyContent: 'space-around',
		alignItems: 'center',
		// marginRight: 10

	},
})

const mapStateToProps = (state) => {
	const {order, app, nav} = state
	return {
		nav,
		user: app.get('user'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
		orderDetail: order.get('orderDetail')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		_getOrderDetail:(params)=>{
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.GET_ORDER_DETAIL,
				method: 'GET',
				showLoading: true,
				body: params,
				success: (data)=>{
					console.log("------ 获取订单详情的数据",data);
					dispatch(receiveOrderDetail(data))
					dispatch(appendLogToFile('订单详情','获取订单详情',startTime))
				}
			}))
		},
		_clearOrderDetail:()=>{
			dispatch(receiveOrderDetail())
		},
		_clearConfirm: (params,successCallBack) =>{
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.CLEAR_CONFIRM,
				method: 'POST',
				showLoading: true,
				body: params,
				success: (data)=>{
					console.log(" 确认结算成功 改状态为12 已完成（从 orderPaying 中移除）");
					dispatch(changeOrderToStateWithOrderNo(12,params.orderNo,'orderPaying'))
					if (successCallBack) {successCallBack()}
					dispatch(appendLogToFile('订单详情','确认结算',startTime))
				}
			}))
		},
		_applyClear: (params,successCallBack)=>{
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.APPLY_CLEAR,
				method: 'POST',
				showLoading: true,
				body: params,
				success: (data)=>{
					console.log(" ----- 催款成功， 改状态为15 结算中 ");
					Toast.show('催款成功')
					dispatch(appendLogToFile('订单详情','催款成功',startTime))
					// dispatch(changeOrderToStateWithOrderNo(15,params.orderNo,'orderUnPay'))
					if (successCallBack) {successCallBack()}
				}
			}))
		},
		_confirmInstall: (params,successCallBack)=>{
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.CONFIRM_INSTALL,
				method: 'POST',
				showLoading: true,
				body: params,
				success: (data)=>{
					dispatch(appendLogToFile('订单详情','确认装货成功',startTime))
					if (successCallBack){successCallBack()}
					dispatch(changeOrderToStateWithOrderNo(params.toState,params.orderNo,params.orderTopType))
				}
			}))
		},
		_requestCoordinateResult: (params,successCallBack)=>{
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.COORDINATE_RESULT,
				method: 'GET',
				body: params,
				showLoading: true,
				success: (data)=>{
					console.log("------ 协调结果",data);
					if(successCallBack){successCallBack({...data,...params})}
					dispatch(appendLogToFile('订单详情','查看协调结果',startTime))
				}
			}))
		},
		_getBankCardList: (carrierId,successCallBack,failCallBack) => {
			startTime = new Date().getTime();
			dispatch(fetchData({
				body:{
					pageNo: 1,
					carrierId,
				},
				method: 'POST',
				api: API.QUERY_BANK_CARD_LIST,
				success: (data) => {
					successCallBack && successCallBack(data)
					dispatch(dispatchBankCardList({ data, pageNo: 1}));
					dispatch(appendLogToFile('订单详情','查询是否添加银行卡信息',startTime))
				}
			}));
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
