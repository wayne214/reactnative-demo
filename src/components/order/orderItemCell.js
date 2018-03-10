'use strict';

import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	Alert
} from 'react-native';
import PropTypes from 'prop-types';
import AddressFromTo from '../common/addressFromTo'
import * as COLOR from '../../constants/colors'
import SupplyAndNeed from '../../components/common/supplyAndNeed'
import Button from 'apsl-react-native-button'
import CountDown from '../common/countDown'
import * as RouteType from '../../constants/routeType'
import moment from 'moment'
import Toast from '../../utils/toast.js'

const { height,width } = Dimensions.get('window');
import AddressItem from './../routes/goodlistAddressItem';

const buttonWidth = width < 321 ? 95 : 106

class orderItemCell extends Component{
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
          this.props.navigation.dispatch({
              type: RouteType.ROUTE_ORDER_DETAIL,
              params: {orderNo: rowData.orderNo,refreshOrderList:refreshList}
          })
				// if (rowData.orderType == 'ENTRUST') {
				// 	if (itemClick) {itemClick(rowData)};
				// }else{
				// 	if (rowData.isBatchEditing) {
				// 		this.props._changeSelectStateWithOrderNo(rowData.orderNo)
				// 	}else{
				// 		this.props.navigation.dispatch({
				// 			type: RouteType.ROUTE_ORDER_DETAIL,
				// 			params: {orderNo: rowData.orderNo,refreshOrderList:refreshList}
				// 		})
				// 	}
				// }
			}}>
				<View style={styles.container}>

					<View style={styles.subContainer}>
						<Text style={styles.orderCodeText}>运单编号：{''}</Text>
						<View style={{flexDirection: 'row'}}>
							<View style={styles.cuoheBg}>
								<Text style={styles.cuoheText}>撮合</Text>
							</View>
							<Text style={{fontSize: 14, color: '#0092FF', marginLeft: 5}}>{'待货主上传装货'}</Text>
						</View>
					</View>

					<View style={styles.separateLine}/>

					<View style={{paddingTop: 10}}>
						<AddressItem startAddress='北京市海淀区' endAddress='中华人民共和国首都'/>

						<Text style={[styles.orderCodeText, {marginLeft: 18, marginTop: 10}]}>装车时间：{'2017.04.18-2017.04.22'}</Text>

						<View style={[styles.subContainer, {marginTop: 20}]}>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Image style={styles.avatarImage}/>
								<View style={{flexDirection: 'row'}}>

									<View style={[styles.cuoheBg, {width: 16}]}>
										<Text style={styles.cuoheText}>有</Text>
									</View>
									<View style={styles.goodBg}>
										<Text style={styles.goodText}>{'水饺'}</Text>
									</View>
								</View>
							</View>

							<Button activeOpacity={0.8} style={[styles.buttonBg]}
											textStyle={{fontSize: 14,color: '#333333'}}
											onPress={()=>{
                          console.log("------ 查看出库单",rowData);
                          // this.props.navigation.dispatch({
                          //     type: RouteType.ROUTE_LADING_BILL,
                          //     params: {title: '装货清单',images: rowData.billGoodsImg.split(',')}
                          // })
                      }}>
								查看出库单
							</Button>

						</View>
					</View>


				</View>
			</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
	container:{
      backgroundColor: 'white',
      paddingTop: 15,
			paddingLeft: 15,
			paddingRight: 15,
	},
	buttonBg: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderRadius: 2,
			borderColor: '#CCCCCC',
      height: 35,
      width: buttonWidth,
	},
	subContainer: {
      flexDirection: 'row',
			justifyContent: 'space-between'
	},
	orderCodeText: {
      fontSize: 15,
			color: '#999999'
	},
	cuoheBg: {
      width: 30,
			height: 16,
			backgroundColor: '#999',
			marginLeft: 10
	},
	cuoheText: {
      textAlign: 'center',
			padding: 2,
			fontSize: 10,
			color: 'white'
	},
	separateLine: {
      height: 1,
			backgroundColor: '#E6EAF2',
			width: width,
			marginTop: 12
	},
	avatarImage: {
      borderRadius: 18,
			backgroundColor: 'red',
			width: 35,
			height: 35
	},
		goodBg: {
        borderColor: '#999',
				borderWidth: 1,
				marginLeft: 5,
				padding: 2,
				alignItems: 'center',
				justifyContent: 'center'
		},
		goodText: {
        textAlign: 'center',
				fontSize: 10,
				color: '#999'
		}
});

export default orderItemCell
