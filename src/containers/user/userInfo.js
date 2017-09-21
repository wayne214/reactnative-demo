import React from 'react';
import {
	View,
	Image,
	Text,
	TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/user';
import Button from '../../components/common/button';
import UserIcon from '../../../assets/img/user/user_icon.png';
import * as RouteType from '../../constants/routeType';
import CompanyIcon from '../../../assets/img/user/company_icon.png';
import { dispatchClearAuthInfo } from '../../action/carrier';
import { clearCombineImg } from '../../action/app';
import BaseComponent from '../../components/common/baseComponent';
import GeCompanyIcon from '../../../assets/img/user/ge_compony_icon.png';

class UserInfoContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			isOpen: true,
		};
    this.title = props.navigation.state.params.title;
	  this._authOrInfo = this._authOrInfo.bind(this);
	}

	_authOrInfo() {
		const certificationStatus = this.props.user.certificationStatus;
		const carrierType = this.props.user.carrierType;
		if(certificationStatus === 0){
			//未认证
			this.props.navigation.dispatch({type: RouteType.ROUTE_AUTH_ROLE,params:{title: '认证角色'}});
		}else{
			if(carrierType === 1){
				let phoneNumber = this.props.user.phoneNumber;
				this.props.navigation.dispatch({type: RouteType.ROUTE_AUTH_INFO,params:{title: '公司认证', phoneNumber: phoneNumber}});
			}else if(carrierType === 2){
				this.props.navigation.dispatch({type: RouteType.ROUTE_PERSONAL_AUTH_DETAIL, params: {title: '个人认证详情'}});
			}
		}
	}

	componentDidMount(){
		super.componentDidMount();
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};

	render () {
		const { user } = this.props;
		let name ;
		let lastName;
		if(user.corporation){
			name = user.corporation.split("");
			lastName = name[name.length - 1];
		}else if(user.driverName){
			name = user.driverName.split("");
			lastName = name[name.length - 1];
		}
		let authStatusText;
		let textColor;
		if (user.currentUserRole === 1) {
			if (!user.carrierType || user.certificationStatus === 0) {
				textColor = '#17A9DF';
				authStatusText = '未认证';
			} else if (user.certificationStatus === 1) {
				textColor = '#FFAC1B';
				authStatusText = '认证中';
			} else if (user.certificationStatus === 2) {
				textColor = '#1AB036';
				authStatusText = '已认证';
			} else if (user.certificationStatus === 3) {
				textColor = '#EA574C';
				authStatusText = '认证未通过';
			}
		}
		return (
			<View style={ styles.container }>
				<View style={ styles.topContainer }>
					{
						(() => {
							if (user.currentUserRole === 1 && user.carrierType === 1) {
								return (<Image style={ styles.userIcon } source={ CompanyIcon }/>);
							} else if (user.currentUserRole === 1 && user.carrierType === 2) {
								return (<Image style={ styles.userIcon } source={ GeCompanyIcon }/>);
							} else if (user.currentUserRole === 2) {
								return (<Image style={ styles.userIcon } source={ UserIcon }/>)
							} else if (user.currentUserRole === 1) {
								return (<Image style={ styles.userIcon } source={ CompanyIcon }/>)
							}
						})()
					}
					<View style={ styles.userInfoContainer }>
					{
						(() => {
							if(user.certificationStatus === 2 || user.currentUserRole === 2){
								return(<Text style={ styles.firstLevelText }>{ user.currentUserRole === 1 ? (user.companyName || '**' + lastName) : ('**' + lastName) }</Text>)
							}else{
								return(<Text style={ styles.firstLevelText }>{ user.phoneNumber ? (user.phoneNumber.substr(0, 3) + '****' + user.phoneNumber.substr(7, 4)) : '' }</Text>)
							}
						})()
					}
					</View>
				</View>

				<TouchableHighlight
					underlayColor='#e6eaf2'>
					<View style={ [styles.cellContainer, { borderTopWidth: 1, borderTopColor: '#e6eaf2' }] }>
						<View style={ styles.cell }>
							<Text style={ styles.leftText }>手机号码</Text>
						</View>
						<View style={ styles.rightCell }>
							<Text style={ styles.rightText }>{ user.phoneNumber ? (user.phoneNumber.substr(0, 3) + '****' + user.phoneNumber.substr(7, 4)) : '' }</Text>
						</View>
					</View>
				</TouchableHighlight>

				{
					this.props.user.currentUserRole === 1 &&
						<TouchableHighlight
							underlayColor='#e6eaf2'
							onPress={ this._authOrInfo }>
							<View style={ styles.cellContainer }>
								<View style={ styles.cell }>
									<Text style={ styles.leftText }>认证信息</Text>
								</View>
								<View style={ styles.rightCell }>
									<Text style={ [styles.authText, { color: textColor }] }>{ authStatusText }</Text>
								</View>
							</View>
						</TouchableHighlight>					
				}
				
				<TouchableHighlight
					underlayColor='#e6eaf2'
					 onPress={ () => this.props.navigation.dispatch({type: RouteType.PASSWORD_PAGE, params: {title: '修改登录密码'}}) }>
					<View style={ styles.cellContainer }>
						<View style={ styles.cell }>
							<Text style={ styles.leftText }>修改登录密码</Text>
						</View>
						<View style={ styles.rightCell }>
							<Text style={ styles.iconFont }>&#xe60d;</Text>						
						</View>
					</View>
				</TouchableHighlight>
	
				<TouchableHighlight
					underlayColor='#e6eaf2'
					 onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_BANK_CARD_LIST,params:{title:'银行账户管理'}}) }>
					<View style={ styles.cellContainer }>
						<View style={ styles.cell }>
							<Text style={ styles.leftText }>银行账户管理</Text>
						</View>
						<View style={ styles.rightCell }>
							<Text style={ styles.iconFont }>&#xe60d;</Text>
						</View>
					</View>
				</TouchableHighlight>
				{ this._renderUpgrade(this.props.upgrade) }	
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { app } = state;
	return {
		user: app.get('user'),
		upgrade: app.get('upgrade'),
	};
}
function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps)(UserInfoContainer);
