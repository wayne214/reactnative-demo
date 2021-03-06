
'use strict'

import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text,
	Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import preOrderTop from '../../../assets/img/routes/goodlistdetailtop.png'
import * as COLOR from '../../constants/colors'
import * as ENUM from '../../constants/enum.js'

const { height,width } = Dimensions.get('window')

class DetailTop extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){
		// const configData = {
		// 	type:'订单、委托单',
		// 	priceValue: '委托单中 - 运费（订单中没有）',
		// 	orderId: '委托单编号(订单中没有)',
		// 	orderStatus: '订单中 - 订单状态',
		// 	goodsTypeStr: '卡班、干线',
		// }
	}

	render() {
		const {configData} = this.props;
		console.log('-----configData', configData);
		return (
			<View>
				{
					(()=>{
						if (1 == 2) {
							return (
								configData.priceValue ?
									<View style={styles.headerView}>
										<Image source={preOrderTop} style={{width,height: width * 0.213,position: 'absolute'}}/>
										<View style={{justifyContent: 'center',alignItems: 'center',height: width * 0.213}}>
											<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 32,fontWeight:'bold',color: COLOR.TEXT_BLACK}}>{configData.priceValue}</Text>
											<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 14,color: COLOR.TEXT_LIGHT}}>运费(元)</Text>
										</View>
										<View style={{height: 60,backgroundColor: 'white',borderTopWidth: MINI_LINE,borderTopColor: COLOR.LINE_COLOR}}>
											<View style={{flexDirection: 'row',justifyContent: 'space-between',margin: 8,marginRight: 0}}>
												<Text style={{color: COLOR.TEXT_BLACK}}>{`委托编号：${configData.orderId}`}</Text>
												<View style={styles.routeType}>
													<Text style={styles.routeTypeText}>{configData.goodsTypeStr}</Text>
												</View>
											</View>
											<View style={{marginLeft: 8}}>
												<Text style={{color: COLOR.APP_THEME}}>{configData.orderStatus}</Text>
											</View>
										</View>
									</View>
								:
									<View style={styles.headerView}>
										<Image source={preOrderTop} style={{width,height: width * 0.213,position: 'absolute'}}/>
										<View style={{justifyContent: 'center',alignItems: 'center',height: width * 0.213}}>
											<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 24,fontWeight:'bold',color: COLOR.APP_THEME}}>{configData.orderStatus}</Text>
											<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 14,color: COLOR.TEXT_LIGHT}}>委托状态</Text>
										</View>
										<View style={styles.headerViewBottom}>
											<Text style={{color: COLOR.TEXT_BLACK}}>{`委托编号：${configData.orderId}`}</Text>
											<View style={styles.routeType}>
												<Text style={styles.routeTypeText}>{configData.goodsTypeStr}</Text>
											</View>
										</View>
									</View>
							)
						}else {
							return (
								<View style={styles.headerView}>
									<Image source={preOrderTop} style={{width,height: width * 331 / 750,position: 'absolute'}}/>
									<View style={{justifyContent: 'center',height: width * 331 / 750, paddingLeft: 110}}>
										<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 24,fontWeight:'bold',color: COLOR.APP_THEME}}>{'待发车'}</Text>
										<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 14,color: COLOR.TEXT_LIGHT}}>{`运单编号：${configData.transCode}`}</Text>
									</View>
									<View style={styles.headerViewBottom}>
										<Text style={{color: COLOR.TEXT_BLACK}}>{`订单编号：${configData.orderCode}`}</Text>
									</View>
								</View>
							)
						}
					})()
				}
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1
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
		borderTopWidth: MINI_LINE,
		borderTopColor: COLOR.LINE_COLOR,
	},
	routeType:{
		backgroundColor: '#fff3dd',
		justifyContent: 'center',
		alignItems: 'center',
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
	}
})

export default DetailTop