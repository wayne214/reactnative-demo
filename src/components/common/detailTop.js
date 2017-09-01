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
import preOrderTop from '../../../assets/img/order/grab_order_top.png'
import * as COLOR from '../../constants/colors'
import * as ENUM from '../../constants/enum.js'

const { height,width } = Dimensions.get('window')

class DetailTop extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: PropTypes.style,
	};
	componentDidMount(){
		const configData = {
			type:'订单、委托单',
			priceValue: '委托单中 - 运费（订单中没有）',
			orderId: '委托单编号(订单中没有)',
			orderStatus: '订单中 - 订单状态',
			goodsTypeStr: '卡班、干线',
			dealPrice: '成交价格',
			entrustType: '承运类型  1=自营  2=第三方承运'
		}
	}

	render() {
		const {configData = {}} = this.props
		return (
			<View>
				<View style={styles.headerView}>
					<Image source={preOrderTop} style={{width,height: 80,position: 'absolute'}}/>
					<View style={{justifyContent: 'center',alignItems: 'center',height: 80}}>
						<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 24,fontWeight:'bold',color: COLOR.APP_THEME}}>{configData.orderStatus}</Text>
						<Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: 14,color: COLOR.TEXT_LIGHT}}>订单状态</Text>
					</View>
					<View style={styles.headerViewBottom}>
						<Text style={{color: COLOR.TEXT_BLACK}}>成单运费：<Text style={{color: COLOR.TEXT_MONEY}}>{configData.dealPrice}</Text>元</Text>
						<View style={styles.markView}>
							{
								configData.entrustType == 1 ?
									<View style={styles.entrustType}>
										<Text style={styles.entrustTypeText}>{'自营'}</Text>
									</View>
								: null
							}
							<View style={styles.routeType}>
								<Text style={styles.routeTypeText}>{configData.goodsTypeStr}</Text>
							</View>
						</View>
					</View>
				</View>
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
		paddingRight: 20,
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: COLOR.LINE_COLOR,
	},
	markView:{
		flexDirection: 'row',
	},
	entrustType:{
		justifyContent:'center',
		alignItems:'center',
		paddingLeft: 10,
		paddingRight: 10,
		borderWidth: 1,
		borderColor: COLOR.ENTRUST_TYPE,
		marginRight: 10,
		borderBottomLeftRadius: 2,
		borderBottomRightRadius: 2,
	},
	entrustTypeText:{
		color: COLOR.ENTRUST_TYPE
	},
	routeType:{
		backgroundColor: '#fff3dd',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomLeftRadius: 2,
		borderBottomRightRadius: 2,
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