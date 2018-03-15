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
import UniqueUtil from '../../utils/unique';
import LoginAvatar from '../../../assets/img/mine/login_avatar.png';
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
			refreshList,
		} = this.props

      const orderDetaiTypeList = rowData.ofcOrderDetailTypeDtoList;
      let goodTepesTemp = [];
      let goodTypesName = [];
      if(orderDetaiTypeList && orderDetaiTypeList.length > 0) {
          let good = '';
          for (let i = 0; i < orderDetaiTypeList.length; i++) {
              good = orderDetaiTypeList[i];
              goodTepesTemp = goodTepesTemp.concat(good.goodsTypes);
          }
          // 去重
          goodTypesName = UniqueUtil.unique(goodTepesTemp);
      } else {
          goodTypesName.push('其他');
      }

		return (
			<TouchableOpacity activeOpacity={0.8} onPress={()=>{
          this.props.navigation.dispatch({
              type: RouteType.ROUTE_ORDER_DETAIL,
              params: {transOrderList: rowData.transOrderList,refreshOrderList:refreshList, orderStatus: rowData.stateName},

          })
			}}>
				<View style={styles.container}>

					<View style={styles.subContainer}>
						<Text style={styles.orderCodeText}>运单编号：{rowData.scheduleCode}</Text>
						<View style={{flexDirection: 'row'}}>
							<Text style={{fontSize: 14, color: '#0092FF', marginLeft: 5}}>{rowData.stateName}</Text>
						</View>
					</View>

					<View style={styles.separateLine}/>

					<View style={{paddingTop: 10}}>
						<AddressItem startAddress={rowData.departureCompleteAddress} endAddress={rowData.destinationCompleteAddress}/>

						<Text style={[styles.orderCodeText, {marginLeft: 18, marginTop: 10}]}>装车时间：{rowData.loadingTime}</Text>

              {
                  false && <View style={{backgroundColor: '#E7F2FF', borderWidth: 1, borderColor: '#0092FF', justifyContent: 'center', alignItems: 'center'}}>
										<Text style={{fontSize: 10, color: '#0092FF'}}>撮合</Text>
									</View>
              }

						<View style={[styles.subContainer, {marginTop: 20}]}>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Image style={styles.avatarImage} source={LoginAvatar}/>
								<View style={{flexDirection: 'row'}}>

									<View style={[styles.cuoheBg, {width: 16}]}>
										<Text style={styles.cuoheText}>有</Text>
									</View>
									<View style={styles.goodBg}>
										<Text style={styles.goodText}>{goodTypesName + rowData.weight+'吨' + rowData.vol+'方'}</Text>
									</View>
								</View>
							</View>
								{
									rowData.stateName == '待发运' && <Button activeOpacity={0.8} style={[styles.buttonBg]}
																												textStyle={{fontSize: 14,color: '#333333'}}
																												onPress={()=>{
                                                            console.log("------ 查看出库单",rowData);
                                                            this.props.navigation.dispatch({
                                                                type: RouteType.ROUTE_LADING_BILL,
                                                                params: {
                                                                    title: '出库单',
                                                                    images: []//orderDetail.billOutImg.split(',')
                                                                }
                                                            })
                                                        }}>
										查看出库单
									</Button>
								}

								{
                    rowData.stateName == '待签收' && <Button activeOpacity={0.8} style={[styles.buttonBg]}
																	textStyle={{fontSize: 14,color: '#333333'}}
																	onPress={()=>{
                                      console.log("------ 上传回执单",rowData);
                                      this.props.navigation.dispatch({
                                          type: RouteType.ROUTE_UPLOAD_IMAGES,
                                          params: {
                                              title: '上传回执单',
                                              entrustType: rowData.entrustType,
                                              orderNo: rowData.orderNo,
                                              uploadType: 'UPLOAD_BILL_BACK_IMAGE',
                                              remark: ''
                                          }
                                      })
                                  }}>
										上传回执单
									</Button>
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
			justifyContent: 'space-between',
			alignItems: 'center'
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
				color: '#999',
		}
});

export default orderItemCell
