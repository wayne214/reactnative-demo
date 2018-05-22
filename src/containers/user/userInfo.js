import React from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/user';
import Button from '../../components/common/button';
import UserIcon from '../../../assets/img/user/user_icon.png';
import * as RouteType from '../../constants/routeType';
import CompanyIcon from '../../../assets/img/user/company_icon.png';
import { dispatchClearAuthInfo } from '../../action/carrier';
import { clearCombineImg,appendLogToFile } from '../../action/app';
import BaseComponent from '../../components/common/baseComponent';
import GeCompanyIcon from '../../../assets/img/user/ge_compony_icon.png';
import Storage from '../../utils/storage';
import StorageKey from '../../constants/storageKeys';
import Toast from '@remobile/react-native-toast';

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
		const ownerStatus = this.props.ownerStatus;
		const currentStatus = this.props.currentStatus;
		// const currentStatus = 'personalOwner';
        //ownerStatus ： 11 个人车主认证中 12 个人车主认证通过 13 个人车主认证驳回  14 个人车主被禁用
        //               21 企业车主认证中 22 企业车主认证通过 23 企业车主认证驳回  24 企业车主被禁用

        // currentStatus ： driver 司机  personalOwner 个人车主 businessOwner 企业车主


		if (currentStatus === 'personalOwner'){
                if (ownerStatus != 14){
                    // 详情
                    this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_OWNER_VERIFIED })

                } else {
                    Toast.showShortCenter('个人车主身份被禁用');
								}

		}
        if (currentStatus === 'businessOwner'){
                if (ownerStatus != 24){
                    // 详情
                    this.props.navigation.dispatch({ type: RouteType.ROUTE_ENTERPRISE_OWNER_VERIFIED_DETAIL })

                } else {
                    Toast.showShortCenter('企业车主身份被禁用');
								}
        }





	}

	componentDidMount(){
		super.componentDidMount();
		this.props.dispatch(appendLogToFile('会员信息','会员信息',0))
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
		// let textColor;
		// if (user.currentUserRole === 1) {
		// 	if (!user.carrierType || user.certificationStatus === 0) {
		// 		textColor = '#17A9DF';
		// 		authStatusText = '未认证';
		// 	} else if (user.certificationStatus === 1) {
		// 		textColor = '#FFAC1B';
		// 		authStatusText = '认证中';
		// 	} else if (user.certificationStatus === 2) {
		// 		textColor = '#1AB036';
		// 		authStatusText = '已认证';
		// 	} else if (user.certificationStatus === 3) {
		// 		textColor = '#EA574C';
		// 		authStatusText = '认证未通过';
		// 	}
		// }

			if(this.props.ownerStatus == 11 || this.props.ownerStatus == 21) {
          authStatusText = '认证中'
			} else if (this.props.ownerStatus == 12 || this.props.ownerStatus == 22) {
          authStatusText = '已认证'
			} else if (this.props.ownerStatus == 13 || this.props.ownerStatus == 23) {
          authStatusText = '认证驳回'
			} else if (this.props.ownerStatus == 14 || this.props.ownerStatus == 24) {
          authStatusText = '被禁用'
			} else {
          authStatusText = '未认证'
			}

			/*
			* borderBottomWidth: 1,
			 borderBottomColor: LINE_COLOR,
			 backgroundColor: 'white'*/
		return (
			<View style={ [styles.container, {backgroundColor: 'white'}] }>
				{/*<View style={ styles.topContainer }>*/}
					{/*{*/}
						{/*(() => {*/}
							{/*if (user.currentUserRole === 1 && user.carrierType === 1) {*/}
								{/*return (<Image style={ styles.userIcon } source={ CompanyIcon }/>);*/}
							{/*} else if (user.currentUserRole === 1 && user.carrierType === 2) {*/}
								{/*return (<Image style={ styles.userIcon } source={ GeCompanyIcon }/>);*/}
							{/*} else if (user.currentUserRole === 2) {*/}
								{/*return (<Image style={ styles.userIcon } source={ UserIcon }/>)*/}
							{/*} else if (user.currentUserRole === 1) {*/}
								{/*return (<Image style={ styles.userIcon } source={ CompanyIcon }/>)*/}
							{/*}*/}
						{/*})()*/}
					{/*}*/}
					{/*<View style={ styles.userInfoContainer }>*/}
					{/*{*/}
						{/*(() => {*/}
							{/*if(user.certificationStatus === 2 || user.currentUserRole === 2){*/}
								{/*return(<Text style={ styles.firstLevelText }>{ user.currentUserRole === 1 ? (user.companyName || '**' + lastName) : ('**' + lastName) }</Text>)*/}
							{/*}else{*/}
								{/*return(<Text style={ styles.firstLevelText }>{ user.phoneNumber ? (user.phoneNumber.substr(0, 3) + '****' + user.phoneNumber.substr(7, 4)) : '' }</Text>)*/}
							{/*}*/}
						{/*})()*/}
					{/*}*/}
					{/*</View>*/}
				{/*</View>*/}
				<TouchableOpacity
					>
					<View style={ [styles.cellContainer, { borderTopWidth: 1, borderTopColor: '#e6eaf2' }] }>
						<View style={ styles.cell }>
							<Text style={ styles.leftText }>公司名称</Text>
						</View>
						<View style={ styles.rightCell }>
							<Text style={ styles.rightText }>{ this.props.ownerName ? this.props.ownerName : '' }</Text>
						</View>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					>
					<View style={ [styles.cellContainer, { borderTopWidth: 1, borderTopColor: '#e6eaf2' }] }>
						<View style={ styles.cell }>
							<Text style={ styles.leftText }>手机号码</Text>
						</View>
						<View style={ styles.rightCell }>
							<Text style={ styles.rightText }>{ global.phone ? (global.phone.substr(0, 3) + '****' + global.phone.substr(7, 4)) : '' }</Text>
						</View>
					</View>
				</TouchableOpacity>


				<TouchableOpacity

					onPress={ this._authOrInfo }>
					<View style={ [styles.cellContainer, { borderTopWidth: 1, borderTopColor: '#e6eaf2' }]}>
						<View style={ styles.cell }>
							<Text style={ styles.leftText }>认证信息</Text>
						</View>
						<View style={ styles.rightCell }>
							<Text style={ [styles.authText, { color: '#999999' }] }>{ authStatusText }</Text>
						</View>
					</View>
				</TouchableOpacity>


				<TouchableOpacity

					 onPress={ () =>
							 // this.props.navigation.dispatch({type: RouteType.ROUTE_PASSWORD_PAGE, params: {title: '修改登录密码'}})
               this.props.navigation.dispatch({ type: RouteType.ROUTE_MODIFY_PWD })
					 }>
					<View style={ [styles.cellContainer, { borderTopWidth: 1, borderTopColor: '#e6eaf2',borderBottomWidth: 1, borderBottomColor: '#e6eaf2' }] }>
						<View style={ styles.cell }>
							<Text style={ styles.leftText }>修改登录密码</Text>
						</View>
						<View style={ styles.rightCell }>
							<Text style={ styles.iconFont }>&#xe63d;</Text>
						</View>
					</View>
				</TouchableOpacity>

				{/*<TouchableHighlight*/}
					{/*underlayColor='#e6eaf2'*/}
					 {/*onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_BANK_CARD_LIST,params:{title:'银行账户管理'}}) }>*/}
					{/*<View style={ styles.cellContainer }>*/}
						{/*<View style={ styles.cell }>*/}
							{/*<Text style={ styles.leftText }>银行账户管理</Text>*/}
						{/*</View>*/}
						{/*<View style={ styles.rightCell }>*/}
							{/*<Text style={ styles.iconFont }>&#xe63d;</Text>*/}
						{/*</View>*/}
					{/*</View>*/}
				{/*</TouchableHighlight>*/}
				{ this._renderUpgrade(this.props) }
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { app } = state;
	return {
		user: app.get('user'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    	upgradeForceUrl: app.get('upgradeForceUrl'),
        ownerStatus: state.user.get('ownerStatus'),
        ownerName: state.user.get('ownerName'),
        currentStatus: state.user.get('currentStatus'),
	};
}
function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps)(UserInfoContainer);
