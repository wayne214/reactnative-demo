'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import Picker from 'react-native-picker-custom';
import AddressHandler from '../../utils/address2';
import {appendLogToFile } from '../../action/app.js'


class SearchGoods extends Component {
	constructor(props) {
	  super(props);
	 	this.state = {
		 	addressFrom: '',
		 	addressTo: '',
		 	dataSource: AddressHandler.getCityOfCountry(true),
		 	fromProvince: '',
		 	fromCity: '',
		 	fromArea: '',
		 	toProvince: '',
		 	toCity: '',
		 	toArea: ''
	 	}
	}
	componentDidMount() {

	}
	static navigationOptions = ({navigation}) => {
		return {
			header: <NavigatorBar router={navigation} picker={Picker}/>
		}
	}
	_selectAddress(type) {
		Picker.init({
			pickerData: this.state.dataSource,
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerBg: [230, 234, 242, 1],
			pickerToolBarBg: [255, 255, 255, 1],
			pickerTitleText: type === 'from' ? '起始地' : '目的地',
			onPickerConfirm: data => {
			  console.log('选择地址 --', data);
			  if (type === 'from') {
			  	this.setState({
			  		addressFrom: data.join('').replace(new RegExp('不限', 'gm'), ''),
			  		fromProvince: data[0],
			  		fromCity: data[1],
			  		fromArea: data[2],
			  	});
			  }
			  if (type === 'to') {
			  	this.setState({
			  		addressTo: data.join('').replace(new RegExp('不限', 'gm'), ''),
			  		toProvince: data[0],
			  		toCity: data[1],
			  		toArea: data[2]
			  	});
			  }

			},
			onPickerCancel: data => {
			  // console.log(data);
			},
			onPickerSelect: data => {
			  // console.log(data);
			}
		});
		Picker.show();
	}
	_handleAddressAndBack(){
		const fromProvinceCode = AddressHandler.getPIDWithPName(this.state.fromProvince) || '';
		const fromCityCode = AddressHandler.getCIDWithCName(this.state.fromCity) || '';
		const fromAreaCode = AddressHandler.getAIDWithAName(this.state.fromCity,this.state.fromArea) || '';
		const toProvinceCode = AddressHandler.getPIDWithPName(this.state.toProvince) || '';
		const toCityCode = AddressHandler.getCIDWithCName(this.state.toCity) || '';
		const toAreaCode = AddressHandler.getAIDWithAName(this.state.toCity,this.state.toArea) || '';
		const {params} = this.props.navigation.state;
		const {addressFrom,addressTo} = this.state
		if (params.searchEditCallBack) {
			this.props.dispatch(appendLogToFile('搜索货源','发起搜索',0))
			this.props.navigation.dispatch({ type: 'pop' })
			if (addressFrom || addressTo) {
				params.searchEditCallBack({fromProvinceCode,fromCityCode,fromAreaCode,toProvinceCode,toCityCode,toAreaCode,addressFrom,addressTo})
			}else{
				params.searchEditCallBack(null)
			}

		};
	}
	componentWillUnmount() {
		if (Picker) {
			Picker.hide()
		};
	}
	render() {
		const {addressTo,addressFrom} = this.state
		return <View style={styles.container}>

			<View style={styles.tipView}>
				<Text style={styles.tips}>搜索起始地目的地</Text>
			</View>
			<TouchableOpacity activeOpacity={0.8} onPress={()=>{
				this._selectAddress('from');
			}}>
				<View style={styles.searchItem}>
					<Text style={[styles.addressContentText,{color: addressFrom ? COLOR.TEXT_BLACK : COLOR.TEXT_NORMAL}]}>
						{ addressFrom ? addressFrom : '起始地'}
					</Text>
					<Text style={styles.arrow}>&#xe60d;</Text>
				</View>
			</TouchableOpacity>
			<View style={styles.seperationLine}></View>
			<TouchableOpacity activeOpacity={0.8} onPress={()=>{
				this._selectAddress('to');
			}}>
				<View style={styles.searchItem}>
					<Text style={[styles.addressContentText,{color: addressTo ? COLOR.TEXT_BLACK : COLOR.TEXT_NORMAL}]}>
						{ addressTo ? addressTo : '目的地'}
					</Text>
					<Text style={styles.arrow}>&#xe60d;</Text>
				</View>
			</TouchableOpacity>
			<View style={{height: 31,margin: 20,marginTop: 30}}>
				<Button
					activeOpacity={0.8}
					style={{backgroundColor: COLOR.APP_THEME,borderWidth: 0,borderRadius: 2}}
					textStyle={{fontSize: 14,color: 'white'}}
					isDisabled={false}
					disabledStyle={{backgroundColor: COLOR.BUTTN_DISABLE}}
					onPress={()=>{
						Picker.hide();
						this._handleAddressAndBack()
					}}>
					搜索
				</Button>
			</View>
		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	tipView: {
		paddingLeft: 10,
		paddingTop: 20,
		paddingBottom: 20
	},
	tips: {
		fontSize: 18,
		color: COLOR.TEXT_BLACK,

	},
	searchItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: 'white',
		height: 50
	},
	seperationLine: {
		height: 1,
		backgroundColor: COLOR.LINE_COLOR
	},
	arrow: {
		fontFamily: 'iconfont',
		color: COLOR.TEXT_NORMAL
	}
})

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchGoods);

