import React from 'react';
import {
	View,
	Image,
	Text,
	Alert,
	Linking,
	Platform,
	NativeModules,
	TouchableOpacity,
    Switch
} from 'react-native';
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/setting';
import Button from '../../components/common/button';
import User from '../../models/user';
import {fetchData, receiverAlias, getHomePageCountAction, voiceSpeechAction} from '../../action/app';
import { logout } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import JPushModule from 'jpush-react-native';
import Toast from '@remobile/react-native-toast';
import {DEBUG} from '../../constants/setting';
import Storage from '../../utils/storage';
// import { Switch } from 'react-native-switch';
import BaseComponent from '../../components/common/baseComponent'
// import Link from '../../utils/linking'
import AppJSON from '../../../app.json'
import {appendLogToFile} from '../../action/app.js'
import user from "../../reducers/user";
import * as API from '../../constants/api';
let startTime = 0
import {
    clearUser,
} from '../../action/user';

class SettingContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			isOpen: this.props.alias * 1 !== 2,
			showLoading: false,
      speechSwitch: this.props.speechSwitchStatus,
		};
    this.title = props.navigation.state.params.title;
	  this._logout = this._logout.bind(this);
	  this._onValueChange = this._onValueChange.bind(this);
    this.loginOut = this.loginOut.bind(this);
    this.speechValueChange = this.speechValueChange.bind(this);
	}

	componentDidMount(){
		this.props.dispatch(appendLogToFile('设置','设置',0))
	}

    /*语音播报开关状态改变*/
    speechValueChange(value) {
        this.setState({
            speechSwitch: value,
        });
        this.props.speechSwitchAction(value);
    }

	_onValueChange(value) {
		const alias = value ? this.props.user.userId : '';
		// console.log('alias is ', alias);
		Storage.save('alias', alias ? '1' : '2');
		startTime = new Date().getTime()
		JPushModule.setAlias(alias, () => {
			Toast.show(alias ? '接收通知成功' : '关闭通知成功');
			this.props.dispatch(appendLogToFile('设置',(alias ? '接收通知成功' : '关闭通知成功'),startTime))
		  // console.log('set alias success');
			this.props.dispatch(receiverAlias(alias ? '1' : '2'));
			this.setState({ isOpen: !this.state.isOpen });
		}, () => {
			Toast.show('设置消息推送失败');
			// console.log('set alias fail');
		});
	}

// 	_logoutAction(){
// 		new User().delete();
// 	  // console.log("user logout Set alias empty success",);
// 	  this.props.dispatch(logout());
// 	  this.props.navigation.dispatch({type:RouteType.ROUTE_LOGIN, params:{title:''}});
// 	  if (Platform.OS === 'ios') {
// 		  JPushModule.setBadge(0, (success) => {
// 		    console.log(success)
// 		  });
// 		}
// 	}

    loginOut(){
        this.props.loginOut({});
    }

	_logout () {
		Alert.alert(
			'提示',
			'确定退出吗',
			[
				{ text: '稍后', onPress: () => {
					//if (DEBUG) this._logoutAction();
				}, style: 'cancel' },
				{ text: '退出', onPress: () => {
				// 	this.setState({
				// 		showLoading: true
				// 	})
					startTime = new Date().getTime()

            this.loginOut();
			this.props.getHomoPageCountAction({});
			this.props.removeUserInfoAction();
            this.props.navigation.dispatch({
								type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE,
								mode: 'reset',
								params: { title: '' } })


            // 	JPushModule.setAlias('', () => {
				// 		this._logoutAction()
				// 	  this.setState({
				// 	  	showLoading: false
				// 	  })
				// 	  this.props.dispatch(appendLogToFile('设置','退出登录成功',startTime))
				// 	}, () => {
				// 		// console.log("Set alias empty fail");
				// 		this.setState({
				// 			showLoading: false
				// 		})
				// 		Toast.show('退出失败，请重试！');
				// 		this.props.dispatch(appendLogToFile('设置','退出登录失败',startTime))
        //
				// 	})
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
								<Text style={ styles.iconFont }>&#xe63d;</Text>
							</View>

						</TouchableOpacity>
				}
				{/*<TouchableOpacity*/}
					{/*style={ styles.cellContainer }*/}
					{/*onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_DEVICES_BIND, params: {title: '设备绑定', type: 3}}) }>*/}
					{/*<View style={ styles.leftAnd }>*/}
						{/*<Text style={ styles.leftText }>设备绑定</Text>*/}
					{/*</View>*/}
					{/*<View style={ styles.rightAnd }>*/}
						{/*<Text style={ styles.iconFont }>&#xe63d;</Text>*/}
					{/*</View>*/}
				{/*</TouchableOpacity>*/}

				<TouchableOpacity
					style={ styles.cellContainer }
					onPress={ () =>
					{
						// 个人车主
						if (this.props.currentStatus == 'personalOwner') {
							if (this.props.ownerStatus == '12') {
                  this.props.navigation.dispatch({type: RouteType.ROUTE_ESIGN_INDIVIDUAL,
                      params: {title: '电签印章(个体)', type: 3}})
							} else if (this.props.ownerStatus == '11') {
								Toast.showShortCenter('认证中');
							} else if (this.props.ownerStatus == '13') {
                Toast.showShortCenter('认证驳回');
              } else if (this.props.ownerStatus == '14') {
                  Toast.showShortCenter('被禁用');
              } else {
                  Toast.showShortCenter('未认证');
							}
						}

						//  企业车主
						if (this.props.currentStatus == 'businessOwner') {
							if(this.props.ownerStatus == '22') {
                  this.props.navigation.dispatch({type: RouteType.ROUTE_UPDATE_ESIGN_INFO,
                      params: {title: '电签印章(公司)', type: 3}})
							}else if (this.props.ownerStatus == '21') {
                  Toast.showShortCenter('认证中');
              } else if (this.props.ownerStatus == '23') {
                  Toast.showShortCenter('认证驳回');
              } else if (this.props.ownerStatus == '24') {
                  Toast.showShortCenter('被禁用');
              } else {
                  Toast.showShortCenter('未认证');
              }

						}

					}
						}>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>电子签章设置</Text>
					</View>
					<View style={ styles.rightAnd }>
						<Text style={ styles.iconFont }>&#xe63d;</Text>
					</View>
				</TouchableOpacity>


				<View style={ styles.cellContainer }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>消息通知</Text>
					</View>
					<View style={ [styles.rightAnd, { marginRight: 15 }] }>
					  <Switch
					    value={ this.state.isOpen }
					    onValueChange={ this._onValueChange  }
					    style={ styles.switch }
							onTintColor={'#0092FF'}
					    />
					</View>
				</View>
				{/*<View style={ styles.cellContainer }>*/}
					{/*<View style={ styles.leftAnd }>*/}
						{/*<Text style={ styles.leftText }>语音播报</Text>*/}
					{/*</View>*/}
					{/*<View style={ [styles.rightAnd, { marginRight: 15 }] }>*/}
						{/*<Switch*/}
							{/*value={ this.state.speechSwitch }*/}
							{/*onValueChange={ this.speechValueChange  }*/}
							{/*style={ styles.switch }*/}
							{/*onTintColor={'#0092FF'}*/}
						{/*/>*/}
					{/*</View>*/}
				{/*</View>*/}

				{/*<TouchableOpacity*/}
					{/*style={ styles.cellContainer }*/}
					{/*onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_AGREEMENT_CONTENT, params: {title: '发票说明', type: 3}}) }>*/}
					{/*<View style={ styles.leftAnd }>*/}
						{/*<Text style={ styles.leftText }>发票说明</Text>*/}
					{/*</View>*/}
					{/*<View style={ styles.rightAnd }>*/}
						{/*<Text style={ styles.iconFont }>&#xe63d;</Text>*/}
					{/*</View>*/}
				{/*</TouchableOpacity>*/}

				<TouchableOpacity
					style={ styles.cellContainer }
					onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_AGREEMENT_CONTENT, params: {title: '用户服务协议', type: 1}}) }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>服务协议</Text>
					</View>
					<View style={ styles.rightAnd }>
						<Text style={ styles.iconFont }>&#xe63d;</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={ styles.cellContainer }
					onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_AGREEMENT_CONTENT, params: {title: '关于我们', type: 2}}) }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>关于我们</Text>
					</View>
					<View style={ styles.rightAnd }>
						<Text style={ styles.iconFont }>&#xe63d;</Text>
					</View>
				</TouchableOpacity>

				{/*<TouchableOpacity*/}
					{/*style={ styles.cellContainer }*/}
					{/*onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_HELP,params:{title:'反馈问题'}}) }>*/}
					{/*<View style={ styles.leftAnd }>*/}
						{/*<Text style={ styles.leftText }>帮助</Text>*/}
					{/*</View>*/}
					{/*<View style={ styles.rightAnd }>*/}
						{/*<Text style={ styles.iconFont }>&#xe63d;</Text>*/}
					{/*</View>*/}
				{/*</TouchableOpacity>*/}

				<TouchableOpacity
					style={ styles.cellContainer }
					onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_CUSTOME_SERVICE, params:{title: '我的客服'}}) }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>客服</Text>
					</View>
					<View style={ styles.rightAnd }>
						<Text style={ styles.iconFont }>&#xe63d;</Text>
					</View>
				</TouchableOpacity>

				<View style={ styles.cellContainer }>
					<View style={ styles.leftAnd }>
						<Text style={ styles.leftText }>软件更新</Text>
					</View>
					<View style={ styles.rightAndBtn }>
						<Text style={ styles.leftText }>当前版本号：</Text>
						<Text style={ [styles.leftText, { marginRight: 20 }] }>{ 'V' + NativeModules.NativeModule.VERSION + (IS_IOS ? (AppJSON.build_ios > 0 ? ('-' + AppJSON.build_ios) : '') : (AppJSON.build_and > 0 ? ('-' + AppJSON.build_and) : ''))}</Text>

					</View>
				</View>

				<View style={ styles.loginBtn }>
					<Button
						title='退出'
						style={ [styles.btn, {borderWidth: 1, borderColor: '#DEDEDE'}] }
						textStyle={ styles.btnText }
						onPress={ this._logout }/>
				</View>
				{this.state.showLoading ? this._renderLoadingView() : null}

				{ this._renderUpgrade(this.props) }
			</View>
		);
	}
}

function mapStateToProps (state) {
	const { app, user } = state;
	return {
		user: user.get('userInfo'),
		alias: app.get('alias'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
    currentStatus: user.get('currentStatus'),
		ownerStatus: user.get('ownerStatus'),
		speechSwitchStatus: user.get('speechSwitchStatus'),
	};
}

function mapDispatchToProps (dispatch) {
	return { dispatch,
      loginOut: (params) => {
          dispatch(fetchData({
              body: params,
              method: 'post',
              api: API.API_USER_LOGOUT + global.phone,
              success: data => {
              },
              fail: error => {
              }
          }))
      },
      removeUserInfoAction:()=>{
          dispatch(clearUser());
      },
        getHomoPageCountAction: (response) => {
            dispatch(getHomePageCountAction(response));
        },
      speechSwitchAction:(data)=>{
          dispatch(voiceSpeechAction(data));
      },
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer);
