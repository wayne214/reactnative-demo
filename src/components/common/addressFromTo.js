import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text
} from 'react-native';

import fromto from '../../../assets/img/routes/fromto.png'
import * as COLOR from '../../constants/colors'

class AddressFromTo extends Component{
	constructor(props) {
		super(props);
	}


	render() {
		return (
			<View style={[styles.container,this.props.style]}>
				<Image source={fromto} style={styles.fromToImage}/>
				<View style={styles.textView}>
					<Text style={styles.fromText}>{this.props.from}</Text>
					<Text style={styles.toText}>{this.props.to}</Text>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
		paddingTop: 7,
		flexDirection: 'row',
		paddingRight: 90
	},
	fromToImage:{
		width: 10,
		height: 41,
		marginTop: 4,
		marginBottom: 4,
		marginLeft: 10,
		marginRight: 13
	},
	textView: {
		justifyContent: 'space-between'
	},
	fromText: {
		fontSize:17,
		fontWeight: 'bold',
		color: COLOR.TEXT_BLACK
	},
	toText: {
		fontSize:17,
		fontWeight: 'bold',
		color: COLOR.TEXT_BLACK
	}
})

export default AddressFromTo