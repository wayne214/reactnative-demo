import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import styles from '../../../assets/css/eSign';
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import { fetchData } from '../../action/app';
import { GET_ESIGN_IMAGE } from '../../constants/api';
import * as RouteType from '../../constants/routeType';
import md5 from 'md5';
import { HOST, TOKEN } from '../../constants/setting';
import Toast from '../../utils/toast';

class ShowESignImageContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {

		};
		// this.title = props.router.getCurrentRouteTitle();
		this._getESignImage = this._getESignImage.bind(this);
		this._jumpToESignUpdate = this._jumpToESignUpdate.bind(this);

	}

	componentDidMount(){
		super.componentDidMount();
		// this._getESignImage();
	}


	_getESignImage(){
		this.props.getESignImage({

		},this.router);
	}

	_jumpToESignUpdate(){
		const { user } = this.props;
		if(user.certificationStatus === 2){
			this.props.navigation.dispatch({type:RouteType.ROUTE_UPDATE_ESIGN_INFO,params:{title:'电子签章'}});
		}else{
			Toast.show('您暂未认证成功！');
		}
	}
		
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar 
	    router={ navigation }/>
	  };
	};

	render(){
		const { router } = this.props;
		const url = HOST + GET_ESIGN_IMAGE + '?carrierId='+ this.props.user.userId +'&key='+ md5(TOKEN + this.props.user.userId) + '&a=' + Math.random(1) * 10000;
		// console.log('lqq--url--',url);
		return (
			<View style={ styles.container }>
					<ScrollView style={styles.mainContent}>
						<View style={styles.mainView}>

							<TouchableOpacity
								onPress={ () => this._jumpToESignUpdate() }>
								<View style={styles.fristLineView}>
									<View style={styles.leftTextView}>
										<Text style={styles.fristLineLeftText}>{'我的电子签章'}</Text>
									</View>
									<View style={styles.rightView}>
										<View style={styles.fristLineRightTextView}>
											<Text style={styles.fristLineRightText}>{'修改'}</Text>
										</View>
										<View style={styles.arrowRightView}>
											<Text style={ styles.arrowRight }>&#xe60d;</Text>
										</View>
									</View>
								</View>
							</TouchableOpacity>

							<View style={styles.centerImageView}>
								<Image source={{ uri: url }} resizeMode='contain' style={ styles.centerImage }/>
							</View>
							<View style={styles.thirdLineView}>
								<View style={styles.thirdLeftTextView}>
									<Text style={styles.thirdLineLeftText}>{'签章说明'}</Text>
								</View>
								<View style={styles.thirdLineContentTextView}>
									<Text style={styles.thirdLineContentText}>{'冷链马甲是面向全国的冷链物流交易平台，为车源、货源、库源提供交易撮合、物流在线支付、供应链金融、保险服务、冷链物流行情指数发布、冷链知识等服务的综合平台。'}</Text>
								</View>
							</View>
						</View>
					</ScrollView>
			</View>
			);
	}
}
const mapStateToProps = state => {
	const { app ,eSign} = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		isRefresh: eSign.get('isRefresh'),
	}
}


const mapDispatchToProps = dispatch => {
	return {
		getESignImage: (body, router) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: GET_ESIGN_IMAGE,
				showLoading: true,
				success: () => {
					// console.log('lqq---getESignImage--success-->');
				},
				fail: () => {
					// console.log('lqq---getESignImage--fail-->');
				}
			}));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowESignImageContainer);
