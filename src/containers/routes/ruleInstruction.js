'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'


class RuleInstruction extends Component {
	constructor(props) {
	  super(props);
	}
	componentDidMount() {

	}
	static navigationOptions = {
		headerTitle: '市场规则说明'
	}
	render() {
		return <View style={styles.container}>
			<Text style={styles.content}>1、优质货源市场内货源，承运商均可以报价抢单，只可降价抢单，不可加价；抢单后在竞价时间结束后，价格低者优先成单；最低价相同者按照抢单时间优先成单；</Text>
			<Text style={styles.content}>2、普通货源市场内货源，承运商均可以进行抢单，只可加价抢单，不可降价；抢单后货主会在规定的时间内选择承运商进行承运，如果您的报价过高，可能会被拒绝；</Text>
			<Text style={styles.content}>3、针对派单货源，承运商要及时进行接受，若长时间不操作，可能会失效；</Text>
			<Text style={styles.content}>4、自营订单指，冷链马甲平台作为货主进行委托，货源真实，结算迅速；</Text>
			<Text style={styles.content}>5、非自营订单，冷链马甲仅作为三方平台，为货主及承运方提供撮合服务，操作更便捷，同时冷链马甲不承担运输风险。</Text>

		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	content: {
		color: '#666',
		padding: 10,
		paddingLeft:15,
		paddingRight:15,
		lineHeight: 20
	}
})

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleInstruction);

