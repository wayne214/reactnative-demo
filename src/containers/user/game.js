import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	WebView,
	ActivityIndicator
} from 'react-native';
import md5 from 'md5'
import styles from '../../../assets/css/setting';
import NavigatorBar from '../../components/common/navigatorbar';
import { BASE_URL } from '../../constants/setting';
import { GAME_ADDRESS } from '../../constants/api'
import { fetchData } from '../../action/app';
import BaseComponent from '../../components/common/baseComponent';

class GameContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
			loading: false
		}
		this._onLoadEnd = this._onLoadEnd.bind(this)
		this._onLoadStart = this._onLoadStart.bind(this)
	}

	_onLoadStart () {
		this.setState({ loading: true })
	}

	_onLoadEnd () {
		this.setState({ loading: false })
	}

  static navigationOptions = ({ navigation }) => {
    return {
      header: <NavigatorBar
        router={ navigation }/>
    }
  }

	render () {

		return (
			<View style = { styles.container }>

				<WebView
					onLoad={ this._onLoadEnd }
					onError={ this._onLoadEnd }
					onLoadEnd={ this._onLoadEnd }
					onLoadStart={ this._onLoadStart }
					source={{ uri: this.props.url }}/>
					
			</View>

		);
	}
}
const mapStateToProps = (state) => {
	const { app } = state;
	return {
		url: app.get('gameUrl')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);