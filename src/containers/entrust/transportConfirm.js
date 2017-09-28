// ROUTE_TRANSPORT_CONFIRM
'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import * as API from '../../constants/api'
import Button from 'apsl-react-native-button'
import GoodsInfo from '../../components/common/goodsInfo'
import DetailTop from '../../components/common/detailTop'
import * as ENUM from '../../constants/enum'
import {fetchData,changeTab,appendLogToFile} from '../../action/app'
import {receiveTransportConfirmOrderDetail} from '../../action/entrust'
import {changeOrderTopTab} from '../../action/order'
import Toast from '../../utils/toast'
let startTime = 0
const { height,width } = Dimensions.get('window')

class TransportConfirm extends Component {
	constructor(props) {
	  super(props);
	  const {params} = this.props.navigation.state
	  console.log("确认承运页面接受的参数",params);
	  console.log("实际需要的参数 、、 goodsId 和 carId");
	  this.state = {
	  	params,
	  	carId: params.carId,
	  	goodsId: params.goodsId,
	  	agree: true
	  }
	}
	componentDidMount() {
		this.props._getOrderDetail({
			goodsId: this.state.goodsId
		})
	}
	componentWillUnmount() {
		this.props._clearOrderDetail()
	}
	static navigationOptions = ({navigation})=>{
		return {
			header: <NavigatorBar router={navigation}/>
		}
	}
	render() {
		const {agree,carId} = this.state
		const {transpostConfirmDetail} = this.props
		if (!(transpostConfirmDetail && transpostConfirmDetail.resourceId)) {return null};
		return <View style={styles.container}>
			{
				transpostConfirmDetail ?
					<ScrollView>
						<DetailTop configData={{
							type:ENUM.DETAIL_TYPE.ENTRUST,
							priceValue: transpostConfirmDetail.freight,
							orderId: transpostConfirmDetail.resourceId,
							goodsTypeStr: transpostConfirmDetail.goodsTypeStr,
							orderStatus: transpostConfirmDetail.orderStateStr
						}}/>
						<GoodsInfo configData={transpostConfirmDetail.goodsInfoData} shipperPhone={transpostConfirmDetail.entrustType == 2 ? transpostConfirmDetail.shipperPhone : null}/>
						<View style={{alignItems: 'center',marginTop: 40}}>
							{
								transpostConfirmDetail.entrustType == 1 ?
									<View style={{flexDirection: 'row',alignItems: 'center'}}>
										<View style={{padding:10,paddingRight: 3}}>
											<TouchableOpacity activeOpacity={0.8} onPress={()=>{
												this.setState({
													agree: !agree
												})
											}}>
												<View style={{flexDirection: 'row',alignItems: 'center'}}>
													{
														agree ?
															<Text style={{fontFamily: 'iconfont',fontSize: 20,color: COLOR.APP_THEME}}>&#xe62C;</Text>
														: <Text style={{fontFamily: 'iconfont',fontSize: 20,color: COLOR.APP_THEME}}>&#xe62d;</Text>
													}
												</View>
											</TouchableOpacity>
										</View>
										<TouchableOpacity activeOpacity={0.8} onPress={()=>{
												this.props.navigation.dispatch({
													type: RouteType.ROUTE_CONTRACT_DETAIL,
													params: {
														title: '合同模板',
														isTemplate: true
													}
												})
										}}>
											<View>
												<Text style={{padding:10, paddingLeft: 0, fontSize: 12,color: COLOR.TEXT_NORMAL}}>同意并签署<Text style={{color: COLOR.APP_THEME}}>承运合同</Text></Text>
											</View>
										</TouchableOpacity>
									</View>

								: null
							}
							<View>
								<Button activeOpacity={0.8}
								isDisabled={!agree}
								disabledStyle={{backgroundColor: COLOR.BUTTN_DISABLE}} style={{backgroundColor: COLOR.APP_THEME,borderWidth: 0,borderRadius: 2,width:width-80,height: 44}}
									textStyle={{fontSize: 14,color: 'white'}}
									onPress={()=>{
										this.props._transportConfirm({
											goodsId: transpostConfirmDetail.resourceId,
											carId,
											entrustType: transpostConfirmDetail.entrustType
										},()=>{
											Toast.show('承运成功！')
											this.props.navigation.dispatch({mode: 'reset',type: 'Main',params: {currentTab: 'order',insiteNotice: this.props.insiteNotice}})
											this.props._toOrderListPage()
										})
									}}>
								  确认承运
								</Button>
							</View>
						</View>

					</ScrollView>
				: null
			}
		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	}
})

const mapStateToProps = (state) => {
	const {app,entrust} = state
	return {
		insiteNotice: app.get('insiteNotice'),
		transpostConfirmDetail: entrust.get('transpostConfirmDetail')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		_getOrderDetail: (params)=>{
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.CONFIRM_TRANSPORT_DETAIL,
				method: 'GET',
				body: params,
				success: (data)=>{
					console.log("---------- 确认承运 委托单详情",data);
					dispatch(receiveTransportConfirmOrderDetail(data))
					dispatch(appendLogToFile('确认承运','获取委托单详情',startTime))
				}
			}))
		},
		_clearOrderDetail: ()=>{
			dispatch(receiveTransportConfirmOrderDetail())
		},
		_transportConfirm: (params,successCallBack)=>{
			startTime = new Date().getTime();
			dispatch(fetchData({
				api: API.TRANSPORT_CONFIRM,
				method: 'POST',
				body: params,
				showLoading: true,
				success: (data)=>{
					console.log("------ 合同签订成功",data);
					if (successCallBack) {successCallBack()};
					dispatch(appendLogToFile('确认承运','确认承运',startTime))
				}
			}))
		},
		_toOrderListPage: ()=>{
			dispatch(changeTab('order'))
			dispatch(changeOrderTopTab(0,0))
			dispatch(appendLogToFile('确认承运','跳转到订单列表',0))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TransportConfirm);

