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
import { SETTLEMENT_EXPLAIN } from '../../constants/api';
import BaseComponent from '../../components/common/baseComponent';

const url = BASE_URL + SETTLEMENT_EXPLAIN;
class InvoiceExplanationContainer extends BaseComponent {

	constructor(props) {
		super(props);
	}
	static navigationOptions = ({navigation}) => {
		return {
			header: <NavigatorBar router={navigation}/>
		}
	}
	render () {

		return (
			<View style = { styles.container }>
				<WebView source={ {uri: url} }/>
			</View>

		);
	}
}
const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(InvoiceExplanationContainer);