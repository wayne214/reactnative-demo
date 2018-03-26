'use strict'

import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text,
	TouchableOpacity
} from 'react-native';
import * as COLOR from '../../constants/colors'
import MakePhoneCall from '../../utils/makePhoneCall.js'
import Toast from '../../utils/toast.js';
import AddressItem from '../routes/goodlistAddressItem';
import MutilAddress from '../../components/routes/goodlistdetailMutilAddress';

class GoodsInfo extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){
		// const configData = {
		// 	from: '',
		// 	to: '',
		// 	entrustCode: '',//委托单号
		// 	transportCode: '',//运单号
		// 	goodsNameStr: '',
		// 	goodsSKU: '',
		// 	carLength: '',
		// 	installDate: '',
		// 	arrivalDate: '',
		// 	temperature: '',
		// 	remark: '',
		// 	loadingListStrArr: []//装货点
		// }
	}

	_loadingListComponent(loadingList){
		const loadingComponent = loadingList.map((item,index)=>{
			return <Text key={index} style={styles.goodsDetailContent}>{item}</Text>
		})
		return loadingComponent
	}

	render() {
		const {configData = {}, startAddress, endAddress} = this.props;
		console.log('--configData', configData);

		const qty = !configData.qty || configData.qty === '0';

		const goodsType = configData.goodsType ? configData.goodsType : '';
		const goodsCategory = configData.goodsCategory ? configData.goodsCategory : '';
		const weight = configData.weight ? configData.weight : '';
		const uom = configData.uom ? configData.uom : '';
		const goodDetail = goodsType + goodsCategory + weight + uom;
		return (
			<View style={styles.goodsContent}>

				{/*<View style={{paddingHorizontal: 15}}>*/}
				{/*<AddressItem startAddress={startAddress} endAddress={endAddress}/>*/}
				{/*</View>*/}
				<View style={styles.goodsInfo}>
					{/*<MutilAddress lineStyle={{marginLeft: 0}} subcontainer= {{paddingLeft: 0, paddingRight: 10, paddingTop: 20, paddingBottom: 5}} address={['河南省郑州市高新区80号绿新区普惠路78号绿地','郑州市','河南省郑州市惠济区8号','高新区29号2层']}/>*/}

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>货物详情：{ (goodDetail && goodDetail !== '') ? goodDetail : '货品' }</Text>
						<Text style={styles.goodsDetailContent}>{''}</Text>
					</View>

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>货物名称：</Text>
						<Text style={styles.goodsDetailContent}>{configData.itemName}</Text>
					</View>

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>货物规格：</Text>
						<Text style={styles.goodsDetailContent}>{configData.standard}</Text>
					</View>

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>货物单位：</Text>
						<Text style={styles.goodsDetailContent}>{configData.uom}</Text>
					</View>

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>应收：</Text>
						<Text style={styles.goodsDetailContent}>{qty ? configData.shipmentWeight : configData.shipmentNums}</Text>
					</View>

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>发运：</Text>
						<Text style={styles.goodsDetailContent}>{qty ? configData.shipmentWeight : configData.shipmentNums}</Text>
					</View>

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>签收：</Text>
						<Text style={styles.goodsDetailContent}>{qty ? configData.signWeight : configData.signNum}</Text>
					</View>

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>拒签：</Text>
						<Text style={styles.goodsDetailContent}>{qty ? configData.denySignWeight : configData.denySignNum}</Text>
					</View>

					<View style={styles.goodsDetailItem}>
						<Text style={styles.goodsDetailMark}>拒签原因：</Text>
						<Text style={styles.goodsDetailContent}>{configData.refuseSignReason}</Text>
					</View>

					{/*<View style={styles.goodsDetailItem}>*/}
						{/*<Text style={styles.goodsDetailMark}>{configData.goodsType == 1 ? '装货时间：' : '出发时间：'}</Text>*/}
						{/*<Text style={styles.goodsDetailContent}>{configData.goodsType == 1 ? configData.installDate : configData.carBanDate}</Text>*/}
					{/*</View>*/}

					{
						// configData.arrivalDate ?
						// 	<View style={styles.goodsDetailItem}>
						// 		<Text style={styles.goodsDetailMark}>送达时间：</Text>
						// 		<Text style={styles.goodsDetailContent}>{configData.arrivalDate}</Text>
						// 	</View>
						// : null
					}
					{/*<View style={styles.goodsDetailItem}>*/}
						{/*<Text style={styles.goodsDetailMark}>温度要求：</Text>*/}
						{/*<Text style={styles.goodsDetailContent}>{configData.temperatureStr}</Text>*/}
					{/*</View>*/}
					{/*<View style={styles.goodsDetailItem}>*/}
						{/*<Text style={[styles.goodsInfoIcon,{alignSelf:'flex-start'}]}>&#xe626;</Text>*/}
						{/*<Text style={[styles.goodsDetailMark,{alignSelf:'flex-start'}]}>备注：</Text>*/}
						{/*<Text style={[styles.goodsDetailContent,{marginLeft: 30}]}>{configData.remark}</Text>*/}
					{/*</View>*/}
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	goodsContent: {
		backgroundColor: 'white',
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
		margin: 15,
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