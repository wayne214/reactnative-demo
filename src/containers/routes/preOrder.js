'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	Image,
	TextInput,
	TouchableOpacity,
	Modal
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import preOrderTop from '../../../assets/img/routes/grab_order_top.png'
import * as COLOR from '../../constants/colors'
import addressFromPoint from '../../../assets/img/routes/from_point.png'
import addressToPoint from '../../../assets/img/routes/to_point.png'
import grabOrderNow from '../../../assets/img/routes/grab_order_now.png'
import biddingOrder from '../../../assets/img/routes/bidding_order.png'
import DateHandler from '../../utils/dateHandler'
import Picker from '../../utils/picker'
import CountDown from '../../components/common/countDown'
import GoodsInfo from '../../components/common/goodsInfo.js'
import {fetchData} from '../../action/app'
import {receiveGoodsDetail} from '../../action/goods'
import Toast from 'react-native-root-toast'
import * as API from '../../constants/api'
import moment from 'moment';

const { height,width } = Dimensions.get('window')

class ClassName extends Component {
	constructor(props) {
	  super(props);
	  const {params} = this.props.navigation.state //this.props.router.getCurrentRoute().params;
	  console.log("==== params",params);
	  this.state = {
	  	params,
	  	type: 0,
	  	modalVisiable: false,
	  	pickerDataType: '',
	  	pickerDateSource: [],

	  	installDateStart: null,
	  	installDateEnd: null,
	  	installTimeStart: null,
	  	installTimeEnd: null,
	  	arrivalDate: null,
	  	originPrice: (params.freight && params.freight.toString()),
	  	priceValue: (params.offerPrice && params.offerPrice.toString()) || (params.freight && params.freight.toString()),
	  	isOverTime: false
	  }
	}

	static navigationOptions = ({navigation}) => {
		const {state, setParams} = navigation
		const params = state.params
		return {
			title: params.isBetter ? '我要竞价' : '我要抢单'
		}
	}

	componentDidMount() {
		const {params} = this.state
		const {user} = this.props
		if (params) {
			// 点抢单或者报价按钮就回调这个接口 并把数据存在reducer上
			//
			// this.props._getResourceDetail(params.resourceId,user.userId)
		}

	}

	_onPickerConfirm(data){
    const { pickerDataType, pickerDateSource } = this.state;
    if (data && data.length > 0) {
    	switch(pickerDataType){
    		case 'installDateStart':
    			this.setState({
    				installDateStart: DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`),
    				installTimeStart: '',
    				installDateEnd: '',
    				installTimeEnd: '',
    				arrivalDate: ''
    			})
    			break;
    		case 'installTimeStart':
    			this.setState({
    				installTimeStart: `${data[0]}:${data[1]}`.replace('时','').replace('分',''),
    				installTimeEnd: ''
    			})
    			break;
    		case 'installDateEnd':
    			this.setState({
    				installDateEnd: (data && data.length==3) ? DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`) : data,
    				installTimeEnd:''
    			})
    			break;
    		case 'installTimeEnd':
    			this.setState({
    				installTimeEnd: `${data[0]}:${data[1]}`.replace('时','').replace('分','')
    			})
    			break;
    		case 'arrivalDate':
    			this.setState({
    				arrivalDate: DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`)
    			})
    			break;
    		default:
    			console.warn("none type is matched ");
    	}
    }
  }

  _showPickerView(type){
  	const {installDateStart,installTimeStart,installDateEnd,installTimeEnd,arrivalDate} = this.state
  	console.log(" ---- installDateStart",installDateStart);
  	const overTimeStamp = Date.parse(moment(installDateStart, 'YYYY-MM-DD').format())
  	const tomorrowStamp = overTimeStamp + 24 * 60 * 60 * 1000
  	const tomorrowDate = moment.unix(tomorrowStamp/1000).format('YYYY-MM-DD');


  	switch(type){
	  	case 'installDateStart':
  	    this.setState({pickerDateSource: DateHandler.createDateData()});
  	    break;
	  	case 'installTimeStart':
  	    this.setState({pickerDateSource: DateHandler.createInstallStartTimeData(installDateStart)});
  	    break;
	  	case 'installDateEnd':
	  		if (installDateStart) {
	  			this.setState({pickerDateSource: [installDateStart,tomorrowDate]})
	  		}else{
	  			this.setState({pickerDateSource: DateHandler.createDateData(installDateStart && installDateStart.split('-'))});
	  		}
  	    break;
	  	case 'installTimeEnd':
	  		if (installTimeStart) {
	  			if (installDateStart == installDateEnd) {
	  				//同一天 installTimeStart ~ 23:59
	  				this.setState({pickerDateSource: DateHandler.createTimeData(installTimeStart)});
	  			}else{
	  				// 不是同一天  0:0 ~ installTimeStart
						this.setState({pickerDateSource: DateHandler.createTimeData(null,installTimeStart)});
	  			}
	  		}else{
	  			this.setState({pickerDateSource: DateHandler.createTimeData('0:0')});
	  		}


  	    break;
  	  case 'arrivalDate':
	  	  this.setState({pickerDateSource: DateHandler.createDateData(installDateStart && installDateStart.split('-'))});
	  	  break;
	  	default:
	  		console.warn("type is error ");
	  }
	  this.setState({
	      pickerDataType: type,
	      modalVisiable: true,
	  })
  }

  _plusButtonClick(step){
  	const {params} = this.state
  	const {goodsDetail} = this.props
  	let priceValue;
  	let base = parseInt(this.state.priceValue)

		if (isNaN(base)) {
  		base = 0
  	}
		if (params.isBetter && base + step < goodsDetail.warnPrice ) {
			Toast.show(`报价不得低于${goodsDetail.warnPrice}元`)
			return
		}

  	if (step) {//step == 0 是出低价或者按货主出价
  		priceValue = base + step
  	}else{
  		priceValue = params.isBetter ? goodsDetail.warnPrice : goodsDetail.freight
  	}
  	this.setState({
  		priceValue: priceValue.toString()
  	})
  }
  componentWillUnmount() {
  	this.props._clearGoodsDetail()
  }
	render() {
		const {params,type,modalVisiable,pickerDateSource,installDateStart,installDateEnd,installTimeStart,installTimeEnd,arrivalDate,priceValue,originPrice} = this.state
		const {goodsDetail, user} = this.props
		const isBetter = params.isBetter
		return <View style={styles.container}>
			{/*<NavigatorBar router={this.props.router} title={ isBetter ? '我要竞价' : '我要抢单' }/>*/}
			{
				goodsDetail ?
					<ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: COLOR.APP_CONTENT_BACKBG}}>
						<View style={styles.headerView}>
							<Image source={preOrderTop} style={{width,height: 80,position: 'absolute'}}/>
							<View style={{justifyContent: 'center',alignItems: 'center',height: 80}}>
								<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 36,fontWeight:'bold',color: COLOR.TEXT_BLACK}}>{goodsDetail.freight}</Text>
								<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 14,color: COLOR.TEXT_LIGHT}}>初始运费(元)</Text>
							</View>
							{
								isBetter ?
									<View style={styles.headerViewBottom}>
										<View style={{flex:1}}>
											<Text style={{color: COLOR.TEXT_BLACK}}>已有<Text style={{color: COLOR.TEXT_MONEY}}>{goodsDetail.offerCount || 0}</Text>人出价</Text>
										</View>
										<View style={{flex:1,flexDirection: 'row',justifyContent: 'flex-end'}}>
											<View style={{justifyContent: 'center'}}>
												<Text style={{color: COLOR.TEXT_LIGHT}}>剩余时间:</Text>
											</View>
											<CountDown overTime={goodsDetail.overTime || (new Date()).toString()} endCounttingCallBack={()=>{
												this.setState({
													isOverTime: true
												})
												Toast.show('竞价时间已过！')
											}}/>
										</View>
									</View>
								: null
							}
						</View>
						<GoodsInfo configData={goodsDetail.goodsInfoData} shipperPhone={goodsDetail.entrustType === 2 ? goodsDetail.shipperPhone : ''}/>
						{
							!isBetter ?
								<View style={styles.seperationView}>
									<Text>请选择货物运输时间信息</Text>
								</View>
							: null
						}
						{
							!isBetter ?
								<View style={styles.timeInfo}>
									<Text style={{marginBottom: 17}}>预计装货时间</Text>
									<View style={styles.timeSelectInput}>
										<View style={styles.timeFromToView}>
											<View style={{justifyContent: 'center'}}>
												<Text>起</Text>
											</View>
											<View style={styles.inputsView}>
												<View style={[styles.inputView,{marginRight: 10}]}>
													<TouchableOpacity activeOpacity={0.7} style={{flex:1}} onPress={()=>{
														this._showPickerView('installDateStart')
													}}>
														<View style={{flex:1,flexDirection: 'row'}}>
															<View style={styles.pickeDateView}>
																<Text style={{color: installDateStart ? COLOR.TEXT_BLACK : COLOR.TEXT_LIGHT}}>{installDateStart || '请选择日期'}</Text>
															</View>
															<View style={{width: 40,height: 40,justifyContent: 'center',alignItems: 'center'}}>
																<Text style={styles.arrowIcon}>&#xe60e;</Text>
															</View>
														</View>
													</TouchableOpacity>
												</View>
												<View style={styles.inputView}>
													<TouchableOpacity activeOpacity={0.7} style={{flex:1}} onPress={()=>{
														this._showPickerView('installTimeStart')
													}}>
														<View style={{flex:1,flexDirection: 'row'}}>
															<View style={styles.pickeDateView}>
																<Text style={{color: installTimeStart ? COLOR.TEXT_BLACK : COLOR.TEXT_LIGHT}}>{installTimeStart || '请选择时间'}</Text>
															</View>
															<View style={styles.pickeDateIcon}>
																<Text style={styles.arrowIcon}>&#xe60e;</Text>
															</View>
														</View>
													</TouchableOpacity>
												</View>
											</View>
										</View>
										<View style={styles.timeFromToView}>
											<View style={{justifyContent: 'center'}}>
												<Text>止</Text>
											</View>
											<View style={styles.inputsView}>
												<View style={[styles.inputView,{marginRight: 10}]}>
													<TouchableOpacity activeOpacity={0.7} style={{flex:1}} onPress={()=>{
														this._showPickerView('installDateEnd')
													}}>
														<View style={{flex:1,flexDirection: 'row'}}>
															<View style={styles.pickeDateView}>
																<Text style={{color: installDateEnd ? COLOR.TEXT_BLACK : COLOR.TEXT_LIGHT}}>{installDateEnd || '请选择日期'}</Text>
															</View>
															<View style={styles.pickeDateIcon}>
																<Text style={styles.arrowIcon}>&#xe60e;</Text>
															</View>
														</View>
													</TouchableOpacity>
												</View>
												<View style={styles.inputView}>
													<TouchableOpacity activeOpacity={0.7} style={{flex:1}} onPress={()=>{
														this._showPickerView('installTimeEnd')
													}}>
														<View style={{flex:1,flexDirection: 'row'}}>
															<View style={styles.pickeDateView}>
																<Text style={{color: installTimeEnd ? COLOR.TEXT_BLACK : COLOR.TEXT_LIGHT}}>{installTimeEnd || '请选择时间'}</Text>
															</View>
															<View style={styles.pickeDateIcon}>
																<Text style={styles.arrowIcon}>&#xe60e;</Text>
															</View>
														</View>
													</TouchableOpacity>
												</View>
											</View>
										</View>
										<View style={styles.remarkView}>
											<Text style={styles.remarkText}>注：装货时间应在24小时内，避免造成额外损失</Text>
										</View>
									</View>
									<Text style={{marginTop: 23,marginBottom: 10}}>预计到货时间</Text>
									<TouchableOpacity activeOpacity={0.8} onPress={()=>{
										this._showPickerView('arrivalDate')
									}}>
										<View style={{flex:1,flexDirection: 'row', borderWidth: 1,height: 40,borderColor: COLOR.BORDER}}>
											<View style={{flex:1,height: 40,justifyContent: 'center',paddingLeft: 10}}>
												<Text style={{color: arrivalDate ? COLOR.TEXT_BLACK : COLOR.TEXT_LIGHT}}>{arrivalDate || '请选择日期'}</Text>
											</View>
											<View style={styles.pickeDateIcon}>
												<Text style={styles.arrowIcon}>&#xe60e;</Text>
											</View>
										</View>
									</TouchableOpacity>
								</View>
							: null
						}

						<View style={styles.seperationView}>
							<Text>我的报价{goodsDetail.entrustType == 1 ?'（含税）' : ''}</Text>
						</View>
						<View style={[styles.priceInfo,{paddingBottom: goodsDetail.entrustType == 1 ? 10 : 0}]}>
							<View style={{flexDirection: 'row'}}>
								<View style={styles.priceShow}>
									<View style={styles.priceShowBox}>
										<TextInput value={priceValue} style={styles.priceValue} underlineColorAndroid={ 'transparent' } onChangeText={(text)=>{
												if (isNaN(parseInt(text))) {
													this.setState({priceValue: ''})
												}else{
													this.setState({priceValue: parseInt(text).toString()})
												}
											}}
											onEndEditing={()=>{
												if (isBetter && priceValue < goodsDetail.warnPrice) {
													Toast.show(`报价不得低于${goodsDetail.warnPrice}元`)
													this.setState({priceValue: goodsDetail.warnPrice.toString()})
												};
											}}/>
									</View>
									<View style={styles.priceUnit}>
										<Text style={{color: COLOR.TEXT_LIGHT}}>元</Text>
									</View>
								</View>
								{
									goodsDetail.entrustType == 1 ?
										<View style={styles.editButton}>
										{
											isBetter ?
												<Text onPress={()=>{
													this._plusButtonClick(-1 * parseInt(goodsDetail.biddingCutRange || 0, 10));
												}} style={styles.editButtonText}>&#xe623;</Text>
											:
												<Text onPress={()=>{
													this._plusButtonClick(1 * parseInt(goodsDetail.grabRiseRange || 0, 10));
												}} style={styles.editButtonText}>&#xe624;</Text>
										}
										</View>
									: null
								}
							</View>
							<EditPrice originPrice={originPrice} warnPrice={goodsDetail.warnPrice} handleAction={(step)=>{
								this._plusButtonClick(step * (isBetter ? -1 : 1));
							}} isBetter={isBetter} steps={goodsDetail.entrustType == 1 ? [50,100,0] : [0]}/>
							{
								goodsDetail.entrustType == 1 ?
									<View style={styles.remarkView}>
										<Text style={styles.remarkText}>{isBetter ? `注：每次降价${goodsDetail.biddingCutRange}元，不得低于${goodsDetail.warnPrice}元` : `注：每次加${goodsDetail.grabRiseRange}元`}</Text>
									</View>
								: null
							}
						</View>
						<View style={styles.tips}>
							<Text style={styles.tipsContent}>温馨小贴士：为了提高您的{isBetter ? '竞价' : '抢单'}成功率以及保障您的运输利益，有效的控制价格调整幅度，成单的几率更高</Text>
						</View>
						{
							isBetter ?
								<TouchableOpacity activeOpacity={0.7} onPress={()=>{
									if (this.state.isOverTime) {Toast.show('竞价时间已过！'); return};
									if(!priceValue){ Toast.show('请填写您的报价'); return}
									this.props._biddingGoods({
										goodsId: goodsDetail.resourceId,
										companyId: user.userId,
										companyName: user.companyName,
										companyPhone: user.phoneNumber,
										orderPrice: priceValue,
										type: 1//1 竞价 2 抢单
									},()=>{
										console.log("---- 竞价 报价提交成功回调  返回上一界面 刷新列表");
										params.refreshCallBack && params.refreshCallBack()
										// this.props.router.pop()
										this.props.navigation.dispatch({ type: 'pop' })
									})
								}}>
									<View style={styles.buttonView}>
										<Image source={biddingOrder}/>
									</View>
								</TouchableOpacity>
							:
								<TouchableOpacity activeOpacity={0.7} onPress={()=>{
									if(!installDateStart){ Toast.show('请选择预计装货起始日期'); return}
									if(!installTimeStart){ Toast.show('请选择预计装货起始时间'); return}
									if(!installDateEnd){ Toast.show('请选择预计装货截止日期'); return}
									if(!installTimeEnd){ Toast.show('请选择预计装货截止时间'); return}
									if(!arrivalDate){ Toast.show('请选择预计到货时间'); return}
									if(!priceValue){ Toast.show('请填写您的报价'); return}
									this.props._biddingGoods({
										goodsId: goodsDetail.resourceId,
										companyId: user.userId,
										companyName: user.companyName,
										companyPhone: user.phoneNumber,
										orderPrice: priceValue,
										type: 2,//1 竞价 2 抢单,
										loadingStartDate: `${installDateStart} ${installTimeStart}:00`,
										loadingEndDate: `${installDateEnd} ${installTimeEnd}:00`,
										arrivalDate: arrivalDate+' 00:00:00',
										entrustType: goodsDetail.entrustType
									},()=>{
										console.log("---- 抢单议价提交成功回调  返回上一界面 刷新列表");
										params.refreshCallBack && params.refreshCallBack()
										// this.props.router.pop()
										this.props.navigation.dispatch({ type: 'pop' })
									})
								}}>
									<View style={styles.buttonView}>
										<Image source={grabOrderNow}/>
									</View>
								</TouchableOpacity>
						}

					</ScrollView>
				: null
			}
			<Modal animationType={ "fade" } transparent={true} visible={modalVisiable} onRequestClose={()=>console.log('resolve warnning')} >
			  <Picker data={pickerDateSource}
					onPickerConfirm={(data)=>{
						this.setState({modalVisiable: false});
						this._onPickerConfirm(data);
						console.log(" log onPickerConfirm",data);
					}}
					onPickerCancel={(data)=>{
						this.setState({modalVisiable: false});
					}}
					onPickerSelect={(data)=>{
						console.log(" log onPickerSelect",data);
					}}/>
			</Modal>
		</View>
	}
}

class EditPrice extends Component {
	constructor(props){
		super(props)

	}
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.priceValue) {
			return false
		}else{
			return true
		}
	}
	render(){
		const {isBetter,steps,handleAction,originPrice,warnPrice} = this.props
		const items = steps.map((item,index)=>{
			return (
				<TouchableOpacity activeOpacity={0.7} key={index} onPress={()=>{
					handleAction(item)
				}}>
					<View style={styles.handleButton}><Text style={{color: 'white'}}>{ item > 0 ? (isBetter ? `减${item}` : `加${item}`) : (isBetter ? `出底价${warnPrice}` : `初始运费${originPrice}元抢单`) }</Text></View>
				</TouchableOpacity>
			)
		})
		return (
			<View style={styles.handleButtonsView}>
				{items}
			</View>
		)
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
	},
	headerView: {
		flex: 1,
		backgroundColor: 'green'
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
	seperationView: {
		height: 44,
		justifyContent: 'center',
		marginLeft: 10
	},
	timeInfo: {
		backgroundColor: 'white',
		paddingTop: 24,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 20
	},
	timeSelectInput: {
		// backgroundColor: '#999'
		// flexDirection:
		// margin: 10,
		// backgroundColor:
	},
	timeFromToView: {
		flexDirection: 'row',
		height: 40,
		marginBottom: 10
	},
	inputsView: {
		flex:1,
		flexDirection: 'row',
		marginLeft: 5
	},
	inputView: {
		flex: 1,
		borderWidth: 1,
		borderColor: COLOR.BORDER,
		// margin: 5,
		// marginRight: 10
	},
	remarkView: {
		backgroundColor: '#fff2f1',
		height: 32,
		justifyContent: 'center',
		alignItems: 'center'
	},
	remarkText: {
		color: '#EA574C',
		fontSize: 14
	},
	priceInfo: {
		padding: 10,
		backgroundColor: 'white'
	},
	priceShow: {
		flex:1,
		borderWidth: 1,
		height: 44,
		borderColor: COLOR.BORDER,
		flexDirection: 'row'
	},
	priceShowBox: {
		flex: 1,
		justifyContent: 'center',
		paddingLeft: 10
	},
	priceValue: {
		flex: 1,
		height: 40,
		padding: 0,
		color: COLOR.TEXT_BLACK,
		fontSize: 24,
		fontWeight: 'bold'
	},
	priceUnit: {
		width: 44,
		height: 44,
		justifyContent: 'center',
		alignItems: 'center'
	},
	editButton: {
		width: 44,
		height: 44,
		justifyContent: 'center',
		alignItems: 'center'
	},
	editButtonText: {
		fontFamily: 'iconfont',
		fontSize: 24,
		color: COLOR.TEXT_BLACK
	},
	handleButtonsView: {
		height: 51,
		// backgroundColor: 'orange',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	handleButton: {
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 5,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 13,
		height: 26,
		backgroundColor: COLOR.APP_THEME
	},
	tips: {
		margin: 10,
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
	buttonView: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 30
	},
	pickeDateView: {
		flex:1,
		height: 40,
		justifyContent: 'center',
		paddingLeft: 10
	},
	pickeDateIcon: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center'
	},
	arrowIcon: {
		fontFamily: 'iconfont',
		color: COLOR.TEXT_LIGHT
	}
})

const mapStateToProps = (state) => {
	const {app,goods} = state
	return {
		user: app.get('user'),
		goodsDetail: goods.get('goodsDetail')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		_clearGoodsDetail: ()=>{
			dispatch(receiveGoodsDetail())
		},
		_getResourceDetail: (resourceId,userId)=>{
			dispatch(fetchData({
				api: API.RESOURCE_DETAIL,
				method: 'POST',
				showLoading: true,
				body:{
					resourceId,
					companyId: userId
				},
				success:(data)=>{
					console.log("------ get resource detail success ",data);
					dispatch(receiveGoodsDetail(data))
				}
			}))
		},
		_biddingGoods: (params,successCallBack)=>{
			const api = params.type == 1 ? API.BIDDING_GOODS : API.ROB_GOODS
			console.log("------ api",api);
			dispatch(fetchData({
				api,
				method: 'POST',
				body: params,
				showLoading: true,
				success: (data)=>{
					if (params.type == 1) {
						console.log("----- 竞价 报价提交成功，。。",data,successCallBack);
					}else{
						console.log("=------ 抢单议价提交成功，，， ",data,successCallBack);
					}
					if (successCallBack) {successCallBack()};

				}
			}))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassName);

