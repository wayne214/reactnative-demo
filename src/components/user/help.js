import React from 'react';
import {
	View,
	Text,
} from 'react-native';
import styles from '../../../assets/css/route';

export default class Help extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render () {
		return (
			<View style={ styles.cellContainer }>		
				<Text>小明的滴滴姓什么</Text>
			</View>
		);
	}
}
