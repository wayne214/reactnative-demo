import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	WebView,
} from 'react-native';

import styles from '../../../assets/css/setting';
import NavigatorBar from '../../components/common/navigatorbar';
import { BASE_URL } from '../../constants/setting';
import { REGISTER_PROTOCOL, ABOUT_US, SETTLEMENT_EXPLAIN} from '../../constants/api'; 
import BaseComponent from '../../components/common/baseComponent';

class AgreementContainer extends BaseComponent{

	constructor(props) {
		super(props);
    this.title = props.navigation.state.params.title;
		this.type = props.navigation.state.params.type;
		this.state={
			url: '',
		};
	}
	componentDidMount() {
		super.componentDidMount();
		if(this.type === 1){//来自注册
			this.setState({
				url : BASE_URL + REGISTER_PROTOCOL,
			});
		}else if(this.type === 2){//关于我们
			this.setState({
				url : BASE_URL + ABOUT_US,
			});
		}else if(this.type === 3){//发票说明
			this.setState({
				url : BASE_URL + SETTLEMENT_EXPLAIN,
			});
		}
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};
	render () {
		return (
			<View style = { styles.container }>
				<WebView source={ {uri: this.state.url} }/>
				{ this._renderUpgrade(this.props) }
			</View>

		);
	}
}
const mapStateToProps = (state) => {
	const { app } = state;
	return {
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(AgreementContainer);