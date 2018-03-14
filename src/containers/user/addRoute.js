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
import { ADD_ROUTER } from '../../constants/api';
import { fetchData, appendLogToFile } from '../../action/app';
import Toast from '../../utils/toast';
import { dispatchRefreshAddRoute, getCarLength, checkedOneOfDatas,dispatchClearRouteInfo } from '../../action/route';
import BaseComponent from '../../components/common/baseComponent';
let startTime = 0
import AddressJson from '../../../assets/json/address.json';

class AddRouteContainer extends BaseComponent {
	constructor(props) {
		super(props);
    this.title = props.navigation.state.params.title;
    AddressHandler.set(AddressJson);
		this.state = {
			toProvince: '',
			toCity: '',
			toArea: '',
			fromProvince: '',
			fromCity: '',
			fromArea: '',
			toAddress: '',
			fromAddress: '',
			carLength:'',
			dataSource: AddressHandler.getCityOfCountry()
		};
		this._addRoute = this._addRoute.bind(this);
		this._checkedInDatas = this._checkedInDatas.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();
		this.props.dispatch(getCarLength());
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.props.dispatch(dispatchClearRouteInfo());
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
		if (!this.state.toAddress) return Toast.show('请选择目的地');
		if (this.props.carLengthIds && this.props.carLengthIds.length === 0  ) {
  		return Toast.show('请选择车辆长度');
  	}

		const fpid = AddressHandler.getPIDWithPName(this.state.fromProvince);
		const fcid = AddressHandler.getCIDWithCName(this.state.fromCity);
		const faid = AddressHandler.getAIDWithAName(this.state.fromCity,this.state.fromArea);
		const tpid = AddressHandler.getPIDWithPName(this.state.toProvince);
		const tcid = AddressHandler.getCIDWithCName(this.state.toCity);
		const taid = AddressHandler.getAIDWithAName(this.state.toCity,this.state.toArea);
		this.props.addRoute({
      carLength: this.props.carLengthIds.join(','),
		// 	carrierId: this.props.user.userId,
			carrierId: '7809a999d12642a6b38415d401335813', // 承运商id
			fromAreaCode: faid,
      fromAreaName: this.state.fromArea === '不限'? '' : this.state.fromArea,
			fromCityCode: fcid,
			fromCityName: this.state.fromCity === '不限'? '' : this.state.fromCity,
			fromProvinceCode: fpid,
			fromProvinceName: this.state.fromProvince,
			toAreaCode: taid,
      toAreaName: this.state.toArea === '不限'? '' : this.state.toArea,
			toCityCode: tcid,
			toCityName: this.state.toCity === '不限'? '' : this.state.toCity,
			toProvinceCode: tpid,
			toProvinceName: this.state.toProvince,
		}, this.props.navigation );
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
		const {carLengths}= this.props;
		let perCarLength;
		const carLengthArr = carLengths.map( (item,index) =>{
			return (
				<TouchableOpacity
					key={index}
					style={ [item.isChecked ? styles.selectedBackView : styles.backView,{marginTop:10}] }
					onPress={ ()=>{
						this._checkedInDatas(index)
						}}>
					<Text style={ item.isChecked ? styles.selectedMText: styles.mText }>{ item.value }</Text>
				</TouchableOpacity>
  		)
		})
		return (
			<View style={ styles.container }>
				<View style={ styles.hiddenCellContainer }>
					<View style={ styles.hiddenLeft }>
						<Text style={ styles.hiddenText }>始发地</Text>
					</View>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ [styles.hiddenRight, { flex: 3 }] }
						onPress={ this._selectAddress.bind(this, 'from') }>
						<Text style={ this.state.fromAddress ? styles.routeText : styles.rightText }>{ this.state.fromAddress || '请选择' }</Text>
						<Text style={{fontFamily: 'iconfont', fontSize: 14, color: '#c7c7c7', marginRight: 10}}>&#xe63d;</Text>
					</TouchableOpacity>
				</View>
				<View style={ styles.hiddenCellContainer }>
					<View style={ styles.hiddenLeft }>
						<Text style={ styles.hiddenText }>目的地</Text>
					</View>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ [styles.hiddenRight, { flex: 3 }] }
						onPress={ this._selectAddress.bind(this, 'to')}>
						<Text style={ this.state.toAddress ? styles.routeText : styles.rightText }>{ this.state.toAddress || '请选择' }</Text>
						<Text style={{fontFamily: 'iconfont', fontSize: 14, color: '#c7c7c7', marginRight: 10}}>&#xe63d;</Text>
					</TouchableOpacity>
				</View>

				<View style={{height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
					<Text style={ styles.hiddenText }>车辆长度</Text>
					<View style={{flexDirection: 'row'}}>
						<Text style={ {color: '#0092FF', fontSize: 14} }>多选</Text>
					<Text style={ {color: '#3f3f3f', fontSize: 14, marginRight: 10} }>,在该常用线路下经常行驶的车型</Text>
					</View>
				</View>

					<View style={[styles.perRight,{flexWrap: 'wrap'}]}>
						{carLengthArr}
					</View>

				<View style={ styles.loginBtn }>
					<Button
						title='确认新增'
						style={ styles.btn }
						textStyle={ styles.btnText }
						onPress={ this._addRoute }/>
				</View>
			{ this.props.loading ? this._renderLoadingView() : null }

			{ this._renderUpgrade(this.props) }
			</View>
		);
	}
}
const mapStateToProps = (state) => {
	const { app, routes } = state;
	return{
		user: app.get('user'),
		loading: app.get('loading'),
		carLengths: routes.getIn(['carLength', 'carLengths']).toJS(),
		carLengthIds : routes.getIn(['carLength', 'carLengthIds']).toJS(),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		addRoute: (body, navigation) => {
			startTime = new Date().getTime()
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
					dispatch(appendLogToFile('新增路线','添加路线',startTime))
				},
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRouteContainer);