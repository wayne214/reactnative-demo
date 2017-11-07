import React, { Component } from 'react';
import {
	View,
	StyleSheet
} from 'react-native';

class BetterRoutes extends Component{
	constructor(props) {
		super(props);
	}


	componentDidMount(){

	}

	render() {
		return (
			<View style={styles.container}></View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: 'green'
	}
})

export default BetterRoutes