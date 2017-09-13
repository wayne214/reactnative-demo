'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    Easing,
    TouchableOpacity,
    ScrollView
} from 'react-native';
const { width, height } = Dimensions.get('window')
import * as COLOR from '../../constants/colors'

class ScrollAD extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentW: 0,
			positionX: new Animated.Value(0)
		};
		this._startAimate = this._startAimate.bind(this)
	}

	componentDidMount(){
		setTimeout(()=>{
			const {contentW} = this.state
			if (this._scrollView) {
				if (contentW <= width - 40 - 20) {
					console.log("  广告内容小于指定的宽度就不滚动");
					return
				};
				this._startAimate()
			};
		}, 500);
	}
	componentWillUnmount(){
		this.interval && clearInterval(this.interval)
	}

	_startAimate(){
		const {contentW} = this.state
		Animated.sequence([
			Animated.timing(this.state.positionX, {
          toValue: (contentW-30) * -1,
          duration: parseInt(contentW/40) * 1000,
          easing: Easing.linear
      }),
      Animated.timing(this.state.positionX, {
          toValue: 20,
          duration: 0,
      })
    ]).start((e)=>{
    	this._startAimate()
    })
	}

	render() {
		const {content} = this.props
		const {positionX} = this.state
		return (
			<View style={styles.container}>
				<View style={styles.contentView}>
					<Animated.ScrollView
						style={{marginLeft: positionX,flex: 1}}
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
					<Text>关闭</Text>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		height: 30,
		width,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	content: {
		color: 'gray',
	},
	contentView:{
		flex: 1,
		justifyContent: 'center'
	},
	closeButton: {
		width: 40,
		height: 30,
		marginLeft: 10,
		marginRight: 10,
		justifyContent: 'center',
		alignItems:'center'
	}
})


export default ScrollAD
