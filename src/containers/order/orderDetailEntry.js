'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
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

class orderDetailEntry extends BaseComponent {
	constructor(props) {
	  super(props);

	}
	componentDidMount() {
	}


	render() {
		const {orderDetailData} = this.props;
		console.log('---orderDetail', orderDetailData);
		return <View style={styles.container}>
					<ScrollView style={styles.scrollView}>
						<DetailTop configData={{
							orderCode: orderDetailData.orderCode,
              transCode: orderDetailData.transCode,
						}}/>
						<View style={{height: 5,backgroundColor: 'white'}}/>
						<GoodsInfo configData={orderDetailData.goodsInfo[0]} startAddress={orderDetailData.deliveryInfo.departureAddress} endAddress={orderDetailData.deliveryInfo.receiveAddress}/>
						<FoldView title={'发货方信息'} openHeight={2 * 44} renderContent={()=>{
                return (
									<View>
										<View style={styles.flodItem}>
											<Text>发货方:</Text>
                        {
                            orderDetailData.entrustType == 1 ?//自营订单 发货方：冷链马甲
															<Text>冷链马甲</Text>
                                : <Text>{orderDetailData.deliveryInfo.departureContactName}</Text>
                        }
										</View>
										<View style={styles.flodItem}>
											<Text>联系电话:</Text>
											<Text>{orderDetailData.deliveryInfo.departurePhoneNum}</Text>
										</View>
									</View>
                )
            }}/>
						<FoldView title={'收货方信息'} openHeight={2 * 44} renderContent={()=>{
							return (
								<View>
									<View style={styles.flodItem}>
										<Text>收货方:</Text>
										<Text>{orderDetailData.deliveryInfo.receiveContactName}</Text>
									</View>
									<View style={styles.flodItem}>
										<Text>联系电话:</Text>
										<Text>{orderDetailData.deliveryInfo.receivePhoneNum}</Text>
									</View>
								</View>
							)
						}}/>
						<FoldView title={'司机信息'} openHeight={3 * 44} renderContent={()=>{
							return (
								<View>
									<View style={styles.flodItem}>
										<Text>司机:</Text>
										<Text>{orderDetailData.carOwnerName}</Text>
									</View>
									<View style={styles.flodItem}>
										<Text>司机电话:</Text>
										<Text>{orderDetailData.carOwnerPhone}</Text>
									</View>
									<View style={[styles.flodItem,{borderBottomWidth:0}]}>
										<Text>车牌号码:</Text>
										<Text>{orderDetailData.carNo}</Text>
									</View>
								</View>
							)
						}}/>
					</ScrollView>
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
		backgroundColor: COLOR.APP_CONTENT_BACKBG,
		width: width,
    overflow: 'hidden',
	},
	scrollView:{
		backgroundColor: COLOR.APP_CONTENT_BACKBG,
		width: width,
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
		orderDetail: order.get('orderDetail'),
    plateNumber: state.user.get('plateNumber'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(orderDetailEntry);
