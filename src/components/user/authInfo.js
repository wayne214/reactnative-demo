import React from 'react';
import {
	View,
	Text,
	Animated,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Image
} from 'react-native'
import styles from '../../../assets/css/car';
import Button from '../../components/common/button';
import * as RouteType from '../../constants/routeType';
import ComBineIcon from '../../../assets/img/user/combime.png';
import HelperUtil from '../../utils/helper';
import ImagePreview from '../../components/common/imagePreview.js'

export default class AuthInfoContainer extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			bankActive: false,
			imgActive: false,
			infoActive: true,
			bankValue: new Animated.Value(0),
			imageValue: new Animated.Value(0),
			infoValue: new Animated.Value(1),	
			shouldShow: false,
			imagePathes:[],		
		};
	}

	_startAnimated (type) {
		if (type === 'userInfo') {
			Animated.timing(this.state.infoValue, {
				duration: 300,
				toValue: this.state.infoActive ? 0 : 1,
			}).start();
			this.setState({ infoActive: !this.state.infoActive });
		} else if (type === 'bankInfo') {
			Animated.timing(this.state.bankValue, {
				duration: 300,
				toValue: this.state.bankActive ? 0 : 1,
			}).start();
			this.setState({ bankActive: !this.state.bankActive });
		} else if (type === 'imgInfo') {
			Animated.timing(this.state.imageValue, {
				duration: 300,
				toValue: this.state.imgActive ? 0 : 1,
			}).start();
			this.setState({ imgActive: !this.state.imgActive });
		}
	}

	render () {
		const { router , carrierInfo } = this.props;
		// const data = { status: 3, combine: carrierInfo.get('certificatesType') };
		if(!carrierInfo){
			return null;
		}
		let authStatus;
		if (carrierInfo.get('certificationStatus') === 1) { // 认证中
			authStatus = (
				<View style={ styles.authContainer }>
					<Text style={ styles.authing }>您公司的认证信息正在审核中，请稍后!</Text>
				</View>
			); 
		} else
		if (carrierInfo.get('certificationStatus') === 2) { // 认证成功
			authStatus = null;
		} else 
		if (carrierInfo.get('certificationStatus') === 3) { // 认证失败
			authStatus = (
				<View>
					<View style={ styles.authContainer }>
						<Text style={ styles.authFail }>您公司的认证信息认证失败！</Text>
					</View>
					<View style={ styles.authBtnContainer }>
						<Button
							title='申请重新认证'
							style={ styles.btnAuth }
							textStyle={ styles.btnAuthText }
							onPress={ () => this.props.router.push(RouteType.ROUTE_AUTH_ROLE) }/>
					</View>
				</View>								
			);
		}
		const textColor = { color: '#606060' };
		const imgHeight = carrierInfo.get('certificatesType') === 2 ? 170 : 510;
		console.log('--businessLicenseImgUrl-url---',carrierInfo && carrierInfo.get('businessLicenseImgUrl') && HelperUtil.getFullImgPath(carrierInfo.get('businessLicenseImgUrl')) );
		let showImage ;

		if(carrierInfo && carrierInfo.get('businessLicenseImgUrl') && carrierInfo.get('certificatesType') === 2){
			showImage = (<TouchableOpacity onPress={()=>{
												const url = HelperUtil.getFullImgPath(carrierInfo.get('businessLicenseImgUrl'));
												let temp = [];
												temp.push(url);
												this.setState({
													shouldShow: true,
													imagePathes: temp,
												})
											}}> 
											<View style={ styles.imgContainer }>
												<View style={ styles.imgContent }>
													<Image style={ styles.img } source={ {uri: HelperUtil.getFullImgPath(carrierInfo.get('businessLicenseImgUrl'))} }/>
												</View>
											</View>
										</TouchableOpacity>);
		}else if(carrierInfo && carrierInfo.get('businessLicenseImgUrl') && carrierInfo.get('certificatesType') === 1){
			showImage = (<View style={ styles.imgContainer }>
											<TouchableOpacity onPress={()=>{
												const url = HelperUtil.getFullImgPath(carrierInfo.get('businessLicenseImgUrl'));
												let temp = [];
												temp.push(url);
												this.setState({
													shouldShow: true,
													imagePathes: temp,
												})
											}}> 
												<View style={ styles.imgContent }>
													<Image style={ styles.img } source={{ uri: HelperUtil.getFullImgPath(carrierInfo.get('businessLicenseImgUrl')) }}/>
												</View>
											</TouchableOpacity>
											<TouchableOpacity onPress={()=>{
												const url = HelperUtil.getFullImgPath(carrierInfo.get('organizationCodeCertificateImgUrl'));
												let temp = [];
												temp.push(url);
												this.setState({
													shouldShow: true,
													imagePathes: temp,
												})
											}}> 
												<View style={ styles.imgContent }>
													<Image style={ styles.img } source={{ uri: HelperUtil.getFullImgPath(carrierInfo.get('organizationCodeCertificateImgUrl')) }}/>
												</View>
											</TouchableOpacity>
											<TouchableOpacity onPress={()=>{
												const url = HelperUtil.getFullImgPath(carrierInfo.get('taxRegCertificateImgUrl'));
												let temp = [];
												temp.push(url);
												this.setState({
													shouldShow: true,
													imagePathes: temp,
												})
											}}> 
												<View style={ [styles.imgContent, { paddingBottom: 30 }] }>
													<Image style={ styles.img } source={{ uri: HelperUtil.getFullImgPath(carrierInfo.get('taxRegCertificateImgUrl')) }}/>
												</View>
											</TouchableOpacity>
											</View>);
		}

		let certificatesCodeLength = (carrierInfo.get('certificatesCode')+'').length;
		// console.log('lqq--certificatesCodeLength--',certificatesCodeLength);
		let newCertificatesCodeOne = (carrierInfo.get('certificatesCode')+'').substr(0,1);
		let newCertificatesCodeTwo = '';

		for(var i=0;i<certificatesCodeLength-2;i++){
			newCertificatesCodeTwo += '*';
		}
		let newCertificatesCodeThree = (carrierInfo.get('certificatesCode')+'').substr(certificatesCodeLength-1);
		let newCertificatesCode = newCertificatesCodeOne + newCertificatesCodeTwo + newCertificatesCodeThree;
		// console.log('lqq--newCertificatesCode--',newCertificatesCode);
		
		let phoneNumberLength = (carrierInfo.get('phoneNumber')+'').length;
		// console.log('lqq--phoneNumberLength--',phoneNumberLength);
		let newPhoneNumberOne = (carrierInfo.get('phoneNumber')+'').substr(0,3);
		let newPhoneNumberTwo = '';

		for(var i=0;i<4;i++){
			newPhoneNumberTwo += '*';
		}
		let newPhoneNumberThree = (carrierInfo.get('phoneNumber')+'').substr(phoneNumberLength-4);
		let newPhoneNumber = newPhoneNumberOne + newPhoneNumberTwo + newPhoneNumberThree;
		 

		return (
			<View style={ styles.container }>
				<ScrollView
					showsVerticalScrollIndicator={ false }>
					{ authStatus }
					<View style={ styles.blockContainer }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ this._startAnimated.bind(this, 'userInfo') }
							style={ styles.cellTipContainer }>
							<View style={ styles.speLeft }>
								<Text style={ styles.tipText }>法人身份信息</Text>
							</View>
							<View style={ styles.speRight }>
								<Animated.Text
									style={ [styles.iconFont, {
										transform: [
											{ rotate: this.state.infoValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe616;</Animated.Text>
							</View>
						</TouchableOpacity>
						<Animated.View
							style={ [styles.hiddenContainer, {
								height: this.state.infoValue.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 132]
								})
							}] }>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>公司名称</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textColor] }>{carrierInfo && carrierInfo.get('companyName')}</Text>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>法人姓名</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textColor] }>{carrierInfo && carrierInfo.get('corporation')}</Text>
								</View>
							</View>
							{
								false &&
									<View style={ styles.hiddenCellContainer }>
										<View style={ styles.hiddenLeft }>
											<Text style={ styles.hiddenText }>身份证号</Text>
										</View>
										<View style={ styles.hiddenRight }>
											<Text style={ [styles.rightText, textColor] }>{carrierInfo && carrierInfo.get('idCard')}</Text>
										</View>
									</View>
							}
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>手机号码</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textColor] }>{carrierInfo && newPhoneNumber}</Text>
								</View>
							</View>
						</Animated.View>
					</View>

					

					<View style={ [styles.blockContainer, { marginBottom: 20 }] }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ this._startAnimated.bind(this, 'imgInfo') }					
							style={ styles.cellTipContainer }>
							<View style={ styles.speLeft }>
								<Text style={ styles.tipText }>公司资质信息</Text>
							</View>
							<View style={ styles.speRight }>
								<Animated.Text
									style={ [styles.iconFont, {
										transform: [
											{ rotate: this.state.imageValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe616;</Animated.Text>
							</View>
						</TouchableOpacity>
						<Animated.View
							style={ [styles.hiddenContainer, {
								height: this.state.imageValue.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 88 + imgHeight]
								})
							}] }>					
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
								{
									(() => {
										if(carrierInfo && carrierInfo.get('certificatesType') === 2){
											return (
												<Text style={ styles.hiddenText }>社会信用统一代码证</Text>

												);
										}else{
											return (
												<Text style={ styles.hiddenText }>组织机构代码</Text>
											);
										}
									})()
								}
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textColor] }>{carrierInfo && newCertificatesCode }</Text>
								</View>
							</View>
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>资质证件</Text>
								</View>
								<View style={ styles.hiddenRight }>
								</View>
							</View>
							{
								showImage
							}
							
						</Animated.View>
					</View>

				</ScrollView>
				<ImagePreview
					activeIndex={1}
					imagePathes={this.state.imagePathes}
					show={this.state.shouldShow}
					hide={()=>{
						this.setState({
							shouldShow: false
						})
					}}/>
			</View>
		);
	}
}
