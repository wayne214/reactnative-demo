import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableOpacity
} from 'react-native';
import styles from '../../../assets/css/car';
import NavigatorBar from '../../components/common/navigatorbar';
import Button from '../../components/common/button';
import * as RouteType from '../../constants/routeType';
import AddressHandler from '../../utils/address';
import Picker from 'react-native-picker';
import { ADD_ROUTER } from '../../constants/api';
import { fetchData } from '../../action/app';
import Toast from 'react-native-root-toast';
import { dispatchRefreshAddRoute } from '../../action/route';
import BaseComponent from '../../components/common/baseComponent';

class AddRouteContainer extends BaseComponent {
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
			dataSource: AddressHandler.getCityOfCountry()
		};
		this._addRoute = this._addRoute.bind(this);
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
			  if (type === 'to') this.setState({ toAddress: data.join('').replace(new RegExp('不限', 'gm'), ''), toProvince: data[0], toCity: data[1], toArea: data[2] });
			  if (type === 'from') this.setState({ fromAddress: data.join('').replace(new RegExp('不限', 'gm'), ''), fromProvince: data[0], fromCity: data[1], fromArea: data[2] });
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

	_addRoute () {
		if (!this.state.fromAddress) return Toast.show('请选择始发地');
		if(!this.state.toAddress) return Toast.show('请选择目的地');

		const fpid = AddressHandler.getPIDWithPName(this.state.fromProvince);
		const fcid = AddressHandler.getCIDWithCName(this.state.fromCity);
		const faid = AddressHandler.getAIDWithAName(this.state.fromCity,this.state.fromArea);
		const tpid = AddressHandler.getPIDWithPName(this.state.toProvince);
		const tcid = AddressHandler.getCIDWithCName(this.state.toCity);
		const taid = AddressHandler.getAIDWithAName(this.state.toCity,this.state.toArea);
		this.props.addRoute({
			carrierId: this.props.user.userId,
			fromProvinceCode: fpid,
			fromCityCode: fcid,
			fromAreaCode: faid,
			toProvinceCode: tpid,
			toCityCode: tcid,
			toAreaCode: taid,
			fromProvinceName: this.state.fromProvince,
			fromCityName: this.state.fromCity === '不限'? '' : this.state.fromCity,
			fromAreaName: this.state.fromArea === '不限'? '' : this.state.fromArea,
			toProvinceName: this.state.toProvince,
			toCityName: this.state.toCity === '不限'? '' : this.state.toCity,
			toAreaName: this.state.toArea === '不限'? '' : this.state.toArea,
		}, this.props.navigation, );
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		Picker.hide();
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};

	render () {
		return (
			<View style={ styles.container }>
				<View style={ [styles.hiddenCellContainer, { backgroundColor: 'white' }] }>
					<View style={ styles.hiddenLeft }>
						<Text style={ styles.hiddenText }>始发地</Text>
					</View>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ [styles.hiddenRight, { flex: 3 }] }
						onPress={ this._selectAddress.bind(this, 'from') }>
						<Text style={ this.state.fromAddress ? styles.routeText : styles.rightText }>{ this.state.fromAddress || '请选择' }</Text>
					</TouchableOpacity>
				</View>
				<View style={ [styles.hiddenCellContainer, { backgroundColor: 'white' }] }>
					<View style={ styles.hiddenLeft }>
						<Text style={ styles.hiddenText }>目的地</Text>
					</View>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ [styles.hiddenRight, { flex: 3 }] }
						onPress={ this._selectAddress.bind(this, 'to')}>
						<Text style={ this.state.toAddress ? styles.routeText : styles.rightText }>{ this.state.toAddress || '请选择' }</Text>
					</TouchableOpacity>
				</View>

				<View style={ styles.loginBtn }>
					<Button
						title='确认添加'
						style={ styles.btn }
						textStyle={ styles.btnText }
						onPress={ this._addRoute }/>
				</View>
			{ this.props.loading ? this._renderLoadingView() : null }
			</View>
		);
	}
}
const mapStateToProps = (state) => {
	const { app } = state;
	return{
		user: app.get('user'),
		loading: app.get('loading')
	};
}

function mapDispatchToProps(dispatch) {
	return {
		addRoute: (body, navigation) => {
			dispatch(fetchData({
				body,
				api: ADD_ROUTER,
				method: 'POST',
				successToast: true,
				msg: '添加成功',
				showLoading: true,
				success: () => {
					navigation.dispatch({ type: 'pop' });
					dispatch(dispatchRefreshAddRoute());
				},
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRouteContainer);