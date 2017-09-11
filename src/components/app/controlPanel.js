import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	TouchableHighlight,
	Image
} from 'react-native';
// import Image from '../common/image';
import styles from '../../../assets/css/panel';
import UserIcon from '../../../assets/img/user/user_icon.png';
import QRCODE from '../../../assets/img/user/qr_code.png';
import GameIcon from '../../../assets/img/app/game_icon.png';
import CompanyIcon from '../../../assets/img/user/company_icon.png';
import GeCompanyIcon from '../../../assets/img/user/ge_compony_icon.png';
import * as RouteType from '../../constants/routeType'
import Toast from 'react-native-root-toast';
import { CODE_HOST } from '../../constants/setting';
import { API_DOWNLOAD_APP } from '../../constants/api';

export default class ControlPanel extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

	render () {
		const { user, drawer, _changeOrderTopTab,navigation } = this.props;
		let ruleText;
		if (user.currentUserRole === 1 && user.carrierType === 1) {
			ruleText = '公司'
		} else if (user.currentUserRole === 1 && user.carrierType === 2) {
			ruleText = '个人'
		} else if (user.currentUserRole === 2) {
			ruleText = '司机'
		} else {
			ruleText = ''
		}
		return (
			<ScrollView
				style={ styles.container }
				showsVerticalScrollIndicator={ false }>

				<TouchableHighlight
					underlayColor='#e6eaf2'
					style={ styles.topContainer }
					onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_USER_INFO, params: {title: '会员信息'}}) }>
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
							<Text style={ [styles.firstText, { marginTop: 10, marginLeft: 15, marginRight: 15 }] }>{ user.currentUserRole === 1 ? (user.companyName || (user.phoneNumber ? (user.phoneNumber.substr(0, 3) + '****' + user.phoneNumber.substr(7, 4)) : '')) : (user.phoneNumber ? (user.phoneNumber.substr(0, 3) + '****' + user.phoneNumber.substr(7, 4)) : '') }</Text>
							{
								ruleText.length !== 0 && 
									<View style={ styles.roleIconContainer }>
										<Text style={ styles.roleIconText }>{ ruleText }</Text>
									</View>
							}
						</View>
				</TouchableHighlight>

				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.gameContainer }
					onPress={ () => this.props.navigation.dispatch({ type: RouteType.ROUTE_GAME_PAGE, params: { title: '活动专区' }}) }>
					<Image source={ GameIcon } style={ styles.gameIcon }/>
				</TouchableOpacity>

				{
					(() => {
						if (user.currentUserRole === 1) {
							return (
								<View>

									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_MY_CAR,params:{title:'车辆管理'}}) }
										style={ styles.carManagerContainer }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe605;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>车辆管理</Text>
												</View>
												<Text style={ styles.secondLevelText }>
													认证并管理您的车辆信息，为您的运输提供诚信安全的保障
												</Text>
											</View>
										</View>
									</TouchableHighlight>

									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_DRIVER_MANAGER, params: {title: '司机管理'}}) }
										style={ [styles.carManagerContainer, {  marginTop: 0 }] }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe605;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>司机管理</Text>
												</View>
												<Text style={ styles.secondLevelText }>
													管理您的营运司机
												</Text>
											</View>
										</View>
									</TouchableHighlight>

									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_MY_ROUTE, params: {title: '我的路线'}}) }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe603;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>常用路线设置</Text>
												</View>
												<Text style={ styles.secondLevelText }>
													帮助您更好的推荐经常经营运输路线
												</Text>
											</View>
										</View>
									</TouchableHighlight>

									{
										user.carrierType * 1 === 1 &&
											<TouchableHighlight
												underlayColor='#e6eaf2'
												onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_BARGAIN,params:{title:'承运合同'}}) }>
												<View style={ styles.contentContainer }>
													<Text style={ styles.iconFont }>&#xe607;</Text>
													<View style={ styles.rightContent }>
														<View style={ styles.titleContent }>
															<Text style={ styles.firstLevelText }>承运合同</Text>
														</View>
														<Text style={ styles.secondLevelText }>
															您的所有的合同可以在这里查看便于您对账
														</Text>
													</View>
												</View>
											</TouchableHighlight>
									}

									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => navigation.dispatch({type:RouteType.ROUTE_HELP,params:{title:'反馈问题'}}) }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe602;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>帮助</Text>
												</View>
												<Text style={ styles.secondLevelText }>
													您在经营使用过程中遇到的问题，在这里可以找到答案
												</Text>
											</View>
										</View>
									</TouchableHighlight>

									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_CUSTOME_SERVICE, params:{title: '我的客服'}}) }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe606;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>客服</Text>
												</View>
												<Text style={ styles.secondLevelText }>
													7×24h为您竭诚服务 400 663 5656
												</Text>
											</View>
										</View>
									</TouchableHighlight>

									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => this.props.navigation.dispatch({type:RouteType.ROUTE_SETTING, params:{title: '系统设置'}}) }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe608;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>设置</Text>
												</View>
											</View>
										</View>
									</TouchableHighlight>
								</View>
							);
						} else {
							return (
								<View>
									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => this.props.router.push(RouteType.ROUTE_HELP) }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe602;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>帮助</Text>
												</View>
												<Text style={ styles.secondLevelText }>
													您在经营使用过程中遇到的问题，在这里可以找到答案
												</Text>
											</View>
										</View>
									</TouchableHighlight>

									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_CUSTOME_SERVICE, params: {title: '我的客服'}}) }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe606;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>客服</Text>
												</View>
												<Text style={ styles.secondLevelText }>
													7×24h为您竭诚服务 400 663 5656
												</Text>
											</View>
										</View>
									</TouchableHighlight>

									<TouchableHighlight
										underlayColor='#e6eaf2'
										onPress={ () => this.props.navigation.dispatch({type: RouteType.ROUTE_SETTING, params: {title: '系统设置'}}) }>
										<View style={ styles.contentContainer }>
											<Text style={ styles.iconFont }>&#xe608;</Text>
											<View style={ styles.rightContent }>
												<View style={ styles.titleContent }>
													<Text style={ styles.firstLevelText }>设置</Text>
												</View>
											</View>
										</View>
									</TouchableHighlight>
								</View>
							);
						}
					})()
				}
				<View style={ styles.codeContainer }>
					<Image style={{ width: 123, height: 123 }} source={{ uri: CODE_HOST + API_DOWNLOAD_APP }}/>
					<Text style={ styles.codeText }>官方APP下载</Text>
				</View>

			</ScrollView>
		);
	}

}

