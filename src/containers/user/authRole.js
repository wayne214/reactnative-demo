import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableOpacity,	
} from 'react-native';
import styles from '../../../assets/css/setting';
import NavigatorBar from '../../components/common/navigatorbar';
import RegIcon from '../../../assets/img/user/reg_icon.png';
import { BASE_URL } from '../../constants/setting';
import { ABOUT_US } from '../../constants/api'; 
import MainContainer from '../app/main';
import * as RouteType from '../../constants/routeType';
import BaseComponent from '../../components/common/baseComponent';

class AuthRoleContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this._back = this._back.bind(this);
		this.type = props.navigation.state.params.type;		
    this.title = props.navigation.state.params.title;
		this._pushCompanyAuth = this._pushCompanyAuth.bind(this);
	}
	componentDidMount(){
		super.componentDidMount();
		this.props.navigation.setParams({ navigatePress: this._back })  
	}

	_back = () => {
		if (this.type === 'register') {
			this.props.navigation.dispatch({ type: 'Main', mode: 'reset',params: { title: '',insiteNotice: this.props.insiteNotice } })
		} else {
			this.props.navigation.dispatch({type: 'pop'});
		}
	}
	_pushCompanyAuth(){
		this.props.navigation.dispatch({type: RouteType.ROUTE_COMPANY_AUTH, params: {title:'公司认证'}});
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar backViewClick={ () => {
	    	navigation.state.params.navigatePress()
	    }} router={ navigation }/>
	  };
	}; 

	render () {
		return (
			<View style = { styles.containerRole }>
				<Text style={ styles.tipText }>请选择您的角色</Text>	
				<Text style={ styles.tip }>选择角色后将不得更改，请谨慎选择</Text>	
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ [styles.cellView, { marginTop: 10 }] }
					onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_PERSONAL_AUTH, params: {title:'个体认证'}}) }>
					<View style={ styles.cell }><Text style={ styles.roleTip }>我是个体用户</Text></View>
					<View style={ [styles.cell, { alignItems: 'flex-end' }] }><Text style={ styles.arrowIcon }>&#xe60d;</Text></View>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.cellView }
					onPress={ this._pushCompanyAuth }>
					<View style={ styles.cell }><Text style={ styles.roleTip }>我是企业用户</Text></View>
					<View style={ [styles.cell, { alignItems: 'flex-end' }] }><Text style={ styles.arrowIcon }>&#xe60d;</Text></View>
				</TouchableOpacity>

				<View style={ styles.description }>
					<Text style={ styles.desTip }>温馨提示:</Text>
					<Text style={ styles.desTip }>请按照您的身份类型进行认证，如您是公司性质请选择企业用户；如果您是个体司机、车队，请选择个体用户</Text>
				</View>
				
				{ this._renderUpgrade(this.props) }
			</View>

		);
	}
}
const mapStateToProps = (state) => {
	const { app } = state;
	return {
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
    insiteNotice: app.get('insiteNotice'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(AuthRoleContainer);