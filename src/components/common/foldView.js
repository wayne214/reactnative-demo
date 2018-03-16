'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
const { width, height } = Dimensions.get('window')
import * as COLOR from '../../constants/colors'

class FoldView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showHeight: new Animated.Value(0),
			iconRotation: new Animated.Value(0),
			opening: true,
		};
	}

	componentDidMount(){
		const { openHeight } = this.props;
		const { opening } = this.state;
		Animated.parallel([
			Animated.timing(this.state.showHeight, {
				toValue: opening ? 1 : 0,
				duration: 300,
			}),
			Animated.timing(this.state.iconRotation, {
			 	toValue: opening ? 1 : 0,
			 	duration: 300,
			}),
		]).start()
	}

	_headerClick() {
		const { dispatch, openHeight } = this.props;
		const { opening, showHeight, iconRotation } = this.state;
		Animated.parallel([
			Animated.timing(showHeight, {
			 	toValue: opening ? 0 : 1,
			 	duration: 300,
			}),
			Animated.timing(iconRotation, {
				toValue: opening ? 0.5 : 1,
				duration: 90,
			}),
		]).start(
		 	this.setState({
		 		opening: !opening
		 	})
		)
	}
	_viewLayOut(event) {
		const { dispatch, openHeight } = this.props;

	}
	render() {
		const { openHeight, renderContent, title, style } = this.props;
		const itemContent = renderContent ? renderContent() : null
		const { showHeight,iconRotation } = this.state;
		return (
			<View style={[styles.container,style]}>
				<TouchableOpacity activeOpacity={0.8} onPress={()=>{
					this._headerClick()
				}}>
					<View style={styles.topView}>
						<Text>{title}</Text>
						<Animated.Text style={ [styles.arrowIcon, {
							transform: [
								{ rotate: this.state.iconRotation.interpolate({
									inputRange: [0, 1],
									outputRange: ['0deg', '-900deg']
								}) }
							]
						}] }>&#xe69f;</Animated.Text>
					</View>
				</TouchableOpacity>
				<Animated.View removeClippedSubviews={false} style={[styles.contentView,{height: this.state.showHeight.interpolate({
					inputRange: [0,1],
					outputRange: [0, openHeight]
				})}]}>
					{itemContent}
				</Animated.View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1
	},
	topView: {
		height: 44,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: COLOR.APP_CONTENT_BACKBG,
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR
	},
	arrowIcon: {
		fontFamily: 'iconfont',
	},
	contentView: {
		flex: 1,
		backgroundColor: 'white',
		overflow: 'hidden'
	}
})

FoldView.propTypes = {
    title: PropTypes.string.isRequired,
}

export default FoldView



// import React, { Component, PropTypes } from 'react';
// import {
// 	View,
// 	StyleSheet,
// 	Text,
// 	Animated,
// 	TouchableOpacity,
// } from 'react-native';
// import * as COLOR from '../../constants/colors'

// class FoldView extends Component{
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			rotateValue: new Animated.Value(1),
// 			contentHeight: new Animated.Value(1),
// 			opening: true
// 		}
// 	}

// 	static propTypes = {
// 	  style: View.propTypes.style,
// 	};
// 	componentDidMount(){

// 	}

// 	_touchAction(){
// 		const { opening } = this.state
// 		console.log(" ---- opening ? ",opening);
// 		Animated.parallel([
//       Animated.timing(this.state.rotateValue, {
//       	duration: 300,
//       	toValue: opening ? 0 : 1,
//       }),
//       Animated.timing(this.state.contentHeight, {
//       	duration: 300,
//       	toValue: opening ? 0 : 1,
//       })
// 	  ]).start()

// 		this.setState({
// 			opening: !opening
// 		})
// 	}

// 	render() {
// 		const { style,title,renderContent,contentHeight } = this.props
// 		const { opening } = this.state
// 		const content = renderContent ? renderContent() : null
// 		return (
// 			<View style={[styles.container,style]}>
// 				<TouchableOpacity activeOpacity={0.8} onPress={()=>{
// 					this._touchAction()
// 				}}>
// 					<View style={styles.topView}>
// 						<Text>{title}</Text>
// 						<Animated.Text style={ [styles.arrowIcon, {
// 							transform: [
// 								{ rotate: this.state.rotateValue.interpolate({
// 									inputRange: [0, 1],
// 									outputRange: ['0deg', '-180deg']
// 								}) }
// 							]
// 						}] }>&#xe616;</Animated.Text>
// 					</View>
// 				</TouchableOpacity>
// 				<Animated.View style={[styles.contentView,{height: this.state.contentHeight.interpolate({
// 					inputRange: [0,1],
// 					outputRange: [0, contentHeight]
// 				})}]}>
// 					{content}
// 				</Animated.View>
// 			</View>
// 		)
// 	}
// }
// const styles = StyleSheet.create({
// 	container:{
// 		flex: 1
// 	},
// 	topView: {
// 		height: 44,
// 		flex: 1,
// 		flexDirection: 'row',
// 		backgroundColor: COLOR.APP_CONTENT_BACKBG,
// 		justifyContent: 'space-between',
// 		alignItems: 'center',
// 		padding: 10,
// 		borderBottomWidth: 1,
// 		borderBottomColor: COLOR.LINE_COLOR
// 	},
// 	arrowIcon: {
// 		fontFamily: 'iconfont',
// 	},
// 	contentView: {
// 		flex: 1,
// 		backgroundColor: 'orange'
// 	}
// })

// export default FoldView