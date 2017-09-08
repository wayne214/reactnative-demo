'use strict'

import React, { Component, PropTypes } from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text
} from 'react-native';
import * as COLOR from '../../constants/colors'
import fromto from '../../../assets/img/routes/fromto_small.png'
import CountDown from '../../components/common/countDown'
import Button from 'apsl-react-native-button'

class FromToSmall extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount(){

	}

	render() {
		return (
			<View style={[{flexDirection: 'row'},this.props.style]}>
				<Image source={fromto} style={styles.fromToImage}/>
				<View style={styles.fromToTextView}>
					<Text style={styles.fromText}>{this.props.from}</Text>
					<Text style={styles.toText}>{this.props.to}</Text>
				</View>
			</View>
		)
	}
}


class BiddingCell extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){

	}

	render() {
		const {rowData={},dispatchCar,isBetter} = this.props
		return (
			<View style={styles.container}>
				<View style={{height: 10,backgroundColor: COLOR.APP_CONTENT_BACKBG}}></View>
				<View style={{height: 118,backgroundColor: 'white',justifyContent: 'space-between'}}>
					<FromToSmall style={{marginTop: 18}} from={rowData.from} to={rowData.to} />
					<View style={{flexDirection: 'row',height: 44,marginBottom:0,borderTopWidth: 1,borderTopColor: COLOR.LINE_COLOR,justifyContent: 'space-between',paddingRight: 10,paddingLeft: 10}}>
						<View style={styles.itemView}>
							{
								(()=>{
									if (rowData.state == 3) {
										return (
											<View>
											{
												isBetter ?
												(
													rowData.resourceStatus == 1 ?//resourceStatus 1货源正常 2已关闭3已取消4已删除
														<Text style={styles.itemText}>竞价运费:<Text style={{color: COLOR.TEXT_MONEY}}>{rowData.currentPrice}</Text>元</Text>
													: <Text style={[styles.itemText,{color: 'red',fontSize: 12}]}>该货源已被取消</Text>
												)
												:
												(
													rowData.resourceStatus == 1 ?
													(
														rowData.currentPrice ?
															<Text style={styles.itemText}>议后运费:<Text style={{color: COLOR.TEXT_MONEY}}>{rowData.currentPrice}</Text>元</Text>
														: <Text style={styles.itemText}>议后运费: 委托方拒绝</Text>
													)
													:
													(
														<Text style={[styles.itemText,{color: 'red',fontSize: 12}]}>该货源已被取消</Text>
													)
												)
											}
												<Text style={[styles.itemText,{fontSize: 12}]}>初始运费:<Text style={{textDecorationLine: 'line-through'}}>{rowData.freight}</Text>元</Text>
											</View>
										)
									}else{
										return (
											<View>
											{
												rowData.resourceStatus == 1 ? null
												: <Text style={[styles.itemText,{color: 'red',fontSize:12}]}>该货源已被取消</Text>
											}
												<Text style={styles.itemText}>初始运费:<Text style={{color: COLOR.TEXT_BLACK}}>{rowData.freight}</Text>元</Text>
											</View>
										)
									}
								})()
							}
						</View>
						<View style={styles.itemView}>
							<Text style={styles.itemText}>{isBetter ? '我的出价' : '我的议价'}:<Text style={{color: COLOR.APP_THEME}}>{rowData.orderPrice}</Text>元</Text>
						</View>
						<View style={[styles.itemView,{alignItems: 'flex-end',justifyContent: 'center'}]}>
							{
								(()=>{
									if (rowData.state == 1 && !isBetter) {//竞价中 的普通货源
										return (
											<View style={{alignItems: 'flex-end'}}>
												<Text style={{color: COLOR.TEXT_LIGHT,fontSize: 13,paddingRight: 2}}>剩余时间</Text>
												<CountDown overTime={rowData.expireTime || (new Date()).toString()} timeItemStyle={{backgroundColor: COLOR.TEXT_BLACK}} endCounttingCallBack={()=>{
												}}/>
											</View>
										)
									}else if (rowData.state == 2) {
										if (rowData.resourceStatus == 1) {
											if (rowData.isDispacth == 1) {
												return (
													<View style={{alignItems: 'flex-end'}}>
														<Button activeOpacity={0.3} style={{backgroundColor: 'white',borderWidth: 1,borderColor: COLOR.APP_THEME,borderRadius: 2,width: 66,height: 25,marginBottom: 0}}
															textStyle={{fontSize: 13,color: COLOR.APP_THEME}}
															onPress={()=>{
																if (dispatchCar) {
																	dispatchCar(rowData)
																}
															}}>
														  调度车辆
														</Button>
													</View>
												)
											}
										}
									}
								})()
							}
						</View>
					</View>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
	},
	itemView: {
		justifyContent: 'center',
		// backgroundColor: 'orange'
	},
	itemText: {
		fontSize: 14,
		color: COLOR.TEXT_LIGHT
	},
	fromToImage: {
		width: 10,
		height: 36,
		marginTop: 0,
		marginLeft: 10,
		marginRight: 5,
		marginBottom: 0,
	},
	fromToTextView: {
		justifyContent: 'space-between'
	},
	fromText: {
		fontSize: 14,
		color: COLOR.TEXT_BLACK
	},
	toText: {
		fontSize: 14,
		color: COLOR.TEXT_BLACK
	}
})

export default BiddingCell