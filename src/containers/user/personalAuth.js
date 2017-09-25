import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput	
} from 'react-native';
import styles from '../../../assets/css/auth';
import NavigatorBar from '../../components/common/navigatorbar';
import RegIcon from '../../../assets/img/user/reg_icon.png';
import MainContainer from '../app/main';
import * as RouteType from '../../constants/routeType';
import Button from '../../components/common/button';
import { ADD_COMPANY_AUTH } from '../../constants/api';
import { fetchData } from '../../action/app';
import dismissKeyboard from 'dismissKeyboard';
import Regex from '../../utils/regex';
import Toast from '../../utils/toast';
import BaseComponent from '../../components/common/baseComponent';

class PersonalAuthContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			idCard: '',
		};
    this.title = props.navigation.state.params.title;
		this._auth = this._auth.bind(this);
	}

	_auth(){
		dismissKeyboard();
		if(!this.state.name) return Toast.show('请输入姓名');
		if(!Regex.test('carUsername', this.state.name)) return Toast.show('姓名格式不正确');
		if(!this.state.idCard) return Toast.show('请输入身份证号码');
		if(!Regex.test('idCard', this.state.idCard)) return Toast.show('身份证格式不正确');
		this.props.addPersonalAuthInfo({
			id: this.props.user.userId,
			corporation: this.state.name,
			idCard: this.state.idCard,
			carrierType: 2,
		},this.props.navigation);
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};


	render () {
		return (
			<View style = { styles.container }>
				<View style={ styles.contentContainer }>
					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.textLeft }>
							<Text style={ styles.hiddenText }>姓名</Text>
						</View>
						<View style={ styles.textRight }>
							<TextInput
								textAlign='right'
								placeholder='请输入姓名'
								placeholderTextColor='#ccc'
								style={ styles.textInput }
								defaultValue={ this.state.name }
								value={this.state.name}
								underlineColorAndroid={ 'transparent' }
								onChangeText={ text => this.setState({ name: text }) }/>
						</View>
					</View>
					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>身份证</Text>
						</View>
						<View style={ styles.textRight }>
							<TextInput
								textAlign='right'
								placeholder='请输入身份证号码'
								placeholderTextColor='#ccc'
								style={ styles.textInput }
								defaultValue={ this.state.idCard }
								value={this.state.idCard}
								underlineColorAndroid={ 'transparent' }
								onChangeText={ text => this.setState({ idCard: text }) }/>
						</View>
					</View>
					<View style={ styles.AuthBtn }>
						<Button
							title='提交审核'
							style={ styles.btn }
							textStyle={ styles.btnText }
							onPress={ this._auth }/>
					</View>
				</View>

				{ this.props.loading ? this._renderLoadingView() : null }

				{ this._renderUpgrade(this.props) }

			</View>
		);
	}
}

const mapStateToProps = (state) => {
	const{ app } = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'), 
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		addPersonalAuthInfo: (body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: ADD_COMPANY_AUTH,
				successToast: true,
				msg: '提交成功',
				showLoading: true,
				success: () => {
			    navigation.dispatch({ type: 'Main',  params: { title: '', currentTab: 'route' } });
				}
			}));
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalAuthContainer);