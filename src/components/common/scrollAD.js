'use strict'

import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    Easing,
    TouchableOpacity,
    InteractionManager,
    ScrollView
} from 'react-native';
const { width, height } = Dimensions.get('window')
import * as COLOR from '../../constants/colors'
const adHeight = 36
const buttonWidth = 39

class ScrollAD extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentW: 0,
			positionX: new Animated.Value(0)
		};
		this._startAimate = this._startAimate.bind(this)
	}
	static propTypes = {
		content: PropTypes.string,
		closeAction: PropTypes.func
	}
	componentDidMount(){
		setTimeout(()=>{
			const {contentW} = this.state
			console.log(" ======== 广告内容宽度 ",contentW);
			if (this._scrollView) {
				if (contentW <= width - buttonWidth * 2) {
					console.log("  广告内容小于指定的宽度就不滚动");
					return
				};
				this._startAimate()
			};
		}, 500);
	}

	_startAimate(){
		const {contentW} = this.state
		InteractionManager.runAfterInteractions(() => {
			Animated.sequence([
				Animated.timing(this.state.positionX, {
	          toValue: (contentW) * -1,
	          duration: parseInt(contentW/40) * 1000,
	          easing: Easing.linear
	      }),
	      Animated.timing(this.state.positionX, {
	          toValue: width - buttonWidth,
	          duration: 0,
	      })
	    ]).start((e)=>{
	    	this._startAimate()
	    })
	  })
	}

	render() {
		const {content, closeAction} = this.props
		const {positionX} = this.state
		return (
			<View style={styles.container}>

				<View style={styles.contentView}>
					<View style={{flex: 1}}>
						<Animated.ScrollView
							style={{marginLeft: positionX,flex: 1,overflow: 'hidden',paddingLeft: buttonWidth}}
							scrollEnabled={false}
							onContentSizeChange={(w,h)=>{
								this.setState({contentW: w})
							}}
							ref={(ref) => this._scrollView = ref}
							removeClippedSubviews={false}
							horizontal={true}
							showsHorizontalScrollIndicator={false}>
							<View style={{justifyContent: 'center',alignItems:'center'}}>
								<Text style={styles.content} adjustsFontSizeToFit={false} numberOfLines={1}>{content}</Text>
							</View>
						</Animated.ScrollView>
					</View>
					<View style={styles.closeButton}>
						<Text style={{fontFamily: 'iconfont',color: '#FFAC1A',padding: 8}} onPress={()=>{
							closeAction && closeAction()
						}}>&#xe638;</Text>
					</View>
				</View>
				<View style={styles.leftButton}>
					<Text style={{fontFamily: 'iconfont',color: '#FFAC1A'}}>&#xe639;</Text>
				</View>

			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		height: adHeight,
		width,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFF8EE'
	},
	content: {
		color: 'gray',
	},
	contentView:{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	closeButton: {
		width: buttonWidth,
		height: adHeight,
		justifyContent: 'center',
		alignItems:'center',
	},
	leftButton:{
		position: 'absolute',
		left: 0,
		width: buttonWidth,
		height: adHeight,
		backgroundColor: '#FFF8EE',
		justifyContent: 'center',
		alignItems: 'center'
	}
})


export default ScrollAD
