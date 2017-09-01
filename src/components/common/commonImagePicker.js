'use strict'

import React, { Component } from 'react';
import {
	View,
	Modal,
	StyleSheet,
	Dimensions,
	Animated,
	Image,
	Text,
	Platform,
	TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import ImagePicker from 'react-native-image-crop-picker'

const { height,width } = Dimensions.get('window')
const animationTime = 200

class CommonImagePicker extends Component{
	constructor(props) {
		super(props);
		const defaultOpacity = this.props.opacity || 0.8
		this.state = {
			defaultOpacity: this.props.opacity || 0.8,
			buttonsViewMarginTop: new Animated.Value(-160),
			opacity: new Animated.Value(0),
			exampleImagePaddingTop: new Animated.Value(0),
			mainBackgroundColor: 'rgba(0,0,0,0.8)',
		}
		this._preCancleAction = this._preCancleAction.bind(this)
	}

	static propTypes = {
	  ...View.style,
	  show: PropTypes.bool.isRequired,
	  cancleAction: PropTypes.func.isRequired,
	  actionBack: PropTypes.func,
	  exampleImageIntroduction: PropTypes.string,
	  opacity: PropTypes.number
	};
	componentDidMount(){
		const configData = {
			width: 400,			//相机宽
			height: 300,		//相机高
			cropping: true,	//是否裁剪相机拍照
			multiple: true,	//相册是否允许多选
			maxFiles: 20		//相册图片最大选取数
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.show) {
			this.setState({mainBackgroundColor: `rgba(0,0,0,${this.state.defaultOpacity})`})
			Animated.parallel([
	      Animated.timing(this.state.buttonsViewMarginTop, {
	        toValue: 0,
	        duration: animationTime
		    }),
		    Animated.timing(this.state.exampleImagePaddingTop, {
	        toValue: 73,
	        duration: animationTime
		    }),
		    Animated.timing(this.state.opacity, {
	        toValue: 1,
	        duration: animationTime
		    })
		   ]).start()
		}
	}

	_preCancleAction(action){
		Animated.parallel([
	    Animated.timing(this.state.buttonsViewMarginTop, {
	      toValue: -160,
	      duration: animationTime
	    }),
	    Animated.timing(this.state.exampleImagePaddingTop, {
        toValue: 0,
        duration: animationTime
	    }),
	    Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: animationTime
	    })
	  ]).start(()=> {
    	this.setState({mainBackgroundColor: 'rgba(0,0,0,0)'})
  		if (action) {action()}
    });
	}

	render() {
		const {show,cancleAction,exampleImage,exampleImageIntroduction,configData={}, type, actionBack} = this.props
		const {buttonsViewMarginTop,mainBackgroundColor, opacity, exampleImagePaddingTop } = this.state
		return (
			<Modal animationType={ "fade" } transparent={true} visible={show} onRequestClose={()=>console.log('resolve warnning')} >
				<Animated.View style={[{flex: 1,backgroundColor: mainBackgroundColor},this.props.style]}>
					<TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={()=>{
						this._preCancleAction(cancleAction)
					}}>
						<Animated.View style={[styles.exampleImage,{opacity}]}>
							{(()=>{
								if (exampleImage) {
									return (
										<Animated.View style={{flex:1,paddingTop: exampleImagePaddingTop,alignItems: 'center'}}>
											<Image source={exampleImage} style={{width:(width < 345 ? width * 0.9 : 345),height:(width < 345 ? 225/345 * width * 0.9 : 225)}} resizeMode={'contain'}/>
											<View><Text style={{color: '#d8d8d8',fontSize: 15,margin: 15}}>{exampleImageIntroduction}</Text></View>
										</Animated.View>
									)
								}
							})()}
						</Animated.View>
						<Animated.View style={[styles.buttonsView,{bottom: buttonsViewMarginTop}]}>
							<Button activeOpacity={0.7} style={styles.buttons}
								textStyle={styles.buttonText}
								onPress={()=>{
									this._preCancleAction()
									ImagePicker.openCamera({
									  cropping: configData.cropping || false
									}).then(image => {
										if (cancleAction) {cancleAction()}
										const targetObj = {
											source: {
												uri: image.path,
												isStatic: true
											},
											type,
											path: Platform.OS === 'android' ? image.path.replace('file://', '') : image.path
										}
										if (actionBack) {
											if (actionBack) actionBack([targetObj]);
										};
									  console.log("---- 调用相机 结果：",image);
									},reject=>{
										console.log("相机 失败",reject);
									}).catch(error => console.log(error) );
								}}>
							 	拍照
							</Button>
							<Button activeOpacity={0.7} style={styles.buttons}
								textStyle={styles.buttonText}
								onPress={()=>{
									this._preCancleAction()
									ImagePicker.openPicker({
										multiple: configData.multiple || false,
										maxFiles: configData.maxFiles || 20,
										mediaType: 'photo',
										loadingLabelText: '加载中...'
									}).then(images => {
										console.log("---- 调用相册 结果：",images);
										if (cancleAction) {cancleAction()}
										let targetImageArr = []
										if (!Array.isArray(images)) {
											targetImageArr = [{
												source: {
													uri: images.path,
													isStatic: true
												},
												type,
												path: Platform.OS === 'android' ? images.path.replace('file://', '') : images.path
											}]
										}else{
											targetImageArr = images.map((item,index)=>{
												const targetObj = {
													source: {
														uri: item.path,
														isStatic: true
													},
													type,
													path: Platform.OS === 'android' ? item.path.replace('file://', '') : item.path
												}
												return targetObj
											})
										}
										if (actionBack && targetImageArr.length > 0) actionBack(targetImageArr)
									}, reject => console.log(reject)).catch(error => console.log(error) );
								}}>
							 	相册
							</Button>
							<View style={{height: 10,width,backgroundColor: COLOR.APP_CONTENT_BACKBG}}></View>
							<Button activeOpacity={0.7} style={styles.buttons}
								textStyle={[styles.buttonText,{color: COLOR.TEXT_BLACK}]}
								onPress={()=>{
									this._preCancleAction(cancleAction)
								}}>
							 	取消
							</Button>
						</Animated.View>
					</TouchableOpacity>
				</Animated.View>
			</Modal>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	exampleImage:{
		width,
		height: height-160,
		backgroundColor: 'rgba(0, 0, 0, 0)'
	},
	buttonsView: {
		height: 160,
		backgroundColor: 'white',//COLOR.APP_CONTENT_BACKBG,
		position: 'absolute',
		width,
		bottom: 0
	},
	buttons: {
		borderWidth: 0,
		height: 50,
		width,
		marginBottom:0,
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR
	},
	buttonText: {
		color: COLOR.APP_THEME,
		fontSize: 15
	}
})

export default CommonImagePicker