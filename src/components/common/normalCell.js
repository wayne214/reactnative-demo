'use strict'

import React, { Component } from 'react';
import {
	View,
	Image,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import * as COLOR from '../../constants/colors'
import addressToPoint from '../../../assets/img/order/to_point.png'

class NormalCell extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	  itemClick: PropTypes.func,
	  title: PropTypes.string,
	  subTitle: PropTypes.string,
	  hideArrow: PropTypes.bool,
	  titleStyleStyle: Text.propTypes.style,
	  subTitleTextStyle: Text.propTypes.style
	};
	componentDidMount(){

	}

	render() {
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={()=>{
				if (this.props.itemClick) {this.props.itemClick()};
			}}>
				<View style={[styles.container,{...this.props.style}]}>
					<View style={styles.titleView}>
						<Text style={[styles.titleText,{...this.props.titleStyleStyle}]}>{this.props.title}</Text>
					</View>
					<View style={styles.subTitleView}>
						<View>
							<Text style={[styles.subTitleText,{...this.props.subTitleTextStyle}]}>{this.props.subTitle}</Text>
						</View>
						{
							!this.props.hideArrow ?
								<View>
									<Text style={{fontFamily: 'iconfont',color: COLOR.GRAY_ICON}}>&#xe60d;</Text>
								</View>
							: null
						}
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
		flexDirection: 'row',
		height: 44,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft:10,
		paddingRight: 10
	},
	titleView:{

	},
	titleText: {
		fontSize: 14,
		color: COLOR.TEXT_BLACK
	},
	subTitleView: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	subTitleText:{
		fontSize: 14,
		color: COLOR.TEXT_LIGHT
	}
})

export default NormalCell