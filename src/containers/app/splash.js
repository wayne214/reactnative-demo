import React, { Component } from 'react';
import {
	View,
	Image,
	Text,
	Dimensions,
	Platform,
	NativeModules,
	InteractionManager,
} from 'react-native'
import { connect } from 'react-redux'
import Storage from '../../utils/storage'
import SplashScreen from 'react-native-splash-screen'
import { getInitStateFromDB } from '../../action/app'
import { H5_GAME_ADDRESS } from '../../constants/api'

const { width, height } = Dimensions.get('window');

class Splash extends Component {

	constructor(props) {
	  super(props);
	}

	async componentDidMount() {
		this.props.getInitStateFromDB();
		this.timer = setTimeout(() => {
			// SplashScreen.hide()
		}, Platform.OS === 'ios' ? 500 : 2000)
		const value = await Storage.get('IS_FIRST_FLAG')
		if (value && value * 1 === 1) {
			this.routeName = 'Main'
		} else {
			this.routeName = 'Welcome'
		}
		this.timer = setTimeout(() => {
			this.props.navigation.dispatch({ type: this.routeName, mode: 'reset', params: { title: '', currentTab: 'route' } })
		}, Platform.OS === 'ios' ? 100 : 1500);
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	render() {
		return null
	}
}

function mapStateToProps(state) {
	const { app } = state;
	return {};
}

function mapDispatchToProps(dispatch) {
	return {
		getInitStateFromDB: () => dispatch(getInitStateFromDB()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
