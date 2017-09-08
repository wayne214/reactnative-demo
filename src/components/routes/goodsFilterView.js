'use strict'

import React, { Component, PropTypes } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import * as COLOR from '../../constants/colors'
class GoodsFilterView extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){

	}

	render() {
		const {searchAddressInfo,closeAction} = this.props
		return (
			<View style={styles.container}>
				<View style={styles.textView}>
				{
					(()=>{
						if (searchAddressInfo.addressFrom && searchAddressInfo.addressTo) {
							return (
								<Text style={styles.textContet}>
									{searchAddressInfo.addressFrom + ' '}
									<Text style={styles.fromToIcon}>&#xe636;</Text>
									{' ' + searchAddressInfo.addressTo}
								</Text>
							)
						}else if (searchAddressInfo.addressFrom) {
							return (
								<Text style={styles.textContet}>
									始发地：{searchAddressInfo.addressFrom}
								</Text>
							)
						}else if (searchAddressInfo.addressTo) {
							return (
								<Text style={styles.textContet}>
									目的地：{searchAddressInfo.addressTo}
								</Text>
							)
						}
					})()
				}
				</View>
				<TouchableOpacity style={styles.closeView} activeOpacity={0.8} onPress={()=>{
					closeAction && closeAction()
				}}>
					<View>
						<Text style={styles.closeIcon}>&#xe634;</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flexDirection: 'row',
		backgroundColor: '#efeac6',
		height: 40
	},
	textView:{
		flex: 1,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},
	textContet:{
		color: COLOR.TEXT_BLACK
	},
	fromToIcon:{
		fontFamily: 'iconfont',
		fontSize: 14,
		color: COLOR.TEXT_LIGHT
	},
	closeView:{
		width: 40,
		justifyContent: 'center',
		alignItems:'center'
	},
	closeIcon:{
		fontFamily: 'iconfont',
		fontSize: 20,
		color: COLOR.TEXT_LIGHT
	}
})

export default GoodsFilterView