import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TextInput,
	Button,
	TouchableOpacity
} from 'react-native';
import styles from '../../../assets/css/help';
import NavigatorBar from '../../components/common/navigatorbar';
import Help from '../../components/user/help';
import TabView from '../../components/common/tabView';
import { ADD_FEEDBACK } from '../../constants/api';
import { fetchData,appendLogToFile } from '../../action/app';
import Regex from '../../utils/regex';
import Toast from '../../utils/toast';
import * as RouteType from '../../constants/routeType';
import { dispatchGetFeedbackDetails,dispatchUpdateFeedbackList } from '../../action/help';
import UserIcon from '../../../assets/img/user/user_icon.png';
import BaseComponent from '../../components/common/baseComponent';
let startTime = 0
class AddFeedbackContainer extends BaseComponent {

	constructor(props) {
		super(props);
		// this.title = props.router.getCurrentRouteTitle();
		this.state = {
			text:''
		};
		this.hiddingBack = (this.key === 'COMPANY_AUTH_PAGE' ? true : false);
		this._addFeedback = this._addFeedback.bind(this);
	}

	static navigationOptions = ({ navigation }) => {
	  const {state, setParams} = navigation;
	  return {
	    header: <NavigatorBar
	    router={ navigation }/>
	  };
	};


	componentDidMount(){
		super.componentDidMount();
	}

	_addFeedback(){
		if (this.state.text && this.state.text.length > 50) {
			return Toast.show('输入字符不能超过50');
		}

		if(this.state.text){
			this.props.addFeedBack({
				userId: this.props.user.userId,
				userCode: this.props.user.phoneNumber,
				questionContent: this.state.text
			},this.props.navigation);
		}else{
			Toast.show('请输入您遇到的问题');
		}

	}

	render () {
		const { navigation } = this.props;
		return (
			<View style={ styles.container }>
					<View style={ styles.inputContainer}>
						<TextInput style={ styles.inputTxt }
							multiline = {true}
							numberOfLines = {4}
							underlineColorAndroid={ 'transparent' }
							placeholder='请输入您遇到的问题'
							placeholderTextColor='#ccc'
							textAlignVertical= 'top'
							value = { this.state.text }
							onChangeText={(text) => this.setState({text})}/>
					</View>
					<TouchableOpacity onPress={() => this._addFeedback() }>
					<View style={styles.btnContainer}>
						<Text
							style={ styles.btnPress }
							textStyle={ styles.btnText }
							>提交</Text>

					</View>
					</TouchableOpacity>
				{ this.props.loading ? this._renderLoadingView() : null }
				{ this._renderUpgrade(this.props) }
			</View>
		);
	}
}
const mapStateToProps = state => {
	const { app } = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),

	}
}

const mapDispatchToProps = dispatch => {
	return {
		addFeedBack:(body, navigation) => {
			startTime = new Date().getTime()
			dispatch(fetchData({
				body,
				method: 'POST',
				api: ADD_FEEDBACK,
				msg: '添加成功',
				successToast: true,
				showLoading: true,
				success: () => {
					// console.log('lqq--success-');
					dispatch(dispatchUpdateFeedbackList());
					navigation.dispatch({type:'pop'});
					dispatch(appendLogToFile('反馈问题','添加问题反馈', startTime))
				},
				fail: () => {
					// console.log('lqq--fail-');
				}
			}));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFeedbackContainer);
