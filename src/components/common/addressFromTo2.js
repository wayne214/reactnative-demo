
import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text
} from 'react-native';
import addressFromPoint from '../../../assets/img/order/from_point.png'
import addressToPoint from '../../../assets/img/order/to_point.png'
import * as COLOR from '../../constants/colors'

class AddressFromTo2 extends Component {
	constructor(props) {
		super(props);
	}
	render(){
		return (
			<View style={styles.addressInfo}>
				<View style={[styles.addressInfoItem,{marginBottom: 5}]}>
					<View style={styles.itemIcon}>
						<Image source={addressFromPoint} style={{width: 20,height: 25}}/>
					</View>
					<View style={styles.itemContent}>
						<Text style={styles.addressText}>{this.props.from}</Text>
						<Text style={styles.markText}>起始地</Text>
					</View>
				</View>
				<View style={styles.addressInfoItem}>
					<View style={styles.itemIcon}>
						<Image source={addressToPoint} style={{width: 20,height: 25}}/>
					</View>
					<View style={styles.itemContent}>
						<Text style={styles.addressText}>{this.props.to}</Text>
						<Text style={styles.markText}>目的地</Text>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	addressInfo: {
		// height: 77,
		marginBottom: 10,
	},
	addressInfoItem: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row'
	},
	itemIcon: {
		width: 25,
		height: 38,
		marginRight: 5,
	},
	itemContent: {
		marginRight: 20
	},
	addressText: {
		color: COLOR.TEXT_BLACK,
		fontSize: 15,
		marginBottom: 3,
		fontWeight: 'bold'
	},
	markText: {
		color: COLOR.TEXT_LIGHT,
		fontSize: 12
	},
})

export default AddressFromTo2