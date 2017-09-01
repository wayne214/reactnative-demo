/*
* @author:  yinyongqian
* @createTime:  2017-08-09, 17:14:24 GMT+0800
* @description:
*
*/

'use strict'

import React, { Component } from 'react';
import {
	View,
	Image,
	Text,
	StyleSheet,
	Modal,
	Dimensions,
	Platform,
	TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import PhotoView from 'react-native-photo-view';
import Swiper from 'react-native-swiper';
import * as COLOR from '../../constants/colors'
const { height,width } = Dimensions.get('window')
// import loadingImage from '../../../assets/img/center_bg.png'

class ImagePreview extends Component{
	constructor(props) {
		super(props);
	}
	static propTypes = {
	  activeIndex: PropTypes.number,
	  imagePathes: PropTypes.array,
	  show: PropTypes.bool,
	  hide: PropTypes.func
	};
	render() {
		const {show,hide,activeIndex,imagePathes} = this.props
		const photoViews = imagePathes.map((item,index)=>{
			// return <Image key={index} source={{uri:(Platform.OS === 'android' ? 'file://' : '') + item }} style={{width,height,flex:1}} resizeMode={'contain'}/>
			// loadingIndicatorSource={{uri:'https://github.com/fluidicon.png'}}
			return (
				<View key={ index } style={{width,height,flex:1}}>
					<PhotoView

						resizeMode={ 'contain'}
					  source={{uri: item }}
					  minimumZoomScale={0.5}
					  maximumZoomScale={3}
					  androidScaleType="fitCenter"
					  onLoad={() => console.log("Image loaded!")}
					  style={{width, height, flex:1}}
					  onTap={() => {
					  	hide && hide()
					  }}/>
				</View>
			);
		})
		return (
			<Modal animationType={ "fade" } transparent={true} visible={show} onRequestClose={()=>console.log('resolve warnning')} >
				<View style={styles.container}>
					<Swiper showsButtons={ false }
						height={ height } loop={ false }
						showsPagination={ true }
						renderPagination={(index, total, context)=>{
							return (
								<View style={{ marginBottom: 10, width,height: 20,justifyContent: 'center',alignItems: 'center'}}>
									<Text style={{color: COLOR.APP_THEME,fontSize: 16}}>{`${index+1}/${total}`}</Text>
								</View>
							)
						}}
						index={activeIndex}
						dotColor={COLOR.APP_CONTENT_BACKBG}
						activeDotColor={COLOR.APP_THEME}
						onMomentumScrollEnd={()=> console.log("-- scroll to end ") }>
						{ photoViews }
					</Swiper>
				</View>
			</Modal>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,1)'
	}
})

export default ImagePreview
