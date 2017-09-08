import React, { Component, PropTypes } from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text
} from 'react-native';
import * as COLOR from '../../constants/colors'
import CompeteOver from '../../../assets/img/app/header_icon.png'

class SupplyAndNeed extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){

	}

	render() {
		let realPrice = ''
		const {orderType,entrustOrderStatus,orderState} = this.props
		if (orderType == 'ENTRUST' && entrustOrderStatus == 2 && orderState == 1){
			realPrice = this.props.carrierDealPrice.toString()
		}else{
			if (orderState == 12) {
				realPrice = this.props.carrierPaymentPrice.toString()
			}else{
				realPrice = this.props.freight.toString()
			}
		}
		return (
			<View style={styles.container}>
				<Image source={CompeteOver} style={styles.headerImage}/>
				<View style={styles.supplyAndNeedInfoView}>
					<View style={styles.supplyView}>
						<View style={styles.supplyContent}>
							<Text style={{fontSize: 10,color:'white'}}>有</Text>
						</View>
						<View style={{height: 15,borderRadius: 1,borderWidth: 1,borderColor: COLOR.TEXT_LIGHT,paddingLeft: 3,paddingRight: 3,justifyContent: 'center'}}>
							<Text style={styles.supplyText}>{`${this.props.goodsNameStr} ${this.props.goodsSKU}`}</Text>
						</View>
					</View>
					<View style={styles.needView}>
						<View style={[styles.supplyContent,{backgroundColor: COLOR.APP_THEME}]}>
							<Text style={{fontSize: 10,color:'white'}}>求</Text>
						</View>
						{
							this.props.carLength && this.props.carLength.length > 0 ?
								<View style={[styles.needContent]}>
									<Text style={styles.needText}>{this.props.carLength}</Text>
								</View>
							: null
						}
						<View style={[styles.needContent,{marginLeft: 3}]}>
							<Text style={styles.needText}>冷藏车</Text>
						</View>
					</View>
				</View>
				<View style={styles.priceView}>
					<View style={styles.priceSeperation}></View>
					{
						realPrice && realPrice.indexOf('.') == -1 ?
							<View style={{flexDirection: 'row',alignItems: 'flex-end'}}>
								<Text style={[styles.priceText]}>{realPrice}</Text>
								<Text style={[styles.priceText,{fontSize: 12,marginBottom: 3}]}>{'.00'}</Text>
							</View>
						: <View style={{flexDirection: 'row',alignItems: 'flex-end'}}>
								<Text style={[styles.priceText]}>{realPrice.split('.')[0]}</Text>
								<Text style={[styles.priceText,{fontSize: 12,marginBottom: 3}]}>.{realPrice.split('.')[1]}</Text>
							</View>
					}


					<View style={{marginRight: 10}}>
						<Text style={{color: COLOR.TEXT_BLACK,fontSize: 12,marginBottom: 3}}>元</Text>
					</View>
				</View>
			</View>
		)
	}
}
// ,alignSelf: 'flex-end'
const styles = StyleSheet.create({
	container:{
		flex: 1,
		flexDirection: 'row',
		height: 60,
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR,
		borderTopColor: COLOR.LINE_COLOR,
		alignItems: 'center'
	},
	headerImage: {
		width: 40,
		height: 40,
		marginLeft: 10,
		marginRight: 8
	},
	supplyAndNeedInfoView: {
		height: 34,
		justifyContent: 'space-between'
	},
	supplyView: {
		flexDirection: 'row',

	},
	needView: {
		flexDirection: 'row',
	},
	supplyContent: {
		width: 15,
		height: 15,
		backgroundColor: COLOR.TEXT_LIGHT,
		marginRight: 3,
		justifyContent:'center',
		alignItems: 'center',
		borderRadius: 2,
	},
	supplyText: {
		fontSize: 10,
		color: COLOR.TEXT_NORMAL
	},
	needContent: {
		height: 15,
		borderRadius: 1,
		borderWidth: 1,
		paddingLeft: 3,
		paddingRight: 3,
		borderColor: COLOR.APP_THEME,
		justifyContent: 'center',
		alignItems: 'center'
	},
	needText: {
		fontSize: 10,
		color: COLOR.APP_THEME
	},
	priceView: {
		// flex:1,
		right: 0,
		width: 125,
		height: 40,
		// backgroundColor: 'orange',
		flexDirection: 'row',
		position: 'absolute',
		justifyContent: 'flex-end',
		alignItems: 'flex-end'
		// alignSelf: 'flex-start'
	},
	priceSeperation: {
		width: 1,
		height: 37,
		backgroundColor: COLOR.LINE_COLOR,
		position: 'absolute',
		right: 124
	},
	priceText: {
		color: COLOR.TEXT_MONEY,
		fontSize: 24,
		fontWeight: 'bold'
	},
})

export default SupplyAndNeed