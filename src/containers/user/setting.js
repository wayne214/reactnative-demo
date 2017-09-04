import React from 'react';
import {
	View,
	Image,
	Text,
	Alert,
	Linking,
	Platform,
	NativeModules,
	TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/setting';
import Button from '../../components/common/button';
import User from '../../models/user';
import { receiverAlias } from '../../action/app';
import { logout } from '../../action/app';
import * as RouteType from '../../constants/routeType';
// import JPushModule from 'jpush-react-native';
import Toast from '../../utils/toast';
import {DEBUG} from '../../constants/setting';
import Storage from '../../utils/storage';
import { Switch } from 'react-native-switch';
import BaseComponent from '../../components/common/baseComponent'
// import Link from '../../utils/linking'
import Package from '../../../package.json'

class SettingContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			isOpen: props.alias * 1 !== 2,
			showLoading: false
		};
    this.title = props.navigation.state.params.title;
	  this._logout = this._logout.bind(this);
	  this._onValueChange = this._onValueChange.bind(this);
	}

	_onValueChange(value) {
		// const alias = value ? this.props.user.userId : '';
		// // console.log('alias is ', alias);
		// Storage.save('alias', alias ? '1' : '2');
		// JPushModule.setAlias(alias, () => {
		// 	Toast.show(alias ? '接收通知成功' : '关闭通知成功');
		//   // console.log('set alias success');
		// 	this.props.dispatch(receiverAlias(alias ? '1' : '2'));
		// 	this.setState({ isOpen: !this.state.isOpen });
		// }, () => {
		// 	Toast.show('设置消息推送失败');
		// 	// console.log('set alias fail');
		// });
	}

	_logoutAction(){
		new User().delete();
	  // console.log("user logout Set alias empty success",);
	  this.props.dispatch(logout());
	  this.props.navigation.dispatch({type:RouteType.ROUTE_LOGIN, params:{title:''}});
	  if (Platform.OS === 'ios') {
		  // JPushModule.setBadge(0, (success) => {
		    // console.log(success)
		  // });
		}
	}

	_logout () {
		Alert.alert(
			'提示',
			'确定退出吗',
			[
				{ text: '稍后', onPress: () => {
					// if (DEBUG) this._logoutAction();
				}, style: 'cancel' },
				{ text: '退出', onPress: () => {
					// this.setState({
					// 	showLoading: true
					// })
					// JPushModule.setAlias('', () => {
						this._logoutAction()
					//   this.setState({
					//   	showLoading: false
					//   })
					// }, () => {
					// 	// console.log("Set alias empty fail");
					// 	this.setState({
					// 		showLoading: false
					// 	})
					// 	Toast.show('退出失败，请重试！');
					// })
				}},
			]
		);
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};

	render () {
		const { user } = this.props;
		return (
			<View style={ styles.container }>
				{
					user.currentUserRole === 1 &&
						<TouchableOpacity
							style={ styles.cellContainer }
							onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_SHOW_ESIGN_IMAGE,params:{title:'电子签章'}}) }>
							<View style={ styles.leftAnd }>
								<Text style={ styles.leftText }>电签设置</Text>
							</View>
							<View style={ styles.rightAnd }>
								<Text style={ styles.iconFont }>&#xe60d;</Text>
							</View>

						</TouchableOpacity>
				}

				<View style={ styles.cellContainer }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>消息推送</Text>
					</View>
					<View style={ [styles.rightAnd, { marginRight: 15 }] }>
					  <Switch
					    value={ this.state.isOpen }
					    onValueChange={ this._onValueChange  }
					    style={ styles.switch }
					    activeText={ 'On' }
					    inActiveText={ 'Off' }
					    backgroundActive={'#09bb07'}
					    backgroundInactive={'gray'}
					    circleActiveColor={'white'}
					    circleInActiveColor={'white'}/>
					</View>
				</View>

				<TouchableOpacity
					style={ styles.cellContainer }
					onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_AGREEMENT_CONTENT, params: {title: '发票说明', type: 3}}) }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>发票说明</Text>
					</View>
					<View style={ styles.rightAnd }>
						<Text style={ styles.iconFont }>&#xe60d;</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={ styles.cellContainer }
					onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_AGREEMENT_CONTENT, params: {title: '关于我们', type: 2}}) }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>关于我们</Text>
					</View>
					<View style={ styles.rightAnd }>
						<Text style={ styles.iconFont }>&#xe60d;</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={ styles.cellContainer }
					onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_AGREEMENT_CONTENT, params: {title: '注册协议', type: 1}}) }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>注册协议</Text>
					</View>
					<View style={ styles.rightAnd }>
						<Text style={ styles.iconFont }>&#xe60d;</Text>
					</View>
				</TouchableOpacity>

				{
					user.currentUserRole !== 1 &&
						<TouchableOpacity
							style={ styles.cellContainer }
							onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_COMPANY_LIST, params: {title: '承运商列表'}}) }>
							<View style={ styles.leftAnd }>
								<Text style={ styles.leftText }>承运商切换</Text>
							</View>
							<View style={ [styles.rightAndBtn, { flex: 2 }] }>

								<Text style={ [styles.leftText, { marginRight: 10 }] }>{ user.companyName || user.driverName  }</Text>
								<Text style={ styles.iconFont }>&#xe60d;</Text>
							</View>
						</TouchableOpacity>
				}

				<View style={ styles.cellContainer }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>当前版本号</Text>
					</View>
					<View style={ styles.rightAndBtn }>
						<Text style={ [styles.leftText, { marginRight: 20 }] }>{ 'V' + NativeModules.NativeModule.VERSION + (Package.build > 0 ? ('-' + Package.build) : '')}</Text>

					</View>
				</View>

				<View style={ styles.loginBtn }>
					<Button
						title='退出'
						style={ styles.btn }
						textStyle={ styles.btnText }
						onPress={ this._logout }/>
				</View>
				{this.state.showLoading ? this._renderLoadingView() : null}
			</View>
		);
	}
}

function mapStateToProps (state) {
	const { app } = state;
	return {
		user: app.get('user'),
		alias: app.get('alias')
	};
}

function mapDispatchToProps (dispatch) {
	return { dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer);