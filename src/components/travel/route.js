import React from 'react';
import {
	View,
	Image,
	Text,
	Alert,
	Animated,
	TouchableOpacity,
	ImageBackground
} from 'react-native';
import moment from 'moment';
import Button from '../common/button';
import styles from '../../../assets/css/home';
import CarBanBg from '../../../assets/img/car/car_ban_icon.png';
import * as RouteType from '../../constants/routeType';
import { changeTab } from '../../action/app';
import { refreshTravel } from '../../action/app';

export default class Route extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			payOrderActive: false,
			waitDispatchActive: false,
			distanceActive: false,
			arriveActive: false,
			completeActive: false,
			confirmActive: false,
			travelActive: false,
			arriveValue: new Animated.Value(0),
			distanceValue: new Animated.Value(0),
			payOrderValue: new Animated.Value(0),
			waitDispatchValue: new Animated.Value(0),
			completeValue: new Animated.Value(0),
			confirmValue: new Animated.Value(0),
			travelValue: new Animated.Value(0)
		};
		this._uploadImages = this._uploadImages.bind(this);
		this._confirmReceive = this._confirmReceive.bind(this);
	}

	_startAnimated (type) {
		if (type === 'arrive') {
			Animated.timing(this.state.arriveValue, {
				duration: 300,
				toValue: this.state.arriveActive ? 0 : 1,
			}).start();
			this.setState({ arriveActive: !this.state.arriveActive });
		} else if (type === 'pay') {
			Animated.timing(this.state.payOrderValue, {
				duration: 300,
				toValue: this.state.payOrderActive ? 0 : 1,
			}).start();
			this.setState({ payOrderActive: !this.state.payOrderActive });
		} else if (type === 'wait') {
			Animated.timing(this.state.waitDispatchValue, {
				duration: 300,
				toValue: this.state.waitDispatchActive ? 0 : 1,
			}).start();
			this.setState({ waitDispatchActive: !this.state.waitDispatchActive });
		} else if (type === 'distance') {
			Animated.timing(this.state.distanceValue, {
				duration: 300,
				toValue: this.state.distanceActive ? 0 : 1,
			}).start();
			this.setState({ distanceActive: !this.state.distanceActive });
		} else if (type === 'complete') {
			Animated.timing(this.state.completeValue, {
				duration: 300,
				toValue: this.state.completeActive ? 0 : 1,
			}).start();
			this.setState({ completeActive: !this.state.completeActive });
		} else if (type === 'confirm') {
			Animated.timing(this.state.confirmValue, {
				duration: 300,
				toValue: this.state.confirmActive ? 0 : 1,
			}).start();
			this.setState({ confirmActive: !this.state.confirmActive });
		} else if (type === 'travel') {
			Animated.timing(this.state.travelValue, {
				duration: 300,
				toValue: this.state.travelActive ? 0 : 1,
			}).start();
			this.setState({ travelActive: !this.state.travelActive });
		}
	}

	_confirmReceive() {
		Alert.alert('提示', '确认装货吗', [
			{ text: '取消', onPress: () => console.log('') },
			{ text: '确定', onPress: () => this.props.confirmShipment() },
		]);
	}

	_uploadImages() {
		const { router, travelDetail } = this.props;
		Alert.alert('', '确认上传吗', [
			{ text: '取消', onPress: () => console.log('') },
			{ text: '上传回执单', onPress: () => {
				router.push(RouteType.ROUTE_UPLOAD_IMAGES, { orderNo: travelDetail.orderNo, uploadType: 'UPLOAD_BILL_BACK_IMAGE', entrustType: travelDetail.entrustType })
			} },
		]);
	}

	render () {
		const { travelDetail } = this.props;
		if (!travelDetail) return null;

		let orderStatus = travelDetail.orderState;

		let addressCell = null;
		let addressCellTop = null;
		let uploadText = null;
		let confirmViewWidth = 0;
		if (travelDetail.addressList) {
			confirmViewWidth = travelDetail.addressList.length * 20;
			addressCellTop = addressCell = travelDetail.addressList.map((item, index) => {
				return (
					<View style={ [styles.cellContainer, index === 0 ? { marginTop: 0 } : { marginTop: 0 }] } key={ index }>
						<Text style={ styles.titleText }>待装货地点：</Text>
						<Text style={ [styles.addressText, { flex: 1 }] }>{ (item.fromProvinceName ? item.fromProvinceName : '') + (item.fromCityName ? item.fromCityName : '') + (item.fromAreaName ? item.fromAreaName : '') + (item.fromAddress ? item.fromAddress : '') }</Text>
					</View>
				);
			});
		} else {
			addressCellTop = null;
			confirmViewWidth = 40;
			if (orderStatus === 1) {
				addressCell = (<Text style={ [styles.titleText, { marginLeft: 10 }] }>等待委托方上传装货清单</Text>);
			} else if (orderStatus === 2) {
				addressCell = (<Text style={ [styles.titleText, { marginLeft: 10 }] }>请尽快上传出库单，以免耽误您的运输行程</Text>);
			} else if (orderStatus === 3) {
				addressCell = (<Text style={ [styles.titleText, { marginLeft: 10 }] }>请尽快确认装货，运输旅途即将开始</Text>);
			} else {
				addressCell = (<Text style={ [styles.titleText, { marginLeft: 10 }] }>您的货物已发出</Text>);
			}
		}

		if (orderStatus === 5) {
			uploadText = (<Text style={ styles.payOrderText }>等待交付，
					<Text style={ styles.payOrderText }>上传环境照片</Text></Text>);
		} else if (orderStatus < 5) {
			uploadText = (<Text style={ styles.payOrderText }>暂无</Text>);
		} else {
			if (travelDetail.entrustType === 1) {
				uploadText = (<Text style={ styles.payOrderText }>已交付</Text>);
			} else {
				if (orderStatus === 8) {
					uploadText = (<Text style={ styles.payOrderText }>协调中</Text>);
				} else {
					uploadText = (<Text style={ styles.payOrderText }>待上传回执单</Text>);
				}
			}
		}
		// const address = travelDetail.addressList[0];
		// if (!address) return null;


		let stepThreeText;
		let stepThreeView;
		let stepThreeNum;
		let stepFourText;
		let stepFourNum;
		let stepFourView;

		let stepFiveText;
		let stepFiveNum;
		let stepFiveView;

		let stepSixText;
		let stepSixNum;
		let stepSixView;

		let confirmBtn;
		let confirmBtnText;
		let uploadBtn;
		let uploadBtnText;

		let confirmBtnDisable;
		let uploadBtnDisable;
		if (orderStatus === 1
				|| orderStatus === 2
					|| orderStatus === 3
						|| orderStatus === 4) {
			// 等待装货
			stepThreeNum = { color: 'white' };
			stepThreeText = { color: '#17a9df' };
			stepThreeView = { backgroundColor: '#17a9df' };
			stepFourText = stepFourNum = stepFourView = stepFiveText = stepFiveNum = stepFiveView = {};

			stepFourNum = { color: '#ccc' };
			stepFourText = { color: '#ccc' };
			stepFiveNum = { color: '#ccc' };
			stepFiveText = { color: '#ccc' };

			stepSixText = { color: '#ccc' };
			stepSixNum = { color: '#ccc' };
			stepSixView = {};

			confirmBtn = styles.btnOpt;
			confirmBtnText = styles.btnText;
			uploadBtn = styles.btnOptDis;
			uploadBtnText = styles.btnTextDis;

			confirmBtnDisable = false;
			uploadBtnDisable = true;
		} else if (orderStatus === 5) {
			stepFourNum = { color: 'white' };
			stepFourText = { color: '#17a9df' };

			stepThreeNum = {  };
			stepThreeText = {  };

			stepFourView = { backgroundColor: '#17a9df' };
			stepThreeView = stepFiveText = stepFiveNum = stepFiveView = {};
			stepFiveNum = { color: 'white' };
			stepFiveText = { color: '#17a9df' };
			stepFiveView = { backgroundColor: '#17a9df' };

			stepSixText = { color: '#ccc' };
			stepSixNum = { color: '#ccc' };
			stepSixView = {};

			confirmBtn = styles.btnOptDis;
			confirmBtnText = styles.btnTextDis;
			uploadBtn = styles.btnOptDis;
			uploadBtnText = styles.btnTextDis;

			confirmBtnDisable = true;
			uploadBtnDisable = true;
			// 运输中
		}
		if (travelDetail.entrustType === 1) {
			// 到达目的地等待交付收货方
			if (orderStatus >= 6) {
				stepSixText = { color: '#17a9df' };
				stepSixNum = { color: 'white' };
				stepSixView = { backgroundColor: '#17a9df' };
				confirmBtn = styles.btnOptDis;
				confirmBtnText = styles.btnTextDis;
				uploadBtn = styles.btnOpt;
				uploadBtnText = styles.btnText;

				confirmBtnDisable = true;
				uploadBtnDisable = false;
			} else if (orderStatus > 7) {
				stepThreeNum = { color: '#ccc' };
				stepThreeText = { color: '#ccc' };
				stepFourNum = { color: '#ccc' };
				stepFourText = { color: '#ccc' };
				stepFiveNum = { color: 'white' };
				stepFiveText = { color: '#ccc' };
				stepFiveView = { backgroundColor: '#17a9df' };

				confirmBtn = styles.btnOptDis;
				confirmBtnText = styles.btnTextDis;
				uploadBtn = styles.btnOptDis;
				uploadBtnText = styles.btnTextDis;

				confirmBtnDisable = true;
				uploadBtnDisable = true;
			}
		} else if (travelDetail.entrustType === 2) {
			// 撮合订单
			if (orderStatus === 6) {
				stepFourNum = { color: 'white' };
				stepFourText = { color: '#17a9df' };

				stepThreeNum = {  };
				stepThreeText = {  };

				stepFourView = { backgroundColor: '#17a9df' };
				stepThreeView = stepFiveText = stepFiveNum = stepFiveView = {};
				stepFiveNum = { color: 'white' };
				stepFiveText = { color: '#17a9df' };
				stepFiveView = { backgroundColor: '#17a9df' };

				stepSixText = { color: '#ccc' };
				stepSixNum = { color: '#ccc' };
				stepSixView = {};

				confirmBtn = styles.btnOptDis;
				confirmBtnText = styles.btnTextDis;
				uploadBtn = styles.btnOptDis;
				uploadBtnText = styles.btnTextDis;

				confirmBtnDisable = true;
				uploadBtnDisable = true;
			} else if (orderStatus === 8 || orderStatus === 9) {
			  // 协调中
				stepFourNum = {  };
				stepFourText = {  };

				stepThreeNum = {  };
				stepThreeText = {  };

				stepFourView = {  };
				stepThreeView = stepFiveText = stepFiveNum = stepFiveView = {};
				stepFiveNum = { color: 'white' };
				stepFiveText = { color: '#17a9df' };
				stepFiveView = { backgroundColor: '#17a9df' };

				stepSixText = { color: '#ccc' };
				stepSixNum = { color: '#ccc' };
				stepSixView = {};

				confirmBtn = styles.btnOptDis;
				confirmBtnText = styles.btnTextDis;
				uploadBtn = styles.btnOptDis;
				uploadBtnText = styles.btnTextDis;

				confirmBtnDisable = true;
				uploadBtnDisable = true;
			} else if (orderStatus > 9) {
				stepSixText = { color: '#17a9df' };
				stepSixNum = { color: 'white' };
				stepSixView = { backgroundColor: '#17a9df' };
				confirmBtn = styles.btnOptDis;
				confirmBtnText = styles.btnTextDis;
				uploadBtn = styles.btnOpt;
				uploadBtnText = styles.btnText;

				confirmBtnDisable = true;
				uploadBtnDisable = false;
			}
		}

		return (
			<View style={ styles.bottomView }>
				<View style={ styles.destinationStyle }>
					<View style={ styles.carBanContainer }>
						<ImageBackground style={ [styles.carBanStyle, { padding: 3 }] } source={ CarBanBg }>
							<Text style={ [styles.carBanText, { color: '#ffac1b' }] }>{ travelDetail.goodsType === 1 ? '干线' : '卡班' }</Text>
						</ImageBackground>
					</View>
					{
						travelDetail.goodsType === 1 &&
							<View style={ [styles.cellContainer, { marginTop: 0, backgroundColor: 'white', marginBottom: travelDetail.goodsType === 1 ? 0 : 5 }] }>
								<Text style={ styles.titleText }>发车时间：</Text>
								<Text style={ [styles.contentText, { paddingLeft: 4, color: '#17a9df' }] }>{ travelDetail.loadingStartDate ? travelDetail.loadingStartDate : '无' }</Text>
							</View>
					}
					{
						travelDetail.goodsType !== 1 &&
							<View style={ [styles.cellContainer, { marginTop: 0, backgroundColor: 'white', marginBottom: travelDetail.goodsType === 1 ? 0 : 5 }] }>
								<Text style={ styles.titleText }>发车时间：</Text>
								<Text style={ [styles.contentText, { paddingLeft: 4, color: '#17a9df' }] }>{ moment(travelDetail.startDate).format('YYYY-MM-DD') + ' ' }{ travelDetail.startTimeHourMin + ':' + travelDetail.startTimeMinuteMin }</Text>
							</View>
					}
					{
						travelDetail.goodsType === 1 &&
							<View style={ [styles.cellContainer, { marginBottom: travelDetail.goodsType === 1 ? 5 : 0 }] }>
								<Text style={ styles.titleText }>到达时间：</Text>
								<View style={ [styles.destinationBg, { backgroundColor: 'white' }] }>
									<Text style={ [styles.contentText, { color: '#ffac1b', paddingLeft: 4, paddingRight: 4 }] }>{ travelDetail.arrivalStartDate ? travelDetail.arrivalStartDate : '无' }</Text>
								</View>
							</View>
					}
					{ addressCellTop }
					{
						travelDetail.entrustType * 1 === 1 &&
							<View style={ styles.line }></View>
					}
					{
						travelDetail.entrustType * 1 === 1 &&
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => this.props.router.push(RouteType.ROUTE_CONTRACT_DETAIL, {
															orderNo: travelDetail.orderNo,
															contractNo: travelDetail.contractNo
														})}
								style={ styles.optContainer }>
								<View style={ styles.textContainer }>
									<Text style={ [styles.addressText, { marginLeft: 10 }] }>查看合同</Text>
								</View>
								<View style={ styles.arrowContainer }>
									<Text style={ [styles.arrow, { marginRight: 22 }] }>&#xe60d;</Text>
								</View>
							</TouchableOpacity>
					}

				</View>

				<View style={ styles.animatedContainer }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ this._startAnimated.bind(this, 'pay') }
						style={ styles.processContainer }>
						<View style={ styles.processLeftContainer }>
							<View style={ styles.numBg }>
								<Text style={ [styles.addressText] }>1</Text>
							</View>
							<Text style={ [styles.textAlready, { marginLeft: 10 }] }>订单信息</Text>
						</View>
						<View style={ styles.arrowContainer }>
							<View style={ styles.rightContainer }>
								<Button
									title='查看订单'
									style={ styles.btnOpt }
									textStyle={ styles.btnText }
									onPress={ () => this.props.router.push(RouteType.ROUTE_ORDER_DETAIL, { orderNo: travelDetail.orderNo }) }/>
								<Animated.Text
									style={ [styles.arrow, {
										transform: [
											{ rotate: this.state.payOrderValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe60e;</Animated.Text>
							</View>
						</View>
					</TouchableOpacity>
					<Animated.View
						style={ [styles.payOrderSelect, {
							height: this.state.payOrderValue.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 60]
							})
						}] }>
						<Text style={ styles.payOrderText }>订单合同已确认签署，请按订单委托要求合理安排运输</Text>
					</Animated.View>
				</View>

				<View style={ styles.animatedContainer }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ this._startAnimated.bind(this, 'wait') }
						style={ styles.processContainer }>
						<View style={ styles.processLeftContainer }>
							<View style={ [styles.numBg] }>
								<Text style={ [styles.addressText] }>2</Text>
							</View>
							<Text style={ [styles.textAlready, { marginLeft: 10 }] }>车辆调度</Text>
						</View>
						<View style={ styles.arrowContainer }>
							<View style={ styles.rightContainer }>
								<Animated.Text
									style={ [styles.arrow, {
										transform: [
											{ rotate: this.state.waitDispatchValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe60e;</Animated.Text>
							</View>
						</View>
					</TouchableOpacity>
					<Animated.View
						style={ [styles.payOrderSelect, {
							height: this.state.waitDispatchValue.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 60]
							})
						}] }>
						<Text style={ styles.payOrderText }>您的订单<Text style={ styles.payOrderTime }>{ travelDetail.orderNo }</Text>已由车辆<Text style={ styles.payOrderTime }>{ travelDetail.carNo }</Text>进行运输。</Text>
					</Animated.View>
				</View>

				<View style={ styles.animatedContainer }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ this._startAnimated.bind(this, 'confirm') }
						style={ styles.processContainer }>
						<View style={ styles.processLeftContainer }>
							<View style={ [styles.numBg, stepThreeView] }>
								<Text style={ [styles.addressText, stepThreeNum] }>3</Text>
							</View>
							<Text style={ [styles.textAlready, { marginLeft: 10 }, stepThreeText] }>等待装货</Text>
						</View>
						<View style={ styles.arrowContainer }>
							<View style={ styles.rightContainer }>
								{
									(orderStatus === 2 || orderStatus === 1) &&
										<Button
											title='上传出库单'
											style={ styles.btnOpt }
											textStyle={ styles.btnText }
											onPress={ () => this.props.router.push(RouteType.ROUTE_UPLOAD_IMAGES, { orderNo: travelDetail.orderNo, uploadType: 'UPLOAD_BILL_OUT_IMAGE', entrustType: travelDetail.entrustType }) }/>
								}
								{
									orderStatus === 3 &&
										<Button
											title='装货确认'
											style={ styles.btnOpt }
											textStyle={ styles.btnText }
											onPress={ this._confirmReceive }/>
								}
								<Animated.Text
									style={ [styles.arrow, {
										transform: [
											{ rotate: this.state.confirmValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe60e;</Animated.Text>
							</View>
						</View>
					</TouchableOpacity>
					<Animated.View
						style={ [styles.payOrderSelect, {
							height: this.state.confirmValue.interpolate({
								inputRange: [0, 1],
								outputRange: [0, confirmViewWidth]
							})
						}] }>
						{ addressCell }
					</Animated.View>
				</View>

				<View style={ styles.animatedContainer }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ this._startAnimated.bind(this, 'distance') }
						style={ styles.processContainer }>
						<View style={ styles.processLeftContainer }>
							<View style={ [styles.numBg, stepFourView] }>
								<Text style={ [styles.addressText, stepFourNum] }>4</Text>
							</View>
							<Text style={ [styles.textAlready, { marginLeft: 10 }, stepFourText] }>货物运输中</Text>
						</View>
						<View style={ styles.arrowContainer }>
							<View style={ styles.rightContainer }>
								<Animated.Text
									style={ [styles.arrow, {
										transform: [
											{ rotate: this.state.distanceValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe60e;</Animated.Text>
							</View>
						</View>
					</TouchableOpacity>
					<Animated.View
						style={ [styles.payOrderSelect, {
							height: this.state.distanceValue.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 40]
							})
						}] }>
						<Text style={ styles.payOrderText }>{ (orderStatus !== 8 && orderStatus !== 9) ? '当前车辆正常运输行驶中' : '货物已到达' }</Text>
					</Animated.View>
				</View>

				<View style={ styles.animatedContainer }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ this._startAnimated.bind(this, 'arrive') }
						style={ styles.processContainer }>
						<View style={ styles.processLeftContainer }>
							<View style={ [styles.numBg, stepFiveView] }>
								<Text style={ [styles.addressText, stepFiveNum] }>5</Text>
							</View>
							<Text style={ [styles.textAlready, { marginLeft: 10 }, stepFiveText] }>已到达等待交付收货方</Text>
						</View>
						<View style={ styles.arrowContainer }>
							<View style={ styles.rightContainer }>
								{
									orderStatus === 5 &&
										<Button
											title='拍照上传'
											style={ styles.btnOpt }
											textStyle={ styles.btnText }
											onPress={ () => this.props.router.push(RouteType.ROUTE_UPLOAD_IMAGES, { orderNo: travelDetail.orderNo, uploadType: 'UPLOAD_ENVIRONMENT_IMAGES', entrustType: travelDetail.entrustType }) }/>
								}
								{
									(travelDetail.entrustType === 2 && orderStatus === 6 || orderStatus === 9 && travelDetail.entrustType === 2) &&
										<Button
											title='确认交付'
											style={ styles.btnOpt }
											textStyle={ styles.btnText }
											onPress={ this._uploadImages } />
								}
								<Animated.Text
									style={ [styles.arrow, {
										transform: [
											{ rotate: this.state.arriveValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe60e;</Animated.Text>
							</View>
						</View>
					</TouchableOpacity>
					<Animated.View
						style={ [styles.payOrderSelect, {
							height: this.state.arriveValue.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 40]
							})
						}] }>
						{ uploadText }

					</Animated.View>
				</View>

				<View style={ styles.animatedContainer }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ this._startAnimated.bind(this, 'travel') }
						style={ styles.processContainer }>
						<View style={ styles.processLeftContainer }>
							<View style={ [styles.numBg, stepSixView] }>
								<Text style={ [styles.addressText, stepSixNum] }>6</Text>
							</View>
							<Text style={ [styles.textAlready, { marginLeft: 10 }, stepSixText] }>行程结束</Text>
						</View>
						<View style={ styles.arrowContainer }>
							<View style={ styles.rightContainer }>
								{
									orderStatus >= 6 &&
										<Button
											title='订单'
											style={ styles.btnOpt }
											textStyle={ styles.btnText }
											onPress={ () => this.props.dispatch(changeTab('order')) }/>
								}
								<Animated.Text
									style={ [styles.arrow, {
										transform: [
											{ rotate: this.state.travelValue.interpolate({
												inputRange: [0, 1],
												outputRange: ['0deg', '-180deg']
											}) }
										]
									}] }>&#xe60e;</Animated.Text>
							</View>
						</View>
					</TouchableOpacity>
					<Animated.View
						style={ [styles.payOrderSelect, {
							height: this.state.travelValue.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 60]
							})
						}] }>
						<Text style={ styles.payOrderText }>您本次行程已经圆满完成，结算及其他操作请在【订单】中完成</Text>
					</Animated.View>
				</View>

			</View>
		);
	}
}
