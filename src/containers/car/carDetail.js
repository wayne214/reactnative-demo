import React from 'react';
import {
	View,
	Text,
	Animated,
	TextInput,
	ScrollView,
	Image,
	TouchableOpacity,
	Platform
} from 'react-native'
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/car';
import Button from '../../components/common/button';
import ComBineIcon from '../../../assets/img/user/combime.png';
import { GET_CAR_INFO } from '../../constants/api';
import { fetchData } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import { dispatchGetCarInfo } from '../../action/car';
import HelperUtil from '../../utils/helper';
import DateFormat from 'moment';
import ImagePreview from '../../components/common/imagePreview.js'
import BaseComponent from '../../components/common/baseComponent';


class CarDetailContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			carActive: false,
			authActive: false,
			gauthActive: false,

			basicActive: true,
			carValue: new Animated.Value(0),
			authValue: new Animated.Value(0),
			gauthValue: new Animated.Value(0),

			basicValue: new Animated.Value(1),
			shouldShow: false,
			imagePathes:[],					
		};
		// this.title = props.router.getCurrentRouteTitle();
		this.carId = props.navigation.state.params.carId;	
		this._getCarInfo = this._getCarInfo.bind(this);
	}

	_startAnimated (type) {
		if (type === 'basic') {
			Animated.timing(this.state.basicValue, {
				duration: 300,
				toValue: this.state.basicActive ? 0 : 1,
			}).start();
			this.setState({ basicActive: !this.state.basicActive });
		} else if (type === 'car') {
			Animated.timing(this.state.carValue, {
				duration: 300,
				toValue: this.state.carActive ? 0 : 1,
			}).start();
			this.setState({ carActive: !this.state.carActive });
		} else if (type === 'auth') {
			Animated.timing(this.state.authValue, {
				duration: 300,
				toValue: this.state.authActive ? 0 : 1,
			}).start();
			this.setState({ authActive: !this.state.authActive });
		} else if (type === 'gauth') {
			Animated.timing(this.state.gauthValue, {
				duration: 300,
				toValue: this.state.gauthActive ? 0 : 1,
			}).start();
			this.setState({ gauthActive: !this.state.gauthActive });
		}
	}

	componentDidMount(){
		super.componentDidMount();
		// FIXME 根据车辆 ID 获取车辆详情病展示
		// console.log('lqq--carId',this.carId);
		this._getCarInfo();
	}

	_getCarInfo(){
		this.props.getCarInfo({
			carId: this.carId
		},this.props.router);
	}

	_showExlargeImage(url){
		if(url){
			let temp = [];
			temp.push(url);
			this.setState({
				shouldShow: true,
				imagePathes: temp,
			})
		}
		
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar  
	    router={ navigation }/>
	  };
	};

	render () {
		const textStyle = { color: '#6d6d6d' };
		// console.log('lqq--image----url',HelperUtil.getFullImgPath( this.props.car.get('carImageUrl')));
		// console.log('--carDetail--car-',this.props.car);
		let hiddenHeight = 308;
		if(this.props.car.get('carType') === 2 || this.props.car.get('carType') === 4 ){
			hiddenHeight = 352;
		}
		let hiddenPicHeight = 642;
		if(this.props.car.get('carType') === 2 || this.props.car.get('carType') === 4){
			hiddenPicHeight = 1070;
		}
		const carUrl = HelperUtil.getFullImgPath(this.props.car.get('carImageUrl'));

		// console.log('lqq--carUrl--',carUrl);
		return (
			<View style={ styles.container }>
				<ScrollView
					showsVerticalScrollIndicator={ false }>
					<View style={ styles.blockContainer }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ this._startAnimated.bind(this, 'basic') }
							style={ styles.cellTipContainer }>
							<View style={ styles.speLeft }>
								<Text style={ styles.tipText }>基本信息</Text>
							</View>
							<View style={ styles.speRight }>
								<Animated.Text
									style={ [styles.iconFont, {
										transform: [
											{ rotate: this.state.basicValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe616;</Animated.Text>
							</View>
						</TouchableOpacity>
						<Animated.View
							style={ [styles.hiddenContainer, {
								height: this.state.basicValue.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 132]
								})
							}] }>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车主姓名</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ this.props.car && this.props.car.get('carName') }</Text>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车主手机号</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ this.props.car && this.props.car.get('phoneNumber') }</Text>
								</View>
							</View>
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>运营许可证号</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ this.props.car && this.props.car.get('transportationLicense') }</Text>
								</View>
							</View>
						</Animated.View>
					</View>

					<View style={ styles.blockContainer }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ this._startAnimated.bind(this, 'car') }					
							style={ styles.cellTipContainer }>
							<View style={ styles.speLeft }>
								<Text style={ styles.tipText }>车辆信息</Text>
							</View>
							<View style={ styles.speRight }>
								<Animated.Text
									style={ [styles.iconFont, {
										transform: [
											{ rotate: this.state.carValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe616;</Animated.Text>
							</View>
						</TouchableOpacity>
						<Animated.View
							style={ [styles.hiddenContainer, {
								height: this.state.carValue.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 264]
								})
							}] }>					
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车牌号</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ this.props.car && this.props.car.get('carNo') }	</Text>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车辆类别</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ HelperUtil.getCarCategory(this.props.car.get('carCategory')) }</Text>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车辆类型</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ HelperUtil.getCarType(this.props.car.get('carType')) }</Text>
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>最大载重</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ this.props.car && this.props.car.get('loadSize') }</Text>
									<Text style={ styles.hiddenTextCube }>吨</Text>	
								</View>
							</View>
							<View style={ styles.hiddenCellContainer }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>最大体积</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ this.props.car && this.props.car.get('volumeSize') }</Text>
									<Text style={ styles.hiddenTextCube }>方</Text>		
								</View>
							</View>
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }]}>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>车辆长度</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.hiddenTextCube, textStyle] }>{ HelperUtil.getCarLength(this.props.car.get('carLength')) }</Text>
								</View>
							</View>
							{
								false && 
							<View style={ [styles.hiddenCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.hiddenLeft }>
									<Text style={ styles.hiddenText }>强制报废期止</Text>
								</View>
								<View style={ styles.hiddenRight }>
									<Text style={ [styles.rightText, textStyle] }>{ this.props.car && HelperUtil.getFormatDate(this.props.car.get('scrapDate')) }</Text>
								</View>
							</View>
						}
						</Animated.View>
					</View>

					<View style={ styles.blockContainer }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ this._startAnimated.bind(this, 'auth') }					
							style={ styles.cellTipContainer }>
							<View style={ styles.speLeft }>
								<Text style={ styles.tipText }>认证资料</Text>
							</View>
							<View style={ styles.speRight }>
								<Animated.Text
									style={ [styles.iconFont, {
										transform: [
											{ rotate: this.state.authValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe616;</Animated.Text>
							</View>
						</TouchableOpacity>
						<Animated.View
							style={ [styles.hiddenContainer, {
								height: this.state.authValue.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 642]
								})
							}] }>					
							<View style={ styles.imgCellContainer }>
								<View style={ styles.imgLeftContainer }>
									<Text style={ styles.hiddenText }>车辆图片</Text>
								</View>
								<TouchableOpacity 
									style={ styles.imgBContainer }
									onPress={()=>{
									const url = HelperUtil.getFullImgPath(this.props.car.get('carImageUrl'));
									this._showExlargeImage(url);
								}}>
								<View >
									<Image style={ styles.imgBottom } source={{ uri: HelperUtil.getFullImgPath( this.props.car.get('carImageUrl')) }}/>
								</View>
								</TouchableOpacity>
							</View>
							<View style={ styles.imgCellContainer }>
								<View style={ styles.imgLeftContainer }>
									<Text style={ styles.hiddenText }>行驶证图片</Text>
								</View>
								<TouchableOpacity style={ styles.imgBContainer } onPress={()=>{
									const url = HelperUtil.getFullImgPath(this.props.car.get('drivingLicenseUrl'));
									this._showExlargeImage(url);
								}}>
								<View>
									<Image style={ styles.imgBottom } source={ {uri: HelperUtil.getFullImgPath(this.props.car.get('drivingLicenseUrl')) }}/>
								</View>	
								</TouchableOpacity>						
							</View>
							<View style={ [styles.imgCellContainer, { borderBottomWidth: 0 }] }>
								<View style={ styles.imgLeftContainer }>
									<Text style={ styles.hiddenText }>营运证图片</Text>
								</View>
								<TouchableOpacity style={ styles.imgBContainer } onPress={()=>{
									const url = HelperUtil.getFullImgPath(this.props.car.get('operateLicenseUrl'));
									this._showExlargeImage(url);
								}}>
								<View>
									<Image style={ styles.imgBottom } source={{ uri: HelperUtil.getFullImgPath(this.props.car.get('operateLicenseUrl')) }}/>
								</View>
								</TouchableOpacity>
							</View>
						</Animated.View>
					</View>
					{
						(this.props.car.get('carType') === 2 || this.props.car.get('carType') === 4) &&
						<View style={ [styles.blockContainer, { marginBottom: 20 }] }>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ this._startAnimated.bind(this, 'gauth') }					
								style={ styles.cellTipContainer }>
								<View style={ styles.speLeft }>
									<Text style={ styles.tipText }>挂车认证资料</Text>
								</View>
								<View style={ styles.speRight }>
									<Animated.Text
										style={ [styles.iconFont, {
											transform: [
												{ rotate: this.state.gauthValue.interpolate({
													inputRange: [0, 1],
													outputRange: ['0deg', '-180deg']
												}) }
											]
										}] }>&#xe616;</Animated.Text>
								</View>
							</TouchableOpacity>
							<Animated.View
								style={ [styles.hiddenContainer, {
									height: this.state.gauthValue.interpolate({
										inputRange: [0, 1],
										outputRange: [0, 472]
									})
								}] }>					
								<View style={ styles.hiddenCellContainer }>
									<View style={ styles.hiddenLeft }>
										<Text style={ styles.hiddenText }>挂车车牌号</Text>
									</View>
									<View style={ styles.hiddenRight }>
										<Text style={ [styles.rightText, textStyle] }>{ this.props.car && this.props.car.get('gcarNo') }	</Text>
									</View>
								</View>
								<View style={ styles.imgCellContainer }>
									<View style={ styles.imgLeftContainer }>
										<Text style={ styles.hiddenText }>挂车行驶证图片</Text>
									</View>
									<TouchableOpacity style={ styles.imgBContainer } onPress={()=>{
										const url = HelperUtil.getFullImgPath(this.props.car.get('gdrivingLicenseUrl'));
										this._showExlargeImage(url);
									}}>
									<View>
										<Image style={ styles.imgBottom } source={ {uri: HelperUtil.getFullImgPath(this.props.car.get('gdrivingLicenseUrl')) }}/>
									</View>	
									</TouchableOpacity>						
								</View>
								<View style={ styles.imgCellContainer }>
									<View style={ styles.imgLeftContainer }>
										<Text style={ styles.hiddenText }>挂车营运证图片</Text>
									</View>
									<TouchableOpacity style={ styles.imgBContainer } onPress={()=>{
										const url = HelperUtil.getFullImgPath(this.props.car.get('goperateLicenseUrl'));
										this._showExlargeImage(url);
									}}>
									<View>
										<Image style={ styles.imgBottom } source={ {uri: HelperUtil.getFullImgPath(this.props.car.get('goperateLicenseUrl')) }}/>
									</View>	
									</TouchableOpacity>						
								</View>
							</Animated.View>
						</View>
				}
				</ScrollView>
				<ImagePreview
					activeIndex={0}
					imagePathes={this.state.imagePathes}
					show={this.state.shouldShow}
					hide={()=>{
						this.setState({
							shouldShow: false
						})
					}}/>
					{ this._renderUpgrade(this.props) }	
			</View>
		);
	}
}
const mapStateToProps = state => {
	const { app, car } = state;
	return {
		user: app.get('user'),
		car: car.getIn(['car','carDetail']),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getCarInfo:(body, router) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: GET_CAR_INFO,
				success: (data) => {
					// console.log('lqq---carInfo--',data);
					dispatch(dispatchGetCarInfo({data}));
				}
			}));
		}
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(CarDetailContainer);
