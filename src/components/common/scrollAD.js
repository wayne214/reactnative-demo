'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
const { width, height } = Dimensions.get('window')
import * as COLOR from '../../constants/colors'

class ScrollAD extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentW: 0
		};
	}

	componentDidMount(){
		setTimeout(()=>{
			const {contentW} = this.state
			let positionX = 0
			if (this._scrollView) {
				if (contentW <= width - 40 - 20) {
					console.log("  广告内容小于指定的宽度就不滚动");
					return
				};
				this.interval = setInterval(() =>{
					positionX += 2
					if (positionX > contentW - 20) {//20的偏移量
						positionX = 0
					};
					this._scrollView.scrollTo({x:positionX, y:0, animated: (positionX != 0)})
				},100)
			};
		}, 500);

	}

	render() {
		const {content} = this.props
		return (
			<View style={styles.container}>
				<View style={styles.contentView}>
					<ScrollView
						onContentSizeChange={(w,h)=>{
							this.setState({
								contentW: w
							})
						}}
						ref={(ref) => this._scrollView = ref}
						removeClippedSubviews={false}
						horizontal={true}
						showsHorizontalScrollIndicator={false}>
						<Text style={styles.content} adjustsFontSizeToFit={false} numberOfLines={1}>{content}</Text>
					</ScrollView>
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
		height: 40,
		width,
		flexDirection: 'row',
		// backgroundColor: 'yellow',
		justifyContent: 'center',
		alignItems: 'center'
	},
	content: {
		flex: 1,
		color: 'gray'
	},
	contentView:{
		// marginLeft: 10,
		// backgroundColor: 'orange',
		height: 20,
		flex: 1
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
