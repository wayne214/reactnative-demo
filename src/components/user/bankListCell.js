import React from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	TouchableOpacity
} from 'react-native';
const { width, height } = Dimensions.get('window');

import bg_js from '../../../assets/img/bg_js.png';
import bg_ny from '../../../assets/img/bg_ny.png';
import bg_gs from '../../../assets/img/bg_gs.png';
import bg_def from '../../../assets/img/bg_bank_def.png';

import icon_bank_default from '../../../assets/img/icon_bank_default.png';
import icon_gf from '../../../assets/img/icon_gf.png';
import icon_gs from '../../../assets/img/icon_gs.png';
import icon_hx from '../../../assets/img/icon_hx.png';
import icon_hzs from '../../../assets/img/icon_hzs.png';
import icon_jh from '../../../assets/img/icon_jh.png';
import icon_js from '../../../assets/img/icon_js.png';
import icon_ms from '../../../assets/img/icon_ms.png';
import icon_nh from '../../../assets/img/icon_nh.png';
import icon_pf from '../../../assets/img/icon_pf.png';
import icon_yz from '../../../assets/img/icon_yz.png';
import icon_zs from '../../../assets/img/icon_zs.png';
import icon_zg from '../../../assets/img/icon_zg.png';
import icon_zx from '../../../assets/img/icon_zx.png';
import icon_xy from '../../../assets/img/icon_xy.png';

export default class BankListCell extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	  this._onPress = this._onPress.bind(this);
	}

	_onPress() {
		this.props.selectClick();
	}

	render() {
		const { rowData, index } = this.props;

		let bankIcon;
		let bankBg;
		if (rowData.bankName.includes('工商银行')) {
			bankIcon = icon_gs;
			bankBg = bg_gs;
		} else if (rowData.bankName.includes('广发银行')) {
			bankIcon = icon_gf;
			bankBg = bg_def;			
		} else if (rowData.bankName.includes('华夏银行')) {
			bankIcon = icon_hx;
			bankBg = bg_def;	
		} else if (rowData.bankName.includes('建设银行')) {
			bankIcon = icon_js;
			bankBg = bg_js;			
		} else if (rowData.bankName.includes('交通银行')) {
			bankIcon = icon_jh;
			bankBg = bg_def;	
		} else if (rowData.bankName.includes('民生银行')) {
			bankIcon = icon_ms;
			bankBg = bg_def;	
		} else if (rowData.bankName.includes('农村合作社')) {
			bankIcon = icon_hzs;
			bankBg = bg_def;	
		} else if (rowData.bankName.includes('农业银行')) {
			bankIcon = icon_nh;
			bankBg = bg_ny;
		} else if (rowData.bankName.includes('浦东发展银行')) {
			bankIcon = icon_pf;
			bankBg = bg_def;	
		} else if (rowData.bankName.includes('兴业银行')) {
			bankIcon = icon_xy;
			bankBg = bg_def;	
		} else if (rowData.bankName.includes('招商银行')) {
			bankIcon = icon_zs;
			bankBg = bg_def;	
		} else if (rowData.bankName.includes('中国银行')) {
			bankIcon = icon_zg;
			bankBg = bg_def;	
		} else if (rowData.bankName.includes('中信银行')) {
			bankIcon = icon_zx;
			bankBg = bg_def;	
		} else {
			bankBg = bg_def;
			bankIcon = icon_bank_default;
		}
		return (
			<View key={ index } style={{ alignItems: 'center' }}>
				<TouchableOpacity
					activeOpacity={ 1 }>
					<Image style={ styles.cellContainer } source={ bankBg }>
						<Image style={ styles.icon } source={ bankIcon }/>
						<View style={ styles.rightView }>
							<View style={ styles.optView }>
								<Text style={ styles.bankNameText }>{ rowData.bankName }</Text>
							</View>
							<Text style={ [styles.bankNameText,{marginTop:5}] }>储蓄卡</Text>
							<Text style={ [styles.cardNumber,{marginTop:0}] }>{ '**** **** **** ' + rowData.accountNumber.substr(-4) }</Text>
						</View>
						<View style={ styles.rightCornerView }>
							<View style={{ flexDirection:'row'}}>
								<Text style={ styles.iconFont } onPress={ this.props.editFun }>&#xe617;</Text>
							</View>
							<View style={{ flexDirection:'row',marginTop:10}}>
								<Text style={ styles.iconFont } onPress={ this.props.delFun }>&#xe61c;</Text>
							</View>
						</View>
					</Image>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	cellContainer: {
		// width: 345,
		width: width - 30,
		height: 110,
		marginTop: 15,
		flexDirection: 'row',
	},
	icon: {
		width: 45,
		height: 45,
		marginTop: 15,
		marginLeft: 15
	},
	rightView: {
		flex: 3,
		marginLeft: 15,
	},
	rightCornerView: {
		flex: 1,
		marginLeft: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	optView: {
		marginTop: 25,
		flexDirection: 'row'
	},
	bankNameText: {
		fontSize: 15,
		color: 'white',
		backgroundColor: 'rgba(0, 0, 0, 0)'		
	},
	cardNumber: {
		fontSize: 18,
		color: 'white',
		marginTop: 30,
		backgroundColor: 'rgba(0, 0, 0, 0)'
	},
	iconFont: {
		fontSize: 14,		
		color: 'white',
		fontFamily: 'iconfont',
		backgroundColor: 'rgba(0, 0, 0, 0)'
	},

	fontText: {
		fontSize: 12,
		color: 'white',
		backgroundColor: 'rgba(0, 0, 0, 0)'		
	},
});