import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableOpacity
} from 'react-native';
import styles from '../../../assets/css/route';
import NavigatorBar from '../../components/common/navigatorbar';
import Button from '../../components/common/button';
import * as RouteType from '../../constants/routeType';
import AddressHandler from '../../utils/address';
import Picker from 'react-native-picker';
import { EDIT_ROUTE } from '../../constants/api';
import { fetchData } from '../../action/app';
import Toast from '../../utils/toast';
import { dispatchRefreshAddRoute, selectedCarLength, checkedOneOfDatas } from '../../action/route';
import BaseComponent from '../../components/common/baseComponent';

class EditRouterContainer extends BaseComponent {

	constructor(props) {
		super(props);

    this.title = props.navigation.state.params.title;
		this.state = {
			toProvince: '',
			toCity: '',
			toArea: '',
			fromProvince: '',
			fromCity: '',
			fromArea: '',
			toAddress: '',
			fromAddress: '',
			carLength: '',
			carLengthIds:'',
			dataSource: AddressHandler.getCityOfCountry()
		};
		this.data = props.navigation.state.params.data;
		this._editRoute = this._editRoute.bind(this);
		this._checkedInDatas = this._checkedInDatas.bind(this);
	}
	componentDidMount() {
		super.componentDidMount();
		this.props.dispatch(selectedCarLength(this.data.carLength));
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		Picker.hide();
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
			  if (type === 'to') this.setState({ toAddress: data.join('').replace(new RegExp('不限', 'gm'), ''), toProvince: data[0], toCity: data[1].replace(new RegExp('不限', 'gm'), ''), toArea: data[2].replace(new RegExp('不限', 'gm'), '') });
			  if (type === 'from') this.setState({ fromAddress: data.join('').replace(new RegExp('不限', 'gm'), ''), fromProvince: data[0], fromCity: data[1].replace(new RegExp('不限', 'gm'), ''), fromArea: data[2].replace(new RegExp('不限', 'gm'), '') });
			},
			onPickerCancel: data => {
			},
			onPickerSelect: data => {
			}
		});
		Picker.show();
	}

	_editRoute () {
		const fpid = AddressHandler.getPIDWithPName(this.state.fromProvince);
		const fcid = AddressHandler.getCIDWithCName(this.state.fromCity);
		const faid = AddressHandler.getAIDWithAName(this.state.fromCity,this.state.fromArea);
		const tpid = AddressHandler.getPIDWithPName(this.state.toProvince);
		const tcid = AddressHandler.getCIDWithCName(this.state.toCity);
		const taid = AddressHandler.getAIDWithAName(this.state.toCity,this.state.toArea);
		if (this.props.carLengthIds && this.props.carLengthIds.length === 0) {
  		return Toast.show('请选择车辆长度');
  	}

		this.props.editRoute({
			carrierId: this.props.user.userId,
			id: this.data.id,
			fromProvinceCode: (fpid ? fpid : '') || this.filterData(this.data.fromProvinceCode),
			fromCityCode: (fcid ? fcid : '') || this.filterData(this.data.fromCityCode) ,
			fromAreaCode: (faid ? faid :'') || this.filterData(this.data.fromAreaCode),
			toProvinceCode: (tpid ? tpid : '') || this.filterData(this.data.toProvinceCode) ,
			toCityCode: (tcid ? tcid : '') || this.filterData(this.data.toCityCode),
			toAreaCode: (taid ? taid : '') || this.filterData(this.data.toAreaCode),
			fromProvinceName: this.filterData(this.state.fromProvince)  || this.filterData(this.data.fromProvinceName),
			fromCityName: this.state.fromProvince ? this.filterData(this.state.fromCity) : this.filterData(this.data.fromCityName),
			fromAreaName: this.state.fromProvince ? this.filterData(this.state.fromArea) : this.filterData(this.data.fromAreaName),
			toProvinceName: this.filterData(this.state.toProvince)  || this.filterData(this.data.toProvinceName),
			toCityName: this.state.toProvince ? this.filterData(this.state.toCity) : this.filterData(this.data.toCityName),
			toAreaName: this.state.toProvince ? this.filterData(this.state.toArea) : this.filterData(this.data.toAreaName),
			carLength: this.props.carLengthIds.join(',') || this.data.carLength,
		}, this.props.navigation, this.hiddingBack);

	}

  filterData(params){
  	return params ? params : '';
  }

	_checkedInDatas(index) {
  	this.props.dispatch(checkedOneOfDatas(index));
  }
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};
	render () {
		let fromText;
		let toText;
		let carLength;
		const {carLengths,carLengthIds}= this.props;
		console.log('carLengthIds---',carLengthIds);
		const carLengthArr = carLengths.map( (item,index) =>{
			return (
				<TouchableOpacity 
					key={index} 
					style={ [item.isChecked ? styles.selectedBackView : styles.backView,{marginTop:10}] }
					onPress={ ()=>{ this._checkedInDatas(index) }}>
					<Text style={ item.isChecked ? styles.selectedMText: styles.mText }>{ item.value }</Text>
				</TouchableOpacity>
  		)
		})
		fromText = (
			<View>
				<Text style={ styles.routeText }>
					{ this.state.fromAddress ||
						  (this.data.fromProvinceName  +
							 (this.data.fromCityName ? this.data.fromCityName : '') +
							 (this.data.fromAreaName ? this.data.fromAreaName : ''))}
				</Text>
			</View>)
		toText = (
			<View>
				<Text style={ styles.routeText }>
					{ this.state.toAddress ||
					  (this.data.toProvinceName  +
						(this.data.toCityName ? this.data.toCityName : '') +
						(this.data.toAreaName ? this.data.toAreaName : ''))}
				</Text>
			</View>)
		return (
			<View style = { styles.container }>
				<View style={ [styles.hiddenCellContainer, { backgroundColor: 'white' }] }>
					<View style={ styles.hiddenLeft }>
						<Text style={ styles.hiddenText }>始发地</Text>
					</View>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ [styles.hiddenRight, { flex: 3 }] }
						onPress={ this._selectAddress.bind(this, 'from') }>
						{ fromText }
					</TouchableOpacity>
				</View>
				<View style={ [styles.hiddenCellContainer, { backgroundColor: 'white' }] }>
					<View style={ styles.hiddenLeft }>
						<Text style={ styles.hiddenText }>目的地</Text>
					</View>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ [styles.hiddenRight, { flex: 3 }] }
						onPress={ this._selectAddress.bind(this, 'to') }>
						{ toText }
					</TouchableOpacity>
				</View>
				<View style={ [styles.carLengthContainer,{paddingBottom:10}] }>
					<View style={{flex:1, marginTop:10}}>
						<Text style={ styles.hiddenText }>车辆长度</Text>
					</View>
					<View style={[styles.perRight,{flex:3,flexWrap: 'wrap'}]}>
						{carLengthArr}
					</View>
				</View>

				<View style={ styles.loginBtn }>
					<Button
						title='确认修改'
						style={ styles.btn }
						textStyle={ styles.btnText }
						onPress={ this._editRoute }/>
					{
						this.hiddingBack &&
							<View style={ styles.skipContainer }>
								<Text onPress={ () => this.props.router._toMain() } style={ styles.skipText }>跳过认证，先看看>></Text>
							</View>
					}
				</View>

			</View>
		);
	}
}

const mapStateToProps = (state) => {
	const { app, routes } = state;
	return{
		user: app.get('user'),
		carLengths: routes.getIn(['carLength', 'carLengths']).toJS(),
		carLengthIds : routes.getIn(['carLength', 'carLengthIds']).toJS(),
	};
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		editRoute: (body, navigation, hiddingBack) => {
			dispatch(fetchData({
				body,
				api: EDIT_ROUTE,
				method: 'POST',
				successToast: true,
				msg: '修改成功',
				showLoading: true,
				success: () => {
					// 修改成功
					navigation.dispatch({type: 'pop'});
					dispatch(dispatchRefreshAddRoute());
				},
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(EditRouterContainer);
