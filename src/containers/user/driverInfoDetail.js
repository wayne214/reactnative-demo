import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Image,
	TextInput,
	NativeModules,
	TouchableOpacity,
	ScrollView,
	Keyboard,
	Dimensions,
} from 'react-native';
import styles from '../../../assets/css/auth';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'
import BaseComponent from '../../components/common/baseComponent';
import { OOS_CONFIG, CAR_DETAIL_INFO } from '../../constants/api';
import * as RouteType from '../../constants/routeType';
import { dispatchGetDriverInfoDetail } from '../../action/driver';
import { fetchData, updateOSSConfig } from '../../action/app';
import { HOST, OSS_ADD_DRIVER } from '../../constants/setting';
import CardIDImg from '../../../assets/img/user/driveID.png';
import CommonImagePicker from '../../components/common/commonImagePicker';
import ExampleImage from '../../../assets/img/auth/driver_license.png';
import HelperUtil from '../../utils/helper';
import ImagePreview from '../../components/common/imagePreview';

const { height,width } = Dimensions.get('window')

class DriverInfoDetailContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
			driverName: '',
			driverLicence: '',
			showPhoto: false,
	  	activeIndex: 0
		};
    this.title = props.navigation.state.params.title;
		this.carrierId = props.navigation.state.params.carrierId;
		this.driverId = props.navigation.state.params.driverId;	
	}

	componentDidMount(){
		super.componentDidMount();
		this.props.getDriverInfo({
			carrierId: this.carrierId,
			driverId: this.driverId,
		})
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
		const { driverInfoDetail } = this.props;
		let number = driverInfoDetail.driverNumber+'';
		let firstNumber = number.substring(0, 1);
		let lastNumber = number.substring(number.length - 1);
		let betweenArr = [];
		for(let i = 0; i < number.length - 2; i++){
			betweenArr.push('*');
		}
		let betweenNumber = betweenArr.join('');
		let driverLicenceNumber = firstNumber + betweenNumber + lastNumber;
		const url = HelperUtil.getFullImgPath(driverInfoDetail.driverLicenseUrl); 
		let imagePathes=[];
		imagePathes.push(url);
		return (
			<View style={ styles.container }>
				<ScrollView style={ styles.container }>
					<View style={ styles.desTextContainer }>
						<Text style={ styles.desText }>司机信息</Text>
					</View>
					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>司机姓名</Text>
						</View>
						<View style={ styles.hiddenRight }>
							<Text style={ styles.rightText }>{driverInfoDetail.driverName}</Text>
						</View>
					</View>

					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>驾驶证号</Text>
						</View>
						<View style={ styles.hiddenRight }>
							<Text style={ styles.rightText }>{ driverLicenceNumber }</Text>
						</View>
					</View>

					<View style={ styles.hiddenCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>联系手机</Text>
						</View>
						<View style={ styles.hiddenRight }>
							<Text style={ styles.rightText }>{ driverInfoDetail.phoneNumber }</Text>
						</View>
					</View>		

					<View style={ styles.IDCellContainer }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>驾驶证照片</Text>
						</View>
					</View>
					<TouchableOpacity 
						style={ [styles.imageContainer, { marginBottom: 10 }] }
						onPress={()=>{this.setState({showPhoto: true, activeIndex: 1})}}>
						<View style={ styles.IDViewStyle }>
							<Image style={ styles.imgView } source={ {uri: url} }/>
						</View>
					</TouchableOpacity>
					<ImagePreview show={this.state.showPhoto} activeIndex={this.state.activeIndex} imagePathes={imagePathes} hide={()=>{
						this.setState({ showPhoto: false })}}/>
				</ScrollView>

				{ this._renderUpgrade(this.props.upgrade) }

			</View>
		);
	}
}

const mapStateToProps = state => {
	const { app, driver} = state;
	return {
		user: app.get('user'),
		upgrade: app.get('upgrade'),
		driverInfoDetail: driver.get('driverInfoDetail'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		getDriverInfo: (body) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: CAR_DETAIL_INFO,
				success: (data) => {
					dispatch(dispatchGetDriverInfoDetail(data));
				}
			}));
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverInfoDetailContainer);
