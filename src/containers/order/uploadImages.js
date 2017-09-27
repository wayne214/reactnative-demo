'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Dimensions,
	Image,
	TouchableOpacity,
	StyleSheet,
	Platform,
	NativeModules,
	Modal
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as RouteType from '../../constants/routeType'
import * as COLOR from '../../constants/colors'
import * as API from '../../constants/api'
import {fetchData,refreshTravel} from '../../action/app'
import {changeOrderToStateWithOrderNo,configBillOutImage} from '../../action/order'
import { HOST, OSS_ORDER } from '../../constants/setting';
import { OOS_CONFIG, ADD_COMPANY_AUTH } from '../../constants/api';
import {shouldOrderListRefreshAction} from '../../action/order.js'
import CommonImagePicker from '../../components/common/commonImagePicker'
import upload_add from '../../../assets/img/order/upload_add.png'
import upload_del from '../../../assets/img/order/upload_del.png'
const { height,width } = Dimensions.get('window')
import { dispatchDefaultCar } from '../../action/travel';
import Toast from '../../utils/toast';
import BaseComponent from '../../components/common/baseComponent';
import ImagePreview from '../../components/common/imagePreview.js'
import Button from 'apsl-react-native-button'


class ClassName extends BaseComponent {
	constructor(props) {
	  super(props);
	  this._submit = this._submit.bind(this)
	  this._renderImages = this._renderImages.bind(this)
	  this._updateImages = this._updateImages.bind(this)
	  this._uploadSuccess = this._uploadSuccess.bind(this)
	  this._uploadFailed = this._uploadFailed.bind(this)
	  this._delImageWithIndex = this._delImageWithIndex.bind(this)
	  this._showImageOnScreen = this._showImageOnScreen.bind(this)
	  const {params} = this.props.navigation.state
	  if (!(params && params.orderNo && params.uploadType && params.entrustType)) {
	  	console.warn("参数不够:  orderNo, uploadType, entrustType");
	  };
	  this.data = params.data;
	  this.state = {
	  	orderNo: params.orderNo,
	  	uploadType: params.uploadType,
	  	orderRemark: params.remark,
	  	entrustType: params.entrustType,
	  	images: [
	  		'plus'
	  	],
	  	showImagePicker: false,
	  	loading: false,
	  	shouldShow: false,
	  }
	}
	componentDidMount() {
		this.props.navigation.setParams({submit: this._submit})
	}
	static navigationOptions = ({navigation}) => {
		return {
			header: (
				<NavigatorBar
					router={navigation}
					optTitle={'完成'}
					optTitleStyle={{fontSize: 14,color: COLOR.TEXT_BLACK}}
					firstLevelClick={()=>{
						navigation.state.params.submit()
					}}/>
				)
		}
	}
	_updateImages(result){
		const {images} = this.state
		if (images.length + result.length > 11) {
			console.log("---- 最多10张");
			Toast.show('最多只能上传10张图片')
			return
		};
		const imagePathes = result.map((item,index)=>{
			return item.path
		})
		images.pop()
		const newImages = images.concat(imagePathes)
		if (newImages.length != 10) {
			newImages.push('plus')
		};
		this.setState({
			images: newImages
		})
	}

	_delImageWithIndex(index){
		const {images} = this.state
		images.splice(index,1)
		if (images.length == 9 && images[8] != 'plus') {
			images.push('plus')
		};
		this.setState({
			images
		})
	}
	_showImageOnScreen(index){
		const {images} = this.state
		const path = images[index]

	}

	_renderImages(){
		const box = this.state.images.map((item,index)=>{
			if (item == 'plus') {
				return(
					<TouchableOpacity style={{flex: 1,marginRight: (index % 3 == 2 ? 10 : 15)}} activeOpacity={0.8} key={'plus'}  onPress={()=>{
						this.setState({
							showImagePicker: true
						})
					}}>
						<View key={index} style={[styles.imageView,{justifyContent:'center',alignItems: 'center'}]}>
								<Image source={upload_add} style={{width: 35,height:35}}/>
						</View>
					</TouchableOpacity>
				)
			}else{
				return (
					<View key={index} style={[styles.imageView,{marginRight: (index % 3 == 2 ? 10 : 15)}]}>
						<TouchableOpacity style={{flex:1}} activeOpacity={0.8} key={'image' + index}  onPress={()=>{
							// this._showImageOnScreen(index)
							this.setState({
								shouldShow: true,
								activeIndex: index
							})
						}}>
							<Image source={{uri: (Platform.OS === 'android' ? 'file://' : '') + item}} style={{flex: 1,resizeMode: 'cover'}}/>
						</TouchableOpacity>
						<TouchableOpacity style={{position: 'absolute',right: 0,paddingLeft: 5,paddingBottom: 5}} activeOpacity={0.8} key={'del'+index}  onPress={()=>{
							this._delImageWithIndex(index)
						}}>
							<Image source={upload_del}/>
						</TouchableOpacity>
					</View>
				)
			}
		})
		return box
	}

	_uploadSuccess(type,imagesString){
		const {orderNo} = this.state
		console.log("===上传成功回调 = type",type);
		this.setState({
			loading: false
		})
		// switch(type){
		// 	case 'UPLOAD_BILL_OUT_IMAGE':
		// 		// 'billOutImg'
		// 		console.log("---上传出库单 成功 orderNo ",orderNo);
		// 		// this.props.dispatch(changeOrderToStateWithOrderNo(3,orderNo,'orderToInstall'))
		// 		this.props.dispatch(configBillOutImage(orderNo,imagesString))
		// 		break
		// 	case 'UPLOAD_ENVIRONMENT_IMAGES':
		// 		// 'environmentImg'
		// 		console.log("------ 上传环境照片 成功。orderNo ",orderNo);
		// 		// this.props.dispatch(changeOrderToStateWithOrderNo(6,orderNo,'orderToDelivery'))
		// 		break
		// 	case 'UPLOAD_BILL_BACK_IMAGE':
		// 		// 'billBackImg'
		// 		console.log("------ 上传回单 成功。。orderNo ",orderNo);
		// 		// this.props.dispatch(changeOrderToStateWithOrderNo(7,orderNo,'orderToDelivery'))
		// 		break
		// 	default:
		// 		apiStr = ''
		// }
		this.props.navigation.dispatch({ type: 'Main', mode: 'reset', params: { title: '', currentTab: 'order' } })
		// this.props.dispatch(shouldOrderListRefreshAction(true))
	}

	_uploadFailed(msg){
		this.setState({
			loading: false
		})
		if (msg) {
			Toast.show(msg);
		}else{
			Toast.show('上传失败，请重新上传');
		}
	}

	_submit(){
		const {images,orderNo,orderRemark,uploadType,entrustType} = this.state
		const plusIndex = images.indexOf('plus')
		const newImages = images.slice()
		if (plusIndex == 0) {
			// console.warn("未添加请添加照片");
			Toast.show('未添加任何照片');
			return;
		}else if (plusIndex != -1) {
			newImages.splice(plusIndex,1)
		}
		console.log(" ===== new image list ",newImages);
		this.setState({
			loading: true
		})
		this.props._uploadImages({uploadType,images:newImages,orderNo,orderRemark,carId: this.props.user.carId ? this.props.user.carId : '',entrustType},this._uploadSuccess,this._uploadFailed, this.data);
	}

	render() {
		const {images,showImagePicker,shouldShow,activeIndex} = this.state
		const tmpArr = images.concat()
		tmpArr.includes('plus') && tmpArr.pop()
		const imagePathes = tmpArr.map((item,index)=>{
			return (Platform.OS === 'android' ? 'file://' : '') + item
		})
		return <View style={styles.container}>
			{/**/}
			<View style={styles.viewContent}>
				{this._renderImages()}
			</View>
			<CommonImagePicker
				show={showImagePicker}
				configData={{maxFiles: 10,multiple: true}}
				actionBack={(result) =>{
					this._updateImages(result)
					console.log("====== images ",result);
				}}
				cancleAction={()=>{
					this.setState({showImagePicker: false})
				}}/>
			<ImagePreview
				activeIndex={activeIndex}
				imagePathes={imagePathes}
				show={shouldShow}
				hide={()=>{
					this.setState({
						shouldShow: false
					})
				}}/>
			{ this.state.loading ? this._renderLoadingView() : null }
		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	imageView: {
		width: parseInt((width - 20 - 30)/3),
		height: parseInt((width - 20 - 30)/3*0.75),
		backgroundColor: 'white',
		marginTop: 15
	},
	viewContent: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		flexWrap:'wrap',
		paddingLeft: 10,
		paddingBottom: 15
	},
})

const mapStateToProps = (state) => {
	const { app } = state;
	return {
		user: app.get('user'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		_uploadImages: (configData,successCallBack, failCallBack, travelData)=>{
			const {uploadType,images,orderNo,orderRemark,entrustType} = configData
			let apiStr = ''
			let imageParamsKey = ''
			console.log("===== api ",apiStr);

			switch(uploadType){
				case 'UPLOAD_BILL_OUT_IMAGE':
					apiStr = API.UPLOAD_BILL_OUT_IMAGE
					imageParamsKey = 'billOutImg'
					console.log("---上传出库单  orderNo ",orderNo);
					break
				case 'UPLOAD_ENVIRONMENT_IMAGES':
					apiStr = API.CONFIRM_ARRIVEL
					imageParamsKey = 'environmentImg'
					console.log("------ 上传环境照片。orderNo ",orderNo);

					break
				case 'UPLOAD_BILL_BACK_IMAGE':
					apiStr = API.CONFIRM_DELIVERY
					imageParamsKey = 'billBackImg'
					console.log("------ 上传回单。。orderNo ",orderNo);
					break
				default:
					apiStr = ''
			}
			const promise = new Promise((resolve,reject)=>{
				const ossImgPathes = []
				for (let i = images.length - 1; i >= 0; i--) {
					const url = HOST + OOS_CONFIG + OSS_ORDER;
					console.log("------ url",url);
					fetch(url)
						.then(response => response.json())
						.then(responseJson => {
							NativeModules.OssModule.init(images[i], responseJson.dir + '.png', responseJson.bucket, url, '')
								.then(()=>{
									ossImgPathes.push(responseJson.dir + '.png')
									console.log("----responseJson.dir-- ",responseJson.dir);
									if (ossImgPathes.length == images.length) {
										resolve(ossImgPathes)
									};
								}).catch(e => {
									reject(e)
									console.log(e)
								});
						})
						.catch(e => {
							reject(e)
							console.log(e)
						});
				};
			}).then((newImages)=>{
				console.log('=all images name ====',newImages.join(','));
				const body = {orderNo,carId: configData.carId}
				body[imageParamsKey] = newImages.join(',')
				if (uploadType == 'UPLOAD_BILL_BACK_IMAGE') {
					body.orderRemark = orderRemark
				};
				body.entrustType = entrustType
				dispatch(fetchData({
					api: apiStr,
					method: 'POST',
					body,
					failToast: false,
					success: ()=>{
						console.log("------ 多图上传成功。。。。。。",);
						Toast.show('上传成功！')
						if (successCallBack) {successCallBack(uploadType,newImages.join(','))};
						// if (travelData) dispatch(dispatchDefaultCar(travelData));
						dispatch(refreshTravel());
					},
					fail: (error)=>{
						if (failCallBack) {failCallBack(error.msg)}
					}
				}))
			}).catch(function(error){
			    console.error(error);
			    if (failCallBack) {failCallBack()}
			});
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassName);
