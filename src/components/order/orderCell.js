'use strict';

import React, { Component, PropTypes } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	Alert
} from 'react-native';
import AddressFromTo from '../common/addressFromTo'
import * as COLOR from '../../constants/colors'
import SupplyAndNeed from '../../components/common/supplyAndNeed'
import Button from 'apsl-react-native-button'
import CountDown from '../common/countDown'
import * as RouteType from '../../constants/routeType'
import moment from 'moment'
import Toast from '../../utils/toast.js'

const { height,width } = Dimensions.get('window');
const buttonWidth = width < 321 ? 95 : 106

class OrderCell extends Component{
	constructor(props) {
		super(props);
		this.state = {
			acceptButtonEnable: true
		}
	}

	static propTypes = {
	  style: View.propTypes.style,
	  itemClick: PropTypes.func,
	  dispatchCar: PropTypes.func,
	  acceptDesignate: PropTypes.func,
	  showCoordination: PropTypes.func,
	  deleteOrderUndispatch: PropTypes.func,

	};
	componentDidMount(){

	}

	render() {
		const {
			rowData,
			itemClick,
			dispatchCar,//调度车辆
			acceptDesignate,//接受派单
			showCoordination,//协调结果
			refreshList,
			deleteOrderUndispatch,//删除已取消的待调度订单
		} = this.props
		const {
			acceptButtonEnable
		} = this.state

		const expireTime = rowData.expireTime || (new Date()).toLocaleString()
		// console.log("============= 过期时间 ", expireTime)

		return (
			<TouchableOpacity activeOpacity={0.8} onPress={()=>{
				console.log("====== rowData.orderType : ",rowData.orderType);
				if (rowData.orderType == 'ENTRUST') {
					if (itemClick) {itemClick(rowData)};
				}else{
					if (rowData.isBatchEditing) {
						this.props._changeSelectStateWithOrderNo(rowData.orderNo)
					}else{
						this.props.navigation.dispatch({
							type: RouteType.ROUTE_ORDER_DETAIL,
							params: {orderNo: rowData.orderNo,refreshOrderList:refreshList}
						})
					}
				}
			}}>
				<View style={{flex: 1,flexDirection: 'row'}}>
					{
						rowData.isBatchEditing ?
							<View style={{width: 40,justifyContent: 'center',alignItems: 'center'}}>
								{
									rowData.selected ?
										<Text style={{fontFamily: 'iconfont',color: COLOR.APP_THEME}}>&#xe621;</Text>
									: <Text style={{fontFamily: 'iconfont',color: COLOR.TEXT_NORMAL}}>&#xe620;</Text>
								}
							</View>
						: null
					}
					<View style={{flex: 1}}>
						<View style={styles.seperationView}></View>
						<View style={{flexDirection:'row', height : 50,backgroundColor: 'white',borderBottomWidth:1,borderBottomColor: COLOR.LINE_COLOR,justifyContent: 'space-between',paddingLeft: 10,paddingRight: 10}}>
							<View style={{justifyContent: 'center'}}>
								<Text style={{color: COLOR.TEXT_LIGHT,fontSize: 14}}>{rowData.orderType == 'ENTRUST' ? `委托编号:${rowData.resourceId}` : `订单编号:${rowData.orderNo}`}</Text>
							</View>
							<View style={{justifyContent: 'center'}}>
								<Text style={{color: COLOR.APP_THEME,fontSize: 14}}>{rowData.orderStateStr}</Text>
							</View>
						</View>
						<View style={styles.container}>

							<AddressFromTo style={{marginTop: 25}} from={rowData.from} to={rowData.to}/>
							<Text style={styles.installDate}>{rowData.goodsType == 1 ? '装货时间：' : '出发时间：'}{rowData.goodsType == 1 ? rowData.installDate : rowData.carBanDate}</Text>
							<SupplyAndNeed {...rowData}/>
							<View style={styles.makeOrderView}>
							{
								(()=>{
									if (rowData.isBatchEditing) {
										return null
									}
									if (rowData.orderType == 'ENTRUST') {
										if (rowData.entrustOrderStatus == 1 && rowData.orderState == 1) {
											return (
												<View style={styles.buttonView}>
													<View style={{paddingLeft: 10,flex:1}}>
														<Text style={{color: COLOR.TEXT_LIGHT,fontSize: 13,paddingBottom: 5}}>剩余时间</Text>
															<CountDown key={rowData.resourceId} overTime={expireTime} timeItemStyle={{backgroundColor: COLOR.TEXT_BLACK}} endCounttingCallBack={()=>{
																console.log(" ===== 过期 不能再接受派单");
																this.props.removeOverTimeOrder(rowData.resourceId)
															}}/>
													</View>
													<View style={styles.buttonViewInside}>
														<Button
															isDisabled={!acceptButtonEnable || moment().isAfter(expireTime)}
															disabledStyle={{backgroundColor: COLOR.BUTTN_DISABLE}}
															activeOpacity={0.8} style={styles.buttonStyle}
															textStyle={{fontSize: 14,color: 'white'}}
															onPress={()=>{
																if(acceptDesignate){acceptDesignate(rowData)}
															}}>
														  接受派单
														</Button>
													</View>
												</View>
											)
										}else if (rowData.entrustOrderStatus == 2 && rowData.orderState == 1) {
											return (
												<View style={styles.buttonView}>
													<View style={styles.buttonViewInside}>
													{
														rowData.resourceStatus == 1 ?//1货源未关闭 2已关闭
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	if (dispatchCar) {dispatchCar(rowData)}
																}}>
															  调度车辆
															</Button>
														:
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	Alert.alert('提示','确定要删除么',
																		[{text: '删除', onPress: ()=>{
																			if (deleteOrderUndispatch) {deleteOrderUndispatch(rowData.resourceId)}
																		}},
																		{text: '取消', onPress: ()=>{}, style: 'cancel' }]
																	)
																}}>
															  删除
															</Button>
													}
													</View>
												</View>
											)
										}
									}else if(rowData.orderType == 'ORDER'){
										if (rowData.entrustType == 1) {
											// 自营
											// case 1: return '待委托方上传装货清单' 				// 查看装货清单  上传出库单
											// case 2: return '待上传出库单'							// 查看装货清单  上传出库单
											// case 3: return '待装货确认'							// 查看装货清单  查看出库单  装货确认
											// case 4: return '待委托方确认装货'					// 无

											// case 5: return '待到货确认'							// 确认到达													-> 拍摄环境照片
											// case 6: return '待交付确认'							// 确认交付	 申请协调 	    					确认交付 -> 新页面 -> 上传回单提交确认  或者  申请协调
											// case 7: return '待委托方确认收货'
											// case 8: return '协调中'
											// case 9: return '协调完成'								// 确认交付  确认交付 -> 新页面 -> 上传回单提交确认  或者  申请协调

											// case 10: return '未结算'									// 申请结算
											// case 11: return '结算中'// 列表中不会出现 参照15  16
											// case 12: return '已完成'									// 查看结算单
											// case 13: return '已取消'
											// case 14: return '未结算' //'承运商未结算'	// 申请结算
											// case 15: return '结算中' //'承运商结算中'
											// case 16: return '结算中' //'待承运方结算'		// 确认结算
											// case 18: return '已关闭'

											if (rowData.orderState == 1 || rowData.orderState == 2) {
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															{
																rowData.billGoodsImg && rowData.billGoodsImg.length > 0 ?
																	<Button activeOpacity={0.8} style={[styles.buttonStyle,{marginRight: 10}]}
																		textStyle={{fontSize: 14,color: 'white'}}
																		onPress={()=>{
																			console.log("------ 查看装货清单",rowData);
																			this.props.navigation.dispatch({
																				type: RouteType.ROUTE_LADING_BILL,
																				params: {title: '装货清单',images: rowData.billGoodsImg.split(',')}
																			})
																		}}>
																	  查看装货清单
																	</Button>
																: null
															}
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	console.log("------ 上传出库单",rowData);
																	this.props.navigation.dispatch({
																		type: RouteType.ROUTE_UPLOAD_IMAGES,
																		params: {
																			orderNo: rowData.orderNo,
																			uploadType: 'UPLOAD_BILL_OUT_IMAGE',
																			entrustType: rowData.entrustType,
																		}
																	})
																}}>
															  上传出库单
															</Button>
														</View>
													</View>
												)
											}else if (rowData.orderState == 3) {//rowData.orderState == 3
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
														{
															rowData.billGoodsImg && rowData.billGoodsImg.length > 0 ?
																<Button activeOpacity={0.8} style={[styles.buttonStyle,{marginRight: 10}]}
																	textStyle={{fontSize: 14,color: 'white'}}
																	onPress={()=>{
																		console.log("------ 查看装货清单",rowData);
																		this.props.navigation.dispatch({
																			type: RouteType.ROUTE_LADING_BILL,
																			params: {
																				title: '装货清单',
																				images: rowData.billGoodsImg.split(',')
																			}
																		})
																	}}>
																  查看装货清单
																</Button>
															: null
														}
														{
															rowData.billOutImg && rowData.billOutImg.length > 0 ?
																<Button activeOpacity={0.8} style={[styles.buttonStyle,{marginRight: 10}]}
																	textStyle={{fontSize: 14,color: 'white'}}
																	onPress={()=>{
																		console.log("------ 查看出库单",rowData);
																		this.props.navigation.dispatch({
																			type: RouteType.ROUTE_LADING_BILL,
																			params: {
																				title: '出库单',
																				images: rowData.billOutImg.split(',')
																			}
																		})
																	}}>
																  查看出库单
																</Button>
															: null
														}
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	if (this.props._confirmInstall) {
																		this.props._confirmInstall({
																			orderNo: rowData.orderNo,
																			entrustType: rowData.entrustType,
																			carId: this.props.user.carId ? this.props.user.carId : '',
																		})
																	}
																}}>
															  装货确认
															</Button>
														</View>
													</View>
												)
											}else if (rowData.orderState == 5) {//case 5: '待承运方确认到达'	//确认到达 （拍环境照片）
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	Alert.alert('温馨提示','拍摄您周围的环境照片，或能确认您到达目的地的重点建筑物环境照片以确认到达',
																		[{text: '取消', onPress: ()=>{}, style: 'cancel' },
																		{text: '立即拍照', onPress: ()=>{
																			this.props.navigation.dispatch({
																				type: RouteType.ROUTE_UPLOAD_IMAGES,
																				params: {
																					orderNo: rowData.orderNo,
																					uploadType: 'UPLOAD_ENVIRONMENT_IMAGES',
																					entrustType: rowData.entrustType
																				}
																			})
																		}}]
																	)
																}}>
															  确认到达
															</Button>
														</View>
													</View>
												)
											}else if (rowData.orderState == 6 || rowData.orderState == 9) {// case 6: '待承运商确认交付'	//确认交付 上传回单 //case 9: '协调完成'			//确认交付 上传回单
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															{
																rowData.orderState == 9 ?
																	<Button activeOpacity={0.8} style={[styles.buttonStyle,{marginRight: 10}]}
																		textStyle={{fontSize: 14,color: 'white'}}
																		onPress={()=>{
																			if (this.props._requestCoordinateResult) {
																				this.props._requestCoordinateResult(
																					{
																						orderNo: rowData.orderNo,
																						entrustType: rowData.entrustType,
																						goodsType: rowData.goodsType,
																						carId: this.props.user.carId ? this.props.user.carId : ''
																					},
																					(data)=>{
																						if (this.props.showCoordination) {
																							this.props.showCoordination(data)
																						}
																					}
																				)
																			}
																		}}>
																	  协调结果
																	</Button>
																: null
															}
															{
																rowData.orderState == 6 && rowData.consultState == 1 ?//待交付且未申请过协调
																	<Button activeOpacity={0.8} style={[styles.buttonStyle,{marginRight: 10}]}
																		textStyle={{fontSize: 14,color: 'white'}}
																		onPress={()=>{
																			this.props.navigation.dispatch({
																				type: RouteType.ROUTE_APPLY_COORDINATION,
																				params: {
																					title: '申请协调',
																					orderNo: rowData.orderNo,
																					entrustType: rowData.entrustType
																				}
																			})
																		}}>
																	  申请协调
																	</Button>
																: null
															}
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	console.log("------ 确认交付",rowData);
																	Alert.alert('温馨提示','请上传您的收货回执单，以便于运输完成后资金结算',
																		[{text: '取消', onPress: ()=>{}, style: 'cancel' },
																		{text: '立即上传', onPress: ()=>{
																			this.props.navigation.dispatch({
																				type: RouteType.ROUTE_UPLOAD_IMAGES,
																				params: {
																					orderNo: rowData.orderNo,
																					uploadType: 'UPLOAD_BILL_BACK_IMAGE',
																					entrustType: rowData.entrustType
																				}
																			})
																		}}]
																	);
																}}>
															  确认交付
															</Button>
														</View>
													</View>
												)
											}else if (rowData.orderState === 10 || rowData.orderState === 14) {// case 10: '未结算'			//申请结算
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	if (this.props.user.currentUserRole != 1) {
																		Toast.show('司机帐号没有该权限')
																		return
																	}
																	this.props._getBankCardList(this.props.user.userId,(data)=>{
																		console.log("判断是否添加开户行信息 ",data);
																		if (data.length < 1) {
																			Alert.alert('温馨提示','您的账户还未添加银行账户，为不影响给您打款，请前往用户中心-会员信息进行设置！',[
																				{text: '再看看', onPress:()=>{
																					console.log("cancle...");
																				}},
																				{text: '去设置', onPress:()=>{
																					this.props.navigation.dispatch({
																						type: RouteType.ROUTE_ADD_BANK_CARD,params:{title:'新增开户行',id:-1}
																					})
																				}}
																			])
																		}else{
																			if (this.props._applyClear) {
																				Alert.alert('温馨提示','请您在申请结算同时，将您开具好的发票邮寄至我们，以免耽误您的结算申请',[
																					{text: '取消', onPress:()=>{
																						console.log("cancle...");
																					}},
																					{text: '查看并申请', onPress:()=>{
																						this.props._applyClear({
																							orderNo: rowData.orderNo,
																							carId: this.props.user.carId ? this.props.user.carId : '',
																							activeTab: this.props.activeTab || 0
																						},()=>{
																							this.props.navigation.dispatch({
																								type: RouteType.ROUTE_AGREEMENT_CONTENT, params: {title:'发票说明', type: 3}
																							})
																						})
																					}}
																				])
																			};
																		}
																	})


																}}>
															  申请结算
															</Button>
														</View>
													</View>
												)
											}else if (rowData.orderState == 16) {// case 11: '结算中'			//确认结算
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	console.log("------ 确认结算",rowData);
																	if (this.props._clearConfirm) {
																		this.props._clearConfirm({orderNo: rowData.orderNo, carId: this.props.user.carId ? this.props.user.carId : '' })
																	};
																}}>
															  确认结算
															</Button>
														</View>
													</View>
												)
											}else if (rowData.orderState == 12) {// case 12: '已完成'
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	console.log("------ 查看结算单",rowData);
																	this.props.navigation.dispatch({
																		type: RouteType.ROUTE_BILL_DETAIL,
																		params: {orderNo: rowData.orderNo}
																	})
																}}>
															  查看结算单
															</Button>
														</View>
													</View>
												)
											}else{
												// 除了以上所有orderState   所有consultState == 3 的都显示协调结果
												if(rowData.consultState == 3){
													return (
														<View style={styles.buttonView}>
															<View style={styles.buttonViewInside}>
																<Button activeOpacity={0.8} style={styles.buttonStyle}
																	textStyle={{fontSize: 14,color: 'white'}}
																	onPress={()=>{
																		if (this.props._requestCoordinateResult) {
																			this.props._requestCoordinateResult(
																				{
																					orderNo: rowData.orderNo,
																					entrustType: rowData.entrustType,
																					goodsType: rowData.goodsType,
																					carId: this.props.user.carId ? this.props.user.carId : ''
																				},
																				(data)=>{
																					if (this.props.showCoordination) {
																						this.props.showCoordination(data)
																					}
																				}
																			)
																		}
																	}}>
																  协调结果
																</Button>
															</View>
														</View>
													)
												}else{
													return null
												}
											}
										}else{
											// 第三方承运
											if (rowData.orderState == 3) {
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	Alert.alert('温馨提示','请认真确认是否已装货完毕',
																		[{text: '取消', onPress: ()=>{}, style: 'cancel' },
																		{text: '确认', onPress: ()=>{
																			console.log("-------- this.props.user.carId ",this.props.user.carId,rowData);
																			if (this.props._confirmInstall) {
																				this.props._confirmInstall({
																					orderNo: rowData.orderNo,
																					entrustType: rowData.entrustType,
																					carId: this.props.user.carId ? this.props.user.carId : '',
																				}, this.props.payload)
																			}
																		}}]
																	)
																}}>
															  装货确认
															</Button>
														</View>
													</View>
												)
											}else if (rowData.orderState == 6 || rowData.orderState == 15) {
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															{
																rowData.consultState == 1 ?
																	<Button activeOpacity={0.8} style={[styles.buttonStyle,{marginRight: 10}]}
																		textStyle={{fontSize: 14,color: 'white'}}
																		onPress={()=>{
																			this.props.navigation.dispatch({
																				type: RouteType.ROUTE_APPLY_COORDINATION,
																				params: {
																					title: '申请协调',
																					orderNo: rowData.orderNo,
																					entrustType: rowData.entrustType
																				}
																			})
																		}}>
																	  申请协调
																	</Button>
																: null
															}
															{
																rowData.consultState == 3 ?
																	<Button activeOpacity={0.8} style={[styles.buttonStyle,{marginRight: 10}]}
																		textStyle={{fontSize: 14,color: 'white'}}
																		onPress={()=>{
																			if (this.props._requestCoordinateResult) {
																				this.props._requestCoordinateResult(
																					{
																						orderNo: rowData.orderNo,
																						entrustType: rowData.entrustType,
																						goodsType: rowData.goodsType,
																						carId: this.props.user.carId ? this.props.user.carId : ''
																					},
																					(data)=>{
																						if (this.props.showCoordination) {
																							this.props.showCoordination(data)
																						}
																					}
																				)
																			}
																		}}>
																	  协调结果
																	</Button>
																: null
															}
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	console.log("------ 确认交付",rowData);
																	Alert.alert('温馨提示','请上传您的收货回执单，以便于运输完成后资金结算',
																		[{text: '取消', onPress: ()=>{}, style: 'cancel' },
																		{text: '立即上传', onPress: ()=>{
																			this.props.navigation.dispatch({
																				type: RouteType.ROUTE_UPLOAD_IMAGES,
																				params: {
																					orderNo: rowData.orderNo,
																					uploadType: 'UPLOAD_BILL_BACK_IMAGE',
																					entrustType: rowData.entrustType,
																					remark: ''
																				}
																			})
																		}}]
																	);
																}}>
															  确认交付
															</Button>
														</View>
													</View>
												)
											}else if (rowData.orderState == 9) {
												return (
													<View style={styles.buttonView}>
														<View style={styles.buttonViewInside}>
															<Button activeOpacity={0.8} style={[styles.buttonStyle,{marginRight: 10}]}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	if (this.props._requestCoordinateResult) {
																		this.props._requestCoordinateResult(
																			{
																				orderNo: rowData.orderNo,
																				entrustType: rowData.entrustType,
																				goodsType: rowData.goodsType,
																				carId: this.props.user.carId ? this.props.user.carId : ''
																			},
																			(data)=>{
																				if (this.props.showCoordination) {
																					this.props.showCoordination(data)
																				}
																			}
																		)
																	}
																}}>
															  协调结果
															</Button>
															<Button activeOpacity={0.8} style={styles.buttonStyle}
																textStyle={{fontSize: 14,color: 'white'}}
																onPress={()=>{
																	console.log("------ 确认交付",rowData);
																	Alert.alert('温馨提示','请上传您的收货回执单，以便于运输完成后资金结算',
																		[{text: '取消', onPress: ()=>{}, style: 'cancel' },
																		{text: '立即上传', onPress: ()=>{
																			this.props.navigation.dispatch({
																				type: RouteType.ROUTE_UPLOAD_IMAGES,
																				params: {
																					entrustType: rowData.entrustType,
																					orderNo: rowData.orderNo,
																					uploadType: 'UPLOAD_BILL_BACK_IMAGE',
																					remark: ''
																				}
																			})
																		}}]
																	);
																}}>
															  确认交付
															</Button>
														</View>
													</View>
												)
											}else{
												if (rowData.orderState != 12 && rowData.consultState == 3) {
													return (
														<View style={styles.buttonView}>
															<View style={styles.buttonViewInside}>
																<Button activeOpacity={0.8} style={styles.buttonStyle}
																	textStyle={{fontSize: 14,color: 'white'}}
																	onPress={()=>{
																		if (this.props._requestCoordinateResult) {
																			this.props._requestCoordinateResult(
																				{
																					orderNo: rowData.orderNo,
																					entrustType: rowData.entrustType,
																					goodsType: rowData.goodsType,
																					carId: this.props.user.carId ? this.props.user.carId : ''
																				},
																				(data)=>{
																					if (this.props.showCoordination) {
																						this.props.showCoordination(data)
																					}
																				}
																			)
																		}
																	}}>
																  协调结果
																</Button>
															</View>
														</View>
													)
												}else{
													return null
												}
											}
										}
									};
								})()
							}
							</View>
							{
								rowData.goodsTypeStr ?//1 干线 2卡班
									<View style={styles.routeType}>
										<Text style={styles.routeTypeText}>{rowData.goodsTypeStr}</Text>
									</View>
								: null
							}
							{
								rowData.entrustType == 1 ?//1自营  2第三方承运
									<View style={[styles.routeType,{right: 70,backgroundColor: 'white',borderBottomLeftRadius:2,borderBottomRightRadius:2,borderWidth:1,borderColor: 'red'}]}>
										<Text style={[styles.routeTypeText,{color:'red'}]}>自营</Text>
									</View>
								: null
							}
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		// flex: 1,
		backgroundColor: 'white'
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
	// seperationLine:{
	// 	height: 0.5,
	// 	backgroundColor: COLOR.LINE_COLOR
	// },
	supply: {
		height: 60,
		backgroundColor: 'white'
	},
	makeOrderView:{
		// height: 49,
		flexDirection: 'row',
		alignItems: 'center',
	},
	countView: {
		// flex: 1,
		width: 150,
		flexDirection: 'row',
	},
	buttonView: {
		flex: 1,
		flexDirection: 'row',
		height: 49,
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginRight: 10
	},
	seperationView: {
		height: 10,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	installDate: {
		color: COLOR.TEXT_LIGHT,
		fontSize: 14,
		paddingTop: 10,
		paddingLeft: 33,
		paddingBottom: 10
	},
	markImage: {
		position: 'absolute',
		right: 57,
		top: 17,
		width: 90,
		height: 72
	},
	buttonViewInside: {
		height: 35,
		flexDirection: 'row'
	},
	buttonStyle: {
		backgroundColor: COLOR.APP_THEME,
		borderWidth: 0,
		borderRadius: 2,
		height: 35,
		width:buttonWidth,
	}
})

export default OrderCell
