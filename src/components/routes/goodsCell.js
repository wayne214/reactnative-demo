'use strict';

import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import AddressFromTo from '../common/addressFromTo'
import * as COLOR from '../../constants/colors'
import CompeteOver from '../../../assets/img/routes/competeOver.png'
import SupplyAndNeed from '../../components/common/supplyAndNeed'
import Button from 'apsl-react-native-button'
import CountDown from '../common/countDown'
import DashLine from '../../../assets/img/order/dash_line.png'
import moment from 'moment'

const { height,width } = Dimensions.get('window');
class GoodsCell extends Component{
	constructor(props) {
		super(props);
		const {rowData} = props
		this.state ={
			countOver: false
			// finish: rowData.resourceState != 2 || overTimeStamp < nowStamp// 1未成交 2已成交
			// 委托状态 resourceState ：1待审核   2竞价中   3派单失败    4派单中   5抢单中  6已成单   7待调度   8已驳回   9已取消   10已删除  11委托失败 12 待调度  13已关闭
		}
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){

	}

	render() {
		const { rowData, itemClick, grabOrderAction, biddingAction,endCounttingCallBack} = this.props
		const finish = (rowData.resourceState != 2 || rowData.isOverTime);
		return (
			<TouchableOpacity activeOpacity={1} onPress={()=>{
				if (itemClick) {
					itemClick(rowData)
				}
			}}>
				<View style={styles.seperationView}></View>
				<View style={styles.container}>
					<AddressFromTo style={{marginTop: 25}} from={rowData.from} to={rowData.to}/>
					<Text style={styles.installDate}>装货时间：{rowData.installDate}</Text>
					<SupplyAndNeed {...rowData}/>
					{
						(()=>{
							if (rowData.isBetter) {
								if (finish) {
									return null
								}else{
									return (
										<View style={styles.makeOrderView}>
											{
												rowData.resourceState == 2 ?
													<View style={styles.countView}>
														<View style={{justifyContent: 'center'}}>
															<Text style={{color: COLOR.TEXT_LIGHT}}>剩余时间:</Text>
														</View>

														<CountDown overTime={rowData.overTime} endCounttingCallBack={()=>{
															console.log("---- 倒计时结束 ");
															if (endCounttingCallBack) {endCounttingCallBack(rowData.resourceId)};
														}}/>
													</View>
												: null
											}

											<View style={styles.buttonView}>
												{
													!rowData.offerPrice && rowData.offerCount > 0 ?
														<View style={{marginRight: 5}}>
															<Text style={{color: COLOR.TEXT_NORMAL,fontSize: 14}}>已有<Text style={{color: COLOR.APP_THEME,fontSize: 17,fontWeight: 'bold'}}>{rowData.offerCount}</Text>个报价</Text>
														</View>
													: null
												}
												{
													rowData.offerPrice ?
														<TouchableOpacity activeOpacity={0.8} onPress={()=>{
															if (biddingAction) {
																biddingAction(rowData)
															}
														}}>
															<View style={{flexDirection: 'row',height: 40,alignItems: 'center'}}>
																<Text style={{color: COLOR.TEXT_LIGHT}}>我的报价:</Text>
																<Text style={{fontFamily: 'iconfont',color: COLOR.APP_THEME,fontSize: 22}}>&#xe61e;</Text>
																<View style={{height: 28,alignItems: 'center'}}>
																	<Text style={{fontSize: 24,color: COLOR.APP_THEME,backgroundColor: 'rgba(0,0,0,0)',fontWeight: 'bold'}}>{rowData.offerPrice}</Text>
																	<Image source={DashLine}/>
																</View>
																<Text>元</Text>
															</View>
														</TouchableOpacity>
													:
														<View style={{height: 31}}>
															<Button style={{backgroundColor: COLOR.APP_THEME,borderWidth: 0,borderRadius: 2,width: width > 320 ? 106 : 60,height: 31}}
																textStyle={{fontSize: 14,color: 'white'}}
																activeOpacity={0.8}
																isDisabled={Date.parse(moment(rowData.overTime, 'YYYY-MM-DD HH:mm:ss').format()) < Date.now() }
																disabledStyle={{backgroundColor: COLOR.BUTTN_DISABLE}}
																onPress={()=>{
																	console.log("--- ?? ",Date.parse(moment(rowData.overTime, 'YYYY-MM-DD HH:mm:ss').format()),Date.now(),this.state.countOver);
																	if (biddingAction) {
																		biddingAction(rowData)
																	}
																}}>
																报价
															</Button>
														</View>
												}
											</View>
										</View>
									)
								}
							}else{
								return (
									<View style={styles.makeOrderView}>
										{
											rowData.robType == 2 ?
												<Button style={{backgroundColor: COLOR.APP_THEME,borderWidth: 0,borderRadius: 2,width: 106,height: 31,position:'absolute',right: 10,top: 9}}
													textStyle={{fontSize: 14,color: 'white'}}
													activeOpacity={0.8}
													onPress={()=>{
														if (grabOrderAction) {
															grabOrderAction(rowData)
														}
													}}>
												  抢单
												</Button>
											:
											<View style={{flex:1,alignItems: 'flex-end',paddingRight: 20}}>
												<Text style={{fontSize: 15,color: COLOR.TEXT_LIGHT}}>已报价:<Text style={{color: COLOR.APP_THEME}}>{rowData.offerPrice || '0.00' }</Text>元</Text>
											</View>
										}
									</View>
								)
							}
						})()
					}
					{
						rowData.isBetter && finish ?
							<Image source={CompeteOver} style={styles.markImage}/>
						: null
					}
					{
						rowData.goodsType ?
							<View style={styles.routeType}>
								<Text style={styles.routeTypeText}>{rowData.goodsTypeStr}</Text>
							</View>
						: null
					}
					{
						rowData.entrustType == 1 ?
							<View style={[styles.routeType,{right: 70,backgroundColor: 'white',borderBottomLeftRadius:2,borderBottomRightRadius:2,borderWidth:1,borderColor: 'red'}]}>
								<Text style={[styles.routeTypeText,{color:'red'}]}>自营</Text>
							</View>
						: null
					}
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

		color: COLOR.TEXT_MONEY,
	},
	supply: {
		height: 60,
		backgroundColor: 'white'
	},
	makeOrderView:{
		height: 49,
		marginLeft: 10,
		flexDirection: 'row',
		alignItems: 'center'
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
		right: 10,
		top: 35,
		width: 61,
		height: 38,
		resizeMode: 'contain'
	}
})

export default GoodsCell