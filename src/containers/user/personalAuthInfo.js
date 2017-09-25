import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Platform
} from 'react-native';
import styles from '../../../assets/css/auth';
import NavigatorBar from '../../components/common/navigatorbar';
import RegIcon from '../../../assets/img/user/reg_icon.png';
import MainContainer from '../app/main';
import * as RouteType from '../../constants/routeType';
import Button from '../../components/common/button';
import { GET_AUTHINFO_DETAIL } from '../../constants/api';
import { fetchData } from '../../action/app';
import { dispatchGetPersonalAuthInfo } from '../../action/carrier';
import BaseComponent from '../../components/common/baseComponent';

class PersonalAuthInfoContainer extends BaseComponent {

	constructor(props) {
		super(props);
    this.title = props.navigation.state.params.title;
	}
	componentDidMount(){
		super.componentDidMount();
		this.props.getPersonalAuthInfo();
	}

	componentWillUnmount() {
		super.componentWillUnmount()
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};

	render () {
		const { auth ,user} = this.props;
		let id = auth.idCard+'';
		let firstNumber = id.substring(0, 1);
		let lastNumber = id.substring(id.length - 1);
		let betweenArr = [];
		for(let i = 0; i < id.length - 2; i++){
			betweenArr.push('*');
		}
		let betweenNumber = betweenArr.join('');
		let idCardNumber = firstNumber + betweenNumber + lastNumber;
		return (
			<View style = { styles.container }>
				<View style={ styles.contentContainer }>
					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.textLeft }>
							<Text style={ styles.hiddenText }>姓名</Text>
						</View>
						<View style={ styles.textRight }>
							<Text style = {styles.rightText}>{ auth.corporation }</Text>
						</View>
					</View>

					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>身份证</Text>
						</View>
						<View style={ styles.textRight }>
							<Text style={ styles.rightText } >{ idCardNumber } </Text>
						</View>
					</View>
				</View>

				{ this._renderUpgrade(this.props) }
			</View>
		);
	}
}
const mapStateToProps = (state) => {
	const { app, carrier } = state;
	return {
		user: app.get('user'),
		auth: carrier.get('personalInfoDetail'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		getPersonalAuthInfo: (body, router) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: GET_AUTHINFO_DETAIL,
				success: (data) => {
					dispatch(dispatchGetPersonalAuthInfo({data}));
				}
			}));
		},
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(PersonalAuthInfoContainer);