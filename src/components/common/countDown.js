'use strict';

import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Text
} from 'react-native';
import PropTypes from 'prop-types';
import * as COLOR from '../../constants/colors'
import moment from 'moment';

class CountDown extends Component{
	constructor(props) {
		super(props);
		const nowStamp = Date.now()
		const overTimeStamp = Date.parse(moment(props.overTime, 'YYYY-MM-DD HH:mm:ss').format())
		const seconds = parseInt((overTimeStamp - nowStamp) / 1000)
		if (seconds > 1) {
			const hour = parseInt(seconds / (60*60))
			const minute = parseInt((seconds - parseInt(seconds / (60*60)) * 60 * 60) / 60)
			const second = parseInt(seconds % 60)
			this.state = {
				hour,
				minute,
				second
			}
		}else{
			this.state = {
				hour: 0,
				minute: 0,
				second: 0
			}
		}
		this._handleCountDown = this._handleCountDown.bind(this)

	}

	static propTypes = {
	  // style: PropTypes.style,
	  overTime: PropTypes.string.isRequired,
	  timeItemStyle: View.propTypes.style,
	  endCounttingCallBack: PropTypes.func
	};

	componentDidMount(){
		this._handleCountDown();
	}

	componentWillUnmount(){
		clearInterval(this.interval)
	}

	_handleCountDown(){
		this.interval = setInterval(() =>{
			const nowStamp = Date.now()
			const overTimeStamp = Date.parse(moment(this.props.overTime, 'YYYY-MM-DD HH:mm:ss').format())
			const seconds = parseInt((overTimeStamp - nowStamp) / 1000)
			if (seconds === 0) {
				this.setState({
					hour: 0,
					minute: 0,
					second: 0
				})
				this.interval&&clearInterval(this.interval);
				this.props.endCounttingCallBack && this.props.endCounttingCallBack()
			};
			const newHour = parseInt(seconds / (60*60))
			const newMinute = parseInt((seconds - newHour * 60 * 60) / 60)

			this.setState({
				hour: isNaN(newHour) ? 0 : newHour,
				minute: isNaN(newMinute) ? 0 : newMinute,
				second: parseInt(seconds % 60)
			})
		},1000)
	}
	render() {
		const {timeItemStyle, containersty } = this.props
		const {hour, minute, second} = this.state
		return (
			<View style={ containersty ? containersty : styles.container }>
				{
					hour < 1 && minute < 1 ?
						<View style={{flex: 1,flexDirection: 'row'}}>
							<View style={[styles.blackBorder,{backgroundColor: '#999'},timeItemStyle]}>
								<Text style={styles.countText}>{second < 0 ? 0 : second}</Text>
							</View>
							<View style={[styles.blackBorder,{borderRadius: 0}]}>
								<Text style={styles.msText}>秒</Text>
							</View>
						</View>
					:
						<View style={{flex: 1,flexDirection: 'row'}}>
							<View style={[styles.blackBorder,{backgroundColor: '#999'},timeItemStyle]}>
								<Text style={styles.countText}>{hour < 0 ? 0 : hour}</Text>
							</View>
							<View style={[styles.blackBorder,{borderRadius: 0}]}>
								<Text style={styles.msText}>时</Text>
							</View>
							<View style={[styles.blackBorder,{backgroundColor: '#999'},timeItemStyle]}>
								<Text style={styles.countText}>{minute < 0 ? 0 : minute}</Text>
							</View>
							<View style={[styles.blackBorder,{borderRadius: 0}]}>
								<Text style={styles.msText}>分</Text>
							</View>
						</View>
				}
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flexDirection: 'row',
		alignItems: 'flex-end'
	},
	blackBorder: {
		width: 20,
		height: 17,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 2
	},
	countText: {
		color: 'white'
	},
	msText: {
		color: COLOR.TEXT_LIGHT
	},
})

export default CountDown

// componentWillReceiveProps(nextProps) {
// 	// console.log("-------- --------------------- ",nextProps.seconds);
// 	// if (nextProps.seconds) {
// 	// 	this.interval&&clearInterval(this.interval);
// 	// 	this.state = {
// 	// 		seconds: nextProps.seconds,
// 	// 		hour: parseInt(nextProps.seconds / (60*60)),
// 	// 		minute: parseInt((nextProps.seconds - parseInt(nextProps.seconds / (60*60)) * 60 * 60) / 60)
// 	// 	}
// 	// 	this._handleCountDown();
// 	// };
// }