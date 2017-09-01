import React from 'react';
import { connect } from 'react-redux';
import { 
	View, 
	Image, 
	Text,
	Animated,
	NativeModules,
	InteractionManager,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { height, width } from '../../constants/dimen';
// import LoginContainer from '../user/shipperLogin';
import styles from '../../../assets/css/welcome';
import WelCar from '../../../assets/img/guide/wel_car.png';
import Button from '../../components/common/button';
import Guy from '../../../assets/img/guide/guy.png';
import Storage from '../../utils/storage';
import { getInitStatus } from '../../action/app';
import * as RouteType from '../../constants/routeType'

class WelcomeContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pageOneActive: false,
			pageTwoActive: false,
			pageTowGuyActive: false,
			pageOneAnim: new Animated.Value(0),
			pageTwoAnim: new Animated.Value(0),
			
			
			pageTwoGuyAnim: new Animated.Value(0.1),
		};
		this.pageOneText = new Animated.Value(0);
		this.pageTwoText = new Animated.Value(0);
		this.fadeInTowText = new Animated.Value(0);
		this.fadeInGuy = new Animated.Value(0);
		if (width >= 320) this._marginBottom = 130;
		if (width >= 375) this._marginBottom = 160;
		if (width >= 414) this._marginBottom = 180;
		this._toMain = this._toMain.bind(this);
		this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
	}

	static propTypes = {
		navigator: React.PropTypes.object
	}

	componentDidMount() {
		this.timer = setTimeout(() => {
			this.pageOneText.setValue(0);
	    Animated.timing(
	      this.state.pageOneAnim, {
	        toValue: this.state.pageOneActive ? 0 : 1,
	        duration: 1000,
	      },
	    ).start(() => {
	    	Animated.timing(this.pageOneText, {
	    		toValue: 1,
	    	}).start();
	    });
		}, 500);
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	_onMomentumScrollEnd(e, state, context) {
		Animated.sequence([
	    Animated.timing(
	      this.state.pageTwoAnim, {
	        toValue: this.state.pageTwoActive ? 0 : 1,
	        duration: 1000,
	      },
	    ),
    	Animated.spring(this.state.pageTwoGuyAnim, {
    		toValue: 1,
    		friction: 2,
    	}),
  		Animated.spring(this.pageTwoText, {
    		toValue: 1,
    		// friction: 10,
  		})
		]).start();
	}

	_toMain() {
		// const { navigator } = this.props;
		Storage.save('flag', '1');
		Storage.save('IS_FIRST_FLAG', '1');
		this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN, mode: 'reset', params: { title: '登录' } })
		// NativeModules.NativeModule.inited();
		// this.props.dispatch(getInitStatus());
		// InteractionManager.runAfterInteractions(() => {
		// 	navigator.resetTo({
		// 		component: LoginContainer,
		// 		name: 'login',
		// 	});
		// });
	}

	render() {
		return (
			<Swiper style={ styles.wrapper } showsButtons={ false }
				height={ height } loop={ false }
				showsPagination={ false }
				onMomentumScrollEnd={ this._onMomentumScrollEnd }>
				<View style={ styles.slide }>
					<Image style={ styles.image } source={ require('../../../assets/img/guide/g1.png') } resizeMode={ 'stretch'}>
						<Animated.View style={ [styles.textContainer, {
							opacity: this.pageOneText
						}] }>
							<Text style={ styles.topText }>承路宝 路路通</Text>
							<Text style={ styles.tipText }>您的运输细节我们最关注</Text>
						</Animated.View>
						<Animated.Image
							style={ [styles.carStyle, {
								bottom: this._marginBottom,
								marginLeft: this.state.pageOneAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [-164, width / 2 - 82]
								})
							}] } source={ WelCar } />
					</Image>
				</View>
				<View style={ styles.slide }>
					<Image style={ styles.image } source={ require('../../../assets/img/guide/g2.png') } resizeMode={ 'stretch'}>
						<Animated.View style={ [styles.textContainer, {
							opacity: this.pageTwoText,
							transform: [
								{ scale: this.pageTwoText }
							]
						}] }>
							<Text style={ styles.topText }>关怀</Text>
							<Text style={ styles.tipText }>服务于每一位司机</Text>
						</Animated.View>
						<Animated.Image
							style={ [styles.carStyle, {
								bottom: this._marginBottom,
								marginLeft: this.state.pageTwoAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [-164, width / 2 - 82]
								})
							}] } source={ WelCar } />
						<Animated.Image style={ [styles.guyStyle, {
							left: width / 2 + 42 ,
							bottom: this._marginBottom,
							transform: [
								{ scale: this.state.pageTwoGuyAnim }
							]
						}] } source={ Guy }/>
						<View style={ styles.stepContainer }>
							<Button
								title='立即体验'
								style={ styles.btn }
								onPress={ this._toMain }
								textStyle={ styles.btnText }/>
						</View>
					</Image>
				</View>
			</Swiper>
		);
	}

}

const mapStateToProps = (state) => {
	const { app } = state;
	return {
		guides: app.get('guide'),
		index: app.get('index')
	};
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeContainer);
