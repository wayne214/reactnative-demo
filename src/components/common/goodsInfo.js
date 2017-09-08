'use strict'

import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text,
	TouchableOpacity
} from 'react-native';
import addressFromPoint from '../../../assets/img/routes/from_point.png'
import addressToPoint from '../../../assets/img/routes/to_point.png'
import * as COLOR from '../../constants/colors'
import MakePhoneCall from '../../utils/makePhoneCall.js'
import Toast from '../../utils/toast.js'

class GoodsInfo extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){
		const configData = {
			from: '',
			to: '',
			entrustCode: '',//委托单号
			transportCode: '',//运单号
			goodsNameStr: '',
			goodsSKU: '',
			carLength: '',
			installDate: '',
			arrivalDate: '',
			temperature: '',
			remark: '',
			loadingListStrArr: []//装货点
		}
	}

	_loadingListComponent(loadingList){
		const loadingComponent = loadingList.map((item,index)=>{
			return <Text key={index} style={styles.goodsDetailContent}>{item}</Text>
		})
		return loadingComponent
	}

	render() {
		const {configData = {}, shipperPhone} = this.props
		return (
			<View style={styles.goodsContent}>
				<View style={styles.addressInfo}>
					<View style={[styles.addressInfoItem,{marginBottom: 5}]}>
						<View style={styles.itemIcon}>
							<Image source={addressFromPoint} style={{width: 20,height: 25}}/>
						</View>
						<View style={styles.itemContent}>
							<Text style={styles.addressText}>{configData.from}</Text>
							<Text style={styles.markText}>始发地</Text>
						</View>
					</View>
					<View style={styles.addressInfoItem}>
						<View style={styles.itemIcon}>
							<Image source={addressToPoint} style={{width: 20,height: 25}}/>
						</View>
						<View style={styles.itemContent}>
							<Text style={styles.addressText}>{configData.to}</Text>
							<Text style={styles.markText}>目的地</Text>
						</View>
					</View>
				</View>
				<View style={styles.goodsInfo}>
					{
						shipperPhone ?
							<View style={styles.goodsDetailItem}>
								<Text style={styles.goodsInfoIcon}>&#xe60f;</Text>
								<Text style={styles.goodsDetailMark}>发货人电话：</Text>
								<View style={{flex: 1}}>
									<TouchableOpacity onPress={()=>{
										MakePhoneCall.call(shipperPhone,()=>{
											Toast.show('当前设备不支持打电话')
										})
									}} activeOpacity={0.8}>
										<View style={styles.contactShipper}>
											<Text style={{fontFamily: 'iconfont',color:'white'}}>&#xe614;</Text>
											<Text style={{color: 'white'}}> 拨打电话</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>
						: null
					}
					{
						configData.loadingListStrArr && configData.loadingListStrArr.length > 0 ?
							<View style={styles.goodsDetailItem}>
								<Text style={[styles.goodsInfoIcon,{alignSelf:'flex-start'}]}>&#xe637;</Text>
								<Text style={[styles.goodsDetailMark,{alignSelf:'flex-start'}]}>装货地点：</Text>
								<View style={{flex: 1}}>
									{this._loadingListComponent(configData.loadingListStrArr)}
								</View>
							</View>
						: null
					}
					{
						configData.entrustCode ?
							<View style={styles.goodsDetailItem}>
								<Text style={styles.goodsInfoIcon}>&#xe62b;</Text>
								<Text style={styles.goodsDetailMark}>委托编号：</Text>
								<Text style={styles.goodsDetailContent}>{configData.entrustCode}</Text>
							</View>
						: null
					}
					{
						configData.transportCode ?
							<View style={styles.goodsDetailItem}>
								<Text style={[styles.goodsInfoIcon,{fontSize: 12}]}>&#xe61f;</Text>
								<Text style={styles.goodsDetailMark}>运单编号：</Text>
								<Text style={styles.goodsDetailContent}>{configData.transportCode}</Text>
							</View>
						: null
					}
					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsInfoIcon}>&#xe629;</Text>
						<Text style={styles.goodsDetailMark}>货物详情：</Text>
						<Text style={styles.goodsDetailContent}>{`有${configData.goodsNameStr}${configData.goodsSKU}，求${configData.carLength}冷藏车`}</Text>
					</View>
					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsInfoIcon}>&#xe627;</Text>
						<Text style={styles.goodsDetailMark}>{configData.goodsType == 1 ? '装货时间：' : '出发时间：'}</Text>
						<Text style={styles.goodsDetailContent}>{configData.goodsType == 1 ? configData.installDate : configData.carBanDate}</Text>
					</View>

					{
						configData.arrivalDate ?
							<View style={styles.goodsDetailItem}>
								<Text style={styles.goodsInfoIcon}>&#xe628;</Text>
								<Text style={styles.goodsDetailMark}>到货时间：</Text>
								<Text style={styles.goodsDetailContent}>{configData.arrivalDate}</Text>
							</View>
						: null
					}
					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsInfoIcon}>&#xe625;</Text>
						<Text style={styles.goodsDetailMark}>温度要求：</Text>
						<Text style={styles.goodsDetailContent}>{configData.temperatureStr}</Text>
					</View>
					<View style={styles.goodsDetailItem}>
						<Text style={[styles.goodsInfoIcon,{alignSelf:'flex-start'}]}>&#xe626;</Text>
						<Text style={[styles.goodsDetailMark,{alignSelf:'flex-start'}]}>备注：</Text>
						<Text style={[styles.goodsDetailContent,{marginLeft: 30}]}>{configData.remark}</Text>
					</View>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	goodsContent: {
		marginTop: 10,
		backgroundColor: 'white'
	},
	addressInfo: {
		// height: 77,
		margin: 10,
		marginTop: 20,
		marginBottom: 0,
	},
	addressInfoItem: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row'
	},
	itemIcon: {
		width: 25,
		height: 38,
		marginRight: 5,
	},
	itemContent: {
		// backgroundColor: 'orange',
		marginRight: 20
	},
	addressText: {
		color: COLOR.TEXT_BLACK,
		fontSize: 15,
		marginBottom: 3,
		fontWeight: 'bold'
	},
	markText: {
		color: COLOR.TEXT_LIGHT,
		fontSize: 12
	},
	goodsInfo: {
		margin: 10,
		marginTop: 20
	},
	goodsInfoIcon:{
		fontFamily: 'iconfont',
		fontSize: 16,
		color: COLOR.TEXT_LIGHT,
		marginRight: 5
	},
	goodsDetailItem: {
		flexDirection: 'row',
		marginTop: 2,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 2,
	},
	goodsDetailMark: {
		marginRight: 5,
		fontSize: 14,
		color: COLOR.TEXT_LIGHT
	},
	goodsDetailContent: {
		flex:1,
		color: COLOR.TEXT_BLACK,
		fontSize: 14
	},
	contactShipper:{
		flex: 1,
		flexDirection: 'row',
		backgroundColor: COLOR.APP_THEME,
		width: 140,
		height: 30,
		justifyContent:'center',
		alignItems:'center',
		marginTop:2,
		marginBottom:2,
		borderRadius:2,
	}

})

export default GoodsInfo